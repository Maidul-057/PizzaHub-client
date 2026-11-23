"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { formatPrice, todayISO } from "@/lib/format";

export default function OrderDialog({ item, open, onOpenChange }) {
  const router = useRouter();
  const [form, setForm] = useState({ deliveryDate: "", deliveryAddress: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.deliveryDate) return toast.error("Please choose a delivery date");
    if (form.deliveryAddress.trim().length < 5) return toast.error("Please enter a full delivery address");
    setSubmitting(true);
    try {
      await api("/orders", { method: "POST", body: { itemId: item.id, ...form } });
      toast.success("Order placed! The restaurant will review it shortly.");
      onOpenChange(false);
      router.push("/dashboard/customer/orders");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Order {item.itemName}</DialogTitle>
            <DialogDescription>{formatPrice(item.price)} from {item.vendor?.businessName}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Delivery date</Label>
            <Input id="deliveryDate" type="date" min={todayISO()} value={form.deliveryDate} onChange={set("deliveryDate")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Delivery address</Label>
            <Textarea id="deliveryAddress" rows={2} placeholder="House, road, area, city" value={form.deliveryAddress} onChange={set("deliveryAddress")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Special instructions (optional)</Label>
            <Textarea id="message" rows={2} placeholder="Extra cheese, ring the bell twice..." value={form.message} onChange={set("message")} maxLength={500} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Place order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
