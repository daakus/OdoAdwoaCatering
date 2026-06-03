import { Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MobileMoneyOption {
  id: string;
  label: string;
  merchantName: string;
  number: string;
  note?: string;
}

export interface PaymentInstructionsProps {
  options?: MobileMoneyOption[];
  className?: string;
}

const defaultOptions: MobileMoneyOption[] = [
  {
    id: "mtn",
    label: "MTN MoMo",
    merchantName: "Odo Adwoa Catering Services",
    number: "0XX XXX XXXX",
    note: "Use your booking reference in the message if prompted.",
  },
  {
    id: "vodafone",
    label: "Vodafone Cash",
    merchantName: "Odo Adwoa Catering Services",
    number: "0XX XXX XXXX",
  },
  {
    id: "tigo",
    label: "AirtelTigo Money",
    merchantName: "Odo Adwoa Catering Services",
    number: "0XX XXX XXXX",
  },
];

export function PaymentInstructions({
  options = defaultOptions,
  className,
}: PaymentInstructionsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-start gap-3 rounded-2xl border border-brand-border bg-brand-bg-secondary p-4">
        <Smartphone
          className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary"
          aria-hidden
        />
        <div>
          <p className="font-medium text-brand-heading">Manual mobile money</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Send payment to the numbers below, then upload your confirmation
            screenshot. Admin will verify before your booking is confirmed.
          </p>
        </div>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((opt) => (
          <li key={opt.id}>
            <Card className="h-full border-brand-border/90">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{opt.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Merchant: </span>
                  {opt.merchantName}
                </p>
                <p className="font-mono text-base font-semibold text-brand-heading">
                  {opt.number}
                </p>
                {opt.note ? (
                  <p className="text-muted-foreground">{opt.note}</p>
                ) : null}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
