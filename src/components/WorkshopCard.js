import React from 'react';

const WorkshopCard = ({ workshop }) => {
  return (
    // The link now points to the main event's Razorpay page
    <a 
      href={workshop.razorpay_link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 block"
    >
      {/* Workshop Image */}
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={workshop.image_url} // This is the corrected line
          alt={workshop.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Workshop Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {workshop.title}
        </h3>
        <p className="text-gray-600">
          by {workshop.artist_name}
        </p>
        {/* We will add session details here in a future step */}
      </div>
    </a>
  );
};

export default WorkshopCard;