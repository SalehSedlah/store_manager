
"use client";

import type { Debtor } from "@/types/debt";
import { useDebtors } from "@/contexts/debtors-context";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, AlertTriangle, MessageSquare, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

export function DebtorList() {
  const { debtors, deleteDebtor, loadingDebtors } = useDebtors();
  const { toast } = useToast();

  const handleDelete = (id: string, name: string) => {
    deleteDebtor(id);
    toast({ title: "Debtor Deleted", description: `${name} has been deleted.` });
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
    return <p className="text-center text-muted-foreground py-8">No debtors found. Add a new debtor to get started.</p>;
  }

  return (
    <div className="rounded-lg border overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="text-right">Amount Owed</TableHead>
            <TableHead className="text-right">Credit Limit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                <TableCell className="text-sm text-muted-foreground">{debtor.phoneNumber || "N/A"}</TableCell>
                <TableCell className="text-right">{amountOwedFormatted}</TableCell>
                <TableCell className="text-right">{creditLimitFormatted}</TableCell>
                <TableCell>
                  {isOverLimit ? (
                    <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                      <AlertTriangle className="h-3 w-3" />
                      Over Limit
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Within Limit</Badge>
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
                            <Edit className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                        }
                      />
                       {debtor.phoneNumber && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <a href={`sms:${debtor.phoneNumber}`}>
                              <MessageSquare className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" /> Send SMS
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`https://wa.me/${debtor.phoneNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" /> Send WhatsApp
                            </a>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {`This action cannot be undone. This will permanently delete ${debtor.name}'s record.`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(debtor.id, debtor.name)}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              Delete
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
