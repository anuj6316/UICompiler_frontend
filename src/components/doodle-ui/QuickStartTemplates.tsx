import React from 'react';
import { motion } from 'motion/react';
import { Layout, Monitor, Globe } from 'lucide-react';

interface TemplateElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  stroke: string;
  strokeWidth: number;
  fill?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  icon: any;
  elements: TemplateElement[];
}

export const TEMPLATES: Template[] = [
  {
    id: 'login',
    name: 'Login Page',
    description: 'Centered card with form fields',
    icon: Layout,
    elements: [
      { id: 't1', type: 'rect', x: 300, y: 100, width: 400, height: 500, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't2', type: 'text', x: 420, y: 140, text: 'Login', fontSize: 24, fontFamily: 'sans-serif', stroke: '#000000', strokeWidth: 1 },
      { id: 't3', type: 'rect', x: 340, y: 200, width: 320, height: 40, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't4', type: 'text', x: 360, y: 212, text: 'Email', fontSize: 14, fontFamily: 'sans-serif', stroke: '#999999', strokeWidth: 1 },
      { id: 't5', type: 'rect', x: 340, y: 260, width: 320, height: 40, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't6', type: 'text', x: 360, y: 272, text: 'Password', fontSize: 14, fontFamily: 'sans-serif', stroke: '#999999', strokeWidth: 1 },
      { id: 't7', type: 'rect', x: 340, y: 340, width: 320, height: 48, stroke: '#000000', strokeWidth: 2, fill: '#000000' },
      { id: 't8', type: 'text', x: 460, y: 358, text: 'Sign In', fontSize: 16, fontFamily: 'sans-serif', stroke: '#ffffff', strokeWidth: 1 },
    ],
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Sidebar with content area and cards',
    icon: Monitor,
    elements: [
      { id: 't1', type: 'rect', x: 0, y: 0, width: 200, height: 700, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't2', type: 'rect', x: 200, y: 0, width: 800, height: 700, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't3', type: 'rect', x: 240, y: 40, width: 720, height: 120, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't4', type: 'rect', x: 240, y: 200, width: 220, height: 160, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't5', type: 'rect', x: 480, y: 200, width: 220, height: 160, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't6', type: 'rect', x: 720, y: 200, width: 220, height: 160, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't7', type: 'rect', x: 240, y: 400, width: 720, height: 260, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
    ],
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Hero section with features grid',
    icon: Globe,
    elements: [
      { id: 't1', type: 'rect', x: 0, y: 0, width: 1000, height: 60, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't2', type: 'rect', x: 100, y: 120, width: 800, height: 200, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't3', type: 'text', x: 350, y: 180, text: 'Hero Headline', fontSize: 28, fontFamily: 'sans-serif', stroke: '#000000', strokeWidth: 1 },
      { id: 't4', type: 'rect', x: 350, y: 240, width: 300, height: 40, stroke: '#000000', strokeWidth: 2, fill: '#000000' },
      { id: 't5', type: 'rect', x: 100, y: 380, width: 240, height: 140, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't6', type: 'rect', x: 380, y: 380, width: 240, height: 140, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
      { id: 't7', type: 'rect', x: 660, y: 380, width: 240, height: 140, stroke: '#000000', strokeWidth: 2, fill: 'transparent' },
    ],
  },
];

interface QuickStartTemplatesProps {
  onSelect: (elements: TemplateElement[]) => void;
}

export function QuickStartTemplates({ onSelect }: QuickStartTemplatesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Quick Start Templates</h4>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map((template) => {
            const Icon = template.icon;
            return (
              <motion.button
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(template.elements)}
                className="p-4 text-left border border-zinc-200 dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-white/[0.2] bg-white dark:bg-[#111113] transition-all group"
              >
                <Icon className="w-5 h-5 mb-3 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors" />
                <h5 className="text-xs font-bold uppercase tracking-widest mb-1">{template.name}</h5>
                <p className="text-[10px] text-zinc-500">{template.description}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
