
import React, { useState, useEffect } from 'react';
import { HashRouter, Link } from 'react-router-dom';
import { UserRole, User, Outpass, OutpassStatus, GuardAccount, StudentRegistration, RegistrationStatus } from './types';
import StudentDashboard from './views/StudentDashboard';
import WardenDashboard from './views/WardenDashboard';
import GuardDashboard from './views/GuardDashboard';
import RegistrationForm from './views/RegistrationForm';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isWardenSigningUp, setIsWardenSigningUp] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [students, setStudents] = useState<User[]>(() => {
    const saved = localStorage.getItem('uni-students-v2');
    return saved ? JSON.parse(saved) : [
      { id: 's1', name: 'John Doe', role: UserRole.STUDENT, studentId: 'CS101', roomNumber: 'B-204', hostelBlock: 'Aryabhatta', fatherName: 'Robert Doe', course: 'B.Tech', semester: '4th', mobileNo: '9876543210' }
    ];
  });

  const [wardenAccounts, setWardenAccounts] = useState<any[]>(() => {
    const saved = localStorage.getItem('uni-warden-accounts');
    return saved ? JSON.parse(saved) : [{ id: 'w1', name: 'Dr. Smith', username: 'warden', password: 'password123' }];
  });

  const [registrations, setRegistrations] = useState<StudentRegistration[]>(() => {
    const saved = localStorage.getItem('uni-registrations');
    return saved ? JSON.parse(saved) : [];
  });

  const [guardAccounts, setGuardAccounts] = useState<GuardAccount[]>(() => {
    const saved = localStorage.getItem('uni-guards');
    return saved ? JSON.parse(saved) : [{ id: 'g1', username: 'guard1', password: 'password123' }];
  });

  const [outpasses, setOutpasses] = useState<Outpass[]>(() => {
    const saved = localStorage.getItem('uni-outpasses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('uni-students-v2', JSON.stringify(students));
    localStorage.setItem('uni-warden-accounts', JSON.stringify(wardenAccounts));
    localStorage.setItem('uni-registrations', JSON.stringify(registrations));
    localStorage.setItem('uni-guards', JSON.stringify(guardAccounts));
    localStorage.setItem('uni-outpasses', JSON.stringify(outpasses));
  }, [students, wardenAccounts, registrations, guardAccounts, outpasses]);

  const handleStudentLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const studentId = (e.currentTarget.elements.namedItem('studentId') as HTMLInputElement).value;
    const student = students.find(s => s.studentId === studentId);
    if (student) {
      setCurrentUser(student);
      setSelectedRole(null);
      setLoginError(null);
    } else {
      setLoginError("You are not hosteller");
    }
  };

  const handleWardenLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = (e.currentTarget.elements.namedItem('username') as HTMLInputElement).value;
    const pass = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    
    const warden = wardenAccounts.find(w => w.username === user && w.password === pass);
    if (warden) {
      setCurrentUser({ id: warden.id, name: warden.name, role: UserRole.WARDEN });
      setSelectedRole(null);
      setLoginError(null);
    } else {
      alert("Invalid Warden Credentials");
    }
  };

  const handleWardenSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
    const username = (e.currentTarget.elements.namedItem('username') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

    if (wardenAccounts.some(w => w.username === username)) {
      alert("Username already exists.");
      return;
    }

    const newWarden = { id: Math.random().toString(36).substr(2, 9), name, username, password };
    setWardenAccounts(prev => [...prev, newWarden]);
    setIsWardenSigningUp(false);
    alert("Warden account created successfully! Please login.");
  };

  const handleGuardLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = (e.currentTarget.elements.namedItem('username') as HTMLInputElement).value;
    const pass = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    const account = guardAccounts.find(g => g.username === user && g.password === pass);
    if (account) {
      setCurrentUser({ id: account.id, name: account.username, role: UserRole.GUARD });
      setSelectedRole(null);
      setLoginError(null);
    } else {
      alert("Invalid Guard Credentials");
    }
  };

  const handleUpdateStudentProfile = (updatedUser: User) => {
    setStudents(prev => prev.map(s => s.id === updatedUser.id ? updatedUser : s));
    setCurrentUser(updatedUser);
  };

  const addRegistration = (reg: StudentRegistration) => {
    setRegistrations(prev => [...prev, reg]);
    setIsApplying(false);
    alert("Application submitted successfully! Please wait for Warden approval.");
  };

  const approveRegistration = (id: string) => {
    const reg = registrations.find(r => r.id === id);
    if (reg) {
      const newUser: User = {
        id: reg.id,
        name: reg.name,
        role: UserRole.STUDENT,
        studentId: reg.studentId,
        fatherName: reg.fatherName,
        course: reg.course,
        semester: reg.semester,
        mobileNo: reg.mobileNo,
        hostelBlock: reg.hostelBlock,
        roomNumber: reg.roomNumber
      };
      setStudents(prev => [...prev, newUser]);
      setRegistrations(prev => prev.filter(r => r.id !== id));
      alert(`Access approved for ${reg.name}`);
    }
  };

  const rejectRegistration = (id: string) => {
    setRegistrations(prev => prev.filter(r => r.id !== id));
  };

  const updateOutpassStatus = (id: string, status: OutpassStatus) => {
    setOutpasses(prev => prev.map(p => p.id === id ? { ...p, status, 
      actualOutTimestamp: status === OutpassStatus.OUT ? Date.now() : p.actualOutTimestamp,
      actualInTimestamp: status === OutpassStatus.RETURNED ? Date.now() : p.actualInTimestamp
    } : p));
  };

  const updateGuardAccount = (username: string, password: string) => {
    setGuardAccounts(prev => {
      const existing = prev.find(g => g.username === username);
      if (existing) {
        return prev.map(g => g.username === username ? { ...g, password } : g);
      }
      return [...prev, { id: Math.random().toString(36).substr(2, 9), username, password }];
    });
    alert(`Account for ${username} updated successfully.`);
  };

  const addOutpass = (newPass: Outpass) => {
    setOutpasses(prev => [newPass, ...prev]);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col font-sans bg-slate-50">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3 md:px-8 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" onClick={() => { setCurrentUser(null); setSelectedRole(null); setIsApplying(false); setIsWardenSigningUp(false); setLoginError(null); }} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.48V12" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">UniPass</span>
            </Link>

            {currentUser && (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{currentUser.role}</p>
                </div>
                <button onClick={() => { setCurrentUser(null); setSelectedRole(null); }} className="text-sm text-slate-500 hover:text-rose-600 transition-colors font-bold uppercase tracking-widest text-[10px]">Logout</button>
              </div>
            )}
          </div>
        </nav>

        <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-8 relative">
          {loginError && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-3xl p-8 max-sm w-full shadow-2xl border border-rose-100 text-center">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h3>
                <p className="text-slate-500 mb-8 font-medium">{loginError}</p>
                <button 
                  onClick={() => setLoginError(null)}
                  className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {!currentUser ? (
            <div className="max-w-4xl mx-auto mt-12">
              {isApplying ? (
                <RegistrationForm onBack={() => setIsApplying(false)} onSubmit={addRegistration} />
              ) : !selectedRole ? (
                <div className="text-center animate-fadeIn">
                  <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tighter uppercase">GATE PERMISSION</h1>
                  <p className="text-slate-500 text-lg mb-12">Select your role to manage hostel movements</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button 
                      onClick={() => setSelectedRole(UserRole.STUDENT)}
                      className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all text-center"
                    >
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">Student</h3>
                      <p className="text-sm text-slate-500 mt-2">Manage outpass requests</p>
                    </button>

                    <button 
                      onClick={() => setSelectedRole(UserRole.WARDEN)}
                      className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-50 transition-all text-center"
                    >
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.48V12" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">Warden</h3>
                      <p className="text-sm text-slate-500 mt-2">Admin controls & approvals</p>
                    </button>

                    <button 
                      onClick={() => setSelectedRole(UserRole.GUARD)}
                      className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-50 transition-all text-center"
                    >
                      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight">Gate Guard</h3>
                      <p className="text-sm text-slate-500 mt-2">Log student traffic</p>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto animate-fadeIn">
                  <button onClick={() => { setSelectedRole(null); setIsWardenSigningUp(false); setShowPassword(false); }} className="mb-6 text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    Back to Roles
                  </button>

                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                      {selectedRole === UserRole.STUDENT ? 'Student Portal' : selectedRole === UserRole.WARDEN ? 'Warden Portal' : 'Security Terminal'}
                    </h2>
                    <p className="text-slate-500 text-sm mb-8">Secure authentication required</p>
                    
                    {selectedRole === UserRole.STUDENT && (
                      <div className="space-y-6">
                        <form onSubmit={handleStudentLogin} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Enrollment No / Student ID</label>
                            <input name="studentId" required type="text" placeholder="Enrollment No" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" />
                          </div>
                          <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Enter Dashboard</button>
                        </form>
                        <div className="text-center">
                          <button onClick={() => setIsApplying(true)} className="text-indigo-600 text-xs font-bold hover:underline">Request New Hostel ID</button>
                        </div>
                      </div>
                    )}

                    {selectedRole === UserRole.WARDEN && (
                      <div className="space-y-6">
                        {isWardenSigningUp ? (
                          <form onSubmit={handleWardenSignup} className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
                              <input name="name" required type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Username</label>
                              <input name="username" required type="text" placeholder="Username" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold" />
                            </div>
                            <div className="relative">
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
                              <input name="password" required type={showPassword ? "text" : "password"} placeholder="Password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold" />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-9 text-slate-400 hover:text-emerald-600">
                                {showPassword ? (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                              </button>
                            </div>
                            <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">Register Warden Account</button>
                            <button type="button" onClick={() => setIsWardenSigningUp(false)} className="w-full text-slate-400 text-xs font-bold hover:underline">Back to Login</button>
                          </form>
                        ) : (
                          <>
                            <form onSubmit={handleWardenLogin} className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Admin ID / Username</label>
                                <input name="username" required type="text" placeholder="Admin ID" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold" />
                              </div>
                              <div className="relative">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Security Password</label>
                                <input name="password" required type={showPassword ? "text" : "password"} placeholder="Password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-9 text-slate-400 hover:text-emerald-600">
                                  {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                  ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                  )}
                                </button>
                              </div>
                              <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">Authorize Access</button>
                            </form>
                            <div className="pt-4 border-t border-slate-100 text-center">
                              <p className="text-xs text-slate-400 mb-2">New administrator?</p>
                              <button onClick={() => setIsWardenSigningUp(true)} className="text-emerald-600 text-xs font-bold hover:underline">Create Warden Account</button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {selectedRole === UserRole.GUARD && (
                      <form onSubmit={handleGuardLogin} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Terminal ID / Username</label>
                          <input name="username" required type="text" placeholder="Terminal ID" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold" />
                        </div>
                        <div className="relative">
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
                          <input name="password" required type={showPassword ? "text" : "password"} placeholder="Password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-9 text-slate-400 hover:text-amber-600">
                            {showPassword ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                          </button>
                        </div>
                        <button type="submit" className="w-full py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-100 hover:bg-amber-700 transition-all active:scale-95">Open Gate Terminal</button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fadeIn">
              {currentUser.role === UserRole.STUDENT && (
                <StudentDashboard 
                  user={currentUser} 
                  outpasses={outpasses.filter(o => o.studentId === currentUser.id)} 
                  onSubmit={addOutpass} 
                  onUpdateProfile={handleUpdateStudentProfile}
                />
              )}
              {currentUser.role === UserRole.WARDEN && (
                <WardenDashboard 
                  outpasses={outpasses} 
                  students={students}
                  registrations={registrations}
                  guardAccounts={guardAccounts}
                  setStudents={setStudents}
                  updateGuardAccount={updateGuardAccount}
                  onAction={(id, status) => updateOutpassStatus(id, status)} 
                  onApproveReg={approveRegistration}
                  onRejectReg={rejectRegistration}
                />
              )}
              {currentUser.role === UserRole.GUARD && (
                <GuardDashboard 
                  outpasses={outpasses} 
                  onGateAction={updateOutpassStatus} 
                />
              )}
            </div>
          )}
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
