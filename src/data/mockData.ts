import {
  AppNotification,
  Complaint,
  CustomerProfile,
  Machine,
  ServiceEngineer,
  ServiceVisit,
  SparePartRequest,
} from '../types';

export const SAMPLE_CUSTOMER: CustomerProfile = {
  id: 'CUST-001',
  name: 'Rajesh Sharma',
  company: 'ABC Plastics Industries',
  mobile: '9876543210',
  email: 'rajesh.sharma@abcplastics.in',
  address: 'Plot 42, GIDC Industrial Estate, Phase II, Vatva, Ahmedabad, Gujarat 382445',
};

export const SAMPLE_ENGINEERS: ServiceEngineer[] = [
  {
    id: 'ENG-1',
    employeeId: 'ENG001',
    name: 'Amit Verma',
    designation: 'Senior Service Engineer',
    mobile: '9820112233',
    specialization: 'Extrusion Lines & Heavy Drive Systems',
  },
  {
    id: 'ENG-2',
    employeeId: 'ENG002',
    name: 'Priya Nair',
    designation: 'Hydraulic & PLC Specialist',
    mobile: '9820445566',
    specialization: 'Injection Moulding & Control Panels',
  },
];

export const SAMPLE_MACHINES: Machine[] = [
  {
    id: 'PEM-001',
    name: 'Pipe Extrusion Machine',
    model: 'EX-1200',
    serialNumber: 'MC-EX1200-25-8841',
    installationDate: '15 Jan 2025',
    warrantyStatus: 'Active',
    warrantyValidTill: '14 Jan 2027',
    location: 'Bay 1 · Main Extrusion Hall',
    imageUrl: '/src/assets/images/machine_pipe_extruder_1795676016861.jpg',
    specs: 'HDPE Single-Screw 90mm · 450 kg/hr · 110 kW AC Drive',
  },
  {
    id: 'PIM-002',
    name: 'Plastic Injection Moulding Machine',
    model: 'IM-450',
    serialNumber: 'MC-IM450-25-3319',
    installationDate: '10 Mar 2025',
    warrantyStatus: 'Active',
    warrantyValidTill: '09 Mar 2027',
    location: 'Bay 2 · Precision Moulding Wing',
    imageUrl: '/src/assets/images/machine_injection_moulder_1795676017879.jpg',
    specs: '450-Ton Servo Hydraulic Clamp · 1,420g Shot Capacity',
  },
  {
    id: 'PVC-003',
    name: 'PVC Extrusion Line',
    model: 'PVC-800',
    serialNumber: 'MC-PVC800-24-1104',
    installationDate: '20 Jun 2024',
    warrantyStatus: 'Expired',
    warrantyValidTill: '19 Jun 2025',
    location: 'Bay 3 · Rigid Pipe Production',
    imageUrl: '/src/assets/images/machine_pvc_extrusion_line_1795676017680.jpg',
    specs: 'Conical Twin-Screw · 320 kg/hr · Vacuum Sizing Tank',
  },
];

