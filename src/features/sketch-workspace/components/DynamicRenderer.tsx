import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

export interface LayoutProps {
    direction: 'column' | 'row';
    spacing: number;
    padding: number;
    width?: number;
    height?: number;
}

export interface ComponentProps {
    type: 'container' | 'text' | 'input' | 'button' | 'image' | 'icon';
    id: string;
    layout: LayoutProps;
    text?: string;
    placeholder?: string;
    src?: string;
    variant?: string;
    icon?: string;
    components?: ComponentProps[];
}

export interface PageSchema {
    type: 'page';
    name: string;
    layout: LayoutProps;
    components: ComponentProps[];
}

interface DynamicRendererProps {
    schema: PageSchema | ComponentProps;
    mode?: 'preview' | 'wireframe';
    onSelect?: (id: string | null) => void;
    selectedId?: string | null;
}

export const TYPE_COLORS: Record<string, string> = {
    container: 'border-zinc-400 dark:border-zinc-600 border-dashed bg-zinc-50/50 dark:bg-zinc-800/20',
    text: 'border-amber-400 dark:border-amber-500/50 border-dashed bg-amber-50/50 dark:bg-amber-500/5',
    input: 'border-emerald-400 dark:border-emerald-500/50 border-dashed bg-emerald-50/50 dark:bg-emerald-500/5',
    button: 'border-indigo-400 dark:border-indigo-500/50 border-dashed bg-indigo-50/50 dark:bg-indigo-500/5',
    image: 'border-blue-400 dark:border-blue-500/50 border-dashed bg-blue-50/50 dark:bg-blue-500/5',
    icon: 'border-pink-400 dark:border-pink-500/50 border-dashed bg-pink-50/50 dark:bg-pink-500/5',
};

const TYPE_TEXT_COLORS: Record<string, string> = {
    container: 'text-zinc-500 dark:text-zinc-400',
    text: 'text-amber-600 dark:text-amber-400',
    input: 'text-emerald-600 dark:text-emerald-400',
    button: 'text-indigo-600 dark:text-indigo-400',
    image: 'text-blue-600 dark:text-blue-400',
    icon: 'text-pink-600 dark:text-pink-400',
};

