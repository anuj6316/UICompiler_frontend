import { Pencil, PenTool, Layout, Minus, Palette, Zap, Code2, Layers, Monitor, Download } from 'lucide-react';

export interface SketchStyle {
  id: string;
  name: string;
  icon: any;
  description: string;
  promptInjection: string;
  color: string;
  bgColor: string;
}

export const SKETCH_STYLES: SketchStyle[] = [
  {
    id: 'graphite',
    name: 'Graphite Sketch',
    icon: Pencil,
    description: 'Loose graphite strokes with pressure variance for storyboards',
    promptInjection: 'rough graphite sketch, pencil texture, hatch shading, muted paper grain',
    color: 'text-zinc-700 dark:text-zinc-300',
    bgColor: 'bg-zinc-100 dark:bg-zinc-800',
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    icon: PenTool,
    description: 'Technical blueprint grid for precise UI planning',
    promptInjection: 'technical blueprint, grid lines, mono weight stroke, architectural style',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    id: 'wireframe',
    name: 'Wireframe',
    icon: Layout,
    description: 'Low-fidelity UI lines for fast ideation',
    promptInjection: 'lo-fi wireframe, blueprint grid, mono weight stroke, margin annotations',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950',
  },
  {
    id: 'lineart',
    name: 'Line Art',
    icon: Minus,
    description: 'Clean black outlines for minimal sketches',
    promptInjection: 'single weight black line, no fill, clean outlines, minimal line art',
    color: 'text-zinc-900 dark:text-zinc-100',
    bgColor: 'bg-zinc-50 dark:bg-zinc-900',
  },
];

export interface UITheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  bg: string;
  primary: string;
  text: string;
  secondary: string;
  border: string;
}

export const UI_THEMES: UITheme[] = [
  {
    id: 'modern',
    name: 'Modern Clean',
    description: 'Minimal, spacious design with subtle shadows',
    preview: 'bg-white dark:bg-zinc-900',
    bg: 'bg-white dark:bg-[#111113]',
    primary: 'bg-zinc-900 dark:bg-zinc-200',
    text: 'text-zinc-900 dark:text-zinc-200',
    secondary: 'bg-zinc-100 dark:bg-[#1e1e24]',
    border: 'border-zinc-200 dark:border-white/[0.1]',
  },
  {
    id: 'playful',
    name: 'Playful Bold',
    description: 'Vibrant colors with rounded elements',
    preview: 'bg-gradient-to-br from-pink-400 to-yellow-400',
    bg: 'bg-yellow-50 dark:bg-purple-950',
    primary: 'bg-pink-500 dark:bg-pink-400',
    text: 'text-purple-900 dark:text-purple-100',
    secondary: 'bg-yellow-100 dark:bg-purple-900',
    border: 'border-yellow-200 dark:border-purple-800',
  },
  {
    id: 'corporate',
    name: 'Corporate Pro',
    description: 'Professional blue tones for enterprise apps',
    preview: 'bg-gradient-to-br from-blue-600 to-slate-700',
    bg: 'bg-slate-50 dark:bg-slate-900',
    primary: 'bg-blue-700 dark:bg-blue-500',
    text: 'text-slate-900 dark:text-slate-100',
    secondary: 'bg-slate-200 dark:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-700',
  },
  {
    id: 'minimal',
    name: 'Ultra Minimal',
    description: 'Stark contrast, maximum whitespace',
    preview: 'bg-zinc-900 dark:bg-white',
    bg: 'bg-[#FAFAFA] dark:bg-black',
    primary: 'bg-black dark:bg-white',
    text: 'text-black dark:text-white',
    secondary: 'bg-gray-100 dark:bg-zinc-900',
    border: 'border-gray-200 dark:border-zinc-800',
  },
];

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  gradient: string;
  aspectRatio: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    title: 'Dashboard Layout',
    description: 'Analytics dashboard with sidebar navigation',
    category: 'Dashboard',
    gradient: 'from-violet-500 to-purple-600',
    aspectRatio: 'aspect-[4/3]',
  },
  {
    id: '2',
    title: 'Login Flow',
    description: 'Multi-step authentication interface',
    category: 'Auth',
    gradient: 'from-blue-500 to-cyan-500',
    aspectRatio: 'aspect-square',
  },
  {
    id: '3',
    title: 'E-commerce Product',
    description: 'Product page with image gallery',
    category: 'E-commerce',
    gradient: 'from-emerald-500 to-teal-600',
    aspectRatio: 'aspect-[4/3]',
  },
  {
    id: '4',
    title: 'Social Feed',
    description: 'Infinite scroll social media layout',
    category: 'Social',
    gradient: 'from-orange-500 to-pink-500',
    aspectRatio: 'aspect-video',
  },
  {
    id: '5',
    title: 'Settings Panel',
    description: 'User preferences and account settings',
    category: 'Settings',
    gradient: 'from-slate-500 to-zinc-600',
    aspectRatio: 'aspect-square',
  },
  {
    id: '6',
    title: 'Landing Page',
    description: 'Marketing page with hero and features',
    category: 'Marketing',
    gradient: 'from-rose-500 to-red-600',
    aspectRatio: 'aspect-[4/3]',
  },
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How does Sketch to UI work?',
    answer: 'Draw your interface idea on the canvas, select a style preset, and our AI analyzes your sketch to generate production-ready UI components. The system infers layout structure, component hierarchy, and design tokens from your rough sketches.',
  },
  {
    question: 'Do I need design experience?',
    answer: 'Not at all. Rough sketches work perfectly. The AI is trained to understand UI patterns from even the most basic wireframes. Focus on layout and structure, and let the intelligence handle the details.',
  },
  {
    question: 'What kind of components can it generate?',
    answer: 'Navigation bars, forms, cards, modals, tables, dashboards, landing pages, and more. The system recognizes common UI patterns and generates appropriate React components with Tailwind CSS styling.',
  },
  {
    question: 'Can I customize the generated output?',
    answer: 'Yes. After generation, you can edit the wireframe, adjust the design system tokens, and modify the production code. Each step in the workflow is fully interactive.',
  },
  {
    question: 'What frameworks are supported?',
    answer: 'Currently generates React components with Tailwind CSS. The architecture is designed to support additional frameworks in future updates.',
  },
];

