'use client';

import React from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Group,
  Ungroup,
  BringToFront,
  SendToBack,
  ArrowUp,
  ArrowDown,
  FlipHorizontal,
  FlipVertical,
  RotateCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ElementToolbarProps {
  selectedElementIds: string[];
  onAlign: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom' | 'horizontal' | 'vertical') => void;
  onDistribute: (type: 'horizontal' | 'vertical') => void;
  onGroup: () => void;
  onUngroup: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onFlip: (direction: 'horizontal' | 'vertical') => void;
  onRotate: (angle: number) => void;
}

export default function ElementToolbar({
  selectedElementIds,
  onAlign,
  onDistribute,
  onGroup,
  onUngroup,
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
  onFlip,
  onRotate
}: ElementToolbarProps) {
  const hasSelection = selectedElementIds.length > 0;
  const hasMultipleSelection = selectedElementIds.length > 1;

  if (!hasSelection) return null;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-background border border-border rounded-lg shadow-xl p-2 flex items-center gap-1">
        {/* Alignment Tools */}
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAlign('left')}
                disabled={!hasMultipleSelection}
                className="h-8 w-8 p-0"
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Выровнять по левому краю</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAlign('center')}
                disabled={!hasMultipleSelection}
                className="h-8 w-8 p-0"
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Выровнять по центру</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAlign('right')}
                disabled={!hasMultipleSelection}
                className="h-8 w-8 p-0"
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Выровнять по правому краю</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Vertical Alignment */}
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAlign('top')}
                disabled={!hasMultipleSelection}
                className="h-8 w-8 p-0"
              >
                <AlignStartVertical className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Выровнять по верхнему краю</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAlign('middle')}
                disabled={!hasMultipleSelection}
                className="h-8 w-8 p-0"
              >
                <AlignCenterVertical className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Выровнять по середине</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAlign('bottom')}
                disabled={!hasMultipleSelection}
                className="h-8 w-8 p-0"
              >
                <AlignEndVertical className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Выровнять по нижнему краю</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Distribution */}
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDistribute('horizontal')}
                disabled={selectedElementIds.length < 3}
                className="h-8 w-8 p-0"
              >
                <AlignHorizontalSpaceAround className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Распределить горизонтально</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDistribute('vertical')}
                disabled={selectedElementIds.length < 3}
                className="h-8 w-8 p-0"
              >
                <AlignVerticalSpaceAround className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Распределить вертикально</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Grouping */}
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={onGroup}
                disabled={!hasMultipleSelection}
                className="h-8 w-8 p-0"
              >
                <Group className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Группировать (Ctrl+G)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={onUngroup}
                className="h-8 w-8 p-0"
              >
                <Ungroup className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Разгруппировать (Ctrl+Shift+G)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Z-Index Control */}
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={onBringToFront}
                className="h-8 w-8 p-0"
              >
                <BringToFront className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>На передний план (Ctrl+])</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={onBringForward}
                className="h-8 w-8 p-0"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Вперёд (])</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={onSendBackward}
                className="h-8 w-8 p-0"
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Назад ([)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={onSendToBack}
                className="h-8 w-8 p-0"
              >
                <SendToBack className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>На задний план (Ctrl+[)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Transform */}
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onFlip('horizontal')}
                className="h-8 w-8 p-0"
              >
                <FlipHorizontal className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Отразить горизонтально</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onFlip('vertical')}
                className="h-8 w-8 p-0"
              >
                <FlipVertical className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Отразить вертикально</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRotate(90)}
                className="h-8 w-8 p-0"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Повернуть на 90°</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Selection count */}
        <div className="ml-2 px-2 py-1 bg-muted rounded text-xs font-medium">
          {selectedElementIds.length} выбрано
        </div>
      </div>
    </TooltipProvider>
  );
}