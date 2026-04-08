import Link from 'next/link';

export const metadata = { title: 'Privacy Policy — SmartInvest' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-0)]">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-teal-100 mt-2">Last updated: April 9, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose-style space-y-10">
          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">1. Introduction</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              S4AI Limited ("we", "our", "us") operates SmartInvest, a stock market simulation platform. This Privacy Policy explains how we handle information when you use our Platform. We are committed to protecting your privacy and being transparent about our practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">2. Information We Collect</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
              SmartInvest is designed with privacy as a priority. Here is what we handle:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">Account Information</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  When you create an account, you provide a username, email address, and password. This information is stored exclusively in your browser's localStorage and is never transmitted to any external server.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">Trading Data</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  All portfolio data, transaction history, watchlists, and net worth history are stored locally in your browser. We do not have access to this data.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">No Analytics or Tracking</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  We do not use cookies, analytics tools, tracking pixels, or any third-party monitoring services. Your browsing activity on SmartInvest is not tracked or recorded.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">3. How We Store Your Data</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              All data is stored using your browser's localStorage API. This means:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)] mt-3">
              <li>Data remains on your device and is never sent to our servers</li>
              <li>Data persists until you clear your browser storage or uninstall the app</li>
              <li>Data is not shared between different browsers or devices</li>
              <li>We cannot recover your data if it is deleted</li>
              <li>Passwords are hashed before storage for additional security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">4. Data Sharing</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We do not sell, trade, rent, or share any user information with third parties. Since all data is stored locally on your device, we have no access to it and therefore cannot share it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">5. Children's Privacy</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              SmartInvest is an educational platform suitable for users of all ages. Since we do not collect or store any personal data on our servers, there are no specific age restrictions. However, we recommend that children under 13 use the Platform under parental supervision.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">6. Your Rights</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-3">You have complete control over your data:</p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li><strong>Access:</strong> All your data is visible within the app (Portfolio, Transactions, etc.)</li>
              <li><strong>Delete:</strong> Clear your browser's localStorage to permanently remove all data</li>
              <li><strong>Export:</strong> You can view your data through browser developer tools</li>
              <li><strong>Portability:</strong> Data is stored in standard JSON format in localStorage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">7. Security</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              While we do not store data on external servers, we take security seriously. Passwords are hashed using secure algorithms before being stored in localStorage. We recommend using a unique password for your SmartInvest account and keeping your browser updated.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">8. Changes to This Policy</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">9. Contact Us</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div className="mt-4 space-y-2 text-[var(--text-secondary)]">
              <p><strong className="text-[var(--text-primary)]">Company:</strong> S4AI Limited</p>
              <p><strong className="text-[var(--text-primary)]">Email:</strong> <span className="text-teal-500">shaheershafique567@gmail.com</span></p>
              <p><strong className="text-[var(--text-primary)]">Phone:</strong> +92 312 3456789</p>
              <p><strong className="text-[var(--text-primary)]">Address:</strong> S4AI Limited, Islamabad, Pakistan</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