export const SAMPLE_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2026-001',
    machineId: 'PEM-001',
    customerId: 'CUST-001',
    category: 'Electrical Issue',
    subject: 'Motor overheating during production',
    description:
      'Main 110 kW drive motor casing reaches 86°C after 3 hours of continuous HDPE pipe extrusion, causing VFD thermal trip alarms during peak afternoon shift.',
    priority: 'Critical',
    status: 'In Progress',
    registeredDate: '21 Nov 2026',
    assignedEngineerId: 'ENG001',
    images: ['/src/assets/images/complaint_motor_overheat_1795676017674.jpg'],
    timeline: [
      {
        id: 'TL-101',
        status: 'Complaint Registered',
        timestamp: '21 Nov 2026 · 09:15 AM',
        note: 'Ticket logged by Rajesh Sharma (ABC Plastics Industries).',
        actor: 'Rajesh Sharma',
      },
      {
        id: 'TL-102',
        status: 'Assigned',
        timestamp: '21 Nov 2026 · 10:05 AM',
        note: 'Assigned to Senior Service Engineer Amit Verma (ENG001).',
        actor: 'Service Desk',
      },
      {
        id: 'TL-103',
        status: 'In Progress',
        timestamp: '22 Nov 2026 · 10:30 AM',
        note: 'Inspected drive motor cooling fins and blower amp draw on site. Replacement fan assembly dispatched.',
        actor: 'Amit Verma',
      },
    ],
  },
  {
    id: 'CMP-2026-002',
    machineId: 'PIM-002',
    customerId: 'CUST-001',
    category: 'Hydraulic Issue',
    subject: 'Hydraulic pressure fluctuation',
    description:
      'Clamping pressure oscillates between 125 bar and 148 bar during mould hold phase, leading to minor flash defects on polypro fittings.',
    priority: 'High',
    status: 'Pending – Spare Parts Required',
    registeredDate: '19 Nov 2026',
    assignedEngineerId: 'ENG001',
    images: ['/src/assets/images/complaint_hydraulic_gauge_1795676018396.jpg'],
    timeline: [
      {
        id: 'TL-201',
        status: 'Complaint Registered',
        timestamp: '19 Nov 2026 · 11:20 AM',
        note: 'Ticket logged with pressure manifold gauge photo.',
        actor: 'Rajesh Sharma',
      },
      {
        id: 'TL-202',
        status: 'Assigned',
        timestamp: '19 Nov 2026 · 12:10 PM',
        note: 'Assigned to Senior Service Engineer Amit Verma (ENG001).',
        actor: 'Service Desk',
      },
      {
        id: 'TL-203',
        status: 'In Progress',
        timestamp: '20 Nov 2026 · 02:15 PM',
        note: 'Tested proportional relief valve coil and hydraulic manifold spool.',
        actor: 'Amit Verma',
      },
      {
        id: 'TL-204',
        status: 'Pending – Spare Parts Required',
        timestamp: '20 Nov 2026 · 03:40 PM',
        note: 'Valve spool wear confirmed. Awaiting Proportional Hydraulic Relief Valve (SPR-2026-001).',
        actor: 'Amit Verma',
      },
    ],
  },
  {
    id: 'CMP-2026-003',
    machineId: 'PVC-003',
    customerId: 'CUST-001',
    category: 'Production Issue',
    subject: 'Extruder barrel temperature issue',
    description:
      'Heating Zone 3 thermocouple reads +18°C above setpoint intermittently, causing slight yellowing along rigid PVC pipe outer wall.',
    priority: 'Medium',
    status: 'Assigned',
    registeredDate: '23 Nov 2026',
    assignedEngineerId: 'ENG001',
    images: [],
    timeline: [
      {
        id: 'TL-301',
        status: 'Complaint Registered',
        timestamp: '23 Nov 2026 · 04:10 PM',
        note: 'Ticket logged for Zone 3 barrel temperature overshoot.',
        actor: 'Rajesh Sharma',
      },
      {
        id: 'TL-302',
        status: 'Assigned',
        timestamp: '24 Nov 2026 · 09:00 AM',
        note: 'Assigned to Amit Verma for SSR relay & thermocouple calibration.',
        actor: 'Service Desk',
      },
    ],
  },
  {
    id: 'CMP-2026-004',
    machineId: 'PEM-001',
    customerId: 'CUST-001',
    category: 'Mechanical Issue',
    subject: 'Gearbox abnormal noise',
    description:
      'Rhythmic knocking sound from helical reduction gearbox input shaft above 65 RPM screw speed.',
    priority: 'High',
    status: 'Resolved',
    registeredDate: '10 Nov 2026',
    assignedEngineerId: 'ENG001',
    images: [],
    resolutionDetails:
      'Replaced worn input shaft thrust bearing (SKF 7314B), aligned motor-gearbox coupling within 0.04mm TIR, and flushed with fresh ISO VG 320 synthetic gear oil.',
    timeline: [
      {
        id: 'TL-401',
        status: 'Complaint Registered',
        timestamp: '10 Nov 2026 · 08:45 AM',
        note: 'Reported abnormal mechanical knocking noise from gearbox.',
        actor: 'Rajesh Sharma',
      },
      {
        id: 'TL-402',
        status: 'Assigned',
        timestamp: '10 Nov 2026 · 09:30 AM',
        note: 'Assigned to Amit Verma (ENG001).',
        actor: 'Service Desk',
      },
      {
        id: 'TL-403',
        status: 'In Progress',
        timestamp: '11 Nov 2026 · 10:00 AM',
        note: 'Disassembled gearbox inspection cover and checked bearing clearance.',
        actor: 'Amit Verma',
      },
      {
        id: 'TL-404',
        status: 'Resolved',
        timestamp: '12 Nov 2026 · 04:30 PM',
        note: 'Thrust bearing replaced and full-load 2-hour production test passed.',
        actor: 'Amit Verma',
      },
    ],
  },
  {
    id: 'CMP-2026-005',
    machineId: 'PIM-002',
    customerId: 'CUST-001',
    category: 'Software/Control Issue',
    subject: 'HMI recipe screen slow touch response',
    description:
      'Operator HMI panel registers delayed touch response when switching mould parameter recipes.',
    priority: 'Low',
    status: 'Pending Assignment',
    registeredDate: '25 Nov 2026',
    images: [],
    timeline: [
      {
        id: 'TL-501',
        status: 'Complaint Registered',
        timestamp: '25 Nov 2026 · 08:50 AM',
        note: 'Ticket registered and queued for engineer assignment.',
        actor: 'Rajesh Sharma',
      },
    ],
  },
];

