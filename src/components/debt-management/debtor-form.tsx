
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
// import { useTranslations } from "next-intl"; // Removed

const debtorFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
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
  // const t = useTranslations("DebtorForm"); // Removed
  // const tToast = useTranslations("Toast"); // Removed
  const { addDebtor, updateDebtor } = useDebtors();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<DebtorFormValues>({
    resolver: zodResolver(debtorFormSchema),
    defaultValues: debtor || {
      name: "",
      amountOwed: 0,
      creditLimit: 0,
      paymentHistory: "",
    },
  });

  useEffect(() => {
    if (isOpen) { 
      if (debtor) {
        form.reset(debtor);
      } else {
        form.reset({ name: "", amountOwed: 0, creditLimit: 0, paymentHistory: "" });
      }
    }
  }, [debtor, form, isOpen]);


  function onSubmit(data: DebtorFormValues) {
    try {
      if (debtor) {
        updateDebtor({ ...debtor, ...data });
        toast({ title: "Debtor Updated", description: `${data.name} has been updated.` });
      } else {
        addDebtor(data);
        toast({ title: "Debtor Added", description: `${data.name} has been added.` });
      }
      setIsOpen(false);
      if (onFormSubmit) onFormSubmit();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || <Button>Add New Debtor</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">{debtor ? "Edit Debtor" : "Add New Debtor"}</DialogTitle>
          <DialogDescription>
            {debtor ? "Update the details for this debtor." : "Enter the details for the new debtor."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amountOwed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Owed ($)</FormLabel>
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
                  <FormLabel>Credit Limit ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Consistently pays on time." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : (debtor ? "Save Changes" : "Add Debtor")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
