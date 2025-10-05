'use client';

import React from 'react';
import { CanvasElement } from './BuilderCanvas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, EyeOff, Lock, Unlock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayersPanelProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onElementSelect: (id: string) => void;
  onElementDelete: (id: string) => void;
}

export default function LayersPanel({
  elements,
  selectedElementId,
  onElementSelect,
  onElementDelete
}: LayersPanelProps) {
  return (
    <div className="w-64 border-r border-border bg-background flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold">Слои</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {elements.length} элементов
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {elements.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Нет элементов</p>
            </div>
          ) : (
            <div className="space-y-1">
              {elements.map((element, index) => (
                <div
                  key={element.id}
                  onClick={() => onElementSelect(element.id)}
                  className={`
                    p-2 rounded-md cursor-pointer transition-colors flex items-center justify-between group
                    ${selectedElementId === element.id 
                      ? 'bg-primary/10 border border-primary' 
                      : 'hover:bg-accent border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs text-muted-foreground w-6">#{index + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {element.componentId}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onElementDelete(element.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}