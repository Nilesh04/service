import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppNotification,
  AuthSession,
  Complaint,
  ComplaintCategory,
  ComplaintFeedback,
  ComplaintStatus,
  CustomerProfile,
  Machine,
  PriorityLevel,
  ServiceEngineer,
  ServiceVisit,
  SparePartRequest,
  UserRole,
} from '../types';
import {
  SAMPLE_COMPLAINTS,
  SAMPLE_CUSTOMER,
  SAMPLE_ENGINEERS,
  SAMPLE_MACHINES,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_SERVICE_VISITS,
  SAMPLE_SPARE_PARTS,
} from '../data/mockData';

const STORAGE_KEY = 'machinecare_app_state_v1';

interface PersistedState {
  session: AuthSession | null;
  customer: CustomerProfile;
  engineers: ServiceEngineer[];
  machines: Machine[];
  complaints: Complaint[];
  spareParts: SparePartRequest[];
  serviceVisits: ServiceVisit[];
  notifications: AppNotification[];
}

export interface NewComplaintInput {
  machineId: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  priority: PriorityLevel;
  images: string[];
}

export interface NewSparePartInput {
  machineId: string;
  partName: string;
  partNumber?: string;
  quantity: number;
  description: string;
  images: string[];
}

export interface ServiceVisitInput {
  complaintId: string;
  visitDate: string;
  visitTime: string;
  serviceNotes: string;
  workPerformed: string;
  resolutionDetails?: string;
  statusAfterVisit: 'In Progress' | 'Pending – Spare Parts Required' | 'Resolved';
  images: string[];
}

