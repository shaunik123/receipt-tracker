import { useUser, useLogout } from "@/hooks/use-auth";
import { BottomNav } from "@/components/BottomNav";
import { User, Settings, LogOut, Shield, CreditCard, ChevronRight, Moon, Sun, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Profile() {
  const { data: user } = useUser();
  const logoutMutation = useLogout();
  const { toast } = useToast();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const menuItems = [
    { id: "preferences", icon: Settings, label: "Preferences" },
    { id: "payment", icon: CreditCard, label: "Payment Methods" },
    { id: "security", icon: Shield, label: "Security & Privacy" },
  ];

  return (
    <div className="min-h-screen bg-background pb-40">
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
              onClick={() => setActiveDialog(item.id)}
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

      {/* Preferences Dialog */}
      <Dialog open={activeDialog === "preferences"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-md mx-auto w-[90%] rounded-3xl border-white/10 glass">
          <DialogHeader>
            <DialogTitle>Preferences</DialogTitle>
            <DialogDescription>Manage your app experience</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-primary" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch id="dark-mode" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <Label htmlFor="notifications">Push Notifications</Label>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Methods Dialog */}
      <Dialog open={activeDialog === "payment"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-md mx-auto w-[90%] rounded-3xl border-white/10 glass">
          <DialogHeader>
            <DialogTitle>Payment Methods</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No payment methods added yet.</p>
            <button 
              className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
              onClick={() => toast({ title: "Coming Soon", description: "Payment processing is being integrated." })}
            >
              Add Card
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Dialog */}
      <Dialog open={activeDialog === "security"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-md mx-auto w-[90%] rounded-3xl border-white/10 glass">
          <DialogHeader>
            <DialogTitle>Security & Privacy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <button 
              className="w-full p-4 bg-white/5 rounded-xl border border-white/5 text-left font-medium flex items-center justify-between"
              onClick={() => toast({ title: "Coming Soon", description: "Password change feature coming soon." })}
            >
              Change Password
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button 
              className="w-full p-4 bg-white/5 rounded-xl border border-white/5 text-left font-medium flex items-center justify-between"
              onClick={() => setActiveDialog("policy")}
            >
              Security Policy
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Security Policy Dialog */}
      <Dialog open={activeDialog === "policy"} onOpenChange={() => setActiveDialog("security")}>
        <DialogContent className="max-w-md mx-auto w-[90%] h-[80vh] rounded-3xl border-white/10 glass overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Security Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm text-muted-foreground">
            <h4 className="font-bold text-foreground">1. Data Encryption</h4>
            <p>All sensitive data is encrypted at rest and in transit using industry-standard protocols.</p>
            <h4 className="font-bold text-foreground">2. Account Security</h4>
            <p>We use session-based authentication with secure cookie handling to protect your account.</p>
            <h4 className="font-bold text-foreground">3. Privacy</h4>
            <p>Your receipt data is only used for your own analysis and insights generation.</p>
            <h4 className="font-bold text-foreground">4. Regular Audits</h4>
            <p>We perform regular security checks to ensure your financial data remains safe.</p>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
