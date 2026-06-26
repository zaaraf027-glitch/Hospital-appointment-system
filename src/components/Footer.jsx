import { Phone, MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) return null; // We hide global footer on auth pages

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-50 bg-[#1e293b]/80 backdrop-blur-sm border-t border-white/10 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Left Column - Copyright */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-lg mb-1">CareWell Hospital</h3>
            <p className="text-gray-300 text-xs">
              &copy; 2024 CareWell Hospital. Precision in Care,<br className="hidden md:block" /> Excellence in Medicine.
            </p>
          </div>

          {/* Center Column - Helpline */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-1">
              <Phone className="h-4 w-4 text-white" />
              <span className="font-bold text-sm tracking-wide">Helpline: 1-800-CARE-WELL</span>
            </div>
            <div className="flex items-center gap-2 text-orange-400">
              {/* Using an asterisk for emergency icon */}
              <span className="text-xl leading-none">*</span>
              <span className="font-bold text-sm">Emergency: 112</span>
            </div>
          </div>

          {/* Right Column - Live Chat & Links */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-end gap-6">
            <button className="flex items-center gap-2 border border-white/30 hover:bg-white/10 rounded-full px-4 py-2 transition-colors text-teal-300 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              Live Chat<br/>Support
            </button>
            <div className="flex gap-4 text-xs font-medium text-gray-300">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Ethics</a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
