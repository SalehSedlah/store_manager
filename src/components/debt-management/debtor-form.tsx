
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Debtor } from "@/types/debt";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDebtors } from "@/contexts/debtors-context";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const debtorFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  phoneNumber: z.string().max(25, {message: "Phone number is too long."}).optional().or(z.literal('')),
  amountOwed: z.coerce.number().min(0, { message: "Amount owed must be positive." }),
  creditLimit: z.coerce.number().min(0, { message: "Credit limit must be positive." }),
  paymentHistory: z.string().min(3, {message: "Payment history description is too short."}).max(200, {message: "Payment history is too long."}),
});

type DebtorFormValues = z.infer<typeof debtorFormSchema>;

interface DebtorFormProps {
  debtor?: Debtor;
  onFormSubmit?: () => void;
  triggerButton?: React.ReactNode;
}

export function DebtorForm({ debtor, onFormSubmit, triggerButton }: DebtorFormProps) {
  const { addDebtor, updateDebtor } = useDebtors();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const addTitle = "Add New Debtor";
  const addDescription = "Enter the details for the new debtor.";
  const editTitle = "Edit Debtor";
  const editDescription = "Update the details for this debtor.";
  const nameLabel = "Name";
  const namePlaceholder = "John Doe";
  const phoneNumberLabel = "Phone Number (Optional)";
  const phoneNumberPlaceholder = "+1234567890";
  const amountOwedLabel = "Amount Owed ($)";
  const creditLimitLabel = "Credit Limit ($)";
  const paymentHistoryLabel = "Payment History";
  const paymentHistoryPlaceholder = "e.g., Consistently pays on time.";
  const cancelButton = "Cancel";
  const addButtonText = "Add Debtor";
  const saveButtonText = "Save Changes";
  const savingButtonText = "Saving...";

  const toastDebtorUpdatedTitle = "Debtor Updated";
  const toastDebtorUpdatedDescription = (name: string) => `${name} has been updated.`;
  const toastDebtorAddedTitle = "Debtor Added";
  const toastDebtorAddedDescription = (name: string) => `${name} has been added.`;
  const toastErrorTitle = "Error";

  const form = useForm<DebtorFormValues>({
    resolver: zodResolver(debtorFormSchema),
    defaultValues: debtor || {
      name: "",
      phoneNumber: "",
      amountOwed: 0,
      creditLimit: 0,
      paymentHistory: "",
    },
  });

  useEffect(() => {
    if (isOpen) { 
      if (debtor) {
        form.reset({
          name: debtor.name,
          phoneNumber: debtor.phoneNumber || "",
          amountOwed: debtor.amountOwed,
          creditLimit: debtor.creditLimit,
          paymentHistory: debtor.paymentHistory,
        });
      } else {
        form.reset({ name: "", phoneNumber: "", amountOwed: 0, creditLimit: 0, paymentHistory: ""});
      }
    }
  }, [debtor, form, isOpen]);


  function onSubmit(data: DebtorFormValues) {
    try {
      if (debtor) {
        updateDebtor({ ...debtor, ...data });
        toast({ title: toastDebtorUpdatedTitle, description: toastDebtorUpdatedDescription(data.name) });
      } else {
        addDebtor(data);
        toast({ title: toastDebtorAddedTitle, description: toastDebtorAddedDescription(data.name) });
      }
      setIsOpen(false);
      if (onFormSubmit) onFormSubmit();
    } catch (error: any) {
      toast({ title: toastErrorTitle, description: error.message, variant: "destructive" });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || <Button>{addTitle}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">{debtor ? editTitle : addTitle}</DialogTitle>
          <DialogDescription>
            {debtor ? editDescription : addDescription}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{nameLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={namePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{phoneNumberLabel}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder={phoneNumberPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amountOwed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{amountOwedLabel}</FormLabel>
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
                    <FormLabel>{creditLimitLabel}</FormLabel>
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
              name="paymentHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{paymentHistoryLabel}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={paymentHistoryPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">{cancelButton}</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? savingButtonText : (debtor ? saveButtonText : addButtonText)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
