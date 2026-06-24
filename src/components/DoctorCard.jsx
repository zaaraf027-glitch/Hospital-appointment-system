import React from 'react';
import { Star, Clock, MapPin, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col">
      <div className="p-5 flex gap-4">
        <div className="relative shrink-0">
          <img 
            src={doctor.image} 
            alt={doctor.name} 
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-50"
          />
          <span className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white" title="Available Today"></span>
        </div>
        <div>
          <h3 className="font-bold text-lg text-blue-950">{doctor.name}</h3>
          <div className="flex items-center gap-1 text-teal-600 mb-1">
            <Stethoscope className="w-4 h-4" />
            <span className="text-sm font-medium">{doctor.specialization}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
            <Clock className="w-4 h-4" />
            <span>{doctor.experience} Experience</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">{doctor.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="truncate max-w-[120px]" title={doctor.hospital}>{doctor.hospital}</span>
          </div>
          <div className="font-bold text-blue-900">
            {doctor.fee}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/doctor/${doctor.id}`)}
            className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-md font-medium text-sm hover:bg-blue-50 transition-colors"
          >
            View Profile
          </button>
          <button 
            onClick={() => navigate(`/book/${doctor.id}`)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
