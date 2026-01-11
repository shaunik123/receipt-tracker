import { useReceipts } from "@/hooks/use-receipts";
import { useNudges, useMarkNudgeRead } from "@/hooks/use-data";
import { useUser } from "@/hooks/use-auth";
import { ReceiptCard } from "@/components/ReceiptCard";
import { NudgeAlert } from "@/components/NudgeAlert";
import { BottomNav } from "@/components/BottomNav";
import { Loader2, TrendingUp, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: user } = useUser();
  const { data: receipts, isLoading: loadingReceipts } = useReceipts();
  const { data: nudges, isLoading: loadingNudges } = useNudges();
  const markReadMutation = useMarkNudgeRead();

  // Simple calculation for display (in real app, use stats endpoint)
  const totalSpent = receipts?.reduce((acc, r) => acc + (r.amount || 0), 0) || 0;
  const recentReceipts = receipts?.slice(0, 5) || [];
  const unreadNudges = nudges?.filter(n => !n.isRead) || [];

  return (
    <div className="min-h-screen bg-background pb-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-md mx-auto p-6 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Welcome back,</p>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {user?.username}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Total Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-xl shadow-blue-500/20 mb-8 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-x-10 -translate-y-10" />
          <p className="text-blue-100/80 text-sm font-medium mb-1">Total Spending</p>
          <h2 className="text-4xl font-display font-bold text-white mb-4">
            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center gap-2 text-emerald-300 text-sm bg-black/20 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% from last month</span>
          </div>
        </motion.div>

        {/* Nudges Section */}
        {unreadNudges.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Smart Insights</h3>
            </div>
            {loadingNudges ? (
              <div className="h-20 bg-card rounded-2xl animate-pulse" />
            ) : (
              unreadNudges.map(nudge => (
                <NudgeAlert 
                  key={nudge.id} 
                  nudge={nudge} 
                  onRead={(id) => markReadMutation.mutate(id)} 
                />
              ))
            )}
          </div>
        )}

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Recent Activity</h3>
            <button className="text-xs text-blue-400 font-medium hover:text-blue-300 transition-colors flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {loadingReceipts ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-20 bg-card rounded-2xl animate-pulse" />
              ))
            ) : recentReceipts.length === 0 ? (
              <div className="text-center py-10 bg-card rounded-2xl border border-dashed border-white/10">
                <p className="text-muted-foreground text-sm">No receipts yet</p>
              </div>
            ) : (
              recentReceipts.map((receipt) => (
                <ReceiptCard key={receipt.id} receipt={receipt} />
              ))
            )}
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
