import { motion } from 'framer-motion';
import { Award, Target, Zap, Shield, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    award: Award,
    target: Target,
    zap: Zap,
    shield: Shield,
};

interface ValueCardProps {
    title: string;
    description: string;
    icon: string;
    index: number;
}

export default function ValueCard({ title, description, icon, index }: ValueCardProps) {
    const Icon = iconMap[icon] || Award;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <div className="h-full bg-card border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg">
                {/* Icon */}
                <div className="mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-primary" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>
        </motion.div>
    );
}