import { useState } from 'react';
import { Star } from 'lucide-react';
import { getFavorites, toggleFavorite } from '@/lib/storage';
import { track } from '@/lib/analytics';
import { useI18n } from '@/i18n/I18nContext';

interface FavoriteButtonProps {
  toolId: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function FavoriteButton({ toolId, size = 'md', showLabel = false }: FavoriteButtonProps) {
  const { t } = useI18n();
  const [active, setActive] = useState(getFavorites().includes(toolId));

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(toolId);
    setActive(next.includes(toolId));
    if (next.includes(toolId)) {
      track('favorite_add', { tool_id: toolId });
    } else {
      track('favorite_remove', { tool_id: toolId });
    }
  };

  const iconSize = size === 'sm' ? 15 : 17;

  if (showLabel) {
    return (
      <button
        onClick={handleToggle}
        className={`btn ${active ? 'btn-secondary' : 'btn-outline'}`}
        aria-label={active ? t('tool.favorite.remove') : t('tool.favorite.add')}
      >
        <Star size={iconSize} className={active ? 'fill-amber-400 text-amber-400' : ''} />
        {active ? t('tool.favorite.remove') : t('tool.favorite.add')}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`btn btn-ghost p-2 ${active ? 'text-amber-500' : ''}`}
      aria-label={active ? t('tool.favorite.remove') : t('tool.favorite.add')}
      title={active ? t('tool.favorite.remove') : t('tool.favorite.add')}
    >
      <Star size={iconSize} className={active ? 'fill-amber-400 text-amber-400' : ''} />
    </button>
  );
}
