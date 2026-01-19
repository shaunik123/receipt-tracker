import { useReceipts } from "@/hooks/use-receipts";
import { ReceiptCard } from "@/components/ReceiptCard";
import { BottomNav } from "@/components/BottomNav";
import { Search, SlidersHorizontal, RefreshCcw, Receipt as ReceiptIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Receipt } from "@shared/routes";
import { format } from "date-fns";
import { queryClient } from "@/lib/queryClient";

export default function Expenses() {
  const { data: receipts, isLoading, isRefetching } = useReceipts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const filteredReceipts = receipts?.filter(r => 
    r.merchantName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.amount?.toString().includes(searchTerm)
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/receipts"] });
  };

  const items = selectedReceipt?.items as any[] || [];

  return (
    <div className="min-h-screen bg-background pb-40">
      <div className="max-w-md mx-auto p-6">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-display font-bold text-foreground">Expenses</h1>
            <button 
              onClick={handleRefresh}
              disabled={isLoading || isRefetching}
              className="p-2 rounded-xl bg-card border border-white/5 text-muted-foreground hover:text-foreground transition-all active:rotate-180 disabled:opacity-50"
            >
              <RefreshCcw className={`w-5 h-5 ${isRefetching ? "animate-spin" : ""}`} />
            </button>
          </div>
          
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search merchant or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-card border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
            <button className="w-12 h-12 rounded-xl bg-card border border-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="space-y-3">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-card rounded-2xl animate-pulse" />
            ))
          ) : filteredReceipts?.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg">No expenses found</h3>
              <p className="text-muted-foreground text-sm mt-1">Try adjusting your search</p>
            </div>
          ) : (
            filteredReceipts?.map((receipt) => (
              <ReceiptCard 
                key={receipt.id} 
                receipt={receipt} 
                onClick={() => setSelectedReceipt(receipt)}
              />
            ))
          )}
        </div>
      </div>

      <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <DialogContent className="max-w-md mx-auto w-[90%] rounded-3xl border-white/10 glass">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              <ReceiptIcon className="w-5 h-5 text-primary" />
              Expense Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedReceipt && (
            <div className="space-y-6 py-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold">{selectedReceipt.merchantName}</h2>
                <p className="text-muted-foreground text-sm">
                  {selectedReceipt.date ? format(new Date(selectedReceipt.date), "MMMM d, yyyy") : "Date pending"}
                </p>
                <div className="mt-2 text-3xl font-bold tracking-tight text-primary">
                  ${selectedReceipt.amount?.toFixed(2)}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">Breakdown</h3>
                <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="flex justify-between items-center p-4 border-b border-white/5 last:border-0"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">Qty: {item.quantity || 1}</span>
                        </div>
                        <span className="font-semibold">${(Number(item.price) * (item.quantity || 1)).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground italic">
                      Detailed item list not available for this receipt.
                    </div>
                  )}
                </div>
              </div>

              {selectedReceipt.category && (
                <div className="flex justify-between items-center px-1">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                    {selectedReceipt.category}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
