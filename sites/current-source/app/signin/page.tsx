import type { Metadata } from "next";
import Link from "next/link";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "../chatgpt-auth";
import { Footer, Header } from "../qrv-app";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signin With ChatGPT",
  description: "Sign in to the QR-V Global Verification Network workspace with ChatGPT.",
};

function ProviderOption({
  href,
  method,
  label,
  detail,
}: {
  href: string;
  method: "email" | "google";
  label: string;
  detail: string;
}) {
  return (
    <a className="signin-option" href={href} target="_top" data-auth-method={method}>
      <span className={`signin-option-mark signin-option-mark-${method}`} aria-hidden="true">
        {method === "email" ? "@" : "G"}
      </span>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <span aria-hidden="true">→</span>
    </a>
  );
}

export default async function SigninPage() {
  const user = await getChatGPTUser();
  const signInPath = chatGPTSignInPath("/dashboard");

  return (
    <div className="site-shell">
      <Header />
      <main>
        <section className="subhero signin-hero">
          <div className="network-pattern" aria-hidden="true" />
          <div>
            <p className="eyebrow">QR-V network</p>
            <h1>Signin With ChatGPT</h1>
            <p>This service area is part of the QR‑V Global Verification Network.</p>
          </div>
        </section>

        <section className="subpage-content signin-content">
          <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><b>Signin</b></div>
          <div className="signin-layout">
            <section className="signin-panel" aria-labelledby="signin-choice-title">
              <p className="eyebrow">Secure access</p>
              {user ? (
                <>
                  <h2 id="signin-choice-title">You are signed in.</h2>
                  <p className="signin-intro">Continue to the QR-V workspace as <strong>{user.email}</strong>.</p>
                  <div className="signin-session-actions">
                    <Link className="button" href="/dashboard">Open dashboard</Link>
                    <a className="button button-outline" target="_top" href={chatGPTSignOutPath("/")}>Sign out</a>
                  </div>
                </>
              ) : (
                <>
                  <h2 id="signin-choice-title">Choose how to continue.</h2>
                  <p className="signin-intro">Use email or Google in the secure ChatGPT sign-in flow. QR-V does not collect passwords or provider credentials.</p>
                  <div className="signin-options">
                    <ProviderOption href={signInPath} method="email" label="Use email" detail="Continue with your email in ChatGPT" />
                    <ProviderOption href={signInPath} method="google" label="Continue with Google" detail="Use Google through ChatGPT" />
                  </div>
                  <a className="button signin-primary" target="_top" href={signInPath}>Sign in with ChatGPT</a>
                  <p className="signin-note">ChatGPT handles account choice and authentication. QR-V receives only the signed-in identity needed for the workspace.</p>
                </>
              )}
            </section>

            <aside className="signin-context">
              <p className="eyebrow">QR-V network</p>
              <h2>Verification access stays governed.</h2>
              <p>Signing in identifies a ChatGPT user for the QR-V workspace. It does not grant issuer authority.</p>
              <div className="signin-rules">
                <div><b>01</b><span>ChatGPT identity</span></div>
                <div><b>02</b><span>QR-V workspace access</span></div>
                <div><b>03</b><span>Issuer permissions remain separate</span></div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
