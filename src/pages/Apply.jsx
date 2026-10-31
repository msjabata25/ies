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
import { useI18n } from '@/i18n/context';

const DRAFT_KEY = 'ies-apply-draft';
const MOTIVATION_MIN = 40;
const MOTIVATION_MAX = 600;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Phone numbers may be typed with spaces or dashes; validate and send digits only. */
const digits = (v) => v.replace(/[\s-]/g, '');

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

const STEP_COUNT = 5;
const LAST = STEP_COUNT - 1;

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

/* Returns { field: { key, vars } } — keys into apply.errors.*, translated at render time. */
function validate(step, d) {
  const e = {};
  if (step === 0) {
    if (d.fullName.trim().length < 3) e.fullName = { key: 'fullName' };
    if (!EMAIL.test(d.email.trim())) e.email = { key: 'email' };
    if (d.phone.trim() && !/^07[789]\d{7}$/.test(digits(d.phone))) e.phone = { key: 'phone' };
    if (!d.studentId.trim()) e.studentId = { key: 'studentIdMissing' };
    else if (!/^\d{6}$/.test(d.studentId.trim())) e.studentId = { key: 'studentIdFormat' };
  }
  if (step === 1) {
    if (!d.major) e.major = { key: 'major' };
    if (d.major === 'Other' && !d.otherMajor.trim()) e.otherMajor = { key: 'otherMajor' };
    if (!d.year) e.year = { key: 'year' };
  }
  if (step === 2 && !d.committees.length) e.committees = { key: 'committees' };
  if (step === 3) {
    const n = d.motivation.trim().length;
    if (n < MOTIVATION_MIN) e.motivation = { key: 'motivation', vars: { n: MOTIVATION_MIN - n } };
    if (d.link.trim() && !/^https?:\/\/\S+\.\S+/.test(d.link.trim())) e.link = { key: 'link' };
  }
  return e;
}

