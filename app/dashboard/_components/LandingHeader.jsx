// File: app/dashboard/_components/LandingHeader.jsx

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function LandingHeader() {
  return (
    <header className="p-4 flex justify-between items-center bg-transparent absolute top-0 left-0 w-full">
      <Image src={'/logo.svg'} width={140} height={80} alt='logo' />
      <Link href="/dashboard">
        <Button variant="outline">Go to Dashboard</Button>
      </Link>
    </header>
  );
}

export default LandingHeader;