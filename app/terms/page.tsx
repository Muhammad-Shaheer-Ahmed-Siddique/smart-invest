import Link from 'next/link';

export const metadata = { title: 'Terms of Service — SmartInvest' };

export default function TermsPage() {
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Terms of Service</h1>
          <p className="text-teal-100 mt-2">Last updated: April 9, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose-style space-y-10">
          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">1. Acceptance of Terms</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              By accessing or using SmartInvest ("the Platform"), operated by S4AI Limited, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform. These terms apply to all users, including visitors, registered users, and administrators.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">2. Description of Service</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              SmartInvest is a stock market simulation platform designed for educational purposes. The Platform allows users to practice stock trading using virtual currency ($100,000 starting balance) with simulated market data. No real money, securities, or financial instruments are involved in any transactions on this Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">3. User Accounts</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
              To access certain features of the Platform, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">4. Simulated Trading Disclaimer</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              All stock prices, market data, portfolio values, and trading results on SmartInvest are entirely simulated and fictional. They do not reflect real market conditions. Performance on this Platform does not guarantee or predict success in real-world trading. S4AI Limited is not a financial advisor, broker, or dealer. Nothing on this Platform constitutes financial advice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">5. Data Storage</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              All user data, including account information, portfolio data, and transaction history, is stored locally in your browser's localStorage. S4AI Limited does not collect, store, or transmit any personal data to external servers. Clearing your browser data will permanently delete all your account information and trading history.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">6. Prohibited Conduct</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>Use the Platform for any illegal or unauthorized purpose</li>
              <li>Attempt to manipulate, hack, or disrupt the Platform</li>
              <li>Impersonate any person or entity</li>
              <li>Use automated scripts or bots to interact with the Platform</li>
              <li>Redistribute or commercially exploit Platform content without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">7. Intellectual Property</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              All content, design, graphics, code, and intellectual property on SmartInvest are owned by S4AI Limited. You may not copy, reproduce, distribute, or create derivative works without prior written consent from S4AI Limited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">8. Limitation of Liability</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              S4AI Limited shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Platform. The Platform is provided "as is" without warranties of any kind, either express or implied.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">9. Changes to Terms</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              S4AI Limited reserves the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the Platform constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">10. Contact Us</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              If you have any questions about these Terms, please contact us at <span className="text-teal-500 font-medium">shaheershafique567@gmail.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
