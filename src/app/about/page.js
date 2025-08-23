import React from 'react';

export const metadata = {
  title: 'About - Manifest by TMN',
  description: 'Learn about our mission to create an inclusive space for artists and creative enthusiasts.',
};

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        {/* Changed text color to white */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          About Manifest by TMN
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-6">
          {/* Changed text color to a light gray for readability on a dark background */}
          <p className="text-lg text-gray-300 leading-relaxed">
            Manifest by TMN is more than just a creative studio – it's a sanctuary where artistic dreams come to life. Founded with the vision of creating an inclusive space for artists and creative enthusiasts, we believe in the transformative power of art and its ability to connect communities.
          </p>

          <p className="text-lg text-gray-300 leading-relaxed">
            Our state-of-the-art facility provides the perfect environment for artistic exploration, featuring versatile workshop spaces, professional-grade equipment, and an inspiring atmosphere that nurtures creativity. Whether you're a beginner taking your first steps into the world of art or an experienced artist looking to refine your skills, our diverse range of workshops caters to all levels.
          </p>

          <div className="bg-gray-800 p-6 rounded-lg">
            {/* Changed heading color to your specified pink */}
            <h3 className="text-xl font-semibold mb-3" style={{ color: '#E83669' }}>Our Vision</h3>
            <p className="text-gray-300">
              To create a vibrant ecosystem where art becomes accessible to everyone, and where every individual can discover and manifest their unique creative voice.
            </p>
          </div>
        </div>

        {/* Image Gallery - Updated with local paths */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/studio_space_1.JPG" // Replace with your image file name
              alt="Studio space"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
            <img
              src="/images/studio_space_2.JPG" // Replace with your image file name
              alt="Art supplies"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <img
            src="/images/group_image_1.jpg" // Replace with your image file name
            alt="Workshop in progress"
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
          <img
            src="/images/studio_space_3.JPG" // Replace with your image file name
            alt="Creative workspace"
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;