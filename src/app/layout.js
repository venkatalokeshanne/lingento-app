import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserPreferencesProvider } from "@/context/UserPreferencesContext";
import Navigation from "@/components/Navigation";
import PWAComponents from "@/components/PWAComponents";
import TutorialManager from "@/components/TutorialManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lingento | Learn French Effectively",
  description: "Master French vocabulary with an effective memorization method based on spaced repetition.",
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lingento",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <UserPreferencesProvider>
              <TutorialManager>
                <PWAComponents />
                <Navigation />
                <main className="min-h-screen pt-16">
                  {children}
                </main>
              </TutorialManager>
            </UserPreferencesProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
