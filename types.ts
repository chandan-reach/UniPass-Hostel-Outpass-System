
export enum UserRole {
  STUDENT = 'STUDENT',
  WARDEN = 'WARDEN',
  GUARD = 'GUARD'
}

export enum OutpassStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  OUT = 'OUT',
  RETURNED = 'RETURNED'
}

export enum RegistrationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface GuardAccount {
  id: string;
  username: string;
  password?: string;
  lastLogin?: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  roomNumber?: string;
  hostelBlock?: string;
  studentId?: string;
  fatherName?: string;
  course?: string;
  semester?: string;
  mobileNo?: string;
}

export interface StudentRegistration extends Omit<User, 'id' | 'role'> {
  id: string;
  status: RegistrationStatus;
  appliedAt: number;
}

export interface Outpass {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  destination: string;
  reason: string;
  outDate: string;
  outTime: string;
  inDate: string;
  inTime: string;
  status: OutpassStatus;
  createdAt: number;
  aiAssessment?: string;
  wardenComments?: string;
  actualOutTimestamp?: number;
  actualInTimestamp?: number;
}
