import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deploy Base Quest - Mainnet",
};

export default function DeployPage() {
  return (
    <iframe
      src="/deploy.html"
      style={{ width: "100%", height: "100vh", border: "none" }}
    />
  );
}
