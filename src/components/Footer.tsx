import { ArrowRight, Facebook, Instagram, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Footer = ({ scrollToPackages }: { scrollToPackages?: () => void }) => {

    const [newsletterEmail, setNewsletterEmail] = useState("");

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail) return;
        toast.success("Thank you for subscribing to show updates!");
        setNewsletterEmail("");
    };


    return (
        <>
            {/* Dark Footer */}
            <footer className="bg-[#181514] text-white pt-16 pb-12 mt-16">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {/* Main Footer Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
                        {/* Column 1: Brand & Socials (4 cols) */}
                        <div className="lg:col-span-4">
                            <img
                                src="/tmas-logo-ligth.png"
                                alt="The Morayo Show"
                                className="h-9 md:h-10 object-contain mb-5"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = "/tmas-logo-dark.png";
                                }}
                            />
                            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-6">
                                Africa's premier daily talk show, delivering insightful conversations,
                                powerful stories, and real issues that matter.
                            </p>

                            {/* Social Icons */}
                            <div className="flex items-center gap-2.5">
                                <a
                                    href="https://www.youtube.com/@morayoafolabibrownoffcial"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-colors"
                                    aria-label="YouTube"
                                >
                                    <Youtube className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://www.instagram.com/themorayoshow"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-4 h-4" />
                                </a>
                                {/* X / Twitter */}
                                <a
                                    href="https://twitter.com/themorayoshow"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-colors"
                                    aria-label="Twitter / X"
                                >
                                    <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.facebook.com/themorayoshow"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-colors"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-4 h-4" />
                                </a>
                                {/* TikTok */}
                                <a
                                    href="https://www.tiktok.com/@themorayoshow"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-colors"
                                    aria-label="TikTok"
                                >
                                    <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.28 6.28 0 0 0 1.86-4.49V8.65a8.28 8.28 0 0 0 4.88 1.58v-3.5a4.83 4.83 0 0 1-.97-.04z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Quick Links (2 cols) */}
                        <div className="lg:col-span-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                                Quick Links
                            </h4>
                            <ul className="space-y-2.5 text-xs">
                                <li>
                                    <a href="/" className="text-[#E8593C] font-semibold hover:underline">
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://themorayoshow.com/episodes/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Episodes
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://themorayoshow.com/meet-morayo/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://themorayoshow.com/contact/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Event (3 cols) */}
                        <div className="lg:col-span-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                                Event
                            </h4>
                            <ul className="space-y-2.5 text-xs text-gray-400">
                                <li>
                                    <a href="#packages" className="hover:text-white transition-colors">
                                        End of the Year Special
                                    </a>
                                </li>
                                <li>
                                    <a href="#packages" className="hover:text-white transition-colors">
                                        Festive Packages
                                    </a>
                                </li>
                                <li>
                                    <button onClick={scrollToPackages} className="hover:text-white transition-colors">
                                        Book a Seat
                                    </button>
                                </li>
                                <li>
                                    <a href="https://themorayoshow.com/faqs/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                                        FAQs
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Newsletter / Get Updates (3 cols) */}
                        <div className="lg:col-span-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
                                Get Updates
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed mb-4">
                                Be the first to know about new episodes, special events, and exclusive offers.
                            </p>

                            <form onSubmit={handleNewsletterSubmit} className="relative flex items-center bg-[#25201E] border border-white/10 rounded-full p-1 pl-4 focus-within:border-[#E8593C] transition-colors">
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="bg-transparent text-xs text-white placeholder:text-gray-500 outline-none w-full pr-2"
                                    required
                                />
                                <button
                                    type="submit"
                                    aria-label="Subscribe"
                                    className="w-8 h-8 rounded-full bg-[#E8593C] hover:bg-[#D44A2D] text-white flex items-center justify-center shrink-0 transition-colors"
                                >
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom Copyright & Legal Links */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                        <div>
                            © 2026 The Morayo Show. All rights reserved.
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="https://themorayoshow.com/privacy-policy/" target="_blank" rel="noreferrer" className="hover:text-gray-300 transition-colors">
                                Privacy Policy
                            </a>
                            <span>|</span>
                            <a href="https://themorayoshow.com/terms/" target="_blank" rel="noreferrer" className="hover:text-gray-300 transition-colors">
                                Terms of Use
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    );
};

export default Footer;
