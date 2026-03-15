export const metadata = {
  title: 'Privacy Policy | ailevelup',
  description: 'Privacy Policy for ailevelup — AI agents for ambitious businesses.',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-6 py-20 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-12">Last updated: March 15, 2026</p>

      <section className="space-y-10 text-gray-300 leading-relaxed">

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">1. Who We Are</h2>
          <p>
            ailevelup is operated by LEVELUP Enterprises Inc., based in Toronto, Canada.
            We build custom AI agents and automation systems for small and medium-sized businesses.
            Questions about this policy can be directed to{' '}
            <a href="mailto:hello@ailevelup.ca" className="text-indigo-400 hover:underline">
              hello@ailevelup.ca
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
          <p className="mb-3">We collect information you provide directly to us:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Name and email address when you contact us or book a consultation</li>
            <li>Business name and details you share during onboarding</li>
            <li>Messages and files you send us during project work</li>
          </ul>
          <p className="mt-3">
            We do not collect payment information directly — payments are handled by third-party processors.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>To deliver our services and communicate with you about your project</li>
            <li>To respond to inquiries and support requests</li>
            <li>To improve our services based on feedback</li>
            <li>To send updates about your project (no marketing without consent)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">4. Data Sharing</h2>
          <p>
            We do not sell, rent, or trade your personal information. We may share data with
            third-party tools we use to deliver services (e.g., cloud infrastructure, AI model
            providers) only to the extent necessary to fulfill your project. All third parties
            are bound by appropriate data protection agreements.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">5. Data Retention</h2>
          <p>
            We retain your information for as long as needed to deliver our services and comply
            with legal obligations. You may request deletion of your data at any time by
            contacting us at{' '}
            <a href="mailto:hello@ailevelup.ca" className="text-indigo-400 hover:underline">
              hello@ailevelup.ca
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">6. Cookies</h2>
          <p>
            Our website uses minimal cookies necessary for the site to function. We do not use
            tracking or advertising cookies. No third-party analytics are currently active on
            this site.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
          <p className="mb-3">Depending on your location, you may have the right to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:hello@ailevelup.ca" className="text-indigo-400 hover:underline">
              hello@ailevelup.ca
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">8. Security</h2>
          <p>
            We take reasonable technical and organizational measures to protect your information.
            No method of transmission over the internet is 100% secure, and we cannot guarantee
            absolute security.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be posted on this page
            with an updated date. Continued use of our services after changes constitutes
            acceptance of the updated policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
          <p>
            LEVELUP Enterprises Inc.<br />
            Toronto, Ontario, Canada<br />
            <a href="mailto:hello@ailevelup.ca" className="text-indigo-400 hover:underline">
              hello@ailevelup.ca
            </a>
          </p>
        </div>

      </section>
    </main>
  )
}
