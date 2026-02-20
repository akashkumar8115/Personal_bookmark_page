import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: {
    default: "Student Bookmark Dashboard | Admin Career Academy",
    template: "%s | ApnaACA Dashboard"
  },
  description: "The ultimate student productivity dashboard by Admin Career Academy (ApnaACA). Save your study materials, manage daily tasks, track scholarship links, and access career counseling resources all in one place.",
  icons: [{ rel: "icon", url: "/favicon.ico" }], // You can change this to your ACA favicon later
  openGraph: {
    title: "Student Bookmark Dashboard | Admin Career Academy",
    description: "Save important study links, manage tasks, and stay updated with ApnaACA scholarships and counseling. Your personal student workspace.",
    url: "https://bookmark.apnaaca.com", // Apna actual subdomain yahan daal dena
    siteName: "Admin Career Academy Workspace",
    locale: "en_IN", // Set to India for local SEO ranking
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Workspace & Bookmarks | Admin Career Academy",
    description: "Manage your daily tasks and favorite study sites easily with ApnaACA.",
  },
  keywords: [
    // Brand Keywords
    "Admin Career Academy",
    "ApnaACA",
    "Apna ACA",

    // Core Product Keywords
    "Student Bookmark Manager",
    "Study Dashboard",
    "Productivity Tool for Students",
    "Student Task Manager",
    "Online Study Planner",

    // Niche/Targeted Keywords (High Traffic)
    "Free Student Dashboard India",
    "Scholarship Tracker Tool",
    "Career Counseling Resources",
    "JNV Study Materials Links",
    "B.Tech Counseling Portal",
    "College Admission Bookmarks",
    "Save Study Links Online",
    "Daily ToDo List for Students"
  ],
  authors: [{ name: "Admin Career Academy" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <head>
        {/* Bootstrap Icons */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css" />
      </head>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}