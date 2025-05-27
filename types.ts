export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  CONFIRMED = 'Confirmed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  NO_SHOW = 'No Show',
  PENDING_CONFIRMATION = 'Pending Confirmation'
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  PARTIALLY_PAID = 'Partially Paid',
  OVERDUE = 'Overdue',
  UNPAID = 'Unpaid'
}

export enum ExamStatus {
  REQUESTED = 'Requested',
  SAMPLE_COLLECTED = 'Sample Collected',
  IN_PROGRESS = 'In Progress',
  RESULTS_READY = 'Results Ready',
  DELIVERED_TO_PATIENT = 'Delivered to Patient',
  ARCHIVED = 'Archived'
}

export enum InventoryCategory {
  MEDICAL_SUPPLIES = 'Medical Supplies',
  OFFICE_SUPPLIES = 'Office Supplies',
  CLEANING_SUPPLIES = 'Cleaning Supplies',
  MEDICATIONS = 'Medications'
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string; // e.g., 'ADMIN', 'DOCTOR', 'RECEPTIONIST'
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}


export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  avatarUrl?: string; // e.g. https://picsum.photos/100
  medicalHistory?: string; // Simple text for now
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  payoutShare?: number; // percentage e.g. 0.6 for 60%
}

export interface Service {
  id: string;
  name: string;
  price: number;
  category: 'Consultation' | 'Exam' | 'Procedure';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string; // Denormalized for easier display
  doctorId: string;
  doctorName?: string; // Denormalized
  serviceId: string;
  serviceName?: string; // Denormalized
  dateTime: string; // ISO string
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  confirmationSent?: boolean;
  paymentStatus?: PaymentStatus; // Link to financial status
}

export interface Exam {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string; // Requesting doctor
  examTypeId: string; // Corresponds to a Service ID if it's a billable exam
  examTypeName?: string;
  requestDate: string;
  resultDate?: string;
  status: ExamStatus;
  resultSummary?: string; // Text summary
  resultAttachmentUrl?: string; // Simulated link or path
  labName?: string; // e.g. DB, Pardini
}

export interface Transaction {
  id: string;
  referenceId: string; // appointmentId or examId
  referenceType: 'Appointment' | 'Exam' | 'Other';
  patientId: string;
  patientName?: string;
  date: string; // ISO string
  description: string;
  amount: number;
  paymentMethod?: 'PIX' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Plan';
  status: PaymentStatus;
  doctorId?: string; // For payout calculation
}

export interface DoctorPayout {
  id: string;
  doctorId: string;
  doctorName: string;
  periodStartDate: string;
  periodEndDate: string;
  totalBilled: number; // Total amount for services performed by this doctor and paid by patients
  payoutRate: number; // e.g. 0.6 for 60%
  payoutAmount: number;
  paidDate?: string;
  status: 'Pending' | 'Paid';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  reorderLevel: number;
  unit: string; // e.g., 'box', 'item', 'ml'
  supplier?: string;
  lastPurchaseDate?: string;
  purchasePrice?: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}