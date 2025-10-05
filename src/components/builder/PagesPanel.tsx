'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Home, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export interface Page {
  id: string;
  name: string;
  path: string;
  isHomePage: boolean;
}

interface PagesPanelProps {
  pages: Page[];
  currentPageId: string;
  onPageChange: (pageId: string) => void;
  onPageAdd: (page: Page) => void;
  onPageUpdate: (pageId: string, updates: Partial<Page>) => void;
  onPageDelete: (pageId: string) => void;
}

export default function PagesPanel({
  pages,
  currentPageId,
  onPageChange,
  onPageAdd,
  onPageUpdate,
  onPageDelete
}: PagesPanelProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [newPageName, setNewPageName] = useState('');
  const [newPagePath, setNewPagePath] = useState('');

  const handleAddPage = () => {
    if (!newPageName.trim()) {
      toast.error('Введите название страницы');
      return;
    }

    const path = newPagePath.trim() || `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Check if path already exists
    if (pages.some(p => p.path === path)) {
      toast.error('Путь уже существует');
      return;
    }

    const newPage: Page = {
      id: `page-${Date.now()}`,
      name: newPageName.trim(),
      path,
      isHomePage: pages.length === 0
    };

    onPageAdd(newPage);
    setNewPageName('');
    setNewPagePath('');
    setShowAddDialog(false);
    toast.success('Страница создана');
  };

  const handleEditPage = () => {
    if (!editingPage || !editingPage.name.trim()) {
      toast.error('Введите название страницы');
      return;
    }

    const path = editingPage.path.trim() || `/${editingPage.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Check if path already exists (excluding current page)
    if (pages.some(p => p.path === path && p.id !== editingPage.id)) {
      toast.error('Путь уже существует');
      return;
    }

    onPageUpdate(editingPage.id, {
      name: editingPage.name.trim(),
      path
    });

    setEditingPage(null);
    setShowEditDialog(false);
    toast.success('Страница обновлена');
  };

  const handleDeletePage = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page?.isHomePage) {
      toast.error('Нельзя удалить главную страницу');
      return;
    }

    if (pages.length === 1) {
      toast.error('Должна быть хотя бы одна страница');
      return;
    }

    onPageDelete(pageId);
    
    // Switch to another page if current page is deleted
    if (currentPageId === pageId) {
      const nextPage = pages.find(p => p.id !== pageId);
      if (nextPage) {
        onPageChange(nextPage.id);
      }
    }
    
    toast.success('Страница удалена');
  };

  const handleSetHomePage = (pageId: string) => {
    // Remove home page status from all pages
    pages.forEach(page => {
      if (page.isHomePage) {
        onPageUpdate(page.id, { isHomePage: false });
      }
    });
    
    // Set new home page
    onPageUpdate(pageId, { isHomePage: true, path: '/' });
    toast.success('Главная страница обновлена');
  };

  return (
    <>
      <div className="w-64 border-r border-border bg-background h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Страницы
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowAddDialog(true)}
              title="Добавить страницу"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {pages.length} {pages.length === 1 ? 'страница' : 'страниц'}
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {pages.map((page) => (
              <div
                key={page.id}
                className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                  currentPageId === page.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
                onClick={() => onPageChange(page.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {page.isHomePage ? (
                    <Home className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{page.name}</p>
                    <p className="text-xs opacity-70 truncate">{page.path}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingPage(page);
                      setShowEditDialog(true);
                    }}
                    title="Редактировать"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  
                  {!page.isHomePage && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetHomePage(page.id);
                        }}
                        title="Сделать главной"
                      >
                        <Home className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePage(page.id);
                        }}
                        title="Удалить"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-3 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Home className="w-3 h-3" />
            <span>- Главная страница</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-3 h-3" />
            <span>- Обычная страница</span>
          </div>
        </div>
      </div>

      {/* Add Page Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить страницу</DialogTitle>
            <DialogDescription>
              Создайте новую страницу для вашего сайта
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="page-name">Название страницы</Label>
              <Input
                id="page-name"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="О нас"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="page-path">Путь (URL)</Label>
              <Input
                id="page-path"
                value={newPagePath}
                onChange={(e) => setNewPagePath(e.target.value)}
                placeholder="/about"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Оставьте пустым для автоматической генерации
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddPage}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Page Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать страницу</DialogTitle>
            <DialogDescription>
              Измените настройки страницы
            </DialogDescription>
          </DialogHeader>

          {editingPage && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-page-name">Название страницы</Label>
                <Input
                  id="edit-page-name"
                  value={editingPage.name}
                  onChange={(e) => setEditingPage({ ...editingPage, name: e.target.value })}
                  placeholder="О нас"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-page-path">Путь (URL)</Label>
                <Input
                  id="edit-page-path"
                  value={editingPage.path}
                  onChange={(e) => setEditingPage({ ...editingPage, path: e.target.value })}
                  placeholder="/about"
                  className="mt-1"
                  disabled={editingPage.isHomePage}
                />
                {editingPage.isHomePage && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Путь главной страницы всегда "/"
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditPage}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}