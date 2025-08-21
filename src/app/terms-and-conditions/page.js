import React from 'react';

export const metadata = {
  title: 'Terms & Conditions - Manifest by TMN',
  description: 'Read the terms and conditions for participating in workshops at Manifest by TMN.',
};

const TermsAndConditionsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose lg:prose-xl">
        <h1>Terms and Conditions</h1>
        <p className="text-sm text-gray-500">Last updated: August 21, 2025</p>
        <p>
          Welcome to Manifest by TMN. By booking a workshop or entering our studio premises, you agree to be bound by the following Terms and Conditions.
        </p>

        <h2>1. Booking and Payment Policy</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>All registrations are final. Once a booking is made, cancellations are not permitted.</li>
          <li>No refunds will be issued for any reason.</li>
          <li>Tickets and registrations are non-transferable and cannot be given to another person.</li>
          <li>In the rare event of a workshop cancellation by an artist or the studio, we will contact each participant individually to offer a full refund or a transfer to another workshop of the same value within the next 30 days. If the new workshop has a different price, the difference must be settled separately.</li>
        </ul>

        <h2>2. Studio Rules and Conduct</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Footwear:</strong> Outside shoes are strictly prohibited on the studio floor. If you need shoes for your workshop, please bring a separate, clean pair to change into upon arrival.</li>
          <li><strong>Food and Beverages:</strong> No food or drinks are allowed inside the main studio area.</li>
          <li><strong>Restricted Areas:</strong> Please do not enter areas marked as "Staff Only."</li>
          <li><strong>Conduct:</strong> We foster a positive and respectful environment. The studio management reserves the right to deny entry or remove any participant for misbehavior, disruptive conduct, or failure to follow studio rules, without notice or a refund. The management's decision is final and irrevocable.</li>
        </ul>

        <h2>3. Health, Safety, and Liability</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Personal Health:</strong> Participants are responsible for their own health and well-being. Please carry any personal medication you may require. Participation is at your own risk.</li>
          <li><strong>Damages:</strong> Any damage to studio property caused by a participant is their financial responsibility. They will be liable for the full cost of repair or replacement.</li>
          <li><strong>Personal Belongings:</strong> The studio is not responsible for any lost, stolen, or damaged personal items. Please keep your belongings secure.</li>
          <li><strong>Inter-Participant Conduct:</strong> Please respect the privacy and personal space of all participants. The studio is not responsible for any misconduct occurring between participants.</li>
        </ul>

        <h2>4. Parking and Punctuality</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Parking is available on a first-come, first-served basis. The studio is not responsible for securing a parking spot.</li>
          <li>No refunds or rescheduling will be offered for delays or missed classes due to parking issues.</li>
        </ul>

        <h2>5. Media Release</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>By entering the studio, you grant Manifest by TMN the right to record, film, and photograph you. The studio may use these videos and images for promotional, social media, and other commercial purposes without compensation.</li>
        </ul>
        
        <h2>6. Code of Conduct</h2>
        <p>All participants are expected to contribute to a positive, inclusive, and fun learning environment for everyone. Be respectful, be kind, and be creative.</p>
        
        <h2 className="mt-8">Contact Us</h2>
        <p>
          If you have any questions about these Terms and Conditions, please contact us at manifestbytmn@gmail.com.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;