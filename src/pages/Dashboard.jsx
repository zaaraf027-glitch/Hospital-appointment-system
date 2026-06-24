import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  User, 
  Settings, 
  HeartPulse, 
  Bell, 
  ChevronDown, 
  CheckCircle, 
  Clock, 
  XCircle, 
  HelpCircle, 
  Search, 
  Filter, 
  ArrowRight, 
  GraduationCap, 
  Award, 
  MapPin, 
  Star, 
  BadgeCheck, 
  ShieldCheck, 
  Check, 
  CalendarDays,
  Menu,
  X,
  LogOut,
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { doctors } from '../data/doctors';
import { appointments as initialAppointments } from '../data/appointments';

/* ------------------------------------------------------------------ */
/*  Reusable avatar: shows the image; falls back to initial letter     */
/* ------------------------------------------------------------------ */
const AVATAR_COLORS = [
  'bg-secondary text-on-secondary text-white',
  'bg-teal-600 text-white',
  'bg-purple-600 text-white',
  'bg-rose-600 text-white',
  'bg-amber-500 text-white',
  'bg-green-600 text-white',
];

const DoctorAvatar = ({ src, name, className = '' }) => {
  const [imgError, setImgError] = useState(false);

  // Pick a stable colour based on the first character's char-code
  const colorClass = AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
  const initial    = name?.trim()[0]?.toUpperCase() ?? '?';

  if (imgError || !src) {
    return (
      <div
        className={`flex items-center justify-center font-bold select-none ${colorClass} ${className}`}
        aria-label={name}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={className}
      onError={() => setImgError(true)}
    />
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State variables
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'doctors', 'appointments', 'profile', 'settings', 'doctor-detail'
  const [appointmentsList, setAppointmentsList] = useState(initialAppointments);
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  
  // Patient details state
  const [patientInfo, setPatientInfo] = useState({
    name: 'Student',
    email: 'student@carewell.com',
    phone: '+91 98765 43210',
    bloodGroup: 'O+',
    gender: 'Male',
    age: '21',
    address: 'Varanasi, Uttar Pradesh, India'
  });
  
  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Profile dropdown toggle
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // Notification dropdown toggle
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  
  // Notification items state
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Appointment booked with Dr. Ananya Sharma', read: false, time: '2 mins ago' },
    { id: 2, text: 'Your medical report is now available', read: false, time: '1 hour ago' },
    { id: 3, text: 'Welcome to CareWell Management System!', read: true, time: '1 day ago' }
  ]);
  
  // Doctor filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  
  // Booking Form State
  const [bookingDate, setBookingDate] = useState('2026-06-25');
  const [bookingTime, setBookingTime] = useState('03:00 PM');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [latestBookedAppt, setLatestBookedAppt] = useState(null);
  
  // Tabs within doctor detail view
  const [doctorDetailTab, setDoctorDetailTab] = useState('about'); // 'about', 'experience', 'education', 'reviews'
  
  // Contact support state
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  
  // Auto-scroll to top when active tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setSidebarOpen(false);
  }, [activeTab]);

  // Extract unique specialties
  const specialties = ['All', ...new Set(doctors.map(doc => doc.specialization))];

  // Filter doctors
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Calculations for metric statistics
  const totalAppointmentsCount = appointmentsList.length;
  const upcomingAppointmentsCount = appointmentsList.filter(appt => appt.status === 'Confirmed' || appt.status === 'Pending').length;
  const completedAppointmentsCount = appointmentsList.filter(appt => appt.status === 'Completed').length;

  const handleOpenDoctorDetail = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingDate('2026-06-25');
    setBookingTime('03:00 PM');
    setDoctorDetailTab('about');
    setActiveTab('doctor-detail');
  };

  const handleConfirmAppointment = () => {
    if (!bookingDate || !bookingTime) {
      alert('Please select both a date and a time slot.');
      return;
    }

    const newAppointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorName: selectedDoctor.name,
      specialization: selectedDoctor.specialization,
      date: bookingDate,
      time: bookingTime,
      status: 'Confirmed',
      hospital: selectedDoctor.hospital,
      fee: selectedDoctor.fee
    };

    setAppointmentsList([newAppointment, ...appointmentsList]);
    setLatestBookedAppt(newAppointment);
    
    // Add new notification
    const newNotif = {
      id: Date.now(),
      text: `Appointment confirmed with ${selectedDoctor.name} on ${bookingDate} at ${bookingTime}`,
      read: false,
      time: 'Just now'
    };
    setNotifications([newNotif, ...notifications]);

    setBookingSuccess(true);
  };

  const handleCancelAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointmentsList(appointmentsList.map(appt => 
        appt.id === id ? { ...appt, status: 'Cancelled' } : appt
      ));
      
      const cancelledAppt = appointmentsList.find(a => a.id === id);
      const newNotif = {
        id: Date.now(),
        text: `Cancelled appointment with ${cancelledAppt.doctorName}`,
        read: false,
        time: 'Just now'
      };
      setNotifications([newNotif, ...notifications]);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSubmitted(true);
    setTimeout(() => {
      setSupportSubmitted(false);
      setShowSupportModal(false);
      setSupportMessage('');
      alert('Your query has been sent to our support team. We will get back to you shortly.');
    }, 1500);
  };

  const handleMarkNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex text-blue-950 font-sans">
      
      {/* ----------------- SIDEBAR COMPONENT ----------------- */}
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-68 bg-surface-container-lowest border-r border-[#E2E8F0] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Area */}
        <div>
          <div className="h-20 flex items-center px-6 border-b border-gray-50 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0">
                <HeartPulse className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-on-surface tracking-tight leading-none">
                  CareWell Hospital
                </span>
                <span className="text-base font-bold uppercase tracking-wider text-outline mt-1.5 leading-none">
                  Management System
                </span>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button className="md:hidden text-outline hover:text-gray-600" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-8 px-4 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-base font-bold tracking-tight transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-secondary text-on-secondary text-white shadow-level-1 shadow-blue-500/20'
                  : 'text-outline hover:bg-blue-50 hover:text-secondary'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-white' : 'text-outline'}`} />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('doctors')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-base font-bold tracking-tight transition-all ${
                activeTab === 'doctors' || activeTab === 'doctor-detail'
                  ? 'bg-secondary text-on-secondary text-white shadow-level-1 shadow-blue-500/20'
                  : 'text-outline hover:bg-blue-50 hover:text-secondary'
              }`}
            >
              <Users className={`w-5 h-5 ${activeTab === 'doctors' || activeTab === 'doctor-detail' ? 'text-white' : 'text-outline'}`} />
              Browse Doctors
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-base font-bold tracking-tight transition-all ${
                activeTab === 'appointments'
                  ? 'bg-secondary text-on-secondary text-white shadow-level-1 shadow-blue-500/20'
                  : 'text-outline hover:bg-blue-50 hover:text-secondary'
              }`}
            >
              <Calendar className={`w-5 h-5 ${activeTab === 'appointments' ? 'text-white' : 'text-outline'}`} />
              My Appointments
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-base font-bold tracking-tight transition-all ${
                activeTab === 'profile'
                  ? 'bg-secondary text-on-secondary text-white shadow-level-1 shadow-blue-500/20'
                  : 'text-outline hover:bg-blue-50 hover:text-secondary'
              }`}
            >
              <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-white' : 'text-outline'}`} />
              My Profile
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-base font-bold tracking-tight transition-all ${
                activeTab === 'settings'
                  ? 'bg-secondary text-on-secondary text-white shadow-level-1 shadow-blue-500/20'
                  : 'text-outline hover:bg-blue-50 hover:text-secondary'
              }`}
            >
              <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-white' : 'text-outline'}`} />
              Settings
            </button>
          </nav>
        </div>

        {/* Bottom Section Help Card */}
        <div className="p-4 mb-4">
          <div className="bg-blue-50/60 rounded-lg p-5 border border-blue-100/30 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-secondary flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold tracking-tight text-on-surface mb-1">Need Help?</h4>
            <p className="text-base font-semibold text-outline leading-relaxed mb-3">
              Contact our support team for assistance.
            </p>
            <button 
              onClick={() => setShowSupportModal(true)}
              className="w-full bg-secondary text-on-secondary hover:bg-secondary text-on-secondary text-white text-base font-bold py-2.5 rounded-lg tracking-wide shadow-level-1 shadow-blue-500/10 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </aside>

      {/* ----------------- MAIN WRAPPER PANEL ----------------- */}
      <div className="flex-1 md:pl-68 flex flex-col min-h-screen">
        
        {/* ----------------- TOP HEADER COMPONENT ----------------- */}
        <header className="h-20 bg-surface-container-lowest border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          
          {/* Header Left (Mobile menu + Dynamic Greeting) */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-blue-50 hover:text-secondary rounded-lg text-outline"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden sm:block">
              <h2 className="text-5xl font-black tracking-tight text-on-surface leading-tight">
                {activeTab === 'dashboard' ? `Welcome back, ${patientInfo.name}! 👋` : 
                 activeTab === 'doctors' ? 'Browse Specialists' :
                 activeTab === 'doctor-detail' ? 'Doctor Profile' :
                 activeTab === 'appointments' ? 'Your Scheduled Appointments' :
                 activeTab === 'profile' ? 'Manage Your Profile' : 'Account Settings'}
              </h2>
              <p className="text-base font-semibold text-outline mt-1.5">
                {activeTab === 'dashboard' && 'Book appointments, view doctors and manage your health easily.'}
                {activeTab === 'doctors' && 'Find the perfect healthcare specialist and book a consultation slot.'}
                {activeTab === 'doctor-detail' && `View qualification highlights, review feedback, and schedule slots.`}
                {activeTab === 'appointments' && 'Track ongoing, finished, or pending doctor appointments.'}
                {activeTab === 'profile' && 'Keep your contact details and basic medical statistics updated.'}
                {activeTab === 'settings' && 'Personalize security, alerts, and system preferences.'}
              </p>
            </div>
          </div>

          {/* Header Right Action Area */}
          <div className="flex items-center gap-4">
            
            {/* Notification Bell Badge */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationDropdownOpen(!notificationDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="p-2.5 bg-surface-container-low hover:bg-blue-50 hover:text-secondary text-gray-600 rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-base font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-xl py-3 z-50">
                  <div className="px-4 pb-2 border-b border-gray-50 flex justify-between items-center">
                    <span className="text-base font-black uppercase tracking-wider text-outline">Notifications</span>
                    <button 
                      onClick={handleMarkNotificationsAsRead}
                      className="text-base font-bold text-secondary hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 mt-1">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 flex flex-col gap-0.5 hover:bg-blue-50 hover:text-secondary transition-colors ${!n.read ? 'bg-blue-50/20' : ''}`}>
                          <p className="text-base font-semibold text-slate-700 leading-normal">{n.text}</p>
                          <span className="text-base font-bold text-outline mt-1">{n.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-base text-outline">
                        No notifications.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Element Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationDropdownOpen(false);
                }}
                className="flex items-center gap-3 p-1.5 pr-3 hover:bg-blue-50 hover:text-secondary rounded-full transition-colors text-left"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                  alt="Student Avatar" 
                  className="w-8.5 h-8.5 rounded-full object-cover border border-[#E2E8F0]"
                />
                <div className="hidden sm:flex flex-col">
                  <span className="text-base font-extrabold text-on-surface leading-none">{patientInfo.name}</span>
                  <span className="text-base font-bold uppercase tracking-wider text-outline mt-0.5">Patient / Student</span>
                </div>
                <ChevronDown className="w-4 h-4 text-outline shrink-0" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-xl py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-50 flex flex-col">
                    <span className="text-base font-extrabold text-on-surface">{patientInfo.name}</span>
                    <span className="text-base font-semibold text-outline">{patientInfo.email}</span>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('profile'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-base text-gray-700 hover:bg-blue-50 hover:text-secondary flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-outline" />
                    My Profile
                  </button>
                  <button 
                    onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-base text-gray-700 hover:bg-blue-50 hover:text-secondary flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-outline" />
                    Settings
                  </button>
                  <div className="border-t border-gray-50 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-base text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ----------------- MAIN WORKSPACE PANEL CONTENT ----------------- */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">

          {/* 1. VIEW: DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Responsive Metric Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Appointments */}
                <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6 flex flex-col justify-between min-h-36 relative overflow-hidden group hover:shadow-level-1 transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-base font-bold text-outline uppercase tracking-wider">Total Appointments</span>
                      <h3 className="text-5xl font-black text-on-surface mt-2.5 tracking-tight tabular-nums">{totalAppointmentsCount}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-secondary rounded-lg">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="text-base font-extrabold text-secondary hover:text-blue-700 inline-flex items-center gap-1.5 self-start mt-4 tracking-tight"
                  >
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-0 right-0 w-24 h-1 bg-secondary text-on-secondary/60 rounded-tl-full"></div>
                </div>

                {/* Upcoming */}
                <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6 flex flex-col justify-between min-h-36 relative overflow-hidden group hover:shadow-level-1 transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-base font-bold text-outline uppercase tracking-wider">Upcoming Slots</span>
                      <h3 className="text-5xl font-black text-on-surface mt-2.5 tracking-tight tabular-nums">{upcomingAppointmentsCount}</h3>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="text-base font-extrabold text-green-600 hover:text-green-700 inline-flex items-center gap-1.5 self-start mt-4 tracking-tight"
                  >
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-0 right-0 w-24 h-1 bg-green-500/60 rounded-tl-full"></div>
                </div>

                {/* Completed */}
                <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6 flex flex-col justify-between min-h-36 relative overflow-hidden group hover:shadow-level-1 transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-base font-bold text-outline uppercase tracking-wider">Completed</span>
                      <h3 className="text-5xl font-black text-on-surface mt-2.5 tracking-tight tabular-nums">{completedAppointmentsCount}</h3>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="text-base font-extrabold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1.5 self-start mt-4 tracking-tight"
                  >
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-0 right-0 w-24 h-1 bg-purple-500/60 rounded-tl-full"></div>
                </div>
              </div>

              {/* Available Doctors Grid Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-5xl font-black tracking-tight text-on-surface">Available Doctors</h3>
                  <button 
                    onClick={() => setActiveTab('doctors')}
                    className="text-base font-bold text-secondary hover:text-blue-700 flex items-center gap-1"
                  >
                    View All Doctors <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Doctor Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.slice(0, 3).map((doctor) => (
                    <div 
                      key={doctor.id} 
                      className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-5 flex flex-col relative overflow-hidden hover:shadow-level-1 transition-all duration-200"
                    >
                      {/* Top Experience Badge */}
                      <span className="absolute top-4 right-4 bg-surface-container-low border border-[#E2E8F0] text-outline text-base font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {doctor.experience} Yrs
                      </span>

                      {/* Doctor Profile Info */}
                      <div className="flex gap-4 items-start mb-4">
                        <DoctorAvatar
                          src={doctor.image}
                          name={doctor.name}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-50 text-5xl"
                        />
                        <div className="flex-1 mt-1 pr-14">
                          <h4 className="font-extrabold text-on-surface text-base leading-snug flex items-center gap-1">
                            {doctor.name}
                          </h4>
                          <span className="text-base font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-md mt-1.5 inline-block">
                            {doctor.specialization}
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-base text-slate-600 font-semibold leading-relaxed mb-5 line-clamp-3">
                        {doctor.about || 'Specialized and highly trained medical consultant committed to professional wellness.'}
                      </p>

                      {/* Experience Info */}
                      <div className="flex justify-between items-center text-base text-outline bg-slate-50 p-2.5 rounded-lg border border-[#E2E8F0] mb-5 font-bold">
                        <span className="font-bold text-slate-550">Fee: <strong className="text-on-surface font-black">{doctor.fee}</strong></span>
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <strong className="text-on-surface font-black">{doctor.rating}</strong> Rating
                        </span>
                      </div>

                      {/* Card Actions */}
                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button 
                          onClick={() => handleOpenDoctorDetail(doctor)}
                          className="border border-[#E2E8F0] hover:border-gray-300 hover:bg-blue-50 hover:text-secondary text-gray-600 font-extrabold py-2.5 rounded-lg text-base tracking-wide transition-colors"
                        >
                          View Profile
                        </button>
                        <button 
                          onClick={() => handleOpenDoctorDetail(doctor)}
                          className="bg-secondary text-on-secondary hover:bg-secondary text-on-secondary text-white font-extrabold py-2.5 rounded-lg text-base tracking-wide shadow-level-1 shadow-blue-500/10 transition-colors"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Booking Banner */}
              <div className="bg-gradient-to-r from-blue-50/80 to-[#0066FF]/5 rounded-lg border border-blue-100/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100/60 text-secondary flex items-center justify-center shrink-0">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base text-on-surface">Book appointments easily</h4>
                    <p className="text-base text-slate-505 font-semibold leading-relaxed max-w-xl">
                      Select your preferred doctor, date and time slot and we'll take care of the rest.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('doctors')}
                  className="bg-secondary text-on-secondary hover:bg-secondary text-on-secondary text-white font-extrabold text-base py-3 px-6 rounded-lg tracking-tight shadow-level-1 shadow-blue-500/15 shrink-0 transition-colors"
                >
                  Book Now
                </button>
              </div>

            </div>
          )}

          {/* 2. VIEW: BROWSE DOCTORS TAB */}
          {activeTab === 'doctors' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Search & Filter Section */}
              <div className="bg-surface-container-lowest p-5 rounded-lg shadow-level-1 border border-[#E2E8F0] flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-outline" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search doctors, specialities, or hospitals..."
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-[#E2E8F0] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                
                <div className="md:w-60 relative">
                  <Filter className="absolute left-4 top-3.5 w-5 h-5 text-outline" />
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-[#E2E8F0] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all appearance-none"
                  >
                    {specialties.map(spec => (
                      <option key={spec} value={spec}>{spec === 'All' ? 'All Specialities' : spec}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid Section */}
              <div className="space-y-4">
                <p className="text-base text-outline font-bold uppercase tracking-wider">
                  Showing {filteredDoctors.length} doctors found
                </p>

                {filteredDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor) => (
                      <div 
                        key={doctor.id} 
                        className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-5 flex flex-col relative overflow-hidden hover:shadow-level-1 transition-all duration-200"
                      >
                        {/* Top Experience Badge */}
                        <span className="absolute top-4 right-4 bg-surface-container-low border border-[#E2E8F0] text-outline text-base font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                          {doctor.experience} Yrs
                        </span>

                        {/* Doctor Profile Info */}
                        <div className="flex gap-4 items-start mb-4">
                          <DoctorAvatar
                            src={doctor.image}
                            name={doctor.name}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-50 text-5xl"
                          />
                          <div className="flex-1 mt-1 pr-14">
                            <h4 className="font-extrabold text-on-surface text-base leading-snug">
                              {doctor.name}
                            </h4>
                            <span className="text-base font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md mt-1 inline-block">
                              {doctor.specialization}
                            </span>
                          </div>
                        </div>

                        {/* Bio */}
                        <p className="text-base text-outline font-semibold leading-relaxed mb-5 line-clamp-3">
                          {doctor.about || 'Dedicated specialist offering full consultations, physical assessment, and complete patient-centered care.'}
                        </p>

                        {/* Details */}
                        <div className="space-y-2 mb-5">
                          <div className="flex justify-between items-center text-base text-outline bg-slate-50 p-2.5 rounded-lg border border-[#E2E8F0] font-semibold">
                            <span className="font-semibold text-slate-550">Fee: <strong className="text-on-surface font-black">{doctor.fee}</strong></span>
                            <span className="flex items-center gap-0.5">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <strong className="text-on-surface font-black">{doctor.rating}</strong> Rating
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-base font-semibold text-outline px-1">
                            <MapPin className="w-3.5 h-3.5 text-secondary" />
                            <span className="truncate">{doctor.hospital}</span>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                          <button 
                            onClick={() => handleOpenDoctorDetail(doctor)}
                            className="border border-[#E2E8F0] hover:border-gray-300 hover:bg-blue-50 hover:text-secondary text-gray-600 font-bold py-2 rounded-lg text-base tracking-tight transition-colors"
                          >
                            View Profile
                          </button>
                          <button 
                            onClick={() => handleOpenDoctorDetail(doctor)}
                            className="bg-secondary text-on-secondary hover:bg-secondary text-on-secondary text-white font-bold py-2 rounded-lg text-base tracking-tight shadow-level-1 shadow-blue-500/10 transition-colors"
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] p-12 text-center max-w-md mx-auto">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-base font-extrabold tracking-tight text-on-surface mb-1">No doctors found</h4>
                    <p className="text-base font-semibold text-outline leading-relaxed mb-6">
                      Try adjusting your keywords or clearing the category filter to explore other options.
                    </p>
                    <button 
                      onClick={() => { setSearchTerm(''); setSelectedSpecialty('All'); }}
                      className="bg-blue-50 hover:bg-blue-100 text-secondary text-base font-bold py-2.5 px-6 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 3. VIEW: DOCTOR DETAIL & BOOKING VIEW (WhatsApp Image layout) */}
          {activeTab === 'doctor-detail' && selectedDoctor && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Breadcrumbs */}
              <div className="flex items-center gap-1.5 text-base font-bold uppercase tracking-wider text-outline">
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-secondary">Home</button>
                <span>&gt;</span>
                <button onClick={() => setActiveTab('doctors')} className="hover:text-secondary">Doctors</button>
                <span>&gt;</span>
                <span className="text-slate-650 font-black">{selectedDoctor.name}</span>
              </div>

              {/* Two Column Layout (Dr Profile Details + Booking Panel) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Left Column (Wide) - Info */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Profile Header Details Card */}
                  <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6 relative">
                    
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      <DoctorAvatar
                        src={selectedDoctor.image}
                        name={selectedDoctor.name}
                        className="w-32 h-32 rounded-lg object-cover border border-[#E2E8F0] self-center sm:self-auto shrink-0 text-5xl"
                      />
                      
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-5xl font-black tracking-tight text-on-surface flex items-center gap-1.5 leading-none">
                            {selectedDoctor.name}
                          </h3>
                          <BadgeCheck className="w-5 h-5 text-secondary" />
                        </div>
                        
                        <p className="text-base font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-md inline-block leading-none">
                          {selectedDoctor.specialization}
                        </p>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-base text-outline font-semibold">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <strong>{selectedDoctor.rating}</strong> (120+ Reviews)
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-blue-500" />
                            {selectedDoctor.experience} Experience
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-base font-semibold text-outline">
                          <MapPin className="w-4 h-4 text-secondary" />
                          <span>{selectedDoctor.hospital}, {selectedDoctor.location || 'New Delhi'}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-base text-slate-505 font-semibold leading-relaxed mt-6 pt-6 border-t border-gray-50">
                      {selectedDoctor.about || `${selectedDoctor.name} is a highly experienced ${selectedDoctor.specialization} specializing in diagnosis and medical treatment. Devoted to patient-first service and comprehensive care.`}
                    </p>

                    {/* Highlight Info Badges Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                      <div className="bg-surface-container-low border border-[#E2E8F0]/50 rounded-lg p-4 flex flex-col items-center text-center">
                        <GraduationCap className="w-6 h-6 text-secondary mb-2" />
                        <span className="text-base font-bold uppercase tracking-wider text-outline">Degree</span>
                        <h5 className="text-base font-extrabold text-on-surface mt-1">{selectedDoctor.qualifications || 'MBBS, MD'}</h5>
                      </div>

                      <div className="bg-surface-container-low border border-[#E2E8F0]/50 rounded-lg p-4 flex flex-col items-center text-center">
                        <Award className="w-6 h-6 text-secondary mb-2" />
                        <span className="text-base font-bold uppercase tracking-wider text-outline">Experience</span>
                        <h5 className="text-base font-extrabold text-on-surface mt-1">{selectedDoctor.experience}</h5>
                      </div>

                      <div className="bg-surface-container-low border border-[#E2E8F0]/50 rounded-lg p-4 flex flex-col items-center text-center">
                        <Users className="w-6 h-6 text-secondary mb-2" />
                        <span className="text-base font-bold uppercase tracking-wider text-outline">Patients Treated</span>
                        <h5 className="text-base font-extrabold text-on-surface mt-1">5000+</h5>
                      </div>

                      <div className="bg-surface-container-low border border-[#E2E8F0]/50 rounded-lg p-4 flex flex-col items-center text-center">
                        <Stethoscope className="w-6 h-6 text-secondary mb-2" />
                        <span className="text-base font-bold uppercase tracking-wider text-outline">Affiliation</span>
                        <h5 className="text-base font-extrabold text-on-surface mt-1 line-clamp-2 leading-snug">Cardiology Society Member</h5>
                      </div>
                    </div>

                  </div>

                  {/* Doctor Information Tab Panel */}
                  <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 overflow-hidden">
                    <div className="flex border-b border-[#E2E8F0] overflow-x-auto bg-surface-container-low/50">
                      {['about', 'experience', 'education', 'reviews'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setDoctorDetailTab(tab)}
                          className={`px-6 py-4 text-base font-bold uppercase tracking-wider border-b-2 shrink-0 transition-all ${
                            doctorDetailTab === tab
                              ? 'border-[#0066FF] text-secondary bg-surface-container-lowest'
                              : 'border-transparent text-outline hover:text-gray-700'
                          }`}
                        >
                          {tab} {tab === 'reviews' ? '(120)' : ''}
                        </button>
                      ))}
                    </div>

                    <div className="p-6">
                      {/* Sub-Tab 1: About */}
                      {doctorDetailTab === 'about' && (
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-bold text-base text-blue-950 mb-2">About Doctor</h4>
                            <p className="text-base text-outline leading-relaxed">
                              {selectedDoctor.about || `${selectedDoctor.name} has practiced medicine for over a decade. Focuses on preventative health measures, clinical evaluation, and customized treatment plans for all patients.`}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-bold text-base text-blue-950 mb-2.5">Specializations</h4>
                            <div className="flex flex-wrap gap-2">
                              {['Clinical Consultation', 'Emergency Care', 'Inpatient Evaluation', 'Diagnostics', 'Preventive Counseling', selectedDoctor.specialization].map(spec => (
                                <span key={spec} className="bg-blue-50/60 text-secondary border border-blue-100/30 text-base font-semibold px-3 py-1.5 rounded-full">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-base text-blue-950 mb-2">Languages Spoken</h4>
                            <p className="text-base text-outline font-semibold">
                              {selectedDoctor.languages || 'English, Hindi'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Sub-Tab 2: Experience */}
                      {doctorDetailTab === 'experience' && (
                        <div className="space-y-4">
                          <div className="relative border-l-2 border-blue-100 pl-6 pb-4 space-y-1">
                            <div className="absolute -left-1.5 top-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white"></div>
                            <span className="text-base font-bold text-secondary">2018 - Present</span>
                            <h5 className="font-bold text-base text-blue-950">Senior Consultant &amp; Head of Department</h5>
                            <p className="text-base text-outline">{selectedDoctor.hospital}</p>
                          </div>
                          
                          <div className="relative border-l-2 border-blue-100 pl-6 pb-4 space-y-1">
                            <div className="absolute -left-1.5 top-0.5 w-3.5 h-3.5 bg-gray-300 rounded-full border-2 border-white"></div>
                            <span className="text-base font-bold text-outline">2014 - 2018</span>
                            <h5 className="font-bold text-base text-blue-950">Associate Specialist</h5>
                            <p className="text-base text-outline">Metro Healthcare Hospital</p>
                          </div>
                        </div>
                      )}

                      {/* Sub-Tab 3: Education */}
                      {doctorDetailTab === 'education' && (
                        <div className="space-y-4">
                          <div className="relative border-l-2 border-blue-100 pl-6 pb-4 space-y-1">
                            <div className="absolute -left-1.5 top-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white"></div>
                            <span className="text-base font-bold text-secondary">Graduated 2012</span>
                            <h5 className="font-bold text-base text-blue-950">{selectedDoctor.qualifications || 'MD / MBBS'}</h5>
                            <p className="text-base text-outline">All India Institute of Medical Sciences, New Delhi</p>
                          </div>
                        </div>
                      )}

                      {/* Sub-Tab 4: Reviews */}
                      {doctorDetailTab === 'reviews' && (
                        <div className="space-y-5">
                          <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                            <h4 className="font-bold text-base text-blue-950">Patient Reviews</h4>
                            <span className="text-base text-secondary font-semibold">View All Reviews</span>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-surface-container-low/50 border border-[#E2E8F0] p-4 rounded-lg space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 text-secondary font-bold text-base flex items-center justify-center">
                                    AK
                                  </div>
                                  <div>
                                    <h5 className="text-base font-bold text-blue-950">Amit Kumar</h5>
                                    <span className="text-base text-outline">2 weeks ago</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-base text-outline leading-normal">
                                Very good experience with the doctor. He explains everything in detail and listens to the patient carefully.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Column - Booking Form Panel */}
                <div className="space-y-6">
                  
                  {/* Book An Appointment Card */}
                  <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6 space-y-6">
                    
                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold tracking-tight text-on-surface">Book an Appointment</h4>
                      <p className="text-base text-outline font-semibold">Select a date and time to book your slot</p>
                    </div>
                    
                    {/* Date Selector */}
                    <div className="space-y-2">
                      <label className="block text-base font-black text-outline uppercase tracking-wider">Select Date</label>
                      <input 
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-surface-container-low border border-gray-150 rounded-lg px-4 py-3 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all font-bold"
                      />
                    </div>

                    {/* Slots Grid */}
                    <div className="space-y-2">
                      <label className="block text-base font-black text-outline uppercase tracking-wider">Select Time Slot</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingTime(slot)}
                            className={`py-3.5 px-2.5 rounded-lg text-base font-black text-center border tracking-tight transition-all ${
                              bookingTime === slot
                                ? 'bg-secondary text-on-secondary border-[#0066FF] text-white shadow-level-1 shadow-blue-500/10'
                                : 'bg-surface-container-lowest border-gray-150 text-gray-600 hover:bg-blue-50 hover:text-secondary'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fee Details */}
                    <div className="bg-blue-50/40 border border-blue-100/30 p-4 rounded-lg flex justify-between items-center">
                      <span className="text-base font-black text-secondary uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4" /> Consultation Fee
                      </span>
                      <span className="text-base font-black text-on-surface">{selectedDoctor.fee}</span>
                    </div>

                    {/* Confirm Booking CTA */}
                    <button
                      type="button"
                      onClick={handleConfirmAppointment}
                      className="w-full bg-secondary text-on-secondary hover:bg-secondary text-on-secondary text-white font-extrabold tracking-tight text-base py-4 rounded-lg shadow-lg shadow-blue-500/15 transition-all text-center"
                    >
                      Confirm Appointment
                    </button>

                  </div>

                  {/* Secure Booking Info */}
                  <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-secondary">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="text-base font-extrabold text-on-surface">Secure Booking</h5>
                      <p className="text-base font-semibold text-outline leading-normal mt-0.5">
                        Your appointment details are secure with us.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* 4. VIEW: APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-5xl font-black tracking-tight text-on-surface">My Appointments</h3>
                <button 
                  onClick={() => setActiveTab('doctors')}
                  className="bg-secondary text-on-secondary hover:bg-on-secondary-container text-white text-base font-bold py-2.5 px-5 rounded-lg shadow-level-1 transition-colors"
                >
                  Book New Slot
                </button>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex gap-6 border-b border-[#E2E8F0]">
                <button className="flex items-center gap-2 pb-3 border-b-2 border-[#0066FF] text-secondary text-base font-extrabold transition-colors">
                  <CalendarDays className="w-4 h-4" /> Upcoming Appointments
                  <span className="bg-blue-100 text-secondary px-2 py-0.5 rounded-full text-base ml-1">{upcomingAppointmentsCount}</span>
                </button>
                <button className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-outline hover:text-on-surface text-base font-bold transition-colors">
                  <CheckCircle className="w-4 h-4" /> Completed
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-base ml-1">{completedAppointmentsCount}</span>
                </button>
                <button className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-outline hover:text-on-surface text-base font-bold transition-colors">
                  <XCircle className="w-4 h-4" /> Cancelled
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-base ml-1">{appointmentsList.filter(a => a.status === 'Cancelled').length}</span>
                </button>
              </div>

              {appointmentsList.length > 0 ? (
                <div className="space-y-4">
                  {appointmentsList.map((appt) => (
                    <div key={appt.id} className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-blue-100 transition-all">
                      
                      <div className="flex items-start gap-4 w-full sm:w-auto">
                        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-[#E2E8F0] overflow-hidden text-5xl font-bold text-secondary">
                          {appt.doctorName.charAt(4)}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-on-surface text-base">{appt.doctorName}</h4>
                          <div className="text-base font-bold text-outline tracking-wider">MBBS, MD - {appt.specialization}</div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-blue-50 text-secondary border border-blue-100 flex items-center gap-1 text-base font-bold px-2 py-1 rounded-md">
                              <HeartPulse className="w-3 h-3" /> {appt.specialization}
                            </span>
                            <span className={`text-base font-extrabold uppercase tracking-wider px-2 py-1 rounded-md border ${
                              appt.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                              appt.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              appt.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {appt.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full sm:w-auto mt-4 sm:mt-0">
                        <div className="flex items-center gap-2 text-base font-semibold text-slate-700">
                          <div className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center text-outline">
                            <CalendarDays className="w-3.5 h-3.5" />
                          </div>
                          {appt.date}
                        </div>
                        <div className="flex items-center gap-2 text-base font-semibold text-slate-700">
                          <div className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center text-outline">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          {appt.time}
                        </div>
                        <div className="flex items-center gap-2 text-base font-semibold text-slate-700 col-span-2">
                          <div className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          {appt.hospital}, Room 203, Block A
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-0 pt-4 sm:pt-0 gap-3">
                        <span className="text-base font-black text-on-surface bg-surface-container-low px-3 py-1.5 rounded-lg border border-[#E2E8F0]">{appt.fee}</span>
                        {(appt.status === 'Confirmed' || appt.status === 'Pending') && (
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="text-base font-extrabold text-red-500 hover:text-white border border-red-200 hover:bg-red-500 hover:border-red-500 py-2 px-4 rounded-lg tracking-tight transition-all shadow-level-1"
                          >
                            Cancel Appointment
                          </button>
                        )}
                        {(appt.status === 'Completed' || appt.status === 'Cancelled') && (
                          <button
                            className="text-base font-extrabold text-outline hover:bg-blue-50 hover:text-secondary border border-[#E2E8F0] py-2 px-4 rounded-lg tracking-tight transition-all shadow-level-1"
                          >
                            View Details
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] p-16 text-center max-w-md mx-auto">
                  <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h4 className="text-base font-extrabold tracking-tight text-on-surface mb-1">No bookings scheduled</h4>
                  <p className="text-base font-semibold text-outline leading-relaxed mb-6">
                    You have not registered any appointments yet. Click the button to browse specialized doctors.
                  </p>
                  <button 
                    onClick={() => setActiveTab('doctors')}
                    className="bg-secondary text-on-secondary hover:bg-secondary text-on-secondary text-white text-base font-bold py-2.5 px-6 rounded-lg transition-colors shadow-level-1"
                  >
                    Schedule First Appointment
                  </button>
                </div>
              )}

              <div className="text-center mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100/50">
                <p className="text-base font-semibold text-outline">
                  Can't find your appointment? <button onClick={() => setShowSupportModal(true)} className="text-secondary font-bold hover:underline">Contact our support team</button> for assistance.
                </p>
              </div>

            </div>
          )}

          {/* 5. VIEW: MY PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl mx-auto bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6 sm:p-8 space-y-8 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center pb-6 border-b border-[#E2E8F0]">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                    alt="Student Avatar" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-50"
                  />
                  <span className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-5xl font-black tracking-tight text-on-surface">{patientInfo.name}</h3>
                  <p className="text-base text-outline font-semibold">{patientInfo.email} • Student / Patient</p>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-blue-50 text-secondary text-base font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md">Blood Group: {patientInfo.bloodGroup}</span>
                    <span className="bg-purple-50 text-purple-600 text-base font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md">Age: {patientInfo.age}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-base font-bold text-outline uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text"
                      value={patientInfo.name}
                      onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                      required
                      className="w-full bg-surface-container-low border border-gray-150 rounded-lg px-4 py-3 text-base font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-base font-bold text-outline uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email"
                      value={patientInfo.email}
                      onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                      required
                      className="w-full bg-surface-container-low border border-gray-150 rounded-lg px-4 py-3 text-base font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-base font-bold text-outline uppercase tracking-wider">Contact Number</label>
                    <input 
                      type="tel"
                      value={patientInfo.phone}
                      onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                      required
                      className="w-full bg-surface-container-low border border-gray-150 rounded-lg px-4 py-3 text-base font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-base font-bold text-outline uppercase tracking-wider">Residential Address</label>
                    <input 
                      type="text"
                      value={patientInfo.address}
                      onChange={(e) => setPatientInfo({ ...patientInfo, address: e.target.value })}
                      required
                      className="w-full bg-surface-container-low border border-gray-150 rounded-lg px-4 py-3 text-base font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-6 flex justify-end">
                  <button
                    type="submit"
                    className="bg-secondary text-on-secondary hover:bg-secondary text-on-secondary text-white font-bold text-base py-3 px-6 rounded-lg tracking-tight transition-all shadow-level-1 shadow-blue-500/10"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* 6. VIEW: SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6 sm:p-8 space-y-6 animate-fadeIn">
              <h3 className="text-base font-extrabold tracking-tight text-on-surface pb-4 border-b border-gray-50">Account Preferences</h3>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <h5 className="text-base font-extrabold text-on-surface">Email Notifications</h5>
                    <p className="text-base font-semibold text-outline">Receive booking confirmations and reminders via email.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-9 h-5 bg-gray-200 rounded-full cursor-pointer focus:outline-none" />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <h5 className="text-base font-extrabold text-on-surface">Two-Factor Authentication</h5>
                    <p className="text-base font-semibold text-outline">Secure your digital health records using 2FA.</p>
                  </div>
                  <input type="checkbox" className="w-9 h-5 bg-gray-200 rounded-full cursor-pointer focus:outline-none" />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ----------------- BOOKING SUCCESS DIALOG/MODAL ----------------- */}
      {bookingSuccess && latestBookedAppt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-lg p-6 shadow-2xl border border-gray-50 text-center animate-scaleUp space-y-5">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" strokeWidth={3} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-5xl font-extrabold tracking-tight text-slate-850">Booking Confirmed!</h3>
              <p className="text-base font-semibold text-outline leading-relaxed px-4">
                Your consultation slot has been registered. A confirmation text was sent to your registered contact.
              </p>
            </div>

            {/* Summary Details Box */}
            <div className="bg-surface-container-low border border-[#E2E8F0] rounded-lg p-4 text-left space-y-2.5 text-base text-slate-600 font-semibold">
              <div className="flex justify-between">
                <span className="text-base font-bold uppercase tracking-wider text-outline">Doctor:</span>
                <span className="font-extrabold text-on-surface">{latestBookedAppt.doctorName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold uppercase tracking-wider text-outline">Speciality:</span>
                <span className="text-base font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">{latestBookedAppt.specialization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base font-bold uppercase tracking-wider text-outline">Scheduled:</span>
                <span className="font-extrabold text-on-surface">{latestBookedAppt.date} at {latestBookedAppt.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-base font-bold uppercase tracking-wider text-outline">Location:</span>
                <span className="text-outline font-semibold truncate max-w-[200px]">{latestBookedAppt.hospital}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setBookingSuccess(false);
                  setActiveTab('appointments');
                }}
                className="w-full bg-secondary text-on-secondary hover:bg-secondary text-on-secondary text-white font-extrabold tracking-tight text-base py-3.5 rounded-lg shadow-level-1 transition-colors"
              >
                Go to Appointments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUPPORT DIALOG/MODAL ----------------- */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-lg p-6 shadow-2xl border border-gray-50 animate-scaleUp">
            
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-base text-blue-950">Help &amp; Support</h4>
              <button onClick={() => setShowSupportModal(false)} className="text-outline hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <p className="text-base text-outline leading-relaxed">
                Describe your issue or query below and our medical support staff will reach out to you.
              </p>
              
              <div className="space-y-1">
                <label className="text-base font-bold text-outline uppercase tracking-wider">Message</label>
                <textarea
                  required
                  rows={4}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Describe your query..."
                  className="w-full bg-surface-container-low border border-gray-150 rounded-lg p-3 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="border border-[#E2E8F0] hover:bg-blue-50 hover:text-secondary text-outline font-semibold text-base py-2.5 px-4 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={supportSubmitted}
                  className="bg-secondary text-on-secondary hover:bg-secondary text-on-secondary disabled:bg-blue-400 text-white font-semibold text-base py-2.5 px-5 rounded-lg shadow-level-1 transition-all flex items-center gap-1.5"
                >
                  {supportSubmitted ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" /> Sending...
                    </>
                  ) : 'Submit Query'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
