'use client';

import React, { useState, useCallback } from 'react';
import BuilderCanvas, { CanvasElement } from '@/components/builder/BuilderCanvas';
import ComponentLibrary from '@/components/builder/ComponentLibrary';
import PropertiesPanel from '@/components/builder/PropertiesPanel';
import BuilderToolbar from '@/components/builder/BuilderToolbar';
import LayersPanel from '@/components/builder/LayersPanel';
import ElementToolbar from '@/components/builder/ElementToolbar';
import PagesPanel, { Page } from '@/components/builder/PagesPanel';
import GlobalStylesPanel, { GlobalStyles } from '@/components/builder/GlobalStylesPanel';
import { exportProject, saveProject } from '@/lib/export-utils';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default function Home() {
  // Pages state
  const [pages, setPages] = useState<Page[]>([
    { id: 'page-1', name: 'Главная', path: '/', isHomePage: true }
  ]);
  const [currentPageId, setCurrentPageId] = useState<string>('page-1');
  
  // Elements per page
  const [pageElements, setPageElements] = useState<{ [pageId: string]: CanvasElement[] }>({
    'page-1': []
  });
  
  // Global styles
  const [globalStyles, setGlobalStyles] = useState<GlobalStyles>({
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#10b981',
      background: '#ffffff',
      text: '#1f2937',
      muted: '#6b7280'
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      baseFontSize: '16px',
      headingFontFamily: 'inherit',
      lineHeight: '1.6'
    },
    spacing: {
      baseUnit: '8px'
    }
  });
  
  // UI state
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [history, setHistory] = useState<{ [pageId: string]: CanvasElement[][] }>({
    'page-1': [[]]
  });
  const [historyIndex, setHistoryIndex] = useState<{ [pageId: string]: number }>({
    'page-1': 0
  });
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showLayers, setShowLayers] = useState(true);
  const [showGlobalStyles, setShowGlobalStyles] = useState(false);
  const [groups, setGroups] = useState<{ [key: string]: string[] }>({});

  // Get current page elements
  const elements = pageElements[currentPageId] || [];
  const pageHistory = history[currentPageId] || [[]];
  const pageHistoryIndex = historyIndex[currentPageId] || 0;

  const addToHistory = useCallback((newElements: CanvasElement[], pageId: string) => {
    const currentHistory = history[pageId] || [[]];
    const currentIndex = historyIndex[pageId] || 0;
    const newHistory = currentHistory.slice(0, currentIndex + 1);
    newHistory.push(newElements);
    setHistory(prev => ({ ...prev, [pageId]: newHistory }));
    setHistoryIndex(prev => ({ ...prev, [pageId]: newHistory.length - 1 }));
  }, [history, historyIndex]);

  const handleElementAdd = useCallback((element: CanvasElement) => {
    const newElements = [...elements, element];
    setPageElements(prev => ({ ...prev, [currentPageId]: newElements }));
    addToHistory(newElements, currentPageId);
    toast.success('Компонент добавлен на canvas');
  }, [elements, currentPageId, addToHistory]);

  const handleElementUpdate = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setPageElements(prev => ({ ...prev, [currentPageId]: newElements }));
    addToHistory(newElements, currentPageId);
  }, [elements, currentPageId, addToHistory]);

  const handleElementDelete = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setPageElements(prev => ({ ...prev, [currentPageId]: newElements }));
    addToHistory(newElements, currentPageId);
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
    setSelectedElementIds(prev => prev.filter(eid => eid !== id));
    toast.success('Элемент удален');
  }, [elements, selectedElementId, currentPageId, addToHistory]);

  const handleUndo = useCallback(() => {
    if (pageHistoryIndex > 0) {
      const newIndex = pageHistoryIndex - 1;
      setHistoryIndex(prev => ({ ...prev, [currentPageId]: newIndex }));
      setPageElements(prev => ({ ...prev, [currentPageId]: pageHistory[newIndex] }));
      toast.info('Отменено');
    }
  }, [pageHistory, pageHistoryIndex, currentPageId]);

  const handleRedo = useCallback(() => {
    if (pageHistoryIndex < pageHistory.length - 1) {
      const newIndex = pageHistoryIndex + 1;
      setHistoryIndex(prev => ({ ...prev, [currentPageId]: newIndex }));
      setPageElements(prev => ({ ...prev, [currentPageId]: pageHistory[newIndex] }));
      toast.info('Повторено');
    }
  }, [pageHistory, pageHistoryIndex, currentPageId]);

  // Page management
  const handlePageAdd = useCallback((page: Page) => {
    setPages(prev => [...prev, page]);
    setPageElements(prev => ({ ...prev, [page.id]: [] }));
    setHistory(prev => ({ ...prev, [page.id]: [[]] }));
    setHistoryIndex(prev => ({ ...prev, [page.id]: 0 }));
    setCurrentPageId(page.id);
  }, []);

  const handlePageUpdate = useCallback((pageId: string, updates: Partial<Page>) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, ...updates } : p));
  }, []);

  const handlePageDelete = useCallback((pageId: string) => {
    setPages(prev => prev.filter(p => p.id !== pageId));
    setPageElements(prev => {
      const newElements = { ...prev };
      delete newElements[pageId];
      return newElements;
    });
    setHistory(prev => {
      const newHistory = { ...prev };
      delete newHistory[pageId];
      return newHistory;
    });
    setHistoryIndex(prev => {
      const newIndex = { ...prev };
      delete newIndex[pageId];
      return newIndex;
    });
  }, []);

  const handlePageChange = useCallback((pageId: string) => {
    setCurrentPageId(pageId);
    setSelectedElementId(null);
    setSelectedElementIds([]);
  }, []);

  // Element management functions
  const handleAlign = useCallback((type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const idsToAlign = selectedElementIds.length > 0 ? selectedElementIds : selectedElementId ? [selectedElementId] : [];
    if (idsToAlign.length < 2) return;

    const selectedEls = elements.filter(el => idsToAlign.includes(el.id));
    
    const bounds = selectedEls.map(el => {
      const rect = document.getElementById(el.id)?.getBoundingClientRect();
      return rect || { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
    });

    let reference = 0;
    switch (type) {
      case 'left':
        reference = Math.min(...bounds.map(b => b.left));
        break;
      case 'center':
        reference = (Math.min(...bounds.map(b => b.left)) + Math.max(...bounds.map(b => b.right))) / 2;
        break;
      case 'right':
        reference = Math.max(...bounds.map(b => b.right));
        break;
      case 'top':
        reference = Math.min(...bounds.map(b => b.top));
        break;
      case 'middle':
        reference = (Math.min(...bounds.map(b => b.top)) + Math.max(...bounds.map(b => b.bottom))) / 2;
        break;
      case 'bottom':
        reference = Math.max(...bounds.map(b => b.bottom));
        break;
    }

    const newElements = elements.map(el => {
      if (!idsToAlign.includes(el.id)) return el;
      
      const newStyles = { ...el.styles };
      if (type === 'left' || type === 'center' || type === 'right') {
        newStyles.marginLeft = type === 'left' ? '0' : type === 'center' ? 'auto' : 'auto';
        newStyles.marginRight = type === 'right' ? '0' : type === 'center' ? 'auto' : 'auto';
      } else {
        newStyles.verticalAlign = type;
      }
      
      return { ...el, styles: newStyles };
    });

    setPageElements(prev => ({ ...prev, [currentPageId]: newElements }));
    addToHistory(newElements, currentPageId);
    toast.success(`Выровнено: ${type}`);
  }, [elements, selectedElementId, selectedElementIds, currentPageId, addToHistory]);

  const handleDistribute = useCallback((type: 'horizontal' | 'vertical') => {
    const idsToDistribute = selectedElementIds.length > 0 ? selectedElementIds : [];
    if (idsToDistribute.length < 3) return;
    toast.success(`Распределено: ${type}`);
  }, [selectedElementIds]);

  const handleGroup = useCallback(() => {
    const idsToGroup = selectedElementIds.length > 0 ? selectedElementIds : selectedElementId ? [selectedElementId] : [];
    if (idsToGroup.length < 2) return;

    const groupId = `group-${Date.now()}`;
    setGroups(prev => ({ ...prev, [groupId]: idsToGroup }));
    toast.success('Элементы сгруппированы');
  }, [selectedElementId, selectedElementIds]);

  const handleUngroup = useCallback(() => {
    const groupToUngroup = Object.entries(groups).find(([_, ids]) => 
      selectedElementIds.some(id => ids.includes(id))
    );
    
    if (groupToUngroup) {
      const [groupId] = groupToUngroup;
      setGroups(prev => {
        const newGroups = { ...prev };
        delete newGroups[groupId];
        return newGroups;
      });
      toast.success('Группа разделена');
    }
  }, [groups, selectedElementIds]);

  const handleBringToFront = useCallback(() => {
    const idsToMove = selectedElementIds.length > 0 ? selectedElementIds : selectedElementId ? [selectedElementId] : [];
    if (idsToMove.length === 0) return;

    const newElements = elements.map(el => {
      if (idsToMove.includes(el.id)) {
        return { ...el, styles: { ...el.styles, zIndex: 9999 } };
      }
      return el;
    });

    setPageElements(prev => ({ ...prev, [currentPageId]: newElements }));
    addToHistory(newElements, currentPageId);
    toast.success('Перемещено на передний план');
  }, [elements, selectedElementId, selectedElementIds, currentPageId, addToHistory]);

  const handleSendToBack = useCallback(() => {
    const idsToMove = selectedElementIds.length > 0 ? selectedElementIds : selectedElementId ? [selectedElementId] : [];
    if (idsToMove.length === 0) return;

    const newElements = elements.map(el => {
      if (idsToMove.includes(el.id)) {
        return { ...el, styles: { ...el.styles, zIndex: 0 } };
      }
      return el;
    });

    setPageElements(prev => ({ ...prev, [currentPageId]: newElements }));
    addToHistory(newElements, currentPageId);
    toast.success('Перемещено на задний план');
  }, [elements, selectedElementId, selectedElementIds, currentPageId, addToHistory]);

  const handleBringForward = useCallback(() => {
    const idsToMove = selectedElementIds.length > 0 ? selectedElementIds : selectedElementId ? [selectedElementId] : [];
    if (idsToMove.length === 0) return;

    const newElements = elements.map(el => {
      if (idsToMove.includes(el.id)) {
        const currentZ = parseInt(String(el.styles?.zIndex || 0));
        return { ...el, styles: { ...el.styles, zIndex: currentZ + 1 } };
      }
      return el;
    });

    setPageElements(prev => ({ ...prev, [currentPageId]: newElements }));
    addToHistory(newElements, currentPageId);
    toast.success('Перемещено вперёд');
  }, [elements, selectedElementId, selectedElementIds, currentPageId, addToHistory]);

  const handleSendBackward = useCallback(() => {
    const idsToMove = selectedElementIds.length > 0 ? selectedElementIds : selectedElementId ? [selectedElementId] : [];
    if (idsToMove.length === 0) return;

    const newElements = elements.map(el => {
      if (idsToMove.includes(el.id)) {
        const currentZ = parseInt(String(el.styles?.zIndex || 0));
        return { ...el, styles: { ...el.styles, zIndex: Math.max(0, currentZ - 1) } };
      }
      return el;
    });

    setPageElements(prev => ({ ...prev, [currentPageId]: newElements }));
    addToHistory(newElements, currentPageId);
    toast.success('Перемещено назад');
  }, [elements, selectedElementId, selectedElementIds, currentPageId, addToHistory]);

  const handleFlip = useCallback((direction: 'horizontal' | 'vertical') => {
    const idsToFlip = selectedElementIds.length > 0 ? selectedElementIds : selectedElementId ? [selectedElementId] : [];
    if (idsToFlip.length === 0) return;

    const newElements = elements.map(el => {
      if (idsToFlip.includes(el.id)) {
        const currentTransform = String(el.styles?.transform || '');
        const scaleX = direction === 'horizontal' ? 'scaleX(-1)' : 'scaleX(1)';
        const scaleY = direction === 'vertical' ? 'scaleY(-1)' : 'scaleY(1)';
        const newTransform = direction === 'horizontal' ? scaleX : scaleY;
        
        return { ...el, styles: { ...el.styles, transform: newTransform } };
      }
      return el;
    });

    setPageElements(prev => ({ ...prev, [currentPageId]: newElements }));
    addToHistory(newElements, currentPageId);
    toast.success(`Отражено: ${direction === 'horizontal' ? 'горизонтально' : 'вертикально'}`);
  }, [elements, selectedElementId, selectedElementIds, currentPageId, addToHistory]);

  const handleRotate = useCallback((angle: number) => {
    const idsToRotate = selectedElementIds.length > 0 ? selectedElementIds : selectedElementId ? [selectedElementId] : [];
    if (idsToRotate.length === 0) return;

    const newElements = elements.map(el => {
      if (idsToRotate.includes(el.id)) {
        const currentTransform = String(el.styles?.transform || '');
        const currentRotation = parseInt(currentTransform.match(/rotate\((-?\d+)deg\)/)?.[1] || '0');
        const newRotation = currentRotation + angle;
        
        return { ...el, styles: { ...el.styles, transform: `rotate(${newRotation}deg)` } };
      }
      return el;
    });

    setPageElements(prev => ({ ...prev, [currentPageId]: newElements }));
    addToHistory(newElements, currentPageId);
    toast.success(`Повёрнуто на ${angle}°`);
  }, [elements, selectedElementId, selectedElementIds, currentPageId, addToHistory]);

  const handleSave = useCallback(() => {
    saveProject(elements, 'my-website');
    toast.success('Проект сохранен!');
  }, [elements]);

  const handleExport = useCallback(() => {
    exportProject(elements, 'my-website');
    toast.success('Файлы экспортированы! Проверьте загрузки.');
  }, [elements]);

  const handlePreview = useCallback(() => {
    toast.info('Открытие предпросмотра...');
  }, []);

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;

  const canvasWidth = 
    viewMode === 'mobile' ? '375px' : 
    viewMode === 'tablet' ? '768px' : 
    '100%';

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="h-screen flex flex-col bg-background text-foreground">
        <BuilderToolbar
          onSave={handleSave}
          onExport={handleExport}
          onPreview={handlePreview}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={pageHistoryIndex > 0}
          canRedo={pageHistoryIndex < pageHistory.length - 1}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          theme={theme}
          onThemeChange={setTheme}
        />

        <div className="flex-1 flex overflow-hidden relative">
          <PagesPanel
            pages={pages}
            currentPageId={currentPageId}
            onPageChange={handlePageChange}
            onPageAdd={handlePageAdd}
            onPageUpdate={handlePageUpdate}
            onPageDelete={handlePageDelete}
          />
          
          <ComponentLibrary />
          
          {showLayers && (
            <LayersPanel
              elements={elements}
              selectedElementId={selectedElementId}
              onElementSelect={setSelectedElementId}
              onElementDelete={handleElementDelete}
            />
          )}

          <div className="flex-1 flex justify-center relative" style={{ maxWidth: canvasWidth, margin: '0 auto', transition: 'max-width 0.3s' }}>
            <ElementToolbar
              selectedElementIds={selectedElementIds.length > 0 ? selectedElementIds : selectedElementId ? [selectedElementId] : []}
              onAlign={handleAlign}
              onDistribute={handleDistribute}
              onGroup={handleGroup}
              onUngroup={handleUngroup}
              onBringToFront={handleBringToFront}
              onSendToBack={handleSendToBack}
              onBringForward={handleBringForward}
              onSendBackward={handleSendBackward}
              onFlip={handleFlip}
              onRotate={handleRotate}
            />
            
            <BuilderCanvas
              elements={elements}
              onElementAdd={handleElementAdd}
              onElementUpdate={handleElementUpdate}
              onElementDelete={handleElementDelete}
              onElementSelect={(id) => {
                setSelectedElementId(id);
                setSelectedElementIds([]);
              }}
              selectedElementId={selectedElementId}
              onMultiSelect={setSelectedElementIds}
            />
          </div>

          {showGlobalStyles ? (
            <GlobalStylesPanel
              globalStyles={globalStyles}
              onUpdate={setGlobalStyles}
            />
          ) : (
            <PropertiesPanel
              selectedElement={selectedElement}
              onUpdate={(updates) => {
                if (selectedElementId) {
                  handleElementUpdate(selectedElementId, updates);
                }
              }}
            />
          )}

          {/* Global Styles Toggle */}
          <Button
            size="sm"
            variant={showGlobalStyles ? 'default' : 'outline'}
            className="absolute bottom-4 right-4 z-10"
            onClick={() => setShowGlobalStyles(!showGlobalStyles)}
            title="Глобальные стили"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showGlobalStyles ? 'Свойства элемента' : 'Глобальные стили'}
          </Button>
        </div>

        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}