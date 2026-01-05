import { useReceipts } from "@/hooks/use-receipts";
import { ReceiptCard } from "@/components/ReceiptCard";
import { BottomNav } from "@/components/BottomNav";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function Expenses() {
  const { data: receipts, isLoading } = useReceipts();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReceipts = receipts?.filter(r => 
    r.merchantName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.amount?.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Expenses</h1>
          
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
              <ReceiptCard key={receipt.id} receipt={receipt} />
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
