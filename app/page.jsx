'use client'; 

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, useUser } from "@clerk/nextjs"; 
import LandingHeader from "./dashboard/_components/LandingHeader"; 

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div>
      <LandingHeader />
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        

        <div className="relative w-full max-w-6xl grid md:grid-cols-2 items-center gap-12 px-4">
          
          {/* Left Side: Headline and Call to Action (No changes here) */}
          <div className="flex flex-col justify-center space-y-4 text-left z-10">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-primary">
                Ace Your Next Tech
                <br />
                Interview
              </h1>
              <p className="max-w-md text-gray-600 md:text-xl">
                Practice with our AI-powered mock interviews, get instant,
                intelligent feedback, and land your dream job.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <Button size="lg">Go to Your Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/dashboard">
                    <Button size="lg">Get Started for Free</Button>
                  </Link>
                  <SignInButton mode="modal">
                    <Button size="lg" variant="outline">Login</Button>
                  </SignInButton>
                </>
              )}
            </div>
          </div>

          <div className="z-10 hidden md:flex justify-center">
            <Image
              src="/hero-image.png"
              width={550}  // Increased size for better resolution
              height={550} // Increased size for better resolution
              alt="AI Mock Interview"
              className="w-full h-auto max-w-md rounded-xl object-contain" // Fills width, maintains aspect ratio
            />
          </div>

          {/* Decorative Background Shape (Unchanged) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-100/50 rounded-full blur-3xl -z-10" />
        </div>
      </main>
    </div>
  );
}