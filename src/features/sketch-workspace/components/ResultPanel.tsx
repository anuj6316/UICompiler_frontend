import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wand2, ChevronDown, Loader2, Check, Play, CheckCircle2,
  Code2, Palette, FileJson, Copy, Layout, Settings, Rocket
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
}

export function ResultPanel({ genState, theme, nodeTitle }: ResultPanelProps) {
  const {
    currentStep, setCurrentStep,
    generationState, setGeneratedSchema,
    generatedSchema, handlePasteSchema,
    handleProcessStep, isCopied, handleCopy
  } = genState;

  const [pasteValue, setPasteValue] = useState('');

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden bg-zinc-50 dark:bg-[#0a0a0c]">
      <div className="flex-1 overflow-hidden relative">
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

        <div className="h-full overflow-auto scrollbar-hide">
          {currentStep === 'wireframe' && (
            <div className="h-full flex flex-col">
              {generatedSchema ? (
                <WireframeWorkbench schema={generatedSchema} onSchemaChange={setGeneratedSchema} />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8">
                  <div className="w-20 h-20 bg-white dark:bg-[#1a1a1f] border border-zinc-100 dark:border-white/[0.08] flex items-center justify-center">
                    <FileJson className="w-8 h-8 text-zinc-300" />
                  </div>
                  <div className="max-w-md space-y-3">
                    <h3 className="text-xl font-bold tracking-tight">Wireframe Workbench</h3>
                    <p className="text-sm text-zinc-500">Paste your VLM-generated JSON output below to trigger the interactive wireframe renderer.</p>
                  </div>
                  <div className="w-full max-w-lg space-y-4">
                    <Textarea
                      placeholder="Paste JSON here..."
                      className="min-h-[200px] font-mono text-[10px] bg-white dark:bg-black/20 rounded-none resize-none"
                      value={pasteValue}
                      onChange={(e) => setPasteValue(e.target.value)}
                    />
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 rounded-none uppercase text-[10px] font-bold tracking-widest h-12"
                        onClick={() => handlePasteSchema(JSON.stringify(SAMPLE_SCHEMA, null, 2))}
                      >
                        Load Sample
                      </Button>
                      <Button
                        className="flex-1 rounded-none uppercase text-[10px] font-bold tracking-widest h-12"
                        disabled={!pasteValue}
                        onClick={() => handlePasteSchema(pasteValue)}
                      >
                        Initialize Preview
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 'design_system' && (
            <div className="p-12 flex flex-col items-center justify-center h-full text-center space-y-6">
              <Palette className="w-16 h-16 text-zinc-200" />
              <h3 className="text-xl font-bold uppercase tracking-widest">Step 02: Design System</h3>
              <p className="text-sm text-zinc-500 max-w-sm">Finalize your theme tokens, typography, and adaptive color palettes before moving to production code.</p>
              <Button onClick={() => handleProcessStep('design_system')} className="rounded-none h-12 px-8 uppercase text-[10px] font-bold tracking-widest">
                Process Design Tokens
              </Button>
            </div>
          )}

          {currentStep === 'production_code' && (
            <div className="p-12 flex flex-col items-center justify-center h-full text-center space-y-6">
              <Code2 className="w-16 h-16 text-zinc-200" />
              <h3 className="text-xl font-bold uppercase tracking-widest">Step 03: Production Code</h3>
              <p className="text-sm text-zinc-500 max-w-sm">Generating high-quality React components using Tailwind CSS and modern best practices.</p>
              <Button onClick={() => handleProcessStep('production_code')} className="rounded-none h-12 px-8 uppercase text-[10px] font-bold tracking-widest">
                Generate Production Assets
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
