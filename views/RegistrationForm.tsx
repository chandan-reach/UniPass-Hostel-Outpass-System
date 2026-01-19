
import React, { useState } from 'react';
import { StudentRegistration, RegistrationStatus } from '../types';

interface RegistrationFormProps {
  onBack: () => void;
  onSubmit: (reg: StudentRegistration) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    fatherName: '',
    hostelBlock: '',
    roomNumber: '',
    course: '',
    semester: '',
    mobileNo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReg: StudentRegistration = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      status: RegistrationStatus.PENDING,
      appliedAt: Date.now(),
    };
    onSubmit(newReg);
  };

  return (
    <div className="max-w-xl mx-auto animate-fadeIn">
      <button 
        onClick={onBack}
        className="text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-1 text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Login
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Digital Access</h2>
        <p className="text-slate-500 text-sm mb-8">Fill in your details for hostel registration. The Warden will review and approve your access.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.name}
                placeholder="Full Name"
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Enrollment Id</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.studentId}
                placeholder="Enrollment Id"
                onChange={e => setFormData({...formData, studentId: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Father Name</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.fatherName}
                placeholder="Father Name"
                onChange={e => setFormData({...formData, fatherName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Hostel Block</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.hostelBlock}
                placeholder="Hostel Block"
                onChange={e => setFormData({...formData, hostelBlock: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Room Number</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.roomNumber}
                placeholder="Room Number"
                onChange={e => setFormData({...formData, roomNumber: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Course Name</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.course}
                placeholder="Course Name"
                onChange={e => setFormData({...formData, course: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Semester Value</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.semester}
                placeholder="Semester Value"
                onChange={e => setFormData({...formData, semester: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Mobile No</label>
              <input 
                required
                type="tel"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.mobileNo}
                placeholder="Mobile No"
                onChange={e => setFormData({...formData, mobileNo: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 mt-4">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
