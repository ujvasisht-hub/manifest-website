import Link from 'next/link';
import Image from 'next/image'; // 1. Import the Image component for the logo
import { Montserrat } from 'next/font/google'; // 2. Import the Montserrat font
import './globals.css';

// 3. Configure the Montserrat font
const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata = {
  title: 'Manifest by TMN',
  description: 'Creative workshops and studio space',
};

export default function RootLayout({ children }) {
  return (
    // 4. Apply the font to the whole site
    <html lang="en" className={montserrat.className}>
      <body className="flex flex-col min-h-screen">
        {/* 5. Update header with new background color */}
        <header className="bg-[#1A1A1A] shadow-md border-b border-gray-700">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <div>
              {/* 6. Replace text with clickable logo Image */}
              <Link href="/">
                <Image
                  src="/logo.png" // Path to your logo in the public folder
                  alt="Manifest by TMN Logo"
                  width={150} // Adjust width as needed
                  height={50}  // Adjust height as needed
                  priority // Helps load the logo faster
                />
              </Link>
            </div>
            {/* 7. Update link colors to white */}
            <div className="flex space-x-6 text-white font-medium">
              <Link href="/" className="hover:text-teal-400 transition-colors">
                Workshops
              </Link>
              <Link href="/about" className="hover:text-teal-400 transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-teal-400 transition-colors">
                Contact
              </Link>
            </div>
          </nav>
        </header>
        
        <main className="flex-grow">{children}</main>
        
        <footer className="bg-gray-800 text-gray-300 mt-12">
          {/* ... your existing footer code ... */}
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div className="flex justify-center space-x-6"><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link><Link href="/cancellation-and-refunds" className="hover:text-white transition-colors">Cancellation & Refunds</Link></div><div className="mt-6 text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} Manifest by TMN. All rights reserved.</div></div>
        </footer>
      </body>
    </html>
  );
}