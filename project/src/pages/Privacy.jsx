import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-montserrat">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-orange-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Data Collection</h2>
            <p>We collect essential information such as your name, email, and configured username to provide you with secure access to ArtBloom. Your data is encrypted and stored safely.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Data</h2>
            <p>Your data is used solely to facilitate the exhibition and transaction of artworks. We do not sell your personal data or artwork metadata to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Third-Party Services</h2>
            <p>We use trusted third-party providers such as Google Firebase for authentication and Cloudinary for secure image storage and optimization. These services adhere to strict global privacy standards.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Security</h2>
            <p>We implement robust security measures to protect your digital assets and personal information from unauthorized access, disclosure, or destruction.</p>
          </section>

          <div className="pt-8 border-t border-gray-100 italic text-gray-500 text-center">
            <p>Thank you for trusting Art Bloom.</p>
            <p className="font-semibold text-gray-700 mt-2">- Rohini Sai, Asif Shaik</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
