import { Search, Moon, Sun, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { getCurrentUser } from '@/lib/mockData';

interface HeaderProps {
  onSearch: (query: string) => void;
  onToggleSidebar?: () => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(getCurrentUser());
  const { theme, setTheme } = useTheme();

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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Debounce search propagation to parent for better performance
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b shadow-sm">
      <div className="px-3 py-2">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex-shrink-0 group transition-all active:scale-95">
            <h1 className="text-sm font-heading font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Priya's
            </h1>
          </Link>

          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-7 h-8 rounded-full border focus-visible:border-primary transition-all text-xs w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0">
            {user && (
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-all rounded-full h-8 w-8">
                  <Heart className="h-3.5 w-3.5 text-primary" />
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full h-8 w-8 hover:bg-primary/10"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};