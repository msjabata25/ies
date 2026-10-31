/**
 * Each team member looks like:
 * {
 *   id: string,
 *   name: string,
 *   role: string,
 *   committee: 'Board' | 'Scientific' | 'Media' | 'Web',
 *   bio: string,
 *   photo?: string,                                // optional, e.g. '/team/ahmad.jpg'
 *   socials?: { instagram?: string, linkedin?: string },
 *   scatter: { rotate: number, tx: number, ty: number }, // bubble offset on the team page
 *   ar?: { name?: string, role?: string, bio?: string },  // Arabic copy; missing fields fall back to English
 * }
 */

/**
 * Two initials for avatar bubbles: "Ahmad Al-Khatib" → "AK", "أحمد الخطيب" → "أ.خ".
 * The article is skipped in both scripts (Al- / ال), and the dot keeps the two
 * Arabic letters from joining into a word.
 */
export function initialsOf(name) {
  const words = name.trim().split(/\s+/);
  if (/[؀-ۿ]/.test(name)) {
    return words.slice(0, 2).map((w) => (w.length > 2 ? w.replace(/^ال/, '') : w)[0]).join('.');
  }
  return words
    .map((n) => n.replace(/^al-/i, '')[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// 28 members with deterministic scatter positions
const scatterPositions = [
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

/* ---- Arabic (Jordanian, casual) copies of the placeholder data, index-aligned with the lists above ---- */

const firstNamesAr = [
  'أحمد', 'ليلى', 'عمر', 'سارة', 'محمد', 'نور', 'علي', 'هالة',
  'يوسف', 'دانا', 'حسن', 'رنا', 'إبراهيم', 'ميرا', 'خالد', 'لينا',
  'زيد', 'تالا', 'بشار', 'يارا', 'فادي', 'سلمى', 'حسين', 'آية',
  'طارق', 'ريما', 'سمير', 'لين',
];

const lastNamesAr = [
  'الخطيب', 'منصور', 'حداد', 'نصار', 'عبيدات', 'شمّا', 'الدجاني', 'قاسم',
  'فريج', 'زريقات', 'صبّاح', 'هلسة', 'طوقان', 'بركات', 'الخالدي', 'العناني',
  'جرار', 'النابلسي', 'التميمي', 'قطب', 'الحسيني', 'ساكت', 'الدباغ', 'شاهين',
  'معلوف', 'الرنتيسي', 'فارس', 'زهران',
];

/* m/f per member — the first-name list alternates male, female */
const genders = firstNamesAr.map((_, i) => (i % 2 ? 'f' : 'm'));

const rolesAr = {
  Board: [
    { m: 'رئيس الفرع', f: 'رئيسة الفرع' },
    { m: 'نائب الرئيس', f: 'نائبة الرئيس' },
    { m: 'أمين السر', f: 'أمينة السر' },
    { m: 'أمين الصندوق', f: 'أمينة الصندوق' },
    { m: 'الرئيس السابق', f: 'الرئيسة السابقة' },
    { m: 'مستشار', f: 'مستشارة' },
    { m: 'عضو هيئة', f: 'عضوة هيئة' },
  ],
  Scientific: [
    { m: 'مهندس رئيسي', f: 'مهندسة رئيسية' },
    { m: 'أخصائي بحث وتطوير', f: 'أخصائية بحث وتطوير' },
    { m: 'مهندس أنظمة مدمجة', f: 'مهندسة أنظمة مدمجة' },
    { m: 'مهندس أتمتة', f: 'مهندسة أتمتة' },
    { m: 'مهندس تحكم', f: 'مهندسة تحكم' },
    { m: 'مصمم أنظمة', f: 'مصممة أنظمة' },
    { m: 'باحث', f: 'باحثة' },
  ],
  Media: [
    { m: 'مسؤول المحتوى', f: 'مسؤولة المحتوى' },
    { m: 'مصمم جرافيك', f: 'مصممة جرافيك' },
    { m: 'مصوّر', f: 'مصوّرة' },
    { m: 'مونتير', f: 'مونتيرة' },
    { m: 'مسؤول السوشال ميديا', f: 'مسؤولة السوشال ميديا' },
    { m: 'كاتب محتوى', f: 'كاتبة محتوى' },
  ],
  Web: [
    { m: 'مطوّر فرونت إند', f: 'مطوّرة فرونت إند' },
    { m: 'مطوّر باك إند', f: 'مطوّرة باك إند' },
    { m: 'مهندس DevOps', f: 'مهندسة DevOps' },
    { m: 'مصمم UI/UX', f: 'مصممة UI/UX' },
    { m: 'مطوّر فل ستاك', f: 'مطوّرة فل ستاك' },
    { m: 'مسؤول قواعد البيانات', f: 'مسؤولة قواعد البيانات' },
  ],
};

const bioTemplatesAr = [
  { m: 'مركّز على {area} وعنده خبرة بـ {tech}. اشتغل قبل على {project}.', f: 'مركّزة على {area} وعندها خبرة بـ {tech}. اشتغلت قبل على {project}.' },
  { m: 'متخصص بـ {area} و{tech}. ماسك مبادرة {project}.', f: 'متخصصة بـ {area} و{tech}. ماسكة مبادرة {project}.' },
  { m: 'مهووس بـ {area}. ببني حلول {tech} لـ {project}.', f: 'مهووسة بـ {area}. بتبني حلول {tech} لـ {project}.' },
  { m: 'خلفيته {area} وعنده خبرة بـ {tech}. من الأساسيين بـ {project}.', f: 'خلفيتها {area} وعندها خبرة بـ {tech}. من الأساسيين بـ {project}.' },
];

const areasAr = [
  'الأنظمة المدمجة', 'الأتمتة الصناعية', 'إلكترونيات القدرة', 'أنظمة التحكم',
  'تصميم VLSI', 'الروبوتات', 'معالجة الإشارات', 'بنية إنترنت الأشياء',
  'تصميم PCB', 'تطوير الـ firmware', 'شبكات الحساسات', 'التحكم بالمحركات',
  'الطاقة المتجددة', 'التوائم الرقمية', 'بروتوكولات الـ fieldbus', 'أنظمة SCADA',
];

/* Tech names stay in English, like they're said in class; only the odd phrase needs Arabic */
const techsAr = {
  'python for automation': 'Python للأتمتة',
};

const projectsAr = [
  'محاكاة المصنع الذكي', 'درون الفحص الذاتي', 'منصة الصيانة التنبؤية',
  'متحكم الشبكة الشمسية الصغيرة', 'نظام الرؤية الصناعية', 'مسرّع الذكاء الاصطناعي على الطرف',
  'إطار التوأم الرقمي', 'مصفوفة الحساسات اللاسلكية',
];

function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export const team = Array.from({ length: 28 }, (_, i) => {
  const committees = ['Board', 'Board', 'Board', 'Scientific', 'Scientific', 'Scientific', 'Scientific', 'Media', 'Media', 'Web', 'Web', 'Scientific', 'Scientific', 'Media', 'Board', 'Scientific', 'Scientific', 'Media', 'Web', 'Board', 'Scientific', 'Web', 'Media', 'Scientific', 'Board', 'Media', 'Scientific', 'Web'];
  const roles = {
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
  const roleIndex = Math.floor(seededRandom(seed) * roleList.length);
  const role = roleList[roleIndex];
  const bioIndex = Math.floor(seededRandom(seed + 100) * bioTemplates.length);
  const areaIndex = Math.floor(seededRandom(seed + 200) * areas.length);
  const tech = techs[Math.floor(seededRandom(seed + 300) * techs.length)];
  const projectIndex = Math.floor(seededRandom(seed + 400) * projects.length);
  const bio = bioTemplates[bioIndex]
    .replace('{area}', areas[areaIndex])
    .replace('{tech}', tech)
    .replace('{project}', projects[projectIndex]);

  /* Arabic copy — roles and bios agree with the member's gender (alternating in this placeholder list) */
  const g = genders[i];
  const bioAr = bioTemplatesAr[bioIndex][g]
    .replace('{area}', areasAr[areaIndex])
    .replace('{tech}', techsAr[tech] ?? tech)
    .replace('{project}', projectsAr[projectIndex]);

  return {
    id: `member-${i + 1}`,
    name: `${firstName} ${lastName}`,
    role,
    committee,
    bio,
    socials: undefined,
    scatter: scatterPositions[i],
    ar: {
      name: `${firstNamesAr[i]} ${lastNamesAr[i]}`,
      role: rolesAr[committee][roleIndex][g],
      bio: bioAr,
    },
  };
});
