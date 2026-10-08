import { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Launch Ready',
    price: 'R15,000–R25,000',
    cadence: '/ project',
    description: 'A focused engagement to get your first data or strategy deliverable out the door.',
    featured: false,
    features: [
      '1 BI dashboard OR social strategy OR ops audit',
      '1 round of revisions included',
      'Full handover documentation',
      '2-week delivery window',
      'Onboarding call + walkthrough session',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Full Momentum',
    price: 'R30,000–R45,000',
    cadence: '/ month',
    description: 'Our full-service retainer — BI, automation, social, and operations working as one integrated engine.',
    featured: true,
    badge: 'Most Popular',
    features: [
      'BI dashboards + automation workflows',
      'Social media management + analytics',
      'Monthly ops check-ins',
      'Up to 3 active workstreams',
      'Priority 24hr response',
      'Quarterly strategy review',
    ],
    cta: 'Start Your Momentum',
  },
  {
    name: 'Custom Scope',
    price: 'Let\'s talk',
    cadence: 'Enterprise & NGO',
    description: 'Complex, multi-department engagements. We scope it together — no cookie-cutter pricing.',
    featured: false,
    features: [
      'Full-stack data + comms programme',
      'Team training & capability building',
      'PR programme & media strategy',
      'Quarterly reviews & roadmapping',
      'NGO rates available',
      'Dedicated account lead',
    ],
    cta: 'Enquire Now',
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

function PricingCard({ plan, index }: { plan: typeof plans[0]; index: number }) {
  const { ref, visible } = useReveal();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: plan.featured ? 'rgba(196,103,58,0.08)' : 'var(--cabo-ink)',
        border: plan.featured
          ? '1px solid rgba(196,103,58,0.5)'
          : `1px solid ${hovered ? 'rgba(196,103,58,0.3)' : 'rgba(196,103,58,0.15)'}`,
        borderRadius: '4px',
        padding: '2.8rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.7s ease, border-color 0.3s',
        transitionDelay: `${index * 0.12}s`,
        boxShadow: plan.featured ? '0 0 60px rgba(196,103,58,0.1)' : hovered ? '0 0 30px rgba(196,103,58,0.05)' : 'none',
      }}
    >
      {/* Featured badge */}
      {plan.featured && (plan as any).badge && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--cabo-clay)',
          color: 'var(--cabo-warm-white)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '0.3rem 1rem',
          borderRadius: '0 0 4px 4px',
          whiteSpace: 'nowrap',
        }}>
          {(plan as any).badge}
        </div>
      )}

      {/* Plan name */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: plan.featured ? 'var(--cabo-clay)' : 'rgba(196,103,58,0.6)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: '1rem',
        marginTop: plan.featured ? '0.8rem' : '0',
      }}>
        {plan.name}
      </div>

      {/* Price */}
      <div style={{ marginBottom: '0.5rem' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: plan.price === "Let's talk" ? '2rem' : '1.8rem',
          fontWeight: 700,
          color: 'var(--cabo-warm-white)',
        }}>
          {plan.price}
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'rgba(245,237,224,0.4)',
        letterSpacing: '0.1em',
        marginBottom: '1.5rem',
      }}>
        {plan.cadence}
      </div>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        color: 'rgba(245,237,224,0.55)',
        lineHeight: 1.7,
        marginBottom: '1.8rem',
        paddingBottom: '1.8rem',
        borderBottom: '1px solid rgba(196,103,58,0.15)',
      }}>
        {plan.description}
      </p>

      {/* Features */}
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: '0 0 2.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        flex: 1,
      }}>
        {plan.features.map((f) => (
          <li
            key={f}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'rgba(245,237,224,0.65)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              lineHeight: 1.5,
            }}
          >
            <Check size={13} color="#C4673A" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="#contact"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.66rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0.9rem',
          textAlign: 'center',
          textDecoration: 'none',
          borderRadius: '2px',
          display: 'block',
          transition: 'all 0.25s',
          ...(plan.featured
            ? { background: 'var(--cabo-clay)', color: 'var(--cabo-warm-white)' }
            : { background: 'transparent', border: '1px solid rgba(196,103,58,0.35)', color: 'var(--cabo-clay)' }),
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          if (plan.featured) {
            el.style.background = 'var(--cabo-rust)';
          } else {
            el.style.background = 'rgba(196,103,58,0.1)';
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          if (plan.featured) {
            el.style.background = 'var(--cabo-clay)';
          } else {
            el.style.background = 'transparent';
          }
        }}
      >
        {plan.cta}
      </a>
    </div>
  );
}

export function Pricing() {
  const { ref: headRef, visible: headVisible } = useReveal();

  return (
    <section
      id="pricing"
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
          Investment
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
            Transparent pricing.{' '}
            <em style={{ color: 'var(--cabo-clay)', fontStyle: 'italic' }}>Real value.</em>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'rgba(245,237,224,0.55)',
            maxWidth: '520px',
            lineHeight: 1.75,
          }}>
            All rates are anchored to real delivery experience across banking, manufacturing, FMCG, and non-profit sectors. No hidden fees, no surprise invoices.
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start',
        }}>
          {plans.map((plan, i) => (
            <PricingCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        {/* NGO note */}
        <div style={{
          marginTop: '2.5rem',
          padding: '1.5rem 2rem',
          border: '1px solid rgba(29,107,107,0.3)',
          borderLeft: '3px solid var(--cabo-teal)',
          borderRadius: '0 4px 4px 0',
          background: 'rgba(29,107,107,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--cabo-teal)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}>
              NGO & Non-Profit Rates
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'rgba(245,237,224,0.6)',
              lineHeight: 1.6,
            }}>
              Registered NPOs and social enterprises get access to the same quality at significantly reduced rates. We believe data-driven social impact shouldn't be a luxury.
            </p>
          </div>
          <a
            href="#contact"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0.7rem 1.5rem',
              border: '1px solid var(--cabo-teal)',
              color: 'var(--cabo-teal)',
              textDecoration: 'none',
              borderRadius: '2px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.25s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--cabo-teal)';
              el.style.color = 'var(--cabo-warm-white)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
              el.style.color = 'var(--cabo-teal)';
            }}
          >
            Enquire
          </a>
        </div>
      </div>
    </section>
  );
}