'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getUserFromToken } from '../lib/getUser';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      const user = getUserFromToken();
      setUserRole(user?.role || null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0';
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <>
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-xl font-bold">
            <Link href="/">Ecom Store</Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-4">
            <li>
              <Link href="/Products/Cart" className="text-white hover:text-gray-200">Cart</Link>
            </li>
            <li>
              <Link href="/" className="text-white hover:text-gray-200">Home</Link>
            </li>
            <li>
              <Link href="/Products" className="text-white hover:text-gray-200">Products</Link>
            </li>
            {isLoggedIn ? (
              <>
                {userRole === 'admin' && (
                  <>
                    <li>
                      <Link href="/Products/add" className="text-white hover:text-gray-200">Add Product</Link>
                    </li>
                    <li>
                      <Link href="/admin/coupons" className="text-white hover:text-gray-200">Manage Coupons</Link>
                    </li>
                    <li>
                      <Link href="/admin/carousel" className="text-white hover:text-gray-200">Manage Carousel</Link>
                    </li>
                  </>
                )}
                <li>
                  <Link href="/user/orders" className="text-white hover:text-gray-200">My Orders</Link>
                </li>
                <li>
                  <Link href="/user/addresses" className="text-white hover:text-gray-200">My Addresses</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-white hover:text-gray-200">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/user/SignIn" className="text-white hover:text-gray-200">Sign In</Link>
                </li>
                <li>
                  <Link href="/user/SignUp" className="text-white hover:text-gray-200">Sign Up</Link>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-white/10 bg-opacity-50"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-64 bg-blue-600 shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-4">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-white float-right focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ul className="mt-8 space-y-4 px-4">
              <li>
                <Link href="/Products/Cart" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/Products" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                  Products
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  {userRole === 'admin' && (
                    <>
                      <li>
                        <Link href="/Products/add" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                          Add Product
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin/coupons" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                          Manage Coupons
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin/carousel" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                          Manage Carousel
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link href="/user/orders" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link href="/user/addresses" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                      My Addresses
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDrawerOpen(false);
                      }}
                      className="block text-white hover:text-gray-200 py-2 w-full text-left"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/user/SignIn" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link href="/user/SignUp" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

