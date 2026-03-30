import React, { useState, useEffect } from 'react';
import { DynamicRenderer, PageSchema, ComponentProps, TYPE_COLORS } from './DynamicRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, MousePointer2, Layout, Eye, Code2, Save, Maximize2, Minimize2, Monitor, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface WireframeWorkbenchProps {
    schema: PageSchema;
    onSchemaChange?: (schema: PageSchema) => void;
}

export function WireframeWorkbench({ schema, onSchemaChange }: WireframeWorkbenchProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('wireframe');
    const [jsonInput, setJsonInput] = useState(JSON.stringify(schema, null, 2));
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isInspectorOpen, setIsInspectorOpen] = useState(true);
    const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
    const previewContainerRef = React.useRef<HTMLDivElement>(null);

    // Keep jsonInput in sync when schema prop changes externally
    useEffect(() => {
        setJsonInput(JSON.stringify(schema, null, 2));
    }, [schema]);

    useEffect(() => {
        if ((activeTab === 'preview' || activeTab === 'wireframe') && previewContainerRef.current) {
            const observer = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    setPreviewSize({
                        width: Math.round(entry.contentRect.width),
                        height: Math.round(entry.contentRect.height)
                    });
                }
            });
            observer.observe(previewContainerRef.current);
            return () => observer.disconnect();
        }
    }, [activeTab, isFullscreen]);

    const selectedComponent = selectedId ? findComponent(schema.components, selectedId) : null;

    function findComponent(components: ComponentProps[], id: string): ComponentProps | null {
        for (const comp of components) {
            if (comp.id === id) return comp;
            if (comp.components) {
                const found = findComponent(comp.components, id);
                if (found) return found;
            }
        }
        return null;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
        setIsCopied(true);
        toast.success('JSON copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleSaveJson = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            if (onSchemaChange) {
                onSchemaChange(parsed);
                toast.success('Schema updated successfully');
            }
        } catch (e) {
            toast.error('Invalid JSON format');
        }
    };

    const handleUpdateComponent = (updates: Partial<ComponentProps>) => {
        if (!selectedId || !onSchemaChange) return;

        const updateComponentInTree = (components: ComponentProps[]): ComponentProps[] => {
            return components.map(comp => {
                if (comp.id === selectedId) {
                    return { ...comp, ...updates };
                }
                if (comp.components) {
                    return { ...comp, components: updateComponentInTree(comp.components) };
                }
                return comp;
            });
        };

        const newSchema = {
            ...schema,
            components: updateComponentInTree(schema.components)
        };
        
        onSchemaChange(newSchema);
    };

    const handleUpdateLayout = (updates: Partial<ComponentProps['layout']>) => {
        if (!selectedComponent) return;
        handleUpdateComponent({
            layout: { ...selectedComponent.layout, ...updates }
        });
    };

    const handleUpdatePageLayout = (updates: Partial<PageSchema['layout']>) => {
        if (!onSchemaChange) return;
        onSchemaChange({
            ...schema,
            layout: { ...schema.layout, ...updates }
        });
    };

    return (
        <div className="flex h-full w-full gap-6 p-6 bg-zinc-50 dark:bg-[#0a0a0c] overflow-hidden relative">
            {/* Left: Main Canvas Area with Tabs */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-2 shrink-0">
                        <TabsList className="bg-zinc-200/50 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.05] p-1 h-auto rounded-lg">
                            <TabsTrigger value="wireframe" className="text-[10px] font-mono uppercase tracking-widest py-2 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a1f] data-[state=active]:text-indigo-500 data-[state=active]:shadow-sm rounded-md transition-all">
                                <Layout className="w-3.5 h-3.5 mr-2" />
                                Wireframe
                            </TabsTrigger>
                            <TabsTrigger value="preview" className="text-[10px] font-mono uppercase tracking-widest py-2 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a1f] data-[state=active]:text-indigo-500 data-[state=active]:shadow-sm rounded-md transition-all">
                                <Eye className="w-3.5 h-3.5 mr-2" />
                                Preview
                            </TabsTrigger>
                            <TabsTrigger value="code" className="text-[10px] font-mono uppercase tracking-widest py-2 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a1f] data-[state=active]:text-indigo-500 data-[state=active]:shadow-sm rounded-md transition-all">
                                <Code2 className="w-3.5 h-3.5 mr-2" />
                                JSON Editor
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-4">
                            {activeTab === 'wireframe' && (
                                <div className="flex items-center mr-4 border-r border-zinc-200 dark:border-white/10 pr-4">
                                    <Tooltip>
                                        <TooltipTrigger className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                            <Info className="w-4 h-4" />
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" align="end" className="p-4 bg-white dark:bg-[#111113] border-zinc-200 dark:border-white/[0.08] shadow-xl">
                                            <div className="space-y-3">
                                                <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">Component Types</h4>
                                                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                                    {Object.keys(TYPE_COLORS).map(type => (
                                                        <div key={type} className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 rounded-sm border ${TYPE_COLORS[type]}`} />
                                                            <span className="text-[9px] font-mono uppercase tracking-[0.1em] text-zinc-600 dark:text-zinc-300">{type}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            )}
                            {activeTab !== 'preview' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsInspectorOpen(!isInspectorOpen)}
                                    className="h-8 px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                                >
                                    <Layout className="w-3.5 h-3.5 mr-2" />
                                    {isInspectorOpen ? 'Hide Inspector' : 'Show Inspector'}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 mt-4 border border-zinc-200 dark:border-white/[0.08] shadow-sm bg-white dark:bg-[#111113] rounded-xl overflow-hidden relative">
                        <TabsContent value="wireframe" className="h-full m-0 data-[state=inactive]:hidden flex flex-col relative">
                            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-zinc-200 dark:border-white/10 rounded-lg shadow-sm">
                                    <Monitor className="w-3 h-3 text-zinc-500" />
                                    <span className="text-[10px] font-mono font-medium text-zinc-600 dark:text-zinc-400">
                                        {previewSize.width} × {previewSize.height}
                                    </span>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => setIsFullscreen(true)}
                                    className="h-8 w-8 bg-white/90 dark:bg-black/90 backdrop-blur-md border-zinc-200 dark:border-white/10 shadow-sm"
                                >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                            <div className="flex-1 p-6 overflow-auto" ref={activeTab === 'wireframe' ? previewContainerRef : null}>
                                <DynamicRenderer
                                    schema={schema}
                                    mode="wireframe"
                                    onSelect={setSelectedId}
                                    selectedId={selectedId}
                                />
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="preview" className="h-full m-0 data-[state=inactive]:hidden flex flex-col relative">
                            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-zinc-200 dark:border-white/10 rounded-lg shadow-sm">
                                    <Monitor className="w-3 h-3 text-zinc-500" />
                                    <span className="text-[10px] font-mono font-medium text-zinc-600 dark:text-zinc-400">
                                        {previewSize.width} × {previewSize.height}
                                    </span>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => setIsFullscreen(true)}
                                    className="h-8 w-8 bg-white/90 dark:bg-black/90 backdrop-blur-md border-zinc-200 dark:border-white/10 shadow-sm"
                                >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                            <div className="flex-1 p-6 overflow-auto" ref={activeTab === 'preview' ? previewContainerRef : null}>
                                <DynamicRenderer
                                    schema={schema}
                                    mode="preview"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="code" className="h-full m-0 flex flex-col data-[state=inactive]:hidden">
                            <div className="flex-1 p-6 overflow-hidden">
                                <Textarea 
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    className="w-full h-full font-mono text-xs resize-none bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus-visible:ring-1 focus-visible:ring-indigo-500"
                                    spellCheck={false}
                                />
                            </div>
                            <div className="p-4 border-t border-zinc-200 dark:border-white/[0.05] flex justify-end bg-zinc-50 dark:bg-[#0a0a0c]">
                                <Button 
                                    onClick={handleSaveJson}
                                    className="text-xs font-mono uppercase tracking-widest rounded-lg"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Apply Changes
                                </Button>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Right: Inspector */}
            {activeTab !== 'preview' && isInspectorOpen && (
                <div className="absolute top-24 right-10 w-96 flex flex-col gap-6 shrink-0 h-[calc(100%-8rem)] overflow-hidden z-20 shadow-2xl">
                    <Card className="flex-1 rounded-xl border-zinc-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#111113]/95 backdrop-blur-md shadow-sm flex flex-col overflow-hidden">
                    <CardHeader className="py-4 px-6 border-b border-zinc-100 dark:border-white/[0.05] shrink-0 flex flex-row items-center justify-between">
                        <CardTitle className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Inspector</CardTitle>
                        <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg text-[9px] font-mono uppercase tracking-widest border-zinc-200 dark:border-white/10 shadow-sm" onClick={handleCopy}>
                            {isCopied ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
                            Copy JSON
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col items-center justify-center flex-1 overflow-auto scrollbar-hide">
                        {selectedComponent && activeTab === 'wireframe' ? (
                            <div className="w-full space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Component ID</label>
                                    <div className="text-xs font-mono p-3 bg-zinc-50 dark:bg-[#1a1a1f] border border-zinc-100 dark:border-white/[0.05] rounded-lg text-indigo-500">{selectedComponent.id}</div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Type</label>
                                    <div className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-indigo-500/10 text-indigo-500 inline-block rounded-md">{selectedComponent.type}</div>
                                </div>

                                <div className="pt-6 border-t border-zinc-100 dark:border-white/[0.05] space-y-5">
                                    {selectedComponent.text !== undefined && (
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Text Content</Label>
                                            <Input 
                                                type="text"
                                                value={selectedComponent.text}
                                                onChange={(e) => handleUpdateComponent({ text: e.target.value })}
                                                className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus-visible:ring-1 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                    )}
                                    {selectedComponent.placeholder !== undefined && (
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Placeholder</Label>
                                            <Input 
                                                type="text"
                                                value={selectedComponent.placeholder}
                                                onChange={(e) => handleUpdateComponent({ placeholder: e.target.value })}
                                                className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus-visible:ring-1 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                    )}
                                    {selectedComponent.src !== undefined && (
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Image Source</Label>
                                            <Input 
                                                type="text"
                                                value={selectedComponent.src}
                                                onChange={(e) => handleUpdateComponent({ src: e.target.value })}
                                                className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus-visible:ring-1 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                    )}
                                    {selectedComponent.icon !== undefined && (
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Icon Name</Label>
                                            <Input 
                                                type="text"
                                                value={selectedComponent.icon}
                                                onChange={(e) => handleUpdateComponent({ icon: e.target.value })}
                                                className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus-visible:ring-1 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                    )}
                                    {selectedComponent.variant !== undefined && (
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Variant</Label>
                                            <Select 
                                                value={selectedComponent.variant || 'default'}
                                                onValueChange={(value) => handleUpdateComponent({ variant: value })}
                                            >
                                                <SelectTrigger className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus:ring-1 focus:ring-indigo-500">
                                                    <SelectValue placeholder="Select variant" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="default">default</SelectItem>
                                                    <SelectItem value="destructive">destructive</SelectItem>
                                                    <SelectItem value="outline">outline</SelectItem>
                                                    <SelectItem value="secondary">secondary</SelectItem>
                                                    <SelectItem value="ghost">ghost</SelectItem>
                                                    <SelectItem value="link">link</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Width (%)</Label>
                                            <Input 
                                                type="number"
                                                value={selectedComponent.layout.width || 100}
                                                onChange={(e) => handleUpdateLayout({ width: Number(e.target.value) })}
                                                className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus-visible:ring-1 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Height (px)</Label>
                                            <Input 
                                                type="number"
                                                value={selectedComponent.layout.height || ''}
                                                placeholder="Auto"
                                                onChange={(e) => handleUpdateLayout({ height: e.target.value ? Number(e.target.value) : undefined })}
                                                className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus-visible:ring-1 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Flex Direction</Label>
                                            <Select 
                                                value={selectedComponent.layout.direction || 'column'}
                                                onValueChange={(value: 'row' | 'column') => handleUpdateLayout({ direction: value })}
                                            >
                                                <SelectTrigger className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus:ring-1 focus:ring-indigo-500">
                                                    <SelectValue placeholder="Select direction" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="row">row</SelectItem>
                                                    <SelectItem value="column">column</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Spacing</Label>
                                            <Input 
                                                type="number"
                                                value={selectedComponent.layout.spacing || 0}
                                                onChange={(e) => handleUpdateLayout({ spacing: Number(e.target.value) })}
                                                className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus-visible:ring-1 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Padding</Label>
                                            <Input 
                                                type="number"
                                                value={selectedComponent.layout.padding || 0}
                                                onChange={(e) => handleUpdateLayout({ padding: Number(e.target.value) })}
                                                className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus-visible:ring-1 focus-visible:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'wireframe' ? (
                            <div className="w-full space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Root Node</label>
                                    <div className="text-xs font-mono p-3 bg-zinc-50 dark:bg-[#1a1a1f] border border-zinc-100 dark:border-white/[0.05] rounded-lg text-amber-500">Page Layout</div>
                                </div>
                                
                                <div className="pt-6 border-t border-zinc-100 dark:border-white/[0.05] space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Flex Direction</Label>
                                            <Select 
                                                value={schema.layout.direction || 'column'}
                                                onValueChange={(value: 'row' | 'column') => handleUpdatePageLayout({ direction: value })}
                                            >
                                                <SelectTrigger className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus:ring-1 focus:ring-amber-500">
                                                    <SelectValue placeholder="Select direction" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="row">row</SelectItem>
                                                    <SelectItem value="column">column</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Spacing</Label>
                                            <Input 
                                                type="number"
                                                value={schema.layout.spacing || 0}
                                                onChange={(e) => handleUpdatePageLayout({ spacing: Number(e.target.value) })}
                                                className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus-visible:ring-1 focus-visible:ring-amber-500"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Padding</Label>
                                            <Input 
                                                type="number"
                                                value={schema.layout.padding || 0}
                                                onChange={(e) => handleUpdatePageLayout({ padding: Number(e.target.value) })}
                                                className="w-full text-xs font-mono bg-zinc-50 dark:bg-[#1a1a1f] border-zinc-200 dark:border-white/[0.05] focus-visible:ring-1 focus-visible:ring-amber-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-4 opacity-30">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-white/[0.05] rounded-2xl flex items-center justify-center mx-auto">
                                    <MousePointer2 className="w-6 h-6" />
                                </div>
                                <p className="text-[11px] font-mono uppercase tracking-[0.2em] leading-relaxed">
                                    Switch to Wireframe tab<br/>to inspect elements
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            )}

            {/* Fullscreen Preview Portal/Overlay */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[100] bg-zinc-50 dark:bg-[#0a0a0c] flex flex-col">
                    <div className="h-14 border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111113] flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center gap-3">
                            <Monitor className="w-4 h-4 text-zinc-500" />
                            <span className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400">
                                {previewSize.width} × {previewSize.height}
                            </span>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsFullscreen(false)}
                            className="h-8 px-4 text-[10px] font-mono uppercase tracking-widest"
                        >
                            <Minimize2 className="w-3.5 h-3.5 mr-2" />
                            Exit Fullscreen
                        </Button>
                    </div>
                    <div className="flex-1 overflow-auto p-8" ref={previewContainerRef}>
                        <div className="max-w-[1400px] mx-auto bg-white dark:bg-black min-h-full rounded-xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
                            <DynamicRenderer
                                schema={schema}
                                mode={activeTab === 'wireframe' ? 'wireframe' : 'preview'}
                                onSelect={activeTab === 'wireframe' ? setSelectedId : undefined}
                                selectedId={activeTab === 'wireframe' ? selectedId : undefined}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
