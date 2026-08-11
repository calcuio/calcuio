import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { useI18n } from '@/i18n/I18nContext';
import { categories } from '@/data/categories';
import { tools } from '@/data/tools';

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const popularTools = tools.filter((tool) => tool.isPopular).slice(0, 5);

  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-surface-light-subtle dark:border-surface-dark-border dark:bg-surface-dark-subtle">
      <div className="container-wide py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Logo size={24} />
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              {t('app.tagline')}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('footer.tools')}
            </h3>
            <ul className="space-y-2">
              {popularTools.map((tool) => (
                <li key={tool.id}>
                  <Link to={`/tools/${tool.slug}`} className="link-quiet text-sm">
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/tools" className="link-quiet text-sm font-medium">
                  {t('page.tools.title')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('footer.categories')}
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/categories/${cat.slug}`} className="link-quiet text-sm">
                    {t(cat.nameKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('footer.company')}
            </h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="link-quiet text-sm">{t('nav.about')}</Link></li>
              <li><Link to="/contact" className="link-quiet text-sm">{t('nav.contact')}</Link></li>
              <li><Link to="/blog" className="link-quiet text-sm">{t('nav.blog')}</Link></li>
              <li><Link to="/faq" className="link-quiet text-sm">{t('nav.faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="link-quiet text-sm">{t('nav.privacy')}</Link></li>
              <li><Link to="/terms" className="link-quiet text-sm">{t('nav.terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200/80 pt-6 dark:border-surface-dark-border sm:flex-row">
          <p className="text-xs text-slate-400">
            © {year} Calcuio. {t('footer.rights')}
          </p>
          <p className="text-xs text-slate-400">calcuio.com</p>
        </div>
      </div>
    </footer>
  );
}
