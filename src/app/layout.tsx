import type { Metadata } from "next";
import { Inter, Space_Grotesk, Orbitron } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { EasterEggs } from "@/components/EasterEggs";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Aryan Yadav | ML & GenAI Engineer",
  description: "Futuristic 3D storytelling portfolio of Aryan Yadav.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('loaded') === 'true') {
                  const style = document.createElement('style');
                  style.innerHTML = '.loading-screen-container { display: none !important; }';
                  document.head.appendChild(style);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${orbitron.variable} antialiased bg-[#050508] text-white font-sans`}
      >
        <EasterEggs />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
