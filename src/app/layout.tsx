import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "KNOW AKS – Your All-in-One Digital Workspace",
  description:
    "KNOW AKS is your all-in-one digital workspace for notes, tasks, and team collaboration — built for productivity and security.",
  keywords: ["workspace", "notes", "tasks", "productivity", "collaboration"],
  authors: [{ name: "KNOW AKS" }],
  creator: "KNOW AKS",
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "KNOW AKS – Your All-in-One Digital Workspace",
    description:
      "KNOW AKS is your all-in-one digital workspace for notes, tasks, and team collaboration.",
    siteName: "KNOW AKS",
  },
  twitter: {
    card: "summary_large_image",
    title: "KNOW AKS – Your All-in-One Digital Workspace",
    description:
      "KNOW AKS is your all-in-one digital workspace for notes, tasks, and team collaboration.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
