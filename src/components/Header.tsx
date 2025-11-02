import { Search, Heart, Settings, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';

interface HeaderProps {
  onSearch: (query: string) => void;
  onToggleSidebar?: () => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useFirebaseAuth();

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
            <h1 className="text-base font-heading font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent whitespace-nowrap">
              Priya's Collection
            </h1>
          </Link>

          <div className="flex-1 max-w-xs">
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
              <>
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-all rounded-full h-8 w-8">
                    <Heart className="h-3.5 w-3.5 text-primary" />
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button variant="ghost" size="icon" className="relative hover:bg-accent/10 transition-all rounded-full h-8 w-8">
                    <Package className="h-3.5 w-3.5 text-accent" />
                  </Button>
                </Link>
              </>
            )}
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-all rounded-full h-8 w-8">
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};