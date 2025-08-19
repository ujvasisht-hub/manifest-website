'use client' // This is required to make the form interactive

import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, this just logs the data and shows an alert.
    // To make this email you, you would use a service like Formspree.
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We&apos;ll get back to you soon.');
    // Reset form
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Get In Touch
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions about our workshops or want to discuss a custom creative session? 
          We&apos;d love to hear from you!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email ID *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-vertical"
                placeholder="Tell us about your interest in our workshops or any specific questions..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Submit Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-pink-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-pink-800 mb-4">
              Ready to Start Your Creative Journey?
            </h3>
            <p className="text-pink-700 mb-4">
              Whether you're looking to explore a new artistic medium or deepen your existing skills, 
              our team is here to guide you every step of the way.
            </p>
            <ul className="text-pink-700 space-y-2">
              <li>• Professional guidance from experienced artists</li>
              <li>• Small class sizes for personalized attention</li>
              <li>• All materials and equipment provided</li>
              <li>• Flexible scheduling options available</li>
            </ul>
          </div>

          <div className="bg-teal-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-teal-800 mb-4">
              Contact Information
            </h3>
            <div className="space-y-3 text-teal-700">
              <p>
                <span className="font-medium">Phone:</span> +91 98765 43210
              </p>
              <p>
                <span className="font-medium">Email:</span> hello@manifestbytmn.com
              </p>
              <p>
                <span className="font-medium">Address:</span><br />
                123 Creative Street<br />
                Arts District<br />
                Mumbai, Maharashtra 400001
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Studio Hours
            </h3>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Monday - Friday:</span> 10:00 AM - 8:00 PM</p>
              <p><span className="font-medium">Saturday:</span> 9:00 AM - 7:00 PM</p>
              <p><span className="font-medium">Sunday:</span> 11:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;