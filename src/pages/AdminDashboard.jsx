import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Settings,
  Bell,
  ChevronDown,
  ChevronRight,
  Search,
  HeartPulse,
  LogOut,
  User,
  Plus,
  Stethoscope,
  ClipboardList,
  BarChart2,
  AlertCircle,
  Check,
  X,
  Star,
  TrendingUp,
  RefreshCw,
  Menu,
  Filter,
  Download,
  Eye,
  ArrowUpRight,
  UserPlus,
  Activity,
  Trash2,
  MoreVertical,
  Mail,
  Phone,
  Edit2
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

/* ─────────────────────────────────────────────
   DUMMY DATA
───────────────────────────────────────────── */
const STATS = {
  totalDoctors: 12,
  totalPatients: 158,
  totalAppointments: 324,
  pendingRequests: 8,
};

const PIE_DATA = [
  { name: 'Pending',   value: 8,   color: '#F97316' },
  { name: 'Booked',    value: 156, color: '#3B82F6' },
  { name: 'Completed', value: 120, color: '#8B5CF6' },
  { name: 'Cancelled', value: 40,  color: '#EF4444' },
];

const PENDING_REQUESTS = [
  { id: 'APT-2001', patient: 'Ravi Shankar',  email: 'ravi@mail.com',  doctor: 'Dr. Ananya Sharma', specialty: 'Cardiologist',      date: '2026-06-28', time: '10:00 AM' },
  { id: 'APT-2002', patient: 'Meera Joshi',   email: 'meera@mail.com', doctor: 'Dr. Rahul Verma',   specialty: 'Dentist',            date: '2026-06-28', time: '11:30 AM' },
  { id: 'APT-2003', patient: 'Karan Malhotra',email: 'karan@mail.com', doctor: 'Dr. Priya Desai',   specialty: 'Dermatologist',      date: '2026-06-29', time: '02:00 PM' },
  { id: 'APT-2004', patient: 'Sunita Rao',    email: 'sunita@mail.com',doctor: 'Dr. Vikram Gupta',  specialty: 'Orthopedic Surgeon', date: '2026-06-30', time: '09:30 AM' },
  { id: 'APT-2005', patient: 'Ankit Patel',   email: 'ankit@mail.com', doctor: 'Dr. Neha Kapoor',   specialty: 'Neurologist',        date: '2026-07-01', time: '03:00 PM' },
];

const RECENT_APPOINTMENTS = [
  { patient: 'Priya Kapoor',  doctor: 'Dr. Ananya Sharma', date: '2026-06-24', status: 'Booked'    },
  { patient: 'Rohit Verma',   doctor: 'Dr. Vikram Gupta',  date: '2026-06-23', status: 'Completed' },
  { patient: 'Sita Devi',     doctor: 'Dr. Priya Desai',   date: '2026-06-23', status: 'Completed' },
  { patient: 'Ajay Kumar',    doctor: 'Dr. Rahul Verma',   date: '2026-06-22', status: 'Booked'    },
  { patient: 'Divya Singh',   doctor: 'Dr. Neha Kapoor',   date: '2026-06-22', status: 'Cancelled' },
  { patient: 'Mohan Lal',     doctor: 'Dr. Amit Singh',    date: '2026-06-21', status: 'Completed' },
];

const TOP_DOCTORS = [
  { name: 'Dr. Ananya Sharma', specialty: 'Cardiologist',       appts: 85, rating: '4.8' },
  { name: 'Dr. Neha Kapoor',   specialty: 'Neurologist',        appts: 78, rating: '4.9' },
  { name: 'Dr. Vikram Gupta',  specialty: 'Orthopedic Surgeon', appts: 71, rating: '4.6' },
  { name: 'Dr. Priya Desai',   specialty: 'Dermatologist',      appts: 63, rating: '4.9' },
  { name: 'Dr. Amit Singh',    specialty: 'Pediatrician',       appts: 58, rating: '4.7' },
];

const SIDEBAR_NAV = [
  {
    header: 'MANAGE',
    items: [
      { label: 'Dashboard',     icon: LayoutDashboard, key: 'dashboard' },
      { label: 'Doctors',       icon: Stethoscope,     key: 'doctors'   },
      { label: 'Patients',      icon: Users,           key: 'patients'  },
    ],
  },
  {
    header: 'APPOINTMENTS',
    items: [
      { label: 'All Appointments',       icon: Calendar,     key: 'all-appts'       },
      { label: 'Pending Requests',        icon: Clock,        key: 'pending',  badge: 8 },
      { label: 'Booked',                  icon: CheckCircle,  key: 'booked'          },
      { label: 'Completed',               icon: Check,        key: 'completed'       },
      { label: 'Cancelled',               icon: XCircle,      key: 'cancelled'       },
    ],
  },
  {
    header: 'OTHERS',
    items: [
      { label: 'Reports',   icon: FileText,  key: 'reports'  },
      { label: 'Settings',  icon: Settings,  key: 'settings' },
    ],
  },
];

