
"use client";

import { useState, useEffect, useMemo } from "react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { DollarSign, Users, BarChartBig, AlertTriangle, Sparkles } from "lucide-react";
import { useDebtors } from "@/contexts/debtors-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDebtSummary, type DebtSummaryInput, type DebtSummaryOutput } from "@/ai/flows/debt-summary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { debtors, loadingDebtors } = useDebtors();
  const [aiSummary, setAiSummary] = useState<DebtSummaryOutput | null>(null);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);

  const pageTitle = "Dashboard"; 
  const totalDebtTitle = "Total Debt";
  const totalDebtDesc = (utilization: string) => `${utilization}% of credit limits utilized`;
  const totalDebtorsTitle = "Total Debtors";
  const totalDebtorsDesc = "Active debtors being tracked";
  const avgDebtTitle = "Avg. Debt per Debtor";
  const avgDebtDesc = "Average amount owed";
  const debtorsOverLimitTitle = "Debtors Over Limit";
  const debtorsOverLimitDesc = "Exceeding credit limits";
  const aiOverviewTitle = "AI Debt Overview";
  const aiOverviewDesc = "Insights and recommendations based on your current debt portfolio.";
  const refreshButtonText = "Refresh Summary";
  const refreshingButtonText = "Refreshing...";
  const aiSummaryTitle = "Summary";
  const aiRiskTitle = "Risk Assessment";
  const aiRecsTitle = "Recommendations";
  const aiNoDataSummary = "No debtor data available to generate a summary.";
  const aiNoDataRisk = "N/A";
  const aiNoDataRecs = "Add debtor information to get an AI-powered summary and recommendations.";
  const aiErrorSummary = "Error generating AI summary.";
  const aiErrorRisk = "Could not assess risk.";
  const aiErrorRecs = "Please try again later.";

  const stats = useMemo(() => {
    const totalDebt = debtors.reduce((sum, d) => sum + d.amountOwed, 0);
    const numberOfDebtors = debtors.length;
    const averageDebtPerDebtor = numberOfDebtors > 0 ? totalDebt / numberOfDebtors : 0;
    const debtorsOverLimit = debtors.filter(d => d.amountOwed > d.creditLimit).length;
    const totalCreditLimit = debtors.reduce((sum, d) => sum + d.creditLimit, 0);
    const creditLimitUtilization = totalCreditLimit > 0 ? (totalDebt / totalCreditLimit) * 100 : 0;

    return {
      totalDebt,
      numberOfDebtors,
      averageDebtPerDebtor,
      debtorsOverLimit,
      creditLimitUtilization,
      largestDebt: Math.max(0, ...debtors.map(d => d.amountOwed)),
    };
  }, [debtors]);

  const fetchAiSummary = async () => {
    if (stats.numberOfDebtors === 0) {
      setAiSummary({
        summary: aiNoDataSummary,
        riskAssessment: aiNoDataRisk,
        recommendations: aiNoDataRecs
      });
      return;
    }

    setLoadingAiSummary(true);
    try {
      const input: DebtSummaryInput = {
        totalDebt: stats.totalDebt,
        numberOfDebtors: stats.numberOfDebtors,
        averageDebtPerDebtor: stats.averageDebtPerDebtor,
        largestDebt: stats.largestDebt,
        creditLimitUtilization: parseFloat(stats.creditLimitUtilization.toFixed(2)),
      };
      const summary = await getDebtSummary(input);
      setAiSummary(summary);
    } catch (error) {
      console.error("Error fetching AI summary:", error);
      setAiSummary({
        summary: aiErrorSummary,
        riskAssessment: aiErrorRisk,
        recommendations: aiErrorRecs
      });
    } finally {
      setLoadingAiSummary(false);
    }
  };

  useEffect(() => {
    if (!loadingDebtors) {
      fetchAiSummary();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingDebtors, debtors]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold text-foreground">{pageTitle}</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title={totalDebtTitle}
          value={`$${stats.totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          isLoading={loadingDebtors}
          description={totalDebtDesc(stats.creditLimitUtilization.toFixed(1))}
        />
        <SummaryCard
          title={totalDebtorsTitle}
          value={stats.numberOfDebtors}
          icon={Users}
          isLoading={loadingDebtors}
          description={totalDebtorsDesc}
        />
        <SummaryCard
          title={avgDebtTitle}
          value={`$${stats.averageDebtPerDebtor.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={BarChartBig}
          isLoading={loadingDebtors}
          description={avgDebtDesc}
        />
        <SummaryCard
          title={debtorsOverLimitTitle}
          value={stats.debtorsOverLimit}
          icon={AlertTriangle}
          isLoading={loadingDebtors}
          description={debtorsOverLimitDesc}
        />
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-headline flex items-center">
              <Sparkles className="h-6 w-6 mr-2 rtl:ml-2 rtl:mr-0 text-primary" />
              {aiOverviewTitle}
            </CardTitle>
            <CardDescription>{aiOverviewDesc}</CardDescription>
          </div>
          <Button onClick={fetchAiSummary} disabled={loadingAiSummary || loadingDebtors} size="sm">
            {loadingAiSummary ? refreshingButtonText : refreshButtonText}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingAiSummary || loadingDebtors ? (
            <>
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-1/3 mt-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </>
          ) : aiSummary ? (
            <>
              <div>
                <h3 className="font-semibold text-foreground">{aiSummaryTitle}</h3>
                <p className="text-sm text-muted-foreground">{aiSummary.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{aiRiskTitle}</h3>
                <p className="text-sm text-muted-foreground">{aiSummary.riskAssessment}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{aiRecsTitle}</h3>
                <p className="text-sm text-muted-foreground">{aiSummary.recommendations}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Click "{refreshButtonText}" to generate insights.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
