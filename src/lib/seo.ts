import { useEffect } from 'react';
import type { Tool } from '@/types';
import { categories, getCategory } from '@/data/categories';

const SITE_URL = 'https://calcuio.com';

interface SEOOptions {
title: string;
description: string;
canonical?: string;
ogType?: string;
jsonLd?: object | object[];
}

function setMeta(
attr: 'name' | 'property',
key: string,
content: string
) {
let el = document.head.querySelector(
`meta[${attr}="${key}"]`
) as HTMLMetaElement | null;

if (!el) {
el = document.createElement('meta');
el.setAttribute('name', key);
document.head.appendChild(el);
}

// Make sure the requested attribute is correct.
el.setAttribute(attr, key);
el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
let el = document.head.querySelector(
`link[rel="${rel}"]`
) as HTMLLinkElement | null;

if (!el) {
el = document.createElement('link');
el.setAttribute('rel', rel);
document.head.appendChild(el);
}

el.setAttribute('href', href);
}

function removeMeta(attr: 'name' | 'property', key: string) {
const el = document.head.querySelector(
`meta[${attr}="${key}"]`
);

if (el) {
el.remove();
}
}

export function useSEO({
title,
description,
canonical,
ogType = 'website',
jsonLd,
}: SEOOptions) {
useEffect(() => {
document.title = title;

const url = canonical
? `${SITE_URL}${canonical}`
: SITE_URL;

// Basic SEO
setMeta('name', 'description', description);

// Canonical
setLink('canonical', url);

// Open Graph
setMeta('property', 'og:title', title);
setMeta('property', 'og:description', description);
setMeta('property', 'og:url', url);
setMeta('property', 'og:type', ogType);
setMeta('property', 'og:site_name', 'Calcuio');

// Twitter
setMeta('name', 'twitter:card', 'summary');
setMeta('name', 'twitter:title', title);
setMeta('name', 'twitter:description', description);

// Remove previous Calcuio JSON-LD blocks.
const oldScripts = document.head.querySelectorAll(
'script[data-calcuio="jsonld"]'
);

oldScripts.forEach((script) => script.remove());

const scripts: HTMLScriptElement[] = [];

if (jsonLd) {
const items = Array.isArray(jsonLd)
? jsonLd
: [jsonLd];

items.forEach((item) => {
const script = document.createElement('script');

script.type = 'application/ld+json';
script.textContent = JSON.stringify(item);
script.dataset.calcuio = 'jsonld';

document.head.appendChild(script);
scripts.push(script);
});
}

return () => {
scripts.forEach((script) => {
if (document.head.contains(script)) {
document.head.removeChild(script);
}
});
};
}, [
title,
description,
canonical,
ogType,
jsonLd,
]);
}

/* =========================================================
TOOL JSON-LD
========================================================= */

export function toolJsonLd(tool: Tool) {
const cat = getCategory(tool.category);

return {
'@context': 'https://schema.org',
'@type': 'SoftwareApplication',

name: tool.name,

applicationCategory:
cat?.nameKey.replace('cat.', '') || 'Utility',

operatingSystem: 'Web',

description: tool.description,

url: `${SITE_URL}/tools/${tool.slug}`,

offers: {
'@type': 'Offer',
price: '0',
priceCurrency: 'USD',
},

publisher: {
'@type': 'Organization',
name: 'Calcuio',
url: SITE_URL,
},
};
}

/* =========================================================
FAQ JSON-LD
========================================================= */

export function faqJsonLd(
faqs: { q: string; a: string }[]
) {
return {
'@context': 'https://schema.org',
'@type': 'FAQPage',

mainEntity: faqs.map((f) => ({
'@type': 'Question',

name: f.q,

acceptedAnswer: {
'@type': 'Answer',
text: f.a,
},
})),
};
}

/* =========================================================
BREADCRUMB JSON-LD
========================================================= */

export function breadcrumbJsonLd(
items: { name: string; url: string }[]
) {
return {
'@context': 'https://schema.org',
'@type': 'BreadcrumbList',

itemListElement: items.map((item, i) => ({
'@type': 'ListItem',

position: i + 1,

name: item.name,

item: `${SITE_URL}${item.url}`,
})),
};
}

/* =========================================================
WEBSITE JSON-LD
========================================================= */

export function websiteJsonLd() {
return {
'@context': 'https://schema.org',
'@type': 'WebSite',

name: 'Calcuio',

url: SITE_URL,

potentialAction: {
'@type': 'SearchAction',

target: `${SITE_URL}/?q={search_term_string}`,

'query-input':
'required name=search_term_string',
},
};
}

/* =========================================================
ORGANIZATION JSON-LD
========================================================= */

export function organizationJsonLd() {
return {
'@context': 'https://schema.org',
'@type': 'Organization',

name: 'Calcuio',

url: SITE_URL,

description:
'Free, fast and privacy-focused online tools for images, PDFs, text, developers and everyday tasks.',
};
}

/* =========================================================
EXPORTS
========================================================= */

export {
SITE_URL,
categories,
};

