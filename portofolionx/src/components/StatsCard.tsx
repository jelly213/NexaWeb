import { motion } from 'framer-motion';
import { Users, Briefcase, Star, Heart, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    users: Users,
    briefcase: Briefcase,
    star: Star,
    heart: Heart,
};

interface StatsCardProps {
    value: string;
    label: string;
    icon: string;
    index: number;
}

export default function StatsCard({ value, label, icon, index }: StatsCardProps) {
    const Icon = iconMap[icon] || Users;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
        >
            <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow">
                {/* Icon */}
                <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                </div>

                {/* Value */}
                <div className="mb-2">
          <span className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {value}
          </span>
                </div>

                {/* Label */}
                <p className="text-sm text-muted-foreground font-medium">{label}</p>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
        </motion.div>
    );
}