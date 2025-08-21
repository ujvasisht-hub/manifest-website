'use client'; // Required for the "Back to Top" button's onClick event

import Link from 'next/link';
import Image from 'next/image';
import { Montserrat } from 'next/font/google';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'; // Import Instagram and WhatsApp icons
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'] });

// We are defining metadata in each page.js now, so we can remove the global one here.

// New "Back to Top" component
const BackToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-3 rounded-full shadow-lg transition-transform hover:scale-110"
      aria-label="Go to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className="flex flex-col min-h-screen bg-[#1A1A1A]">
        <header className="bg-[#1A1A1A] shadow-md border-b border-gray-700 sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <div>
              <Link href="/">
                <Image src="/logo.png" alt="Manifest by TMN Logo" width={150} height={50} priority />
              </Link>
            </div>
            <div className="flex space-x-6 text-white font-medium">
              <Link href="/" className="hover:text-teal-400 transition-colors">Workshops</Link>
              <Link href="/about" className="hover:text-teal-400 transition-colors">About</Link>
              <Link href="/contact" className="hover:text-teal-400 transition-colors">Contact</Link>
            </div>
          </nav>
        </header>
        
        <main className="flex-grow">{children}</main>
        
        {/* START: New Footer Code */}
        <footer className="bg-black text-gray-300 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Column 1: Logo and Contact */}
              <div className="space-y-4">
                <Image src="/logo.png" alt="Manifest by TMN Logo" width={150} height={50} />
                <a href="https://maps.app.goo.gl/whBvZErKRFXYywyC7" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white">
                  123 Creative Street<br/>
                  Arts District, Mumbai<br/>
                  Maharashtra 400001
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-400 hover:text-white">
                  <FaWhatsapp />
                  <span>+91 98765 43210</span>
                </a>
                <a href="mailto:hello@manifestbytmn.com" className="block text-gray-400 hover:text-white">
                  hello@manifestbytmn.com
                </a>
              </div>

              {/* Column 2: Social Links */}
              <div>
                <h3 className="font-bold text-white mb-4">Follow Us</h3>
                <div className="space-y-3">
                  <a href="https://instagram.com/manifestbytmn" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-teal-400">
                    <FaInstagram />
                    <span>Manifest by TMN</span>
                  </a>
                   <a href="https://instagram.com/twinmenot" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-teal-400">
                    <FaInstagram />
                    <span>Twin Me Not</span>
                  </a>
                   <a href="https://instagram.com/antrachandna" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-teal-400">
                    <FaInstagram />
                    <span>Antra Chandna</span>
                  </a>
                   <a href="https://instagram.com/aanchal.chandna" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-teal-400">
                    <FaInstagram />
                    <span>Aachal Chandna</span>
                  </a>
                </div>
              </div>

              {/* Column 3: Legal Links */}
              <div>
                <h3 className="font-bold text-white mb-4">Policies</h3>
                <div className="space-y-3 flex flex-col">
                  <Link href="/terms-and-conditions" className="hover:text-teal-400">Terms & Conditions</Link>
                  <Link href="/privacy-policy" className="hover:text-teal-400">Privacy Policy</Link>
                  <Link href="/cancellation-and-refunds" className="hover:text-teal-400">Cancellation & Refunds</Link>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} Manifest by TMN. All rights reserved.</p>
              <p className="mt-1">Made with ❤️ in India.</p>
            </div>
          </div>
        </footer>
        {/* END: New Footer Code */}

        <BackToTopButton />
      </body>
    </html>
  );
}