export function DynamicRenderer({ schema, mode = 'preview', onSelect, selectedId }: DynamicRendererProps) {
    const layout = schema.layout;
    const components = schema.components || [];

    const containerStyle: React.CSSProperties = {
        width: layout.width ? `${layout.width}%` : '100%',
        height: layout.height ? `${layout.height}px` : '100%',
    };

    const renderComponent = (comp: ComponentProps) => {
        const isSelected = selectedId === comp.id;
        const wireframeStyle = mode === 'wireframe' ? cn(
            "relative border transition-all duration-200",
            TYPE_COLORS[comp.type],
            isSelected ? "ring-2 ring-indigo-500 dark:ring-indigo-400 ring-offset-2 dark:ring-offset-[#111113] z-10 border-solid" : "hover:border-zinc-500 dark:hover:border-zinc-400"
        ) : "";

        const Label = () => mode === 'wireframe' ? (
            <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-[#111113] z-20">
                <span className={cn("text-[9px] font-mono tracking-wider", TYPE_TEXT_COLORS[comp.type])}>
                    {comp.id}
                </span>
            </div>
        ) : null;

        const onClick = (e: React.MouseEvent) => {
            if (mode === 'wireframe' && onSelect) {
                e.stopPropagation();
                onSelect(comp.id);
            }
        };

        switch (comp.type) {
            case 'container':
                const isForm = comp.id.toLowerCase().includes('form');
                return (
                    <div
                        key={comp.id}
                        className={cn(wireframeStyle, "min-h-[40px]", isForm && "mx-auto")}
                        style={{
                            display: 'flex',
                            flexDirection: comp.layout.direction === 'row' ? 'row' : 'column',
                            gap: `${comp.layout.spacing * 4}px`,
                            padding: `${comp.layout.padding}px`,
                            width: comp.layout.width ? `${comp.layout.width}%` : '100%',
                            maxWidth: isForm ? '450px' : '100%',
                            height: comp.layout.height ? `${comp.layout.height}px` : 'auto',
                        }}
                        onClick={onClick}
                    >
                        <Label />
                        {comp.components?.map(renderComponent)}
                    </div>
                );
            case 'text':
                return (
                    <div key={comp.id} className={cn(wireframeStyle, "p-1")} onClick={onClick} style={{ width: comp.layout.width ? `${comp.layout.width}%` : 'auto' }}>
                        <Label />
                        <p className="text-sm font-medium">{comp.text}</p>
                    </div>
                );
            case 'input':
                return (
                    <div key={comp.id} className={cn(wireframeStyle, "w-full")} onClick={onClick} style={{ width: comp.layout.width ? `${comp.layout.width}%` : '100%' }}>
                        <Label />
                        {mode === 'preview' ? (
                            <Input placeholder={comp.placeholder} className="rounded-none h-10 bg-white dark:bg-black/20" />
                        ) : (
                            <div className="h-10 w-full bg-zinc-100/50 dark:bg-white/[0.05] flex items-center px-3 text-zinc-400 text-xs italic">
                                {comp.placeholder || 'Input Field'}
                            </div>
                        )}
                    </div>
                );
            case 'button':
                return (
                    <div key={comp.id} className={cn(wireframeStyle, "w-full")} onClick={onClick} style={{ width: comp.layout.width ? `${comp.layout.width}%` : '100%' }}>
                        <Label />
                        {mode === 'preview' ? (
                            <Button variant={comp.variant as any || 'default'} className="w-full rounded-none h-10 font-bold uppercase tracking-widest">{comp.text}</Button>
                        ) : (
                            <div className="h-10 w-full bg-zinc-100 dark:bg-white/[0.08] flex items-center justify-center text-zinc-900 dark:text-white text-xs font-bold uppercase tracking-widest">
                                {comp.text}
                            </div>
                        )}
                    </div>
                );
            case 'image':
                return (
                    <div key={comp.id} className={cn(wireframeStyle, "flex items-center justify-center overflow-hidden", !comp.layout.height && "aspect-video")} onClick={onClick} style={{ width: comp.layout.width ? `${comp.layout.width}%` : '100%', height: comp.layout.height ? `${comp.layout.height}px` : 'auto' }}>
                        <Label />
                        {mode === 'preview' && comp.src ? (
                            <img src={comp.src} alt={comp.id} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-zinc-400">
                                <ImageIcon className="w-6 h-6" />
                                <span className="text-[10px] uppercase tracking-tighter font-mono">{comp.src || 'image_placeholder'}</span>
                            </div>
                        )}
                    </div>
                );
            case 'icon':
                return (
                    <div key={comp.id} className={cn(wireframeStyle, "flex items-center justify-center p-2")} onClick={onClick} style={{ width: comp.layout.width ? `${comp.layout.width}%` : 'auto' }}>
                        <Label />
                        <div className="w-6 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-zinc-500" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={cn(
                "w-full h-full overflow-auto scrollbar-hide",
                mode === 'wireframe' ? "bg-white dark:bg-[#111113] p-4 rounded-xl border border-zinc-200 dark:border-white/10 relative" : "bg-white dark:bg-[#111113]"
            )}
            style={containerStyle}
            onClick={() => {
                if (mode === 'wireframe' && onSelect) {
                    onSelect(null);
                }
            }}
        >
            {mode === 'wireframe' && (
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            )}
            <div 
                className="relative z-10 w-full h-full flex" 
                style={{ 
                    flexDirection: layout.direction === 'row' ? 'row' : 'column',
                    gap: `${layout.spacing * 4}px`,
                    padding: `${layout.padding}px`
                }}
            >
                {components.map(renderComponent)}
            </div>
        </div>
    );
}
