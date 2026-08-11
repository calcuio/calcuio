import { Suspense } from 'react';
import { ToolPageLayout } from '@/components/tools/ToolPageLayout';
import { lazyToolComponents } from '@/components/tools/registry';
import { getTool } from '@/data/tools';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ToolPageProps {
  slug: string;
}

export function ToolPage({ slug }: ToolPageProps) {
  const tool = getTool(slug);
  const LazyComponent = lazyToolComponents[slug];

  if (!tool || !LazyComponent) {
    return null;
  }

  return (
    <ToolPageLayout>
      <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="w-full max-w-xs"><ProgressBar value={50} /></div></div>}>
        <LazyComponent />
      </Suspense>
    </ToolPageLayout>
  );
}
