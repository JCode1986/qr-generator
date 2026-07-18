import { Geist } from "next/font/google";
import { SmoothAnchorScroll } from "@/components/layout/smooth-anchor-scroll";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>
        <script
          id="quickqr-suppress-native-anchor-scroll"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                if (!window.location.hash) return;
                try {
                  window.sessionStorage.setItem("quickqr-pending-scroll-hash", window.location.hash);
                  window.history.replaceState(null, "", window.location.pathname + window.location.search);
                  window.scrollTo(0, 0);
                } catch {}
              })();
            `,
          }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <SmoothAnchorScroll />
      </body>
    </html>
  );
}
