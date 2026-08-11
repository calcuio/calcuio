import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

interface FAQItem {
  qKey: string;
  aKey: string;
}

interface FAQProps {
  items?: FAQItem[];
  questions?: { q: string; a: string }[];
}

export function FAQ({ items, questions }: FAQProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  const faqs = questions
    ? questions
    : (items || []).map((item) => ({ q: t(item.qKey), a: t(item.aKey) }));

  if (faqs.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">{t('tool.faq')}</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-start"
              aria-expanded={open === i}
            >
              <span className="text-sm font-medium text-slate-900 dark:text-white">{faq.q}</span>
              <ChevronDown
                size={17}
                className={`shrink-0 text-slate-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
