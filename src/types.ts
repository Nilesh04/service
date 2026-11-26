export type UserRole = 'customer' | 'engineer';

export type WarrantyStatus = 'Active' | 'Expired';

export type ComplaintCategory =
  | 'Mechanical Issue'
  | 'Electrical Issue'
  | 'Hydraulic Issue'
  | 'Production Issue'
  | 'Software/Control Issue'
  | 'Other';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus =
  | 'Pending Assignment'
  | 'Assigned'
  | 'In Progress'
  | 'Pending – Spare Parts Required'
  | 'Resolved';

export type SparePartStatus = 'Pending' | 'Approved' | 'Dispatched' | 'Completed';

export interface CustomerProfile {
  id: string;
  name: string;
  company: string;
  mobile: string;
  email: string;
  address: string;
}

export interface ServiceEngineer {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  mobile: string;
  specialization: string;
}

export interface Machine {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  installationDate: string;
  warrantyStatus: WarrantyStatus;
  warrantyValidTill: string;
  location: string;
  imageUrl: string;
  specs: string;
}

export interface TimelineEvent {
  id: string;
  status: string;
  timestamp: string;
  note: string;
  actor: string;
}

export interface ServiceVisit {
  id: string;
  complaintId: string;
  machineId: string;
  engineerId: string;
  engineerName: string;
  visitDate: string;
  visitTime: string;
  serviceNotes: string;
  workPerformed: string;
  resolutionDetails?: string;
  statusAfterVisit: 'In Progress' | 'Pending – Spare Parts Required' | 'Resolved';
  images: string[];
  createdAt: string;
}

export interface ComplaintFeedback {
  rating: number;
  serviceExperience: 'Excellent' | 'Good' | 'Average' | 'Poor';
  engineerBehaviour: 'Professional & Helpful' | 'Polite' | 'Satisfactory' | 'Needs Improvement';
  comments: string;
  submittedAt: string;
}

export interface Complaint {
  id: string;
  machineId: string;
  customerId: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  registeredDate: string;
  assignedEngineerId?: string;
  images: string[];
  resolutionDetails?: string;
  timeline: TimelineEvent[];
  feedback?: ComplaintFeedback;
}

export interface SparePartHistoryEvent {
  id: string;
  status: SparePartStatus;
  timestamp: string;
  note: string;
}

export interface SparePartRequest {
  id: string;
  machineId: string;
  partName: string;
  partNumber?: string;
  quantity: number;
  description: string;
  requestDate: string;
  status: SparePartStatus;
  images: string[];
  history: SparePartHistoryEvent[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetType: 'complaint' | 'spare_part' | 'machine';
  targetId: string;
}

export interface AuthSession {
  role: UserRole;
  userId: string;
}
