import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import Cookies from 'js-cookie';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, Fragment, useContext, useEffect, useState } from 'react';
import { CartReset } from '../store/Actions';
import { Store } from '../store/Store';

function Header() {
  const { data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(
      cart.cartItems.reduce((prev, curr) => prev + (curr.quantity || 1), 0)
    );
  }, [cart.cartItems]);

  const handleLogout = () => {
    Cookies.remove('cart');
    dispatch(new CartReset());
    signOut({ callbackUrl: '/login' });
  };

  const [query, setQuery] = useState('');

  const router = useRouter();
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <header className="bg-primary py-3 px-6 shadow-md">
      <nav className="flex justify-between">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-lg font-semibold text-secondary">
              Amazona
            </span>
          </Link>
        </div>

        <form
          onSubmit={submitHandler}
          className="mx-auto  hidden w-full justify-center md:flex">
          <input
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            className="rounded-tr-none rounded-br-none p-1 text-sm   focus:ring-0"
            placeholder="Search products..."
          />
          <button
            className="rounded rounded-tl-none rounded-bl-none bg-secondary p-1 text-sm dark:text-primary"
            type="submit"
            id="button-addon2">
            <MagnifyingGlassIcon className="h-5 w-5"></MagnifyingGlassIcon>
          </button>
        </form>

        <div className="ml-2 flex">
          <Link
            href="/cart"
            className="flex cursor-pointer items-center gap-x-1 py-2 px-4 text-white hover:text-gray-500  transition-colors">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">Cart</span>
          </Link>

          {session?.user ? (
            <Menu as="div" className="relative inline-block">
              <Menu.Button className="relative z-10 flex items-center p-2 text-sm  ml-2 cursor-pointer rounded-md border py-2 px-4 text-white hover:bg-gray-100  hover:text-gray-500 transition-colors">
                <span className="mx-1">{session?.user.name}</span>
                <ChevronDownIcon className="h-5 w-5" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-xl dark:bg-gray-800">
                  <Menu.Item>
                    <Link
                      href="/profile"
                      className="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                      <Image
                        className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
                        width={32}
                        height={32}
                        src={`/avatar.jpg` || session?.user.image}
                        alt="avatar"
                      />
                      <div className="mx-1">
                        <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {session?.user.name}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {session?.user.email}
                        </p>
                      </div>
                    </Link>
                  </Menu.Item>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <Menu.Item>
                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                      view profile
                    </Link>
                  </Menu.Item>
                  <Menu.Item>
                    <Link
                      href="/order-history"
                      className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                      Order History
                    </Link>
                  </Menu.Item>
                  {session.user.isAdmin && (
                    <Menu.Item>
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                        Admin Dashboard
                      </Link>
                    </Menu.Item>
                  )}
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <Menu.Item>
                    <button
                      onClick={handleLogout}
                      className="w-full block text-start px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-200 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
                      Sign Out
                    </button>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link
              href="/login"
              className="ml-2 cursor-pointer rounded-md border py-2 px-4 text-white hover:bg-gray-100  hover:text-gray-500 transition-colors">
              <span className="text-sm font-medium">Sign in</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
