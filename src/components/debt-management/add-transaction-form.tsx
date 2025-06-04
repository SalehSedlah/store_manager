
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Transaction, TransactionType } from "@/types/debt";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebtors } from "@/contexts/debtors-context";

const transactionTypes: { value: TransactionType; label: string }[] = [
  { value: "payment", label: "دفعة مستلمة" },
  { value: "new_credit", label: "دين جديد صادر" },
  { value: "adjustment_increase", label: "تسوية (زيادة الدين)" },
  { value: "adjustment_decrease", label: "تسوية (تخفيض الدين)" },
];

const addTransactionFormSchema = z.object({
  type: z.custom<TransactionType>((val) => transactionTypes.map(t => t.value).includes(val as TransactionType), {
    message: "نوع معاملة غير صالح",
  }),
  amount: z.coerce.number().min(0.01, { message: "يجب أن يكون المبلغ أكبر من 0." }),
  description: z.string().optional(),
});

type AddTransactionFormValues = z.infer<typeof addTransactionFormSchema>;

interface AddTransactionFormProps {
  debtorId: string;
  onTransactionAdded: () => void;
}

export function AddTransactionForm({ debtorId, onTransactionAdded }: AddTransactionFormProps) {
  const { addTransaction } = useDebtors();

  const form = useForm<AddTransactionFormValues>({
    resolver: zodResolver(addTransactionFormSchema),
    defaultValues: {
      type: "payment",
      amount: 0,
      description: "",
    },
  });

  function onSubmit(data: AddTransactionFormValues) {
    addTransaction(debtorId, data);
    form.reset();
    onTransactionAdded();
  }
  
  const typeLabel = "نوع المعاملة";
  const amountLabel = "المبلغ (بالعملة المحلية)";
  const descriptionLabel = "الوصف (اختياري)";
  const descriptionPlaceholder = "مثال: دفعة شهرية، بضاعة مشتراة";
  const addButtonText = "إضافة معاملة";
  const addingButtonText = "جاري الإضافة...";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4 border-t pt-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{typeLabel}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع المعاملة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transactionTypes.map((typeOpt) => (
                    <SelectItem key={typeOpt.value} value={typeOpt.value}>
                      {typeOpt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{amountLabel}</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100.00" {...field} step="0.01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{descriptionLabel}</FormLabel>
              <FormControl>
                <Textarea placeholder={descriptionPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? addingButtonText : addButtonText}
        </Button>
      </form>
    </Form>
  );
}
