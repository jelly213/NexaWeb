import { motion } from 'framer-motion';
import {
    Palette,
    ShoppingCart,
    Search,
    Wrench,
    Calendar,
    FileText,
    Check,
    type LucideIcon
} from 'lucide-react';
import { Badge } from './ui/badge.tsx';
import { Button } from './ui/button.tsx';

const iconMap: Record<string, LucideIcon> = {
    palette: Palette,
    'shopping-cart': ShoppingCart,
    search: Search,
    wrench: Wrench,
    calendar: Calendar,
    'file-text': FileText,
};

interface ServiceCardProps {
    title: string;
    description: string;
    icon: string;
    features: string[];
    popular?: boolean;
    index: number;
}

export default function ServiceCard({
                                        title,
                                        description,
                                        icon,
                                        features,
                                        popular = false,
                                        index,
                                    }: ServiceCardProps) {
    const Icon = iconMap[icon] || Palette;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
        >
            {/* Popular Badge */}
            {popular && (
                <div className="absolute -top-3 left-6 z-10">
                    <Badge variant="default" className="shadow-md">
                        Most Popular
                    </Badge>
                </div>
            )}

            {/* Card */}
            <div
                className={`h-full bg-card border rounded-2xl p-6 lg:p-8 transition-all hover:shadow-xl ${
                    popular
                        ? 'border-primary/50 shadow-lg'
                        : 'hover:border-primary/30'
                }`}
            >
                {/* Icon */}
                <div className="mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8 text-primary" />
                    </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl lg:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                    {description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-6">
                    {features.map((feature, i) => (
                        <motion.li
                            key={feature}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
                            className="flex items-start gap-2"
                        >
                            <div className="mt-0.5">
                                <Check className="w-5 h-5 text-primary shrink-0" />
                            </div>
                            <span className="text-sm text-muted-foreground">{feature}</span>
                        </motion.li>
                    ))}
                </ul>

                {/* CTA Button */}
                <Button
                    variant="outline"
                    className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
                >
                    Learn More
                </Button>
            </div>

            {/* Gradient overlay on hover */}
            {popular && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </motion.div>
    );
}