import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZIAD'S ARCHIVE — Frontend Engineer",
  description:
    "Digital Records of Ziad Ayman — A curated archive of frontend engineering work, experiments, and creative development.",
  keywords: ["frontend", "developer", "portfolio", "Next.js", "React", "archive"],
  openGraph: {
    title: "ZIAD'S ARCHIVE",
    description: "Digital Records of Ziad Ayman — Frontend Engineer",
    type: "website",
  },
};

import { ThemeProvider } from "./components/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Film grain overlay */}
          <div className="grain-overlay" aria-hidden="true" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
