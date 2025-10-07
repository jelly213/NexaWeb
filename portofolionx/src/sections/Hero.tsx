import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-accent/10">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <Badge variant="secondary" className="w-fit">
                            <Sparkles className="w-3 h-3 mr-2" />
                            Web Development for Small Businesses
                        </Badge>

                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                                Build Your Digital
                                <span className="text-primary block">Presence</span>
                            </h1>

                            <p className="text-xl text-muted-foreground max-w-xl">
                                Fast, beautiful, and conversion-focused websites for restaurants,
                                barbershops, clinics, and local entrepreneurs.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="group">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button size="lg" variant="outline">
                                View Our Work
                            </Button>
                        </div>
                    </motion.div>

                    {/* Image/Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}