import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'images',
    slug: 'images',
    nameKey: 'cat.images',
    descriptionKey: 'cat.images.desc',
    icon: 'Image',
  },
  {
    id: 'pdf',
    slug: 'pdf',
    nameKey: 'cat.pdf',
    descriptionKey: 'cat.pdf.desc',
    icon: 'FileText',
  },
  {
    id: 'developer',
    slug: 'developer',
    nameKey: 'cat.developer',
    descriptionKey: 'cat.developer.desc',
    icon: 'Code2',
  },
  {
    id: 'text',
    slug: 'text',
    nameKey: 'cat.text',
    descriptionKey: 'cat.text.desc',
    icon: 'Type',
  },
  {
    id: 'design',
    slug: 'design',
    nameKey: 'cat.design',
    descriptionKey: 'cat.design.desc',
    icon: 'Palette',
  },
  //  {
//    id: 'calculators',
//    slug: 'calculators',
//    nameKey: 'cat.calculators',
//    descriptionKey: 'cat.calculators.desc',
//    icon: 'Calculator',
//  },
//  {
//    id: 'converters',
//    slug: 'converters',
//    nameKey: 'cat.converters',
//    descriptionKey: 'cat.converters.desc',
//    icon: 'Repeat',
//  },
//  {
//    id: 'academic',
//    slug: 'academic',
//    nameKey: 'cat.academic',
//    descriptionKey: 'cat.academic.desc',
//    icon: 'GraduationCap',
//  },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id || c.slug === id);
}
