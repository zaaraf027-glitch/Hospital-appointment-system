import { useNavigate } from 'react-router-dom';
import { User, Shield, HeartPulse, Phone, MessageSquare } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === 'patient') navigate('/dashboard');
    else navigate('/admin');
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans overflow-hidden">

      {/* ── Background ── */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000")',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/72 backdrop-blur-[3px]" />
      </div>


      {/* ══════════════════════════════
          NAVBAR  (single, clean)
      ══════════════════════════════ */}
      <nav className="relative z-30 w-full px-8 md:px-12 py-4 flex items-center justify-between border-b border-white/[0.07] bg-slate-900/30 backdrop-blur-sm">

        {/* Left – Logo + Brand */}
        <div className="flex items-center gap-3 min-w-[180px]">
          <div className="w-9 h-9 bg-[#2563eb] rounded-full flex items-center justify-center shadow-lg shadow-blue-900/50 flex-shrink-0">
            <HeartPulse className="w-[18px] h-[18px] text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-white font-semibold text-[14px] tracking-wide leading-none">CareWell Hospital</p>
            <p className="text-gray-400 text-[10.5px] mt-[2px]">Management System</p>
          </div>
        </div>

        {/* Center – Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Our Specialists', 'Services', 'Research', 'Facility'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-gray-300 text-[13px] font-medium hover:text-white transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right – Auth Buttons */}
        <div className="flex items-center gap-3 min-w-[180px] justify-end">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-[7px] rounded-lg border border-white/25 text-white text-[13px] font-medium hover:bg-white/10 transition-all duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-[7px] rounded-lg bg-[#2563eb] hover:bg-blue-600 text-white text-[13px] font-semibold shadow-md shadow-blue-900/40 transition-all duration-200"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════
          HERO + CARDS
      ══════════════════════════════ */}
      <main className="relative z-20 flex-grow flex flex-col items-center justify-center px-4 pb-10 pt-6">

        {/* Hero Text */}
        <div className="text-center mb-14">

          {/* Central Logo */}
          <div className="flex justify-center mb-7">
            <div className="w-[88px] h-[88px] rounded-full bg-[#2563eb] flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.45)] ring-4 ring-white/10">
              <HeartPulse className="w-10 h-10 text-white" strokeWidth={1.8} />
            </div>
          </div>

          <h1 className="text-[42px] md:text-[50px] font-bold text-white tracking-tight leading-tight mb-2">
            CareWell Hospital
          </h1>
          <h2 className="text-[20px] text-blue-200/80 font-medium mb-7">
            Your Health, Our Priority
          </h2>
          <div className="w-24 h-[1px] bg-white/20 mx-auto mb-8" />
          <p className="text-gray-300/90 text-[15px] leading-relaxed max-w-md mx-auto">
            Welcome! Please select how you want to continue to
            <br className="hidden md:block" />
            access our digital health ecosystem.
          </p>
        </div>

        {/* ── Role Cards ── */}
        <div className="flex flex-col md:flex-row gap-5 w-full max-w-[720px]">

          {/* Patient Card */}
          <button
            onClick={() => handleRoleSelection('patient')}
            className="group flex-1 relative text-left bg-white/[0.06] backdrop-blur-md border border-white/[0.18] rounded-2xl p-8 transition-all duration-300 ease-out hover:bg-white/[0.11] hover:border-white/40 hover:-translate-y-[5px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          >
            <div className="w-[48px] h-[48px] rounded-full border border-white/25 flex items-center justify-center mb-6 group-hover:border-white/60 group-hover:bg-white/5 transition-all duration-300">
              <User className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-[21px] font-semibold text-white mb-2 tracking-tight">
              Continue as Patient
            </h3>
            <p className="text-gray-400/90 text-[13.5px] leading-relaxed">
              Book appointments and view your medical history
            </p>
          </button>

          {/* Admin Card */}
          <button
            onClick={() => handleRoleSelection('admin')}
            className="group flex-1 relative text-left bg-white/[0.06] backdrop-blur-md border border-white/[0.18] rounded-2xl p-8 transition-all duration-300 ease-out hover:bg-white/[0.11] hover:border-white/40 hover:-translate-y-[5px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          >
            <div className="w-[48px] h-[48px] rounded-full border border-white/25 flex items-center justify-center mb-6 group-hover:border-white/60 group-hover:bg-white/5 transition-all duration-300">
              <Shield className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-[21px] font-semibold text-white mb-2 tracking-tight">
              Continue as Admin
            </h3>
            <p className="text-gray-400/90 text-[13.5px] leading-relaxed">
              Manage doctors, schedules, and hospital records
            </p>
          </button>

        </div>
      </main>

      {/* ══════════════════════════════
          FOOTER
      ══════════════════════════════ */}
      <footer className="relative z-20 w-full bg-[#0e1525]/95 border-t border-white/[0.06] py-5 px-8 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">

          {/* Left – Brand */}
          <div className="text-center md:text-left">
            <p className="text-white font-semibold text-[14px] mb-[3px]">CareWell Hospital</p>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              © 2026 CareWell Hospital, Provided in Case.<br />Excellence In Medicine
            </p>
          </div>

          {/* Center – Helpline */}
          <div className="flex flex-col items-center gap-[5px]">
            <div className="flex items-center gap-2 text-white text-[13.5px] font-medium">
              <Phone className="w-[13px] h-[13px] text-gray-400" />
              Helpline: 1.800.CARE WELL
            </div>
            <div className="flex items-center gap-[6px] text-amber-400 text-[12px] font-medium">
              <span className="w-[6px] h-[6px] rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
              Emergency: 112
            </div>
          </div>

          {/* Right – Live Chat + Links */}
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-2 border border-white/10 rounded-full px-4 py-2 hover:bg-white/5 transition-colors">
              <MessageSquare className="w-[16px] h-[16px] text-gray-400" />
              <div className="text-left leading-tight">
                <p className="text-[12.5px] text-white font-medium">Live Chat</p>
                <p className="text-[10px] text-gray-500">support</p>
              </div>
            </button>
            <div className="flex gap-4 text-gray-500 text-[13px]">
              <a href="#" className="hover:text-gray-200 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-200 transition-colors">Ethics</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Home;