/* ─────────────────────────────────────────────
   TINY HELPERS
───────────────────────────────────────────── */
const getInitial = (name = '') => name.trim()[0]?.toUpperCase() ?? '?';

const INIT_COLORS = [
  'bg-blue-500',  'bg-teal-500',  'bg-purple-500',
  'bg-rose-500',  'bg-amber-500', 'bg-green-500',
];
const initColor = (name = '') =>
  INIT_COLORS[(name.charCodeAt(0) ?? 0) % INIT_COLORS.length];

const StatusBadge = ({ status }) => {
  const cfg = {
    Pending:   'bg-orange-100  text-orange-600',
    Booked:    'bg-blue-100    text-blue-600',
    Completed: 'bg-purple-100  text-purple-600',
    Cancelled: 'bg-red-100     text-red-500',
    Confirmed: 'bg-green-100   text-green-600',
  };
  return (
    <span className={`text-base font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${cfg[status] ?? 'bg-gray-100 text-outline'}`}>
      {status}
    </span>
  );
};

/* Custom Recharts centre label */
const CentreLabel = ({ cx, cy, total }) => (
  <>
    <text x={cx} y={cy - 8} textAnchor="middle" fill="#1E293B" className="text-5xl font-extrabold" style={{ fontSize: 28, fontWeight: 800 }}>
      {total}
    </text>
    <text x={cx} y={cy + 14} textAnchor="middle" fill="#94A3B8" style={{ fontSize: 11 }}>
      Total
    </text>
  </>
);

