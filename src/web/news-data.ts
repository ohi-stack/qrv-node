export type NewsPost = {
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  author: string;
  excerpt: string;
};

const importedPosts = [
  ["Introducing the QR-V™ Global Verification Network", "QR-V Announcements", "2026-03-03T01:11:00Z"],
  ["The Launch of QR-V™: A New Infrastructure for Digital Verification", "QR-V Announcements", "2026-03-03T09:12:00Z"],
  ["QR-V Ecosystem Development Update", "QR-V Announcements", "2026-03-03T13:11:00Z"],
  ["Expanding the QR-V Verification Ecosystem", "QR-V Announcements", "2026-03-03T21:12:00Z"],
  ["QRVP-1: Technical Overview of the QR-V Verification Protocol", "QRVP-1 Protocol", "2026-03-04T01:11:00Z"],
  ["Understanding the Architecture of the QR-V Internet Protocol", "QRVP-1 Protocol", "2026-03-04T09:12:00Z"],
  ["QRVP-1 Protocol Update and Improvements", "QRVP-1 Protocol", "2026-03-04T13:11:00Z"],
  ["Evolution of the QR-V Verification Standard", "QRVP-1 Protocol", "2026-03-04T21:12:00Z"],
  ["Getting Started with the QR-V Verification API", "Developer Resources", "2026-03-05T01:11:00Z"],
  ["Building Applications with the QR-V Verification API", "Developer Resources", "2026-03-05T09:12:00Z"],
  ["QR-V Developer SDK: Tools for Building Verification Apps", "Developer Resources", "2026-03-05T13:11:00Z"],
  ["Introducing the QR-V Software Development Kit", "Developer Resources", "2026-03-05T21:12:00Z"],
  ["Using QR-V for Secure Identity Verification", "Use Cases", "2026-03-06T01:11:00Z"],
  ["Digital Identity Authentication with QR-V", "Use Cases", "2026-03-06T09:12:00Z"],
  ["Verifying Diplomas and Certificates with QR-V", "Use Cases", "2026-03-06T13:11:00Z"],
  ["Education Credential Authentication with QR-V", "Use Cases", "2026-03-06T21:12:00Z"],
  ["Inside the Architecture of the QR-V Registry", "QR-V Registry", "2026-03-07T01:11:00Z"],
  ["Building the Global QR-V Verification Registry", "QR-V Registry", "2026-03-07T09:12:00Z"],
  ["How QR-V Verification Nodes Work", "QR-V Registry", "2026-03-07T13:11:00Z"],
  ["Operating a Node in the QR-V Network", "QR-V Registry", "2026-03-07T21:12:00Z"],
  ["Cryptographic Methods Used in QR-V Verification", "Security & Verification", "2026-03-08T01:11:00Z"],
  ["How QR-V Secures Verification Records", "Security & Verification", "2026-03-08T09:12:00Z"],
  ["Using QR-V to Prevent Counterfeiting", "Security & Verification", "2026-03-08T13:11:00Z"],
  ["Anti-Fraud Protection Through QR-V Verification", "Security & Verification", "2026-03-08T21:12:00Z"],
  ["Government Adoption of QR-V Verification Systems", "Industry Adoption", "2026-03-09T01:11:00Z"],
  ["QR-V for Public Sector Verification Infrastructure", "Industry Adoption", "2026-03-09T09:12:00Z"],
  ["Enterprise Adoption of QR-V Verification", "Industry Adoption", "2026-03-09T13:11:00Z"],
  ["Corporate Applications of QR-V Technology", "Industry Adoption", "2026-03-09T21:12:00Z"],
  ["The QR-V Verification Framework: Technical Overview", "Research & Whitepapers", "2026-03-10T01:11:00Z"],
  ["QR-V Whitepaper: Global Verification Infrastructure", "Research & Whitepapers", "2026-03-10T09:12:00Z"],
  ["Designing the QR-V Network Architecture", "Research & Whitepapers", "2026-03-10T13:11:00Z"],
  ["Infrastructure Models for Global Verification Systems", "Research & Whitepapers", "2026-03-10T21:12:00Z"],
  ["How to Generate a QR-V Verification Code", "Tutorials", "2026-03-11T01:11:00Z"],
  ["Creating Verified QR Codes for Documents", "Tutorials", "2026-03-11T09:12:00Z"],
  ["How to Verify QR-V Records with a Smartphone", "Tutorials", "2026-03-11T13:11:00Z"],
  ["Step-by-Step Guide to QR-V Verification", "Tutorials", "2026-03-11T21:12:00Z"],
  ["Latest Updates to the QR-V Platform", "News & Updates", "2026-03-12T01:11:00Z"],
  ["Platform Improvements in the QR-V Network", "News & Updates", "2026-03-12T09:12:00Z"],
  ["Community Growth in the QR-V Ecosystem", "News & Updates", "2026-03-12T13:11:00Z"],
  ["Developer Community Updates", "News & Updates", "2026-03-12T21:12:00Z"],
] as const;

function toSlug(title: string) {
  return title
    .replace(/[™®©]/g, "")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const newsPosts: NewsPost[] = importedPosts
  .map(([title, category, publishedAt]) => ({
    title,
    category,
    publishedAt,
    slug: toSlug(title),
    author: "QR-V Editorial",
    excerpt: `${title}. This article discusses aspects of the QR-V™ Global Verification Network.`,
  }))
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const newsCategories = ["All", ...Array.from(new Set(newsPosts.map(post => post.category)))];

export function getNewsPost(slug: string) {
  return newsPosts.find(post => post.slug === slug);
}

export function formatNewsDate(publishedAt: string, includeTime = false) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...(includeTime ? { hour: "numeric", minute: "2-digit", timeZoneName: "short" } : {}),
    timeZone: "UTC",
  }).format(new Date(publishedAt));
}
