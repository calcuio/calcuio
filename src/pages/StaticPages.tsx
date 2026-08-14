import { useI18n } from '@/i18n/I18nContext';
import { useSEO, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { FAQ } from '@/components/ui/FAQ';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import {
ShieldCheck,
Zap,
Lock,
Heart,
Mail,
MessageSquare,
FileText,
Image,
Code2,
Type,
ArrowRight,
CheckCircle2,
CalendarDays,
Globe,
Sparkles,
} from 'lucide-react';

/* =========================================================
SHARED COMPONENTS
========================================================= */

function PageHeader({
title,
description,
}: {
title: string;
description: string;
}) {
return (
<div className="mb-8">
<Breadcrumbs
items={[
{ label: 'Calcuio', to: '/' },
{ label: title },
]}
/>

<div className="mt-6 max-w-3xl">
<h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
{title}
</h1>

<p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
{description}
</p>
</div>
</div>
);
}

function LastUpdated({ date = 'August 2026' }: { date?: string }) {
return (
<div className="mb-8 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
<CalendarDays size={14} />
<span>Last updated: {date}</span>
</div>
);
}

function InfoCard({
icon: Icon,
title,
children,
}: {
icon: typeof Zap;
title: string;
children: React.ReactNode;
}) {
return (
<div className="card p-6">
<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
<Icon size={21} />
</div>

<h2 className="mt-4 font-bold text-slate-900 dark:text-white">
{title}
</h2>

<p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
{children}
</p>
</div>
);
}

/* =========================================================
ABOUT
========================================================= */

export function AboutPage() {
useSEO({
title: 'About Calcuio | Free Online Tools',
description:
'Learn about Calcuio, a collection of fast, simple and privacy-focused online tools for images, PDFs, text, developers and everyday tasks.',
canonical: '/about',
jsonLd: breadcrumbJsonLd([
{ name: 'Calcuio', url: '/' },
{ name: 'About', url: '/about' },
]),
});

return (
<div className="container-page py-6 sm:py-10">
<PageHeader
title="About Calcuio"
description="Simple online tools designed to help you get everyday digital tasks done quickly."
/>

<div className="max-w-4xl">
<LastUpdated />

<section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-surface-dark-border dark:bg-surface-dark/50 sm:p-8">
<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
<Sparkles size={23} />
</div>

<h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
Tools that just work
</h2>

<div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
<p>
Calcuio is a collection of free online utility tools created to
make common digital tasks faster, simpler and more accessible.
</p>

<p>
From compressing and converting images to working with PDFs,
formatting JSON, handling text and performing everyday
calculations, Calcuio brings useful tools together in one place.
</p>

<p>
Our goal is to remove unnecessary friction. You should not need
to create an account, install complicated software or navigate
through confusing interfaces just to complete a simple task.
</p>

<p>
Many Calcuio tools are designed to process supported files
directly in your browser. When local processing is supported,
your files can remain on your device instead of being uploaded to
a server.
</p>
</div>
</section>

<div className="mt-6 grid gap-5 md:grid-cols-3">
<InfoCard icon={Zap} title="Fast">
Tools are designed to provide useful results quickly with as few
unnecessary steps as possible.
</InfoCard>

<InfoCard icon={Lock} title="Privacy-focused">
Where supported, file processing happens directly in your browser,
helping keep your files on your device.
</InfoCard>

<InfoCard icon={Heart} title="Simple">
We focus on clear interfaces and practical features instead of
unnecessary complexity.
</InfoCard>
</div>

<section className="mt-8">
<h2 className="text-2xl font-bold text-slate-900 dark:text-white">
What you can do with Calcuio
</h2>

<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
Calcuio is built around practical tools for common digital
workflows.
</p>

<div className="mt-5 grid gap-4 sm:grid-cols-2">
{[
{
icon: Image,
title: 'Image tools',
text: 'Convert, resize and compress common image formats.',
},
{
icon: FileText,
title: 'PDF tools',
text: 'Compress, merge and work with PDF files using simple browser-based tools.',
},
{
icon: Code2,
title: 'Developer tools',
text: 'Format JSON, generate UUIDs and handle common developer tasks.',
},
{
icon: Type,
title: 'Text tools',
text: 'Count words and characters and perform useful text operations.',
},
].map((item) => {
const Icon = item.icon;

return (
<div
key={item.title}
className="card flex gap-4 p-5"
>
<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
<Icon size={20} />
</div>

<div>
<h3 className="font-semibold text-slate-900 dark:text-white">
{item.title}
</h3>

<p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
{item.text}
</p>
</div>
</div>
);
})}
</div>
</section>

<section className="mt-8 rounded-3xl border border-slate-200/80 bg-slate-50 p-6 dark:border-surface-dark-border dark:bg-slate-900/40 sm:p-8">
<div className="flex items-center gap-3">
<Globe
size={22}
className="text-brand-600 dark:text-brand-400"
/>

<h2 className="text-xl font-bold text-slate-900 dark:text-white">
Built for the web
</h2>
</div>

<p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
Calcuio is designed to work across modern desktop and mobile
browsers, making useful tools available wherever you need them.
</p>
</section>

<section className="mt-6 rounded-3xl bg-slate-50 p-6 dark:bg-slate-900/40 sm:p-8">
<h2 className="text-xl font-bold text-slate-900 dark:text-white">
Have an idea?
</h2>

<p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
If you have a suggestion for a new tool or find a problem with an
existing one, we would love to hear from you.
</p>

<a
href="/contact"
className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
>
Contact Calcuio
<ArrowRight size={16} />
</a>
</section>
</div>
</div>
);
}

/* =========================================================
PRIVACY POLICY
========================================================= */

export function PrivacyPage() {
useSEO({
title: 'Privacy Policy | Calcuio',
description:
'Read the Calcuio Privacy Policy and learn how information, files, analytics, cookies and advertising technologies may be handled.',
canonical: '/privacy',
jsonLd: breadcrumbJsonLd([
{ name: 'Calcuio', url: '/' },
{ name: 'Privacy Policy', url: '/privacy' },
]),
});

return (
<div className="container-page py-6 sm:py-10">
<PageHeader
title="Privacy Policy"
description="How Calcuio handles information when you use our website and online tools."
/>

<div className="max-w-4xl">
<LastUpdated />

<div className="prose-calcuio space-y-8">
<section>
<h2>1. Overview</h2>

<p>
Calcuio provides online utility tools for images, PDFs, text,
developer tasks and other everyday activities. We aim to
minimize the information required to use our services and to
provide clear information about how data may be handled.
</p>
</section>

<section>
<h2>2. Files processed by our tools</h2>

<p>
Some Calcuio tools are designed to process files directly in
your web browser. When a tool operates locally, the selected
file is processed on your device rather than being uploaded to a
Calcuio server.
</p>

<p>
Not every tool necessarily uses the same processing method.
Please review the individual tool page for information about how
that specific tool works before processing sensitive or
confidential information.
</p>
</section>

<section>
<h2>3. Information collected when you visit the website</h2>

<p>
Like most websites, Calcuio and its service providers may
process limited technical information required to operate,
secure and improve the website. Depending on the services in use,
this may include browser type, device information, approximate
geographic information, referring pages, pages visited and
general usage information.
</p>
</section>

<section>
<h2>4. Analytics</h2>

<p>
Calcuio may use analytics services to understand how visitors
use the website, which tools are useful and where improvements
are needed.
</p>

<p>
Analytics providers may process information according to their
own privacy policies and applicable user settings or consent
choices.
</p>
</section>

<section>
<h2>5. Cookies and similar technologies</h2>

<p>
Calcuio may use cookies, local storage or similar browser
technologies for essential functionality, preferences,
analytics or advertising, depending on the services enabled on
the website.
</p>

<p>
Third-party services may also use their own cookies or similar
technologies according to their respective policies and
applicable consent requirements.
</p>
</section>

<section>
<h2>6. Advertising</h2>

<p>
Calcuio may display advertising provided by third-party
advertising services. Advertising providers may use cookies or
similar technologies to serve, measure or personalize
advertisements, subject to applicable laws, consent requirements
and user choices.
</p>

<p>
Advertisements are intended to be distinguishable from Calcuio
tools and editorial content.
</p>
</section>

<section>
<h2>7. Local storage</h2>

<p>
Calcuio may use browser storage technologies to remember
preferences such as language, theme, favorites or recently used
tools.
</p>

<p>
Information stored locally in your browser may remain on your
device until you clear your browser storage or the relevant
application data.
</p>
</section>

<section>
<h2>8. Third-party services</h2>

<p>
Some website functions may depend on third-party services.
Those services may collect or process information according to
their own privacy policies.
</p>

<p>
Examples may include analytics, advertising, hosting,
infrastructure, security and other services required to operate
the website.
</p>
</section>

<section>
<h2>9. Children's privacy</h2>

<p>
Calcuio is not specifically directed toward children under the
age required by applicable law. We do not knowingly request
personal information from children.
</p>
</section>

<section>
<h2>10. Data security</h2>

<p>
We take reasonable measures intended to protect the website and
information processed through it. However, no internet
transmission or online service can be guaranteed to be
completely secure.
</p>
</section>

<section>
<h2>11. Changes to this Privacy Policy</h2>

<p>
We may update this Privacy Policy when our services,
technologies or legal requirements change. The updated version
will be published on this page and the “Last updated” date may
be changed accordingly.
</p>
</section>

<section>
<h2>12. Contact</h2>

<p>
If you have questions about this Privacy Policy, contact us at{' '}
<strong>hello@calcuio.com</strong>.
</p>
</section>
</div>
</div>
</div>
);
}

/* =========================================================
TERMS OF USE
========================================================= */

export function TermsPage() {
useSEO({
title: 'Terms of Use | Calcuio',
description:
'Read the Calcuio Terms of Use covering access to our online tools, acceptable use, user responsibilities and service limitations.',
canonical: '/terms',
jsonLd: breadcrumbJsonLd([
{ name: 'Calcuio', url: '/' },
{ name: 'Terms of Use', url: '/terms' },
]),
});

return (
<div className="container-page py-6 sm:py-10">
<PageHeader
title="Terms of Use"
description="The rules and conditions that apply when using Calcuio."
/>

<div className="max-w-4xl">
<LastUpdated />

<div className="prose-calcuio space-y-8">
<section>
<h2>1. Acceptance of these terms</h2>

<p>
By accessing or using Calcuio, you agree to these Terms of Use.
If you do not agree with these terms, please do not use the
website.
</p>
</section>

<section>
<h2>2. Our services</h2>

<p>
Calcuio provides online tools and informational content. Tools
may include image, PDF, text, developer, calculator and other
utility features.
</p>

<p>
Features may be added, changed, suspended or removed as the
service develops.
</p>
</section>

<section>
<h2>3. Use of the tools</h2>

<p>
You may use Calcuio for lawful personal or commercial purposes,
subject to these terms and applicable laws.
</p>
</section>

<section>
<h2>4. Prohibited use</h2>

<p>You must not use Calcuio to:</p>

<ul>
<li>Break applicable laws or regulations.</li>
<li>Attempt to disrupt, damage or overload the website.</li>
<li>Abuse automated systems or infrastructure.</li>
<li>Attempt to gain unauthorized access to our systems.</li>
<li>
Process or distribute content that you do not have the right
to use.
</li>
<li>Interfere with the experience or access of other users.</li>
</ul>
</section>

<section>
<h2>5. Your files and content</h2>

<p>
You are responsible for the files, text and other content you
choose to process using Calcuio.
</p>

<p>
You should maintain backups of important files before using any
online tool or service.
</p>
</section>

<section>
<h2>6. Accuracy of results</h2>

<p>
We aim to provide useful and accurate tools, but results should
be reviewed before being used for important decisions,
professional work or legal, financial, medical or other
regulated purposes.
</p>
</section>

<section>
<h2>7. Availability</h2>

<p>
We aim to keep Calcuio available and functional, but we do not
guarantee uninterrupted availability or that every tool will
always operate without errors.
</p>
</section>

<section>
<h2>8. Third-party services</h2>

<p>
Some features may rely on third-party services. Calcuio is not
responsible for the independent operation, policies or
availability of third-party services.
</p>
</section>

<section>
<h2>9. Disclaimer</h2>

<p>
Calcuio is provided on an “as is” and “as available” basis to
the extent permitted by applicable law. We do not guarantee that
the website or its tools will always be available, accurate,
complete or suitable for every purpose.
</p>
</section>

<section>
<h2>10. Limitation of liability</h2>

<p>
To the extent permitted by applicable law, Calcuio and its
operators shall not be responsible for indirect, incidental,
special or consequential losses arising from the use of, or
inability to use, the website or its tools.
</p>
</section>

<section>
<h2>11. Changes to these terms</h2>

<p>
We may update these Terms of Use as the service develops.
Changes will be published on this page and the “Last updated”
date may be changed accordingly.
</p>
</section>

<section>
<h2>12. Contact</h2>

<p>
Questions about these terms can be sent to{' '}
<strong>hello@calcuio.com</strong>.
</p>
</section>
</div>
</div>
</div>
);
}

/* =========================================================
CONTACT
========================================================= */

export function ContactPage() {
useSEO({
title: 'Contact Calcuio | Get in Touch',
description:
'Contact the Calcuio team for questions, bug reports, tool suggestions and feedback.',
canonical: '/contact',
jsonLd: breadcrumbJsonLd([
{ name: 'Calcuio', url: '/' },
{ name: 'Contact', url: '/contact' },
]),
});

return (
<div className="container-page py-6 sm:py-10">
<PageHeader
title="Contact Calcuio"
description="Questions, feedback, bug reports or ideas for a new tool? We would love to hear from you."
/>

<div className="max-w-4xl">
<div className="grid gap-6 md:grid-cols-2">
<div className="card p-6 sm:p-8">
<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
<Mail size={22} />
</div>

<h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
Email us
</h2>

<p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
For general questions, support requests, bug reports, tool
suggestions and business inquiries.
</p>

<a
href="mailto:hello@calcuio.com"
className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
>
hello@calcuio.com
<ArrowRight size={16} />
</a>
</div>

<div className="card p-6 sm:p-8">
<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
<MessageSquare size={22} />
</div>

<h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
What can you contact us about?
</h2>

<ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
{[
'Report a bug or broken tool',
'Suggest a new tool',
'Ask a question',
'Share feedback',
'Business or partnership inquiries',
].map((item) => (
<li key={item} className="flex items-start gap-2">
<CheckCircle2
size={16}
className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400"
/>
<span>{item}</span>
</li>
))}
</ul>
</div>
</div>

<div className="mt-6 rounded-3xl bg-slate-50 p-6 dark:bg-slate-900/40 sm:p-8">
<h2 className="text-xl font-bold text-slate-900 dark:text-white">
Before contacting us
</h2>

<p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
If you are reporting a problem with a tool, please include the
tool name, the browser or device you are using and a short
description of what happened. This helps us investigate the issue
faster.
</p>

<p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
We generally aim to respond within 1–2 business days.
</p>
</div>

<div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-surface-dark-border dark:bg-surface-dark/50">
<ShieldCheck
size={20}
className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-400"
/>

<p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
Please do not send passwords, payment information or other
sensitive personal information by email unless specifically
requested.
</p>
</div>
</div>
</div>
);
}

/* =========================================================
FAQ
========================================================= */

export function FaqPage() {
const { t } = useI18n();

const faqs = [
{
q: t('faq.q1'),
a: t('faq.a1'),
},
{
q: t('faq.q2'),
a: t('faq.a2'),
},
{
q: t('faq.q3'),
a: t('faq.a3'),
},
{
q: t('faq.q4'),
a: t('faq.a4'),
},
{
q: t('faq.q5'),
a: t('faq.a5'),
},
{
q: 'Are Calcuio tools free?',
a: 'Many Calcuio tools are available for free. We aim to keep core functionality accessible without requiring an account.',
},
{
q: 'Do I need to create an account?',
a: 'No account is required for the core tools currently available on Calcuio.',
},
{
q: 'Are my files uploaded?',
a: 'Tools that support local browser processing handle your files directly on your device. The behavior can vary by tool, so check the individual tool page for details.',
},
{
q: 'Can I use Calcuio on my phone?',
a: 'Yes. Calcuio is designed to work on modern desktop and mobile browsers.',
},
{
q: 'Which file formats are supported?',
a: 'Supported formats depend on the individual tool. Each tool page lists the formats it supports.',
},
{
q: 'Can I suggest a new tool?',
a: 'Yes. We welcome suggestions. Send your idea to hello@calcuio.com.',
},
{
q: 'Can I report a problem?',
a: 'Absolutely. Contact us at hello@calcuio.com and include the tool name and a description of the problem.',
},
];

useSEO({
title: 'Frequently Asked Questions | Calcuio',
description:
'Find answers to common questions about Calcuio tools, privacy, files, supported formats and using the website.',
canonical: '/faq',
jsonLd: [
breadcrumbJsonLd([
{ name: 'Calcuio', url: '/' },
{ name: 'FAQ', url: '/faq' },
]),
faqJsonLd(faqs),
],
});

return (
<div className="container-page py-6 sm:py-10">
<PageHeader
title="Frequently Asked Questions"
description="Answers to common questions about Calcuio and its online tools."
/>

<div className="max-w-4xl">
<FAQ questions={faqs} />
</div>
</div>
);
}

/* =========================================================
BLOG
========================================================= */

const blogPosts = [
{
slug: 'how-to-convert-heic-to-jpg',
category: 'Image Guide',
title: 'How to Convert HEIC to JPG on iPhone and PC',
description:
'Learn what HEIC is, why iPhones use it, and how to convert HEIC photos to JPG for easier sharing and compatibility.',
date: 'August 2026',
tool: '/tools/heic-to-jpg',
},
{
slug: 'how-to-compress-image',
category: 'Image Guide',
title: 'How to Compress an Image Without Losing Quality',
description:
'Learn how image compression works and how to reduce JPG, PNG and WebP file sizes while keeping images looking sharp.',
date: 'August 2026',
tool: '/tools/image-compressor',
},
{
slug: 'jpg-vs-png-vs-webp',
category: 'Web & Images',
title: 'JPG vs PNG vs WebP: Which Image Format Should You Use?',
description:
'A practical comparison of JPG, PNG and WebP, including quality, transparency, file size and website performance.',
date: 'August 2026',
tool: '/tools/image-compressor',
},
{
slug: 'how-to-make-pdf-smaller',
category: 'PDF Guide',
title: 'How to Make a PDF File Smaller',
description:
'Discover practical ways to reduce PDF file size for email, websites and online submissions.',
date: 'August 2026',
tool: '/tools/pdf-compressor',
},
{
slug: 'how-to-merge-pdf-files',
category: 'PDF Guide',
title: 'How to Merge PDF Files Into One Document',
description:
'Learn how to combine multiple PDF files into one organized document without complicated software.',
date: 'August 2026',
tool: '/tools/merge-pdf',
},
{
slug: 'how-to-format-json',
category: 'Developer Guide',
title: 'How to Format and Beautify JSON',
description:
'Understand JSON formatting and learn how to make large JSON objects easier to read and debug.',
date: 'August 2026',
tool: '/tools/json-formatter',
},
];

export function BlogPage() {
useSEO({
title: 'Calcuio Blog | Guides, Tips and Tutorials',
description:
'Practical guides and tutorials about images, PDFs, developer tools, text and everyday digital tasks.',
canonical: '/blog',
jsonLd: breadcrumbJsonLd([
{ name: 'Calcuio', url: '/' },
{ name: 'Blog', url: '/blog' },
]),
});

return (
<div className="container-page py-6 sm:py-10">
<PageHeader
title="Calcuio Blog"
description="Practical guides, tutorials and tips to help you get more from everyday digital tools."
/>

<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
{blogPosts.map((post) => (
<article
key={post.slug}
className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-surface-dark-border dark:bg-surface-dark/50"
>
<div className="h-2 bg-brand-600 dark:bg-brand-500" />

<div className="flex flex-1 flex-col p-6">
<div className="flex items-center justify-between gap-3">
<span className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
{post.category}
</span>

<span className="text-xs text-slate-400">
{post.date}
</span>
</div>

<h2 className="mt-4 text-xl font-bold leading-snug text-slate-900 dark:text-white">
{post.title}
</h2>

<p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
{post.description}
</p>

<div className="mt-6 flex flex-wrap gap-4">
<a
href={post.tool}
className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
>
Try the related tool
<ArrowRight
size={16}
className="transition-transform group-hover:translate-x-0.5"
/>
</a>
</div>
</div>
</article>
))}
</div>

<section className="mt-10 rounded-3xl border border-slate-200/80 bg-slate-50 p-6 dark:border-surface-dark-border dark:bg-slate-900/40 sm:p-8">
<div className="flex items-center gap-3">
<FileText
size={22}
className="text-brand-600 dark:text-brand-400"
/>

<h2 className="text-xl font-bold text-slate-900 dark:text-white">
More guides are coming
</h2>
</div>

<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
We are building a growing library of practical guides covering image
formats, PDF workflows, developer utilities, text tools and everyday
productivity.
</p>
</section>
</div>
);
}

/* =========================================================
404
========================================================= */

export function NotFoundPage() {
const { t } = useI18n();

useSEO({
title: `${t('page.404.title')} | Calcuio`,
description: t('page.404.sub'),
canonical: '/404',
});

return (
<div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
<p className="text-6xl font-bold text-brand-200 dark:text-brand-500/30">
404
</p>

<h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
{t('page.404.title')}
</h1>

<p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
{t('page.404.sub')}
</p>

<div className="mt-6 flex flex-wrap justify-center gap-2.5">
<a href="/" className="btn btn-primary">
{t('page.404.back')}
</a>

<a href="/tools" className="btn btn-outline">
{t('page.404.search')}
</a>

<a href="/categories" className="btn btn-ghost">
{t('page.404.categories')}
</a>
</div>
</div>
);
}

