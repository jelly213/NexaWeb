import { motion } from 'framer-motion';
import { Badge } from '../components/ui/badge';
import StatsCard from '../components/StatsCard';
import ValueCard from '../components/ValueCard';
import aboutData from '../data/about.json';

export default function About() {
    return (
        <section id="about" className="relative py-20 lg:py-32 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
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
                            {aboutData.heading.badge}
                        </Badge>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                    >
                        {aboutData.heading.title}{' '}
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {aboutData.heading.highlight}
            </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-muted-foreground leading-relaxed mb-6"
                    >
                        {aboutData.description}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-base text-muted-foreground leading-relaxed border-l-4 border-primary pl-4 text-left"
                    >
                        {aboutData.mission}
                    </motion.p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-20">
                    {aboutData.stats.map((stat, index) => (
                        <StatsCard key={stat.label} {...stat} index={index} />
                    ))}
                </div>

                {/* Values Section */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                            Why Choose NexaWeb?
                        </h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            We're not just developers—we're partners in your success. Here's what sets us apart.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {aboutData.values.map((value, index) => (
                            <ValueCard key={value.title} {...value} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}