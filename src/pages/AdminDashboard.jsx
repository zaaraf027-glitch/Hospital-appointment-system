import { useState, useEffect } from 'react';
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
  Stethoscope,
  ClipboardList,
  BarChart2,
  AlertCircle,
  Check,
  X,
  Star,
  TrendingUp,
  Menu,
  Filter,
  Download,
  Eye,
  ArrowUpRight,
  ArrowRight,
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
  ResponsiveContainer
} from 'recharts';
import { doctors } from '../data/doctors';

/* ---
   DUMMY DATA
--- */
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

/* ---
   TINY HELPERS
--- */
const getInitial = (name = '') => {
  const cleanName = name.replace(/^(Dr\.\s*|Dr\s+)/i, '');
  return cleanName.trim()[0]?.toUpperCase() ?? '?';
};

const INIT_COLORS = [
  'bg-blue-500',  'bg-teal-500',  'bg-purple-500',
  'bg-rose-500',  'bg-amber-500', 'bg-green-500',
];
const initColor = (name = '') => {
  const cleanName = name.replace(/^(Dr\.\s*|Dr\s+)/i, '');
  const initial = cleanName.trim()[0]?.toUpperCase() ?? '?';
  return INIT_COLORS[(initial.charCodeAt(0) ?? 0) % INIT_COLORS.length];
};

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

