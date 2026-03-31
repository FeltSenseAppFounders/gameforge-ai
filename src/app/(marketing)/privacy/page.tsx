import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — PlayFoundry AI",
};

export default function PrivacyPage() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-dark">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-heading uppercase text-primary-light mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-neutral-500 mb-10">
          Last updated: March 23, 2026
        </p>

        <div className="space-y-8 text-neutral-400 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-neutral-200 mb-3">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide when creating an account,
              including your name and email address. We also collect usage data
              such as pages visited, games created, and features used.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-200 mb-3">
              2. How We Use Your Information
            </h2>
            <p>
              We use your information to provide and improve our service, send
              relevant communications, and ensure the security of your account.
              We do not sell your personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-200 mb-3">
              3. Data Storage
            </h2>
            <p>
              Your data is stored securely using industry-standard encryption.
              We use Supabase as our database provider, which employs
              enterprise-grade security measures including encryption at rest and
              in transit.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-200 mb-3">
              4. Demo Notice
            </h2>
            <p>
              This is a demonstration product. Data entered during the demo
              experience, including generated games, is used solely for
              demonstration purposes and may be periodically cleared.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-200 mb-3">
              5. Third-Party Services
            </h2>
            <p>
              We use the following third-party services to operate our platform:
              Supabase (authentication and database), Vercel (hosting and
              analytics), and Anthropic Claude API (AI game generation). Each
              provider has their own privacy policy governing their handling of
              data.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-200 mb-3">
              6. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal
              data at any time. You may also request a copy of the data we hold
              about you. To exercise these rights, contact us using the
              information below.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-200 mb-3">
              7. Contact
            </h2>
            <p>
              For privacy-related inquiries, please contact us at{" "}
              <span className="text-primary-light font-medium">
                support@feltsense.com
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
