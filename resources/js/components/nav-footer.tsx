import * as React from 'react';
import { cn } from '@/lib/utils';
import { Facebook, Twitter, Linkedin, Youtube, MapPin, Phone, Mail } from 'lucide-react'; {/* icons currently implemented in the footer are placeholders onlyyy. will replace once the icon components have been made */}

const NavFooterLink = ({ href = "#", children }: { href?: string; children: React.ReactNode }) => (
    <li>
        <a 
            href={href} 
            onClick={(e) => { if (href === "#") e.preventDefault(); }}
            className="text-white/80 hover:text-[var(--primary-foreground-2)] transition-colors text-[16px] font-medium font-dm leading-normal"
        >
            {children}
        </a>
    </li>
);

export function NavFooter({ className }: { className?: string }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={cn("bg-[var(--primary)] w-full h-[675px] flex flex-col overflow-hidden mt-auto", className)}>
            
            {/* Main Content Area */}
            <div className="flex-grow flex items-center justify-center px-6">
                <div className="w-full max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 items-start">
                    
                    {/* Quick Links */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-[32px] font-medium text-white font-dm">Quick Links</h2>
                        <ul className="flex flex-col gap-3 pl-8">
                            <NavFooterLink>About Us</NavFooterLink>
                            <NavFooterLink>Thesis Archive</NavFooterLink>
                            <NavFooterLink>Defense Schedule</NavFooterLink>
                            <NavFooterLink>Faculty</NavFooterLink>
                            <NavFooterLink>Dashboard</NavFooterLink>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-[32px] font-medium text-white font-dm">Resources</h2>
                        <ul className="flex flex-col gap-3 pl-8">
                            <NavFooterLink>Downloadable Forms</NavFooterLink>
                            <NavFooterLink>Thesis Guideline</NavFooterLink>
                            <NavFooterLink>Ethics Review Board</NavFooterLink>
                            <NavFooterLink>FAQs</NavFooterLink>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-10">
                        {/* Follow Us */}
                        <div className="flex flex-col gap-4">
                            <h2 className="text-[32px] font-medium text-white font-dm">Follow Us</h2>
                            <div className="flex gap-4 pl-8">
                                <a href="#" className="text-white hover:text-[var(--primary-foreground-2)] transition-colors"><Facebook size={40} fill="currentColor" /></a>
                                <a href="#" className="text-white hover:text-[var(--primary-foreground-2)] transition-colors"><Twitter size={40} fill="currentColor" /></a>
                                <a href="#" className="text-white hover:text-[var(--primary-foreground-2)] transition-colors"><Linkedin size={40} fill="currentColor" /></a>
                                <a href="#" className="text-white hover:text-[var(--primary-foreground-2)] transition-colors"><Youtube size={40} fill="currentColor" /></a>
                            </div>
                        </div>

                        {/* Contact Us */}
                        <div className="flex flex-col gap-4 pt-4">
                            <h2 className="text-[32px] font-medium text-white font-dm">Contact Us</h2>
                            <div className="space-y-4 text-white font-dm text-[15px] pl-8">
                                <div className="flex gap-3 items-start">
                                    <MapPin className="shrink-0 mt-1" size={24} />
                                    <p className="leading-tight max-w-[280px]">NDC Campus Anonas Cor. Pureza St. Sta. Mesa, Manila, Philippines 01008</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <Phone className="shrink-0" size={24} />
                                    <p>(+63 2) 713 6009</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <Mail className="shrink-0" size={24} />
                                    <p>ce@pup.edu.ph</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="w-full bg-[#717182] py-8 px-4 mt-auto">
                <div className="max-w-[1000px] mx-auto text-center text-white font-dm space-y-1">
                    <p className="text-[16px] font-medium">Thesis Management System © {currentYear}</p>
                    <p className="text-[14px] opacity-80">For technical support, contact the system administrator</p>
                </div>
            </div>
        </footer>
    );
}