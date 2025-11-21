import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModeProvider } from "../context/ModeContext";
import { ProfileProvider } from "../context/ProfileContext";
import HeaderWithToggle from "../components/HeaderWithToggle";
import ThemeWrapper from "../components/ThemeWrapper";
import SessionProvider from "../components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Profile App",
  description: "Explore profiles and visualizations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ModeProvider>
            <ProfileProvider>
              <ThemeWrapper>
                <HeaderWithToggle />
                <main>
                  {children}
                </main>
              </ThemeWrapper>
            </ProfileProvider>
          </ModeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
