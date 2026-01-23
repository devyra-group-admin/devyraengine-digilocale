import React, { useState } from 'react';
import { X, Calendar, Users, Mail, Phone, User, MessageSquare, Check } from 'lucide-react';

const BookingEnquiryModal = ({ isOpen, onClose, accommodationName, checkInDate, checkOutDate, guests }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset after a delay or let user close
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      }, 3000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-slideInFromBottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-teal-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-teal-100 hover:text-white p-1 rounded-full hover:bg-teal-700 transition-colors"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl font-serif font-bold mb-1">Booking Enquiry</h2>
          <p className="text-teal-100 text-sm">Direct request to {accommodationName}</p>
        </div>

        {/* Success State */}
        {isSubmitted ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
              <Check size={32} strokeWidth={3} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Enquiry Sent!</h3>
            <p className="text-gray-600">
              Your message has been sent to {accommodationName}.<br/>
              They will contact you shortly.
            </p>
            <button 
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Booking Summary Card */}
            <div className="bg-teal-50 rounded-lg p-4 border border-teal-100 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-teal-800">
                <Calendar size={16} />
                <span className="font-medium">
                  {checkInDate ? new Date(checkInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD'} 
                  {' - '} 
                  {checkOutDate ? new Date(checkOutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-teal-800">
                <Users size={16} />
                <span className="font-medium">{guests.adults + guests.children} Guests</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    required
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder="John"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Last Name</label>
                <input
                  required
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  placeholder="+27 00 000 0000"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Message</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400" size={16} />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
                  placeholder="I'm interested in booking..."
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-bold text-white shadow-md transform transition-all hover:-translate-y-0.5 ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingEnquiryModal;
