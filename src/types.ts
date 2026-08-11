export type Locale = 'en' | 'ar';

export type CategoryId =
  | 'images'
  | 'pdf'
  | 'developer'
  | 'text'
  | 'design'
  | 'calculators'
  | 'converters'
  | 'academic';

export interface Category {
  id: CategoryId;
  slug: string;
  nameKey: string;
  descriptionKey: string;
  icon: string;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  nameKey: string;
  description: string;
  descriptionKey: string;
  category: CategoryId;
  icon: string;
  keywords: string[];
  synonyms: string[];
  intentPhrases: string[];
  supportedFormats?: string[];
  relatedTools: string[];
  seoTitle?: string;
  seoDescription?: string;
  isPopular?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  priority: 'A' | 'B';
  faq: { qKey: string; aKey: string }[];
  howItWorksKey: string;
  tipsKey: string;
  privacyKey: string;
}
