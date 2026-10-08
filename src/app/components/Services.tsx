import { useState, useRef, useEffect } from 'react';
import { Database, Zap, BarChart3, Megaphone, Settings, Radio, Code2, ShieldCheck, GraduationCap } from 'lucide-react';

const services = [
  {
    num: '01',
    icon: Database,
    title: 'Data Engineering & BI',
    description: 'We design and build enterprise-grade data pipelines and Power BI dashboards that turn raw, siloed data into decisions your business can act on.',
    tags: ['Power BI', 'SQL', 'ETL', 'Azure', 'DAX'],
  },
  {
    num: '02',
    icon: Zap,
    title: 'Automation & Workflows',
    description: 'We eliminate repetitive manual work by building smart automation flows that save your team hours every day — from approvals to reporting.',
    tags: ['Power Automate', 'Zapier', 'Make'],
  },
  {
    num: '03',
    icon: BarChart3,
    title: 'Analytics & Data Science',
    description: 'Beyond dashboards — we apply statistical modelling, machine learning, and predictive analytics to surface insights your competitors haven\'t found yet.',
    tags: ['Python', 'R', 'Machine Learning', 'Pandas'],
  },
  {
    num: '04',
    icon: Megaphone,
    title: 'Marketing & Social Media',
    description: 'Strategy meets data. We build content plans, manage your presence, and measure what actually works — turning followers into qualified leads.',
    tags: ['Strategy', 'Content', 'Analytics', 'SEO'],
  },
  {
    num: '05',
    icon: Settings,
    title: 'Operations & Business Improvement',
    description: 'We audit your processes, design SOPs, and implement operational systems that free leadership to focus on growth instead of firefighting.',
    tags: ['SOPs', 'Process Audit', 'Coordination', 'Systems'],
  },
  {
    num: '06',
    icon: Radio,
    title: 'PR Training & Communications',
    description: 'We train teams to communicate with confidence and craft PR strategies that build brand credibility — from press releases to crisis comms.',
    tags: ['PR Strategy', 'Training', 'Messaging', 'Media'],
  },
  { num: '07', icon: Code2, title: 'Software & App Development', description: 'Custom internal tools, web applications, Power BI embedding and multi-tenant platforms scoped to operational needs.', tags: ['Web Apps', 'Integrations', 'RBAC', 'Power BI Embedding'] },
  { num: '08', icon: ShieldCheck, title: 'Data Governance & Compliance', description: 'POPIA readiness assessments, data flow mapping, policy documentation and practical remediation support. Legal compliance is not guaranteed.', tags: ['POPIA', 'Data Mapping', 'Risk Assessment', 'Governance'] },
  { num: '09', icon: GraduationCap, title: 'Training & Enablement', description: 'Documentation, live training sessions and team enablement so clients can confidently operate their delivered systems.', tags: ['Documentation', 'Workshops', 'Handover'] },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const { ref, visible } = useReveal();
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const Icon = service.icon;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        setTilt({ x: y, y: x });
      }}
      style={{
        background: hovered ? 'rgba(196,103,58,0.06)' : 'var(--cabo-ink)',
        border: `1px solid ${hovered ? 'rgba(196,103,58,0.4)' : 'rgba(196,103,58,0.15)'}`,
        borderRadius: '4px',
        padding: '2.2rem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'all 0.35s ease',
        transform: visible ? `perspective(900px) translateY(0) rotateX(${hovered ? -tilt.x * 3 : 0}deg) rotateY(${hovered ? tilt.y * 4 : 0}deg) translateZ(${hovered ? 8 : 0}px)` : 'translateY(28px)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 0.08}s`,
        boxShadow: hovered ? '0 0 40px rgba(196,103,58,0.08)' : 'none',
      }}
    >
      {/* Depth glow */}
      <div style={{
        position: 'absolute',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        right: '-70px',
        top: '-70px',
        background: 'radial-gradient(circle, rgba(196,103,58,0.13) 0%, rgba(196,103,58,0) 70%)',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'scale(1.15)' : 'scale(0.8)',
        transition: 'opacity 0.35s, transform 0.5s',
        pointerEvents: 'none',
      }} />

      {/* Top accent bar on hover */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, var(--cabo-clay), var(--cabo-gold))',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.35s',
      }} />

      {/* Number */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'rgba(196,103,58,0.4)',
        letterSpacing: '0.15em',
        marginBottom: '1.2rem',
      }}>
        {service.num}
      </div>

      {/* Icon */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '8px',
        background: 'rgba(196,103,58,0.1)',
        border: '1px solid rgba(196,103,58,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.2rem',
        transition: 'background 0.3s',
      }}>
        <Icon size={20} color={hovered ? '#C4673A' : '#9a6040'} />
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--cabo-warm-white)',
        marginBottom: '0.6rem',
        lineHeight: 1.25,
      }}>
        {service.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        color: 'rgba(245,237,224,0.55)',
        lineHeight: 1.7,
        marginBottom: '1.4rem',
      }}>
        {service.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {service.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0.2rem 0.6rem',
              border: '1px solid rgba(196,103,58,0.3)',
              borderRadius: '2px',
              color: 'rgba(196,103,58,0.7)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Services() {
  const { ref: headRef, visible: headVisible } = useReveal();

  return (
    <section
      id="services"
      style={{
        background: 'var(--cabo-bg)',
        padding: '8rem 5rem',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
          What We Do
        </div>

        {/* Heading */}
        <div
          ref={headRef}
          style={{
            marginBottom: '4rem',
            transform: headVisible ? 'translateY(0)' : 'translateY(20px)',
            opacity: headVisible ? 1 : 0,
            transition: 'all 0.7s ease',
          }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            color: 'var(--cabo-warm-white)',
            lineHeight: 1.15,
            marginBottom: '1rem',
          }}>
            Nine disciplines.{' '}
            <em style={{ color: 'var(--cabo-clay)', fontStyle: 'italic' }}>One studio.</em>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'rgba(245,237,224,0.55)',
            maxWidth: '560px',
            lineHeight: 1.75,
          }}>
            We work across data, operations, marketing, and communications — so any business, at any stage, gets one integrated partner across nine complementary disciplines.
          </p>
        </div>

        {/* Divider ornament */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          marginBottom: '3rem',
          opacity: 0.35,
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--cabo-clay)' }} />
          <span style={{ color: 'var(--cabo-gold)', fontSize: '0.75rem' }}>⟡</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--cabo-clay)' }} />
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {services.map((service, i) => (
            <ServiceCard key={service.num} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}