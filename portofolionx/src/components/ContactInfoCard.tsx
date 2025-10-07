import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    mail: Mail,
    phone: Phone,
    'map-pin': MapPin,
};

interface ContactInfoCardProps {
    icon: string;
    label: string;
    value: string;
    link: string;
    index: number;
}

export default function ContactInfoCard({
                                            icon,
                                            label,
                                            value,
                                            link,
                                            index,
                                        }: ContactInfoCardProps) {
    const Icon = iconMap[icon] || Mail;

    return (
        <motion.a
            href={link}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group block"
        >
            <div className="bg-card border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-1">{label}</p>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors break-words">
                            {value}
                        </p>
                    </div>
                </div>
            </div>
        </motion.a>
    );
}