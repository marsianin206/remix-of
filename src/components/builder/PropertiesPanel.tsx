'use client';

import React, { useState } from 'react';
import { CanvasElement } from './BuilderCanvas';
import { getComponentById } from '@/lib/component-library';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Type, Palette, Box, Sparkles, Move, Layers as LayersIcon,
  ChevronDown, ChevronUp, Plus, Trash2, Monitor, Tablet, Smartphone
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onUpdate: (updates: Partial<CanvasElement>) => void;
}

type Breakpoint = 'desktop' | 'tablet' | 'mobile';

export default function PropertiesPanel({ selectedElement, onUpdate }: PropertiesPanelProps) {
  const [openSections, setOpenSections] = useState({
    content: true,
    layout: true,
    typography: true,
    colors: true,
    borders: true,
    shadows: true,
    effects: true,
    transform: true
  });
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('desktop');

  if (!selectedElement) {
    return (
      <div className="w-80 border-l border-border bg-background p-4">
        <div className="text-center text-muted-foreground py-12">
          <div className="text-4xl mb-3">🎨</div>
          <p className="text-sm">Выберите элемент для редактирования</p>
        </div>
      </div>
    );
  }

  const component = getComponentById(selectedElement.componentId);
  if (!component) return null;

  const handlePropChange = (propName: string, value: any) => {
    onUpdate({
      props: {
        ...selectedElement.props,
        [propName]: value
      }
    });
  };

  const handleStyleChange = (styleName: string, value: any, breakpoint?: Breakpoint) => {
    if (breakpoint && breakpoint !== 'desktop') {
      // Update responsive styles
      const responsiveStyles = { ...selectedElement.responsiveStyles };
      responsiveStyles[breakpoint] = {
        ...responsiveStyles[breakpoint],
        [styleName]: value
      };
      onUpdate({ responsiveStyles });
    } else {
      // Update desktop/base styles
      onUpdate({
        styles: {
          ...selectedElement.styles,
          [styleName]: value
        }
      });
    }
  };

  const getCurrentStyles = (breakpoint: Breakpoint): React.CSSProperties => {
    if (breakpoint === 'desktop') {
      return selectedElement.styles;
    }
    return {
      ...selectedElement.styles,
      ...(selectedElement.responsiveStyles?.[breakpoint] || {})
    };
  };

  const currentStyles = getCurrentStyles(currentBreakpoint);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SectionHeader = ({ title, icon: Icon, section }: { title: string; icon: any; section: keyof typeof openSections }) => (
    <CollapsibleTrigger asChild>
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        {openSections[section] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    </CollapsibleTrigger>
  );

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold">Свойства</h2>
        <p className="text-sm text-muted-foreground mt-1">{component.name}</p>
      </div>

      {/* Breakpoint Selector */}
      <div className="p-4 border-b border-border bg-muted/30">
        <Label className="text-xs mb-2 block">Режим редактирования:</Label>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={currentBreakpoint === 'desktop' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setCurrentBreakpoint('desktop')}
          >
            <Monitor className="w-4 h-4 mr-1" />
            Desktop
          </Button>
          <Button
            size="sm"
            variant={currentBreakpoint === 'tablet' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setCurrentBreakpoint('tablet')}
          >
            <Tablet className="w-4 h-4 mr-1" />
            Tablet
          </Button>
          <Button
            size="sm"
            variant={currentBreakpoint === 'mobile' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setCurrentBreakpoint('mobile')}
          >
            <Smartphone className="w-4 h-4 mr-1" />
            Mobile
          </Button>
        </div>
        {currentBreakpoint !== 'desktop' && (
          <p className="text-xs text-muted-foreground mt-2">
            Изменения применяются только для {currentBreakpoint === 'tablet' ? 'планшетов' : 'мобильных устройств'}
          </p>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          
          {/* Content Properties */}
          {component.editableProps.length > 0 && currentBreakpoint === 'desktop' && (
            <Collapsible open={openSections.content}>
              <SectionHeader title="Содержимое" icon={Type} section="content" />
              <CollapsibleContent>
                <div className="space-y-3 mt-2 pl-2">
                  {component.editableProps.map((prop) => (
                    <div key={prop.name}>
                      <Label htmlFor={prop.name} className="text-xs">{prop.label}</Label>
                      
                      {prop.type === 'text' && (
                        <Input
                          id={prop.name}
                          type="text"
                          value={selectedElement.props[prop.name] || ''}
                          onChange={(e) => handlePropChange(prop.name, e.target.value)}
                          className="mt-1 h-8"
                        />
                      )}

                      {prop.type === 'textarea' && (
                        <Textarea
                          id={prop.name}
                          value={selectedElement.props[prop.name] || ''}
                          onChange={(e) => handlePropChange(prop.name, e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      )}

                      {prop.type === 'color' && (
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={selectedElement.props[prop.name] || prop.default}
                            onChange={(e) => handlePropChange(prop.name, e.target.value)}
                            className="w-12 h-8 p-1 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={selectedElement.props[prop.name] || prop.default}
                            onChange={(e) => handlePropChange(prop.name, e.target.value)}
                            className="flex-1 h-8"
                          />
                        </div>
                      )}

                      {prop.type === 'number' && (
                        <Input
                          id={prop.name}
                          type="number"
                          value={selectedElement.props[prop.name] || ''}
                          onChange={(e) => handlePropChange(prop.name, parseFloat(e.target.value))}
                          className="mt-1 h-8"
                        />
                      )}

                      {prop.type === 'select' && prop.options && (
                        <Select
                          value={selectedElement.props[prop.name] || prop.default}
                          onValueChange={(value) => handlePropChange(prop.name, value)}
                        >
                          <SelectTrigger className="mt-1 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {prop.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {prop.type === 'toggle' && (
                        <div className="flex items-center gap-2 mt-2">
                          <Switch
                            id={prop.name}
                            checked={selectedElement.props[prop.name] || false}
                            onCheckedChange={(checked) => handlePropChange(prop.name, checked)}
                          />
                          <Label htmlFor={prop.name} className="text-xs cursor-pointer">
                            {selectedElement.props[prop.name] ? 'Включено' : 'Выключено'}
                          </Label>
                        </div>
                      )}

                      {(prop.type === 'image' || prop.type === 'link') && (
                        <Input
                          id={prop.name}
                          type="text"
                          value={selectedElement.props[prop.name] || ''}
                          onChange={(e) => handlePropChange(prop.name, e.target.value)}
                          placeholder={prop.type === 'image' ? 'URL изображения' : 'URL ссылки'}
                          className="mt-1 h-8"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {currentBreakpoint === 'desktop' && component.editableProps.length > 0 && <Separator />}

          {/* Layout */}
          <Collapsible open={openSections.layout}>
            <SectionHeader title="Макет" icon={Box} section="layout" />
            <CollapsibleContent>
              <div className="space-y-3 mt-2 pl-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Display</Label>
                    <Select
                      value={currentStyles?.display as string || 'block'}
                      onValueChange={(value) => handleStyleChange('display', value, currentBreakpoint)}
                    >
                      <SelectTrigger className="h-8 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="block">Block</SelectItem>
                        <SelectItem value="flex">Flex</SelectItem>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="inline">Inline</SelectItem>
                        <SelectItem value="inline-block">Inline Block</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Position</Label>
                    <Select
                      value={currentStyles?.position as string || 'relative'}
                      onValueChange={(value) => handleStyleChange('position', value, currentBreakpoint)}
                    >
                      <SelectTrigger className="h-8 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="static">Static</SelectItem>
                        <SelectItem value="relative">Relative</SelectItem>
                        <SelectItem value="absolute">Absolute</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="sticky">Sticky</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Ширина</Label>
                    <Input
                      type="text"
                      value={currentStyles?.width || ''}
                      onChange={(e) => handleStyleChange('width', e.target.value, currentBreakpoint)}
                      placeholder="auto"
                      className="h-8 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Высота</Label>
                    <Input
                      type="text"
                      value={currentStyles?.height || ''}
                      onChange={(e) => handleStyleChange('height', e.target.value, currentBreakpoint)}
                      placeholder="auto"
                      className="h-8 mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Min Width</Label>
                    <Input
                      type="text"
                      value={currentStyles?.minWidth || ''}
                      onChange={(e) => handleStyleChange('minWidth', e.target.value, currentBreakpoint)}
                      placeholder="0"
                      className="h-8 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Max Width</Label>
                    <Input
                      type="text"
                      value={currentStyles?.maxWidth || ''}
                      onChange={(e) => handleStyleChange('maxWidth', e.target.value, currentBreakpoint)}
                      placeholder="none"
                      className="h-8 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Padding</Label>
                  <Input
                    type="text"
                    value={currentStyles?.padding || ''}
                    onChange={(e) => handleStyleChange('padding', e.target.value, currentBreakpoint)}
                    placeholder="0"
                    className="h-8 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Margin</Label>
                  <Input
                    type="text"
                    value={currentStyles?.margin || ''}
                    onChange={(e) => handleStyleChange('margin', e.target.value, currentBreakpoint)}
                    placeholder="0"
                    className="h-8 mt-1"
                  />
                </div>

                {currentStyles?.display === 'flex' && (
                  <>
                    <Separator className="my-2" />
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Flexbox</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Direction</Label>
                          <Select
                            value={currentStyles?.flexDirection as string || 'row'}
                            onValueChange={(value) => handleStyleChange('flexDirection', value, currentBreakpoint)}
                          >
                            <SelectTrigger className="h-8 mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="row">Row</SelectItem>
                              <SelectItem value="column">Column</SelectItem>
                              <SelectItem value="row-reverse">Row Reverse</SelectItem>
                              <SelectItem value="column-reverse">Column Reverse</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Gap</Label>
                          <Input
                            type="text"
                            value={currentStyles?.gap || ''}
                            onChange={(e) => handleStyleChange('gap', e.target.value, currentBreakpoint)}
                            placeholder="0"
                            className="h-8 mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Typography */}
          <Collapsible open={openSections.typography}>
            <SectionHeader title="Типографика" icon={Type} section="typography" />
            <CollapsibleContent>
              <div className="space-y-3 mt-2 pl-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Size</Label>
                    <Input
                      type="text"
                      value={currentStyles?.fontSize || ''}
                      onChange={(e) => handleStyleChange('fontSize', e.target.value, currentBreakpoint)}
                      placeholder="16px"
                      className="h-8 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Weight</Label>
                    <Select
                      value={currentStyles?.fontWeight as string || '400'}
                      onValueChange={(value) => handleStyleChange('fontWeight', value, currentBreakpoint)}
                    >
                      <SelectTrigger className="h-8 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">Light (300)</SelectItem>
                        <SelectItem value="400">Normal (400)</SelectItem>
                        <SelectItem value="500">Medium (500)</SelectItem>
                        <SelectItem value="600">Semi Bold (600)</SelectItem>
                        <SelectItem value="700">Bold (700)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Text Align</Label>
                  <Select
                    value={currentStyles?.textAlign as string || 'left'}
                    onValueChange={(value) => handleStyleChange('textAlign', value, currentBreakpoint)}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="justify">Justify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Text Decoration</Label>
                  <Select
                    value={currentStyles?.textDecoration as string || 'none'}
                    onValueChange={(value) => handleStyleChange('textDecoration', value, currentBreakpoint)}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="underline">Underline</SelectItem>
                      <SelectItem value="overline">Overline</SelectItem>
                      <SelectItem value="line-through">Line Through</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Text Transform</Label>
                  <Select
                    value={currentStyles?.textTransform as string || 'none'}
                    onValueChange={(value) => handleStyleChange('textTransform', value, currentBreakpoint)}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="uppercase">Uppercase</SelectItem>
                      <SelectItem value="lowercase">Lowercase</SelectItem>
                      <SelectItem value="capitalize">Capitalize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Text Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={currentStyles?.color as string || '#000000'}
                      onChange={(e) => handleStyleChange('color', e.target.value, currentBreakpoint)}
                      className="w-12 h-8 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={currentStyles?.color || ''}
                      onChange={(e) => handleStyleChange('color', e.target.value, currentBreakpoint)}
                      placeholder="#000000"
                      className="flex-1 h-8"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Colors & Backgrounds */}
          <Collapsible open={openSections.colors}>
            <SectionHeader title="Цвета и Фоны" icon={Palette} section="colors" />
            <CollapsibleContent>
              <div className="space-y-3 mt-2 pl-2">
                <div>
                  <Label className="text-xs">Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={currentStyles?.backgroundColor as string || '#ffffff'}
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value, currentBreakpoint)}
                      className="w-12 h-8 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={currentStyles?.backgroundColor || ''}
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value, currentBreakpoint)}
                      placeholder="#ffffff"
                      className="flex-1 h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Background Image</Label>
                  <Input
                    type="text"
                    value={currentStyles?.backgroundImage as string || ''}
                    onChange={(e) => handleStyleChange('backgroundImage', e.target.value, currentBreakpoint)}
                    placeholder="url(...)"
                    className="h-8 mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">BG Size</Label>
                    <Select
                      value={currentStyles?.backgroundSize as string || 'auto'}
                      onValueChange={(value) => handleStyleChange('backgroundSize', value, currentBreakpoint)}
                    >
                      <SelectTrigger className="h-8 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="cover">Cover</SelectItem>
                        <SelectItem value="contain">Contain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">BG Position</Label>
                    <Select
                      value={currentStyles?.backgroundPosition as string || 'center'}
                      onValueChange={(value) => handleStyleChange('backgroundPosition', value, currentBreakpoint)}
                    >
                      <SelectTrigger className="h-8 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Gradient</Label>
                  <Select
                    value="none"
                    onValueChange={(value) => {
                      if (value !== 'none') {
                        handleStyleChange('backgroundImage', value, currentBreakpoint);
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="Выберите градиент" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Без градиента</SelectItem>
                      <SelectItem value="linear-gradient(to right, #667eea 0%, #764ba2 100%)">Фиолетовый</SelectItem>
                      <SelectItem value="linear-gradient(to right, #f093fb 0%, #f5576c 100%)">Розовый</SelectItem>
                      <SelectItem value="linear-gradient(to right, #4facfe 0%, #00f2fe 100%)">Синий</SelectItem>
                      <SelectItem value="linear-gradient(to right, #43e97b 0%, #38f9d7 100%)">Зелёный</SelectItem>
                      <SelectItem value="linear-gradient(to right, #fa709a 0%, #fee140 100%)">Закат</SelectItem>
                      <SelectItem value="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">Диагональ 1</SelectItem>
                      <SelectItem value="linear-gradient(to bottom, #667eea 0%, #764ba2 100%)">Вертикальный</SelectItem>
                      <SelectItem value="radial-gradient(circle, #667eea 0%, #764ba2 100%)">Радиальный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Opacity</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[parseFloat(currentStyles?.opacity as string || '1') * 100]}
                      onValueChange={([value]) => handleStyleChange('opacity', (value / 100).toString(), currentBreakpoint)}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs w-10 text-right">
                      {Math.round(parseFloat(currentStyles?.opacity as string || '1') * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Borders */}
          <Collapsible open={openSections.borders}>
            <SectionHeader title="Границы" icon={Box} section="borders" />
            <CollapsibleContent>
              <div className="space-y-3 mt-2 pl-2">
                <div>
                  <Label className="text-xs">Border Width</Label>
                  <Input
                    type="text"
                    value={currentStyles?.borderWidth || ''}
                    onChange={(e) => handleStyleChange('borderWidth', e.target.value, currentBreakpoint)}
                    placeholder="0"
                    className="h-8 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Border Style</Label>
                  <Select
                    value={currentStyles?.borderStyle as string || 'solid'}
                    onValueChange={(value) => handleStyleChange('borderStyle', value, currentBreakpoint)}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="groove">Groove</SelectItem>
                      <SelectItem value="ridge">Ridge</SelectItem>
                      <SelectItem value="inset">Inset</SelectItem>
                      <SelectItem value="outset">Outset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Border Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={currentStyles?.borderColor as string || '#000000'}
                      onChange={(e) => handleStyleChange('borderColor', e.target.value, currentBreakpoint)}
                      className="w-12 h-8 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={currentStyles?.borderColor || ''}
                      onChange={(e) => handleStyleChange('borderColor', e.target.value, currentBreakpoint)}
                      placeholder="#000000"
                      className="flex-1 h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Border Radius</Label>
                  <Input
                    type="text"
                    value={currentStyles?.borderRadius || ''}
                    onChange={(e) => handleStyleChange('borderRadius', e.target.value, currentBreakpoint)}
                    placeholder="0"
                    className="h-8 mt-1"
                  />
                </div>

                <details className="mt-2">
                  <summary className="text-xs cursor-pointer hover:text-primary">Отдельные стороны</summary>
                  <div className="space-y-2 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Top</Label>
                        <Input
                          type="text"
                          value={currentStyles?.borderTop || ''}
                          onChange={(e) => handleStyleChange('borderTop', e.target.value, currentBreakpoint)}
                          placeholder="1px solid #000"
                          className="h-8 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Right</Label>
                        <Input
                          type="text"
                          value={currentStyles?.borderRight || ''}
                          onChange={(e) => handleStyleChange('borderRight', e.target.value, currentBreakpoint)}
                          placeholder="1px solid #000"
                          className="h-8 mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Bottom</Label>
                        <Input
                          type="text"
                          value={currentStyles?.borderBottom || ''}
                          onChange={(e) => handleStyleChange('borderBottom', e.target.value, currentBreakpoint)}
                          placeholder="1px solid #000"
                          className="h-8 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Left</Label>
                        <Input
                          type="text"
                          value={currentStyles?.borderLeft || ''}
                          onChange={(e) => handleStyleChange('borderLeft', e.target.value, currentBreakpoint)}
                          placeholder="1px solid #000"
                          className="h-8 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Shadows */}
          <Collapsible open={openSections.shadows}>
            <SectionHeader title="Тени" icon={Sparkles} section="shadows" />
            <CollapsibleContent>
              <div className="space-y-3 mt-2 pl-2">
                <div>
                  <Label className="text-xs">Box Shadow</Label>
                  <Input
                    type="text"
                    value={currentStyles?.boxShadow || ''}
                    onChange={(e) => handleStyleChange('boxShadow', e.target.value, currentBreakpoint)}
                    placeholder="0 4px 6px rgba(0,0,0,0.1)"
                    className="h-8 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Presets</Label>
                  <Select
                    value="none"
                    onValueChange={(value) => {
                      if (value !== 'none') {
                        handleStyleChange('boxShadow', value, currentBreakpoint);
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="Выберите тень" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Без тени</SelectItem>
                      <SelectItem value="0 1px 3px rgba(0,0,0,0.12)">Маленькая</SelectItem>
                      <SelectItem value="0 4px 6px rgba(0,0,0,0.1)">Средняя</SelectItem>
                      <SelectItem value="0 10px 20px rgba(0,0,0,0.15)">Большая</SelectItem>
                      <SelectItem value="0 20px 40px rgba(0,0,0,0.2)">Огромная</SelectItem>
                      <SelectItem value="0 0 20px rgba(0,0,0,0.1)">Свечение</SelectItem>
                      <SelectItem value="inset 0 2px 4px rgba(0,0,0,0.1)">Внутренняя</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Text Shadow</Label>
                  <Input
                    type="text"
                    value={currentStyles?.textShadow || ''}
                    onChange={(e) => handleStyleChange('textShadow', e.target.value, currentBreakpoint)}
                    placeholder="2px 2px 4px rgba(0,0,0,0.3)"
                    className="h-8 mt-1"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Transform & Effects */}
          <Collapsible open={openSections.transform}>
            <SectionHeader title="Трансформации" icon={Move} section="transform" />
            <CollapsibleContent>
              <div className="space-y-3 mt-2 pl-2">
                <div>
                  <Label className="text-xs">Transform</Label>
                  <Input
                    type="text"
                    value={currentStyles?.transform || ''}
                    onChange={(e) => handleStyleChange('transform', e.target.value, currentBreakpoint)}
                    placeholder="rotate(0deg)"
                    className="h-8 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Rotate (deg)</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[parseInt(String(currentStyles?.transform || '').match(/rotate\((-?\d+)deg\)/)?.[1] || '0')]}
                      onValueChange={([value]) => handleStyleChange('transform', `rotate(${value}deg)`)}
                      min={-180}
                      max={180}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs w-10 text-right">
                      {parseInt(String(currentStyles?.transform || '').match(/rotate\((-?\d+)deg\)/)?.[1] || '0')}°
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Scale</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[parseFloat(String(currentStyles?.transform || '').match(/scale\(([\d.]+)\)/)?.[1] || '1') * 100]}
                      onValueChange={([value]) => handleStyleChange('transform', `scale(${value / 100})`)}
                      max={200}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs w-10 text-right">
                      {Math.round(parseFloat(String(currentStyles?.transform || '').match(/scale\(([\d.]+)\)/)?.[1] || '1') * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Transform Origin</Label>
                  <Select
                    value={currentStyles?.transformOrigin as string || 'center'}
                    onValueChange={(value) => handleStyleChange('transformOrigin', value, currentBreakpoint)}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="top left">Top Left</SelectItem>
                      <SelectItem value="top right">Top Right</SelectItem>
                      <SelectItem value="bottom left">Bottom Left</SelectItem>
                      <SelectItem value="bottom right">Bottom Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Transition</Label>
                  <Input
                    type="text"
                    value={currentStyles?.transition || ''}
                    onChange={(e) => handleStyleChange('transition', e.target.value, currentBreakpoint)}
                    placeholder="all 0.3s ease"
                    className="h-8 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Animation</Label>
                  <Select
                    value="none"
                    onValueChange={(value) => {
                      if (value !== 'none') {
                        handleStyleChange('animation', value, currentBreakpoint);
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="Выберите анимацию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Без анимации</SelectItem>
                      <SelectItem value="pulse 2s infinite">Pulse</SelectItem>
                      <SelectItem value="bounce 1s infinite">Bounce</SelectItem>
                      <SelectItem value="spin 1s linear infinite">Spin</SelectItem>
                      <SelectItem value="ping 1s cubic-bezier(0, 0, 0.2, 1) infinite">Ping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Cursor</Label>
                  <Select
                    value={currentStyles?.cursor as string || 'default'}
                    onValueChange={(value) => handleStyleChange('cursor', value, currentBreakpoint)}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="pointer">Pointer</SelectItem>
                      <SelectItem value="move">Move</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="wait">Wait</SelectItem>
                      <SelectItem value="not-allowed">Not Allowed</SelectItem>
                      <SelectItem value="grab">Grab</SelectItem>
                      <SelectItem value="zoom-in">Zoom In</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Z-Index */}
          <div className="space-y-2">
            <Label className="text-xs">Z-Index (слой)</Label>
            <Input
              type="number"
              value={currentStyles?.zIndex || ''}
              onChange={(e) => handleStyleChange('zIndex', e.target.value, currentBreakpoint)}
              placeholder="0"
              className="h-8"
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}