interface AppContextValue {
  session: AuthSession | null;
  customer: CustomerProfile;
  engineers: ServiceEngineer[];
  currentEngineer: ServiceEngineer | null;
  machines: Machine[];
  complaints: Complaint[];
  spareParts: SparePartRequest[];
  serviceVisits: ServiceVisit[];
  notifications: AppNotification[];
  unreadCount: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  loginAsCustomer: () => void;
  loginAsEngineer: (employeeId?: string) => void;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  registerComplaint: (input: NewComplaintInput) => Complaint;
  registerSparePart: (input: NewSparePartInput) => SparePartRequest;
  submitServiceVisitAndUpdate: (input: ServiceVisitInput) => ServiceVisit | null;
  quickUpdateComplaintStatus: (
    complaintId: string,
    status: 'In Progress' | 'Pending – Spare Parts Required' | 'Resolved',
    note: string
  ) => void;
  submitComplaintFeedback: (complaintId: string, feedback: Omit<ComplaintFeedback, 'submittedAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function formatCurrentDate(): string {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrentTimestamp(): string {
  const dateStr = formatCurrentDate();
  const timeStr = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${dateStr} · ${timeStr}`;
}

function getInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed && Array.isArray(parsed.machines) && Array.isArray(parsed.complaints)) {
        return parsed;
      }
    }
  } catch {
    // Fallback to clean mock state
  }
  return {
    session: null,
    customer: SAMPLE_CUSTOMER,
    engineers: SAMPLE_ENGINEERS,
    machines: SAMPLE_MACHINES,
    complaints: SAMPLE_COMPLAINTS,
    spareParts: SAMPLE_SPARE_PARTS,
    serviceVisits: SAMPLE_SERVICE_VISITS,
    notifications: SAMPLE_NOTIFICATIONS,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(getInitialState);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors in private browsing
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const loginAsCustomer = () => {
    setState((prev) => ({
      ...prev,
      session: { role: 'customer', userId: prev.customer.id },
    }));
  };

  const loginAsEngineer = (employeeId = 'ENG001') => {
    setState((prev) => {
      const matched =
        prev.engineers.find((e) => e.employeeId.toUpperCase() === employeeId.toUpperCase()) ||
        prev.engineers[0];
      return {
        ...prev,
        session: { role: 'engineer', userId: matched.employeeId },
      };
    });
  };

  const logout = () => {
    setState((prev) => ({
      ...prev,
      session: null,
    }));
  };

  const switchDemoRole = (role: UserRole) => {
    if (role === 'customer') {
      loginAsCustomer();
      showToast('Switched to Customer Demo (Rajesh Sharma)');
    } else {
      loginAsEngineer('ENG001');
      showToast('Switched to Engineer Demo (Amit Verma)');
    }
  };

  const registerComplaint = (input: NewComplaintInput): Complaint => {
    const nextNum = state.complaints.length + 1;
    const padded = String(nextNum).padStart(3, '0');
    const complaintId = `CMP-2026-${padded}`;
    const registeredDate = formatCurrentDate();
    const timestamp = formatCurrentTimestamp();

    const newComplaint: Complaint = {
      id: complaintId,
      machineId: input.machineId,
      customerId: state.customer.id,
      category: input.category,
      subject: input.subject.trim(),
      description: input.description.trim(),
      priority: input.priority,
      status: 'Pending Assignment',
      registeredDate,
      images: input.images,
      timeline: [
        {
          id: `TL-${Date.now()}`,
          status: 'Complaint Registered',
          timestamp,
          note: `Ticket submitted by ${state.customer.name} (${state.customer.company}). Initial status: Pending Assignment.`,
          actor: state.customer.name,
        },
      ],
    };

    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Complaint Registered',
      message: `Your complaint ${complaintId} has been successfully registered.`,
      timestamp,
      read: false,
      targetType: 'complaint',
      targetId: complaintId,
    };

    setState((prev) => ({
      ...prev,
      complaints: [newComplaint, ...prev.complaints],
      notifications: [newNotif, ...prev.notifications],
    }));

    return newComplaint;
  };

  const registerSparePart = (input: NewSparePartInput): SparePartRequest => {
    const nextNum = state.spareParts.length + 1;
    const padded = String(nextNum).padStart(3, '0');
    const requestId = `SPR-2026-${padded}`;
    const requestDate = formatCurrentDate();
    const timestamp = formatCurrentTimestamp();

    const newRequest: SparePartRequest = {
      id: requestId,
      machineId: input.machineId,
      partName: input.partName.trim(),
      partNumber: input.partNumber?.trim() || undefined,
      quantity: Math.max(1, input.quantity),
      description: input.description.trim(),
      requestDate,
      status: 'Pending',
      images: input.images,
      history: [
        {
          id: `SH-${Date.now()}`,
          status: 'Pending',
          timestamp,
          note: `Spare part request submitted by ${state.customer.name}. Awaiting warehouse verification.`,
        },
      ],
    };

    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Spare Part Request Submitted',
      message: `Spare part request ${requestId} for ${newRequest.partName} is now Pending.`,
      timestamp,
      read: false,
      targetType: 'spare_part',
      targetId: requestId,
    };

    setState((prev) => ({
      ...prev,
      spareParts: [newRequest, ...prev.spareParts],
      notifications: [newNotif, ...prev.notifications],
    }));

    return newRequest;
  };

  const currentEngineer =
    state.session?.role === 'engineer'
      ? state.engineers.find((e) => e.employeeId === state.session?.userId) || state.engineers[0]
      : null;

  const submitServiceVisitAndUpdate = (input: ServiceVisitInput): ServiceVisit | null => {
    const target = state.complaints.find((c) => c.id === input.complaintId);
    if (!target) return null;

    const eng = currentEngineer || state.engineers[0];
    const timestamp = formatCurrentTimestamp();
    const visitId = `VIS-2026-${String(state.serviceVisits.length + 1).padStart(3, '0')}`;

    const newVisit: ServiceVisit = {
      id: visitId,
      complaintId: input.complaintId,
      machineId: target.machineId,
      engineerId: eng.employeeId,
      engineerName: eng.name,
      visitDate: input.visitDate,
      visitTime: input.visitTime,
      serviceNotes: input.serviceNotes.trim(),
      workPerformed: input.workPerformed.trim(),
      resolutionDetails: input.resolutionDetails?.trim() || undefined,
      statusAfterVisit: input.statusAfterVisit,
      images: input.images,
      createdAt: timestamp,
    };

    const notifTitle =
      input.statusAfterVisit === 'Resolved'
        ? 'Complaint Marked Resolved'
        : input.statusAfterVisit === 'Pending – Spare Parts Required'
        ? 'Spare Parts Required'
        : 'Service Visit Logged';

    const notifMsg =
      input.statusAfterVisit === 'Resolved'
        ? `Your complaint ${target.id} has been marked as resolved by ${eng.name}.`
        : input.statusAfterVisit === 'Pending – Spare Parts Required'
        ? `${eng.name} updated ${target.id} to Pending – Spare Parts Required.`
        : `Engineer ${eng.name} logged a service visit on ${target.id}.`;

    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: notifTitle,
      message: notifMsg,
      timestamp,
      read: false,
      targetType: 'complaint',
      targetId: target.id,
    };

    setState((prev) => ({
      ...prev,
      complaints: prev.complaints.map((c) => {
        if (c.id !== input.complaintId) return c;
        return {
          ...c,
          status: input.statusAfterVisit,
          assignedEngineerId: c.assignedEngineerId || eng.employeeId,
          resolutionDetails:
            input.statusAfterVisit === 'Resolved'
              ? input.resolutionDetails?.trim() || input.workPerformed.trim()
              : c.resolutionDetails,
          timeline: [
            ...c.timeline,
            {
              id: `TL-${Date.now()}`,
              status: input.statusAfterVisit,
              timestamp: `${input.visitDate} · ${input.visitTime}`,
              note: `${input.workPerformed.trim()}${
                input.serviceNotes.trim() ? ` — ${input.serviceNotes.trim()}` : ''
              }`,
              actor: eng.name,
            },
          ],
        };
      }),
      serviceVisits: [newVisit, ...prev.serviceVisits],
      notifications: [newNotif, ...prev.notifications],
    }));

    showToast(`Complaint ${target.id} updated to ${input.statusAfterVisit}`);
    return newVisit;
  };

  const quickUpdateComplaintStatus = (
    complaintId: string,
    status: 'In Progress' | 'Pending – Spare Parts Required' | 'Resolved',
    note: string
  ) => {
    const target = state.complaints.find((c) => c.id === complaintId);
    if (!target) return;

    const eng = currentEngineer || state.engineers[0];
    const timestamp = formatCurrentTimestamp();

    const notifMsg =
      status === 'In Progress'
        ? `Engineer ${eng.name} has started working on your complaint ${complaintId}.`
        : status === 'Resolved'
        ? `Your complaint ${complaintId} has been marked as resolved.`
        : `Complaint ${complaintId} requires spare parts before completion.`;

    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: status === 'Resolved' ? 'Complaint Resolved' : 'Complaint Status Updated',
      message: notifMsg,
      timestamp,
      read: false,
      targetType: 'complaint',
      targetId: complaintId,
    };

    setState((prev) => ({
      ...prev,
      complaints: prev.complaints.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          status: status as ComplaintStatus,
          assignedEngineerId: c.assignedEngineerId || eng.employeeId,
          timeline: [
            ...c.timeline,
            {
              id: `TL-${Date.now()}`,
              status,
              timestamp,
              note,
              actor: eng.name,
            },
          ],
        };
      }),
      notifications: [newNotif, ...prev.notifications],
    }));

    showToast(`${complaintId} marked as ${status}`);
  };

  const submitComplaintFeedback = (
    complaintId: string,
    feedback: Omit<ComplaintFeedback, 'submittedAt'>
  ) => {
    const submittedAt = formatCurrentTimestamp();
    setState((prev) => ({
      ...prev,
      complaints: prev.complaints.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              feedback: {
                ...feedback,
                submittedAt,
              },
            }
          : c
      ),
    }));
    showToast('Thank you! Your service feedback has been saved.');
  };

  const markNotificationRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  };

  const markAllNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
    showToast('All notifications marked as read');
  };

  const resetDemoData = () => {
    const fresh: PersistedState = {
      session: state.session,
      customer: SAMPLE_CUSTOMER,
      engineers: SAMPLE_ENGINEERS,
      machines: SAMPLE_MACHINES,
      complaints: SAMPLE_COMPLAINTS,
      spareParts: SAMPLE_SPARE_PARTS,
      serviceVisits: SAMPLE_SERVICE_VISITS,
      notifications: SAMPLE_NOTIFICATIONS,
    };
    setState(fresh);
    showToast('Demo data restored to initial state');
  };

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        session: state.session,
        customer: state.customer,
        engineers: state.engineers,
        currentEngineer,
        machines: state.machines,
        complaints: state.complaints,
        spareParts: state.spareParts,
        serviceVisits: state.serviceVisits,
        notifications: state.notifications,
        unreadCount,
        toastMessage,
        showToast,
        loginAsCustomer,
        loginAsEngineer,
        logout,
        switchDemoRole,
        registerComplaint,
        registerSparePart,
        submitServiceVisitAndUpdate,
        quickUpdateComplaintStatus,
        submitComplaintFeedback,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
