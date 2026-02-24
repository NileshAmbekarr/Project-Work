'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Github, TrendingUp, AlertTriangle } from 'lucide-react';

const navItems = [
    { href: '/', label: 'Home' },
    { href: '/stocks', label: 'Stocks' },
    { href: '/verify', label: 'Verify', highlight: true },
    { href: '/performance', label: 'Performance' },
    { href: '/methodology', label: 'Methodology' },
];

export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50">
            {/* Disclaimer banner */}
            <div className="disclaimer-banner flex items-center justify-center gap-2">
                <AlertTriangle size={14} />
                <span>Academic Research Project — <strong>Not Financial Advice</strong></span>
                <Link href="/methodology#disclaimer" className="underline ml-2 opacity-80 hover:opacity-100">
                    Read Disclaimer
                </Link>
            </div>

            {/* Main header */}
            <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 lg:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <TrendingUp size={18} className="text-white" />
                        </div>
                        <span className="hidden sm:inline">Nifty 50 ML</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === item.href
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    } ${item.highlight ? 'relative' : ''}`}
                            >
                                {item.label}
                                {item.highlight && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
                                )}
                            </Link>
                        ))}
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 p-2 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <Github size={20} />
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden p-2 text-gray-600"
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile nav */}
                {open && (
                    <div className="md:hidden pb-4 border-t border-gray-100">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`block px-4 py-3 text-sm font-medium ${pathname === item.href ? 'text-blue-700 bg-blue-50' : 'text-gray-700'
                                    }`}
                            >
                                {item.label}
                                {item.highlight && ' ⭐'}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </header>
    );
}
