import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Manifest by TMN',
  description: 'Creative workshops and studio space',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="bg-white shadow-md">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <Link href="/" className="text-xl font-bold text-gray-900">
                Manifest by TMN
              </Link>
            </div>
            <div className="flex space-x-6 text-gray-700 font-medium">
              <Link href="/" className="hover:text-teal-600 transition-colors">
                Workshops
              </Link>
              <Link href="/about" className="hover:text-teal-600 transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-teal-600 transition-colors">
                Contact
              </Link>
            </div>
          </nav>
        </header>
        
        <main className="flex-grow">{children}</main>
        
        {/* START: New Footer Code */}
        <footer className="bg-gray-800 text-gray-300 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center space-x-6">
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cancellation-and-refunds" className="hover:text-white transition-colors">
                Cancellation & Refunds
              </Link>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Manifest by TMN. All rights reserved.
            </div>
          </div>
        </footer>
        {/* END: New Footer Code */}
      </body>
    </html>
  );
}