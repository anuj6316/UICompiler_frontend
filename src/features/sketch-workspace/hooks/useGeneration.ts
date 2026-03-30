import { useState } from 'react';
import { toast } from 'sonner';
import { PageSchema } from '../components/DynamicRenderer';

export type WorkflowStep = 'sketch' | 'wireframe' | 'design_system' | 'production_code';
export type GenerationState = 'idle' | 'processing' | 'ready';

export const SAMPLE_SCHEMA: PageSchema = {
  "type": "page",
  "name": "Login Page",
  "layout": {
    "direction": "column",
    "spacing": 8,
    "padding": 16
  },
  "components": [
    {
      "type": "image",
      "id": "logo",
      "layout": {
        "direction": "column",
        "spacing": 0,
        "padding": 16,
        "width": 100,
        "height": 40
      },
      "src": "logo_placeholder"
    },
    {
      "type": "container",
      "id": "login_form",
      "layout": {
        "direction": "column",
        "spacing": 8,
        "padding": 16,
        "width": 100,
        "height": 60
      },
      "components": [
        {
          "type": "input",
          "id": "username",
          "layout": {
            "direction": "column",
            "spacing": 0,
            "padding": 8,
            "width": 100,
            "height": 8
          },
          "placeholder": "Username"
        },
        {
          "type": "input",
          "id": "password",
          "layout": {
            "direction": "column",
            "spacing": 0,
            "padding": 8,
            "width": 100,
            "height": 8
          },
          "placeholder": "Password"
        },
        {
          "type": "button",
          "id": "login_button",
          "layout": {
            "direction": "column",
            "spacing": 0,
            "padding": 8,
            "width": 100,
            "height": 8
          },
          "text": "Login"
        }
      ]
    }
  ]
};

export function useGeneration() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('sketch');
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [generatedSchema, setGeneratedSchema] = useState<PageSchema | null>(null);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);

  // Design System States
  const [customTheme, setCustomTheme] = useState({
    primary: '#6366f1', // Indigo
    secondary: '#f4f4f5',
    bg: '#ffffff',
    text: '#09090b',
    border: '#e4e4e7'
  });

  const [isCopied, setIsCopied] = useState(false);

  const handleProcessStep = (step: WorkflowStep) => {
    setGenerationState('processing');
    setAgentLogs(prev => [...prev, `Processing ${step} step...`]);

    setTimeout(() => {
      setGenerationState('ready');
      if (step === 'wireframe' && !generatedSchema) {
        setGeneratedSchema(SAMPLE_SCHEMA);
      }
      toast.success(`${step.replace('_', ' ')} processed successfully!`);
    }, 2000);
  };

  const handlePasteSchema = (jsonString: string) => {
    try {
      const schema = JSON.parse(jsonString);
      setGeneratedSchema(schema);
      setCurrentStep('wireframe'); // Ensure we stay in wireframe step
      toast.success('Schema updated successfully!');
    } catch (e) {
      toast.error('Invalid JSON format');
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return {
    currentStep, setCurrentStep,
    generationState, setGenerationState,
    generatedSchema, setGeneratedSchema,
    agentLogs, setAgentLogs,
    customTheme, setCustomTheme,
    isCopied, setIsCopied,
    handleProcessStep,
    handlePasteSchema,
    handleCopy
  };
}
