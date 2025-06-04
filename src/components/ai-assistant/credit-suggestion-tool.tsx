
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { suggestCreditLimits, type SuggestCreditLimitsInput, type SuggestCreditLimitsOutput } from "@/ai/flows/debt-suggestions";
import { useDebtors } from "@/contexts/debtors-context";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// import { useTranslations } from "next-intl"; // Removed

export function CreditSuggestionTool() {
  // const t = useTranslations("CreditSuggestionTool"); // Removed
  // const tToast = useTranslations("Toast"); // Removed
  const { debtors, loadingDebtors } = useDebtors();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<SuggestCreditLimitsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded strings
  const cardTitle = "Credit Limit Suggestions";
  const cardDescription = "Let AI suggest optimal credit limits for your debtors based on their data.";
  const generateButtonText = "Generate Suggestions for All Debtors";
  const generatingButtonText = "Generating Suggestions...";
  const loadingDebtorsButtonText = "Loading Debtors...";
  const suggestedLimitsTitle = "Suggested Limits:";
  const debtorNameHeader = "Debtor Name";
  const suggestedLimitHeader = "Suggested Limit";
  const reasoningHeader = "Reasoning";
  const noSuggestionsPlaceholder = "Click the button above to generate credit limit suggestions.";
  const noDebtorsPlaceholder = "Please add debtors in the Debt Management section to get suggestions.";

  const toastNoDebtorsTitle = "No Debtors";
  const toastNoDebtorsDescription = "Add debtors to get credit limit suggestions.";
  const toastSuggestionsReadyTitle = "Suggestions Ready";
  const toastSuggestionsReadyDescription = "AI has generated credit limit suggestions.";
  const toastSuggestionFailedTitle = "Suggestion Failed";


  const handleSuggestLimits = async () => {
    if (debtors.length === 0) {
      toast({ 
        title: toastNoDebtorsTitle, 
        description: toastNoDebtorsDescription, 
        variant: "default" 
      });
      return;
    }
    setIsLoading(true);
    setSuggestions(null);
    try {
      const input: SuggestCreditLimitsInput = debtors.map(d => ({
        debtorName: d.name,
        paymentHistory: d.paymentHistory,
        overallDebtAmount: d.amountOwed,
        currentCreditLimit: d.creditLimit,
      }));
      const result = await suggestCreditLimits(input);
      setSuggestions(result);
      toast({ title: toastSuggestionsReadyTitle, description: toastSuggestionsReadyDescription });
    } catch (error: any) {
      toast({ title: toastSuggestionFailedTitle, description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center">
          <Sparkles className="mr-2 rtl:ml-2 rtl:mr-0 h-5 w-5 text-primary" />
          {cardTitle}
        </CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSuggestLimits} disabled={isLoading || loadingDebtors} className="mb-6 w-full sm:w-auto">
          {isLoading ? generatingButtonText : (loadingDebtors ? loadingDebtorsButtonText : generateButtonText)}
        </Button>

        {isLoading && (
           <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))}
          </div>
        )}

        {suggestions && !isLoading && (
          <div className="mt-4 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-2 text-foreground">{suggestedLimitsTitle}</h3>
            <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{debtorNameHeader}</TableHead>
                  <TableHead className="text-right">{suggestedLimitHeader}</TableHead>
                  <TableHead>{reasoningHeader}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.map((suggestion, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{suggestion.debtorName}</TableCell>
                    <TableCell className="text-right">${suggestion.suggestedCreditLimit.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{suggestion.reasoning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        )}
        {!suggestions && !isLoading && debtors.length > 0 && (
            <p className="text-muted-foreground text-center py-4">{noSuggestionsPlaceholder}</p>
        )}
        {!suggestions && !isLoading && debtors.length === 0 && !loadingDebtors && (
            <p className="text-muted-foreground text-center py-4">{noDebtorsPlaceholder}</p>
        )}
      </CardContent>
    </Card>
  );
}
