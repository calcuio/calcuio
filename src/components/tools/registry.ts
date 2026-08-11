import { lazy, type ComponentType } from 'react';

const importMap: Record<string, () => Promise<{ [key: string]: ComponentType }>> = {
  'jpg-to-pdf': () => import('@/components/tools/impl/JpgToPdfTool'),
  'image-compressor': () => import('@/components/tools/impl/ImageCompressorTool'),
  'image-resizer': () => import('@/components/tools/impl/ImageResizerTool'),
  'heic-to-jpg': () => import('@/components/tools/impl/HeicToJpgTool'),
  'pdf-compressor': () => import('@/components/tools/impl/PdfCompressorTool'),
  'json-formatter': () => import('@/components/tools/impl/JsonFormatterTool'),
  'word-counter': () => import('@/components/tools/impl/WordCounterTool'),
  'png-to-jpg': () => import('@/components/tools/impl/PngToJpgTool'),
  'jpg-to-webp': () => import('@/components/tools/impl/JpgToWebpTool'),
  'favicon-generator': () => import('@/components/tools/impl/FaviconGeneratorTool'),
  'png-to-webp': () => import('@/components/tools/impl/PngToWebpTool'),
  'webp-to-jpg': () => import('@/components/tools/impl/WebpToJpgTool'),
  'pdf-to-jpg': () => import('@/components/tools/impl/PdfToJpgTool'),
  'merge-pdf': () => import('@/components/tools/impl/MergePdfTool'),
  'json-validator': () => import('@/components/tools/impl/JsonValidatorTool'),
  'uuid-generator': () => import('@/components/tools/impl/UuidGeneratorTool'),
  'base64-encoder-decoder': () => import('@/components/tools/impl/Base64Tool'),
  'character-counter': () => import('@/components/tools/impl/CharacterCounterTool'),
  'case-converter': () => import('@/components/tools/impl/CaseConverterTool'),
  'hex-to-rgb': () => import('@/components/tools/impl/HexToRgbTool'),
};

const exportNames: Record<string, string> = {
  'jpg-to-pdf': 'JpgToPdfTool',
  'image-compressor': 'ImageCompressorTool',
  'image-resizer': 'ImageResizerTool',
  'heic-to-jpg': 'HeicToJpgTool',
  'pdf-compressor': 'PdfCompressorTool',
  'json-formatter': 'JsonFormatterTool',
  'word-counter': 'WordCounterTool',
  'png-to-jpg': 'PngToJpgTool',
  'jpg-to-webp': 'JpgToWebpTool',
  'favicon-generator': 'FaviconGeneratorTool',
  'png-to-webp': 'PngToWebpTool',
  'webp-to-jpg': 'WebpToJpgTool',
  'pdf-to-jpg': 'PdfToJpgTool',
  'merge-pdf': 'MergePdfTool',
  'json-validator': 'JsonValidatorTool',
  'uuid-generator': 'UuidGeneratorTool',
  'base64-encoder-decoder': 'Base64Tool',
  'character-counter': 'CharacterCounterTool',
  'case-converter': 'CaseConverterTool',
  'hex-to-rgb': 'HexToRgbTool',
};

function wrapLoader(slug: string): () => Promise<{ default: ComponentType }> {
  const loader = importMap[slug];
  const exportName = exportNames[slug];
  return () => loader().then((mod) => ({ default: mod[exportName] }));
}

export const lazyToolComponents: Record<string, React.LazyExoticComponent<ComponentType>> = Object.fromEntries(
  Object.keys(importMap).map((slug) => [slug, lazy(wrapLoader(slug))]),
);
