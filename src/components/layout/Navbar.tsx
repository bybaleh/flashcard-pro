'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">FlashCardPro</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/dashboard' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
