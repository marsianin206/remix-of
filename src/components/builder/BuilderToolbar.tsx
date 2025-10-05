'use client';

import React from 'react';
import { 
  Undo, Redo, Save, Download, Eye, Monitor, Tablet, Smartphone,
  Settings, Layout, Layers, Code, FileJson, Moon, Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BuilderToolbarProps {
  onSave: () => void;
  onExport: () => void;
  onPreview: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export default function BuilderToolbar({
  onSave,
  onExport,
  onPreview,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  viewMode,
  onViewModeChange,
  theme,
  onThemeChange
}: BuilderToolbarProps) {
  return (
    <div className="h-14 border-b border-border bg-background px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 mr-2">
          <Layout className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg">WebBuilder</span>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Отменить (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Повторить (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <div className="flex gap-1">
          <Button
            variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('desktop')}
            title="Десктоп"
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'tablet' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('tablet')}
            title="Планшет"
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('mobile')}
            title="Мобильный"
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
          title="Переключить тему"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onPreview}
          title="Предпросмотр"
        >
          <Eye className="w-4 h-4 mr-1" />
          Просмотр
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          title="Сохранить (Ctrl+S)"
        >
          <Save className="w-4 h-4 mr-1" />
          Сохранить
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Экспорт
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport()}>
              <Code className="w-4 h-4 mr-2" />
              Скачать HTML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport()}>
              <FileJson className="w-4 h-4 mr-2" />
              Скачать проект (JSON)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport()}>
              <Download className="w-4 h-4 mr-2" />
              Скачать всё (ZIP)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}