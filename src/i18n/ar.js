/*
 * Arabic copy — casual Jordanian dialect, not Fusha. Keep it friendly and
 * talk to people like a fellow student would ("شو", "هسا", "بدك", "يلا").
 * Technical terms (PLC, PCB, Python…) stay in English like they do in class.
 * Anything missing here falls back to en.js.
 */
export default {
  meta: {
    title: 'IES JUST — الفرع الطلابي',
  },

  nav: {
    home: 'الرئيسية',
    about: 'مين إحنا',
    events: 'الفعاليات',
    team: 'الفريق',
    console: 'القائمة',
    openMenu: 'افتح القائمة',
    closeMenu: 'سكّر القائمة',
    lightMode: 'بدّل للوضع الفاتح',
    switchLang: 'Switch to English',
    langLabel: 'EN',
  },

  footer: {
    tagline: 'جمعية الإلكترونيات الصناعية — الفرع الطلابي بالتكنو',
    about: 'مين إحنا',
    events: 'الفعاليات',
    team: 'الفريق',
    home: 'الرئيسية',
    linkOffline: '[الرابط لسا مش جاهز]',
    comingSoon: 'قريبًا',
    poweredBy: 'IES_JUST // بدعم من IEEE',
    location: 'إربد، الأردن',
  },

  hero: {
    title: 'يلا نشغّل\nالنظام',
    coords: 'الإحداثيات: 32.5514° ش، 35.8515° ق',
    log: 'سجل',
    boot: [
      '> قاعدين نشغّل النظام...',
      '> بنحمّل وحدات IES...',
      '> بنوصل عالشبكة...',
      '> [OK] كلّو جاهز، يلا!',
    ],
    status: 'الحالة: شغّالين',
    network: 'الشبكة: متصلة',
  },

  aboutSnippet: {
    title: 'مين إحنا؟',
    p1: 'إحنا IES JUST، الفرع الطلابي الرسمي لجمعية IEEE للإلكترونيات الصناعية هون بجامعة العلوم والتكنولوجيا (التكنو).',
    p2: 'بنبني، بنأتمت، وبنطلع بأفكار جديدة — من الأنظمة المدمجة للتحكم الصناعي، مشروع ورا مشروع.',
    locked: 'ممنوع الدخول — افتح /about',
    unlocked: 'تمام، تفضّل ادخل',
  },

  stats: {
    members: 'عضو انضمّوا',
    events: 'فعالية عملناها',
    workshops: 'ورشة قدّمناها',
    projects: 'مشروع طلّعناه',
    hackathonHours: 'ساعة هاكاثون',
    speakers: 'ضيف حكى معنا',
  },

  eventsPreview: {
    title: 'شو عنّا هالفترة',
    next: 'الجاي',
    logged: 'صار',
    cta: 'شوف شو جاي ←',
    classifiedTitle: '؟؟؟',
    classified: 'سرّي — لسا ما بنقدر نحكي',
  },

  teamPreview: {
    title: 'فريق القيادة',
    cta: 'تعرّف عالفريق كامل ←',
  },

  join: {
    title: 'بدك تنضملنا؟',
    subtitle: 'IES فاتحين باب التسجيل هسا. لا تفوّت الفرصة!',
    button: 'يلا قدّم طلبك',
  },

  about: {
    title: 'مين إحنا؟',
    loading: '> بنحمّل ملف الفرع... [OK]',
    scroll: 'انزل لتحت عشان نبلّش —',
    quadrants: {
      q1: {
        title: 'هويّتنا_',
        lines: ['> مين إحنا', 'الفرع الطلابي الرسمي لـ IEEE IES بالتكنو', 'شغّالين بالإلكترونيات الصناعية من 2023', 'أكتر من 60 عضو فعّال موزّعين على 4 لجان'],
      },
      q3: {
        title: 'خبرتنا_',
        lines: ['> شو بنشتغل فيه', 'PLC / SCADA / برمجة الأنظمة المدمجة', 'تصميم PCB / إنترنت الأشياء الصناعي / نظرية التحكم', 'إلكترونيات القدرة / معالجة الإشارات الرقمية'],
      },
      q2: {
        title: 'رسالتنا_',
        lines: ['> شو بنعمل', 'بنقرّب الجامعة من سوق الشغل', 'بمشاريع عملية بالأتمتة والأنظمة المدمجة', 'وهندسة التحكم الصناعي.'],
      },
      q4: {
        title: 'وين رايحين_',
        lines: ['> شو ناويين', 'نفتح مختبر بحثي معتمد من IEEE', 'نعمل أكبر معرض هندسي طلابي بالأردن', 'نبني أدوات أتمتة صناعية مفتوحة المصدر'],
      },
    },
  },

  events: {
    particle: 'الفعاليات',
    statusLabel: 'الحالة:',
    empty: '> ما في فعاليات بهالفلتر_',
    types: { All: 'الكل', Workshop: 'ورش', Seminar: 'ندوات', Hackathon: 'هاكاثونات', Expo: 'معارض' },
    statuses: { All: 'الكل', Upcoming: 'جاي', Active: 'شغّال هسا', Past: 'خلص' },
    typeNames: { Workshop: 'ورشة', Seminar: 'ندوة', Hackathon: 'هاكاثون', Expo: 'معرض' },
    dateLocale: 'ar-JO-u-nu-latn',
  },

  team: {
    title: 'دليل الفريق',
    count: '> {count} عضو مسجّلين بـ 4 لجان',
    committees: { All: 'الكل', Board: 'الهيئة الإدارية', Scientific: 'اللجنة العلمية', Media: 'اللجنة الإعلامية', Web: 'لجنة الويب' },
    close: 'سكّر',
  },

  apply: {
    title: 'طلب الانضمام',
    subtitle: '> طلب انضمام جديد — بياخذ معك 3 دقايق تقريبًا',
    devBanner: 'وضع التطوير: VITE_APPLICATION_ENDPOINT مش محطوط، فالطلبات بتنطبع بالـ console بس.',
    formBadge: 'نموذج',
    steps: ['معلوماتك', 'دراستك', 'اهتماماتك', 'ليش IES؟', 'راجع طلبك'],
    stepCount: 'خطوة {n} من {total}',
    optional: '(اختياري)',
    listSep: '، ',
    errPrefix: 'خطأ:',
    labels: {
      fullName: 'اسمك الكامل',
      email: 'الإيميل',
      phone: 'رقم الموبايل',
      studentId: 'الرقم الجامعي',
      major: 'التخصص',
      otherMajor: 'شو تخصصك؟',
      year: 'السنة',
      committees: 'اللجان',
      committeesHint: '(اختار وحدة أو أكتر)',
      skills: 'المهارات',
      skillsHint: '(اختياري — أي إشي بتحبه)',
      otherSkills: 'في إشي كمان؟',
      motivation: 'ليش حابب تنضم لـ IES؟',
      link: 'GitHub / بورتفوليو / LinkedIn',
    },
    hints: {
      email: 'إيميل الجامعة أو الشخصي — رح نردّ عليك عليه',
      studentId: 'عشان نتأكد إنك طالب بالتكنو',
      motivation: '{n}/{max} — شو حابب تتعلم، تبني، أو تضيف',
    },
    placeholders: {
      fullName: 'أحمد الخطيب',
      email: 'you@just.edu.jo',
      phone: '07X XXX XXXX',
      studentId: '123456',
      otherSkills: 'Rust، طباعة 3D، نادي روبوتات…',
      link: 'https://github.com/you',
    },
    selectPlaceholder: 'اختار…',
    majors: {
      'Electrical Engineering': 'هندسة كهربائية',
      'Computer Engineering': 'هندسة حاسوب',
      'Biomedical Engineering': 'هندسة طبية حيوية',
      'Mechanical Engineering': 'هندسة ميكانيكية',
      'Computer Science': 'علم الحاسوب',
      Other: 'إشي تاني',
    },
    years: {
      '1st year': 'سنة أولى',
      '2nd year': 'سنة تانية',
      '3rd year': 'سنة تالتة',
      '4th year': 'سنة رابعة',
      '5th year': 'سنة خامسة',
      Graduate: 'دراسات عليا',
    },
    committees: {
      Scientific: { name: 'العلمية', blurb: 'ورش، مشاريع، ومحتوى تقني' },
      Media: { name: 'الإعلامية', blurb: 'تصميم، تصوير وفيديو، وسوشال ميديا' },
      Web: { name: 'الويب', blurb: 'هالموقع وأدوات الفرع' },
    },
    skills: {
      'Embedded C': 'Embedded C',
      'PCB design': 'تصميم PCB',
      'PLC / SCADA': 'PLC / SCADA',
      Python: 'Python',
      'MATLAB / Simulink': 'MATLAB / Simulink',
      'Power electronics': 'إلكترونيات القدرة',
      'Web dev': 'تطوير ويب',
      'Graphic design': 'تصميم جرافيك',
      'Photo / video': 'تصوير وفيديو',
      Writing: 'كتابة',
      'Event organizing': 'تنظيم فعاليات',
      'Public speaking': 'تقديم وإلقاء',
    },
    review: {
      fullName: 'الاسم',
      email: 'الإيميل',
      phone: 'الموبايل',
      studentId: 'الرقم الجامعي',
      major: 'التخصص',
      year: 'السنة',
      committees: 'اللجان',
      skills: 'المهارات',
      motivation: 'ليش IES',
      link: 'الرابط',
      edit: 'عدّل',
    },
    errors: {
      fullName: 'اكتب اسمك الكامل',
      email: 'اكتب إيميل صحيح',
      phone: 'رقم موبايل محلي، مثلًا 0791234567 (بدون +962)',
      studentIdMissing: 'بدنا رقمك الجامعي عشان نتأكد منك',
      studentIdFormat: 'الرقم الجامعي 6 أرقام',
      major: 'اختار تخصصك',
      otherMajor: 'احكيلنا شو تخصصك',
      year: 'اختار سنتك',
      committees: 'اختار لجنة وحدة عالأقل',
      motivation: 'زيد كمان شوي — ناقص {n} حرف',
      link: 'خلّي الرابط يبلّش بـ http:// أو https://',
      submit: 'خطأ: ما زبط الإرسال ({reason}). إجاباتك محفوظة — جرّب كمان شوي.',
    },
    back: 'رجوع',
    next: 'التالي',
    sending: 'قاعدين نبعت…',
    submit: 'ابعت الطلب',
    done: {
      uploading: '> بنرفع طلبك... [OK]',
      notifying: '> بنخبّر فريق التسجيل... [OK]',
      received: '> وصلنا طلبك // الرقم المرجعي: {ref}',
      thanks: 'يسلموا{name}! رح نرجعلك على',
      namePart: ' يا {name}',
      keepRef: '. خلّي الرقم المرجعي معك إذا احتجت تتابع معنا.',
      devNote: 'وضع التطوير: ما في endpoint، فالطلب ما انحفظ بأي مكان.',
      home: 'ارجع للرئيسية',
    },
    closed: {
      title: 'التسجيل مسكّر حاليًا',
      body: 'باب التسجيل لسا ما فتح. تابعنا على إنستغرام عشان تعرف أول ما يفتح.',
    },
  },

  eggs: {
    crtOn: 'وضع الـ CRT: شغّال',
    crtOff: 'وضع الـ CRT: طافي',
    sudoGranted: '[sudo] تمام، إلك صلاحية — أهلين فيك يا بطل.',
    sudoElsewhere: '[sudo] بوابة الانضمام بالصفحة الرئيسية — جرّبها من هناك',
  },
};
