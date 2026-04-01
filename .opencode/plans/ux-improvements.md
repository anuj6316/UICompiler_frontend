# UX Improvements Implementation Plan

## Overview
Comprehensive UX overhaul for the SketchToUI page, fixing flow issues, adding polish, and creating a seamless landing-to-workspace experience.

---

## Files to Create

### 1. `src/components/doodle-ui/ScrollProgress.tsx`
**Purpose**: Thin progress bar at top of landing page showing scroll position

```tsx
import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-zinc-200 origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}
```

---

### 2. `src/components/doodle-ui/KeyboardShortcuts.tsx`
**Purpose**: Modal showing all keyboard shortcuts, triggered by `?` key

```tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PenTool, MousePointer2, Square, Circle, Type, Undo, Redo, Trash2, Zap, Command } from 'lucide-react';

interface KeyboardShortcutsProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { group: 'Tools', items: [
    { keys: ['P'], label: 'Pen Tool', icon: PenTool },
    { keys: ['V'], label: 'Select Tool', icon: MousePointer2 },
    { keys: ['R'], label: 'Rectangle', icon: Square },
    { keys: ['O'], label: 'Circle', icon: Circle },
    { keys: ['T'], label: 'Text', icon: Type },
  ]},
  { group: 'Actions', items: [
    { keys: ['⌘', 'Z'], label: 'Undo' },
    { keys: ['⌘', '⇧', 'Z'], label: 'Redo' },
    { keys: ['Delete'], label: 'Delete Selected' },
    { keys: ['Space'], label: 'Pan Canvas' },
    { keys: ['⌘', 'K'], label: 'Command Palette' },
    { keys: ['?'], label: 'This Modal' },
  ]},
];

export function KeyboardShortcuts({ open, onClose }: KeyboardShortcutsProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-[#111113] border border-zinc-200 dark:border-white/[0.08] z-[101] max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-white/[0.08]">
              <h2 className="text-sm font-bold uppercase tracking-widest">Keyboard Shortcuts</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-white/[0.05]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {SHORTCUTS.map((section) => (
                <div key={section.group}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">{section.group}</h3>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2">
                        <span className="text-sm">{item.label}</span>
                        <div className="flex items-center gap-1">
                          {item.keys.map((key) => (
                            <kbd key={key} className="px-2 py-1 text-xs font-mono bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.08]">
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

### 3. `src/components/doodle-ui/QuickStartTemplates.tsx`
**Purpose**: Template cards shown on empty canvas to quickly start with pre-built layouts

```tsx
import React from 'react';
import { motion } from 'motion/react';
import { Layout, Monitor, Globe } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: any;
  elements: any[];
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
  onSelect: (elements: any[]) => void;
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
```

---

### 4. `src/components/doodle-ui/BackToSketchButton.tsx`
**Purpose**: Prominent back button for wireframe/design/code tabs

```tsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

interface BackToSketchButtonProps {
  onClick: () => void;
}

export function BackToSketchButton({ onClick }: BackToSketchButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="h-8 px-3 rounded-none text-[10px] font-bold uppercase tracking-widest border-zinc-200 dark:border-white/[0.08] hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all"
    >
      <ArrowLeft className="w-3 h-3 mr-1.5" />
      Back to Sketch
    </Button>
  );
}
```

---

## Files to Modify

### 5. `src/features/sketch-workspace/hooks/useCanvas.ts`
**Changes**: Add `loadTemplate` function

```typescript
// Add to the return object of useCanvas:
const loadTemplate = useCallback((templateElements: any[]) => {
  const isDark = document.documentElement.className.includes('dark');
  const stroke = isDark ? '#ffffff' : '#000000';
  
  const processedElements = templateElements.map(el => ({
    ...el,
    stroke: el.stroke === '#000000' ? stroke : el.stroke === '#ffffff' ? (isDark ? '#ffffff' : '#000000') : el.stroke,
    fill: el.fill === '#000000' ? stroke : el.fill === '#ffffff' ? (isDark ? '#ffffff' : '#000000') : el.fill,
  }));
  
  setElements(processedElements);
  setHistory([processedElements]);
  setHistoryStep(0);
}, []);

