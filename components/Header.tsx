import Link from 'next/link';
import React from 'react';

function Header() {
  return (
    <header className="bg-[#453C67] py-3 px-6 shadow-md">
      <nav className="flex justify-between">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-lg font-semibold text-[#F2F7A1]">Amazona</span>
          </Link>
        </div>

        <div className="ml-2 flex">
          <Link href="/cart" className="flex cursor-pointer items-center gap-x-1 py-2 px-4 text-white hover:text-gray-500  transition-colors">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                3
              </span>
            </div>
            <span className="text-sm font-medium">Cart</span>
          </Link>

          <Link href="/login" className="ml-2 flex cursor-pointer items-center gap-x-1 rounded-md border py-2 px-4 text-white hover:bg-gray-100  hover:text-gray-500 transition-colors">
            <span className="text-sm font-medium">Sign in</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
