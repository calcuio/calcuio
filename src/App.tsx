import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { ThemeProvider } from '@/theme/ThemeContext';
import { I18nProvider } from '@/i18n/I18nContext';
import { Header, MobileMenu } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchModal } from '@/components/layout/SearchModal';
import { HomePage } from '@/pages/HomePage';
import { ToolPage } from '@/pages/ToolPage';
import {
  ToolsPage,
  CategoriesPage,
  CategoryPage,
  PopularPage,
} from '@/pages/ToolsPages';
import {
  AboutPage,
  PrivacyPage,
  TermsPage,
  ContactPage,
  FaqPage,
  BlogPage,
  NotFoundPage,
} from '@/pages/StaticPages';

function ToolRoute() {
  const { slug } = useParams<{ slug: string }>();
  return <ToolPage slug={slug!} />;
}

function AppRoutes() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header onOpenSearch={openSearch} onOpenMobileMenu={openMobileMenu} />
      <MobileMenu open={mobileMenuOpen} onClose={closeMobileMenu} />
      <SearchModal open={searchOpen} onClose={closeSearch} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/:slug" element={<ToolRoute />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/popular" element={<PopularPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  );
}
