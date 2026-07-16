import { Container } from "@/components/layout/container";
import { PurchaseVerifier } from "@/components/checkout/purchase-verifier";

export const metadata = {
  title: "Checkout Success",
  description: "Verify a QuickQR Pro checkout session.",
};

export default async function CheckoutSuccessPage({ searchParams }) {
  const params = await searchParams;

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <PurchaseVerifier sessionId={params?.session_id || ""} />
        </div>
      </Container>
    </section>
  );
}
