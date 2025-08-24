import React from 'react';

const WorkshopCard = ({ workshop }) => {
  // Find the lowest price to display as "Starting from..."
  const getStartingPrice = (sessions) => {
    if (!sessions || sessions.length === 0) return 'N/A';
    
    let minPrice = Infinity;
    sessions.forEach(session => {
      if (session.use_tiered_pricing && session.pricing_tiers) {
        session.pricing_tiers.forEach(tier => {
          if (Number(tier.price) < minPrice) minPrice = Number(tier.price);
        });
      } else if (session.cost) {
        // Extract number from currency string like "₹1500"
        const costValue = parseInt(session.cost.replace(/[^0-9]/g, ''), 10);
        if (costValue < minPrice) minPrice = costValue;
      }
    });
    return minPrice === Infinity ? 'Pricing Varies' : `Starts from ₹${minPrice}`;
  };

  return (
    // We will change this link to a detailed page in a future step
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="aspect-[3/4] overflow-hidden">
        <img src={workshop.image_url} alt={workshop.title} className="w-full h-full object-cover"/>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{workshop.title}</h3>
        <p className="text-gray-600 mb-4">by {workshop.artist_name}</p>
        
        <div className="space-y-3 mb-4 border-t pt-4">
          {workshop.workshop_sessions && workshop.workshop_sessions.map(session => (
            <div key={session.id} className="text-sm">
              <p className="font-semibold text-gray-800">{session.session_title}</p>
              <p className="text-gray-600">{session.date} at {session.time}</p>
              
              {/* Display tiered pricing info with custom names */}
              {session.use_tiered_pricing && session.pricing_tiers?.map((tier, index) => (
                <div key={index} className="flex justify-between text-xs text-teal-700">
                  <span>{tier.tier_name} (First {tier.up_to_seat} seats)</span>
                  <span className="font-semibold">₹{tier.price}</span>
                </div>
              ))}
              {/* Display flat price if not tiered */}
              {!session.use_tiered_pricing && (
                <div className="flex justify-end text-sm text-gray-800 font-bold">
                  <span>{session.cost}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-auto border-t pt-4">
           <div className="flex justify-between items-center">
             <span className="font-bold text-lg text-gray-800">{getStartingPrice(workshop.workshop_sessions)}</span>
             {/* This button should eventually link to a detailed workshop page */}
             <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg">
               View Details
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;