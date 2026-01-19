import { Link, useLocation } from "wouter";
import { Home, Camera, PieChart, User, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/expenses", icon: CreditCard, label: "Expenses" },
    { href: "/scan", icon: Camera, label: "Scan", isPrimary: true },
    { href: "/insights", icon: PieChart, label: "Insights" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-md z-50">
      <div className="glass rounded-[2rem] border border-white/10 shadow-2xl shadow-black/50 px-2 py-2 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1 px-1">
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-500 py-3 rounded-2xl relative group",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div
                  className={cn(
                    "flex items-center justify-center transition-all duration-500",
                    item.isPrimary
                      ? "w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/30 text-white"
                      : "w-6 h-6 group-hover:scale-110"
                  )}
                >
                  <item.icon className={cn(item.isPrimary ? "w-6 h-6" : "w-4.5 h-4.5")} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