// Add to return:
return {
  // ... existing returns
  loadTemplate,
};
```

---

### 6. `src/features/sketch-workspace/components/CanvasArea.tsx`
**Changes**: Replace empty state with template selector

**Current empty state** (lines 388-418): Replace with:

```tsx
{canvasState.elements.length === 0 && !canvasState.isDrawing && !generated && (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="absolute inset-0 pointer-events-none flex items-center justify-center z-0"
  >
    <div className="text-center max-w-lg">
      <div className="relative w-20 h-20 mx-auto mb-8">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-zinc-100 dark:bg-white/[0.03] rotate-6" 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <PenTool className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
        </div>
      </div>
      <h3 className="text-lg font-heading font-bold text-zinc-900 dark:text-white mb-2 tracking-tight uppercase">Start Your Project</h3>
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500 leading-relaxed uppercase tracking-widest mb-8">
        Draw freely or pick a template to get started faster
      </p>
      
      <div className="pointer-events-auto">
        <QuickStartTemplates onSelect={(elements) => {
          canvasState.loadTemplate(elements);
          toast.success('Template loaded');
        }} />
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.1]">P</kbd> PEN
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.1]">R</kbd> RECT
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.1]">?</kbd> SHORTCUTS
        </span>
      </div>
    </div>
  </motion.div>
)}
```

**Add import**: `import { QuickStartTemplates } from '../../doodle-ui/QuickStartTemplates';`

---

### 7. `src/features/sketch-workspace/components/ResultPanel.tsx`
**Changes**: Better empty states for wireframe/design/code tabs

**For wireframe tab when no schema** (lines 54-88): Replace with:

```tsx
{currentStep === 'wireframe' && (
  <div className="h-full flex flex-col">
    {generatedSchema ? (
      <WireframeWorkbench schema={generatedSchema} onSchemaChange={setGeneratedSchema} />
    ) : (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-white/[0.05] flex items-center justify-center">
          <FileJson className="w-7 h-7 text-zinc-300 dark:text-zinc-600" />
        </div>
        <div className="max-w-sm space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-widest">No Wireframe Yet</h3>
          <p className="text-xs text-zinc-500">Go back to Sketch and click "Generate UI" to create a wireframe from your drawing.</p>
        </div>
        <Button
          onClick={() => setCurrentStep('sketch')}
          variant="outline"
          className="rounded-none uppercase text-[10px] font-bold tracking-widest h-10 px-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          Back to Sketch
        </Button>
      </div>
    )}
  </div>
)}
```

**For design_system tab** (lines 92-100): Replace with:

```tsx
{currentStep === 'design_system' && (
  <div className="p-12 flex flex-col items-center justify-center h-full text-center space-y-6">
    <Palette className="w-12 h-12 text-zinc-200 dark:text-zinc-700" />
    <h3 className="text-sm font-bold uppercase tracking-widest">Design System</h3>
    <p className="text-xs text-zinc-500 max-w-sm">Generate wireframe first, then design tokens will be auto-created.</p>
    <Button onClick={() => setCurrentStep('wireframe')} variant="outline" className="rounded-none uppercase text-[10px] font-bold tracking-widest h-10 px-6">
      <ArrowLeft className="w-3.5 h-3.5 mr-2" />
      Go to Wireframe
    </Button>
  </div>
)}
```

**For production_code tab** (lines 103-111): Replace with:

```tsx
{currentStep === 'production_code' && (
  <div className="p-12 flex flex-col items-center justify-center h-full text-center space-y-6">
    <Code2 className="w-12 h-12 text-zinc-200 dark:text-zinc-700" />
    <h3 className="text-sm font-bold uppercase tracking-widest">Production Code</h3>
    <p className="text-xs text-zinc-500 max-w-sm">Complete the wireframe and design system steps first.</p>
    <Button onClick={() => setCurrentStep('design_system')} variant="outline" className="rounded-none uppercase text-[10px] font-bold tracking-widest h-10 px-6">
      <ArrowLeft className="w-3.5 h-3.5 mr-2" />
      Go to Design System
    </Button>
  </div>
)}
```

**Add imports**: `import { ArrowLeft } from 'lucide-react';`

---

### 8. `src/pages/SketchToUI.tsx` - Complete Overhaul

**Key changes**:

1. **Add AnimatePresence wrapper** for landing/workspace transitions
2. **Add ScrollProgress** to landing page
3. **Add KeyboardShortcuts modal** with `?` key trigger
4. **Fix PromptArea** - Remove generate button, replace with "Start Creating" CTA
5. **Fix header navigation** - Clear "Back to Landing" button
6. **Add element count badge** in header
7. **Show selected theme** in header
8. **Add BackToSketchButton** in tab bar for non-sketch tabs
9. **Pass prompt to workspace** as context
10. **Persist generation state** in localStorage

**State additions**:
```typescript
const [shortcutsOpen, setShortcutsOpen] = useState(false);
const [initialPrompt, setInitialPrompt] = useState('');
```

**Keyboard shortcut handler**:
```typescript
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
      setShortcutsOpen((open) => !open);
    }
    // ... existing cmd+k handler
  };
  // ...
}, []);
```

**Landing page nav update**:
```tsx
<nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#111113]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/[0.08]">
  <ScrollProgress />
  {/* ... rest of nav */}
