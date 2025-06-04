
"use client";

import { RiskAssessmentForm } from "@/components/ai-assistant/risk-assessment-form";
import { CreditSuggestionTool } from "@/components/ai-assistant/credit-suggestion-tool";
import { useTranslations } from "next-intl";

export default function AiAssistantPage() {
  const t = useTranslations("AiAssistantPage");
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-semibold text-foreground mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      
      <RiskAssessmentForm />
      
      <CreditSuggestionTool />
    </div>
  );
}
