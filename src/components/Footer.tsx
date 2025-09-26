import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#F8F9FB] py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-12 mb-8">
            <div className="text-[#30345E] font-medium">MoES</div>
            <div className="text-[#30345E] font-medium">CMLRE</div>
            <div className="text-[#30345E] font-medium">AICTE</div>
          </div>
          
          <div className="flex justify-center space-x-8 mb-8">
            <a href="#" className="text-[#30345E] hover:underline text-sm">Privacy Policy</a>
            <a href="#" className="text-[#30345E] hover:underline text-sm">Help</a>
            <a href="#" className="text-[#30345E] hover:underline text-sm">Contact</a>
          </div>
          
          <p className="text-[#30345E] text-sm">
            © 2025 Shark - AI-Driven Marine Insights. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;