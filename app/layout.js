import { ThemeProvider } from './ThemeContext';
import Navbar from '../Components/Navbar';
import './globals.css';
import Footer from '../Components/Footer';

export const metadata = {
  title: 'Background Remover - Instant AI-Powered Tool',
  description: 'Remove image backgrounds instantly with our AI-powered tool. Free, fast, and high-quality background removal.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 ease-in-out">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}


