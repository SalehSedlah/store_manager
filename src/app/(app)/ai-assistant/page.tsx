
"use client";

import { RiskAssessmentForm } from "@/components/ai-assistant/risk-assessment-form";
import { CreditSuggestionTool } from "@/components/ai-assistant/credit-suggestion-tool";

export default function AiAssistantPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-semibold text-foreground mb-2">AI Assistant</h1>
        <p className="text-muted-foreground">Leverage AI to gain insights and make better financial decisions.</p>
      </div>
      
      <RiskAssessmentForm />
      
      <CreditSuggestionTool />
    </div>
  );
}
