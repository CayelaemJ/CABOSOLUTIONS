import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

const services = [
  'Data Engineering & BI',
  'Automation & Workflows',
  'Analytics & Data Science',
  'Marketing & Social Media',
  'Operations & Business Improvement',
  'PR Training & Communications',
  'Full Suite / Not Sure Yet',
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const inputStyle = {
  width: '100%',
  background: 'rgba(13,17,23,0.8)',
  border: '1px solid rgba(196,103,58,0.2)',
  borderRadius: '2px',
  padding: '0.8rem 1rem',
  color: 'var(--cabo-warm-white)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export function Contact() {
  const { ref, visible } = useReveal();
  const { ref: formRef, visible: formVisible } = useReveal();
  const [form, setForm] = useState({ name: '', email: '', org: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok || !result.received) throw new Error(result.error || 'Unable to send your enquiry.');
      setReference(result.reference || '');
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to send your enquiry. Please email us directly.');
    } finally {
      setSending(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(196,103,58,0.6)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(196,103,58,0.2)';
  };

  return (
    <section
      id="contact"
      style={{
        background: 'var(--cabo-bg)',
        padding: '8rem 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '10%',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(196,103,58,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section label */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--cabo-clay)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '0.7rem',
          marginBottom: '0.8rem',
        }}>
          <span style={{ width: '28px', height: '1px', background: 'var(--cabo-clay)', display: 'block', flexShrink: 0 }} />
          Get In Touch
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '6rem',
          alignItems: 'start',
        }}>
          {/* Left — info */}
          <div
            ref={ref}
            style={{
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              opacity: visible ? 1 : 0,
              transition: 'all 0.8s ease',
            }}
          >
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              color: 'var(--cabo-warm-white)',
              lineHeight: 1.15,
              marginBottom: '1.2rem',
            }}>
              Ready to build{' '}
              <em style={{ color: 'var(--cabo-clay)', fontStyle: 'italic' }}>something remarkable?</em>
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'rgba(245,237,224,0.55)',
              lineHeight: 1.8,
              marginBottom: '3rem',
            }}>
              Whether you're a start-up finding your footing, an NGO doing critical work, or an enterprise needing serious infrastructure — we meet you where you are. Reach out and we'll figure out together what the right engagement looks like.
            </p>

            {/* Founders contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {[
                {
                  name: 'Cayelaem Jantjies',
                  role: 'Data Engineer & BI Lead',
                  email: 'cayelaem@cabosolutionsza.cloud-ip.cc',
                  phone: '+27 64 500 7574',
                  linkedin: 'https://www.linkedin.com/in/cayelaem-jantjies-000b45144/',
                },
                {
                  name: 'Bokamoso Molefi',
                  role: 'Operations & Marketing Lead',
                  email: 'bokamoso.molefi@cabosolutionsza.cloud-ip.cc',
                  phone: '+27 74 787 7904',
                  linkedin: 'https://www.linkedin.com/in/bokamoso-molefi-4a1b89239/',
                },
              ].map((founder) => (
                <div key={founder.name}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--cabo-warm-white)',
                    marginBottom: '0.2rem',
                  }}>
                    {founder.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    color: 'var(--cabo-gold)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.8rem',
                  }}>
                    {founder.role}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <a
                      href={`mailto:${founder.email}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        color: 'rgba(245,237,224,0.55)',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cabo-clay)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,237,224,0.55)')}
                    >
                      <Mail size={14} style={{ flexShrink: 0 }} />
                      {founder.email}
                    </a>
                    <a
                      href={`tel:${founder.phone}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        color: 'rgba(245,237,224,0.55)',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cabo-clay)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,237,224,0.55)')}
                    >
                      <Phone size={14} style={{ flexShrink: 0 }} />
                      {founder.phone}
                    </a>
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        color: 'rgba(245,237,224,0.55)',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cabo-gold)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,237,224,0.55)')}
                    >
                      <Linkedin size={14} style={{ flexShrink: 0 }} />
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Location */}
            <div style={{
              marginTop: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'rgba(245,237,224,0.35)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              <MapPin size={12} />
              Johannesburg, South Africa — Remote Worldwide
            </div>
          </div>

          {/* Right — form */}
          <div
            ref={formRef}
            style={{
              transform: formVisible ? 'translateY(0)' : 'translateY(24px)',
              opacity: formVisible ? 1 : 0,
              transition: 'all 0.9s ease',
              transitionDelay: '0.15s',
            }}
          >
            <div style={{
              background: 'var(--cabo-ink)',
              border: '1px solid rgba(196,103,58,0.18)',
              borderRadius: '4px',
              padding: '2.5rem',
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    color: 'var(--cabo-clay)',
                    marginBottom: '1rem',
                  }}>
                    ⟡
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    color: 'var(--cabo-warm-white)',
                    marginBottom: '0.75rem',
                  }}>
                    Enquiry saved.
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'rgba(245,237,224,0.55)',
                    lineHeight: 1.7,
                  }}>
                    Your enquiry is in our system. We'll be in touch as soon as possible. {reference && `Reference: #${reference}`}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && <p role="alert" style={{ color: '#ffb4a2', marginBottom: '1rem', lineHeight: 1.5 }}>{error} <a href="mailto:hello@cabosolutions.co.za" style={{color:'inherit'}}>Email us instead</a>.</p>}
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: 'var(--cabo-warm-white)',
                    marginBottom: '1.8rem',
                  }}>
                    Start the conversation
                  </h3>

                  {[
                    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name', required: true },
                    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@company.com', required: true },
                    { id: 'org', label: 'Organisation', type: 'text', placeholder: 'Company or organisation', required: false },
                  ].map((field) => (
                    <div key={field.id} style={{ marginBottom: '1.2rem' }}>
                      <label style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6rem',
                        color: 'rgba(245,237,224,0.5)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '0.45rem',
                      }}>
                        {field.label}
                        {field.required && <span style={{ color: 'var(--cabo-clay)', marginLeft: '0.25rem' }}>*</span>}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={form[field.id as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        style={inputStyle}
                      />
                    </div>
                  ))}

                  {/* Service dropdown */}
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: 'rgba(245,237,224,0.5)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.45rem',
                    }}>
                      Service <span style={{ color: 'var(--cabo-clay)' }}>*</span>
                    </label>
                    <select
                      required
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      style={{ ...inputStyle, appearance: 'none' as any }}
                    >
                      <option value="" disabled>Select a service...</option>
                      {services.map((s) => (
                        <option key={s} value={s} style={{ background: '#231C16' }}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: '1.8rem' }}>
                    <label style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: 'rgba(245,237,224,0.5)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '0.45rem',
                    }}>
                      Message <span style={{ color: 'var(--cabo-clay)' }}>*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your project, challenge, or goals..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    style={{
                      width: '100%',
                      background: 'var(--cabo-clay)',
                      color: 'var(--cabo-warm-white)',
                      border: 'none',
                      padding: '1rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      transition: 'background 0.25s, transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--cabo-rust)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--cabo-clay)';
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    {sending ? 'Sending…' : 'Send Enquiry →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}