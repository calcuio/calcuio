import type { Tool } from '@/types';
import { ToolCard } from '@/components/tools/ToolCard';

interface ToolGridProps {
  tools: Tool[];
  showFavorite?: boolean;
  columns?: 2 | 3 | 4;
}

export function ToolGrid({ tools, showFavorite = false, columns = 3 }: ToolGridProps) {
  const colClasses = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (tools.length === 0) return null;

  return (
    <div className={`grid grid-cols-1 gap-3 ${colClasses[columns]}`}>
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} showFavorite={showFavorite} />
      ))}
    </div>
  );
}
