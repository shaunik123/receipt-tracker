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
      className="bg-card hover:bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer"
    >
      <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
        <ShoppingBag className="w-6 h-6" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground truncate">
          {receipt.merchantName || "Unknown Merchant"}
        </h4>
        <p className="text-xs text-muted-foreground">
          {receipt.date ? format(new Date(receipt.date), "MMM d, yyyy") : "Date pending..."}
        </p>
      </div>

      <div className="text-right">
        <div className="font-bold text-foreground text-lg tracking-tight font-display">
          ${receipt.amount?.toFixed(2) ?? "0.00"}
        </div>
        <div className={`text-xs flex items-center justify-end gap-1 ${statusColor[receipt.status as keyof typeof statusColor]}`}>
          <StatusIcon className="w-3 h-3" />
          <span className="capitalize">{receipt.status}</span>
        </div>
      </div>
    </div>
  );
}