export const FEATURES = [
  {
    title: 'AI-Powered Recognition',
    description: 'Intelligent pattern recognition transforms rough sketches into structured UI components with accurate layout inference.',
    icon: Zap,
    size: 'large' as const,
    gradient: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/5 dark:to-purple-500/5',
  },
  {
    title: 'Instant Wireframes',
    description: 'Generate interactive wireframes in seconds from your sketches.',
    icon: Layout,
    size: 'medium' as const,
    gradient: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5',
  },
  {
    title: 'Design System Tokens',
    description: 'Automatically generate theme tokens, typography, and color palettes.',
    icon: Palette,
    size: 'medium' as const,
    gradient: 'from-pink-500/10 to-rose-500/10 dark:from-pink-500/5 dark:to-rose-500/5',
  },
  {
    title: 'Production Code',
    description: 'Export clean, production-ready React components with Tailwind CSS styling that follows modern best practices.',
    icon: Code2,
    size: 'large' as const,
    gradient: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5',
  },
  {
    title: 'Interactive Preview',
    description: 'Test your UI in real-time.',
    icon: Monitor,
    size: 'small' as const,
    gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5',
  },
  {
    title: 'Export Ready',
    description: 'Download as code or preview.',
    icon: Download,
    size: 'small' as const,
    gradient: 'from-slate-500/10 to-zinc-500/10 dark:from-slate-500/5 dark:to-zinc-500/5',
  },
];

export const STEPS = [
  {
    number: '01',
    title: 'Sketch',
    description: 'Draw your interface idea on the canvas using pen, shapes, or text tools.',
    icon: Pencil,
  },
  {
    number: '02',
    title: 'Style',
    description: 'Pick a sketch style and UI theme to define the aesthetic direction.',
    icon: Palette,
  },
  {
    number: '03',
    title: 'Generate',
    description: 'AI analyzes your sketch and generates structured UI components.',
    icon: Zap,
  },
  {
    number: '04',
    title: 'Refine',
    description: 'Edit wireframes, adjust design tokens, and export production code.',
    icon: Layers,
  },
];
