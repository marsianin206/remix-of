'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { componentLibrary, categories, ComponentCategory } from '@/lib/component-library';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

export default function ComponentLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['headers', 'heroes', 'features']));

  const filteredComponents = useMemo(() => {
    if (!searchQuery) return componentLibrary;
    const query = searchQuery.toLowerCase();
    return componentLibrary.filter(
      comp => comp.name.toLowerCase().includes(query) || 
              comp.description.toLowerCase().includes(query) ||
              comp.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const componentsByCategory = useMemo(() => {
    const grouped: Record<string, typeof componentLibrary> = {};
    categories.forEach(cat => {
      grouped[cat] = filteredComponents.filter(comp => comp.category === cat);
    });
    return grouped;
  }, [filteredComponents]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDragStart = (e: React.DragEvent, component: typeof componentLibrary[0]) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('component', JSON.stringify(component));
  };

  const categoryLabels: Record<string, string> = {
    headers: 'Заголовки',
    navigation: 'Навигация',
    heroes: 'Hero блоки',
    features: 'Особенности',
    pricing: 'Тарифы',
    testimonials: 'Отзывы',
    teams: 'Команда',
    forms: 'Формы',
    inputs: 'Поля ввода',
    buttons: 'Кнопки',
    cards: 'Карточки',
    galleries: 'Галереи',
    footers: 'Футеры',
    cta: 'CTA',
    blog: 'Блог',
    ecommerce: 'E-commerce',
    stats: 'Статистика',
    timelines: 'Таймлайны',
    tabs: 'Табы',
    accordions: 'Аккордеоны',
    modals: 'Модальные окна',
    alerts: 'Уведомления',
    badges: 'Бейджи',
    breadcrumbs: 'Хлебные крошки',
    pagination: 'Пагинация',
    progress: 'Прогресс',
    tooltips: 'Подсказки',
    dropdowns: 'Выпадающие списки',
    sidebars: 'Боковые панели',
    tables: 'Таблицы',
    lists: 'Списки',
    text: 'Текст',
    images: 'Изображения',
    videos: 'Видео',
    dividers: 'Разделители',
    maps: 'Карты',
    social: 'Соцсети',
    contact: 'Контакты',
    login: 'Вход',
    register: 'Регистрация',
    dashboard: 'Дашборды',
    charts: 'Графики',
    calendars: 'Календари',
    timepickers: 'Время',
    sliders: 'Слайдеры',
    toggles: 'Переключатели',
    checkboxes: 'Чекбоксы',
    radios: 'Радио',
    selects: 'Селекты',
    textareas: 'Текстовые поля'
  };

  return (
    <div className="w-80 border-r border-border bg-background flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold mb-3">Библиотека компонентов</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Поиск компонентов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {filteredComponents.length} компонентов
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {categories.map(category => {
            const components = componentsByCategory[category];
            if (!components || components.length === 0) return null;

            const isExpanded = expandedCategories.has(category);

            return (
              <div key={category} className="mb-2">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-accent rounded-md text-sm font-medium"
                >
                  <span>{categoryLabels[category] || category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{components.length}</span>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-1 space-y-1 ml-2">
                    {components.map(component => (
                      <div
                        key={component.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, component)}
                        className="p-3 bg-card hover:bg-accent border border-border rounded-md cursor-move transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <div className="text-xl">📦</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{component.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {component.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}