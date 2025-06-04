
"use client";

import { useState, useEffect, useMemo } from "react";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { DollarSign, Users, BarChartBig, AlertTriangle, Sparkles } from "lucide-react";
import { useDebtors } from "@/contexts/debtors-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDebtSummary, type DebtSummaryInput, type DebtSummaryOutput } from "@/ai/flows/debt-summary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("DashboardPage");
  const tAi = useTranslations("DashboardPage.aiSummary");
  const { debtors, loadingDebtors } = useDebtors();
  const [aiSummary, setAiSummary] = useState<DebtSummaryOutput | null>(null);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);

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
        summary: tAi("noDataSummary"),
        riskAssessment: tAi("noDataRisk"),
        recommendations: tAi("noDataRecommendations")
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
        summary: tAi("errorSummary"),
        riskAssessment: tAi("errorRisk"),
        recommendations: tAi("errorRecommendations")
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
  }, [loadingDebtors, debtors]); // tAi dependency removed as it's stable

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold text-foreground">{t("title")}</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title={t("totalDebt")}
          value={`$${stats.totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          isLoading={loadingDebtors}
          description={t("totalDebtDescription", { utilization: stats.creditLimitUtilization.toFixed(1)})}
        />
        <SummaryCard
          title={t("totalDebtors")}
          value={stats.numberOfDebtors}
          icon={Users}
          isLoading={loadingDebtors}
          description={t("totalDebtorsDescription")}
        />
        <SummaryCard
          title={t("avgDebtPerDebtor")}
          value={`$${stats.averageDebtPerDebtor.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={BarChartBig}
          isLoading={loadingDebtors}
          description={t("avgDebtPerDebtorDescription")}
        />
        <SummaryCard
          title={t("debtorsOverLimit")}
          value={stats.debtorsOverLimit}
          icon={AlertTriangle}
          isLoading={loadingDebtors}
          description={t("debtorsOverLimitDescription")}
        />
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-headline flex items-center">
              <Sparkles className="h-6 w-6 mr-2 rtl:ml-2 rtl:mr-0 text-primary" />
              {t("aiDebtOverviewTitle")}
            </CardTitle>
            <CardDescription>{t("aiDebtOverviewDescription")}</CardDescription>
          </div>
          <Button onClick={fetchAiSummary} disabled={loadingAiSummary || loadingDebtors} size="sm">
            {loadingAiSummary ? t("refreshingSummaryButton") : t("refreshSummaryButton")}
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
                <h3 className="font-semibold text-foreground">{tAi("summaryTitle")}</h3>
                <p className="text-sm text-muted-foreground">{aiSummary.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{tAi("riskAssessmentTitle")}</h3>
                <p className="text-sm text-muted-foreground">{aiSummary.riskAssessment}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{tAi("recommendationsTitle")}</h3>
                <p className="text-sm text-muted-foreground">{aiSummary.recommendations}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Click "{t("refreshSummaryButton")}" to generate insights.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
