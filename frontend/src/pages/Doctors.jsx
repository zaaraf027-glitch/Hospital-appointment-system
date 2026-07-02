import { useState } from 'react';
import { Search, Filter, Stethoscope } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import { doctors } from '../data/doctors';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // Extract unique specialties from doctors data
  const specialties = ['All', ...new Set(doctors.map(doc => doc.specialization))];

  // Filter doctors based on search term and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-[#f5faff] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-950 mb-4">Find the Right Doctor for You</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Browse through our extensive list of highly qualified specialists and book an appointment today.</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 bg-gray-50"
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="md:w-64 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 bg-gray-50 appearance-none"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map((specialty, index) => (
                <option key={index} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Chips (Optional quick filters) */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {specialties.slice(1, 6).map((specialty, index) => (
            <button
              key={index}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedSpecialty === specialty 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              {specialty}
            </button>
          ))}
          {selectedSpecialty !== 'All' && (
            <button
              onClick={() => setSelectedSpecialty('All')}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Results Section */}
        <div className="mb-6 flex justify-between items-center text-gray-600">
          <span className="font-medium">Showing {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}</span>
        </div>

        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No doctors found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find any doctors matching "{searchTerm}" {selectedSpecialty !== 'All' ? `in ${selectedSpecialty}` : ''}. Try adjusting your search criteria.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('All');
              }}
              className="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Doctors;
