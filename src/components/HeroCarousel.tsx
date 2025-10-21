import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { heroImages } from '@/lib/mockData';

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-xl">
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {heroImages.map((item) => (
          <div key={item.id} className="min-w-full h-full relative">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover scale-105 transition-transform duration-1000"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
              <h2 className="text-xl font-heading font-bold text-white mb-1.5 animate-fade-in drop-shadow-lg">
                {item.title}
              </h2>
              <p className="text-sm text-white/95 font-medium drop-shadow-md animate-fade-in">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background backdrop-blur-sm shadow-lg rounded-full transition-all hover:scale-110 h-7 w-7"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background backdrop-blur-sm shadow-lg rounded-full transition-all hover:scale-110 h-7 w-7"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-6 shadow-lg' : 'bg-white/60 w-1.5 hover:bg-white/80'
              }`}
          />
        ))}
      </div>
    </div>
  );
};