import { useEffect, useState } from 'react';
import {
  Bell,
  ClipboardList,
  Cog,
  History,
  Home,
  LayoutDashboard,
  Package,
  QrCode,
  User,
  Wrench,
} from 'lucide-react';
import { BrandLogo } from './components/BrandLogo';
import { ComplaintForm } from './components/customer/ComplaintForm';
import { ComplaintsView } from './components/customer/ComplaintsView';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { MachinesView } from './components/customer/MachinesView';
import { NotificationsView } from './components/customer/NotificationsView';
import { SparePartsView } from './components/customer/SparePartsView';
import { EngineerComplaintDetail } from './components/engineer/EngineerComplaintDetail';
import { EngineerDashboard } from './components/engineer/EngineerDashboard';
import { EngineerTasksView } from './components/engineer/EngineerTasksView';
import { LoginScreen } from './components/LoginScreen';
import { ProfileView } from './components/ProfileView';
import { QRScannerModal } from './components/QRScannerModal';
import { SplashScreen } from './components/SplashScreen';
import { AppProvider, useApp } from './context/AppContext';
import { AppNotification } from './types';

type CustomerTab = 'home' | 'machines' | 'complaints' | 'spare_parts' | 'profile';
type EngineerTab = 'dashboard' | 'tasks' | 'history' | 'profile';

function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full sm:bg-slate-200/80 sm:py-4 sm:px-4 flex items-center justify-center">
      <div className="w-full h-dvh sm:h-[844px] sm:max-h-[94dvh] sm:max-w-[412px] bg-slate-50 sm:rounded-[38px] sm:border-[7px] sm:border-slate-900 sm:shadow-2xl overflow-hidden flex flex-col relative">
        {children}
      </div>
    </div>
  );
}

