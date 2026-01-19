import { useReceipts } from "@/hooks/use-receipts";
import { useNudges, useMarkNudgeRead } from "@/hooks/use-data";
import { useUser } from "@/hooks/use-auth";
import { ReceiptCard } from "@/components/ReceiptCard";
import { NudgeAlert } from "@/components/NudgeAlert";
import { BottomNav } from "@/components/BottomNav";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { Loader2, TrendingUp, ArrowUpRight, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { queryClient } from "@/lib/queryClient";

export default function Home() {
  const { data: user } = useUser();
  const { data: receipts, isLoading: loadingReceipts, isRefetching: refetchingReceipts } = useReceipts();
  const { data: nudges, isLoading: loadingNudges, isRefetching: refetchingNudges } = useNudges();
  const markReadMutation = useMarkNudgeRead();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/receipts"] });
    queryClient.invalidateQueries({ queryKey: ["/api/nudges"] });
  };

  // Simple calculation for display (in real app, use stats endpoint)
  const totalSpent = receipts?.reduce((acc, r) => acc + (r.amountInUsd || r.amount || 0), 0) || 0;
  const recentReceipts = receipts?.slice(0, 5) || [];
  const unreadNudges = nudges?.filter(n => !n.isRead) || [];

  const isRefreshing = refetchingReceipts || refetchingNudges;

  return (
    <div className="min-h-screen bg-background pb-40 relative overflow-hidden">
      <OnboardingTour />
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-md mx-auto p-6 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 p-[1px]">
              <div className="w-full h-full rounded-[15px] bg-background flex items-center justify-center text-white font-black text-xl">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Welcome</p>
              <h1 className="text-2xl font-display font-black text-foreground tracking-tight">
                {user?.username}
              </h1>
            </div>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={loadingReceipts || isRefreshing}
            className="w-12 h-12 rounded-2xl bg-card border border-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all active:rotate-180 disabled:opacity-50 hover-elevate"
          >
            <RefreshCcw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </header>

        {/* Total Balance Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/20 mb-10 relative overflow-hidden group active-elevate-2"
        >
          <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700" />
          <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-2">Monthly Spending</p>
          <h2 className="text-5xl font-display font-black text-white mb-6 tracking-tighter">
            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-bold bg-black/20 px-3 py-2 rounded-xl backdrop-blur-md border border-white/5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.5%</span>
            </div>
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">vs Last Month</div>
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
