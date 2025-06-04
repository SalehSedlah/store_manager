
"use client";

import type { Debtor } from "@/types/debt";
import { useDebtors } from "@/contexts/debtors-context";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DebtorForm } from "./debtor-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { useTranslations } from "next-intl";

export function DebtorList() {
  const t = useTranslations("DebtorList");
  const tToast = useTranslations("Toast");
  const { debtors, deleteDebtor, loadingDebtors } = useDebtors();
  const { toast } = useToast();

  const handleDelete = (id: string, name: string) => {
    deleteDebtor(id);
    toast({ title: tToast("debtorDeletedTitle"), description: tToast("debtorDeletedDescription", {name}) });
  };

  if (loadingDebtors) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (debtors.length === 0) {
    return <p className="text-center text-muted-foreground py-8">{t('noDebtors')}</p>;
  }

  return (
    <div className="rounded-lg border overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('nameHeader')}</TableHead>
            <TableHead className="text-right">{t('amountOwedHeader')}</TableHead>
            <TableHead className="text-right">{t('creditLimitHeader')}</TableHead>
            <TableHead>{t('statusHeader')}</TableHead>
            <TableHead className="text-right">{t('lastUpdatedHeader')}</TableHead>
            <TableHead className="text-right">{t('actionsHeader')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debtors.map((debtor) => {
            const isOverLimit = debtor.amountOwed > debtor.creditLimit;
            const amountOwedFormatted = debtor.amountOwed.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
            const creditLimitFormatted = debtor.creditLimit.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
            const lastUpdatedFormatted = new Date(debtor.lastUpdated).toLocaleDateString();
            
            return (
              <TableRow key={debtor.id} className={isOverLimit ? "bg-destructive/10 hover:bg-destructive/20" : ""}>
                <TableCell className="font-medium">{debtor.name}</TableCell>
                <TableCell className="text-right">{amountOwedFormatted}</TableCell>
                <TableCell className="text-right">{creditLimitFormatted}</TableCell>
                <TableCell>
                  {isOverLimit ? (
                    <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                      <AlertTriangle className="h-3 w-3" />
                      {t('statusOverLimit')}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">{t('statusWithinLimit')}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{lastUpdatedFormatted}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DebtorForm
                        debtor={debtor}
                        triggerButton={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" /> {t('editAction')}
                          </DropdownMenuItem>
                        }
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" /> {t('deleteAction')}
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('deleteDialogTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('deleteDialogDescription', {name: debtor.name})}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('deleteDialogCancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(debtor.id, debtor.name)}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              {t('deleteDialogConfirm')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
