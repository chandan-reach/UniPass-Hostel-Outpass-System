
import React, { useState } from 'react';
import { Outpass, OutpassStatus, User, GuardAccount, StudentRegistration, RegistrationStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import { auditOutpassRequest } from '../geminiService';

declare var Papa: any;

interface WardenDashboardProps {
  outpasses: Outpass[];
  students: User[];
  guardAccounts: GuardAccount[];
  registrations: StudentRegistration[];
  setStudents: React.Dispatch<React.SetStateAction<User[]>>;
  updateGuardAccount: (u: string, p: string) => void;
  onAction: (id: string, status: OutpassStatus) => void;
  onApproveReg: (id: string) => void;
  onRejectReg: (id: string) => void;
}

const WardenDashboard: React.FC<WardenDashboardProps> = ({ 
  outpasses, students, guardAccounts, registrations, setStudents, updateGuardAccount, onAction, onApproveReg, onRejectReg 
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'students' | 'guards' | 'applications'>('requests');
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{ [id: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showGuardPass, setShowGuardPass] = useState(false);
  
  const [newStudent, setNewStudent] = useState<Partial<User>>({});
  const [guardForm, setGuardForm] = useState({ username: '', password: '' });

  const handleAIRequest = async (pass: Outpass) => {
    setLoadingAI(pass.id);
    const result = await auditOutpassRequest(pass.reason, pass.destination, pass.outTime, pass.inTime);
    setAiResult(prev => ({ ...prev, [pass.id]: result }));
    setLoadingAI(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results: any) => {
          const parsedStudents: User[] = results.data.filter((r: any) => r.Name || r.name).map((r: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: r.Name || r['name'],
            studentId: r['Enroll No.'] || r['enroll_no'] || r['StudentId'],
            fatherName: r['Father Name'] || r['father_name'],
            hostelBlock: r['Hostel'] || r['hostel'],
            roomNumber: r['Room No.'] || r['room_no'],
            course: r['Course'] || r['course'],
            semester: r['Semester'] || r['semester'],
            mobileNo: r['Mobile No.'] || r['mobile_no'],
            role: 'STUDENT'
          }));
          setStudents(prev => [...prev, ...parsedStudents]);
          alert(`Successfully imported ${parsedStudents.length} students.`);
        }
      });
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const student: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStudent.name || '',
      studentId: newStudent.studentId || '',
      fatherName: newStudent.fatherName || '',
      hostelBlock: newStudent.hostelBlock || '',
      roomNumber: newStudent.roomNumber || '',
      course: newStudent.course || '',
      semester: newStudent.semester || '',
      mobileNo: newStudent.mobileNo || '',
      role: 'STUDENT' as any
    };
    setStudents(prev => [student, ...prev]);
    setNewStudent({});
    alert("Student added manually.");
  };

  const filteredRegistrations = registrations.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Warden Control Center</h1>
          <p className="text-slate-500 text-sm">Oversee hostel operations and security.</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('requests')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'requests' ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Outpasses
          </button>
          <button onClick={() => setActiveTab('applications')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${activeTab === 'applications' ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            Applications
            {registrations.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-slate-50 font-black">{registrations.length}</span>}
          </button>
          <button onClick={() => setActiveTab('students')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Directory
          </button>
          <button onClick={() => setActiveTab('guards')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'guards' ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.48V12" /></svg>
            Guards
          </button>
        </div>
      </header>

      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {outpasses.filter(p => p.status === OutpassStatus.PENDING).map(pass => (
            <div key={pass.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">{pass.studentName}</h3>
                  <p className="text-xs text-slate-500 font-medium">ID: {pass.studentId} • Room: {pass.roomNumber}</p>
                </div>
                <StatusBadge status={pass.status} />
              </div>
              <div className="space-y-3 mb-6">
                <div className="bg-slate-50 p-3 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reason and Destination</p>
                  <p className="text-sm font-semibold text-slate-700">{pass.reason} → <span className="text-indigo-600 font-bold">{pass.destination}</span></p>
                </div>
                <div className="flex gap-4 px-1">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expected Out</p>
                    <p className="text-xs font-bold text-slate-600">{pass.outDate} @ {pass.outTime}</p>
                  </div>
                  <div className="h-8 w-px bg-slate-200 my-auto"></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expected In</p>
                    <p className="text-xs font-bold text-slate-600">{pass.inDate} @ {pass.inTime}</p>
                  </div>
                </div>
                {aiResult[pass.id] && (
                  <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-xs text-indigo-800 animate-fadeIn">
                    <span className="font-bold text-indigo-600 block mb-1">AI Risk Assessment:</span>
                    {aiResult[pass.id]}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button onClick={() => onAction(pass.id, OutpassStatus.APPROVED)} className="flex-1 py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-50 hover:bg-emerald-700 transition-all">Approve</button>
                <button onClick={() => onAction(pass.id, OutpassStatus.REJECTED)} className="flex-1 py-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-100 hover:bg-rose-100 transition-all">Reject</button>
                <button onClick={() => handleAIRequest(pass)} className="flex-1 py-3 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-100 transition-all">
                  {loadingAI === pass.id ? 'Analyzing...' : 'AI Audit'}
                </button>
              </div>
            </div>
          ))}
          {outpasses.filter(p => p.status === OutpassStatus.PENDING).length === 0 && (
            <div className="lg:col-span-2 py-20 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-400 font-medium">No pending outpass requests to review.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Access Management</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search Applicants" 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <svg className="w-4 h-4 absolute left-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRegistrations.map(reg => (
              <div key={reg.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 animate-fadeIn">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                      {reg.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg tracking-tight">{reg.name}</h3>
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-tighter">ID: {reg.studentId}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase border border-blue-100">Review Pending</span>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs mb-8 bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">Father Name</p>
                    <p className="text-slate-800 font-bold">{reg.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">Mobile No</p>
                    <p className="text-slate-800 font-bold">{reg.mobileNo}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">Academic Track</p>
                    <p className="text-slate-800 font-bold">{reg.course} • Sem {reg.semester}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px] mb-0.5">Hostel And Room</p>
                    <p className="text-slate-800 font-bold">{reg.hostelBlock} • {reg.roomNumber}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => onApproveReg(reg.id)} className="flex-1 py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Grant Digital Access</button>
                  <button onClick={() => onRejectReg(reg.id)} className="px-4 py-3 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all">Dismiss</button>
                </div>
              </div>
            ))}
            {filteredRegistrations.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl">
                <p className="text-slate-400 font-medium">No pending applications found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2 tracking-tight">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                </div>
                Add Student Manually
              </h2>
              <form onSubmit={handleManualAdd} className="grid grid-cols-2 gap-4">
                <input required placeholder="Full Name" className="col-span-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newStudent.name || ''} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                <input required placeholder="Enrollment Id" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newStudent.studentId || ''} onChange={e => setNewStudent({...newStudent, studentId: e.target.value})} />
                <input required placeholder="Father Name" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newStudent.fatherName || ''} onChange={e => setNewStudent({...newStudent, fatherName: e.target.value})} />
                <input required placeholder="Hostel Block" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newStudent.hostelBlock || ''} onChange={e => setNewStudent({...newStudent, hostelBlock: e.target.value})} />
                <input required placeholder="Room Number" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newStudent.roomNumber || ''} onChange={e => setNewStudent({...newStudent, roomNumber: e.target.value})} />
                <input required placeholder="Course Name" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newStudent.course || ''} onChange={e => setNewStudent({...newStudent, course: e.target.value})} />
                <input required placeholder="Semester Value" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newStudent.semester || ''} onChange={e => setNewStudent({...newStudent, semester: e.target.value})} />
                <input required placeholder="Mobile No" className="col-span-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newStudent.mobileNo || ''} onChange={e => setNewStudent({...newStudent, mobileNo: e.target.value})} />
                <button type="submit" className="col-span-2 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 mt-2 hover:bg-indigo-700 transition-all">Register Student</button>
              </form>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 rounded-3xl text-white flex flex-col items-center justify-center text-center shadow-xl shadow-indigo-100">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 border border-white/20">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">Bulk CSV Import</h2>
              <p className="text-indigo-100 text-sm mb-8 max-w-xs leading-relaxed">Import your existing student database in seconds. <br/><span className="text-[10px] font-black uppercase bg-indigo-500/30 px-2 py-1 rounded mt-2 inline-block">Format: Name, Enroll No, Room No</span></p>
              <label className="cursor-pointer bg-white text-indigo-700 px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-indigo-50 transition-all active:scale-95">
                Upload Student List
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 tracking-tight">Master Student Directory</h2>
              <span className="text-xs text-slate-400 font-black uppercase tracking-widest">{students.length} Records</span>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4">Student Profile</th>
                    <th className="px-8 py-4">Accommodation</th>
                    <th className="px-8 py-4">Academic Details</th>
                    <th className="px-8 py-4">Parent Info</th>
                    <th className="px-8 py-4">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                        <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                        <p className="text-indigo-600 font-black text-[10px] uppercase tracking-tighter">{s.studentId}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-semibold text-slate-700">{s.hostelBlock}</p>
                        <p className="text-slate-500">Room {s.roomNumber}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="font-semibold text-slate-700">{s.course}</p>
                        <p className="text-slate-500">Semester {s.semester}</p>
                      </td>
                      <td className="px-8 py-5 text-slate-600 font-bold">{s.fatherName}</td>
                      <td className="px-8 py-5">
                        <span className="text-slate-700 font-mono font-black">{s.mobileNo}</span>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-20 text-slate-400 font-medium italic">The student directory is currently empty.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-8 flex items-center gap-2 tracking-tight">
              <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              Security Personnel Setup
            </h2>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); updateGuardAccount(guardForm.username, guardForm.password); }}>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Gate Id</label>
                <input required className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 font-medium" value={guardForm.username} onChange={e => setGuardForm({...guardForm, username: e.target.value})} placeholder="Username" />
              </div>
              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Password</label>
                <input required type={showGuardPass ? "text" : "password"} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 font-medium" value={guardForm.password} onChange={e => setGuardForm({...guardForm, password: e.target.value})} placeholder="Password" />
                <button type="button" onClick={() => setShowGuardPass(!showGuardPass)} className="absolute right-4 top-9 text-slate-400 hover:text-amber-600">
                  {showGuardPass ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <button className="w-full py-4 bg-amber-600 text-white font-bold rounded-2xl shadow-xl shadow-amber-50 hover:bg-amber-700 transition-all mt-4">Generate Terminal Credentials</button>
            </form>
          </div>
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-6 tracking-tight">Live Guard Terminals</h2>
            <div className="space-y-4">
              {guardAccounts.map(g => (
                <div key={g.id} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-amber-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 font-black">
                      {g.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-tight">{g.username}</p>
                      <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Terminal Active
                      </p>
                    </div>
                  </div>
                  <button className="text-[10px] text-rose-600 font-black uppercase tracking-widest hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all" onClick={() => alert("Terminal revocation requires IT authorization.")}>Revoke</button>
                </div>
              ))}
              {guardAccounts.length === 0 && (
                <div className="py-10 text-center text-slate-400 italic font-medium">No active security terminals configured.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardenDashboard;
