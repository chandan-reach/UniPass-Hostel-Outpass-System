
import React, { useState } from 'react';
import { User, Outpass, OutpassStatus } from '../types';
import StatusBadge from '../components/StatusBadge';

interface StudentDashboardProps {
  user: User;
  outpasses: Outpass[];
  onSubmit: (pass: Outpass) => void;
  onUpdateProfile: (user: User) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, outpasses, onSubmit, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'outpasses' | 'profile'>('outpasses');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    reason: '',
    outDate: '',
    outTime: '',
    inDate: '',
    inTime: '',
  });

  const [profileData, setProfileData] = useState<User>({ ...user });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileData);
    alert("Profile updated successfully!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPass: Outpass = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: user.id,
      studentName: user.name,
      roomNumber: user.roomNumber || 'N/A',
      destination: formData.destination,
      reason: formData.reason,
      outDate: formData.outDate,
      outTime: formData.outTime,
      inDate: formData.inDate,
      inTime: formData.inTime,
      status: OutpassStatus.PENDING,
      createdAt: Date.now(),
    };
    onSubmit(newPass);
    setShowForm(false);
    setFormData({ destination: '', reason: '', outDate: '', outTime: '', inDate: '', inTime: '' });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, {user.name}</p>
        </div>
        
        <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => setActiveTab('outpasses')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'outpasses' ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            My Outpasses
          </button>
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Edit Profile
          </button>
        </div>
      </header>

      {activeTab === 'outpasses' ? (
        <div className="space-y-8">
          <div className="flex justify-end">
            <button 
              onClick={() => setShowForm(!showForm)}
              className={`px-6 py-3 rounded-2xl font-bold shadow-lg transition-all flex items-center gap-2 ${showForm ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'}`}
            >
              {showForm ? 'Discard Draft' : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  Request New Outpass
                </>
              )}
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-2xl mx-auto animate-fadeIn">
              <h2 className="text-xl font-bold text-slate-800 mb-6 tracking-tight">New Leave Request</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Primary Destination</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                    placeholder="Destination Name"
                    value={formData.destination}
                    onChange={e => setFormData({...formData, destination: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Detailed Reason</label>
                  <textarea 
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none h-28 font-medium"
                    placeholder="Detailed Reason Description"
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Colorful Exit Block */}
                  <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-100 shadow-sm transition-all hover:border-amber-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-200">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                      </div>
                      <label className="block text-[11px] font-black text-amber-600 uppercase tracking-widest">Campus Exit</label>
                    </div>
                    <div className="space-y-3">
                      <input 
                        required 
                        type="date" 
                        className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm font-bold text-amber-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer" 
                        value={formData.outDate} 
                        onChange={e => setFormData({...formData, outDate: e.target.value})} 
                      />
                      <input 
                        required 
                        type="time" 
                        className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm font-bold text-amber-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer" 
                        value={formData.outTime} 
                        onChange={e => setFormData({...formData, outTime: e.target.value})} 
                      />
                    </div>
                  </div>

                  {/* Colorful Return Block */}
                  <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100 shadow-sm transition-all hover:border-emerald-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h14" /></svg>
                      </div>
                      <label className="block text-[11px] font-black text-emerald-600 uppercase tracking-widest">Expected Return</label>
                    </div>
                    <div className="space-y-3">
                      <input 
                        required 
                        type="date" 
                        className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer" 
                        value={formData.inDate} 
                        onChange={e => setFormData({...formData, inDate: e.target.value})} 
                      />
                      <input 
                        required 
                        type="time" 
                        className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer" 
                        value={formData.inTime} 
                        onChange={e => setFormData({...formData, inTime: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 text-lg">
                  Submit Request
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Recent Applications</h2>
              <span className="text-xs text-slate-400 font-bold">{outpasses.length} Requests</span>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              {outpasses.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <p className="text-slate-400 font-medium">No movement history found.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination & Reason</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timing Schedule</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Current Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Gate Key</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {outpasses.map(pass => (
                      <tr key={pass.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-slate-800 mb-1">{pass.destination}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{pass.reason}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter mb-0.5">Out: {pass.outDate} @ {pass.outTime}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Ret: {pass.inDate} @ {pass.inTime}</p>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <StatusBadge status={pass.status} />
                        </td>
                        <td className="px-8 py-5 text-right">
                          {pass.status === OutpassStatus.APPROVED && (
                            <div className="flex flex-col items-end">
                              <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg">CODE: {pass.id.toUpperCase()}</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">Ready for Guard</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-indigo-600 px-8 py-10 text-white relative">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold tracking-tight">Personal Information</h2>
                <p className="text-indigo-100 text-sm mt-1">Keep your contact and academic records up to date.</p>
              </div>
              <div className="absolute top-0 right-0 w-48 h-full bg-white/5 skew-x-12 transform origin-top-right"></div>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Enrollment No (Permanent)</label>
                  <input 
                    disabled
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 font-black cursor-not-allowed text-sm"
                    value={profileData.studentId}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hostel Name (Permanent)</label>
                  <input 
                    disabled
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 font-black cursor-not-allowed text-sm"
                    value={profileData.hostelBlock}
                  />
                </div>
                <div className="md:col-span-2 h-px bg-slate-100 my-2"></div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input 
                    required
                    className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                    value={profileData.name}
                    placeholder="Full Name"
                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Father Name</label>
                  <input 
                    required
                    className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                    value={profileData.fatherName}
                    placeholder="Father Name"
                    onChange={e => setProfileData({...profileData, fatherName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Room Number</label>
                  <input 
                    required
                    className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                    value={profileData.roomNumber}
                    placeholder="Room Number"
                    onChange={e => setProfileData({...profileData, roomNumber: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mobile No</label>
                  <input 
                    required
                    type="tel"
                    className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                    value={profileData.mobileNo}
                    placeholder="Mobile No"
                    onChange={e => setProfileData({...profileData, mobileNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Course Name</label>
                  <input 
                    required
                    className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                    value={profileData.course}
                    placeholder="Course Name"
                    onChange={e => setProfileData({...profileData, course: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Semester</label>
                  <input 
                    required
                    className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
                    value={profileData.semester}
                    placeholder="Current Semester"
                    onChange={e => setProfileData({...profileData, semester: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="pt-8">
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Sync Updated Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