function MainAppContent() {
  const { session, currentEngineer, unreadCount, toastMessage } = useApp();

  const [showSplash, setShowSplash] = useState(true);

  // Customer navigation states
  const [customerTab, setCustomerTab] = useState<CustomerTab>('home');
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [selectedSparePartId, setSelectedSparePartId] = useState<string | null>(null);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintFormMachineId, setComplaintFormMachineId] = useState<
    string | undefined
  >(undefined);
  const [showSparePartForm, setShowSparePartForm] = useState(false);
  const [sparePartFormMachineId, setSparePartFormMachineId] = useState<
    string | undefined
  >(undefined);
  const [showNotifications, setShowNotifications] = useState(false);

  // Engineer navigation states
  const [engineerTab, setEngineerTab] = useState<EngineerTab>('dashboard');
  const [engineerComplaintId, setEngineerComplaintId] = useState<string | null>(null);

  // QR Scanner modal state
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [pendingQrMachineId, setPendingQrMachineId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1250);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <MobileShell>
        <SplashScreen />
      </MobileShell>
    );
  }

  const resetCustomerSubViews = () => {
    setSelectedMachineId(null);
    setSelectedComplaintId(null);
    setSelectedSparePartId(null);
    setShowComplaintForm(false);
    setShowSparePartForm(false);
    setShowNotifications(false);
  };

  const resetEngineerSubViews = () => {
    setEngineerComplaintId(null);
  };

  const handleOpenNewComplaint = (machineId?: string) => {
    resetCustomerSubViews();
    setComplaintFormMachineId(machineId);
    setShowComplaintForm(true);
    setCustomerTab('complaints');
  };

  const handleOpenNewSparePart = (machineId?: string) => {
    resetCustomerSubViews();
    setSparePartFormMachineId(machineId);
    setShowSparePartForm(true);
    setCustomerTab('spare_parts');
  };

  const handleNotificationTarget = (notif: AppNotification) => {
    resetCustomerSubViews();
    if (notif.targetType === 'complaint') {
      setCustomerTab('complaints');
      setSelectedComplaintId(notif.targetId);
    } else if (notif.targetType === 'spare_part') {
      setCustomerTab('spare_parts');
      setSelectedSparePartId(notif.targetId);
    } else {
      setCustomerTab('machines');
      setSelectedMachineId(notif.targetId);
    }
  };

  const handleLoginSuccess = () => {
    resetCustomerSubViews();
    resetEngineerSubViews();
    if (pendingQrMachineId) {
      setCustomerTab('machines');
      setSelectedMachineId(pendingQrMachineId);
      setPendingQrMachineId(null);
    }
  };

  if (!session) {
    return (
      <MobileShell>
        <LoginScreen
          pendingQrMachineId={pendingQrMachineId}
          onOpenQrScanner={() => setShowQrScanner(true)}
          onLoginSuccess={handleLoginSuccess}
        />
        <QRScannerModal
          isOpen={showQrScanner}
          onClose={() => setShowQrScanner(false)}
          isAuthenticated={false}
          onRequireLogin={(machineId) => {
            setPendingQrMachineId(machineId);
            setShowQrScanner(false);
          }}
          onSelectComplaint={() => {}}
          onSelectSparePart={() => {}}
          onViewMachineDetail={() => {}}
        />
        {toastMessage && (
          <div
            role="status"
            className="absolute bottom-5 left-4 right-4 z-50 bg-navy-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-medium"
          >
            {toastMessage}
          </div>
        )}
      </MobileShell>
    );
  }

  const isCustomer = session.role === 'customer';

  const customerNavItems: Array<{
    id: CustomerTab;
    label: string;
    icon: typeof Home;
  }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'machines', label: 'Machines', icon: Cog },
    { id: 'complaints', label: 'Complaints', icon: Wrench },
    { id: 'spare_parts', label: 'Parts', icon: Package },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const engineerNavItems: Array<{
    id: EngineerTab;
    label: string;
    icon: typeof LayoutDashboard;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: ClipboardList },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderCustomerBody = () => {
    if (showNotifications) {
      return (
        <NotificationsView
          onBack={() => setShowNotifications(false)}
          onSelectNotificationTarget={handleNotificationTarget}
        />
      );
    }

    if (showComplaintForm) {
      return (
        <ComplaintForm
          initialMachineId={complaintFormMachineId}
          onBack={() => {
            setShowComplaintForm(false);
            setCustomerTab('complaints');
          }}
          onViewComplaint={(id) => {
            setShowComplaintForm(false);
            setCustomerTab('complaints');
            setSelectedComplaintId(id);
          }}
          onDoneToDashboard={() => {
            resetCustomerSubViews();
            setCustomerTab('home');
          }}
        />
      );
    }

    switch (customerTab) {
      case 'home':
        return (
          <CustomerDashboard
            onOpenNewComplaint={handleOpenNewComplaint}
            onOpenNewSparePart={handleOpenNewSparePart}
            onOpenQrScanner={() => setShowQrScanner(true)}
            onNavigateTab={(tab) => {
              resetCustomerSubViews();
              setCustomerTab(tab);
            }}
          />
        );
      case 'machines':
        return (
          <MachinesView
            selectedMachineId={selectedMachineId}
            onSelectMachine={setSelectedMachineId}
            onRegisterComplaint={handleOpenNewComplaint}
            onRequestSparePart={handleOpenNewSparePart}
            onSelectComplaint={(id) => {
              resetCustomerSubViews();
              setCustomerTab('complaints');
              setSelectedComplaintId(id);
            }}
            onSelectSparePart={(id) => {
              resetCustomerSubViews();
              setCustomerTab('spare_parts');
              setSelectedSparePartId(id);
            }}
          />
        );
      case 'complaints':
        return (
          <ComplaintsView
            selectedComplaintId={selectedComplaintId}
            onSelectComplaint={setSelectedComplaintId}
            onNewComplaint={() => handleOpenNewComplaint()}
          />
        );
      case 'spare_parts':
        return (
          <SparePartsView
            selectedRequestId={selectedSparePartId}
            onSelectRequest={setSelectedSparePartId}
            showForm={showSparePartForm}
            initialMachineId={sparePartFormMachineId}
            onOpenForm={handleOpenNewSparePart}
            onCloseForm={() => setShowSparePartForm(false)}
          />
        );
      case 'profile':
        return <ProfileView />;
    }
  };

  const renderEngineerBody = () => {
    if (engineerComplaintId) {
      return (
        <EngineerComplaintDetail
          complaintId={engineerComplaintId}
          onBack={() => setEngineerComplaintId(null)}
        />
      );
    }

    switch (engineerTab) {
      case 'dashboard':
        return (
          <EngineerDashboard
            onNavigateTab={(tab) => {
              resetEngineerSubViews();
              setEngineerTab(tab);
            }}
          />
        );
      case 'tasks':
        return (
          <EngineerTasksView
            mode="tasks"
            onSelectComplaint={setEngineerComplaintId}
          />
        );
      case 'history':
        return (
          <EngineerTasksView
            mode="history"
            onSelectComplaint={setEngineerComplaintId}
          />
        );
      case 'profile':
        return <ProfileView />;
    }
  };

  return (
    <MobileShell>
      {/* Mobile Top App Bar */}
      <header className="shrink-0 h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30">
        <BrandLogo size="sm" />

        <div className="flex items-center gap-1">
          {isCustomer ? (
            <>
              <button
                type="button"
                onClick={() => setShowQrScanner(true)}
                aria-label="Scan Machine QR"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-navy-900 active:bg-slate-100 transition-colors"
              >
                <QrCode className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setShowNotifications((prev) => !prev)}
                aria-label="Notifications"
                className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-navy-900 active:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>
            </>
          ) : (
            <span className="text-xs font-mono font-bold text-navy-900 tabular-nums">
              {currentEngineer?.employeeId}
            </span>
          )}
        </div>
      </header>

      {/* Scrollable Mobile Content Feed */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-5">
        {isCustomer ? renderCustomerBody() : renderEngineerBody()}
      </main>

      {/* Fixed Bottom Navigation Tab Bar */}
      <nav
        aria-label="Bottom Navigation"
        className="shrink-0 bg-white border-t border-slate-200 pb-safe z-40"
      >
        <div
          className={`grid h-16 items-center ${
            isCustomer ? 'grid-cols-5' : 'grid-cols-4'
          }`}
        >
          {isCustomer
            ? customerNavItems.map((item) => {
                const Icon = item.icon;
                const active = !showNotifications && customerTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      resetCustomerSubViews();
                      setCustomerTab(item.id);
                    }}
                    className={`h-full flex flex-col items-center justify-center gap-0.5 transition-colors ${
                      active ? 'text-blue-600' : 'text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 1.9} />
                    <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">
                      {item.label}
                    </span>
                  </button>
                );
              })
            : engineerNavItems.map((item) => {
                const Icon = item.icon;
                const active = !engineerComplaintId && engineerTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      resetEngineerSubViews();
                      setEngineerTab(item.id);
                    }}
                    className={`h-full flex flex-col items-center justify-center gap-0.5 transition-colors ${
                      active ? 'text-blue-600' : 'text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 1.9} />
                    <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">
                      {item.label}
                    </span>
                  </button>
                );
              })}
        </div>
      </nav>

      {/* Mobile QR Scanner Bottom Sheet */}
      <QRScannerModal
        isOpen={showQrScanner}
        onClose={() => setShowQrScanner(false)}
        isAuthenticated={true}
        onRequireLogin={() => {}}
        onSelectComplaint={(machineId) => {
          setShowQrScanner(false);
          handleOpenNewComplaint(machineId);
        }}
        onSelectSparePart={(machineId) => {
          setShowQrScanner(false);
          handleOpenNewSparePart(machineId);
        }}
        onViewMachineDetail={(machineId) => {
          setShowQrScanner(false);
          resetCustomerSubViews();
          setCustomerTab('machines');
          setSelectedMachineId(machineId);
        }}
      />

      {/* Mobile Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="absolute bottom-20 left-4 right-4 z-50 bg-navy-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-medium"
        >
          {toastMessage}
        </div>
      )}
    </MobileShell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
