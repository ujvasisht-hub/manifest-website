import Link from 'next/link'; // Import the Link component
import './globals.css';

export const metadata = {
  title: 'Manifest by TMN',
  description: 'Creative workshops and studio space',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* START: New Header Code */}
        <header className="bg-white shadow-md">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              {/* You can replace this text with your logo */}
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
        {/* END: New Header Code */}

        <main>{children}</main>

        {/* You can add a shared footer here later if you want */}
      </body>
    </html>
  );
}