export const SAMPLE_SERVICE_VISITS: ServiceVisit[] = [
  {
    id: 'VIS-2026-001',
    complaintId: 'CMP-2026-001',
    machineId: 'PEM-001',
    engineerId: 'ENG001',
    engineerName: 'Amit Verma',
    visitDate: '22 Nov 2026',
    visitTime: '10:30 AM',
    serviceNotes:
      'Measured stator winding resistance and IR values (normal). Auxiliary cooling fan impeller cracked causing reduced airflow.',
    workPerformed:
      'Cleaned motor cooling fins, temporarily installed shop blower, and ordered OEM fan shroud assembly.',
    statusAfterVisit: 'In Progress',
    images: ['/src/assets/images/complaint_motor_overheat_1795676017674.jpg'],
    createdAt: '22 Nov 2026 · 12:15 PM',
  },
  {
    id: 'VIS-2026-002',
    complaintId: 'CMP-2026-002',
    machineId: 'PIM-002',
    engineerId: 'ENG001',
    engineerName: 'Amit Verma',
    visitDate: '20 Nov 2026',
    visitTime: '02:15 PM',
    serviceNotes:
      'Connected digital pressure transducer at clamp manifold. Proportional relief valve spool sticking under 140 bar load.',
    workPerformed:
      'Flushed pilot orifice, verified solenoid current (780 mA steady), raised spare part indent SPR-2026-001.',
    statusAfterVisit: 'Pending – Spare Parts Required',
    images: ['/src/assets/images/complaint_hydraulic_gauge_1795676018396.jpg'],
    createdAt: '20 Nov 2026 · 03:40 PM',
  },
  {
    id: 'VIS-2026-003',
    complaintId: 'CMP-2026-004',
    machineId: 'PEM-001',
    engineerId: 'ENG001',
    engineerName: 'Amit Verma',
    visitDate: '12 Nov 2026',
    visitTime: '11:00 AM',
    serviceNotes:
      'Vibration analysis confirmed axial play in input thrust bearing. No gear tooth pitting detected.',
    workPerformed:
      'Replaced SKF 7314B thrust bearing, laser-aligned motor coupling, and refilled synthetic gear oil.',
    resolutionDetails:
      'Machine running smoothly at 85 RPM continuous output with normal bearing temperature (52°C).',
    statusAfterVisit: 'Resolved',
    images: [],
    createdAt: '12 Nov 2026 · 04:30 PM',
  },
];

