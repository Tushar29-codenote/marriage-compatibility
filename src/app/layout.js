import './globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata = {
  title: 'AstroMilan | AI-Powered Kundli Milan & Vedic Insights',
  description: 'Check marriage compatibility with AI-powered Kundli Milan. Get Guna scores, Ashta Koota analysis, yearly Vedic insights for career, finance, health & relationships.',
  keywords: 'kundli milan, marriage compatibility, guna milan, ashta koota, horoscope matching, vedic astrology, kundli insights',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
