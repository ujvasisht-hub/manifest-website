import React from 'react';

const WorkshopCard = ({ workshop }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {/* Workshop Image */}
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={workshop.image_url}
          alt={workshop.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Workshop Details */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {workshop.title}
        </h3>
        <p className="text-gray-600 mb-4">
          by {workshop.artist_name}
        </p>
        
        {/* New Sessions List Section */}
        <div className="space-y-3 mb-4 border-t pt-4">
          {workshop.workshop_sessions && workshop.workshop_sessions.map(session => (
            <div key={session.id} className="text-sm">
              <p className="font-semibold text-gray-800">{session.session_title}</p>
              <div className="flex justify-between text-gray-600">
                <span>{session.date} at {session.time}</span>
                <span className="font-bold">{session.cost}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Register Button - a wrapper div ensures it stays at the bottom */}
        <div className="mt-auto">
           <a 
            href={workshop.razorpay_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-center w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Register Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;