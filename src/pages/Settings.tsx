import { Moon, Sun, User, LogOut, Home, Heart, Shield, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { getCurrentUser, saveCurrentUser } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';

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

      <main className="container max-w-2xl mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Theme</div>
                <div className="text-xs text-muted-foreground">
                  Switch between light and dark mode
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full h-10 w-10"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">Logged in</p>
                    </div>
                    {user.role === 'admin' && (
                      <Badge variant="secondary">Admin</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Link to="/" className="block">
                    <Button variant="ghost" className="w-full justify-start h-10">
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Button>
                  </Link>
                  <Link to="/wishlist" className="block">
                    <Button variant="ghost" className="w-full justify-start h-10">
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Button>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block">
                      <Button variant="ghost" className="w-full justify-start h-10">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                </div>

                <Separator />

                <Button
                  variant="destructive"
                  className="w-full justify-start h-10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    You are not logged in
                  </p>
                  <Link to="/login">
                    <Button className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
