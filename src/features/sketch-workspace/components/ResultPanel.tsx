import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wand2, ChevronDown, Loader2, Check, Play, CheckCircle2,
  Code2, Palette, FileJson, Copy, Layout, Settings, Rocket, ArrowLeft
} from 'lucide-react';
import {
  Button, Card, CardContent, CardHeader, CardTitle,
  Tabs, TabsContent, TabsList, TabsTrigger, Progress, Badge,
  Textarea
} from '@/components/ui';
import { WireframeWorkbench } from './WireframeWorkbench';
import { SAMPLE_SCHEMA, WorkflowStep } from '../hooks/useGeneration';

interface ResultPanelProps {
  genState: any;
  theme: any;
  nodeTitle?: string;
  isFloating?: boolean;
}

export function ResultPanel({ genState, theme, nodeTitle, isFloating }: ResultPanelProps) {
  const {
    currentStep, setCurrentStep,
    generationState, setGeneratedSchema,
    generatedSchema, handlePasteSchema,
    handleProcessStep, isCopied, handleCopy
  } = genState;

  const [pasteValue, setPasteValue] = useState('');

  return (
    <div className={`flex flex-col w-full h-full relative ${isFloating ? 'bg-transparent' : 'bg-zinc-50 dark:bg-[#0a0a0c]'}`}>
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {generationState === 'processing' ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center"
            >
              <Loader2 className="w-12 h-12 animate-spin text-zinc-400 mb-6" />
              <h3 className="text-xl font-bold uppercase tracking-widest">Agent is thinking...</h3>
              <p className="text-sm text-zinc-500 mt-2">Optimizing your workflow for production excellence.</p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="h-full">
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
        </div>
      </div>
    </div>
  );
}

export function WorkflowTab({ label, isActive, icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2.5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all
        ${isActive
          ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.08]'
          : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}
