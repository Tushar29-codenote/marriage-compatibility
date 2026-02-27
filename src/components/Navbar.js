'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    const links = [
        { href: '/', label: 'Kundli Milan', icon: '💑' },
        { href: '/predictions', label: 'Vedic Insights', icon: '🔮' },
    ];

    return (
        <nav className="sticky top-0 z-50 glass-card dark:bg-gray-900/80 dark:border-gray-700/50 border-b border-white/30 shadow-sm dark:shadow-gray-900/30">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-xl">🪐</span>
                    <span className="font-bold text-lg gradient-text group-hover:opacity-80 transition-opacity">
                        AstroMilan
                    </span>
                </Link>

                {/* Nav Links + Theme Toggle */}
                <div className="flex items-center gap-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5
                  ${isActive
                                        ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-gray-800 dark:hover:text-white'
                                    }`}
                            >
                                <span>{link.icon}</span>
                                <span className="hidden sm:inline">{link.label}</span>
                            </Link>
                        );
                    })}

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="ml-2 p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 hover:scale-110"
                        aria-label="Toggle theme"
                        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    >
                        {theme === 'light' ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}
