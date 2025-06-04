
"use client";

import { RiskAssessmentForm } from "@/components/ai-assistant/risk-assessment-form";
import { CreditSuggestionTool } from "@/components/ai-assistant/credit-suggestion-tool";
// import { useTranslations } from "next-intl"; // Removed

export default function AiAssistantPage() {
  // const t = useTranslations("AiAssistantPage"); // Removed
  const pageTitle = "AI Assistant"; // Hardcoded
  const pageDescription = "Leverage AI to gain insights and make better financial decisions."; // Hardcoded

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-semibold text-foreground">{pageTitle}</h1>
        <p className="text-muted-foreground">{pageDescription}</p>
      </div>
      
      <RiskAssessmentForm />
      
      <CreditSuggestionTool />
    </div>
  );
}
