import { getAppUrl } from "@/lib/stripe/stripe-server";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${getAppUrl()}/sitemap.xml`,
  };
}
