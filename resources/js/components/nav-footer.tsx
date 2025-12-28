import * as React from 'react';
import { cn } from '@/lib/utils';
import { Facebook, Twitter, Linkedin, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const NavFooterLink = ({ href = "#", children }: { href?: string; children: React.ReactNode }) => (
    <li>
        <a
            href={href}
            onClick={(e) => { if (href === "#") e.preventDefault(); }}
            className="text-white hover:text-white/80 transition-colors text-base font-normal font-['DM_Sans'] leading-normal"
        >
            {children}
        </a>
    </li>
);

export function NavFooter({ className }: { className?: string }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={cn("bg-primary w-full flex flex-col", className)}>
            {/* Main Content Area */}
            <div className="w-full py-16 px-6">
                <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">

                    {/* Quick Links */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-[20px] font-semibold text-white font-['DM_Sans']">Quick Links</h2>
                        <ul className="flex flex-col gap-3">
                            <NavFooterLink>About Us</NavFooterLink>
                            <NavFooterLink>Thesis Archive</NavFooterLink>
                            <NavFooterLink>Defense Schedule</NavFooterLink>
                            <NavFooterLink>Faculty</NavFooterLink>
                            <NavFooterLink>Dashboard</NavFooterLink>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-[20px] font-semibold text-white font-['DM_Sans']">Resources</h2>
                        <ul className="flex flex-col gap-3">
                            <NavFooterLink>Downloadable Forms</NavFooterLink>
                            <NavFooterLink>Thesis Guideline</NavFooterLink>
                            <NavFooterLink>Ethics Review Board</NavFooterLink>
                            <NavFooterLink>FAQs</NavFooterLink>
                        </ul>
                    </div>

                    {/* Follow Us & Contact Us */}
                    <div className="flex flex-col gap-10">
                        {/* Follow Us */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-[20px] font-semibold text-white font-['DM_Sans']">Follow Us</h2>
                            <div className="flex gap-4">
                                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                                    <Facebook className="w-6 h-6 text-primary" fill="currentColor" />
                                </a>
                                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                                    <Twitter className="w-6 h-6 text-primary" fill="currentColor" />
                                </a>
                                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                                    <Linkedin className="w-6 h-6 text-primary" fill="currentColor" />
                                </a>
                                <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                                    <Youtube className="w-6 h-6 text-primary" fill="currentColor" />
                                </a>
                            </div>
                        </div>

                        {/* Contact Us */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-[20px] font-semibold text-white font-['DM_Sans']">Contact Us</h2>
                            <div className="flex flex-col gap-3 text-white font-['DM_Sans'] text-base">
                                <div className="flex gap-3 items-start">
                                    <MapPin className="shrink-0 mt-1 w-5 h-5" />
                                    <p className="leading-relaxed">NDC Campus Anonas cor. Pureza Sts. Sta. Mesa, Manila, Philippines 01008</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <Phone className="shrink-0 w-5 h-5" />
                                    <p>(+63 2) 713 6009</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <Mail className="shrink-0 w-5 h-5" />
                                    <p>ce@pup.edu.ph</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar */}
            <div className="w-full bg-[#717182] py-6 px-4">
                <div className="max-w-[1200px] mx-auto text-center text-white font-['DM_Sans'] space-y-1">
                    <p className="text-base font-medium">Thesis Management System © {currentYear}</p>
                    <p className="text-sm">For technical support, contact the system administrator</p>
                </div>
            </div>
        </footer>
    );
}