import { Moon, Sun, User, LogOut, Shield, ArrowLeft, ChevronRight, Heart, HelpCircle, Info, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { getCurrentUser, saveCurrentUser } from '@/lib/mockData';
import { Switch } from '@/components/ui/switch';
import { Footer } from '@/components/Footer';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    saveCurrentUser(null);
    setUser(null);
    navigate('/');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/40">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-muted/50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
        </div>
      </header>

      <main className="pb-6">
        {user && (
          <div className="px-4 pt-6 pb-4">
            <div className="flex items-center gap-4 px-4 py-5 bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-3xl border border-border/40 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold truncate">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {user.role === 'admin' ? 'Administrator' : 'Member'}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        )}

        <div className="px-4 space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
              Preferences
            </h2>
            <div className="bg-background rounded-2xl overflow-hidden border border-border/40 shadow-sm">
              <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-muted/30 active:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    {theme === 'dark' ? <Moon className="h-4 w-4 text-amber-500" /> : <Sun className="h-4 w-4 text-orange-500" />}
                  </div>
                  <span className="text-[15px] font-medium">Dark Mode</span>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </button>
            </div>
          </div>

          {user && (
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
                My Account
              </h2>
              <div className="bg-background rounded-2xl overflow-hidden border border-border/40 shadow-sm">
                <Link to="/wishlist">
                  <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-muted/30 active:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-pink-500" />
                      </div>
                      <span className="text-[15px] font-medium">Wishlist</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                </Link>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
              Support
            </h2>
            <div className="bg-background rounded-2xl overflow-hidden border border-border/40 shadow-sm">
              <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-muted/30 active:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-orange-500" />
                  </div>
                  <span className="text-[15px] font-medium">Help Center</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>

              <div className="h-[0.5px] bg-border/40 mx-4" />

              <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-muted/30 active:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-sky-500/20 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-[15px] font-medium">Contact Us</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>

              <div className="h-[0.5px] bg-border/40 mx-4" />

              <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-muted/30 active:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500/20 to-gray-500/20 flex items-center justify-center">
                    <Info className="h-4 w-4 text-slate-500" />
                  </div>
                  <span className="text-[15px] font-medium">About</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {user?.role === 'admin' && (
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
                Administration
              </h2>
              <div className="bg-background rounded-2xl overflow-hidden border border-border/40 shadow-sm">
                <Link to="/admin">
                  <button className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-muted/30 active:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-[15px] font-medium">Admin Panel</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                </Link>
              </div>
            </div>
          )}

          {user ? (
            <div className="bg-background rounded-2xl overflow-hidden border border-border/40 shadow-sm">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3.5 flex items-center justify-center hover:bg-destructive/5 active:bg-destructive/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                    <LogOut className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="text-[15px] font-semibold text-destructive">Sign Out</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="bg-background rounded-2xl overflow-hidden border border-border/40 shadow-sm">
              <div className="px-6 py-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center shadow-sm">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">Sign in to your account</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Access your wishlist, orders, and more
                </p>
                <Link to="/login">
                  <Button className="w-full h-11 rounded-full text-base font-medium shadow-md">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="text-center text-xs text-muted-foreground pb-2">
            <p>Version 1.0.0</p>
            <p className="mt-1">Priya's Collection</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
