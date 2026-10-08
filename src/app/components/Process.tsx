import { useRef, useEffect, useState } from 'react';

const steps = [
  {
    num: '01',
    title: 'Discover',
    description: 'We immerse ourselves in your business — data sources, workflows, pain points, and goals. No assumptions, only listening.',
  },
  {
    num: '02',
    title: 'Diagnose',
    description: 'We map the gaps between where your data is and where it needs to be. Then we design a solution architecture before writing a single line of code.',
  },
  {
    num: '03',
    title: 'Build',
    description: 'We build fast, iterate with you, and deliver working solutions — not decks. Every deliverable is production-ready from day one.',
  },
  {
    num: '04',
    title: 'Sustain',
    description: 'We document everything, train your team, and remain available for ongoing refinements. You never get handed a black box.',
  },
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

export function Process() {
  const { ref: headRef, visible: headVisible } = useReveal();
  const { ref: stepsRef, visible: stepsVisible } = useReveal();

  return (
    <section
      id="process"
      style={{
        background: 'var(--cabo-ink)',
        padding: '8rem 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
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
          How We Work
        </div>

        {/* Heading */}
        <div
          ref={headRef}
          style={{
            marginBottom: '5rem',
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
            A process built on{' '}
            <em style={{ color: 'var(--cabo-clay)', fontStyle: 'italic' }}>clarity and craft.</em>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'rgba(245,237,224,0.55)',
            maxWidth: '520px',
            lineHeight: 1.75,
          }}>
            Four phases. Every client. No shortcuts.
          </p>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0',
            transform: stepsVisible ? 'translateY(0)' : 'translateY(24px)',
            opacity: stepsVisible ? 1 : 0,
            transition: 'all 0.8s ease',
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                position: 'relative',
                padding: '2rem 2.5rem',
                borderRight: i < steps.length - 1 ? '1px solid rgba(196,103,58,0.12)' : 'none',
              }}
            >
              {/* Ghost number */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '1.5rem',
                fontFamily: 'var(--font-display)',
                fontSize: '5rem',
                fontWeight: 900,
                color: 'rgba(196,103,58,0.06)',
                lineHeight: 1,
                userSelect: 'none',
              }}>
                {step.num}
              </div>

              {/* Connector dot */}
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: '2px solid var(--cabo-clay)',
                background: 'var(--cabo-ink)',
                marginBottom: '1.5rem',
                position: 'relative',
                zIndex: 1,
              }} />

              {/* Step number label */}
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                color: 'var(--cabo-clay)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
                position: 'relative',
                zIndex: 1,
              }}>
                Step {step.num}
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: 'var(--cabo-warm-white)',
                marginBottom: '0.8rem',
                lineHeight: 1.2,
                position: 'relative',
                zIndex: 1,
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'rgba(245,237,224,0.5)',
                lineHeight: 1.75,
                position: 'relative',
                zIndex: 1,
              }}>
                {step.description}
              </p>

              {/* Arrow connector (not last) */}
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '2.8rem',
                  right: '-0.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--cabo-clay)',
                  opacity: 0.5,
                  zIndex: 2,
                }}>
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom connector line */}
        <div style={{
          marginTop: '3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0',
        }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(196,103,58,0.4), rgba(196,103,58,0.1))' }} />
              {i < steps.length - 1 && (
                <div style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'var(--cabo-clay)',
                  opacity: 0.4,
                  flexShrink: 0,
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}