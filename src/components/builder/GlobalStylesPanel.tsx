'use client';

import React from 'react';
import { Palette, Type } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface GlobalStyles {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography: {
    fontFamily: string;
    baseFontSize: string;
    headingFontFamily: string;
    lineHeight: string;
  };
  spacing: {
    baseUnit: string;
  };
}

interface GlobalStylesPanelProps {
  globalStyles: GlobalStyles;
  onUpdate: (styles: GlobalStyles) => void;
}

export default function GlobalStylesPanel({ globalStyles, onUpdate }: GlobalStylesPanelProps) {
  const [openSections, setOpenSections] = React.useState({
    colors: true,
    typography: true,
    spacing: true
  });

  const handleColorChange = (key: keyof GlobalStyles['colors'], value: string) => {
    onUpdate({
      ...globalStyles,
      colors: {
        ...globalStyles.colors,
        [key]: value
      }
    });
  };

  const handleTypographyChange = (key: keyof GlobalStyles['typography'], value: string) => {
    onUpdate({
      ...globalStyles,
      typography: {
        ...globalStyles.typography,
        [key]: value
      }
    });
  };

  const handleSpacingChange = (key: keyof GlobalStyles['spacing'], value: string) => {
    onUpdate({
      ...globalStyles,
      spacing: {
        ...globalStyles.spacing,
        [key]: value
      }
    });
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold">Глобальные стили</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Применяются ко всем страницам
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          
          {/* Colors */}
          <Collapsible open={openSections.colors}>
            <CollapsibleTrigger asChild>
              <button
                onClick={() => toggleSection('colors')}
                className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span className="text-sm font-semibold">Цветовая палитра</span>
                </div>
                {openSections.colors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-3 mt-2 pl-2">
                <div>
                  <Label className="text-xs">Основной цвет</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={globalStyles.colors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="w-12 h-8 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={globalStyles.colors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      className="flex-1 h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Вторичный цвет</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={globalStyles.colors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="w-12 h-8 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={globalStyles.colors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      className="flex-1 h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Акцентный цвет</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={globalStyles.colors.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="w-12 h-8 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={globalStyles.colors.accent}
                      onChange={(e) => handleColorChange('accent', e.target.value)}
                      className="flex-1 h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Цвет фона</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={globalStyles.colors.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="w-12 h-8 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={globalStyles.colors.background}
                      onChange={(e) => handleColorChange('background', e.target.value)}
                      className="flex-1 h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Цвет текста</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={globalStyles.colors.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="w-12 h-8 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={globalStyles.colors.text}
                      onChange={(e) => handleColorChange('text', e.target.value)}
                      className="flex-1 h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Приглушённый цвет</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={globalStyles.colors.muted}
                      onChange={(e) => handleColorChange('muted', e.target.value)}
                      className="w-12 h-8 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={globalStyles.colors.muted}
                      onChange={(e) => handleColorChange('muted', e.target.value)}
                      className="flex-1 h-8"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Typography */}
          <Collapsible open={openSections.typography}>
            <CollapsibleTrigger asChild>
              <button
                onClick={() => toggleSection('typography')}
                className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <span className="text-sm font-semibold">Типографика</span>
                </div>
                {openSections.typography ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-3 mt-2 pl-2">
                <div>
                  <Label className="text-xs">Шрифт основного текста</Label>
                  <Select
                    value={globalStyles.typography.fontFamily}
                    onValueChange={(value) => handleTypographyChange('fontFamily', value)}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system-ui, -apple-system, sans-serif">System (по умолчанию)</SelectItem>
                      <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                      <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                      <SelectItem value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</SelectItem>
                      <SelectItem value="'Segoe UI', Tahoma, sans-serif">Segoe UI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Шрифт заголовков</Label>
                  <Select
                    value={globalStyles.typography.headingFontFamily}
                    onValueChange={(value) => handleTypographyChange('headingFontFamily', value)}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inherit">Как основной текст</SelectItem>
                      <SelectItem value="system-ui, -apple-system, sans-serif">System</SelectItem>
                      <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                      <SelectItem value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</SelectItem>
                      <SelectItem value="'Segoe UI', Tahoma, sans-serif">Segoe UI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Базовый размер шрифта</Label>
                  <Input
                    type="text"
                    value={globalStyles.typography.baseFontSize}
                    onChange={(e) => handleTypographyChange('baseFontSize', e.target.value)}
                    placeholder="16px"
                    className="h-8 mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Межстрочный интервал</Label>
                  <Select
                    value={globalStyles.typography.lineHeight}
                    onValueChange={(value) => handleTypographyChange('lineHeight', value)}
                  >
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.2">Плотный (1.2)</SelectItem>
                      <SelectItem value="1.4">Нормальный (1.4)</SelectItem>
                      <SelectItem value="1.6">Комфортный (1.6)</SelectItem>
                      <SelectItem value="1.8">Просторный (1.8)</SelectItem>
                      <SelectItem value="2">Очень просторный (2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Spacing */}
          <Collapsible open={openSections.spacing}>
            <CollapsibleTrigger asChild>
              <button
                onClick={() => toggleSection('spacing')}
                className="flex items-center justify-between w-full p-2 hover:bg-accent rounded-md transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current rounded" />
                  <span className="text-sm font-semibold">Отступы</span>
                </div>
                {openSections.spacing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-3 mt-2 pl-2">
                <div>
                  <Label className="text-xs">Базовая единица отступа</Label>
                  <Input
                    type="text"
                    value={globalStyles.spacing.baseUnit}
                    onChange={(e) => handleSpacingChange('baseUnit', e.target.value)}
                    placeholder="8px"
                    className="h-8 mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Используется для расчёта всех отступов
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Глобальные стили применяются автоматически при экспорте
        </p>
      </div>
    </div>
  );
}