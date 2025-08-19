import React from 'react';

const WorkshopCard = ({ workshop }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Workshop Image with 3:4 aspect ratio */}
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={workshop.image}
          alt={workshop.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Workshop Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {workshop.title}
        </h3>
        <p className="text-gray-600 mb-2">
          by {workshop.artist}
        </p>
        <p className="text-gray-700 mb-2 text-sm">
          {workshop.date}
        </p>
        <p className="text-lg font-semibold text-gray-900 mb-4">
          {workshop.cost}
        </p>
        
        {/* Register Button */}
        <a
  href={workshop.razorpay_link}
  target="_blank"
  rel="noopener noreferrer"
  className="block text-center w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
>
  Register
</a>
      </div>
    </div>
  );
};

export default WorkshopCard;