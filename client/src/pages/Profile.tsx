import { useUser, useLogout } from "@/hooks/use-auth";
import { BottomNav } from "@/components/BottomNav";
import { User, Settings, LogOut, Shield, CreditCard, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { data: user } = useUser();
  const logoutMutation = useLogout();
  const { toast } = useToast();

  const handleUnderConstruction = (label: string) => {
    toast({
      title: `${label} coming soon`,
      description: "This feature is currently under development.",
    });
  };

  const menuItems = [
    { icon: Settings, label: "Preferences" },
    { icon: CreditCard, label: "Payment Methods" },
    { icon: Shield, label: "Security & Privacy" },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-md mx-auto p-6">
        <header className="mb-8 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/20 mb-4">
            <span className="text-3xl font-bold text-white">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-xl font-bold font-display">{user?.username}</h1>
          <p className="text-muted-foreground text-sm">Free Plan</p>
        </header>

        <div className="space-y-2 mb-8">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => handleUnderConstruction(item.label)}
              className="w-full flex items-center gap-4 p-4 bg-card hover:bg-white/5 border border-white/5 rounded-2xl transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button
          onClick={() => logoutMutation.mutate()}
          className="w-full py-4 rounded-xl font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
