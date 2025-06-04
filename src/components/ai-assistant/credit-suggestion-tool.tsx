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

export function CreditSuggestionTool() {
  const { debtors, loadingDebtors } = useDebtors();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<SuggestCreditLimitsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSuggestLimits = async () => {
    if (debtors.length === 0) {
      toast({ title: "No Debtors", description: "Add debtors to get credit limit suggestions.", variant: "default" });
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
      toast({ title: "Suggestions Ready", description: "AI has generated credit limit suggestions." });
    } catch (error: any) {
      toast({ title: "Suggestion Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary" />Credit Limit Suggestions</CardTitle>
        <CardDescription>Let AI suggest optimal credit limits for your debtors based on their data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSuggestLimits} disabled={isLoading || loadingDebtors} className="mb-6 w-full sm:w-auto">
          {isLoading ? "Generating Suggestions..." : (loadingDebtors ? "Loading Debtors..." : "Generate Suggestions for All Debtors")}
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
            <h3 className="text-lg font-semibold mb-2 text-foreground">Suggested Limits:</h3>
            <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Debtor Name</TableHead>
                  <TableHead className="text-right">Suggested Limit</TableHead>
                  <TableHead>Reasoning</TableHead>
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
            <p className="text-muted-foreground text-center py-4">Click the button above to generate credit limit suggestions.</p>
        )}
        {!suggestions && !isLoading && debtors.length === 0 && !loadingDebtors && (
            <p className="text-muted-foreground text-center py-4">Please add debtors in the Debt Management section to get suggestions.</p>
        )}
      </CardContent>
    </Card>
  );
}
