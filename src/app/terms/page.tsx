export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none space-y-6 pb-16">
          <p className="text-sm text-muted-foreground">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Expanda (&quot;the Service&quot;), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              Expanda is a content sharing platform that allows users to create, share, and interact with posts 
              in multiple formats. The Service is provided free of charge and is supported through various means.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p>To use certain features of the Service, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 13 years of age</li>
              <li>Provide accurate and complete information when creating an account</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Post content that is illegal, harmful, threatening, abusive, defamatory, or invasive of privacy</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Upload content containing software viruses or malicious code</li>
              <li>Spam, harass, or harm other users</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Interfere with or disrupt the Service or servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Content Ownership and Rights</h2>
            <p>
              You retain ownership of content you post on Expanda. By posting content, you grant us a 
              non-exclusive, royalty-free, worldwide license to use, display, and distribute your content 
              on the platform. You represent that you have the right to grant this license.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Content Moderation</h2>
            <p>
              We reserve the right to review, moderate, and remove content that violates these terms or 
              is otherwise objectionable. We may suspend or terminate accounts that repeatedly violate our policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our 
              <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>, 
              which explains how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; without any warranties, express or implied. We do not warrant 
              that the Service will be uninterrupted, error-free, or free of harmful components.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Expanda shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Account Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violations of these terms. 
              You may also delete your account at any time. Upon termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of significant 
              changes via the Service or email. Continued use of the Service after changes constitutes acceptance of new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction 
              in which Expanda operates, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> legal@expanda.app<br />
              <strong>Website:</strong> https://expanda.app
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 