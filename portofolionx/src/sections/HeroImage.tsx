import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroImage() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
            style={{ opacity }}
        >
            {/* Main visual container */}
            <div className="relative aspect-square">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-3xl backdrop-blur-sm" />

                {/* Hero Illustration with parallax */}
                <motion.div
                    className="relative z-10 w-full h-full flex items-center justify-center p-8 sm:p-12"
                    style={{ y }}
                >
                    <img
                        src="/src/assets/hero-illustration.png"
                        alt="NexaWeb - Professional Web Development"
                        className="w-full h-full object-contain drop-shadow-2xl"
                    />
                </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -inset-4 -z-10">
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/20"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
        </motion.div>
    );
}