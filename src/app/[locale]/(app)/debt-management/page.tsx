
"use client";

import { DebtorForm } from "@/components/debt-management/debtor-form";
import { DebtorList } from "@/components/debt-management/debtor-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
// import { useTranslations } from "next-intl"; // Removed

export default function DebtManagementPage() {
  // const t = useTranslations("DebtManagementPage"); // Removed
  const pageTitle = "Debt Management"; // Hardcoded
  const addNewDebtorButtonText = "Add New Debtor"; // Hardcoded

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold text-foreground">{pageTitle}</h1>
        <DebtorForm 
          triggerButton={
            <Button>
              <PlusCircle className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" /> {addNewDebtorButtonText}
            </Button>
          }
        />
      </div>
      <DebtorList />
    </div>
  );
}