/* ═══════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
═══════════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeNav,         setActiveNav]         = useState('dashboard');
  const [sidebarOpen,       setSidebarOpen]        = useState(false);
  const [notifOpen,         setNotifOpen]          = useState(false);
  const [profileOpen,       setProfileOpen]        = useState(false);
  const [searchQuery,       setSearchQuery]        = useState('');
  const [pendingList,       setPendingList]        = useState(PENDING_REQUESTS);
  const [actionConfirm,     setActionConfirm]      = useState(null); // { id, action }
  const [showAddDoctor,     setShowAddDoctor]      = useState(false);
  const [showReports,       setShowReports]        = useState(false);
  const [doctorsList,       setDoctorsList]        = useState([
    { id: 1, name: 'Dr. Ananya Sharma', specialty: 'Cardiologist',       status: 'Active',   patients: 85, experience: '12+ Years', email: 'ananya@carewell.com', phone: '+91 9876543210' },
    { id: 2, name: 'Dr. Rahul Verma',   specialty: 'Dentist',            status: 'Active',   patients: 42, experience: '8+ Years',  email: 'rahul@carewell.com',  phone: '+91 9876543211' },
    { id: 3, name: 'Dr. Priya Desai',   specialty: 'Dermatologist',      status: 'Active',   patients: 63, experience: '10+ Years', email: 'priya@carewell.com',  phone: '+91 9876543212' },
    { id: 4, name: 'Dr. Amit Singh',    specialty: 'Pediatrician',       status: 'Inactive', patients: 58, experience: '15+ Years', email: 'amit@carewell.com',   phone: '+91 9876543213' },
    { id: 5, name: 'Dr. Vikram Gupta',  specialty: 'Orthopedic Surgeon', status: 'Active',   patients: 71, experience: '20+ Years', email: 'vikram@carewell.com', phone: '+91 9876543214' },
    { id: 6, name: 'Dr. Neha Kapoor',   specialty: 'Neurologist',        status: 'Active',   patients: 78, experience: '14+ Years', email: 'neha@carewell.com',   phone: '+91 9876543215' },
  ]);
  const [patientDirList, setPatientDirList] = useState([
    { id: 'P-001', name: 'Ravi Shankar', email: 'ravi@mail.com', phone: '+91 9988776655', gender: 'Male', registered: '2026-05-12', appointments: 4, status: 'Active' },
    { id: 'P-002', name: 'Meera Joshi', email: 'meera@mail.com', phone: '+91 9988776656', gender: 'Female', registered: '2026-05-18', appointments: 2, status: 'Active' },
    { id: 'P-003', name: 'Karan Malhotra', email: 'karan@mail.com', phone: '+91 9988776657', gender: 'Male', registered: '2026-06-01', appointments: 1, status: 'Inactive' },
    { id: 'P-004', name: 'Sunita Rao', email: 'sunita@mail.com', phone: '+91 9988776658', gender: 'Female', registered: '2026-06-10', appointments: 3, status: 'Active' },
    { id: 'P-005', name: 'Ankit Patel', email: 'ankit@mail.com', phone: '+91 9988776659', gender: 'Male', registered: '2026-06-15', appointments: 0, status: 'Active' },
  ]);
  const [newDoctorForm, setNewDoctorForm] = useState({ name: '', specialty: '', experience: '', email: '' });

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric', weekday: 'long',
  });

  /* Approve / reject pending request */
  const handleApprove = (id) => {
    setPendingList(prev => prev.filter(r => r.id !== id));
    setActionConfirm({ id, action: 'approved' });
    setTimeout(() => setActionConfirm(null), 2000);
  };
  const handleReject = (id) => {
    setPendingList(prev => prev.filter(r => r.id !== id));
    setActionConfirm({ id, action: 'rejected' });
    setTimeout(() => setActionConfirm(null), 2000);
  };

  /* Add doctor */
  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!newDoctorForm.name || !newDoctorForm.specialty) return;
    const newDoc = {
      id: doctorsList.length + 1,
      name: newDoctorForm.name,
      specialty: newDoctorForm.specialty,
      status: 'Active',
      patients: 0,
    };
    setDoctorsList([...doctorsList, newDoc]);
    setNewDoctorForm({ name: '', specialty: '', experience: '', email: '' });
    setShowAddDoctor(false);
    alert(`${newDoctorForm.name} has been added successfully!`);
  };

  /* Toggle doctor status */
  const toggleDoctorStatus = (id) => {
    setDoctorsList(prev =>
      prev.map(d => d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d)
    );
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) navigate('/');
  };

  /* Sidebar filtered nav */
  const filteredNav = SIDEBAR_NAV.map(section => ({
    ...section,
    items: section.items.filter(item =>
      !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(s => s.items.length > 0);

  /* ── Render content area based on activeNav ── */
  const filteredDoctorsList = doctorsList.filter(d => 
      !searchQuery || 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const filteredPatientsList = patientDirList.filter(p => 
      !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
    );

    const renderContent = () => {
    switch (activeNav) {

      /* ── DOCTORS MANAGEMENT ── */
      case 'doctors':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h2 className="text-5xl font-black text-on-surface tracking-tight">Manage Doctors</h2>
                <p className="text-base font-semibold text-outline mt-1">Add, update or remove doctor profiles from the directory.</p>
              </div>
              <button
                onClick={() => setShowAddDoctor(true)}
                className="flex items-center gap-2 bg-secondary hover:bg-on-secondary-container text-white text-base font-extrabold tracking-tight py-3 px-6 rounded-lg shadow-level-1 transition-all"
              >
                <UserPlus className="w-4 h-4" /> Add New Doctor
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Doctors', value: doctorsList.length },
                { label: 'Active Doctors', value: doctorsList.filter(d => d.status === 'Active').length },
                { label: 'Inactive Doctors', value: doctorsList.filter(d => d.status === 'Inactive').length },
                { label: 'Specializations', value: new Set(filteredDoctorsList.map(d => d.specialty)).size },
              ].map(s => (
                <div key={s.label} className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] p-5 shadow-level-1">
                  <p className="text-base font-bold text-outline uppercase tracking-wider">{s.label}</p>
                  <p className="text-5xl font-black tracking-tight text-on-surface mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-lg shadow-level-1 border border-[#E2E8F0] flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-outline" />
                <input type="text" placeholder="Search by name, email, or phone..." className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all font-semibold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <select className="w-full md:w-48 px-4 py-3 bg-surface-container-low border border-gray-150 rounded-lg text-base text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all">
                <option>All Specialities</option>
              </select>
              <select className="w-full md:w-40 px-4 py-3 bg-surface-container-low border border-gray-150 rounded-lg text-base text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all">
                <option>Any Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <button className="flex items-center gap-2 justify-center px-6 py-3 border-2 border-[#E2E8F0] text-gray-600 hover:bg-blue-50 hover:text-[#0066FF] rounded-lg text-base font-bold transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>

            <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-50">
                  <thead className="bg-surface-container-low/60">
                    <tr>
                      {['Doctor', 'Specialization', 'Experience', 'Contact', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-4 text-left text-base font-black uppercase tracking-wider text-outline">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredDoctorsList.map(doc => (
                      <tr key={doc.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${initColor(doc.name)} text-white text-base font-bold flex items-center justify-center shrink-0`}>
                              {getInitial(doc.name)}
                            </div>
                            <div>
                              <p className="text-base font-extrabold text-slate-850 leading-tight">{doc.name}</p>
                              <p className="text-base font-semibold text-outline mt-0.5">MBBS, MD</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-base font-bold uppercase tracking-wider text-[#0066FF] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md flex items-center gap-1 w-max">
                            <Stethoscope className="w-3 h-3" /> {doc.specialty}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-base font-bold text-slate-700">{doc.experience}</td>
                        <td className="px-5 py-4 space-y-1">
                          <p className="text-base font-semibold text-slate-600 flex items-center gap-1.5"><Mail className="w-3 h-3 text-outline" /> {doc.email}</p>
                          <p className="text-base font-semibold text-slate-600 flex items-center gap-1.5"><Phone className="w-3 h-3 text-outline" /> {doc.phone}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-base font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border ${doc.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-lg border border-[#E2E8F0] text-outline hover:text-[#0066FF] hover:border-blue-200 hover:bg-blue-50 flex items-center justify-center transition-all shadow-level-1">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 rounded-lg border border-[#E2E8F0] text-outline hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50 flex items-center justify-center transition-all shadow-level-1">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition-all shadow-level-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      /* ── PENDING REQUESTS ── */
      case 'pending':
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-5xl font-extrabold text-on-surface">Pending Appointment Requests</h2>
            {pendingList.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] p-16 text-center">
                <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <h3 className="font-bold text-slate-700 mb-1">All caught up!</h3>
                <p className="text-base text-outline">No pending appointment requests.</p>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-50">
                    <thead className="bg-surface-container-low/60">
                      <tr>
                        {['Patient', 'Doctor', 'Date & Time', 'Status', 'Actions'].map(h => (
                          <th key={h} className="px-5 py-3.5 text-left text-base font-black uppercase tracking-wider text-outline">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pendingList.map(req => (
                        <tr key={req.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full ${initColor(req.patient)} text-white text-base font-bold flex items-center justify-center shrink-0`}>
                                {getInitial(req.patient)}
                              </div>
                              <div>
                                <p className="text-base font-bold text-on-surface leading-none">{req.patient}</p>
                                <p className="text-base font-semibold text-outline mt-1">{req.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-base font-bold text-slate-705 leading-none">{req.doctor}</p>
                            <p className="text-base font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md mt-1 inline-block">{req.specialty}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-base font-bold text-slate-700">{req.date}</p>
                            <p className="text-base text-outline mt-0.5">{req.time}</p>
                          </td>
                          <td className="px-5 py-4"><StatusBadge status="Pending" /></td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => handleApprove(req.id)} className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors" title="Approve">
                                <Check className="w-4 h-4" strokeWidth={3} />
                              </button>
                              <button onClick={() => handleReject(req.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors" title="Reject">
                                <X className="w-4 h-4" strokeWidth={3} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      /* ── PATIENTS ── */
      case 'patients':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h2 className="text-5xl font-black text-on-surface tracking-tight">Patient List</h2>
                <p className="text-base font-semibold text-outline mt-1">Manage and view all registered patients.</p>
              </div>
              <button
                className="flex items-center gap-2 bg-surface-container-lowest border border-[#E2E8F0] hover:bg-blue-50 hover:text-[#0066FF] text-gray-700 text-base font-extrabold tracking-tight py-3 px-6 rounded-lg shadow-level-1 transition-all"
              >
                <Download className="w-4 h-4" /> Export Patients
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Patients', value: 158, icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                { label: 'Active Patients', value: 142, icon: Activity, color: 'text-green-600 bg-green-50 border-green-100' },
                { label: 'Inactive Patients', value: 16, icon: XCircle, color: 'text-red-600 bg-red-50 border-red-100' },
                { label: 'Total Appointments', value: 324, icon: Calendar, color: 'text-purple-600 bg-purple-50 border-purple-100' },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] p-5 shadow-level-1 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-base font-bold text-outline uppercase tracking-wider">{s.label}</p>
                      <div className={`p-2 rounded-lg border ${s.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-5xl font-black tracking-tight text-on-surface">{s.value}</p>
                  </div>
                )
              })}
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-lg shadow-level-1 border border-[#E2E8F0] flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-outline" />
                <input type="text" placeholder="Search patient..." className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all font-semibold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <select className="w-full md:w-36 px-4 py-3 bg-surface-container-low border border-gray-150 rounded-lg text-base text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <select className="w-full md:w-36 px-4 py-3 bg-surface-container-low border border-gray-150 rounded-lg text-base text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all">
                <option>All Genders</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              <input type="date" className="w-full md:w-40 px-4 py-3 bg-surface-container-low border border-gray-150 rounded-lg text-base text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all" />
              <button className="flex items-center gap-2 justify-center px-6 py-3 border-2 border-[#0066FF] text-[#0066FF] hover:bg-blue-50 rounded-lg text-base font-bold transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>

            <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-50">
                  <thead className="bg-surface-container-low/60">
                    <tr>
                      {['Patient', 'Contact Info', 'Gender', 'Registered Date', 'Appointments', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-4 text-left text-base font-black uppercase tracking-wider text-outline">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredPatientsList.map(pat => (
                      <tr key={pat.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${initColor(pat.name)} text-white text-base font-bold flex items-center justify-center shrink-0`}>
                              {getInitial(pat.name)}
                            </div>
                            <div>
                              <p className="text-base font-extrabold text-slate-850 leading-tight">{pat.name}</p>
                              <p className="text-base font-semibold text-outline mt-0.5">{pat.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 space-y-1">
                          <p className="text-base font-semibold text-slate-600 flex items-center gap-1.5"><Mail className="w-3 h-3 text-outline" /> {pat.email}</p>
                          <p className="text-base font-semibold text-slate-600 flex items-center gap-1.5"><Phone className="w-3 h-3 text-outline" /> {pat.phone}</p>
                        </td>
                        <td className="px-5 py-4 text-base font-bold text-slate-700">{pat.gender}</td>
                        <td className="px-5 py-4 text-base font-bold text-slate-700">{pat.registered}</td>
                        <td className="px-5 py-4 text-base font-black text-on-surface text-center">{pat.appointments}</td>
                        <td className="px-5 py-4">
                          <span className={`text-base font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border ${pat.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {pat.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-gray-600 hover:text-[#0066FF] hover:border-blue-200 hover:bg-blue-50 flex items-center justify-center transition-all shadow-level-1 text-base font-extrabold tracking-tight">
                              View
                            </button>
                            <button className="w-7 h-7 rounded-lg text-outline hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-all">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="border-t border-gray-50 px-5 py-4 flex items-center justify-between">
                <p className="text-base font-bold text-outline">Showing <span className="text-on-surface">1</span> to <span className="text-on-surface">5</span> of <span className="text-on-surface">158</span> patients</p>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-outline mr-2">Rows per page: 10</span>
                  <button className="px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-base font-extrabold text-outline cursor-not-allowed">Prev</button>
                  <button className="w-8 h-8 rounded-lg bg-secondary text-white text-base font-extrabold shadow-level-1">1</button>
                  <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-[#0066FF] text-base font-extrabold">2</button>
                  <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-[#0066FF] text-base font-extrabold">3</button>
                  <button className="px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-base font-extrabold text-gray-600 hover:bg-blue-50 hover:text-[#0066FF]">Next</button>
                </div>
              </div>

            </div>
          </div>
        );

      /* ── REPORTS ── */
      case 'reports':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-5xl font-extrabold text-on-surface">Reports & Analytics</h2>
              <button onClick={() => alert('Report downloaded!')} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-base font-extrabold tracking-tight py-2.5 px-5 rounded-lg shadow transition-all">
                <Download className="w-4 h-4" /> Download Report
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Revenue This Month', value: '₹1,24,800', change: '+12%', color: 'text-green-600' },
                { label: 'Avg. Appointments/Day', value: '18', change: '+5%', color: 'text-blue-600' },
                { label: 'Patient Satisfaction', value: '94%', change: '+2%', color: 'text-purple-600' },
                { label: 'Doctor Utilization', value: '82%', change: '-3%', color: 'text-orange-600' },
              ].map(s => (
                <div key={s.label} className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] p-6 shadow-level-1">
                  <p className="text-base font-bold text-outline uppercase tracking-wider mb-2">{s.label}</p>
                  <div className="flex items-end gap-3">
                    <span className={`text-5xl font-black tracking-tight ${s.color}`}>{s.value}</span>
                    <span className={`text-base font-bold mb-1 ${s.change.startsWith('+') ? 'text-green-500' : 'text-red-450'}`}>{s.change} vs last month</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      /* ── SETTINGS ── */
      case 'settings':
        return (
          <div className="max-w-2xl space-y-6 animate-fadeIn">
            <h2 className="text-5xl font-extrabold text-on-surface">Admin Settings</h2>
            <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6 space-y-5">
              {[
                { label: 'Email Notifications',      sub: 'Receive alerts for new appointments and requests', checked: true  },
                { label: 'Auto-confirm Appointments', sub: 'Automatically confirm new booking requests',       checked: false },
                { label: 'Two-Factor Authentication', sub: 'Enable 2FA for your admin account',               checked: true  },
                { label: 'Weekly Summary Email',      sub: 'Get a weekly digest of hospital activity',        checked: true  },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-base font-bold text-slate-805">{s.label}</p>
                    <p className="text-base font-semibold text-outline mt-1">{s.sub}</p>
                  </div>
                  <input type="checkbox" defaultChecked={s.checked} className="w-10 h-5 cursor-pointer rounded-full" />
                </div>
              ))}
            </div>
          </div>
        );

      /* ── ALL APPOINTMENTS ── */
      case 'all-appts':
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-5xl font-extrabold text-on-surface">All Appointments</h2>
            <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-50">
                  <thead className="bg-surface-container-low/60">
                    <tr>
                      {['ID', 'Patient', 'Doctor', 'Date', 'Status'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-base font-black uppercase tracking-wider text-outline">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[...RECENT_APPOINTMENTS, ...RECENT_APPOINTMENTS].map((appt, i) => (
                      <tr key={i} className="hover:bg-blue-50/50">
                        <td className="px-5 py-4 text-base font-mono text-outline">APT-{1000 + i + 1}</td>
                        <td className="px-5 py-4 text-base font-bold text-on-surface">{appt.patient}</td>
                        <td className="px-5 py-4 text-base font-semibold text-slate-700">{appt.doctor}</td>
                        <td className="px-5 py-4 text-base text-outline">{appt.date}</td>
                        <td className="px-5 py-4"><StatusBadge status={appt.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      /* ── DEFAULT: MAIN DASHBOARD ── */
      default:
        return <MainDashboardContent
          pendingList={pendingList}
          handleApprove={handleApprove}
          handleReject={handleReject}
          setActiveNav={setActiveNav}
          setShowAddDoctor={setShowAddDoctor}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex font-sans text-on-surface">

      {/* ══════════ MOBILE OVERLAY ══════════ */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ══════════════════════════════════════
          DARK SIDEBAR
      ══════════════════════════════════════ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1E293B] flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Brand */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black text-white leading-none tracking-tight">CareWell Hospital</span>
              <span className="text-base font-bold uppercase tracking-wider text-slate-405 mt-1.5 leading-none">Admin Dashboard</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-outline hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-outline" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search menu…"
              className="w-full bg-[#0F172A] text-white text-base pl-9 pr-3 py-2.5 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {filteredNav.map(section => (
            <div key={section.header}>
              <p className="text-base font-black tracking-[0.15em] text-outline uppercase px-3 mb-2">{section.header}</p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const active = activeNav === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => { setActiveNav(item.key); setSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-bold tracking-tight transition-all ${
                        active
                          ? 'bg-secondary text-white shadow-lg shadow-blue-600/20'
                          : 'text-outline hover:bg-surface-container-lowest/5 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-outline'}`} />
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="bg-orange-500 text-white text-base font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Pill */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="bg-[#0F172A] rounded-lg p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-base shrink-0">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-extrabold text-white leading-none truncate">Admin User</p>
              <p className="text-base font-semibold text-slate-405 mt-0.5 truncate">admin@carewell.com</p>
            </div>
            <button onClick={handleLogout} title="Logout" className="text-outline hover:text-red-400 transition-colors shrink-0">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MAIN PANEL
      ══════════════════════════════════════ */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">

        {/* ── TOP HEADER ── */}
        <header className="h-20 bg-surface-container-lowest border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-outline hover:bg-blue-50 hover:text-[#0066FF] rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-5xl font-black tracking-tight text-on-surface leading-none">Welcome back, Admin! 👋</h2>
              <p className="text-base font-semibold text-outline mt-1.5">Here's what's happening in your hospital today.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date widget */}
            <div className="hidden lg:flex items-center gap-2 bg-surface-container-low border border-[#E2E8F0] px-4 py-2 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-base font-bold text-slate-600">{today}</span>
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2.5 bg-surface-container-low hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-base font-extrabold rounded-full flex items-center justify-center border-2 border-white animate-pulse">8</span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-xl z-50 py-2">
                  <div className="px-4 pb-2 border-b border-gray-50 flex justify-between items-center">
                    <span className="text-base font-bold text-on-surface">Notifications</span>
                    <button onClick={() => setNotifOpen(false)} className="text-base text-blue-600 hover:underline">Mark all read</button>
                  </div>
                  {['New appointment request from Ravi Shankar', 'Dr. Neha Kapoor updated availability', 'Monthly report is ready to download', '5 pending requests awaiting review'].map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-blue-50 hover:text-[#0066FF] border-b border-gray-50 last:border-0">
                      <p className="text-base text-slate-700">{n}</p>
                      <p className="text-base text-outline mt-0.5">{i + 1}h ago</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 p-1.5 pr-3 hover:bg-blue-50 hover:text-[#0066FF] rounded-full transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-base flex items-center justify-center">A</div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-base font-bold text-on-surface leading-none">Admin</span>
                  <span className="text-base text-outline">Super Admin</span>
                </div>
                <ChevronDown className="w-4 h-4 text-outline" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-xl z-50 py-2">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-base font-bold text-on-surface">Admin User</p>
                    <p className="text-base text-outline">admin@carewell.com</p>
                  </div>
                  {[{ label: 'Settings', icon: Settings, key: 'settings' }].map(item => (
                    <button key={item.key} onClick={() => { setActiveNav(item.key); setProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-base text-slate-700 hover:bg-blue-50 hover:text-[#0066FF] flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-outline" /> {item.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-50 mt-1">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-base text-red-500 hover:bg-red-50 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── WORKSPACE ── */}
        <main className="flex-1 p-4 sm:p-8">
          {renderContent()}
        </main>
      </div>

      {/* ══════════ ACTION CONFIRM TOAST ══════════ */}
      {actionConfirm && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-xl text-white text-base font-semibold animate-scaleUp ${actionConfirm.action === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}>
          {actionConfirm.action === 'approved' ? <Check className="w-5 h-5" strokeWidth={3} /> : <X className="w-5 h-5" strokeWidth={3} />}
          Request {actionConfirm.action} successfully!
        </div>
      )}

      {/* ══════════ ADD DOCTOR MODAL ══════════ */}
      {showAddDoctor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-lg shadow-2xl p-6 animate-scaleUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-on-surface text-lg">Add New Doctor</h3>
              <button onClick={() => setShowAddDoctor(false)} className="text-outline hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddDoctor} className="space-y-4">
              {[
                { label: 'Full Name',       key: 'name',       type: 'text',  placeholder: 'Dr. Full Name' },
                { label: 'Specialization',  key: 'specialty',  type: 'text',  placeholder: 'e.g. Cardiologist' },
                { label: 'Experience',      key: 'experience', type: 'text',  placeholder: 'e.g. 10 Years' },
                { label: 'Email',           key: 'email',      type: 'email', placeholder: 'doctor@carewell.com' },
              ].map(field => (
                <div key={field.key} className="space-y-1">
                  <label className="text-base font-bold text-outline uppercase tracking-wider">{field.label}</label>
                  <input
                    type={field.type}
                    value={newDoctorForm[field.key]}
                    onChange={e => setNewDoctorForm({ ...newDoctorForm, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    required={field.key === 'name' || field.key === 'specialty'}
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-3 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddDoctor(false)} className="flex-1 border border-[#E2E8F0] text-outline text-base font-semibold py-3 rounded-lg hover:bg-blue-50 hover:text-[#0066FF] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-secondary hover:bg-on-secondary-container text-white text-base font-bold py-3 rounded-lg shadow-level-1 transition-colors">Add Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD CONTENT (extracted for clarity)
═══════════════════════════════════════════════════════════════ */
const MainDashboardContent = ({ pendingList, handleApprove, handleReject, setActiveNav, setShowAddDoctor }) => {
  const totalAppts = PIE_DATA.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-7 animate-fadeIn">

      {/* ── METRIC CARDS ROW ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { label: 'Total Doctors',       value: STATS.totalDoctors,       icon: Stethoscope,   color: 'bg-blue-50   text-blue-600',   bar: 'bg-blue-500',   nav: 'doctors'   },
          { label: 'Total Patients',      value: STATS.totalPatients,      icon: Users,          color: 'bg-green-50  text-green-600',  bar: 'bg-green-500',  nav: 'patients'  },
          { label: 'Total Appointments',  value: STATS.totalAppointments,  icon: Calendar,       color: 'bg-purple-50 text-purple-600', bar: 'bg-purple-500', nav: 'all-appts' },
          { label: 'Pending Requests',    value: STATS.pendingRequests,    icon: AlertCircle,    color: 'bg-orange-50 text-orange-500', bar: 'bg-orange-500', nav: 'pending'   },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-5 flex flex-col gap-4 hover:shadow-level-1 transition-shadow relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-lg ${card.color.split(' ')[0]}`}>
                  <Icon className={`w-5 h-5 ${card.color.split(' ')[1]}`} />
                </div>
                <button
                  onClick={() => setActiveNav(card.nav)}
                  className="text-base font-extrabold text-blue-500 hover:text-blue-700 flex items-center gap-0.5"
                >
                  View all <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
              <div>
                <p className="text-base font-bold text-outline uppercase tracking-wider mb-1.5">{card.label}</p>
                <p className="text-5xl font-black tracking-tight text-on-surface tabular-nums">{card.value}</p>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${card.bar} opacity-60 rounded-b-2xl`} />
            </div>
          );
        })}
      </div>

      {/* ── MIDDLE ROW: PENDING TABLE + PIE CHART ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Pending Requests Table (3/5 width) */}
        <div className="xl:col-span-3 bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-on-surface">Pending Appointment Requests</h3>
              <p className="text-base text-outline font-semibold mt-0.5">{pendingList.length} requests awaiting approval</p>
            </div>
            <button onClick={() => setActiveNav('pending')} className="text-base font-extrabold text-blue-500 hover:text-blue-700 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {pendingList.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-600">All cleared!</p>
              <p className="text-base text-outline">No pending requests.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-surface-container-low/60">
                  <tr>
                    {['Patient', 'Doctor', 'Date & Time', 'Status', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-base font-black uppercase tracking-wider text-outline">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pendingList.slice(0, 5).map(req => (
                    <tr key={req.id} className="hover:bg-blue-50 hover:text-[#0066FF]/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${initColor(req.patient)} text-white text-base font-bold flex items-center justify-center shrink-0`}>
                            {getInitial(req.patient)}
                          </div>
                          <div>
                            <p className="text-base font-bold text-on-surface leading-none">{req.patient}</p>
                            <p className="text-base text-outline mt-1">{req.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-base font-bold text-slate-700 leading-none">{req.doctor}</p>
                        <p className="text-base font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md mt-1 inline-block">{req.specialty}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-base font-semibold text-slate-600">{req.date}</p>
                        <p className="text-base text-outline mt-0.5">{req.time}</p>
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status="Pending" /></td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => handleApprove(req.id)} className="w-7 h-7 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg flex items-center justify-center transition-colors">
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          </button>
                          <button onClick={() => handleReject(req.id)} className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-colors">
                            <X className="w-3.5 h-3.5" strokeWidth={3} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Appointments Pie Chart (2/5 width) */}
        <div className="xl:col-span-2 bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-5 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-extrabold tracking-tight text-on-surface">Appointments Overview</h3>
            <p className="text-base text-outline font-semibold mt-0.5">Distribution by current status</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="none" />
                  ))}
                  <CentreLabel cx="50%" cy="50%" total={totalAppts} />
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  formatter={(value, name) => [`${value} (${Math.round(value / totalAppts * 100)}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="w-full grid grid-cols-2 gap-2 mt-2">
              {PIE_DATA.map(entry => (
                <div key={entry.name} className="flex items-center gap-2 bg-surface-container-low/60 rounded-lg px-3 py-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                  <div className="min-w-0">
                    <p className="text-base font-bold uppercase tracking-wider text-outline">{entry.name}</p>
                    <p className="text-base font-black text-on-surface leading-tight">{entry.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: 3 COLUMNS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Recent Appointments */}
        <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-extrabold tracking-tight text-on-surface">Recent Appointments</h3>
            <button onClick={() => setActiveNav('all-appts')} className="text-base font-extrabold text-blue-500 hover:underline flex items-center gap-0.5">
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_APPOINTMENTS.map((appt, i) => (
              <div key={i} className="px-5 py-3.5 flex justify-between items-center hover:bg-blue-50 hover:text-[#0066FF]/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${initColor(appt.patient)} text-white text-base font-bold flex items-center justify-center shrink-0`}>
                    {getInitial(appt.patient)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-850 leading-none">{appt.patient}</p>
                    <p className="text-base font-semibold text-outline mt-0.5">{appt.date}</p>
                  </div>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Top Doctors */}
        <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-extrabold tracking-tight text-on-surface">Top Performing Doctors</h3>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="divide-y divide-gray-50">
            {TOP_DOCTORS.map((doc, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3 hover:bg-blue-50 hover:text-[#0066FF]/40 transition-colors">
                <span className={`text-base font-black w-5 ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-outline' : 'text-orange-650'}`}>
                  #{i + 1}
                </span>
                <div className={`w-8 h-8 rounded-full ${initColor(doc.name)} text-white text-base font-bold flex items-center justify-center shrink-0`}>
                  {getInitial(doc.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-extrabold text-on-surface leading-none truncate">{doc.name}</p>
                  <p className="text-base font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-sm mt-1 inline-block">{doc.specialty}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-black text-on-surface">{doc.appts}</p>
                  <div className="flex items-center gap-0.5 justify-end">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span className="text-base font-semibold text-outline">{doc.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold tracking-tight text-slate-850 px-1">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Add New Doctor',          icon: UserPlus,      bg: 'bg-blue-50 text-blue-600 border-blue-100',   action: () => setShowAddDoctor(true)          },
              { label: 'Manage Doctors',          icon: Stethoscope,   bg: 'bg-green-50 text-green-600 border-green-100',  action: () => setActiveNav('doctors')         },
              { label: 'All Appointments',        icon: ClipboardList, bg: 'bg-purple-50 text-purple-600 border-purple-100', action: () => setActiveNav('all-appts')       },
              { label: 'Generate Reports',        icon: BarChart2,     bg: 'bg-orange-50 text-orange-600 border-orange-100', action: () => setActiveNav('reports')         },
            ].map(qa => {
              const Icon = qa.icon;
              return (
                <button
                  key={qa.label}
                  onClick={qa.action}
                  className="flex flex-col items-center justify-center gap-3 bg-surface-container-lowest p-5 rounded-lg border border-[#E2E8F0] shadow-level-1 hover:shadow-level-1 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${qa.bg} transition-transform group-hover:scale-110`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-base font-extrabold tracking-tight text-on-surface text-center leading-tight">{qa.label}</p>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
