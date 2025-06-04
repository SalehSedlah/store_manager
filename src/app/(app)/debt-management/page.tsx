
"use client";

import { DebtorForm } from "@/components/debt-management/debtor-form";
import { DebtorList } from "@/components/debt-management/debtor-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function DebtManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-headline font-semibold text-foreground">Debt Management</h1>
        <DebtorForm 
          triggerButton={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Debtor
            </Button>
          }
        />
      </div>
      <DebtorList />
    </div>
  );
}
