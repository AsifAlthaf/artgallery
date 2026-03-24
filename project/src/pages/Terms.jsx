import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-montserrat">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-orange-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8">Terms & Conditions</h1>
        
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Purpose</h2>
            <p>This is an art exhibition platform, not a complete e-commerce platform. We support artists and their hard work.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Upload Rules</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>No nudity, 18+ content, violence, or sensitive imagery.</li>
              <li>This platform is for peace and appreciating art.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Violations</h2>
            <p>Violation of rules will lead to a permanent ban. Hate speech and offensive usernames are not tolerated.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Community</h2>
            <p>This app is for everyone, from children to parents. Please maintain dignity and keep the platform clean.</p>
          </section>

          <div className="pt-8 border-t border-gray-100 italic text-gray-500 text-center">
            <p>Thank you for using Art Bloom.</p>
            <p className="font-semibold text-gray-700 mt-2">- Rohini Sai, Asif Shaik</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
