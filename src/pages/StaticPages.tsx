import { useI18n } from '@/i18n/I18nContext';
import { useSEO } from '@/lib/seo';
import { FAQ } from '@/components/ui/FAQ';

export function AboutPage() {
  const { t } = useI18n();
  useSEO({ title: `${t('page.about.title')} | Calcuio`, description: 'Learn about Calcuio — free, fast, privacy-first online tools.', canonical: '/about' });

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('page.about.title')}</h1>
      <div className="prose-calcuio mt-4 max-w-2xl space-y-4">
        <p>Calcuio is a collection of free online utility tools built around three principles: speed, privacy, and simplicity.</p>
        <p>Most tools process your files entirely in your browser — nothing is uploaded to a server. This means your data stays on your device, and results are instant.</p>
        <p>We started Calcuio because too many free tool sites are slow, cluttered with ads, and require an account before you can do anything as simple as compressing an image. We believe a good tool should just work.</p>
        <p>No signup. No paywalls on core features. No tracking your files. Just tools.</p>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  const { t } = useI18n();
  useSEO({ title: `${t('page.privacy.title')} | Calcuio`, description: 'How Calcuio handles your data and privacy.', canonical: '/privacy' });

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('page.privacy.title')}</h1>
      <div className="prose-calcuio mt-4 max-w-2xl space-y-4">
        <p><strong>Your files stay on your device.</strong> Tools that process files (images, PDFs, text) run entirely in your browser. Your data is never uploaded to our servers.</p>
        <p><strong>Local storage.</strong> We use your browser's local storage to remember preferences like your theme, language, recently used tools, and favorites. This data never leaves your device.</p>
        <p><strong>Analytics.</strong> We may use privacy-respecting analytics to understand which tools are used and how to improve them. We do not collect personally identifiable information.</p>
        <p><strong>Cookies.</strong> We do not use tracking cookies. Essential functionality is handled through local storage.</p>
        <p><strong>Advertising.</strong> If we serve ads in the future, they will be clearly labeled and will not interfere with tool functionality.</p>
        <p><strong>Changes.</strong> If this policy changes, we will update this page. We will never quietly weaken our privacy commitments.</p>
      </div>
    </div>
  );
}

export function TermsPage() {
  const { t } = useI18n();
  useSEO({ title: `${t('page.terms.title')} | Calcuio`, description: 'Terms of service for Calcuio.', canonical: '/terms' });

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('page.terms.title')}</h1>
      <div className="prose-calcuio mt-4 max-w-2xl space-y-4">
        <p><strong>Free to use.</strong> Calcuio tools are free to use for personal and commercial purposes.</p>
        <p><strong>No warranty.</strong> Tools are provided "as is" without warranty of any kind. We are not liable for any data loss or damage resulting from their use.</p>
        <p><strong>Your responsibility.</strong> You are responsible for the files you process and the results you obtain. Always keep backups of important files.</p>
        <p><strong>Acceptable use.</strong> Do not use Calcuio to process illegal content or to attempt to disrupt the service.</p>
        <p><strong>Changes.</strong> We may update these terms or the available tools at any time without prior notice.</p>
      </div>
    </div>
  );
}

export function ContactPage() {
  const { t } = useI18n();
  useSEO({ title: `${t('page.contact.title')} | Calcuio`, description: 'Get in touch with the Calcuio team.', canonical: '/contact' });

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('page.contact.title')}</h1>
      <div className="prose-calcuio mt-4 max-w-2xl space-y-4">
        <p>Have a question, found a bug, or want to request a new tool? We'd love to hear from you.</p>
        <p>Email: <strong>hello@calcuio.com</strong></p>
        <p>We aim to respond within 1-2 business days.</p>
      </div>
    </div>
  );
}

export function FaqPage() {
  const { t } = useI18n();
  useSEO({ title: `${t('page.faq.title')} | Calcuio`, description: 'Common questions about Calcuio tools.', canonical: '/faq' });

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ];

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('page.faq.title')}</h1>
      <div className="mt-6">
        <FAQ questions={faqs} />
      </div>
    </div>
  );
}

export function BlogPage() {
  const { t } = useI18n();
  useSEO({ title: `${t('page.blog.title')} | Calcuio`, description: t('page.blog.sub'), canonical: '/blog' });

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('page.blog.title')}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('page.blog.sub')}</p>
      <div className="mt-8 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-10 text-center dark:border-surface-dark-border dark:bg-surface-dark-muted/30">
        <p className="text-sm text-slate-500 dark:text-slate-400">Guides and articles coming soon.</p>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  const { t } = useI18n();
  useSEO({ title: `${t('page.404.title')} | Calcuio`, description: t('page.404.sub'), canonical: '/404' });

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-6xl font-bold text-brand-200 dark:text-brand-500/30">404</p>
      <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{t('page.404.title')}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('page.404.sub')}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <a href="/" className="btn btn-primary">{t('page.404.back')}</a>
        <a href="/tools" className="btn btn-outline">{t('page.404.search')}</a>
        <a href="/categories" className="btn btn-ghost">{t('page.404.categories')}</a>
      </div>
    </div>
  );
}
