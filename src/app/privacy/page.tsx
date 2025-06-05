export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-sm text-muted-foreground">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>
            When you use Expanda, we collect the following information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> When you sign in with Google, we collect your name, email address, and profile picture.</li>
            <li><strong>Content:</strong> Posts, comments, and other content you create on our platform.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our service, including pages visited and features used.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and maintain our service</li>
            <li>Create and manage your user account</li>
            <li>Enable you to create and share content</li>
            <li>Communicate with you about our service</li>
            <li>Improve and develop new features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties except:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>When you choose to make your content public on the platform</li>
            <li>When required by law or legal process</li>
            <li>To protect our rights, property, or safety, or that of our users</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Google OAuth Integration</h2>
          <p>
            Our application uses Google OAuth for authentication. When you sign in with Google:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We only request access to your basic profile information (name, email, profile picture)</li>
            <li>We do not access your Google Drive, Gmail, or other Google services</li>
            <li>You can revoke our access at any time through your Google Account settings</li>
            <li>We comply with Google&apos;s API Services User Data Policy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, 
            alteration, disclosure, or destruction. This includes encryption of data in transit and at rest.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed to provide you services. 
            You may delete your account at any time, and we will delete your personal information within a reasonable timeframe.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access, update, or delete your personal information</li>
            <li>Object to processing of your personal information</li>
            <li>Request restriction of processing</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
          <p>
            We use essential cookies to maintain your session and provide basic functionality. 
            We do not use tracking cookies or third-party analytics without your consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
          <p>
            Our service is not intended for children under the age of 13. We do not knowingly collect 
            personal information from children under 13. If you are a parent and believe your child 
            has provided us with personal information, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes 
            by posting the new privacy policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our data practices, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@expanda.app<br />
            <strong>Website:</strong> https://expanda.app
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">12. Google API Services User Data Policy Compliance</h2>
          <p>
            Expanda&apos;s use and transfer to any other app of information received from Google APIs will adhere to 
            <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Google API Services User Data Policy
            </a>, including the Limited Use requirements.
          </p>
        </section>
      </div>
    </div>
  )
} 