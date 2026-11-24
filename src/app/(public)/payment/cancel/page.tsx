
import Link from "next/link";
import { ArrowLeft, CreditCard, Info } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
            <CreditCard className="size-8" />
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-primary">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          You cancelled the Stripe Checkout process or returned before
          completing your payment. No booking confirmation has been
          issued.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-muted p-4 text-left">
          <Info className="mt-0.5 size-5 shrink-0 text-primary" />

          <p className="text-sm leading-6 text-muted-foreground">
            If you still want to rent this equipment, return to the
            equipment details page and start the checkout process again.
          </p>
        </div>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button render={<Link href="/equipment" />} nativeButton={false}>
            <ArrowLeft className="mr-2 size-4" />
            Browse Equipment
          </Button>

          <Button
            variant="outline"
            render={<Link href="/dashboard/bookings" />}
            nativeButton={false}
          >
            My Bookings
          </Button>
        </div>
      </div>
    </main>
  );
}
