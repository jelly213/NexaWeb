import HeroContent from './HeroContent';
import HeroImage from './HeroImage';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-accent/10">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
                        backgroundSize: '4rem 4rem'
                    }}
                />
            </div>

            <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Content - Left side */}
                    <HeroContent />

                    {/* Image/Visual - Right side */}
                    <HeroImage />
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
                    <div className="w-1.5 h-3 bg-muted-foreground/30 rounded-full" />
                </div>
            </div>
        </section>
    );
}