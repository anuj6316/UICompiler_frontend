import React, { useState, useRef, useEffect } from 'react';
import { 
  Wand2, Download, Trash2, Undo, Redo, ChevronLeft, ChevronRight, MousePointer2, 
  PenTool, Square, Circle as CircleIcon, Type, Image as ImageIcon, 
  Play, Code2, Smartphone, Monitor, Tablet, Palette, ChevronDown, 
  CheckCircle2, Loader2, Copy, Check, ExternalLink, History as HistoryIcon,
  Settings, HelpCircle, LogOut, User, Eye, Code, Search, Command, Sliders,
  LayoutDashboard, Layers, Menu, X, ArrowLeft, Calendar, Sun, Moon,
  Layout, Rocket, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser, getInitials } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { env } from '../config/env';
import { useTheme } from '../contexts/ThemeContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { CanvasArea } from '../features/sketch-workspace/components/CanvasArea';
import { ResultPanel, WorkflowTab } from '../features/sketch-workspace/components/ResultPanel';
import { FloatingInspector } from '../features/sketch-workspace/components/FloatingInspector';
import { WireframeWorkbench } from '../features/sketch-workspace/components/WireframeWorkbench';
import { useGeneration } from '../features/sketch-workspace/hooks/useGeneration';
import { useCanvas } from '../features/sketch-workspace/hooks/useCanvas';
import { 
  Button, Card, CardContent, CardHeader, CardTitle, 
  Tabs, TabsContent, TabsList, TabsTrigger, Progress, Badge, 
  ScrollArea, Skeleton, Collapsible, CollapsibleContent, CollapsibleTrigger,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  Avatar, AvatarFallback,
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
  Input, Textarea, Toaster
} from '@/components/ui';
import { toast } from 'sonner';
import {
  HeroSection,
  StylePresets,
  PromptArea,
  GalleryGrid,
  FeatureCards,
  StepGuide,
  FAQSection,
  CTASection,
  ScrollProgress,
  KeyboardShortcuts,
  BackToSketchButton,
  UI_THEMES,
} from '../components/doodle-ui';

const THEMES = [
  { id: 'modern', name: 'Modern', bg: 'bg-white dark:bg-[#111113]', primary: 'bg-zinc-900 dark:bg-zinc-200', text: 'text-zinc-900 dark:text-zinc-200', secondary: 'bg-zinc-100 dark:bg-[#1e1e24]', border: 'border-zinc-200 dark:border-white/[0.1]' },
  { id: 'playful', name: 'Playful', bg: 'bg-yellow-50 dark:bg-purple-950', primary: 'bg-pink-500 dark:bg-pink-400', text: 'text-purple-900 dark:text-purple-100', secondary: 'bg-yellow-100 dark:bg-purple-900', border: 'border-yellow-200 dark:border-purple-800' },
  { id: 'corporate', name: 'Corporate', bg: 'bg-slate-50 dark:bg-slate-900', primary: 'bg-blue-700 dark:bg-blue-500', text: 'text-slate-900 dark:text-slate-100', secondary: 'bg-slate-200 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-700' },
  { id: 'minimal', name: 'Minimal', bg: 'bg-[#FAFAFA] dark:bg-black', primary: 'bg-black dark:bg-white', text: 'text-black dark:text-white', secondary: 'bg-gray-100 dark:bg-zinc-900', border: 'border-gray-200 dark:border-zinc-800' },
];

