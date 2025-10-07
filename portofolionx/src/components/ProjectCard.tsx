import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';
import { Badge } from './ui/badge.tsx';
import { Button } from './ui/button.tsx';

interface ProjectCardProps {
    title: string;
    category: string;
    description: string;
    image: string;
    tags: string[];
    link: string;
    featured?: boolean;
    index: number;
}

export default function ProjectCard({
                                        title,
                                        category,
                                        description,
                                        image,
                                        tags,
                                        link,
                                        featured = false,
                                        index,
                                    }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
        >
            <div className="bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:border-primary/30">
                {/* Image Container */}
                <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                    {/* Real image */}
                    <img
                        src={image}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />

                    {/* Featured Badge */}
                    {featured && (
                        <div className="absolute top-4 right-4 z-10">
                            <Badge variant="default" className="gap-1 shadow-md">
                                <Star className="w-3 h-3 fill-current" />
                                Featured
                            </Badge>
                        </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="shadow-lg"
                            asChild
                        >
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="gap-2"
                            >
                                View Project
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </Button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="backdrop-blur-sm">
                            {category}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-secondary rounded-md text-muted-foreground"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
