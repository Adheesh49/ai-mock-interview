'use client'; // This is essential for using hooks like usePathname

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs'; // Or your user profile component

function Header() {
  const path = usePathname(); // Get the current URL path

  // Define your menu items in an array for cleaner code
  const menu = [
    {
      name: 'Dashboard',
      path: '/dashboard'
    },
    {
      name: 'Questions',
      path: '/dashboard/questions' // Example path
    },
    {
      name: 'Upgrade',
      path: '/dashboard/upgrade' // Example path
    },
    {
      name: 'How it works?',
      path: '/dashboard/how-it-works' // Example path
    }
  ];

  return (
    <header className="flex p-4 items-center justify-between bg-white shadow-sm">
      {/* Logo */}
      <Image src={'/logo.svg'} width={160} height={100} alt='logo' />

      {/* Navigation Links */}
      <ul className='hidden md:flex gap-6'>
        {menu.map((item, index) => (
          <li key={index}>
            <Link 
              href={item.path} 
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer
                ${path === item.path && 'text-primary font-bold'}
              `}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* User Profile Button */}
      <UserButton />
    </header>
  );
}

export default Header;