import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  COMMITTEES,
  MAJORS,
  SKILLS,
  YEARS,
  applicationsOpen,
  submissionsStubbed,
  submitApplication,
} from '@/lib/applications';

const DRAFT_KEY = 'ies-apply-draft';
const MOTIVATION_MIN = 40;
const MOTIVATION_MAX = 600;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = {
  fullName: '',
  email: '',
  phone: '',
  studentId: '',
  major: '',
  otherMajor: '',
  year: '',
  committees: [],
  skills: [],
  otherSkills: '',
  motivation: '',
  link: '',
  website: '', // honeypot: hidden from people, bots fill it in
};

const STEPS = ['IDENTITY', 'ACADEMICS', 'INTERESTS', 'MOTIVATION', 'REVIEW'];
const LAST = STEPS.length - 1;

/* Half-finished applications survive a reload (per browser only). */
function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw), website: '' };
  } catch {
    /* storage blocked or corrupt — start fresh */
  }
  return EMPTY;
}

function saveDraft(data) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

function validate(step, d) {
  const e = {};
  if (step === 0) {
    if (d.fullName.trim().length < 3) e.fullName = 'enter your full name';
    if (!EMAIL.test(d.email.trim())) e.email = 'enter a valid email address';
    if (d.phone.trim() && !/^\+?[\d\s-]{7,20}$/.test(d.phone.trim())) e.phone = 'digits, spaces, + and - only';
    if (d.studentId.trim() && !/^\d{5,12}$/.test(d.studentId.trim())) e.studentId = 'digits only';
  }
  if (step === 1) {
    if (!d.major) e.major = 'pick your major';
    if (d.major === 'Other' && !d.otherMajor.trim()) e.otherMajor = 'tell us your major';
    if (!d.year) e.year = 'pick your year';
  }
  if (step === 2 && !d.committees.length) e.committees = 'pick at least one committee';
  if (step === 3) {
    const n = d.motivation.trim().length;
    if (n < MOTIVATION_MIN) e.motivation = `a little more please — ${MOTIVATION_MIN - n} more characters`;
    if (d.link.trim() && !/^https?:\/\/\S+\.\S+/.test(d.link.trim())) e.link = 'start the link with http:// or https://';
  }
  return e;
}

function toPayload(d) {
  const optional = (v) => v.trim() || undefined;
  return {
    fullName: d.fullName.trim(),
    email: d.email.trim(),
    phone: optional(d.phone),
    studentId: optional(d.studentId),
    major: d.major === 'Other' ? d.otherMajor.trim() : d.major,
    year: d.year,
    committees: d.committees,
    skills: d.skills,
    otherSkills: optional(d.otherSkills),
    motivation: d.motivation.trim(),
    link: optional(d.link),
    submittedAt: new Date().toISOString(),
    source: 'website',
  };
}

const inputClass = (error) =>
  `w-full bg-[#0A0A0A] border ${error ? 'border-red-400/70' : 'border-[#1E88E5]/40'} focus:border-[#F57C00] outline-none px-3 py-2.5 font-mono text-[16px] text-[#dec1af] placeholder:text-gray-600 transition-colors`;

function Field({ id, label, optional, hint, error, children }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-mono text-[13px] text-[#1E88E5]">
        {'> '}
        {label}
        {optional && <span className="text-gray-500"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="font-mono text-[12px] text-red-400">ERR: {error}</p>
      ) : (
        hint && <p className="font-mono text-[12px] text-gray-500">{hint}</p>
      )}
    </div>
  );
}

function Chip({ on, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`font-mono text-[13px] px-3 py-2 border transition-colors cursor-pointer ${
        on ? 'border-[#F57C00] bg-[#F57C00]/15 text-[#F57C00]' : 'border-[#1E88E5]/40 text-[#dec1af] hover:border-[#F57C00]/60'
      }`}
    >
      <span className="text-[#1E88E5]">{on ? '[x] ' : '[ ] '}</span>
      {children}
    </button>
  );
}

