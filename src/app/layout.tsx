import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@copilotkit/react-ui/styles.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntelliCrawl Recruiter - AI-Powered Developer Discovery",
  description: "Find and recruit GitHub developers using AI-powered search, automated candidate management, and intelligent outreach assistance.",
  keywords: "developer recruitment, GitHub search, AI recruiting, talent discovery, Tavily, Appwrite, CopilotKit",
  authors: [{ name: "IntelliCrawl Team" }],
  openGraph: {
    title: "IntelliCrawl Recruiter",
    description: "AI-powered GitHub developer discovery and recruitment platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
