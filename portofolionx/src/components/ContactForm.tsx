import {useState} from 'react';
import {motion} from 'framer-motion';
import {CheckCircle, Send} from 'lucide-react';
import {Button} from './ui/button.tsx';
import contactData from '../data/contact.json';
import * as React from "react";

interface FormData {
    name: string;
    email: string;
    phone: string;
    business: string;
    message: string;
}

export default function ContactForm() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        business: '',
        message: '',
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Construire le mailto avec les données du formulaire
        const subject = encodeURIComponent(`New Contact from ${formData.name}`);

        const body = encodeURIComponent(
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Phone: ${formData.phone || 'Not provided'}\n` +
            `Business Type: ${formData.business || 'Not specified'}\n\n` +
            `Message:\n${formData.message}`
        );

        // Ouvrir le client email
        window.location.href = `mailto:contact@nexaweb.com?subject=${subject}&body=${body}`;

        // Afficher message de succès et réinitialiser le formulaire
        setShowSuccess(true);
        setFormData({
            name: '',
            email: '',
            phone: '',
            business: '',
            message: '',
        });

        // Masquer le message après 5 secondes
        setTimeout(() => setShowSuccess(false), 5000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                >
                    Full Name <span className="text-destructive">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
            </div>

            {/* Email & Phone */}
            <div className="grid sm:grid-cols-2 gap-6">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                    >
                        Email Address <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                </div>

                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium mb-2"
                    >
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Business Type */}
            <div>
                <label
                    htmlFor="business"
                    className="block text-sm font-medium mb-2"
                >
                    Business Type
                </label>
                <select
                    id="business"
                    name="business"
                    value={formData.business}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                >
                    <option value="">Select your business type</option>
                    {contactData.form.fields
                        .find((f) => f.name === 'business')
                        ?.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                </select>
            </div>

            {/* Message */}
            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                >
                    Project Details <span className="text-destructive">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project, goals, and timeline..."
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                />
            </div>

            {/* Success Message */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400"
                >
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">Your email client will open. Send the email to complete your message!</p>
                </motion.div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                size="lg"
                className="w-full group"
            >
                {contactData.form.submitButton}
                <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-xs text-muted-foreground text-center">
                Clicking "Send Message" will open your email client with a pre-filled message
            </p>
        </form>
    );
}