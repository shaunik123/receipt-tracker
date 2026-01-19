import { useInsights } from "@/hooks/use-data";
import { BottomNav } from "@/components/BottomNav";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Insights() {
  const { data, isLoading } = useInsights();

  return (
    <div className="min-h-screen bg-background pb-40">
      <div className="max-w-md mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Insights</h1>
          <p className="text-sm text-muted-foreground">Monthly spending analysis</p>
        </header>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Category Chart */}
            <div className="bg-card/50 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">Spending Analysis</h3>
              <div className="h-64 relative mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={95}
                      paddingAngle={8}
                      dataKey="amount"
                      stroke="none"
                    >
                      {data?.categoryBreakdown.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '12px 16px' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</span>
                  <span className="text-3xl font-black font-display tracking-tighter">
                    ${data?.monthlyTotal.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {data?.categoryBreakdown.map((cat, i) => (
                  <div key={i} className="flex flex-col gap-1 p-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="truncate text-[10px] font-black uppercase tracking-wider text-muted-foreground">{cat.category}</span>
                    </div>
                    <span className="text-sm font-black tracking-tight">${cat.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights List */}
            <div>
              <h3 className="font-semibold mb-4">AI Recommendations</h3>
              <div className="space-y-3">
                {data?.insights.map((insight, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-sm leading-relaxed text-indigo-200">
                    {insight}
                  </div>
                ))}
                {(!data?.insights || data.insights.length === 0) && (
                  <div className="text-center p-6 text-muted-foreground text-sm">
                    Keep adding receipts to generate insights.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