export const SAMPLE_SPARE_PARTS: SparePartRequest[] = [
  {
    id: 'SPR-2026-001',
    machineId: 'PIM-002',
    partName: 'Proportional Hydraulic Relief Valve',
    partNumber: 'HYD-PRV-450B',
    quantity: 1,
    description:
      'Required to fix clamping pressure oscillation reported under CMP-2026-002 on IM-450.',
    requestDate: '20 Nov 2026',
    status: 'Approved',
    images: ['/src/assets/images/complaint_hydraulic_gauge_1795676018396.jpg'],
    history: [
      {
        id: 'SH-101',
        status: 'Pending',
        timestamp: '20 Nov 2026 · 03:45 PM',
        note: 'Spare part request submitted after on-site hydraulic inspection.',
      },
      {
        id: 'SH-102',
        status: 'Approved',
        timestamp: '21 Nov 2026 · 10:15 AM',
        note: 'Approved under active machine warranty. Packing at Pune Central Warehouse.',
      },
    ],
  },
  {
    id: 'SPR-2026-002',
    machineId: 'PEM-001',
    partName: 'Drive Motor Cooling Fan Assembly',
    partNumber: 'ELC-FAN-1200',
    quantity: 2,
    description:
      '110 kW forced-ventilation axial fan unit and terminal cowl (1 replacement + 1 plant spare).',
    requestDate: '18 Nov 2026',
    status: 'Dispatched',
    images: [],
    history: [
      {
        id: 'SH-201',
        status: 'Pending',
        timestamp: '18 Nov 2026 · 01:10 PM',
        note: 'Request logged by ABC Plastics Industries.',
      },
      {
        id: 'SH-202',
        status: 'Approved',
        timestamp: '19 Nov 2026 · 09:40 AM',
        note: 'Warranty coverage verified and order approved.',
      },
      {
        id: 'SH-203',
        status: 'Dispatched',
        timestamp: '21 Nov 2026 · 05:20 PM',
        note: 'Dispatched via BlueDart Industrial Freight (AWB #BD8842109).',
      },
    ],
  },
];

export const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-001',
    title: 'Complaint Marked Resolved',
    message: 'Your complaint CMP-2026-004 has been marked as resolved.',
    timestamp: '12 Nov 2026 · 04:32 PM',
    read: false,
    targetType: 'complaint',
    targetId: 'CMP-2026-004',
  },
  {
    id: 'NOTIF-002',
    title: 'Spare Part Request Approved',
    message: 'Spare part request SPR-2026-001 has been approved.',
    timestamp: '21 Nov 2026 · 10:16 AM',
    read: false,
    targetType: 'spare_part',
    targetId: 'SPR-2026-001',
  },
  {
    id: 'NOTIF-003',
    title: 'Service Work Started',
    message: 'Engineer Amit Verma has started working on your complaint CMP-2026-001.',
    timestamp: '22 Nov 2026 · 10:32 AM',
    read: false,
    targetType: 'complaint',
    targetId: 'CMP-2026-001',
  },
  {
    id: 'NOTIF-004',
    title: 'Engineer Assigned',
    message: 'Your complaint CMP-2026-001 has been assigned to Engineer Amit Verma.',
    timestamp: '21 Nov 2026 · 10:06 AM',
    read: true,
    targetType: 'complaint',
    targetId: 'CMP-2026-001',
  },
  {
    id: 'NOTIF-005',
    title: 'Complaint Registered',
    message: 'Your complaint CMP-2026-001 has been successfully registered.',
    timestamp: '21 Nov 2026 · 09:15 AM',
    read: true,
    targetType: 'complaint',
    targetId: 'CMP-2026-001',
  },
];