function Progress({ step }) {
  return (
    <div className="font-mono text-[13px] text-[#dec1af] mb-8" aria-live="polite">
      <div className="flex gap-1 mb-2" aria-hidden="true">
        {STEPS.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 ${i <= step ? 'bg-[#F57C00]' : 'bg-[#1E88E5]/20'} transition-colors duration-300`} />
        ))}
      </div>
      <span className="text-[#1E88E5]">STEP {step + 1}/{STEPS.length}</span>
      <span className="text-gray-600"> // </span>
      <span className="text-[#F57C00]">{STEPS[step]}</span>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }) {
  return (
    <div className="flex gap-4 py-2.5 border-b border-[#1E88E5]/15 font-mono text-[14px]">
      <dt className="w-32 shrink-0 text-[#1E88E5]">{label}</dt>
      <dd className="flex-1 text-[#dec1af] break-words min-w-0">{value || <span className="text-gray-600">—</span>}</dd>
      <button type="button" onClick={onEdit} className="text-[12px] text-[#F57C00]/80 hover:text-[#F57C00] cursor-pointer shrink-0">
        EDIT
      </button>
    </div>
  );
}

function Header() {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-3">
        <span className="material-symbols-outlined text-[#F57C00] text-3xl">assignment_ind</span>
        <h1 className="text-[36px] md:text-[56px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display">
          APPLICATION.EXE<span className="cursor-blink font-mono">_</span>
        </h1>
      </div>
      <p className="font-mono text-[13px] md:text-[15px] text-[#1E88E5]">{`C:\\> new member onboarding — takes about 3 minutes`}</p>
    </div>
  );
}

export default function ApplyPage() {
  const [data, setData] = useState(loadDraft);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [reference, setReference] = useState('');
  const [failure, setFailure] = useState('');
  const stepRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (status !== 'done') saveDraft(data);
  }, [data, status]);

  /* Move focus into each new step (not on page load, so phones don't pop the keyboard). */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepRef.current?.querySelector('input, select, textarea, button')?.focus({ preventScroll: true });
  }, [step]);

  const set = (field) => (value) => {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };
  const toggle = (field, value) => {
    const list = data[field];
    set(field)(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };
  const goTo = (n) => {
    setErrors({});
    setStep(n);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;

    if (step < LAST) {
      const found = validate(step, data);
      if (Object.values(found).some(Boolean)) {
        setErrors(found);
        stepRef.current?.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      goTo(step + 1);
      return;
    }

    setStatus('sending');
    setFailure('');
    try {
      /* A filled honeypot means a bot: act as if it worked, send nothing. */
      const result = data.website
        ? { reference: 'IES-000000' }
        : await submitApplication(toPayload(data));
      clearDraft();
      setReference(result.reference);
      setStatus('done');
    } catch (err) {
      setFailure(err.message || 'unknown error');
      setStatus('error');
    }
  };

  if (!applicationsOpen) {
    return (
      <main className="min-h-screen pt-28 pb-24 px-4 md:px-14 max-w-3xl mx-auto">
        <Header />
        <div className="bg-[#0e0e0e] border border-[#1E88E5]/30 p-6 font-mono text-[14px] leading-[180%] text-[#dec1af] space-y-2">
          <p className="text-[#F57C00]">{'> '}APPLICATIONS_OFFLINE</p>
          <p>The application portal isn&apos;t open yet. Follow us on Instagram to hear when recruitment starts.</p>
          <a
            href="https://www.instagram.com/ieeeiesjust/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 border border-[#F57C00] text-[#F57C00] px-5 py-2.5 hover:bg-[#F57C00] hover:text-[#0A0A0A] transition-colors"
          >
            @IEEEIESJUST →
          </a>
        </div>
      </main>
    );
  }

  if (status === 'done') {
    return (
      <main className="min-h-screen pt-28 pb-24 px-4 md:px-14 max-w-3xl mx-auto">
        <Header />
        <div className="bg-[#0e0e0e] border border-[#F57C00]/50 p-6 font-mono text-[14px] leading-[190%] text-[#dec1af] animate-in fade-in duration-500">
          <p className="text-[#1E88E5]">{'> '}UPLOADING APPLICATION... [OK]</p>
          <p className="text-[#1E88E5]">{'> '}NOTIFYING RECRUITMENT TEAM... [OK]</p>
          <p className="text-[#F57C00] mt-3">{'> '}APPLICATION RECEIVED // REF: {reference}</p>
          <p className="mt-3">
            Thanks{data.fullName ? `, ${data.fullName.trim().split(/\s+/)[0]}` : ''}. We&apos;ll get back to you at{' '}
            <span className="text-[#F57C00]">{data.email.trim()}</span>. Keep your reference in case you need to follow up.
          </p>
          {submissionsStubbed && (
            <p className="mt-3 text-yellow-400/80 text-[12px]">DEV: no endpoint configured — this application was not saved anywhere.</p>
          )}
          <Link
            to="/"
            className="inline-block mt-6 border border-[#1E88E5] text-[#1E88E5] px-5 py-2.5 hover:bg-[#1E88E5] hover:text-[#0A0A0A] transition-colors"
          >
            {'<'} BACK TO TERMINAL
          </Link>
        </div>
      </main>
    );
  }

  const err = (field) => ({
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  return (
    <main className="min-h-screen pt-28 pb-24 px-4 md:px-14 max-w-3xl mx-auto">
      <Header />

      {submissionsStubbed && (
        <p className="mb-6 font-mono text-[12px] text-yellow-400/80 border border-yellow-400/30 px-3 py-2">
          DEV MODE: VITE_APPLICATION_ENDPOINT isn&apos;t set, so submissions are only logged to the console.
        </p>
      )}

      <form onSubmit={onSubmit} noValidate className="bg-[#0e0e0e] border border-[#1E88E5]/30 p-5 md:p-8 relative">
        <div className="absolute top-0 right-0 px-2 py-0.5 text-[10px] font-mono bg-[#1E88E5] text-[#0A0A0A]">FORM</div>
        <Progress step={step} />

        {/* Honeypot — off-screen and skipped by keyboard and screen readers */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set('website')(e.target.value)} />
          </label>
        </div>

        <div ref={stepRef} key={step} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          {step === 0 && (
            <>
              <Field id="fullName" label="FULL NAME" error={errors.fullName}>
                <input id="fullName" autoComplete="name" className={inputClass(errors.fullName)} value={data.fullName} onChange={(e) => set('fullName')(e.target.value)} placeholder="Ahmad Al-Khatib" {...err('fullName')} />
              </Field>
              <Field id="email" label="EMAIL" hint="university or personal — we'll reply here" error={errors.email}>
                <input id="email" type="email" inputMode="email" autoComplete="email" className={inputClass(errors.email)} value={data.email} onChange={(e) => set('email')(e.target.value)} placeholder="you@just.edu.jo" {...err('email')} />
              </Field>
              <div className="grid md:grid-cols-2 gap-6">
                <Field id="phone" label="PHONE" optional error={errors.phone}>
                  <input id="phone" type="tel" inputMode="tel" autoComplete="tel" className={inputClass(errors.phone)} value={data.phone} onChange={(e) => set('phone')(e.target.value)} placeholder="+962 7X XXX XXXX" {...err('phone')} />
                </Field>
                <Field id="studentId" label="STUDENT ID" optional error={errors.studentId}>
                  <input id="studentId" inputMode="numeric" className={inputClass(errors.studentId)} value={data.studentId} onChange={(e) => set('studentId')(e.target.value)} placeholder="1234567" {...err('studentId')} />
                </Field>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Field id="major" label="MAJOR" error={errors.major}>
                <div className="relative">
                  <select id="major" className={`${inputClass(errors.major)} appearance-none cursor-pointer pr-10`} value={data.major} onChange={(e) => set('major')(e.target.value)} {...err('major')}>
                    <option value="" disabled>select…</option>
                    {MAJORS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#1E88E5]">expand_more</span>
                </div>
              </Field>
              {data.major === 'Other' && (
                <Field id="otherMajor" label="WHICH MAJOR?" error={errors.otherMajor}>
                  <input id="otherMajor" className={inputClass(errors.otherMajor)} value={data.otherMajor} onChange={(e) => set('otherMajor')(e.target.value)} {...err('otherMajor')} />
                </Field>
              )}
              <fieldset className="space-y-2">
                <legend className="font-mono text-[13px] text-[#1E88E5] mb-2">{'> '}YEAR</legend>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-describedby={errors.year ? 'year-error' : undefined}>
                  {YEARS.map((y) => (
                    <Chip key={y} on={data.year === y} onClick={() => set('year')(y)}>{y}</Chip>
                  ))}
                </div>
                {errors.year && <p id="year-error" className="font-mono text-[12px] text-red-400">ERR: {errors.year}</p>}
              </fieldset>
            </>
          )}

          {step === 2 && (
            <>
              <fieldset className="space-y-2">
                <legend className="font-mono text-[13px] text-[#1E88E5] mb-2">{'> '}COMMITTEES <span className="text-gray-500">(pick one or more)</span></legend>
                <div className="grid sm:grid-cols-3 gap-3">
                  {COMMITTEES.map((c) => {
                    const on = data.committees.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle('committees', c.id)}
                        className={`text-left p-4 border transition-colors cursor-pointer ${on ? 'border-[#F57C00] bg-[#F57C00]/10' : 'border-[#1E88E5]/40 hover:border-[#F57C00]/60'}`}
                      >
                        <span className="block font-display text-[22px] tracking-wider text-[#F57C00]">
                          {on ? '[x] ' : '[ ] '}
                          {c.id.toUpperCase()}
                        </span>
                        <span className="block font-mono text-[12px] text-[#dec1af] mt-1">{c.blurb}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.committees && <p className="font-mono text-[12px] text-red-400">ERR: {errors.committees}</p>}
              </fieldset>
              <fieldset className="space-y-2">
                <legend className="font-mono text-[13px] text-[#1E88E5] mb-2">{'> '}SKILLS <span className="text-gray-500">(optional — anything you&apos;re into)</span></legend>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((s) => (
                    <Chip key={s} on={data.skills.includes(s)} onClick={() => toggle('skills', s)}>{s}</Chip>
                  ))}
                </div>
              </fieldset>
              <Field id="otherSkills" label="ANYTHING ELSE?" optional>
                <input id="otherSkills" className={inputClass()} value={data.otherSkills} onChange={(e) => set('otherSkills')(e.target.value)} placeholder="rust, 3d printing, robotics club…" />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field
                id="motivation"
                label="WHY DO YOU WANT TO JOIN IES?"
                hint={`${data.motivation.trim().length}/${MOTIVATION_MAX} — what you want to learn, build or bring`}
                error={errors.motivation}
              >
                <textarea
                  id="motivation"
                  data-lenis-prevent
                  rows={6}
                  maxLength={MOTIVATION_MAX}
                  className={`${inputClass(errors.motivation)} resize-y min-h-[140px]`}
                  value={data.motivation}
                  onChange={(e) => set('motivation')(e.target.value)}
                  {...err('motivation')}
                />
              </Field>
              <Field id="link" label="GITHUB / PORTFOLIO / LINKEDIN" optional error={errors.link}>
                <input id="link" type="url" inputMode="url" className={inputClass(errors.link)} value={data.link} onChange={(e) => set('link')(e.target.value)} placeholder="https://github.com/you" {...err('link')} />
              </Field>
            </>
          )}

          {step === 4 && (
            <dl>
              <ReviewRow label="NAME" value={data.fullName} onEdit={() => goTo(0)} />
              <ReviewRow label="EMAIL" value={data.email} onEdit={() => goTo(0)} />
              <ReviewRow label="PHONE" value={data.phone} onEdit={() => goTo(0)} />
              <ReviewRow label="STUDENT ID" value={data.studentId} onEdit={() => goTo(0)} />
              <ReviewRow label="MAJOR" value={data.major === 'Other' ? data.otherMajor : data.major} onEdit={() => goTo(1)} />
              <ReviewRow label="YEAR" value={data.year} onEdit={() => goTo(1)} />
              <ReviewRow label="COMMITTEES" value={data.committees.join(', ')} onEdit={() => goTo(2)} />
              <ReviewRow label="SKILLS" value={[...data.skills, data.otherSkills.trim()].filter(Boolean).join(', ')} onEdit={() => goTo(2)} />
              <ReviewRow label="WHY IES" value={data.motivation} onEdit={() => goTo(3)} />
              <ReviewRow label="LINK" value={data.link} onEdit={() => goTo(3)} />
            </dl>
          )}
        </div>

        {status === 'error' && (
          <p role="alert" className="mt-6 font-mono text-[13px] text-red-400 border border-red-400/40 px-3 py-2">
            ERR: submission failed ({failure}). Your answers are saved — try again in a moment.
          </p>
        )}

        <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-[#1E88E5]/20">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className="font-mono text-[14px] text-[#1E88E5] hover:text-[#F57C00] transition-colors cursor-pointer">
              {'<'} BACK
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="font-mono text-[14px] font-bold border-2 border-[#F57C00] text-[#F57C00] px-6 py-3 hover:bg-[#F57C00] hover:text-[#0A0A0A] disabled:opacity-60 disabled:cursor-wait transition-colors cursor-pointer"
          >
            {step < LAST ? 'NEXT >' : status === 'sending' ? 'TRANSMITTING…' : 'SUBMIT_APPLICATION.EXE'}
          </button>
        </div>
      </form>
    </main>
  );
}
