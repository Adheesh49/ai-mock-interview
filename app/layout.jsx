import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from "next/font/google";
import "./globals.css"; // The global stylesheet should be here

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Mock Interview",
  description: "Ace your next tech interview with AI-powered feedback.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}