export default function SketchToUI() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { isDark, toggleTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  const [showLanding, setShowLanding] = useState(true);
  const [selectedSketchStyle, setSelectedSketchStyle] = useState('wireframe');
  const [selectedUITheme, setSelectedUITheme] = useState('modern');
  const [prompt, setPrompt] = useState('');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  
  const [projectName, setProjectName] = useState('Untitled Project');
  const [isEditingName, setIsEditingName] = useState(false);
  const projectNameRef = useRef<HTMLInputElement>(null);
  
  const canvasState = useCanvas();
  const { setTool, undo, redo, clearCanvasBase } = canvasState;

  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        setShortcutsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const genState = useGeneration();
  const { generationState, handleProcessStep, currentStep, setCurrentStep } = genState;
  const generated = generationState === 'ready';

  const handleStartCreating = () => {
    setShowLanding(false);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
  };

  const handleViewExamples = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerate = () => {
    if (canvasState.elements.length > 0) {
      handleProcessStep('wireframe');
      setCurrentStep('wireframe');
      toast.success('UI Cluster created on board');
    } else {
      toast.error('Draw something first!');
    }
  };

  const activeTheme = THEMES.find(t => t.id === selectedUITheme) || THEMES[0];
  const selectedThemeName = UI_THEMES.find(t => t.id === selectedUITheme)?.name || 'Modern';

  const landingView = (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b]">
      <Toaster position="top-center" />
      <ScrollProgress />
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#111113]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold uppercase tracking-widest">Sketch to UI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="h-10 w-10 rounded-none text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button 
              onClick={handleStartCreating}
              className="h-10 px-6 rounded-none text-xs font-bold uppercase tracking-widest bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-300 transition-all"
            >
              Open Workspace
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <HeroSection 
          onStartCreating={handleStartCreating} 
          onViewExamples={handleViewExamples} 
        />
        <StylePresets
          selectedSketchStyle={selectedSketchStyle}
          onSelectSketchStyle={setSelectedSketchStyle}
          selectedUITheme={selectedUITheme}
          onSelectUITheme={setSelectedUITheme}
        />
        <PromptArea
          prompt={prompt}
          onChange={setPrompt}
          onGenerate={() => handleStartCreating()}
          isGenerating={false}
          selectedStyle={selectedSketchStyle}
        />
        <div ref={galleryRef}>
          <GalleryGrid />
        </div>
        <FeatureCards />
        <StepGuide />
        <FAQSection />
        <CTASection onStartCreating={handleStartCreating} />
      </div>

      <KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );

  const workspaceView = (
    <DashboardLayout
      header={({ setIsMobileMenuOpen }) => (
        <header className="h-16 border-b border-zinc-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#111113]/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2.5 bg-white dark:bg-[#1a1a1f] border border-zinc-200 dark:border-white/[0.08] rounded-none text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 shadow-sm dark:shadow-none"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button 
            onClick={handleBackToLanding}
            className="hidden lg:flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-300 active:scale-[0.98] h-11 px-4"
            aria-label="Back to landing page"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Landing</span>
          </button>
          <div className="h-4 w-px bg-zinc-200 dark:bg-white/[0.08] hidden lg:block" />
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <input
                ref={projectNameRef}
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                className="bg-transparent border-none text-sm font-bold focus:ring-0 p-0 text-zinc-900 dark:text-white w-40"
                autoFocus
              />
            ) : (
              <h2 
                onClick={() => setIsEditingName(true)}
                className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white cursor-pointer hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
              >
                {projectName}
              </h2>
            )}
            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0 rounded-none bg-zinc-100 dark:bg-[#1e1e24] text-zinc-500">Draft</Badge>
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0 rounded-none">
              {canvasState.elements.length} elements
            </Badge>
            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0 rounded-none hidden sm:inline-flex">
              {selectedThemeName}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={() => {
              if (canvasState.elements.length > 0) {
                handleProcessStep('wireframe');
                setCurrentStep('wireframe');
                toast.success('UI Cluster created on board');
              } else {
                toast.error('Draw something first!');
              }
            }}
            disabled={genState.generationState !== 'idle'}
            className="h-10 px-6 rounded-none text-xs font-bold uppercase tracking-widest shadow-lg shadow-zinc-200 dark:shadow-none hover:translate-y-[-1px] transition-all bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900"
          >
            {genState.generationState === 'idle' ? (
              <><Wand2 className="w-4 h-4 mr-2 animate-pulse" /> Generate UI</>
            ) : (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Working...</>
            )}
          </Button>

          <div className="h-6 w-px bg-zinc-200 dark:bg-white/[0.08] mx-2" />

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="h-10 w-10 rounded-none text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <div className="h-6 w-px bg-zinc-200 dark:bg-white/[0.08] mx-2" />

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center h-10 w-10 p-0 rounded-none overflow-hidden hover:bg-zinc-100 dark:hover:bg-[#1e1e24] transition-colors focus:outline-none">
                <Avatar className="h-8 w-8 rounded-none border border-zinc-200 dark:border-white/[0.1]">
                  <AvatarFallback className="bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 text-[10px] font-bold">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-none border-zinc-200 dark:border-white/[0.08] dark:bg-[#111113] p-2">
              <div className="flex items-center gap-3 p-3 mb-2 bg-zinc-50 dark:bg-[#1a1a1f] border border-zinc-100 dark:border-white/[0.05]">
                <Avatar className="h-10 w-10 rounded-none">
                  <AvatarFallback className="bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-bold dark:text-white">{user?.firstName} {user?.lastName}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Pro Plan</span>
                </div>
              </div>
              <DropdownMenuItem className="rounded-none text-xs font-bold uppercase tracking-widest p-3"><User className="w-4 h-4 mr-3" /> Profile</DropdownMenuItem>
              <DropdownMenuItem className="rounded-none text-xs font-bold uppercase tracking-widest p-3"><Settings className="w-4 h-4 mr-3" /> Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-100 dark:bg-white/[0.05]" />
              <DropdownMenuItem onClick={logout} className="rounded-none text-xs font-bold uppercase tracking-widest p-3 text-red-500 focus:text-red-500 focus:bg-red-50/10"><LogOut className="w-4 h-4 mr-3" /> Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    )}
  >
    <div className="h-[calc(100vh-4rem)] flex-1 flex flex-col w-full relative overflow-hidden bg-zinc-50 dark:bg-[#09090b]">
      <Toaster position="top-center" />
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="rounded-none border-none">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tools">
            <CommandItem onSelect={() => { setTool('select'); setIsCommandOpen(false); }}>
              <MousePointer2 className="mr-2 h-4 w-4" />
              <span>Select Tool</span>
              <kbd className="ml-auto text-xs">V</kbd>
            </CommandItem>
            <CommandItem onSelect={() => { setTool('pen'); setIsCommandOpen(false); }}>
              <PenTool className="mr-2 h-4 w-4" />
              <span>Pen Tool</span>
              <kbd className="ml-auto text-xs">P</kbd>
            </CommandItem>
            <CommandItem onSelect={() => { setTool('rect'); setIsCommandOpen(false); }}>
              <Square className="mr-2 h-4 w-4" />
              <span>Rectangle Tool</span>
              <kbd className="ml-auto text-xs">R</kbd>
            </CommandItem>
            <CommandItem onSelect={() => { setTool('circle'); setIsCommandOpen(false); }}>
              <CircleIcon className="mr-2 h-4 w-4" />
              <span>Circle Tool</span>
              <kbd className="ml-auto text-xs">O</kbd>
            </CommandItem>
            <CommandItem onSelect={() => { setTool('text'); setIsCommandOpen(false); }}>
              <Type className="mr-2 h-4 w-4" />
              <span>Text Tool</span>
              <kbd className="ml-auto text-xs">T</kbd>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { handleProcessStep('wireframe'); setCurrentStep('wireframe'); setIsCommandOpen(false); }}>
              <Play className="mr-2 h-4 w-4" />
              <span>Generate UI</span>
            </CommandItem>
            <CommandItem onSelect={() => { clearCanvasBase(); setIsCommandOpen(false); }}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Clear Canvas</span>
            </CommandItem>
            <CommandItem onSelect={() => { undo(); setIsCommandOpen(false); }}>
              <Undo className="mr-2 h-4 w-4" />
              <span>Undo</span>
              <kbd className="ml-auto text-xs">⌘Z</kbd>
            </CommandItem>
            <CommandItem onSelect={() => { redo(); setIsCommandOpen(false); }}>
              <Redo className="mr-2 h-4 w-4" />
              <span>Redo</span>
              <kbd className="ml-auto text-xs">⌘⇧Z</kbd>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="bg-white dark:bg-[#111113] border-b border-zinc-200 dark:border-white/[0.05] p-1 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-1">
            {currentStep !== 'sketch' && (
              <BackToSketchButton onClick={() => setCurrentStep('sketch')} />
            )}
            <WorkflowTab
              step="sketch"
              label="00: Sketch"
              isActive={currentStep === 'sketch'}
              icon={<PenTool className="w-3.5 h-3.5" />}
              onClick={() => setCurrentStep('sketch')}
            />
            <div className="w-px h-4 bg-zinc-200 dark:bg-white/10 mx-1" />
            <WorkflowTab
              step="wireframe"
              label="01: Wireframe"
              isActive={currentStep === 'wireframe'}
              icon={<Layout className="w-3.5 h-3.5" />}
              onClick={() => setCurrentStep('wireframe')}
            />
            <div className="w-px h-4 bg-zinc-200 dark:bg-white/10 mx-1" />
            <WorkflowTab
              step="design_system"
              label="02: Design System"
              isActive={currentStep === 'design_system'}
              icon={<Palette className="w-3.5 h-3.5" />}
              onClick={() => setCurrentStep('design_system')}
            />
            <div className="w-px h-4 bg-zinc-200 dark:bg-white/10 mx-1" />
            <WorkflowTab
              step="production_code"
              label="03: Production Code"
              isActive={currentStep === 'production_code'}
              icon={<Rocket className="w-3.5 h-3.5" />}
              onClick={() => setCurrentStep('production_code')}
            />
          </div>
          <div className="flex items-center gap-4 px-4">
            <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-white/[0.02]">
              Agentic Loop v1.0
            </Badge>
          </div>
        </div>

        <div className="relative h-full w-full overflow-hidden">
          {currentStep === 'sketch' && (
            <CanvasArea canvasState={canvasState} generated={generated} />
          )}
          {currentStep !== 'sketch' && genState.generatedSchema && (
            <WireframeWorkbench schema={genState.generatedSchema} onSchemaChange={genState.setGeneratedSchema} />
          )}
        </div>
        <FloatingInspector genState={genState} theme={activeTheme} />
      </div>

      <KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  </DashboardLayout>
  );

  return (
    <AnimatePresence mode="wait">
      {showLanding ? (
        <motion.div
          key="landing"
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
        >
          {landingView}
        </motion.div>
      ) : (
        <motion.div
          key="workspace"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {workspaceView}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
