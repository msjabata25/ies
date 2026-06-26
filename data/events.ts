export type EventStatus = 'Upcoming' | 'Active' | 'Past';
export type EventType = 'Workshop' | 'Hackathon' | 'Seminar' | 'Expo';

export interface ChapterEvent {
  id: string;
  title: string;
  date: string;
  type: EventType;
  status: EventStatus;
  description: string;
  imageUrl?: string;
}

export const events: ChapterEvent[] = [
  {
    id: 'ev-001',
    title: 'PLC_PROGRAMMING_01',
    date: '2026-09-15',
    type: 'Workshop',
    status: 'Upcoming',
    description: 'intro to ladder logic and plc programming for industrial automation. bring your laptop.',
  },
  {
    id: 'ev-002',
    title: 'HACKATHON_24H',
    date: '2026-08-01',
    type: 'Hackathon',
    status: 'Active',
    description: '24-hour embedded systems challenge. teams build a smart sensor node from scratch.',
  },
  {
    id: 'ev-003',
    title: 'SEMICONDUCTOR_SEMINAR',
    date: '2026-07-20',
    type: 'Seminar',
    status: 'Active',
    description: 'guest lecture on modern vlsi design and fpga applications in industry.',
  },
  {
    id: 'ev-004',
    title: 'ROBOTICS_EXPO_2026',
    date: '2026-10-05',
    type: 'Expo',
    status: 'Upcoming',
    description: 'annual showcase of student-built industrial robotics and automation systems.',
  },
  {
    id: 'ev-005',
    title: 'PCB_DESIGN_WORKSHOP',
    date: '2026-06-10',
    type: 'Workshop',
    status: 'Past',
    description: 'hands-on pcb design using kicad. from schematic to gerber files.',
  },
  {
    id: 'ev-006',
    title: 'CONTROL_SYSTEMS_BOOTCAMP',
    date: '2026-11-01',
    type: 'Workshop',
    status: 'Upcoming',
    description: 'intensive bootcamp on pid tuning, state-space control, and simulink modeling.',
  },
  {
    id: 'ev-007',
    title: 'AI_IN_INDUSTRY',
    date: '2026-09-01',
    type: 'Seminar',
    status: 'Upcoming',
    description: 'exploring machine learning applications in predictive maintenance and quality control.',
  },
  {
    id: 'ev-008',
    title: 'RECRUITMENT_DRIVE',
    date: '2026-07-01',
    type: 'Seminar',
    status: 'Active',
    description: 'join ies just — open call for engineers, designers, and operators.',
  },
];
