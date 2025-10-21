import { Link } from 'react-router-dom';
import { Shirt, Sparkles, Package, Palette, Gem, Crown, Users, Gift, Layers } from 'lucide-react';

const categories = [
  { name: 'Sarees', icon: Sparkles },
  { name: 'Kurta Sets', icon: Layers },
  { name: 'Kurti', icon: Shirt },
  { name: 'Ready to Wear Sarees', icon: Package },
  { name: 'Blouses', icon: Palette },
  { name: 'Lehengas', icon: Crown },
  { name: 'Palazzos', icon: Users },
  { name: 'Indo Western Dress', icon: Gem },
  { name: 'Dupattas', icon: Gift },
];

export const Categories = () => {
  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-1 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <div>
            <h2 className="text-base font-heading font-bold text-foreground">Categories</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Shop by category</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={category.name}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 bg-card hover:bg-accent/5 hover:border-primary/30 transition-all active:scale-95 group"
              style={{
                animationDelay: `${index * 60}ms`,
                animation: 'fade-in 0.5s ease-out forwards'
              }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <span className="text-[10px] font-semibold text-center leading-tight">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