/* ===
   ADMIN DASHBOARD
=== */
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeNav,         setActiveNav]         = useState('dashboard');
  const [sidebarOpen,       setSidebarOpen]        = useState(false);
  const [notifOpen,         setNotifOpen]          = useState(false);
  const [profileOpen,       setProfileOpen]        = useState(false);
  const [searchQuery,       setSearchQuery]        = useState('');
  const [appointmentsList,  setAppointmentsList]   = useState([]);
  const pendingList = appointmentsList.filter(appt => appt.status === 'Pending');
  const [actionConfirm,     setActionConfirm]      = useState(null); // { id, action }
  const [showAddDoctor,     setShowAddDoctor]      = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showReports,       setShowReports]        = useState(false);
  const [doctorsList,       setDoctorsList]        = useState([]);
  const [adminUser,         setAdminUser]          = useState({ username: 'Admin', email: 'admin@carewell.com' });
  const [patientDirList, setPatientDirList] = useState([
    {
      id: 'P-001',
      name: 'Ravi Shankar',
      email: 'ravi@mail.com',
      phone: '+91 9988776655',
      gender: 'Male',
      dob: '1992-04-15',
      age: 34,
      registered: '2026-05-12',
      status: 'Active',
      address: '12, Ravindrapuri Colony, Varanasi, UP - 221005',
      emergencyContact: 'Suman Shankar (+91 9988776650) - Spouse',
      bloodGroup: 'O+',
      allergies: 'Penicillin, Dust',
      appointments: 4,
      appointmentHistory: [
        { date: '2026-06-28', doctor: 'Dr. Ananya Sharma', specialty: 'Cardiologist', status: 'Pending' },
        { date: '2026-06-12', doctor: 'Dr. Rahul Verma', specialty: 'Dentist', status: 'Completed' },
        { date: '2026-05-20', doctor: 'Dr. Priya Desai', specialty: 'Dermatologist', status: 'Completed' },
        { date: '2026-05-14', doctor: 'Dr. Amit Singh', specialty: 'Pediatrician', status: 'Cancelled' }
      ],
      medicalNotes: {
        diagnosis: 'Stage 1 Hypertension, Dental Plaque',
        doctorNotes: 'Recommend low sodium diet and regular dental cleanings.',
        reports: ['Cardio_ECG_Report.pdf', 'Dental_XRay.jpg']
      }
    },
    {
      id: 'P-002',
      name: 'Meera Joshi',
      email: 'meera@mail.com',
      phone: '+91 9988776656',
      gender: 'Female',
      dob: '1998-09-22',
      age: 28,
      registered: '2026-05-18',
      status: 'Active',
      address: 'Flat 402, Shivam Apartments, Sigra, Varanasi, UP - 221010',
      emergencyContact: 'Ramesh Joshi (+91 9988776640) - Father',
      bloodGroup: 'A+',
      allergies: 'Sulfa Drugs, Peanuts',
      appointments: 2,
      appointmentHistory: [
        { date: '2026-06-28', doctor: 'Dr. Rahul Verma', specialty: 'Dentist', status: 'Pending' },
        { date: '2026-05-25', doctor: 'Dr. Neha Kapoor', specialty: 'Neurologist', status: 'Completed' }
      ],
      medicalNotes: {
        diagnosis: 'Migraine Headache',
        doctorNotes: 'Advised avoiding bright light triggers and taking prescribed tablets on onset.',
        reports: ['Brain_MRI_Scan.pdf']
      }
    },
    {
      id: 'P-003',
      name: 'Karan Malhotra',
      email: 'karan@mail.com',
      phone: '+91 9988776657',
      gender: 'Male',
      dob: '1981-01-30',
      age: 45,
      registered: '2026-06-01',
      status: 'Inactive',
      address: 'B-34/2, Jawahar Nagar, Varanasi, UP - 221002',
      emergencyContact: 'Tina Malhotra (+91 9988776630) - Wife',
      bloodGroup: 'B-',
      allergies: 'None',
      appointments: 1,
      appointmentHistory: [
        { date: '2026-06-15', doctor: 'Dr. Priya Desai', specialty: 'Dermatologist', status: 'Completed' }
      ],
      medicalNotes: {
        diagnosis: 'Contact Dermatitis',
        doctorNotes: 'Apply topical steroid cream twice daily for 7 days.',
        reports: ['Skin_Biopsy_Results.pdf']
      }
    },
    {
      id: 'P-004',
      name: 'Sunita Rao',
      email: 'sunita@mail.com',
      phone: '+91 9988776658',
      gender: 'Female',
      dob: '1974-07-05',
      age: 52,
      registered: '2026-06-10',
      status: 'Active',
      address: 'C-15, Kabir Nagar, Varanasi, UP - 221008',
      emergencyContact: 'Aniket Rao (+91 9988776620) - Son',
      bloodGroup: 'AB+',
      allergies: 'Aspirin',
      appointments: 3,
      appointmentHistory: [
        { date: '2026-06-30', doctor: 'Dr. Vikram Gupta', specialty: 'Orthopedic Surgeon', status: 'Pending' },
        { date: '2026-06-18', doctor: 'Dr. Vikram Gupta', specialty: 'Orthopedic Surgeon', status: 'Completed' },
        { date: '2026-06-11', doctor: 'Dr. Ananya Sharma', specialty: 'Cardiologist', status: 'Completed' }
      ],
      medicalNotes: {
        diagnosis: 'Osteoarthritis (Right Knee)',
        doctorNotes: 'Advised mild physiotherapy and daily knee brace support.',
        reports: ['Knee_XRay_Right.pdf']
      }
    },
    {
      id: 'P-005',
      name: 'Ankit Patel',
      email: 'ankit@mail.com',
      phone: '+91 9988776659',
      gender: 'Male',
      dob: '2002-12-10',
      age: 24,
      registered: '2026-06-15',
      status: 'Active',
      address: 'S-45, Mahavir Enclave, Varanasi, UP - 221003',
      emergencyContact: 'Rajesh Patel (+91 9988776610) - Brother',
      bloodGroup: 'O-',
      allergies: 'Pollen',
      appointments: 0,
      appointmentHistory: [],
      medicalNotes: {
        diagnosis: 'Healthy',
        doctorNotes: 'General health checkup. All vitals normal.',
        reports: []
      }
    }
  ]);
  const [newDoctorForm, setNewDoctorForm] = useState({ name: '', specialty: '', experience: '', email: '' });
  
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [deletingDoctor, setDeletingDoctor] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // Patient Actions States
  const [viewingPatient, setViewingPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deletingPatient, setDeletingPatient] = useState(null);
  const [bookingPatient, setBookingPatient] = useState(null);
  const [activePatientMenu, setActivePatientMenu] = useState(null);

  const hasUpcomingBookings = (doctor) => {
    const inDoctorAppts = doctor.appointments?.some(appt => appt.status === 'Booked' || appt.status === 'Pending') ?? false;
    const inPendingList = pendingList.some(req => req.doctor === doctor.name);
    return inDoctorAppts || inPendingList;
  };

  const logDeleteAction = (doctor, isHardDelete, reason = '') => {
    const timestamp = new Date().toLocaleString('en-IN');
    const logMsg = {
      id: Date.now(),
      timestamp,
      doctorName: doctor.name,
      doctorId: doctor.id,
      action: isHardDelete ? 'Hard Delete (Permanent Removal)' : 'Soft Delete (Mark Inactive)',
      reason: reason || (isHardDelete ? 'Admin requested permanent removal.' : 'Soft deleted/archived doctor.')
    };
    setAuditLogs(prev => [logMsg, ...prev]);
    console.log('AUDIT TRAIL ENTRY:', logMsg);
  };

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric', weekday: 'long',
  });

  // Load and verify admin data
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    // Set admin user info for display
    setAdminUser({ username: user.username || 'Admin', email: user.email || 'admin@carewell.com' });
    
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/doctor/all`);
      const data = await response.json();
      if (response.ok && data.success) {
        const formatted = data.doctors.map(d => ({
          id: d._id,
          name: d.name,
          specialization: d.specialization,
          specialty: d.specialization,
          qualification: d.qualification,
          experience: `${d.experience} Years`,
          consultationFee: d.consultationFee,
          fee: `₹${d.consultationFee}`,
          email: d.email,
          phone: d.phone,
          hospital: d.hospital || "CareWell Hospital",
          about: d.about || "Experienced doctor.",
          availableSlots: d.availableSlots,
          status: d.isAvailable ? 'Active' : 'Inactive',
          patients: d.patients || 15,
          appointments: d.appointments || [
            { patient: 'Ravi Shankar', date: '2026-06-28', time: '10:00 AM', status: 'Pending' }
          ]
        }));
        setDoctorsList(formatted);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/appointment/all`);
      const data = await response.json();
      if (response.ok && data.success) {
        const formatted = data.appointments.map(appt => ({
          id: appt._id,
          patient: appt.patientId?.username || "Unknown Patient",
          email: appt.patientId?.email || "patient@carewell.com",
          doctor: appt.doctorId?.name || "Unknown Doctor",
          specialty: appt.doctorId?.specialization || "General",
          date: appt.appointmentDate ? new Date(appt.appointmentDate).toISOString().split('T')[0] : "Pending",
          time: appt.appointmentTime,
          status: appt.status
        }));
        setAppointmentsList(formatted);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  /* Approve / reject pending request */
  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/appointment/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Booked' }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        fetchAppointments();
        setActionConfirm({ id, action: 'approved' });
        setTimeout(() => setActionConfirm(null), 2000);
      } else {
        alert(data.message || 'Failed to approve appointment.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend.');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/appointment/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        fetchAppointments();
        setActionConfirm({ id, action: 'rejected' });
        setTimeout(() => setActionConfirm(null), 2000);
      } else {
        alert(data.message || 'Failed to reject appointment.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend.');
    }
  };

  /* Add doctor */
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!newDoctorForm.name || !newDoctorForm.specialty) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/doctor/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newDoctorForm.name,
          specialization: newDoctorForm.specialty,
          qualification: "MBBS, MD",
          experience: Number(newDoctorForm.experience) || 5,
          consultationFee: 500,
          email: newDoctorForm.email || `${newDoctorForm.name.toLowerCase().replace(/[^a-z]/g, '')}@carewell.com`,
          phone: "+91 9876543201",
          hospital: "CareWell Hospital",
          about: "Experienced doctor.",
          availableSlots: ["10:00 AM", "11:30 AM", "2:00 PM"]
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        fetchDoctors();
        setNewDoctorForm({ name: '', specialty: '', experience: '', email: '' });
        setShowAddDoctor(false);
        alert(`${newDoctorForm.name} has been added successfully!`);
      } else {
        alert(data.message || 'Failed to add doctor.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend.');
    }
  };

  /* Toggle doctor status */
  const toggleDoctorStatus = async (id) => {
    const doc = doctorsList.find(d => d.id === id);
    if (!doc) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/doctor/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable: doc.status !== 'Active' }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchDoctors();
      } else {
        alert(data.message || 'Failed to toggle doctor status.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend.');
    }
  };

  const handleDeleteDoctor = async (id, permanent = true) => {
    if (permanent) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/doctor/delete/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (response.ok && data.success) {
          fetchDoctors();
          setActionConfirm({ id, action: 'deleted permanently' });
          setTimeout(() => setActionConfirm(null), 2000);
        } else {
          alert(data.message || 'Failed to delete doctor.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to connect to backend.');
      }
    } else {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/doctor/update/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isAvailable: false }),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          fetchDoctors();
          setActionConfirm({ id, action: 'marked inactive' });
          setTimeout(() => setActionConfirm(null), 2000);
        } else {
          alert(data.message || 'Failed to update doctor.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to connect to backend.');
      }
    }
  };

  /* Patient Action Helpers */
  const togglePatientStatus = (id) => {
    setPatientDirList(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStatus = p.status === 'Active' ? 'Inactive' : 'Active';
          setActionConfirm({ id, action: `status changed to ${nextStatus}` });
          setTimeout(() => setActionConfirm(null), 2000);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
    setActivePatientMenu(null);
  };

  const sendPatientReminder = (patient) => {
    setActionConfirm({ id: patient.id, action: `reminder sent to ${patient.name}` });
    setTimeout(() => setActionConfirm(null), 2000);
    setActivePatientMenu(null);
  };

  const exportPatientCSV = (patient) => {
    const headers = ['Field', 'Value'];
    const rows = [
      ['ID', patient.id],
      ['Name', patient.name],
      ['Email', patient.email],
      ['Phone', patient.phone],
      ['Gender', patient.gender],
      ['DOB', patient.dob || ''],
      ['Age', patient.age ? String(patient.age) : ''],
      ['Blood Group', patient.bloodGroup || ''],
      ['Allergies', patient.allergies || ''],
      ['Emergency Contact', patient.emergencyContact || ''],
      ['Address', patient.address || ''],
      ['Status', patient.status],
      ['Total Appointments', String(patient.appointments)]
    ];

    let csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    
    if (patient.appointmentHistory && patient.appointmentHistory.length > 0) {
      csvContent += '\n\nAppointment History\nDate,Doctor,Specialty,Status\n';
      patient.appointmentHistory.forEach(appt => {
        csvContent += `"${appt.date}","${appt.doctor}","${appt.specialty}","${appt.status}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `patient_${patient.id}_record.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setActivePatientMenu(null);
  };

  const hasPatientUpcomingBookings = (patient) => {
    return patient.appointmentHistory?.some(appt => appt.status === 'Upcoming' || appt.status === 'Pending' || appt.status === 'Booked') ?? false;
  };

  const handleBookOnBehalf = (patient, appointment) => {
    setPatientDirList(prev =>
      prev.map(p => {
        if (p.id === patient.id) {
          const updatedHistory = [appointment, ...(p.appointmentHistory || [])];
          return {
            ...p,
            appointments: updatedHistory.length,
            appointmentHistory: updatedHistory
          };
        }
        return p;
      })
    );

    const timestamp = new Date().toLocaleString('en-IN');
    const logMsg = {
      id: Date.now(),
      timestamp,
      doctorName: appointment.doctor,
      doctorId: patient.id,
      action: 'Admin Booked on Behalf',
      reason: `Booked appointment for patient ${patient.name} on ${appointment.date} at ${appointment.time || 'scheduled slot'}.`
    };
    setAuditLogs(prev => [logMsg, ...prev]);

    setActionConfirm({ id: patient.id, action: `booked for ${appointment.date}` });
    setTimeout(() => setActionConfirm(null), 2000);
  };

  const handlePatientDelete = (patient, reason) => {
    setPatientDirList(prev => prev.filter(p => p.id !== patient.id));

    const timestamp = new Date().toLocaleString('en-IN');
    const logMsg = {
      id: Date.now(),
      timestamp,
      doctorName: patient.name,
      doctorId: patient.id,
      action: 'Patient Deleted (Hard Delete)',
      reason: reason || 'Admin requested permanent removal of patient record.'
    };
    setAuditLogs(prev => [logMsg, ...prev]);

    setActionConfirm({ id: patient.id, action: `deleted successfully` });
    setTimeout(() => setActionConfirm(null), 2000);
  };

  const exportAllPatientsCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Gender', 'DOB', 'Age', 'Blood Group', 'Allergies', 'Registered Date', 'Status', 'Appointments'];
    const rows = patientDirList.map(pat => [
      pat.id,
      pat.name,
      pat.email,
      pat.phone,
      pat.gender,
      pat.dob || '',
      pat.age ? String(pat.age) : '',
      pat.bloodGroup || '',
      pat.allergies || '',
      pat.registered,
      pat.status,
      String(pat.appointments)
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `all_patients_records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionConfirm({ id: 'ALL', action: 'all patient records exported' });
    setTimeout(() => setActionConfirm(null), 2000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      navigate('/');
    }
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
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddDoctor(true)}
                className="flex items-center gap-2 bg-secondary hover:bg-secondary/95 text-white text-base font-extrabold tracking-tight py-3 px-6 rounded-lg shadow-level-1 transition-all"
              >
                <UserPlus className="w-4 h-4" /> Add New Doctor
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Doctors', value: doctorsList.length },
                { label: 'Active Doctors', value: doctorsList.filter(d => d.status === 'Active').length },
                { label: 'Inactive Doctors', value: doctorsList.filter(d => d.status === 'Inactive').length },
                { label: 'Specializations', value: new Set(filteredDoctorsList.map(d => d.specialty)).size },
              ].map(s => (
                <div key={s.label} className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] p-6 shadow-level-1 relative overflow-hidden group">
                  <p className="text-base font-bold text-outline uppercase tracking-wider">{s.label}</p>
                  <p className="text-5xl font-black tracking-tight text-on-surface mt-2.5">{s.value}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary opacity-60 rounded-b-2xl" />
                </div>
              ))}
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-lg shadow-level-1 border border-[#E2E8F0] flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-outline" />
                <input type="text" placeholder="Search by name, email, or phone..." className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-[#E2E8F0] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all font-semibold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <select className="w-full md:w-48 px-4 py-3 bg-surface-container-low border border-[#E2E8F0] rounded-lg text-base text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all">
                <option>All Specialities</option>
              </select>
              <select className="w-full md:w-40 px-4 py-3 bg-surface-container-low border border-[#E2E8F0] rounded-lg text-base text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all">
                <option>Any Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <button className="flex items-center gap-2 justify-center px-6 py-3 border-2 border-[#E2E8F0] text-gray-650 hover:bg-blue-50 hover:text-secondary rounded-lg text-base font-bold transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>

            <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-50">
                  <thead className="bg-surface-container-low/60">
                    <tr>
                      {['Doctor Info', 'Specialization', 'Contact Details', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-black uppercase tracking-wider text-outline">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredDoctorsList.map(doc => (
                      <tr key={doc.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-sm font-extrabold text-slate-855 leading-tight">{doc.name}</p>
                              <p className="text-xs font-bold text-outline mt-0.5">
                                {doc.credentials || doc.qualifications || 'MBBS, MD'} • {doc.experience}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1 max-w-[140px] truncate" title={doc.specialty}>
                            <Stethoscope className="w-3 h-3 shrink-0" />
                            <span className="truncate">{doc.specialty}</span>
                          </span>
                        </td>
                        <td className="px-3 py-3.5 space-y-0.5 max-w-[160px]">
                          <p className="text-xs font-semibold text-slate-650 flex items-center gap-1 truncate" title={doc.email}>
                            <Mail className="w-3 h-3 text-outline shrink-0" />
                            <span className="truncate">{doc.email}</span>
                          </p>
                          <p className="text-xs font-semibold text-slate-650 flex items-center gap-1 truncate" title={doc.phone}>
                            <Phone className="w-3 h-3 text-outline shrink-0" />
                            <span className="truncate">{doc.phone}</span>
                          </p>
                        </td>
                        <td className="px-3 py-3.5">
                          <button
                            onClick={() => toggleDoctorStatus(doc.id)}
                            className={`text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border cursor-pointer hover:opacity-80 transition-all ${doc.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                          >
                            {doc.status}
                          </button>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex gap-1">
                            <button
                              onClick={() => setViewingDoctor(doc)}
                              className="w-7 h-7 rounded-lg border border-[#E2E8F0] text-outline hover:text-secondary hover:border-teal-200 hover:bg-teal-50 flex items-center justify-center transition-all shadow-level-1 shrink-0"
                              title="View Profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingDoctor({ ...doc })}
                              className="w-7 h-7 rounded-lg border border-[#E2E8F0] text-outline hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50 flex items-center justify-center transition-all shadow-level-1 shrink-0"
                              title="Edit Profile"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingDoctor(doc)}
                              className="w-7 h-7 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition-all shadow-level-1 shrink-0"
                              title="Delete Doctor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simulated Audit Trail Collapsible */}
            <div className="bg-surface-container-lowest p-5 rounded-lg border border-[#E2E8F0] shadow-level-1 mt-6">
              <details className="group">
                <summary className="flex justify-between items-center font-bold text-slate-850 cursor-pointer select-none">
                  <span className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-secondary" />
                    Admin Audit Trail Log ({auditLogs.length} entries)
                  </span>
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-outline" />
                </summary>
                <div className="mt-4 border-t border-gray-100 pt-4 max-h-60 overflow-y-auto space-y-3">
                  {auditLogs.length === 0 ? (
                    <p className="text-base text-outline text-center py-4 font-semibold">No audit trail entries recorded yet.</p>
                  ) : (
                    auditLogs.map(log => (
                      <div key={log.id} className="text-base flex items-start justify-between bg-surface-container-low/40 p-3 rounded-lg border border-[#E2E8F0]/30">
                        <div>
                          <p className="font-extrabold text-on-surface">
                            {log.action} — <span className="text-secondary">{log.doctorName} (ID: {log.doctorId})</span>
                          </p>
                          <p className="text-outline mt-1 font-semibold">{log.reason}</p>
                        </div>
                        <span className="text-base font-bold text-outline shrink-0 ml-4">{log.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </details>
            </div>

          </div>
        );

      /* ── PENDING REQUESTS ── */
      case 'pending':
        return (
          <div className="space-y-6 animate-fadeIn">
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
                              <button onClick={() => handleApprove(req.id)} className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-605 flex items-center justify-center transition-colors" title="Approve">
                                <Check className="w-4 h-4" strokeWidth={3} />
                              </button>
                              <button onClick={() => handleReject(req.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-505 flex items-center justify-center transition-colors" title="Reject">
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
            <div className="flex justify-end">
              <button
                type="button"
                onClick={exportAllPatientsCSV}
                className="flex items-center gap-2 bg-surface-container-lowest border border-[#E2E8F0] hover:bg-blue-50 hover:text-secondary text-gray-700 text-base font-extrabold tracking-tight py-3 px-6 rounded-lg shadow-level-1 transition-all"
              >
                <Download className="w-4 h-4" /> Export Patients
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Patients', value: 158, icon: Users, color: 'text-secondary bg-teal-50 border-teal-100', bar: 'bg-secondary' },
                { label: 'Active Patients', value: 142, icon: Activity, color: 'text-green-600 bg-green-50 border-green-100', bar: 'bg-green-500' },
                { label: 'Inactive Patients', value: 16, icon: XCircle, color: 'text-red-650 bg-red-50 border-red-100', bar: 'bg-red-500' },
                { label: 'Total Appointments', value: 324, icon: Calendar, color: 'text-purple-600 bg-purple-50 border-purple-100', bar: 'bg-purple-500' },
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
                    <p className="text-5xl font-black tracking-tight text-on-surface mt-2">{s.value}</p>
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${s.bar} opacity-60 rounded-b-2xl`} />
                  </div>
                )
              })}
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-lg shadow-level-1 border border-[#E2E8F0] flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-outline" />
                <input type="text" placeholder="Search patient..." className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-[#E2E8F0] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all font-semibold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <select className="w-full md:w-36 px-4 py-3 bg-surface-container-low border border-[#E2E8F0] rounded-lg text-base text-slate-705 font-bold focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <select className="w-full md:w-36 px-4 py-3 bg-surface-container-low border border-[#E2E8F0] rounded-lg text-base text-slate-705 font-bold focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all">
                <option>All Genders</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              <input type="date" className="w-full md:w-40 px-4 py-3 bg-surface-container-low border border-[#E2E8F0] rounded-lg text-base text-slate-705 font-bold focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all" />
              <button className="flex items-center gap-2 justify-center px-6 py-3 border-2 border-[#E2E8F0] text-gray-650 hover:bg-blue-50 hover:text-secondary rounded-lg text-base font-bold transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>

            <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-50">
                  <thead className="bg-surface-container-low/60">
                    <tr>
                      {['Patient', 'Contact Info', 'Gender', 'Registered Date', 'Appts', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-black uppercase tracking-wider text-outline">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredPatientsList.map(pat => (
                      <tr key={pat.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${initColor(pat.name)} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                              {getInitial(pat.name)}
                            </div>
                            <div>
                              <p className="text-sm font-extrabold text-slate-855 leading-tight">{pat.name}</p>
                              <p className="text-xs font-semibold text-outline mt-0.5">{pat.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 space-y-0.5 max-w-[150px]">
                          <p className="text-xs font-semibold text-slate-650 flex items-center gap-1 truncate" title={pat.email}>
                            <Mail className="w-3 h-3 text-outline shrink-0" />
                            <span className="truncate">{pat.email}</span>
                          </p>
                          <p className="text-xs font-semibold text-slate-650 flex items-center gap-1 truncate" title={pat.phone}>
                            <Phone className="w-3 h-3 text-outline shrink-0" />
                            <span className="truncate">{pat.phone}</span>
                          </p>
                        </td>
                        <td className="px-3 py-3.5 text-xs font-bold text-slate-700">{pat.gender}</td>
                        <td className="px-3 py-3.5 text-xs font-bold text-slate-700">{pat.registered}</td>
                        <td className="px-3 py-3.5 text-xs font-black text-on-surface text-center">{pat.appointments}</td>
                        <td className="px-3 py-3.5">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${pat.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {pat.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 relative">
                          <div className="flex gap-1.5 items-center">
                            <button
                              onClick={() => setViewingPatient(pat)}
                              className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] text-gray-600 hover:text-secondary hover:border-teal-200 hover:bg-teal-50 flex items-center justify-center transition-all shadow-level-1 text-xs font-extrabold tracking-tight shrink-0"
                            >
                              View
                            </button>
                            <button
                              onClick={() => setActivePatientMenu(activePatientMenu === pat.id ? null : pat.id)}
                              className="w-7 h-7 rounded-lg text-outline hover:bg-blue-50 hover:text-secondary flex items-center justify-center transition-all shrink-0"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>

                          {activePatientMenu === pat.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActivePatientMenu(null)} />
                              <div className="absolute right-5 mt-1 w-52 bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-xl py-2 z-20 text-left">
                                <button
                                  type="button"
                                  onClick={() => { setEditingPatient({ ...pat }); setActivePatientMenu(null); }}
                                  className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-secondary text-base font-semibold text-gray-700 transition-colors"
                                >
                                  Edit Details
                                </button>
                                <button
                                  type="button"
                                  onClick={() => togglePatientStatus(pat.id)}
                                  className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-secondary text-base font-semibold text-gray-700 transition-colors"
                                >
                                  Mark {pat.status === 'Active' ? 'Inactive' : 'Active'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => sendPatientReminder(pat)}
                                  className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-secondary text-base font-semibold text-gray-700 transition-colors"
                                >
                                  Send Reminder
                                </button>
                                <button
                                  type="button"
                                  onClick={() => exportPatientCSV(pat)}
                                  className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-secondary text-base font-semibold text-gray-700 transition-colors"
                                >
                                  Export Patient Data
                                </button>
                                <div className="border-t border-gray-100 my-1" />
                                <button
                                  type="button"
                                  onClick={() => { setDeletingPatient(pat); setActivePatientMenu(null); }}
                                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-655 text-base font-semibold transition-colors"
                                >
                                  Delete Patient
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}`
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="border-t border-gray-50 px-5 py-4 flex items-center justify-between">
                <p className="text-base font-bold text-outline">Showing <span className="text-on-surface">1</span> to <span className="text-on-surface">5</span> of <span className="text-on-surface">158</span> patients</p>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-outline mr-2">Rows per page: 10</span>
                  <button className="px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-base font-extrabold text-outline cursor-not-allowed">Prev</button>
                  <button className="w-8 h-8 rounded-lg bg-secondary text-on-secondary text-white text-base font-extrabold shadow-level-1">1</button>
                  <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-secondary text-base font-extrabold">2</button>
                  <button className="w-8 h-8 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-secondary text-base font-extrabold">3</button>
                  <button className="px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-base font-extrabold text-gray-650 hover:bg-blue-50 hover:text-secondary">Next</button>
                </div>
              </div>

            </div>
          </div>
        );

      /* ── REPORTS ── */
      case 'reports':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-end">
              <button onClick={() => alert('Report downloaded!')} className="flex items-center gap-2 bg-secondary hover:bg-secondary/95 text-white text-base font-extrabold tracking-tight py-3 px-6 rounded-lg shadow-level-1 transition-all">
                <Download className="w-4 h-4" /> Download Report
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Revenue This Month', value: '₹1,24,800', change: '+12%', color: 'text-green-600', bar: 'bg-green-500' },
                { label: 'Avg. Appointments/Day', value: '18', change: '+5%', color: 'text-secondary', bar: 'bg-secondary' },
                { label: 'Patient Satisfaction', value: '94%', change: '+2%', color: 'text-purple-600', bar: 'bg-purple-500' },
                { label: 'Doctor Utilization', value: '82%', change: '-3%', color: 'text-orange-500', bar: 'bg-orange-550' },
              ].map(s => (
                <div key={s.label} className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] p-6 shadow-level-1 relative overflow-hidden group">
                  <p className="text-base font-bold text-outline uppercase tracking-wider mb-2">{s.label}</p>
                  <div className="flex items-end gap-3">
                    <span className={`text-5xl font-black tracking-tight ${s.color}`}>{s.value}</span>
                    <span className={`text-base font-bold mb-1 ${s.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{s.change} vs last month</span>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${s.bar} opacity-60 rounded-b-2xl`} />
                </div>
              ))}
            </div>
          </div>
        );

      /* ── SETTINGS ── */
      case 'settings':
        return (
          <div className="max-w-2xl space-y-6 animate-fadeIn">
            <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6 space-y-5">
              {[
                { label: 'Email Notifications',      sub: 'Receive alerts for new appointments and requests', checked: true  },
                { label: 'Auto-confirm Appointments', sub: 'Automatically confirm new booking requests',       checked: false },
                { label: 'Two-Factor Authentication', sub: 'Enable 2FA for your admin account',               checked: true  },
                { label: 'Weekly Summary Email',      sub: 'Get a weekly digest of hospital activity',        checked: true  },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-base font-bold text-slate-850">{s.label}</p>
                    <p className="text-base font-semibold text-outline mt-1">{s.sub}</p>
                  </div>
                  <input type="checkbox" defaultChecked={s.checked} className="w-10 h-5 cursor-pointer rounded-full accent-secondary" />
                </div>
              ))}
            </div>
          </div>
        );

      /* ── ALL APPOINTMENTS ── */
      case 'all-appts':
        return (
          <div className="space-y-6 animate-fadeIn">
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
                    {appointmentsList.map((appt, i) => (
                      <tr key={i} className="hover:bg-blue-50/50">
                        <td className="px-5 py-4 text-base font-mono text-outline">APT-{i + 1}</td>
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
        const stats = {
          totalDoctors: doctorsList.length,
          totalPatients: patientDirList.length,
          totalAppointments: appointmentsList.length,
          pendingRequests: pendingList.length,
        };

        const pendingCount = appointmentsList.filter(a => a.status === 'Pending').length;
        const bookedCount = appointmentsList.filter(a => a.status === 'Booked').length;
        const completedCount = appointmentsList.filter(a => a.status === 'Completed').length;
        const cancelledCount = appointmentsList.filter(a => a.status === 'Cancelled').length;

        const pieData = [
          { name: 'Pending',   value: pendingCount,   color: '#F97316' },
          { name: 'Booked',    value: bookedCount,    color: '#3B82F6' },
          { name: 'Completed', value: completedCount, color: '#8B5CF6' },
          { name: 'Cancelled', value: cancelledCount,  color: '#EF4444' },
        ];

        const recentAppointments = appointmentsList.slice(0, 6);

        return <MainDashboardContent
          pendingList={pendingList}
          handleApprove={handleApprove}
          handleReject={handleReject}
          setActiveNav={setActiveNav}
          setShowAddDoctor={setShowAddDoctor}
          stats={stats}
          pieData={pieData}
          recentAppointments={recentAppointments}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex font-sans text-blue-950 overflow-x-hidden">

      {/* === MOBILE OVERLAY === */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden transition-opacity duration-300" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ===
          LIGHT SIDEBAR
      === */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface-container-lowest border-r border-[#E2E8F0] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-gray-50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                <HeartPulse className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-on-surface leading-none tracking-tight">CareWell Hospital</span>
                <span className="text-base font-bold uppercase tracking-wider text-outline mt-1.5 leading-none">Admin Dashboard</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-outline hover:text-gray-650">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-gray-50 shrink-0">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-outline" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search menu…"
                className="w-full bg-surface-container-low border border-[#E2E8F0] text-on-surface text-base pl-10 pr-3 py-2.5 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
              />
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto mt-4 px-4 space-y-1" style={{ scrollbarWidth: 'thin' }}>
            {filteredNav.map(section => (
              <div key={section.header} className="space-y-1">
                <p className="text-base font-black tracking-[0.15em] text-outline uppercase px-4 mb-2 mt-4 first:mt-0">{section.header}</p>
                <div className="space-y-1">
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const active = activeNav === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => { setActiveNav(item.key); setSidebarOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg text-base font-bold tracking-tight transition-all ${
                          active
                            ? 'bg-secondary text-on-secondary text-white shadow-level-1 shadow-blue-500/20'
                            : 'text-outline hover:bg-blue-50 hover:text-secondary'
                        }`}
                      >
                        <span className="flex items-center gap-3.5">
                          <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-outline'}`} />
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
        </div>

        {/* User Pill / Profile Section */}
        <div className="p-4 mb-4">
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-teal-400 flex items-center justify-center text-white font-black text-sm shrink-0 border border-[#E2E8F0]">
              {adminUser.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-extrabold text-on-surface leading-none truncate">{adminUser.username}</p>
              <p className="text-base font-semibold text-outline mt-1.5 truncate">{adminUser.email}</p>
            </div>
            <button onClick={handleLogout} title="Logout" className="text-outline hover:text-red-600 transition-colors shrink-0">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ===
          MAIN PANEL
      === */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen min-w-0">

        {/* ── TOP HEADER ── */}
        <header className="h-20 bg-surface-container-lowest border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-outline hover:bg-blue-50 hover:text-secondary rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-3xl font-black tracking-tight text-on-surface leading-tight">
                {activeNav === 'dashboard' ? 'Welcome back, Admin! 👋' : 
                 activeNav === 'doctors' ? 'Manage Doctors' :
                 activeNav === 'patients' ? 'Patient Directory' :
                 activeNav === 'pending' ? 'Pending Appointment Requests' :
                 activeNav === 'all-appts' ? 'All Scheduled Appointments' :
                 activeNav === 'booked' ? 'Booked Appointments' :
                 activeNav === 'completed' ? 'Completed Appointments' :
                 activeNav === 'cancelled' ? 'Cancelled Appointments' :
                 activeNav === 'reports' ? 'Reports & Analytics' : 'Account Settings'}
              </h2>
              <p className="text-base font-semibold text-outline mt-1.5">
                {activeNav === 'dashboard' && "Here's what's happening in your hospital today."}
                {activeNav === 'doctors' && 'Add, update or remove doctor profiles from the directory.'}
                {activeNav === 'patients' && 'Manage and view all registered patients.'}
                {activeNav === 'pending' && 'Review and approve patient scheduling requests.'}
                {activeNav === 'all-appts' && 'Track ongoing, completed, or cancelled doctor appointments.'}
                {activeNav === 'booked' && 'View all active booked consultations.'}
                {activeNav === 'completed' && 'View completed treatments and medical consults.'}
                {activeNav === 'cancelled' && 'View cancelled bookings and history.'}
                {activeNav === 'reports' && 'Download hospital summaries and view key metrics.'}
                {activeNav === 'settings' && 'Configure general system and email notifications.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date widget */}
            <div className="hidden lg:flex items-center gap-2 bg-surface-container-low border border-[#E2E8F0] px-4 py-2 rounded-lg">
              <Calendar className="w-4 h-4 text-secondary" />
              <span className="text-base font-bold text-slate-605">{today}</span>
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2.5 bg-surface-container-low hover:bg-blue-50 hover:text-secondary rounded-full transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-base font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">8</span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-xl py-3 z-50">
                  <div className="px-4 pb-2 border-b border-gray-50 flex justify-between items-center">
                    <span className="text-base font-black uppercase tracking-wider text-outline">Notifications</span>
                    <button onClick={() => setNotifOpen(false)} className="text-base font-bold text-secondary hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 mt-1">
                    {['New appointment request from Ravi Shankar', 'Dr. Neha Kapoor updated availability', 'Monthly report is ready to download', '5 pending requests awaiting review'].map((n, i) => (
                      <div key={i} className="px-4 py-3 flex flex-col gap-0.5 hover:bg-blue-50 hover:text-secondary transition-colors">
                        <p className="text-base font-semibold text-slate-700 leading-normal">{n}</p>
                        <p className="text-base font-bold text-outline mt-1">{i + 1}h ago</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin profile */}
            <div className="relative">
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                className="flex items-center gap-3 p-1.5 pr-3 hover:bg-blue-50 hover:text-secondary rounded-full transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-teal-400 text-white font-black text-sm flex items-center justify-center border border-[#E2E8F0]">
                  {adminUser.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-base font-extrabold text-on-surface leading-none">{adminUser.username}</span>
                  <span className="text-base font-bold uppercase tracking-wider text-outline mt-0.5">Admin</span>
                </div>
                <ChevronDown className="w-4 h-4 text-outline" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-xl py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-50 flex flex-col">
                    <p className="text-base font-extrabold text-on-surface leading-none">{adminUser.username}</p>
                    <p className="text-base font-semibold text-outline mt-1.5 truncate">{adminUser.email}</p>
                  </div>
                  {[{ label: 'Settings', icon: Settings, key: 'settings' }].map(item => (
                    <button key={item.key} onClick={() => { setActiveNav(item.key); setProfileOpen(false); }} className="w-full text-left px-4 py-2.5 text-base text-gray-750 hover:bg-blue-50 hover:text-secondary flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-outline" /> {item.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-50 my-1">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-base text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <LogOut className="w-4 h-4 text-red-500" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── WORKSPACE ── */}
        <main className="flex-1 p-4 sm:p-8 min-w-0 overflow-hidden max-w-full">
          {renderContent()}
        </main>
      </div>

      {/* === ACTION CONFIRM TOAST === */}
      {actionConfirm && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-xl text-white text-base font-semibold animate-scaleUp ${actionConfirm.action === 'approved' ? 'bg-green-500' : 'bg-red-500'}`}>
          {actionConfirm.action === 'approved' ? <Check className="w-5 h-5" strokeWidth={3} /> : <X className="w-5 h-5" strokeWidth={3} />}
          Request {actionConfirm.action} successfully!
        </div>
      )}

      {/* === ADD DOCTOR MODAL === */}
      {showAddDoctor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-lg shadow-2xl p-6 animate-scaleUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-on-surface text-lg">Add New Doctor</h3>
              <button onClick={() => setShowAddDoctor(false)} className="text-outline hover:text-gray-605">
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
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-3 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddDoctor(false)} className="flex-1 border border-[#E2E8F0] text-outline text-base font-semibold py-3 rounded-lg hover:bg-blue-50 hover:text-secondary transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-secondary hover:bg-secondary/95 text-white text-base font-bold py-3 rounded-lg shadow-level-1 transition-colors">Add Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === VIEW DOCTOR MODAL === */}
      {viewingDoctor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-lg shadow-2xl p-6 animate-scaleUp overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h3 className="font-bold text-on-surface text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-secondary" /> Doctor Profile Detail
              </h3>
              <button onClick={() => setViewingDoctor(null)} className="text-outline hover:text-gray-605">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Doctor Header card */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-cyan-50/80 text-[#14b8a6] border border-cyan-100/50 text-2xl font-black flex items-center justify-center shrink-0">
                  {getInitial(viewingDoctor.name)}
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-lg font-black text-on-surface">{viewingDoctor.name}</h4>
                  <p className="text-base font-bold text-secondary">{viewingDoctor.credentials || viewingDoctor.qualifications || 'MBBS, MD'}</p>
                  <p className="text-base font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-sm mt-1 inline-block">
                    {viewingDoctor.specialty}
                  </p>
                </div>
              </div>

              {/* Grid detail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Experience', value: viewingDoctor.experience },
                  { label: 'Assigned Ward / OPD', value: viewingDoctor.ward || 'General OPD' },
                  { label: 'Availability Schedule', value: Array.isArray(viewingDoctor.slots) ? viewingDoctor.slots.join(', ') : (viewingDoctor.schedule || 'Mon-Fri (9:00 AM - 5:00 PM)') },
                  { label: 'Current Status', value: viewingDoctor.status, highlight: true }
                ].map(item => (
                  <div key={item.label} className="bg-surface-container-low/40 p-3 rounded-lg border border-[#E2E8F0]/30">
                    <span className="text-base font-bold text-outline uppercase tracking-wider">{item.label}</span>
                    <p className={`text-base font-extrabold text-on-surface mt-1 ${item.highlight ? (item.value === 'Active' ? 'text-green-600' : 'text-red-500') : ''}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <h5 className="text-base font-black text-slate-805 uppercase tracking-wider">Contact Information</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-surface-container-low/40 p-3 rounded-lg border border-[#E2E8F0]/30 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-outline" />
                    <div>
                      <span className="text-base font-semibold text-outline">Email Address</span>
                      <p className="text-base font-extrabold text-slate-700">{viewingDoctor.email}</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low/40 p-3 rounded-lg border border-[#E2E8F0]/30 flex items-center gap-3">
                    <Phone className="w-4 h-4 text-outline" />
                    <div>
                      <span className="text-base font-semibold text-outline">Phone Number</span>
                      <p className="text-base font-extrabold text-slate-700">{viewingDoctor.phone || '+91 9876543210'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment History */}
              <div className="space-y-2">
                <h5 className="text-base font-black text-slate-805 uppercase tracking-wider">Appointment History</h5>
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-50">
                    <thead className="bg-surface-container-low/60">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-base font-black uppercase text-outline">Patient</th>
                        <th className="px-4 py-2.5 text-left text-base font-black uppercase text-outline">Date & Time</th>
                        <th className="px-4 py-2.5 text-left text-base font-black uppercase text-outline">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                      {!viewingDoctor.appointments || viewingDoctor.appointments.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-6 text-center text-base text-outline font-semibold">No appointments found for this doctor.</td>
                        </tr>
                      ) : (
                        viewingDoctor.appointments.map((appt, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/20">
                            <td className="px-4 py-2.5 text-base font-bold text-on-surface">{appt.patient}</td>
                            <td className="px-4 py-2.5 text-base text-outline">{appt.date} ({appt.time})</td>
                            <td className="px-4 py-2.5"><StatusBadge status={appt.status} /></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={() => setViewingDoctor(null)}
                className="bg-secondary hover:bg-secondary/95 text-white text-base font-bold py-2.5 px-6 rounded-lg shadow-level-1 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === EDIT DOCTOR MODAL === */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-lg shadow-2xl p-6 animate-scaleUp overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h3 className="font-bold text-on-surface text-lg flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-secondary" /> Edit Doctor Profile
              </h3>
              <button onClick={() => setEditingDoctor(null)} className="text-outline hover:text-gray-655">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingDoctor.name.trim() || !editingDoctor.specialty.trim()) {
                  alert('Name and Specialization are required!');
                  return;
                }
                try {
                  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/doctor/update/${editingDoctor.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      name: editingDoctor.name,
                      specialization: editingDoctor.specialty,
                      qualification: editingDoctor.qualification || "MBBS, MD",
                      experience: Number(editingDoctor.experience.replace(/[^0-9]/g, '')) || 5,
                      consultationFee: editingDoctor.consultationFee || 500,
                      email: editingDoctor.email,
                      phone: editingDoctor.phone,
                      hospital: editingDoctor.hospital || "CareWell Hospital",
                      about: editingDoctor.about || ""
                    }),
                  });
                  const data = await response.json();
                  if (response.ok && data.success) {
                    fetchDoctors();
                    setActionConfirm({ id: editingDoctor.id, action: 'updated' });
                    setTimeout(() => setActionConfirm(null), 2000);
                    setEditingDoctor(null);
                  } else {
                    alert(data.message || 'Failed to update doctor.');
                  }
                } catch (err) {
                  console.error(err);
                  alert('Failed to connect to backend.');
                }
              }}
              className="space-y-4"
            >
              {/* Profile Photo Mock Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-cyan-50/80 text-[#14b8a6] border border-cyan-100/50 text-2xl font-black flex items-center justify-center shrink-0">
                  {getInitial(editingDoctor.name)}
                </div>
                <div className="text-center sm:text-left flex-1 space-y-2">
                  <label className="text-base font-bold text-outline uppercase tracking-wider block">Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditingDoctor({ ...editingDoctor, photo: file.name, image: URL.createObjectURL(file) });
                        alert(`Photo "${file.name}" uploaded successfully (Simulated).`);
                      }
                    }}
                    className="text-base text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-secondary hover:file:bg-blue-100 cursor-pointer"
                  />
                  {editingDoctor.photo && (
                    <p className="text-base font-semibold text-green-605 mt-1">Uploaded: {editingDoctor.photo}</p>
                  )}
                </div>
              </div>

              {/* Name & Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-base font-bold text-outline uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={editingDoctor.name}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                    required
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-bold text-outline uppercase tracking-wider">Credentials</label>
                  <input
                    type="text"
                    value={editingDoctor.credentials || editingDoctor.qualifications || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, credentials: e.target.value, qualifications: e.target.value })}
                    placeholder="e.g. MBBS, MD, DM"
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              {/* Specialization & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-base font-bold text-outline uppercase tracking-wider">Specialization</label>
                  <input
                    type="text"
                    value={editingDoctor.specialty}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value, specialization: e.target.value })}
                    required
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-bold text-outline uppercase tracking-wider">Experience</label>
                  <input
                    type="text"
                    value={editingDoctor.experience}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, experience: e.target.value })}
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-base font-bold text-outline uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={editingDoctor.email}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, email: e.target.value })}
                    required
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-bold text-outline uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    value={editingDoctor.phone || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, phone: e.target.value })}
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              {/* Availability & Assigned Ward */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-base font-bold text-outline uppercase tracking-wider">Availability Schedule</label>
                  <input
                    type="text"
                    value={Array.isArray(editingDoctor.slots) ? editingDoctor.slots.join(', ') : (editingDoctor.schedule || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (Array.isArray(editingDoctor.slots)) {
                        setEditingDoctor({ ...editingDoctor, slots: val.split(',').map(s => s.trim()) });
                      } else {
                        setEditingDoctor({ ...editingDoctor, schedule: val });
                      }
                    }}
                    placeholder="e.g. 10:00 AM, 11:30 AM"
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-bold text-outline uppercase tracking-wider">Assigned Ward / OPD</label>
                  <input
                    type="text"
                    value={editingDoctor.ward || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, ward: e.target.value })}
                    placeholder="e.g. Ward 4B, Room 102"
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              {/* Active/Inactive Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="text-base font-bold text-slate-850">Doctor Availability Status</p>
                  <p className="text-base font-semibold text-outline mt-1">If inactive, doctor will be hidden from booking flows</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingDoctor({ ...editingDoctor, status: editingDoctor.status === 'Active' ? 'Inactive' : 'Active' })}
                  className={`px-4 py-2 rounded-lg text-base font-extrabold border transition-colors ${editingDoctor.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                >
                  {editingDoctor.status === 'Active' ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Submit / Cancel buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="flex-1 border border-[#E2E8F0] text-outline text-base font-semibold py-3 rounded-lg hover:bg-blue-50 hover:text-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-secondary hover:bg-secondary/95 text-white text-base font-bold py-3 rounded-lg shadow-level-1 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === DELETE DOCTOR MODAL === */}
      {deletingDoctor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-lg shadow-2xl p-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertCircle className="w-8 h-8" />
              <h3 className="font-bold text-on-surface text-lg">Confirm Action Required</h3>
            </div>

            {hasUpcomingBookings(deletingDoctor) ? (
              <div className="space-y-4">
                <p className="text-base text-slate-707 font-semibold leading-normal">
                  Warning: <span className="font-extrabold text-on-surface">{deletingDoctor.name}</span> has upcoming pending or booked appointments.
                </p>
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-base text-red-755 font-semibold">
                  <strong>Hard Delete Blocked:</strong> Permanent removal is blocked to prevent disruptions in patient scheduling.
                </div>
                <p className="text-base text-outline">
                  Would you like to mark this doctor as <strong className="text-red-650">Inactive</strong> instead? This will hide the profile from booking flows but preserve upcoming appointments.
                </p>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setDeletingDoctor(null)}
                    className="flex-1 border border-[#E2E8F0] text-outline text-base font-semibold py-2.5 rounded-lg hover:bg-blue-50 hover:text-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteDoctor(deletingDoctor.id, false);
                      logDeleteAction(deletingDoctor, false, 'Blocked hard delete due to upcoming appointments; auto-marked as Inactive.');
                      setDeletingDoctor(null);
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-650 text-white text-base font-bold py-2.5 rounded-lg shadow-level-1 transition-colors"
                  >
                    Mark Inactive
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-base text-slate-707 font-semibold">
                  Are you sure you want to delete <span className="font-extrabold text-on-surface">{deletingDoctor.name}</span>?
                </p>
                <p className="text-base text-outline">
                  No upcoming appointments are scheduled for this doctor. You can choose to permanently remove the profile, or mark it as inactive to archive the data.
                </p>
 
                <div className="flex flex-col gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteDoctor(deletingDoctor.id, false);
                      logDeleteAction(deletingDoctor, false, 'Admin chose soft delete (archived/marked inactive) over permanent removal.');
                      setDeletingDoctor(null);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white text-base font-bold py-2.5 rounded-lg shadow-level-1 transition-all"
                  >
                    Mark Inactive (Soft Delete)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteDoctor(deletingDoctor.id, true);
                      logDeleteAction(deletingDoctor, true, 'Admin requested permanent removal; doctor has no linked appointments.');
                      setDeletingDoctor(null);
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-base font-bold py-2.5 rounded-lg shadow-level-1 transition-all"
                  >
                    Delete Permanently (Hard Delete)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingDoctor(null)}
                    className="w-full border border-[#E2E8F0] text-outline text-base font-semibold py-2.5 rounded-lg hover:bg-blue-50 hover:text-secondary transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* === VIEW PATIENT MODAL === */}
      {viewingPatient && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-3xl rounded-lg shadow-2xl p-6 animate-scaleUp overflow-y-auto max-h-[90vh] space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-on-surface text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" /> Patient Profile Detail
              </h3>
              <button onClick={() => setViewingPatient(null)} className="text-outline hover:text-gray-655">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Header */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className={`w-16 h-16 rounded-full ${initColor(viewingPatient.name)} text-white text-2xl font-black flex items-center justify-center shrink-0`}>
                {getInitial(viewingPatient.name)}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h4 className="text-lg font-black text-on-surface">{viewingPatient.name}</h4>
                <p className="text-sm font-semibold text-outline mt-0.5">Patient ID: {viewingPatient.id}</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start items-center">
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-sm">{viewingPatient.gender}</span>
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm">Age: {viewingPatient.age} ({viewingPatient.dob})</span>
                  <span className={`text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${viewingPatient.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{viewingPatient.status}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Personal Details */}
            <div className="space-y-2">
              <h5 className="text-base font-black text-slate-805 uppercase tracking-wider">Contact & Personal Details</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container-low/40 p-3 rounded-lg border border-[#E2E8F0]/30 space-y-1.5 text-base">
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-outline shrink-0" /><span className="font-semibold text-slate-600">Email:</span> <span className="font-bold text-slate-800">{viewingPatient.email}</span></p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-outline shrink-0" /><span className="font-semibold text-slate-600">Phone:</span> <span className="font-bold text-slate-800">{viewingPatient.phone}</span></p>
                  <p className="flex items-start gap-2"><FileText className="w-4 h-4 text-outline shrink-0 mt-0.5" /><span className="font-semibold text-slate-600">Address:</span> <span className="font-bold text-slate-800 leading-normal">{viewingPatient.address || 'N/A'}</span></p>
                </div>
                <div className="bg-surface-container-low/40 p-3 rounded-lg border border-[#E2E8F0]/30 space-y-1.5 text-base">
                  <p className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-outline shrink-0" /><span className="font-semibold text-slate-600">Emergency Contact:</span> <span className="font-bold text-slate-800">{viewingPatient.emergencyContact || 'N/A'}</span></p>
                  <p className="flex items-center gap-2"><Activity className="w-4 h-4 text-outline shrink-0" /><span className="font-semibold text-slate-600">Blood Group:</span> <span className="font-bold text-red-600">{viewingPatient.bloodGroup || 'N/A'}</span></p>
                  <p className="flex items-center gap-2"><HeartPulse className="w-4 h-4 text-outline shrink-0" /><span className="font-semibold text-slate-600">Allergies:</span> <span className="font-bold text-amber-650">{viewingPatient.allergies || 'None'}</span></p>
                </div>
              </div>
            </div>

            {/* Section 3: Appointment History */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h5 className="text-base font-black text-slate-805 uppercase tracking-wider">Appointment History (Total: {viewingPatient.appointmentHistory?.length || 0})</h5>
                <button
                  type="button"
                  onClick={() => setBookingPatient(viewingPatient)}
                  className="flex items-center gap-1.5 bg-secondary hover:bg-secondary/95 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg shadow-level-1 transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Appointment
                </button>
              </div>
              <div className="border border-slate-100 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-50">
                  <thead className="bg-surface-container-low/60 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-black uppercase text-outline">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-black uppercase text-outline">Doctor</th>
                      <th className="px-4 py-2 text-left text-xs font-black uppercase text-outline">Specialty</th>
                      <th className="px-4 py-2 text-left text-xs font-black uppercase text-outline">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {!viewingPatient.appointmentHistory || viewingPatient.appointmentHistory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-sm text-outline font-semibold">No appointments scheduled yet.</td>
                      </tr>
                    ) : (
                      viewingPatient.appointmentHistory.map((appt, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/20 text-sm">
                          <td className="px-4 py-2 font-semibold text-slate-700">{appt.date}</td>
                          <td className="px-4 py-2 font-bold text-slate-800">{appt.doctor}</td>
                          <td className="px-4 py-2 text-slate-650">{appt.specialty}</td>
                          <td className="px-4 py-2">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                              appt.status === 'Completed' ? 'bg-purple-105 text-purple-700' :
                              appt.status === 'Cancelled' ? 'bg-red-105 text-red-650' : 'bg-orange-105 text-orange-600'
                            }`}>
                              {appt.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Medical Notes (Read-Only) */}
            <div className="space-y-2">
              <h5 className="text-base font-black text-slate-805 uppercase tracking-wider">Medical Records & Diagnosis (Read-Only)</h5>
              <div className="bg-surface-container-low/40 p-4 rounded-lg border border-[#E2E8F0]/30 space-y-3 text-base">
                <div>
                  <span className="font-bold text-slate-700 uppercase text-xs tracking-wider block">Diagnosis History</span>
                  <p className="text-slate-800 font-semibold mt-1 bg-white p-2 rounded border border-gray-50 leading-relaxed">{viewingPatient.medicalNotes?.diagnosis || 'No diagnoses recorded.'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 uppercase text-xs tracking-wider block">Physician Notes</span>
                  <p className="text-slate-800 font-semibold mt-1 bg-white p-2 rounded border border-gray-50 leading-relaxed">{viewingPatient.medicalNotes?.doctorNotes || 'No physician notes available.'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 uppercase text-xs tracking-wider block">Uploaded Prescriptions / Reports</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {!viewingPatient.medicalNotes?.reports || viewingPatient.medicalNotes.reports.length === 0 ? (
                      <span className="text-xs text-outline font-semibold">No documents uploaded.</span>
                    ) : (
                      viewingPatient.medicalNotes.reports.map((rep, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-xs font-bold text-secondary bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full cursor-not-allowed">
                          <FileText className="w-3 h-3" /> {rep}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewingPatient(null)}
                className="bg-secondary hover:bg-secondary/95 text-white text-base font-bold py-2.5 px-6 rounded-lg shadow-level-1 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === BOOK ON BEHALF OF PATIENT MODAL === */}
      {bookingPatient && (
        <div className="fixed inset-0 z-55 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-lg shadow-2xl p-6 animate-scaleUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-on-surface text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" /> Schedule Appointment
              </h3>
              <button onClick={() => setBookingPatient(null)} className="text-outline hover:text-gray-655">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const docVal = e.target.doctor.value;
                const dateVal = e.target.date.value;
                const slotVal = e.target.slot.value;
                if (!docVal || !dateVal || !slotVal) {
                  alert('All fields are required!');
                  return;
                }
                const chosenDocObj = doctorsList.find(d => d.name === docVal);
                const appt = {
                  date: dateVal,
                  doctor: docVal,
                  specialty: chosenDocObj ? chosenDocObj.specialty : 'General Physician',
                  status: 'Pending',
                  time: slotVal
                };

                handleBookOnBehalf(bookingPatient, appt);

                if (viewingPatient && viewingPatient.id === bookingPatient.id) {
                  setViewingPatient(prev => ({
                    ...prev,
                    appointments: prev.appointments + 1,
                    appointmentHistory: [appt, ...prev.appointmentHistory]
                  }));
                }

                setBookingPatient(null);
              }}
              className="space-y-4"
            >
              <div>
                <p className="text-base text-slate-700 font-semibold mb-2">
                  Scheduling Consultation for: <strong className="text-on-surface">{bookingPatient.name}</strong>
                </p>
              </div>

              {/* Select Doctor */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider block">Assign Doctor</label>
                <select
                  name="doctor"
                  required
                  className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                >
                  <option value="">Select a Doctor...</option>
                  {doctorsList.filter(d => d.status === 'Active').map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider block">Appointment Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                />
              </div>

              {/* Time Slot */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-outline uppercase tracking-wider block">Preferred Time Slot</label>
                <select
                  name="slot"
                  required
                  className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                >
                  <option value="">Select Slot...</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setBookingPatient(null)} className="flex-1 border border-[#E2E8F0] text-outline text-base font-semibold py-2.5 rounded-lg hover:bg-blue-50 hover:text-secondary transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-secondary hover:bg-secondary/95 text-white text-base font-bold py-2.5 rounded-lg shadow-level-1 transition-colors">Book Now</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === EDIT PATIENT DETAILS MODAL === */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-lg shadow-2xl p-6 animate-scaleUp overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h3 className="font-bold text-on-surface text-lg flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-secondary" /> Edit Patient Information
              </h3>
              <button onClick={() => setEditingPatient(null)} className="text-outline hover:text-gray-655">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editingPatient.name.trim() || !editingPatient.email.trim() || !editingPatient.phone.trim()) {
                  alert('Name, Email, and Phone are required!');
                  return;
                }

                setPatientDirList(prev => prev.map(p => p.id === editingPatient.id ? { ...editingPatient } : p));
                setActionConfirm({ id: editingPatient.id, action: 'updated successfully' });
                setTimeout(() => setActionConfirm(null), 2000);
                setEditingPatient(null);
              }}
              className="space-y-4"
            >
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    value={editingPatient.name}
                    onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                    required
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider block">Gender</label>
                  <select
                    value={editingPatient.gender}
                    onChange={(e) => setEditingPatient({ ...editingPatient, gender: e.target.value })}
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    value={editingPatient.email}
                    onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
                    required
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="text"
                    value={editingPatient.phone}
                    onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                    required
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              {/* DOB / Age / Blood Group / Allergies */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider block">DOB (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={editingPatient.dob || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const birthYear = new Date(val).getFullYear();
                      const currentYear = new Date().getFullYear();
                      setEditingPatient({
                        ...editingPatient,
                        dob: val,
                        age: isNaN(birthYear) ? editingPatient.age : (currentYear - birthYear)
                      });
                    }}
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider block">Blood Group</label>
                  <input
                    type="text"
                    value={editingPatient.bloodGroup || ''}
                    onChange={(e) => setEditingPatient({ ...editingPatient, bloodGroup: e.target.value })}
                    placeholder="e.g. O+"
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider block">Allergies</label>
                  <input
                    type="text"
                    value={editingPatient.allergies || ''}
                    onChange={(e) => setEditingPatient({ ...editingPatient, allergies: e.target.value })}
                    placeholder="e.g. Dust, Latex"
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              {/* Emergency Contact & Address */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider block">Emergency Contact</label>
                  <input
                    type="text"
                    value={editingPatient.emergencyContact || ''}
                    onChange={(e) => setEditingPatient({ ...editingPatient, emergencyContact: e.target.value })}
                    placeholder="Name (+91 Phone) - Relation"
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider block">Home Address</label>
                  <textarea
                    rows={2}
                    value={editingPatient.address || ''}
                    onChange={(e) => setEditingPatient({ ...editingPatient, address: e.target.value })}
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="flex-1 border border-[#E2E8F0] text-outline text-base font-semibold py-3 rounded-lg hover:bg-blue-50 hover:text-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-secondary hover:bg-secondary/95 text-white text-base font-bold py-3 rounded-lg shadow-level-1 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === DELETE PATIENT MODAL === */}
      {deletingPatient && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-lg shadow-2xl p-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertCircle className="w-8 h-8" />
              <h3 className="font-bold text-on-surface text-lg">Confirm Action Required</h3>
            </div>

            {hasPatientUpcomingBookings(deletingPatient) ? (
              <div className="space-y-4">
                <p className="text-base text-slate-707 font-semibold leading-normal">
                  Warning: <span className="font-extrabold text-on-surface">{deletingPatient.name}</span> has upcoming active consultations scheduled.
                </p>
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-base text-red-755 font-semibold">
                  <strong>Deletion Blocked:</strong> Cannot delete patient files with active/upcoming consultations. Please cancel appointments first.
                </div>
                <p className="text-base text-outline">
                  Alternatively, you can toggle the patient status to <strong className="text-red-650">Inactive</strong> using the row menu to pause booking eligibility.
                </p>
                <div className="flex pt-2">
                  <button
                    type="button"
                    onClick={() => setDeletingPatient(null)}
                    className="w-full bg-secondary hover:bg-secondary/95 text-white text-base font-bold py-2.5 rounded-lg shadow-level-1 transition-colors"
                  >
                    Acknowledged
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-base text-slate-707 font-semibold">
                  Are you sure you want to permanently delete patient file <span className="font-extrabold text-on-surface">{deletingPatient.name}</span>?
                </p>
                <p className="text-base text-outline">
                  This action is permanent and cannot be undone. All clinical histories and registrations associated with this patient will be removed.
                </p>
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setDeletingPatient(null)}
                    className="flex-1 border border-[#E2E8F0] text-outline text-base font-semibold py-2.5 rounded-lg hover:bg-blue-50 hover:text-secondary transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handlePatientDelete(deletingPatient, 'Admin requested permanent deletion; patient has no upcoming consultations.');
                      setDeletingPatient(null);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-base font-bold py-2.5 rounded-lg shadow-level-1 transition-all"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MainDashboardContent = ({ pendingList, handleApprove, handleReject, setActiveNav, setShowAddDoctor, stats, pieData, recentAppointments }) => {
  const totalAppts = pieData.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-7 animate-fadeIn">

      {/* ── METRIC CARDS ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Total Doctors',       value: stats.totalDoctors,       icon: Stethoscope,   color: 'bg-blue-50   text-secondary',   bar: 'bg-secondary',      nav: 'doctors'   },
          { label: 'Total Patients',      value: stats.totalPatients,      icon: Users,          color: 'bg-green-50  text-green-605',   bar: 'bg-green-500',      nav: 'patients'  },
          { label: 'Total Appointments',  value: stats.totalAppointments,  icon: Calendar,       color: 'bg-purple-50 text-purple-650',  bar: 'bg-purple-500',     nav: 'all-appts' },
          { label: 'Pending Requests',    value: stats.pendingRequests,    icon: AlertCircle,    color: 'bg-orange-50 text-orange-600',  bar: 'bg-orange-500',     nav: 'pending'   },
        ].map(card => {
          const Icon = card.icon;
          const textCol = card.color.split(' ')[1];
          return (
            <div key={card.label} className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6 flex flex-col justify-between min-h-36 relative overflow-hidden group hover:shadow-level-1 transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-base font-bold text-outline uppercase tracking-wider">{card.label}</span>
                  <h3 className="text-5xl font-black text-on-surface mt-2.5 tracking-tight tabular-nums">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${card.color.split(' ')[0]}`}>
                  <Icon className="w-6 h-6 text-slate-700" />
                </div>
              </div>
              <button
                onClick={() => setActiveNav(card.nav)}
                className={`text-base font-extrabold ${textCol} hover:underline inline-flex items-center gap-1.5 self-start mt-4 tracking-tight`}
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className={`absolute bottom-0 right-0 w-24 h-1 ${card.bar} opacity-60 rounded-tl-full`} />
            </div>
          );
        })}
      </div>

      {/* ── QUICK ACTIONS PANEL ── */}
      <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6">
        <h3 className="text-lg font-extrabold tracking-tight text-on-surface mb-5">Quick Administrator Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Add New Doctor',    desc: 'Create profiles',      icon: UserPlus,      bg: 'bg-teal-55 text-secondary border-teal-100',   action: () => setShowAddDoctor(true)          },
            { label: 'Manage Doctors',    desc: 'View active staff',    icon: Stethoscope,   bg: 'bg-green-55 text-green-655 border-green-100',  action: () => setActiveNav('doctors')         },
            { label: 'All Appointments',  desc: 'View scheduling',      icon: ClipboardList, bg: 'bg-purple-55 text-purple-650 border-purple-100', action: () => setActiveNav('all-appts')       },
            { label: 'Generate Reports',  desc: 'Analytics & metrics',  icon: BarChart2,     bg: 'bg-orange-55 text-orange-605 border-orange-100', action: () => setActiveNav('reports')         },
          ].map(qa => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.label}
                onClick={qa.action}
                className={`text-left border rounded-lg p-4 flex gap-4 transition-all hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md ${qa.bg.split(' ')[2]} ${qa.bg.split(' ')[0]}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${qa.bg.split(' ')[1]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-extrabold text-on-surface truncate">{qa.label}</h4>
                  <p className="text-base font-semibold text-outline truncate mt-0.5">{qa.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PENDING REQUESTS PANEL ── */}
      <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6 space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-on-surface">Pending Requests</h3>
            <p className="text-base font-semibold text-outline mt-0.5">Approve or cancel doctor consultation bookings</p>
          </div>
          {pendingList.length > 0 && (
            <span className="bg-orange-100 text-orange-600 text-base font-extrabold px-3 py-1 rounded-full">{pendingList.length} Pending</span>
          )}
        </div>

        {pendingList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-150 rounded-lg">
            <CheckCircle className="w-10 h-10 text-green-500 mb-3" />
            <h4 className="text-base font-extrabold text-on-surface">All caught up!</h4>
            <p className="text-base font-semibold text-outline mt-0.5">No pending appointment requests need review.</p>
          </div>
        ) : (
          <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-surface-container-low/60">
                <tr>
                  {['Patient', 'Consulting Doctor', 'Date/Time', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-base font-black uppercase tracking-wider text-outline">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-surface-container-lowest">
                {pendingList.map(req => (
                  <tr key={req.id} className="hover:bg-blue-50/20">
                    <td className="px-5 py-4">
                      <p className="text-base font-bold text-on-surface leading-none">{req.patient}</p>
                      <p className="text-base font-semibold text-outline mt-1">{req.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-base font-bold text-slate-850 leading-none">{req.doctor}</p>
                      <p className="text-base font-semibold text-outline mt-1">{req.specialty}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-base font-bold text-on-surface leading-none">{req.date}</p>
                      <p className="text-base font-semibold text-outline mt-1">{req.time}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(req.id)} className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 text-green-605 flex items-center justify-center transition-colors" title="Approve">
                          <Check className="w-4 h-4" strokeWidth={3} />
                        </button>
                        <button onClick={() => handleReject(req.id)} className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-505 flex items-center justify-center transition-colors" title="Reject">
                          <X className="w-4 h-4" strokeWidth={3} />
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

      {/* ── BOTTOM ROW: 2 COLUMNS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Column 1: Recent Appointments */}
        <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-extrabold tracking-tight text-on-surface">Recent Appointments</h3>
            <button onClick={() => setActiveNav('all-appts')} className="text-base font-extrabold text-secondary hover:underline flex items-center gap-0.5">
              See all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentAppointments.map((appt, i) => (
              <div key={i} className="px-5 py-3.5 flex justify-between items-center hover:bg-blue-50 hover:text-secondary transition-colors">
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
              <div key={i} className="px-5 py-3.5 flex items-center gap-3 hover:bg-blue-50 hover:text-secondary transition-colors">
                <span className={`text-base font-black w-5 ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-outline' : 'text-orange-600'}`}>
                  #{i + 1}
                </span>
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

      </div>

      {/* ── Appointments Overview (Flywheel Section) ── */}
      <div className="bg-surface-container-lowest rounded-lg border border-[#E2E8F0] shadow-level-1 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/4 space-y-1 text-center md:text-left">
            <h3 className="text-lg font-extrabold tracking-tight text-on-surface">Appointments Overview</h3>
            <p className="text-base text-outline font-semibold">Distribution by current status</p>
          </div>
          
          <div className="flex-1 w-full max-w-[280px] h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="none" />
                  ))}
                  <CentreLabel cx="50%" cy="50%" total={totalAppts} />
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  formatter={(value, name) => [`${value} (${totalAppts > 0 ? Math.round(value / totalAppts * 100) : 0}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="w-full md:w-1/2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {pieData.map(entry => (
              <div key={entry.name} className="flex items-center gap-2 bg-surface-container-low/60 rounded-lg px-3 py-2 border border-[#E2E8F0]/40">
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
  );
};

export default AdminDashboard;
