import { AuthProvider } from "@/contexts/AuthContext";
import TrackingProvider from "@/components/providers/TrackingProvider";
import { Toaster } from "@/components/ui/toaster";
import { AnalyticsProvider } from "./analytics";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <TrackingProvider>
            {children}
            <Toaster />
            <AnalyticsProvider />
          </TrackingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
