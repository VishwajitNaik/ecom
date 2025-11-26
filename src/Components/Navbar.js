'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getUserFromToken } from '../lib/getUser';
import { gsap } from 'gsap';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const router = useRouter();

  // GSAP Refs
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const menuItemsRef = useRef([]);
  const drawerRef = useRef(null);
  const backdropRef = useRef(null);
  const adminDropdownRef = useRef(null);
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token found:', !!token);

    if (token) {
      const user = getUserFromToken();
      console.log('User from token:', user);
      console.log('User role:', user?.role);

      setIsLoggedIn(true);
      setUserRole(user?.role || null);
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  // GSAP Animations
  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!navbarRef.current) return;

      const tl = gsap.timeline();

      // Navbar entrance animation
      if (navbarRef.current) {
        tl.fromTo(navbarRef.current,
          {
            y: -100,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
          }
        );
      }

      // Logo animation
      if (logoRef.current) {
        tl.fromTo(logoRef.current,
          {
            x: -50,
            opacity: 0,
            rotation: -10
          },
          {
            x: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
          },
          "-=0.4"
        );
      }

      // Menu items staggered animation
      if (menuItemsRef.current && menuItemsRef.current.length > 0) {
        tl.fromTo(menuItemsRef.current.filter(Boolean),
          {
            y: -20,
            opacity: 0,
            scale: 0.8
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.5)"
          },
          "-=0.3"
        );
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Drawer animations
  useEffect(() => {
    if (isDrawerOpen) {
      // Open drawer animation
      if (drawerRef.current) {
        gsap.fromTo(drawerRef.current,
          {
            x: 300,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
          }
        );
      }

      if (backdropRef.current) {
        gsap.fromTo(backdropRef.current,
          {
            opacity: 0
          },
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
          }
        );
      }

      // Animate drawer items
      gsap.fromTo(".drawer-item",
        {
          x: 50,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.2
        }
      );
    } else {
      // Close drawer animation
      if (drawerRef.current) {
        gsap.to(drawerRef.current, {
          x: 300,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        });
      }
      if (backdropRef.current) {
        gsap.to(backdropRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.in"
        });
      }
    }
  }, [isDrawerOpen]);

  // Admin dropdown animations
  useEffect(() => {
    if (adminDropdownRef.current) {
      if (isAdminDropdownOpen) {
        gsap.fromTo(adminDropdownRef.current,
          {
            opacity: 0,
            y: -10,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
          }
        );
      } else {
        gsap.to(adminDropdownRef.current, {
          opacity: 0,
          y: -10,
          scale: 0.95,
          duration: 0.15,
          ease: "power2.in"
        });
      }
    }
  }, [isAdminDropdownOpen]);

  // Close admin dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target) &&
          !event.target.closest('[data-admin-toggle]')) {
        setIsAdminDropdownOpen(false);
      }
    };

    if (isAdminDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAdminDropdownOpen]);

  const handleLogout = () => {
    // Logout animation
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
      gsap.to(navItems, {
        opacity: 0.5,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
          localStorage.removeItem('token');
          document.cookie = 'token=; path=/; max-age=0';
          setIsLoggedIn(false);
          setUserRole(null);
          toast.success('Logged out successfully');
          router.push('/');
        }
      });
    } else {
      // Fallback if no nav items found
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; max-age=0';
      setIsLoggedIn(false);
      setUserRole(null);
      toast.success('Logged out successfully');
      router.push('/');
    }
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsDrawerOpen(false);
    setIsAdminDropdownOpen(false); // Close admin dropdown

    // Click animation
    const element = document.querySelector(`[data-link="${path}"]`);
    if (element) {
      gsap.fromTo(element,
        { scale: 1 },
        {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        }
      );
    }
  };

  const toggleAdminDropdown = () => {
    setIsAdminDropdownOpen(!isAdminDropdownOpen);
  };

  const handleHoverEnter = (element) => {
    if (element) {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleHoverLeave = (element) => {
    if (element) {
      gsap.to(element, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const addToMenuRefs = (el, index) => {
    if (el && !menuItemsRef.current.includes(el)) {
      menuItemsRef.current[index] = el;
    }
  };

  return (
    <>
      <nav ref={navbarRef} className="shadow-lg shadow-gray-600 shadow-inset bg-gradient-to-r from-gray-900 to-gray-800 p-4 mx-10 my-5 rounded-xl relative z-[9999]">
        <div className="container mx-auto flex justify-between items-center">
          <div ref={logoRef} className="text-white text-xl font-bold">
            <Link href="/">Ecom Store</Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-4">
            <li ref={(el) => addToMenuRefs(el, 0)} className="nav-item">
              <Link
                href="/Products/Cart"
                data-link="/Products/Cart"
                className="text-white hover:text-gray-200 transition-colors duration-300 px-4 py-1 border-b-1 border-transparent hover:border-white"
                onClick={() => handleLinkClick('/Products/Cart')}
                onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
                onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}
              >
                Cart
              </Link>
            </li>
            <li ref={(el) => addToMenuRefs(el, 1)} className="nav-item">
              <Link
                href="/"
                data-link="/"
                className="text-white hover:text-gray-200 transition-colors duration-300 px-4 py-1 border-b-1 border-transparent hover:border-white"
                onClick={() => handleLinkClick('/')}
                onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
                onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}
              >
                Home
              </Link>
            </li>
            <li ref={(el) => addToMenuRefs(el, 2)} className="nav-item">
              <Link
                href="/Products"
                data-link="/Products"
                className="text-white hover:text-gray-200 transition-colors duration-300 px-4 py-1 border-b-1 border-transparent hover:border-white"
                onClick={() => handleLinkClick('/Products')}
                onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
                onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}
              >
                Products
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                {userRole === 'admin' && (
                  <li className="relative nav-item">
                    <button
                      data-admin-toggle
                      onClick={toggleAdminDropdown}
                      className="text-white hover:text-gray-200 transition-colors duration-300 px-4 py-1 border-b-1 border-transparent hover:border-white flex items-center space-x-1"
                      onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
                      onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}
                    >
                      <span>Admin</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isAdminDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Admin Dropdown */}
                    {isAdminDropdownOpen && (
                      <div
                        ref={adminDropdownRef}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[9999]"
                        style={{ opacity: 0 }}
                      >
                        <Link
                          href="/Products/add"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => handleLinkClick('/Products/add')}
                        >
                          Add Product
                        </Link>
                        <Link
                          href="/ProductPacks"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => handleLinkClick('/ProductPacks')}
                        >
                          Product Packs
                        </Link>
                        <Link
                          href="/admin/coupons"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => handleLinkClick('/admin/coupons')}
                        >
                          Manage Coupons
                        </Link>
                        <Link
                          href="/admin/carousel"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => handleLinkClick('/admin/carousel')}
                        >
                          Manage Carousel
                        </Link>
                        <Link
                          href="/admin/users"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => handleLinkClick('/admin/users')}
                        >
                          Manage Users
                        </Link>
                        <Link
                          href="/admin/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => handleLinkClick('/admin/orders')}
                        >
                          Manage Orders
                        </Link>
                      </div>
                    )}
                  </li>
                )}
                <li ref={(el) => addToMenuRefs(el, 3)} className="nav-item">
                  <Link
                    href="/user/orders"
                    data-link="/user/orders"
                    className="text-white hover:text-gray-200 transition-colors duration-300 px-4 py-1 border-b-1 border-transparent hover:border-white"
                    onClick={() => handleLinkClick('/user/orders')}
                    onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
                    onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}
                  >
                    My Orders
                  </Link>
                </li>
                <li ref={(el) => addToMenuRefs(el, 4)} className="nav-item">
                  <Link
                    href="/user/addresses"
                    data-link="/user/addresses"
                    className="text-white hover:text-gray-200 transition-colors duration-300 px-4 py-1 border-b-1 border-transparent hover:border-white"
                    onClick={() => handleLinkClick('/user/addresses')}
                    onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
                    onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}
                  >
                    My Addresses
                  </Link>
                </li>
                <li ref={(el) => addToMenuRefs(el, 5)} className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-gray-200 transition-colors duration-300 px-4 py-1 border-b-1 border-transparent hover:border-white"
                    onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
                    onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li ref={(el) => addToMenuRefs(el, 11)} className="nav-item">
                  <Link
                    href="/user/SignIn"
                    data-link="/user/SignIn"
                    className="text-white hover:text-gray-200 transition-colors duration-300 px-4 py-1 border-b-1 border-transparent hover:border-white"
                    onClick={() => handleLinkClick('/user/SignIn')}
                    onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
                    onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}
                  >
                    Sign In
                  </Link>
                </li>
                <li ref={(el) => addToMenuRefs(el, 12)} className="nav-item">
                  <Link
                    href="/user/SignUp"
                    data-link="/user/SignUp"
                    className="text-white hover:text-gray-200 transition-colors duration-300 px-4 py-1 border-b-1 border-transparent hover:border-white"
                    onClick={() => handleLinkClick('/user/SignUp')}
                    onMouseEnter={(e) => handleHoverEnter(e.currentTarget)}
                    onMouseLeave={(e) => handleHoverLeave(e.currentTarget)}
                  >
                    Sign Up
                  </Link>
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
        <div className="fixed inset-0 z-[9999] md:hidden">
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="fixed inset-0 bg-white/10 bg-opacity-50"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          {/* Drawer */}
          <div ref={drawerRef} className="fixed right-0 top-0 h-full w-64 bg-blue-600 shadow-lg transform transition-transform duration-300 ease-in-out">
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
              <li className="drawer-item">
                <Link href="/Products/Cart" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                  Cart
                </Link>
              </li>
              <li className="drawer-item">
                <Link href="/" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                  Home
                </Link>
              </li>
              <li className="drawer-item">
                <Link href="/Products" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                  Products
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  {userRole === 'admin' && (
                    <>
                      <li className="drawer-item">
                        <span className="block text-white font-semibold py-2 px-4 text-sm uppercase tracking-wide">
                          Admin Panel
                        </span>
                      </li>
                      <li className="drawer-item">
                        <Link href="/Products/add" className="block text-white hover:text-gray-200 py-2 pl-6" onClick={() => setIsDrawerOpen(false)}>
                          Add Product
                        </Link>
                      </li>
                      <li className="drawer-item">
                        <Link href="/ProductPacks" className="block text-white hover:text-gray-200 py-2 pl-6" onClick={() => setIsDrawerOpen(false)}>
                          Product Packs
                        </Link>
                      </li>
                      <li className="drawer-item">
                        <Link href="/admin/coupons" className="block text-white hover:text-gray-200 py-2 pl-6" onClick={() => setIsDrawerOpen(false)}>
                          Manage Coupons
                        </Link>
                      </li>
                      <li className="drawer-item">
                        <Link href="/admin/carousel" className="block text-white hover:text-gray-200 py-2 pl-6" onClick={() => setIsDrawerOpen(false)}>
                          Manage Carousel
                        </Link>
                      </li>
                      <li className="drawer-item">
                        <Link href="/admin/users" className="block text-white hover:text-gray-200 py-2 pl-6" onClick={() => setIsDrawerOpen(false)}>
                          Manage Users
                        </Link>
                      </li>
                      <li className="drawer-item">
                        <Link href="/admin/orders" className="block text-white hover:text-gray-200 py-2 pl-6" onClick={() => setIsDrawerOpen(false)}>
                          Manage Orders
                        </Link>
                      </li>
                    </>
                  )}
                  <li className="drawer-item">
                    <Link href="/user/orders" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                      My Orders
                    </Link>
                  </li>
                  <li className="drawer-item">
                    <Link href="/user/addresses" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                      My Addresses
                    </Link>
                  </li>
                  <li className="drawer-item">
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
                  <li className="drawer-item">
                    <Link href="/user/SignIn" className="block text-white hover:text-gray-200 py-2" onClick={() => setIsDrawerOpen(false)}>
                      Sign In
                    </Link>
                  </li>
                  <li className="drawer-item">
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

