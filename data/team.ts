export type Committee = 'Board' | 'Scientific' | 'Media' | 'Web';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  committee: Committee;
  bio: string;
  photo?: string;
  socials?: { instagram?: string; linkedin?: string };
  scatter: { rotate: number; tx: number; ty: number };
}

// 28 members with deterministic scatter positions
const scatterPositions: { rotate: number; tx: number; ty: number }[] = [
  { rotate: -2, tx: 0, ty: 0 },
  { rotate: 3, tx: 20, ty: -15 },
  { rotate: -4, tx: -15, ty: 25 },
  { rotate: 1, tx: 30, ty: 10 },
  { rotate: -5, tx: -25, ty: -20 },
  { rotate: 6, tx: 10, ty: 35 },
  { rotate: -3, tx: -10, ty: -30 },
  { rotate: 2, tx: 40, ty: -10 },
  { rotate: -6, tx: -35, ty: 15 },
  { rotate: 4, tx: 15, ty: -25 },
  { rotate: -1, tx: -5, ty: 40 },
  { rotate: 5, tx: 25, ty: -5 },
  { rotate: -7, tx: -20, ty: -35 },
  { rotate: 0, tx: 35, ty: 20 },
  { rotate: 7, tx: -30, ty: -10 },
  { rotate: -2, tx: 5, ty: 30 },
  { rotate: 3, tx: -40, ty: 5 },
  { rotate: -5, tx: 20, ty: -40 },
  { rotate: 1, tx: -10, ty: -15 },
  { rotate: -3, tx: 30, ty: -30 },
  { rotate: 4, tx: -20, ty: 35 },
  { rotate: -6, tx: 10, ty: -5 },
  { rotate: 2, tx: -35, ty: 25 },
  { rotate: -4, tx: 25, ty: 15 },
  { rotate: 5, tx: -15, ty: -25 },
  { rotate: -1, tx: 35, ty: -35 },
  { rotate: 6, tx: -25, ty: 30 },
  { rotate: -7, tx: 15, ty: -20 },
];

const firstNames = [
  'Ahmad', 'Layla', 'Omar', 'Sara', 'Mohammad', 'Noor', 'Ali', 'Hala',
  'Yousef', 'Dana', 'Hassan', 'Rana', 'Ibrahim', 'Mira', 'Khalid', 'Lina',
  'Zaid', 'Tala', 'Bashar', 'Yara', 'Fadi', 'Salma', 'Hussein', 'Aya',
  'Tariq', 'Rima', 'Samir', 'Leen',
];

const lastNames = [
  'Al-Khatib', 'Mansour', 'Haddad', 'Nassar', 'Obeidat', 'Shamma', 'Dajani', 'Qasim',
  'Freij', 'Zureikat', 'Sabbah', 'Halasa', 'Tuqan', 'Barakat', 'Khalidi', 'Anani',
  'Jarrar', 'Nabulsi', 'Tamimi', 'Qutb', 'Husseini', 'Saket', 'Dabbagh', 'Shahin',
  'Maalouf', 'Rantisi', 'Fares', 'Zahran',
];

const bioTemplates = [
  'focuses on {area} with experience in {tech}. previously worked on {project}.',
  'specializes in {area} and {tech}. leads the {project} initiative.',
  '{area} enthusiast. builds {tech} solutions for {project}.',
  'background in {area} with {tech} expertise. core contributor to {project}.',
];

const areas = [
  'embedded systems', 'industrial automation', 'power electronics', 'control systems',
  'vlsi design', 'robotics', 'signal processing', 'iot infrastructure',
  'pcb design', 'firmware development', 'sensor networks', 'motor control',
  'renewable energy', 'digital twins', 'fieldbus protocols', 'scada systems',
];

const techs = [
  'c/c++/rust', 'altium/kicad', 'matlab/simulink', 'stm32/esp32',
  'python for automation', 'verilog/vhdl', 'linux yocto', 'plc scada',
  'ros2/gazebo', 'ltspice/psim', 'opencv', 'tensorflow lite',
  'modbus/profinet', 'freertos/zephyr', 'kafka/mqtt', 'docker/kubernetes',
];

const projects = [
  'smart factory simulation', 'autonomous inspection drone', 'predictive maintenance platform',
  'solar microgrid controller', 'industrial vision system', 'edge ai accelerator',
  'digital twin framework', 'wireless sensor array',
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export const team: TeamMember[] = Array.from({ length: 28 }, (_, i) => {
  const committees: Committee[] = ['Board', 'Board', 'Board', 'Scientific', 'Scientific', 'Scientific', 'Scientific', 'Media', 'Media', 'Web', 'Web', 'Scientific', 'Scientific', 'Media', 'Board', 'Scientific', 'Scientific', 'Media', 'Web', 'Board', 'Scientific', 'Web', 'Media', 'Scientific', 'Board', 'Media', 'Scientific', 'Web'];
  const roles: { [key in Committee]: string[] } = {
    Board: ['Chair', 'Vice Chair', 'Secretary', 'Treasurer', 'Past Chair', 'Advisor', 'Member at Large'],
    Scientific: ['Lead Engineer', 'R&D Specialist', 'Embedded Engineer', 'Automation Engineer', 'Controls Engineer', 'Systems Architect', 'Research Associate'],
    Media: ['Content Lead', 'Graphic Designer', 'Photographer', 'Video Editor', 'Social Media Manager', 'Copywriter'],
    Web: ['Frontend Dev', 'Backend Dev', 'DevOps Engineer', 'UI/UX Designer', 'Full Stack Dev', 'Database Admin'],
  };

  const committee = committees[i];
  const seed = i * 137 + 42;
  const firstName = firstNames[i];
  const lastName = lastNames[i];
  const roleList = roles[committee];
  const role = roleList[Math.floor(seededRandom(seed) * roleList.length)];
  const bio = bioTemplates[Math.floor(seededRandom(seed + 100) * bioTemplates.length)]
    .replace('{area}', areas[Math.floor(seededRandom(seed + 200) * areas.length)])
    .replace('{tech}', techs[Math.floor(seededRandom(seed + 300) * techs.length)])
    .replace('{project}', projects[Math.floor(seededRandom(seed + 400) * projects.length)]);

  return {
    id: `member-${i + 1}`,
    name: `${firstName} ${lastName}`,
    role,
    committee,
    bio,
    socials: {
      instagram: `#`,
      linkedin: `#`,
    },
    scatter: scatterPositions[i],
  };
});