</nav>
```

**PromptArea update** - Replace generate button with "Start Creating" that opens workspace:
```tsx
// In PromptArea component, replace the generate button with:
<Button
  onClick={() => {
    if (prompt.trim()) {
      setInitialPrompt(prompt);
    }
    handleStartCreating();
  }}
  className="h-10 px-6 rounded-none text-xs font-bold uppercase tracking-widest bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900"
>
  <ArrowRight className="w-4 h-4 mr-2" />
  Start Creating
</Button>
```

**Header update** - Add element count + theme badge + better back button:
```tsx
<div className="flex items-center gap-2">
  {/* Project name */}
  <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0 rounded-none bg-zinc-100 dark:bg-[#1e1e24] text-zinc-500">
    Draft
  </Badge>
  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0 rounded-none">
    {canvasState.elements.length} elements
  </Badge>
  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0 rounded-none">
    {UI_THEMES.find(t => t.id === selectedUITheme)?.name || 'Modern'}
  </Badge>
</div>
```

**Tab bar update** - Add BackToSketchButton:
```tsx
<div className="bg-white dark:bg-[#111113] border-b border-zinc-200 dark:border-white/[0.05] p-1 flex items-center justify-between shrink-0 z-20">
  <div className="flex items-center gap-1">
    {currentStep !== 'sketch' && (
      <BackToSketchButton onClick={() => setCurrentStep('sketch')} />
    )}
    {/* ... existing tabs */}
  </div>
  {/* ... badge */}
</div>
```

**Add KeyboardShortcuts**:
```tsx
<KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
```

**Wrap in AnimatePresence**:
```tsx
<AnimatePresence mode="wait">
  {showLanding ? (
    <motion.div
      key="landing"
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      {/* Landing content */}
    </motion.div>
  ) : (
    <motion.div
      key="workspace"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Workspace content */}
    </motion.div>
  )}
</AnimatePresence>
```

---

## Implementation Order

1. Create `ScrollProgress.tsx`
2. Create `KeyboardShortcuts.tsx`
3. Create `QuickStartTemplates.tsx`
4. Create `BackToSketchButton.tsx`
5. Update `doodle-ui/index.ts` barrel export
6. Update `useCanvas.ts` - add `loadTemplate`
7. Update `CanvasArea.tsx` - new empty state with templates
8. Update `ResultPanel.tsx` - better empty states with back buttons
9. Overhaul `SketchToUI.tsx` - all UX fixes combined
10. Run typecheck and fix any issues

---

## Expected UX Improvements Summary

| Area | Before | After |
|------|--------|-------|
| Landing → Workspace | Abrupt, no animation | Smooth AnimatePresence transition |
| Empty Canvas | Generic "Prime Canvas" text | 3 quick-start templates + guidance |
| Prompt on Landing | Errors (no canvas) | Opens workspace with prompt pre-filled |
| Navigation | Confusing "Landing" button | Clear "Back to Landing" + breadcrumbs |
| Canvas Awareness | No element count | Badge showing element count + theme |
| Tab Navigation | No way back to sketch | Prominent "Back to Sketch" button |
| Keyboard Shortcuts | Hidden, undocumented | `?` modal with all shortcuts |
| Scroll Awareness | No progress indicator | Thin progress bar on landing |
| Empty Tab States | Generic placeholders | Helpful CTAs with back buttons |
| Theme Carryover | Lost between views | Theme badge shown in workspace header |
