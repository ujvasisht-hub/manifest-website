import React from 'react';

export const metadata = {
  title: 'Cancellation & Refunds - Manifest by TMN',
  description: 'Read the cancellation and refund policy for workshops at Manifest by TMN.',
};

const CancellationAndRefundsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose lg:prose-xl">
        <h1>Cancellation and Refunds Policy</h1>
        <p className="text-sm text-gray-500">Last updated: August 22, 2025</p>
        
        <h2>Cancellation by Participant</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>All registrations are final. Once a booking is made, cancellations by the participant are not permitted.</li>
          <li>No refunds will be issued for any reason, including non-attendance.</li>
          <li>Tickets and registrations are non-transferable and cannot be sold or given to another person.</li>
        </ul>

        <h2>Cancellation by Studio or Artist</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>In the rare event that a workshop is cancelled by the artist or the studio, we will reach out to each registered participant individually.</li>
          <li>Participants will be offered a choice between a full refund or a transfer to another workshop of the same price value scheduled within 30 days of the original workshop date.</li>
          <li>If a participant chooses to transfer to a workshop of a different price, the difference in amount will be settled separately.</li>
        </ul>
        
        <h2 className="mt-8">Contact Us</h2>
        <p>
          If you have any questions about our Cancellation and Refunds Policy, please contact us at manifestbytmn@gmail.com.
        </p>
      </div>
    </div>
  );
};

export default CancellationAndRefundsPage;