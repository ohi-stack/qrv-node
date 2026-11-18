import QrvSubpage from "../subpage-app";
import type { Metadata } from "next";
import { getNewsPost } from "../news-data";

const pageMetadata: Record<string, { title: string; description: string }> = {
  verify: { title: "Verify a Record", description: "Resolve a QR-V identifier against the live public registry and inspect its current issuer, status, and integrity state." },
  registry: { title: "Public Registry", description: "Search canonical public QR-V records by identifier, title, or issuer." },
  "how-it-works": { title: "How QR-V Works", description: "Follow the QR-V issue, canonicalize, register, verify, and revoke lifecycle." },
  protocol: { title: "QRVP-1 Protocol", description: "Review the QR-V identifier, resolver, registry, integrity, status, and privacy model." },
  issuer: { title: "Issuer Access", description: "Review the QR-V issuer workflow and request an authorized implementation pilot." },
  pricing: { title: "Plans and Pricing", description: "Compare QR-V issuer subscriptions, API plans, implementation services, systems, publications, and launch packages." },
  developers: { title: "Developer Portal", description: "Use the live QR-V verification, registry, status, and issuer-intake API endpoints." },
  docs: { title: "Documentation", description: "Read QR-V implementation concepts, identifier formats, verification states, and launch guidance." },
  status: { title: "Network Status", description: "Check QR-V public verification services and disclosed activation-pending surfaces." },
  network: { title: "Network Architecture", description: "Review the QR-V production origin, live API service, and dedicated API hostname plan." },
  security: { title: "Security and Trust", description: "Review QR-V integrity, issuer authority, privacy, application, audit, and operations controls." },
  about: { title: "About QR-V", description: "Read the QR-V platform purpose, founder record, commercial ownership, protocol, and public objective." },
  contact: { title: "Issuer and Implementation Inquiry", description: "Submit a secure planning inquiry for issuer, developer, or enterprise QR-V implementation." },
  store: { title: "Verification Products", description: "Explore QR-V certificate pilots, issuer plans, implementation services, and enterprise verification systems." },
  products: { title: "Verification Products", description: "Review the QR-V product families defined for certificates, documents, identity, memberships, products, assets, and APIs." },
  solutions: { title: "QR-V Solutions", description: "Explore governed verification use cases for education, government, business, identity, products, property, assets, and agents." },
  enterprise: { title: "Enterprise Verification", description: "Review enterprise API, integration, white-label, bulk issuance, security, and support pathways." },
  resources: { title: "QR-V Resources", description: "Browse guides, tutorials, examples, use cases, frequently asked questions, downloads, and support resources." },
  company: { title: "About QR-V", description: "Review the QR-V organization, origin, partners, contact path, and network updates." },
  support: { title: "QR-V Support", description: "Find issuer, developer, verification, record-reporting, and contact support pathways." },
  legal: { title: "QR-V Legal", description: "Review QR-V terms, privacy, cookies, acceptable use, API terms, issuer agreements, and disclosures." },
  news: { title: "News and Insights", description: "Read QR-V protocol, registry, product, security, research, and network updates." },
  terms: { title: "Terms of Use", description: "Read the public terms governing the QR-V website, verifier, registry, API, and inquiry services." },
  privacy: { title: "Privacy Notice", description: "Read how QR-V handles public verification activity and issuer-inquiry information." },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const root = slug[0] ?? "";
  if (root === "news" && slug[1]) {
    const post = getNewsPost(slug.slice(1).join("/"));
    if (post) return {
      title: post.title,
      description: post.excerpt,
      openGraph: { title: post.title, description: post.excerpt, images: [] },
      twitter: { title: post.title, description: post.excerpt, images: [] },
    };
  }

  const metadata = pageMetadata[root];
  if (!metadata) return {};
  const itemSpecific = root === "verify" && slug.length > 1;
  return {
    ...metadata,
    ...(itemSpecific ? {
      openGraph: { title: metadata.title, description: metadata.description, images: [] },
      twitter: { title: metadata.title, description: metadata.description, images: [] },
    } : {}),
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ qrvid?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  return <QrvSubpage path={slug.join("/")} queryId={query.qrvid} />;
}
