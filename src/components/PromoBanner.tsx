export const PromoBanner = () => {
    return (
        <section className="animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl border-2 bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 p-4 shadow-lg">
                <div className="relative z-10">
                    <h3 className="text-base font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Festive Edit: New Season Styles
                    </h3>
                    <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                        Discover the latest in ethnic couture — handpicked silhouettes, premium fabrics, and timeless craftsmanship.
                    </p>
                </div>
                <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -left-8 -top-8 w-40 h-40 rounded-full bg-accent/10 blur-2xl" />
            </div>
        </section>
    );
};


