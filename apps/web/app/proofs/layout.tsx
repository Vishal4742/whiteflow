// /proofs is a client page, so its title lives here.
import type { ReactNode } from "react";

export const metadata = {
  title: "Private reads",
  description: "Two checks before any money moves: the app reads Whitechain through the Nym mixnet, and a guest wallet signs a payment message without leaving the browser.",
  alternates: { canonical: "/proofs" },
};

export default function ProofsLayout({ children }: { children: ReactNode }) {
  return children;
}
