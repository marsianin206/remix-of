'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Trash2, Copy, ZoomIn, ZoomOut, Grid3x3, Ruler, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export interface ResponsiveStyles {
  desktop?: React.CSSProperties;
  tablet?: React.CSSProperties;
  mobile?: React.CSSProperties;
}

export interface CanvasElement {
  id: string;
  componentId: string;
  html: string;
  props: Record<string, any>;
  styles: React.CSSProperties;
  responsiveStyles?: ResponsiveStyles;
  position: { x: number; y: number };
}

interface BuilderCanvasProps {
  elements: CanvasElement[];
  onElementAdd: (element: CanvasElement) => void;
  onElementUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onElementDelete: (id: string) => void;
  onElementSelect: (id: string | null) => void;
  selectedElementId: string | null;
  onMultiSelect?: (ids: string[]) => void;
}

export default function BuilderCanvas({
  elements,
  onElementAdd,
  onElementUpdate,
  onElementDelete,
  onElementSelect,
  selectedElementId,
  onMultiSelect
}: BuilderCanvasProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [guides, setGuides] = useState<{ vertical: number[]; horizontal: number[] }>({ vertical: [], horizontal: [] });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData('component');
    if (componentData) {
      const component = JSON.parse(componentData);
      const newElement: CanvasElement = {
        id: `element-${Date.now()}`,
        componentId: component.id,
        html: component.html,
        props: { ...component.defaultProps },
        styles: {},
        responsiveStyles: component.responsiveStyles,
        position: { x: 0, y: elements.length * 100 }
      };
      onElementAdd(newElement);
    }
    setDragOverIndex(null);
  }, [elements.length, onElementAdd]);

  const renderElement = (html: string, props: Record<string, any>) => {
    let rendered = html;
    Object.entries(props).forEach(([key, value]) => {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value || ''));
    });
    return rendered;
  };

  const duplicateElement = (element: CanvasElement) => {
    const newElement: CanvasElement = {
      ...element,
      id: `element-${Date.now()}`,
      position: { ...element.position, y: element.position.y + 50 }
    };
    onElementAdd(newElement);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 25));
  const handleZoomReset = () => setZoom(100);

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt+Left click
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    } else if (e.button === 0 && !e.altKey && e.target === e.currentTarget) {
      // Start selection box
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setSelectionStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    } else if (selectionStart) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        setSelectionBox({
          x: Math.min(selectionStart.x, currentX),
          y: Math.min(selectionStart.y, currentY),
          width: Math.abs(currentX - selectionStart.x),
          height: Math.abs(currentY - selectionStart.y)
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    if (selectionBox) {
      // Select elements within selection box
      // This is a simplified version - you'd need to calculate actual element bounds
      setSelectionBox(null);
    }
    setSelectionStart(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Zoom shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        handleZoomReset();
      }
      // Grid toggle
      else if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        setShowGrid(prev => !prev);
      }
      // Ruler toggle
      else if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        setShowRulers(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom]);

  const snapToGridValue = (value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-hidden relative flex flex-col">
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-10 bg-background border border-border rounded-lg shadow-lg p-2 space-y-2">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={handleZoomOut} title="Zoom Out (Ctrl+-)">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium w-12 text-center">{zoom}%</span>
          <Button size="sm" variant="ghost" onClick={handleZoomIn} title="Zoom In (Ctrl++)">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleZoomReset} title="Reset Zoom (Ctrl+0)">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-1.5 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Switch id="grid" checked={showGrid} onCheckedChange={setShowGrid} />
            <Label htmlFor="grid" className="text-xs cursor-pointer flex items-center gap-1">
              <Grid3x3 className="w-3 h-3" />
              Grid (G)
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch id="rulers" checked={showRulers} onCheckedChange={setShowRulers} />
            <Label htmlFor="rulers" className="text-xs cursor-pointer flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              Rulers (R)
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch id="snap" checked={snapToGrid} onCheckedChange={setSnapToGrid} />
            <Label htmlFor="snap" className="text-xs cursor-pointer">
              Snap to Grid
            </Label>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Label className="text-xs mb-2 block">Grid Size: {gridSize}px</Label>
          <Slider
            value={[gridSize]}
            onValueChange={([value]) => setGridSize(value)}
            min={10}
            max={50}
            step={5}
            className="w-32"
          />
        </div>
      </div>

      {/* Rulers */}
      {showRulers && (
        <>
          {/* Horizontal Ruler */}
          <div className="h-6 bg-background border-b border-border flex items-center relative overflow-hidden">
            <div className="absolute inset-0 flex" style={{ transform: `translateX(${pan.x}px)` }}>
              {Array.from({ length: 200 }).map((_, i) => {
                const pos = i * 50;
                return (
                  <div key={i} className="relative" style={{ width: '50px' }}>
                    <div className="absolute left-0 top-0 h-2 w-px bg-border" />
                    <span className="absolute left-1 top-0 text-[9px] text-muted-foreground">{pos}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vertical Ruler */}
          <div className="absolute left-0 top-6 bottom-0 w-6 bg-background border-r border-border overflow-hidden z-10">
            <div className="absolute inset-0" style={{ transform: `translateY(${pan.y}px)` }}>
              {Array.from({ length: 200 }).map((_, i) => {
                const pos = i * 50;
                return (
                  <div key={i} className="relative" style={{ height: '50px' }}>
                    <div className="absolute left-0 top-0 w-2 h-px bg-border" />
                    <span className="absolute left-0.5 top-1 text-[9px] text-muted-foreground writing-mode-vertical-rl transform rotate-180">{pos}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className={`flex-1 overflow-auto p-8 relative ${isPanning ? 'cursor-grab' : 'cursor-default'}`}
        style={{ 
          marginLeft: showRulers ? '24px' : '0',
          marginTop: showRulers ? '0' : '0'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div 
          className="relative mx-auto"
          style={{ 
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
            transformOrigin: 'top left',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <div 
            className="max-w-[1200px] mx-auto bg-white dark:bg-gray-800 min-h-[800px] shadow-2xl rounded-lg relative"
            style={{
              backgroundImage: showGrid 
                ? `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                   linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`
                : 'none',
              backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : 'auto'
            }}
            onClick={() => onElementSelect(null)}
          >
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 pointer-events-none">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-xl font-medium">Перетащите компоненты сюда</p>
                  <p className="text-sm mt-2">Выберите компонент из библиотеки слева</p>
                </div>
              </div>
            )}
            
            {elements.map((element) => (
              <div
                key={element.id}
                className={`relative group transition-all duration-200 ${
                  selectedElementId === element.id 
                    ? 'ring-2 ring-blue-500 ring-offset-2' 
                    : 'hover:ring-2 hover:ring-gray-300'
                }`}
                style={element.styles}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.shiftKey) {
                    setSelectedElements(prev => 
                      prev.includes(element.id) 
                        ? prev.filter(id => id !== element.id)
                        : [...prev, element.id]
                    );
                  } else {
                    onElementSelect(element.id);
                    setSelectedElements([]);
                  }
                }}
              >
                <div 
                  dangerouslySetInnerHTML={{ __html: renderElement(element.html, element.props) }}
                  className="pointer-events-none"
                />
                
                {/* Element Controls */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white dark:bg-gray-800 rounded-md shadow-lg p-1 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateElement(element);
                    }}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Дублировать (Ctrl+D)"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onElementDelete(element.id);
                    }}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded"
                    title="Удалить (Delete)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Selection indicator for multi-select */}
                {selectedElements.includes(element.id) && (
                  <div className="absolute inset-0 ring-2 ring-purple-500 ring-offset-2 pointer-events-none" />
                )}
              </div>
            ))}

            {/* Guide lines */}
            {guides.vertical.map((x, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 w-px bg-blue-500"
                style={{ left: `${x}px` }}
              />
            ))}
            {guides.horizontal.map((y, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 h-px bg-blue-500"
                style={{ top: `${y}px` }}
              />
            ))}
          </div>
        </div>

        {/* Selection Box */}
        {selectionBox && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
            style={{
              left: selectionBox.x,
              top: selectionBox.y,
              width: selectionBox.width,
              height: selectionBox.height
            }}
          />
        )}
      </div>

      {/* Help Text */}
      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur border border-border rounded-lg p-3 text-xs space-y-1 shadow-lg">
        <div className="font-semibold mb-2">Горячие клавиши:</div>
        <div className="space-y-0.5 text-muted-foreground">
          <div><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">G</kbd> - Сетка</div>
          <div><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">R</kbd> - Линейки</div>
          <div><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">+/-</kbd> - Zoom</div>
          <div><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Alt</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Drag</kbd> - Pan</div>
          <div><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Click</kbd> - Выбор нескольких</div>
        </div>
      </div>
    </div>
  );
}