/* Values are always sent in English (MAJORS, YEARS… ids) whatever language the form was filled in. */
function toPayload(d) {
  const optional = (v) => v.trim() || undefined;
  return {
    fullName: d.fullName.trim(),
    email: d.email.trim(),
    phone: optional(digits(d.phone)),
    studentId: d.studentId.trim(),
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

function ErrorText({ id, children }) {
  const { t } = useI18n();
  return (
    <p id={id} className="font-mono text-[12px] text-red-400">
      {t('apply.errPrefix')} {children}
    </p>
  );
}

function Field({ id, label, optional, hint, error, children }) {
  const { t } = useI18n();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-mono text-[13px] text-[#1E88E5]">
        {'> '}
        {label}
        {optional && <span className="text-gray-500"> {t('apply.optional')}</span>}
      </label>
      {children}
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : hint && <p className="font-mono text-[12px] text-gray-500">{hint}</p>}
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
  const { t } = useI18n();
  const steps = t('apply.steps');
  return (
    <div className="font-mono text-[13px] text-[#dec1af] mb-8" aria-live="polite">
      <div className="flex gap-1 mb-2" aria-hidden="true">
        {steps.map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 ${i <= step ? 'bg-[#F57C00]' : 'bg-[#1E88E5]/20'} transition-colors duration-300`} />
        ))}
      </div>
      <span className="text-[#1E88E5]">{t('apply.stepCount', { n: step + 1, total: steps.length })}</span>
      <span className="text-gray-600"> // </span>
      <span className="text-[#F57C00]">{steps[step]}</span>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }) {
  const { t } = useI18n();
  return (
    <div className="flex gap-4 py-2.5 border-b border-[#1E88E5]/15 font-mono text-[14px]">
      <dt className="w-32 shrink-0 text-[#1E88E5]">{label}</dt>
      <dd className="flex-1 text-[#dec1af] break-words min-w-0">{value || <span className="text-gray-600">—</span>}</dd>
      <button type="button" onClick={onEdit} className="text-[12px] text-[#F57C00]/80 hover:text-[#F57C00] cursor-pointer shrink-0">
        {t('apply.review.edit')}
      </button>
    </div>
  );
}

function Header() {
  const { t } = useI18n();
  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-3">
        <span className="material-symbols-outlined text-[#F57C00] text-3xl">assignment_ind</span>
        <h1 className="text-[36px] md:text-[56px] leading-[110%] tracking-[0.02em] text-[#F57C00] font-display">
          {t('apply.title')}<span className="cursor-blink font-mono">_</span>
        </h1>
      </div>
      <p className="font-mono text-[13px] md:text-[15px] text-[#1E88E5]">{t('apply.subtitle')}</p>
    </div>
  );
}

export default function ApplyPage() {
  const { t } = useI18n();
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

  const errText = (field) => errors[field] && t(`apply.errors.${errors[field].key}`, errors[field].vars);
  const majorLabel = (m) => t(`apply.majors.${m}`);

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
          <p className="text-[#F57C00]">{'> '}{t('apply.closed.title')}</p>
          <p>{t('apply.closed.body')}</p>
          <a
            href="https://www.instagram.com/ieeeiesjust/"
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="inline-block mt-4 border border-[#F57C00] text-[#F57C00] px-5 py-2.5 hover:bg-[#F57C00] hover:text-[#0A0A0A] transition-colors"
          >
            @IEEEIESJUST →
          </a>
        </div>
      </main>
    );
  }

  if (status === 'done') {
    const firstName = data.fullName.trim().split(/\s+/)[0];
    return (
      <main className="min-h-screen pt-28 pb-24 px-4 md:px-14 max-w-3xl mx-auto">
        <Header />
        <div className="bg-[#0e0e0e] border border-[#F57C00]/50 p-6 font-mono text-[14px] leading-[190%] text-[#dec1af] animate-in fade-in duration-500">
          <p className="text-[#1E88E5]">{t('apply.done.uploading')}</p>
          <p className="text-[#1E88E5]">{t('apply.done.notifying')}</p>
          <p className="text-[#F57C00] mt-3">{t('apply.done.received', { ref: reference })}</p>
          <p className="mt-3">
            {t('apply.done.thanks', { name: firstName ? t('apply.done.namePart', { name: firstName }) : '' })}{' '}
            <span className="text-[#F57C00]" dir="ltr">{data.email.trim()}</span>
            {t('apply.done.keepRef')}
          </p>
          {submissionsStubbed && (
            <p className="mt-3 text-yellow-400/80 text-[12px]">{t('apply.done.devNote')}</p>
          )}
          <Link
            to="/"
            className="inline-block mt-6 border border-[#1E88E5] text-[#1E88E5] px-5 py-2.5 hover:bg-[#1E88E5] hover:text-[#0A0A0A] transition-colors"
          >
            {t('apply.done.home')}
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
          {t('apply.devBanner')}
        </p>
      )}

      <form onSubmit={onSubmit} noValidate className="bg-[#0e0e0e] border border-[#1E88E5]/30 p-5 md:p-8 relative">
        <div className="absolute top-0 end-0 px-2 py-0.5 text-[10px] font-mono bg-[#1E88E5] text-[#0A0A0A]">{t('apply.formBadge')}</div>
        <Progress step={step} />

        {/* Honeypot — off-screen and skipped by keyboard and screen readers */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set('website')(e.target.value)} />
          </label>
        </div>

        <div ref={stepRef} key={step} className="space-y-6 animate-in fade-in slide-in-from-right-4 rtl:slide-in-from-left-4 duration-300">
          {step === 0 && (
            <>
              <Field id="fullName" label={t('apply.labels.fullName')} error={errText('fullName')}>
                <input id="fullName" autoComplete="name" className={inputClass(errors.fullName)} value={data.fullName} onChange={(e) => set('fullName')(e.target.value)} placeholder={t('apply.placeholders.fullName')} {...err('fullName')} />
              </Field>
              <Field id="email" label={t('apply.labels.email')} hint={t('apply.hints.email')} error={errText('email')}>
                <input id="email" type="email" inputMode="email" autoComplete="email" dir="ltr" className={`${inputClass(errors.email)} text-start`} value={data.email} onChange={(e) => set('email')(e.target.value)} placeholder={t('apply.placeholders.email')} {...err('email')} />
              </Field>
              <div className="grid md:grid-cols-2 gap-6">
                <Field id="phone" label={t('apply.labels.phone')} optional error={errText('phone')}>
                  <input id="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className={`${inputClass(errors.phone)} text-start`} value={data.phone} onChange={(e) => set('phone')(e.target.value)} placeholder={t('apply.placeholders.phone')} {...err('phone')} />
                </Field>
                <Field id="studentId" label={t('apply.labels.studentId')} hint={t('apply.hints.studentId')} error={errText('studentId')}>
                  <input id="studentId" inputMode="numeric" dir="ltr" className={`${inputClass(errors.studentId)} text-start`} value={data.studentId} onChange={(e) => set('studentId')(e.target.value)} placeholder={t('apply.placeholders.studentId')} maxLength={6} {...err('studentId')} />
                </Field>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Field id="major" label={t('apply.labels.major')} error={errText('major')}>
                <div className="relative">
                  <select id="major" className={`${inputClass(errors.major)} appearance-none cursor-pointer pe-10`} value={data.major} onChange={(e) => set('major')(e.target.value)} {...err('major')}>
                    <option value="" disabled>{t('apply.selectPlaceholder')}</option>
                    {MAJORS.map((m) => (
                      <option key={m} value={m}>{majorLabel(m)}</option>
                    ))}
                  </select>
                  <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[#1E88E5]">expand_more</span>
                </div>
              </Field>
              {data.major === 'Other' && (
                <Field id="otherMajor" label={t('apply.labels.otherMajor')} error={errText('otherMajor')}>
                  <input id="otherMajor" className={inputClass(errors.otherMajor)} value={data.otherMajor} onChange={(e) => set('otherMajor')(e.target.value)} {...err('otherMajor')} />
                </Field>
              )}
              <fieldset className="space-y-2">
                <legend className="font-mono text-[13px] text-[#1E88E5] mb-2">{'> '}{t('apply.labels.year')}</legend>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-describedby={errors.year ? 'year-error' : undefined}>
                  {YEARS.map((y) => (
                    <Chip key={y} on={data.year === y} onClick={() => set('year')(y)}>{t(`apply.years.${y}`)}</Chip>
                  ))}
                </div>
                {errors.year && <ErrorText id="year-error">{errText('year')}</ErrorText>}
              </fieldset>
            </>
          )}

          {step === 2 && (
            <>
              <fieldset className="space-y-2">
                <legend className="font-mono text-[13px] text-[#1E88E5] mb-2">
                  {'> '}{t('apply.labels.committees')} <span className="text-gray-500">{t('apply.labels.committeesHint')}</span>
                </legend>
                <div className="grid sm:grid-cols-3 gap-3">
                  {COMMITTEES.map((c) => {
                    const on = data.committees.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle('committees', c.id)}
                        className={`text-start p-4 border transition-colors cursor-pointer ${on ? 'border-[#F57C00] bg-[#F57C00]/10' : 'border-[#1E88E5]/40 hover:border-[#F57C00]/60'}`}
                      >
                        <span className="block font-display text-[22px] tracking-wider text-[#F57C00]">
                          {on ? '[x] ' : '[ ] '}
                          {t(`apply.committees.${c.id}.name`)}
                        </span>
                        <span className="block font-mono text-[12px] text-[#dec1af] mt-1">{t(`apply.committees.${c.id}.blurb`)}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.committees && <ErrorText>{errText('committees')}</ErrorText>}
              </fieldset>
              <fieldset className="space-y-2">
                <legend className="font-mono text-[13px] text-[#1E88E5] mb-2">
                  {'> '}{t('apply.labels.skills')} <span className="text-gray-500">{t('apply.labels.skillsHint')}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((s) => (
                    <Chip key={s} on={data.skills.includes(s)} onClick={() => toggle('skills', s)}>{t(`apply.skills.${s}`)}</Chip>
                  ))}
                </div>
              </fieldset>
              <Field id="otherSkills" label={t('apply.labels.otherSkills')} optional>
                <input id="otherSkills" className={inputClass()} value={data.otherSkills} onChange={(e) => set('otherSkills')(e.target.value)} placeholder={t('apply.placeholders.otherSkills')} />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field
                id="motivation"
                label={t('apply.labels.motivation')}
                hint={t('apply.hints.motivation', { n: data.motivation.trim().length, max: MOTIVATION_MAX })}
                error={errText('motivation')}
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
              <Field id="link" label={t('apply.labels.link')} optional error={errText('link')}>
                <input id="link" type="url" inputMode="url" dir="ltr" className={`${inputClass(errors.link)} text-start`} value={data.link} onChange={(e) => set('link')(e.target.value)} placeholder={t('apply.placeholders.link')} {...err('link')} />
              </Field>
            </>
          )}

          {step === 4 && (
            <dl>
              <ReviewRow label={t('apply.review.fullName')} value={data.fullName} onEdit={() => goTo(0)} />
              <ReviewRow label={t('apply.review.email')} value={data.email} onEdit={() => goTo(0)} />
              <ReviewRow label={t('apply.review.phone')} value={data.phone} onEdit={() => goTo(0)} />
              <ReviewRow label={t('apply.review.studentId')} value={data.studentId} onEdit={() => goTo(0)} />
              <ReviewRow label={t('apply.review.major')} value={data.major === 'Other' ? data.otherMajor : data.major && majorLabel(data.major)} onEdit={() => goTo(1)} />
              <ReviewRow label={t('apply.review.year')} value={data.year && t(`apply.years.${data.year}`)} onEdit={() => goTo(1)} />
              <ReviewRow label={t('apply.review.committees')} value={data.committees.map((c) => t(`apply.committees.${c}.name`)).join(t('apply.listSep'))} onEdit={() => goTo(2)} />
              <ReviewRow
                label={t('apply.review.skills')}
                value={[...data.skills.map((s) => t(`apply.skills.${s}`)), data.otherSkills.trim()].filter(Boolean).join(t('apply.listSep'))}
                onEdit={() => goTo(2)}
              />
              <ReviewRow label={t('apply.review.motivation')} value={data.motivation} onEdit={() => goTo(3)} />
              <ReviewRow label={t('apply.review.link')} value={data.link} onEdit={() => goTo(3)} />
            </dl>
          )}
        </div>

        {status === 'error' && (
          <p role="alert" className="mt-6 font-mono text-[13px] text-red-400 border border-red-400/40 px-3 py-2">
            {t('apply.errors.submit', { reason: failure })}
          </p>
        )}

        <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-[#1E88E5]/20">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className="font-mono text-[14px] text-[#1E88E5] hover:text-[#F57C00] transition-colors cursor-pointer">
              {t('apply.back')}
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="font-mono text-[14px] font-bold border-2 border-[#F57C00] text-[#F57C00] px-6 py-3 hover:bg-[#F57C00] hover:text-[#0A0A0A] disabled:opacity-60 disabled:cursor-wait transition-colors cursor-pointer"
          >
            {step < LAST ? t('apply.next') : status === 'sending' ? t('apply.sending') : t('apply.submit')}
          </button>
        </div>
      </form>
    </main>
  );
}
