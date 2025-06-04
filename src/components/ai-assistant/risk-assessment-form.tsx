"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { assessDebtorRisk, type DebtorRiskAssessmentInput, type DebtorRiskAssessmentOutput } from "@/ai/flows/debtor-risk-assessment";
import { useDebtors } from "@/contexts/debtors-context";
import { useToast } from "@/hooks/use-toast";
import type { Debtor } from "@/types/debt";
import { Sparkles, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const riskAssessmentFormSchema = z.object({
  debtorId: z.string().optional(), // For selecting existing debtor
  paymentBehavior: z.string().min(10, { message: "Payment behavior description is too short." }).max(500),
  creditScore: z.coerce.number().min(300).max(850).optional(),
  debtAmount: z.coerce.number().min(0),
  creditLimit: z.coerce.number().min(0).optional(),
});

type RiskAssessmentFormValues = z.infer<typeof riskAssessmentFormSchema>;

export function RiskAssessmentForm() {
  const { debtors, getDebtorById } = useDebtors();
  const { toast } = useToast();
  const [assessmentResult, setAssessmentResult] = useState<DebtorRiskAssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);

  const form = useForm<RiskAssessmentFormValues>({
    resolver: zodResolver(riskAssessmentFormSchema),
    defaultValues: {
      paymentBehavior: "",
      debtAmount: 0,
    },
  });

  const handleDebtorSelect = (debtorId: string) => {
    if (debtorId === "manual") {
      setSelectedDebtor(null);
      form.reset({
        paymentBehavior: "",
        debtAmount: 0,
        creditScore: undefined,
        creditLimit: undefined,
      });
    } else {
      const debtor = getDebtorById(debtorId);
      setSelectedDebtor(debtor || null);
      if (debtor) {
        form.reset({
          debtorId: debtor.id,
          paymentBehavior: debtor.paymentHistory || "",
          debtAmount: debtor.amountOwed,
          creditLimit: debtor.creditLimit,
          // creditScore: undefined, // Assuming credit score is not stored in Debtor type
        });
      }
    }
  };

  async function onSubmit(data: RiskAssessmentFormValues) {
    setIsLoading(true);
    setAssessmentResult(null);
    try {
      const input: DebtorRiskAssessmentInput = {
        paymentBehavior: data.paymentBehavior,
        creditScore: data.creditScore,
        debtAmount: data.debtAmount,
        creditLimit: data.creditLimit,
      };
      const result = await assessDebtorRisk(input);
      setAssessmentResult(result);
      toast({ title: "Risk Assessment Complete", description: "AI analysis finished." });
    } catch (error: any) {
      toast({ title: "Assessment Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary" />Debtor Risk Assessment</CardTitle>
        <CardDescription>Analyze a debtor&apos;s risk profile using AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="debtorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Debtor (Optional)</FormLabel>
                  <Select onValueChange={(value) => {field.onChange(value); handleDebtorSelect(value);}} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a debtor or enter manually" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="manual">Enter Manually</SelectItem>
                      {debtors.map((debtor) => (
                        <SelectItem key={debtor.id} value={debtor.id}>
                          {debtor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select an existing debtor to pre-fill some fields, or choose &quot;Enter Manually&quot;.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentBehavior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Behavior</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Consistently pays on time, occasional late payments..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="debtAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Debt Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="creditLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Limit ($) (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="creditScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Score (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="300-850" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Assessing Risk..." : "Assess Risk"}
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-1/4 mt-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {assessmentResult && !isLoading && (
          <div className="mt-8 space-y-4 p-4 border rounded-md bg-secondary/30">
            <h3 className="text-lg font-semibold font-headline text-foreground">Assessment Result:</h3>
            <div>
              <p className="font-medium text-foreground flex items-center">
                Risk Level: 
                <span className={`ml-2 font-bold ${
                  assessmentResult.riskLevel.toLowerCase() === 'high' ? 'text-destructive' :
                  assessmentResult.riskLevel.toLowerCase() === 'medium' ? 'text-yellow-500' :
                  'text-green-600'
                }`}>
                  {assessmentResult.riskLevel.toLowerCase() === 'high' && <AlertTriangle className="inline h-4 w-4 mr-1"/>}
                  {assessmentResult.riskLevel}
                </span>
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Risk Factors:</p>
              <p className="text-sm text-muted-foreground">{assessmentResult.riskFactors}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Suggested Actions:</p>
              <p className="text-sm text-muted-foreground">{assessmentResult.suggestedActions}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
