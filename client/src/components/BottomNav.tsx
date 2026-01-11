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
    <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 pb-[env(safe-area-inset-bottom,2rem)] z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center transition-all duration-300",
                    item.isPrimary
                      ? "w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/30 text-white"
                      : "w-8 h-8",
                    isActive && !item.isPrimary && "text-primary"
                  )}
                >
                  <item.icon className={cn(item.isPrimary ? "w-6 h-6" : "w-5 h-5")} />
                </div>
                <span className="text-[10px] font-medium tracking-wide">
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
