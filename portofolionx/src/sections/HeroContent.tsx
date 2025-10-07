import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroContent() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Badge variant="secondary" className="w-fit gap-1.5 px-3 py-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Web Development for Small Businesses</span>
                </Badge>
            </motion.div>

            {/* Heading */}
            <div className="space-y-4">
                <motion.h1
                    className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Build Your Digital{' '}
                    <span className="text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
            Presence
          </span>
                </motion.h1>

                <motion.p
                    className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    Fast, beautiful, and conversion-focused websites for restaurants,
                    barbershops, clinics, and local entrepreneurs.
                </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <Button size="lg" className="group shadow-lg hover:shadow-xl transition-all">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="shadow-sm hover:shadow-md transition-all">
                    View Our Work
                </Button>
            </motion.div>

            {/* Social proof or stats (optional) */}
            <motion.div
                className="flex items-center gap-6 pt-4 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <div className="flex items-center gap-2">
                    <span className="font-medium">Happy Clients are Our Priority</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="font-medium">5.0 Rating</span>
                </div>
            </motion.div>
        </motion.div>
    );
}