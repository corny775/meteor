'use client';

import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getEducationalTerm, type EducationalTerm } from '@/lib/educational-content';

interface InfoTooltipProps {
  termKey?: string; // Key from educational-content.ts
  title?: string;
  description?: string;
  example?: string;
  formula?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function InfoTooltip({ 
  termKey, 
  title, 
  description, 
  example, 
  formula,
  size = 'sm'
}: InfoTooltipProps) {
  // If termKey is provided, fetch from educational content
  let content: EducationalTerm | undefined;
  if (termKey) {
    content = getEducationalTerm(termKey);
  }

  const displayTitle = content?.term || title || 'Information';
  const displayDescription = content?.detailedDescription || description || '';
  const displayExample = content?.example || example;
  const displayFormula = content?.formula || formula;

  const iconSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className="inline-flex ml-1.5 text-gray-400 hover:text-space-cyan transition-colors focus:outline-none focus:ring-2 focus:ring-space-cyan/50 rounded-full"
            aria-label={`Learn more about ${displayTitle}`}
          >
            <HelpCircle className={iconSize} />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-md glass-morphism border-space-cyan/30 bg-black/95 backdrop-blur-xl p-4 shadow-2xl shadow-space-cyan/20"
          sideOffset={5}
        >
          <div className="space-y-2.5">
            <h4 className="font-bold text-space-cyan text-sm tracking-wide">{displayTitle}</h4>
            <p className="text-gray-300 text-xs leading-relaxed">{displayDescription}</p>
            {displayFormula && (
              <div className="p-2.5 rounded bg-space-dark/50 border border-space-cyan/20">
                <p className="text-xs font-mono text-space-neon">{displayFormula}</p>
              </div>
            )}
            {displayExample && (
              <div className="pt-2 border-t border-gray-700">
                <p className="text-xs text-gray-400 leading-relaxed">
                  <span className="font-semibold text-gray-300">Example:</span> {displayExample}
                </p>
              </div>
            )}
            {content?.relatedTerms && content.relatedTerms.length > 0 && (
              <div className="pt-2 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold">Related:</span> {content.relatedTerms.join(', ')}
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
