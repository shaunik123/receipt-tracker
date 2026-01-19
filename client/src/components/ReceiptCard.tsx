import { Receipt } from "@shared/routes";
import { format } from "date-fns";
import { ShoppingBag, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface ReceiptCardProps {
  receipt: Receipt;
  onClick?: () => void;
}

export function ReceiptCard({ receipt, onClick }: ReceiptCardProps) {
  const statusColor = {
    processing: "text-yellow-500",
    completed: "text-emerald-500",
    failed: "text-red-500",
  };

  const StatusIcon = {
    processing: Clock,
    completed: CheckCircle,
    failed: AlertCircle,
  }[receipt.status as keyof typeof statusColor] || Clock;

  return (
    <div 
      onClick={onClick}
      className="bg-card/50 hover:bg-white/5 border border-white/5 rounded-[2rem] p-5 flex items-center gap-5 transition-all active:scale-[0.98] cursor-pointer group hover-elevate"
    >
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition-transform duration-500">
        <ShoppingBag className="w-7 h-7" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-foreground truncate text-base leading-tight mb-1">
          {receipt.merchantName || "Unknown Merchant"}
        </h4>
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            {receipt.date ? format(new Date(receipt.date), "MMM d") : "Date pending..."}
          </p>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
            {receipt.category || "General"}
          </span>
        </div>
      </div>

      <div className="text-right">
        <div className="font-black text-foreground text-xl tracking-tighter font-display mb-1">
          {receipt.currency !== "USD" ? (
            <div className="flex flex-col items-end">
              <span>{receipt.amount?.toFixed(2)} {receipt.currency}</span>
              <span className="text-[10px] text-muted-foreground font-bold">≈ ${receipt.amountInUsd?.toFixed(2)} USD</span>
            </div>
          ) : (
            `$${receipt.amount?.toFixed(2) ?? "0.00"}`
          )}
        </div>
        <div className={`text-[10px] font-black uppercase tracking-widest flex items-center justify-end gap-1 ${statusColor[receipt.status as keyof typeof statusColor]}`}>
          <StatusIcon className="w-2.5 h-2.5" />
          <span>{receipt.status}</span>
        </div>
      </div>
    </div>
  );
}
