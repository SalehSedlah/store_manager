
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
  FormDescription
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

// Schema for adding a new debtor, 'initialAmount' is for the first transaction.
const addDebtorFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  phoneNumber: z.string().max(25, {message: "Phone number is too long."}).optional().or(z.literal('')),
  initialAmount: z.coerce.number().min(0, { message: "Initial amount owed must be positive." }),
  creditLimit: z.coerce.number().min(0, { message: "Credit limit must be positive." }),
  paymentHistory: z.string().min(3, {message: "Payment history description is too short."}).max(200, {message: "Payment history is too long."}),
});

// Schema for editing debtor's core info (excluding financial transactions which are handled separately)
const editDebtorInfoFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  phoneNumber: z.string().max(25, {message: "Phone number is too long."}).optional().or(z.literal('')),
  creditLimit: z.coerce.number().min(0, { message: "Credit limit must be positive." }),
  paymentHistory: z.string().min(3, {message: "Payment history description is too short."}).max(200, {message: "Payment history is too long."}),
});


type AddDebtorFormValues = z.infer<typeof addDebtorFormSchema>;
type EditDebtorInfoFormValues = z.infer<typeof editDebtorInfoFormSchema>;


interface DebtorFormProps {
  debtor?: Debtor; // If provided, it's an edit operation for info. Otherwise, add.
  onFormSubmit?: () => void;
  triggerButton?: React.ReactNode;
}

export function DebtorForm({ debtor, onFormSubmit, triggerButton }: DebtorFormProps) {
  const { addDebtor, updateDebtorInfo } = useDebtors();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const isEditing = !!debtor;

  const formSchema = isEditing ? editDebtorInfoFormSchema : addDebtorFormSchema;

  const addTitle = "Add New Debtor";
  const addDescription = "Enter the details for the new debtor and their initial balance.";
  const editTitle = "Edit Debtor Information";
  const editDescription = "Update the contact and credit limit details for this debtor. Financial transactions are managed in the statement view.";
  const nameLabel = "Name";
  const namePlaceholder = "John Doe";
  const phoneNumberLabel = "Phone Number (Optional)";
  const phoneNumberPlaceholder = "+1234567890";
  const initialAmountLabel = "Initial Amount Owed ($)"; // For new debtors
  const creditLimitLabel = "Credit Limit ($)";
  const paymentHistoryLabel = "Payment History Summary";
  const paymentHistoryPlaceholder = "e.g., Consistently pays on time.";
  const cancelButton = "Cancel";
  const addButtonText = "Add Debtor";
  const saveButtonText = "Save Changes";
  const savingButtonText = "Saving...";

  const toastDebtorUpdatedTitle = "Debtor Info Updated";
  const toastDebtorUpdatedDescription = (name: string) => `${name}'s information has been updated.`;
  const toastDebtorAddedTitle = "Debtor Added";
  const toastDebtorAddedDescription = (name: string) => `${name} has been added with an initial balance.`;
  const toastErrorTitle = "Error";

  const form = useForm<AddDebtorFormValues | EditDebtorInfoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditing ? {
      name: debtor.name,
      phoneNumber: debtor.phoneNumber || "",
      creditLimit: debtor.creditLimit,
      paymentHistory: debtor.paymentHistory,
    } : {
      name: "",
      phoneNumber: "",
      initialAmount: 0,
      creditLimit: 0,
      paymentHistory: "",
    },
  });

  useEffect(() => {
    if (isOpen) { 
      if (isEditing && debtor) {
        form.reset({
          name: debtor.name,
          phoneNumber: debtor.phoneNumber || "",
          creditLimit: debtor.creditLimit,
          paymentHistory: debtor.paymentHistory,
        });
      } else {
        form.reset({ name: "", phoneNumber: "", initialAmount: 0, creditLimit: 0, paymentHistory: ""});
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debtor, isEditing, isOpen]); // form removed from deps to prevent reset loop

  function onSubmit(data: AddDebtorFormValues | EditDebtorInfoFormValues) {
    try {
      if (isEditing && debtor) {
        updateDebtorInfo(debtor.id, data as EditDebtorInfoFormValues);
        toast({ title: toastDebtorUpdatedTitle, description: toastDebtorUpdatedDescription(data.name) });
      } else {
        const addData = data as AddDebtorFormValues;
        const { initialAmount, ...debtorBaseData } = addData;
        addDebtor(debtorBaseData, initialAmount);
        toast({ title: toastDebtorAddedTitle, description: toastDebtorAddedDescription(data.name) });
      }
      setIsOpen(false);
      if (onFormSubmit) onFormSubmit();
      form.reset(); // Reset form after successful submission
    } catch (error: any) {
      toast({ title: toastErrorTitle, description: error.message, variant: "destructive" });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || <Button>{addTitle}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? editTitle : addTitle}</DialogTitle>
          <DialogDescription>
            {isEditing ? editDescription : addDescription}
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
             {!isEditing && (
                <FormField
                  control={form.control}
                  name="initialAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{initialAmountLabel}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="creditLimit"
                render={({ field }) => (
                  <FormItem className={isEditing ? "col-span-2" : ""}>
                    <FormLabel>{creditLimitLabel}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             {isEditing && (
                 <FormItem>
                    <FormLabel>Current Amount Owed</FormLabel>
                    <Input type="text" value={`$${debtor?.amountOwed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} readOnly disabled className="bg-muted/50"/>
                    <FormDescription>This amount is calculated from transactions. Add payments or new credit via "View Statement".</FormDescription>
                 </FormItem>
             )}
            <FormField
              control={form.control}
              name="paymentHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{paymentHistoryLabel}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={paymentHistoryPlaceholder} {...field} />
                  </FormControl>
                  <FormDescription>A general summary of payment behavior for quick reference or AI analysis.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => form.reset()}>{cancelButton}</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? savingButtonText : (isEditing ? saveButtonText : addButtonText)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
