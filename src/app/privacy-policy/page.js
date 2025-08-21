import React from 'react';

export const metadata = {
  title: 'Privacy Policy - Manifest by TMN',
  description: 'Learn how Manifest by TMN collects, uses, and protects your personal data.',
};

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose lg:prose-xl">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: August 21, 2025</p>
        <p>
          Manifest by TMN ("us", "we", or "our") operates the manifest.twinmenot.com website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We collect information that you provide directly to us when you register for a workshop or contact us. The types of personal information we may collect include:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Personal Identification Information:</strong> Your full name, email address, and phone number.</li>
          <li><strong>Payment Information:</strong> While we use Razorpay for payment processing, we do not store your credit card or financial details. We may receive transaction confirmation details from our payment processor.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect for various purposes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>To process your workshop bookings and manage your registration.</li>
          <li>To communicate with you about your booking, including confirmations, reminders, and important updates about the workshop.</li>
          <li>To respond to your questions, comments, and inquiries submitted through our contact form or other channels.</li>
          <li>To send you information about future workshops and events.</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>The security of your data is important to us. We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access. However, no electronic transmission or storage is 100% secure, so we cannot guarantee its absolute security.</p>

        <h2>4. Sharing of Information</h2>
        <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website or conducting our business (like Razorpay for payment processing), so long as those parties agree to keep this information confidential.</p>
        
        <h2>5. Your Rights</h2>
        <p>You have the right to access, update, or request deletion of your personal information by contacting us.</p>
        
        <h2 className="mt-8">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at manifestbytmn@gmail.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;