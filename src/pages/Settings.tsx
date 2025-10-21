import { Moon, Sun, User, LogOut, Shield, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { getCurrentUser, saveCurrentUser } from '@/lib/mockData';
import { Switch } from '@/components/ui/switch';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b shadow-sm">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-base font-heading font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto p-4">
        <div className="bg-card rounded-2xl overflow-hidden border">
          <div className="px-4 py-3 border-b bg-muted/30">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Appearance</h2>
          </div>
          <div className="divide-y">
            <div className="px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
                </div>
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </div>
        </div>

        {user ? (
          <>
            <div className="bg-card rounded-2xl overflow-hidden border mt-6">
              <div className="px-4 py-3 border-b bg-muted/30">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Account</h2>
              </div>
              <div className="divide-y">
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {user.role === 'admin' ? 'Administrator' : 'User Account'}
                      </p>
                    </div>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <Link to="/admin" className="block">
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-muted/20 transition-colors active:bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-sm font-medium">Admin Panel</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-destructive/10 transition-colors active:bg-destructive/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                      <LogOut className="h-4 w-4 text-destructive" />
                    </div>
                    <p className="text-sm font-medium text-destructive">Logout</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-card rounded-2xl overflow-hidden border mt-6">
            <div className="px-4 py-3 border-b bg-muted/30">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Account</h2>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in to access your account
              </p>
              <Link to="/login">
                <Button className="w-full h-11">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
