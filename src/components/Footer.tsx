import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="mt-8 border-t bg-card/70 backdrop-blur">
            <div className="px-4 py-6 space-y-4">
                <div>
                    <h3 className="text-sm font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Priya's Collection
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Premium ethnic fashion catalogue. Curated looks, elegant styles.
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <h4 className="font-semibold mb-2 text-xs">Explore</h4>
                        <ul className="space-y-1.5 text-xs text-muted-foreground">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
                            <li><a href="#categories" className="hover:text-primary transition-colors">Categories</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-xs">Company</h4>
                        <ul className="space-y-1.5 text-xs text-muted-foreground">
                            <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                            <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                            <li><a href="#privacy" className="hover:text-primary transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-xs">Follow</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">Latest trends and collections.</p>
                    </div>
                </div>
                <div className="pt-3 border-t text-center">
                    <div className="text-[10px] text-muted-foreground">© {new Date().getFullYear()} Priya's Collection</div>
                </div>
            </div>
        </footer>
    );
};


