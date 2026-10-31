/**
 * Each event looks like:
 * {
 *   id: string,           // unique, e.g. 'ev-001'
 *   title: string,
 *   date: string,         // 'YYYY-MM-DD'
 *   type: 'Workshop' | 'Hackathon' | 'Seminar' | 'Expo',
 *   status: 'Upcoming' | 'Active' | 'Past',
 *   description: string,
 *   imageUrl?: string,    // optional
 *   ar?: { title?: string, description?: string }, // Arabic copy; falls back to English
 * }
 */
export const events = [
  {
    id: 'ev-001',
    title: 'PLC_PROGRAMMING_01',
    date: '2026-09-15',
    type: 'Workshop',
    status: 'Upcoming',
    description: 'intro to ladder logic and plc programming for industrial automation. bring your laptop.',
    ar: {
      title: 'ورشة برمجة PLC',
      description: 'مقدمة للـ ladder logic وبرمجة الـ PLC للأتمتة الصناعية. جيب لابتوبك معك.',
    },
  },
  {
    id: 'ev-002',
    title: 'HACKATHON_24H',
    date: '2026-08-01',
    type: 'Hackathon',
    status: 'Active',
    description: '24-hour embedded systems challenge. teams build a smart sensor node from scratch.',
    ar: {
      title: 'هاكاثون 24 ساعة',
      description: 'تحدّي أنظمة مدمجة لمدة 24 ساعة. كل فريق ببني عقدة حساسات ذكية من الصفر.',
    },
  },
  {
    id: 'ev-003',
    title: 'SEMICONDUCTOR_SEMINAR',
    date: '2026-07-20',
    type: 'Seminar',
    status: 'Active',
    description: 'guest lecture on modern vlsi design and fpga applications in industry.',
    ar: {
      title: 'ندوة أشباه الموصلات',
      description: 'محاضرة مع ضيف عن تصميم VLSI الحديث وتطبيقات الـ FPGA بالصناعة.',
    },
  },
  {
    id: 'ev-004',
    title: 'ROBOTICS_EXPO_2026',
    date: '2026-10-05',
    type: 'Expo',
    status: 'Upcoming',
    description: 'annual showcase of student-built industrial robotics and automation systems.',
    ar: {
      title: 'معرض الروبوتات 2026',
      description: 'المعرض السنوي للروبوتات وأنظمة الأتمتة الصناعية اللي بنوها الطلاب.',
    },
  },
  {
    id: 'ev-005',
    title: 'PCB_DESIGN_WORKSHOP',
    date: '2026-06-10',
    type: 'Workshop',
    status: 'Past',
    description: 'hands-on pcb design using kicad. from schematic to gerber files.',
    ar: {
      title: 'ورشة تصميم PCB',
      description: 'تصميم PCB عملي على KiCad، من السكيماتيك لحد ملفات الـ Gerber.',
    },
  },
  {
    id: 'ev-006',
    title: 'CONTROL_SYSTEMS_BOOTCAMP',
    date: '2026-11-01',
    type: 'Workshop',
    status: 'Upcoming',
    description: 'intensive bootcamp on pid tuning, state-space control, and simulink modeling.',
    ar: {
      title: 'معسكر أنظمة التحكم',
      description: 'بوتكامب مكثّف عن ضبط الـ PID، والتحكم بفضاء الحالة، والنمذجة على Simulink.',
    },
  },
  {
    id: 'ev-007',
    title: 'AI_IN_INDUSTRY',
    date: '2026-09-01',
    type: 'Seminar',
    status: 'Upcoming',
    description: 'exploring machine learning applications in predictive maintenance and quality control.',
    ar: {
      title: 'الذكاء الاصطناعي بالصناعة',
      description: 'بنحكي عن تطبيقات تعلّم الآلة بالصيانة التنبؤية وضبط الجودة.',
    },
  },
  {
    id: 'ev-008',
    title: 'RECRUITMENT_DRIVE',
    date: '2026-07-01',
    type: 'Seminar',
    status: 'Active',
    description: 'join ies just — open call for engineers, designers, and operators.',
    ar: {
      title: 'حملة التسجيل',
      description: 'انضم لـ IES JUST — الباب مفتوح للمهندسين والمصممين وكل حدا عنده شغف.',
    },
  },
];
