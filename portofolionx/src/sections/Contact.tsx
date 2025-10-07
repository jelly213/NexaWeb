import { motion } from 'framer-motion';
import { Clock, Shield, Heart, type LucideIcon } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import ContactInfoCard from '../components/ContactInfoCard';
import ContactForm from '../components/ContactForm';
import contactData from '../data/contact.json';

const featureIconMap: Record<string, LucideIcon> = {
    clock: Clock,
    shield: Shield,
    heart: Heart,
};

export default function Contact() {
    return (
        <section id="contact" className="relative py-20 lg:py-32 bg-secondary/20">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                 linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
                        backgroundSize: '4rem 4rem',
                    }}
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="secondary" className="mb-4">
                            {contactData.heading.badge}
                        </Badge>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                    >
                        {contactData.heading.title}{' '}
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {contactData.heading.highlight}
            </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-muted-foreground leading-relaxed"
                    >
                        {contactData.description}
                    </motion.p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
                    {/* Left Column - Contact Info & Features */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Contact Info Cards */}
                        <div className="space-y-4">
                            {contactData.contactInfo.map((info, index) => (
                                <ContactInfoCard key={info.label} {...info} index={index} />
                            ))}
                        </div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border"
                        >
                            <h3 className="font-semibold mb-4">Why Contact Us?</h3>
                            <div className="space-y-4">
                                {contactData.features.map((feature) => {
                                    const Icon = featureIconMap[feature.icon] || Clock;
                                    return (
                                        <div key={feature.title} className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0">
                                                <Icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm mb-1">
                                                    {feature.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-card border rounded-2xl p-6 lg:p-8 shadow-lg"
                        >
                            <ContactForm />
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <p className="text-sm text-muted-foreground">
                        Prefer to email directly?{' '}
                        <a
                            href="mailto:contact@nexaweb.com"
                            className="text-primary hover:underline font-medium"
                        >
                            contact@nexaweb.com
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}