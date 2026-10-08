import { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Launch Ready',
    price: 'Scoped quote',
    cadence: '/ project',
    description: 'Focused, clearly defined projects. Investment varies with complexity, delivery effort and business requirements.',
    featured: false,
    features: [
      'One small, agreed deliverable',
      'Revision allowance agreed in writing',
      'Practical handover notes',
      'Timeline agreed to fit the selected task',
      'Onboarding call + walkthrough session',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Full Momentum',
    price: 'From R15,000',
    cadence: '/ month',
    description: 'A monthly allocation for ongoing reporting, data engineering, application maintenance or workflow improvements.',
    featured: true,
    badge: 'Integrated retainer',
    features: [
      'Defined monthly hours and deliverables',
      'Data, BI, software or automation support',
      'Monthly ops check-ins',
      'Prioritised delivery backlog',
      'Support and response times agreed in writing',
      'Scope and deliverables agreed in writing',
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
      'Custom SaaS, portals and enterprise data platforms',
      'Team training & capability building',
      'Architecture, integration, testing and security controls',
      'Quarterly reviews & roadmapping',
      'NGO rates available',
      'Named technical delivery owner',
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
            All rates are anchored to real delivery experience across banking, manufacturing, FMCG, and non-profit sectors. Final pricing, deliverables, timelines and any third-party costs are confirmed in a written Statement of Work before work begins.
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


        {/* Selected catalog packages: indicative pricing, not a fixed-price checkout. */}
        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: 'var(--cabo-warm-white)', marginBottom: '0.8rem' }}>Indicative investment by service</h3>
          <p style={{ color: 'rgba(245,237,224,0.65)', lineHeight: 1.7, maxWidth: '740px', marginBottom: '1.5rem' }}>These are indicative planning ranges, not fixed-price offers. We tailor every quotation to scope, effort and technical complexity. They are separate from the engagement tiers above. Your final proposal will confirm scope, timeline, licensing costs and investment in writing.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem' }}>
            {[
              ['Technical Consulting', 'Discovery and solution scoping', 'R1,500–R3,500', 'Scope confirmed in quote'],
              ['SQL & Data', 'Query optimisation or data cleanup', 'R4,500–R12,000', 'Scope confirmed in quote'],
              ['Business Intelligence', 'Power BI dashboard development', 'R8,000–R25,000', 'Scope confirmed in quote'],
              ['Automation', 'Workflow design and implementation', 'R6,000–R20,000', 'Scope confirmed in quote'],
              ['Web Development', 'Business website development', 'R10,000–R30,000', 'Scope confirmed in quote'],
              ['APIs & Integration', 'API and data integration', 'R10,000–R35,000', 'Scope confirmed in quote'],
              ['Advanced Analytics', 'Analytics and forecasting', 'R18,000–R50,000', 'Scope confirmed in quote'],
              ['Software Engineering', 'Custom business applications', 'R35,000–R120,000+', 'Scope confirmed in quote'],
            ].map(([discipline, packageName, price, timeline]) => (
              <div key={packageName} style={{ padding: '1.4rem', border: '1px solid rgba(196,103,58,0.22)', background: 'var(--cabo-ink)', borderRadius: '4px', minWidth: 0 }}>
                <div style={{ color: 'var(--cabo-clay)', fontSize: '0.7rem', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>{discipline}</div>
                <h4 style={{ color: 'var(--cabo-warm-white)', fontSize: '1.05rem', marginBottom: '0.8rem' }}>{packageName}</h4>
                <div style={{ color: 'var(--cabo-warm-white)', fontWeight: 700, fontSize: '1.3rem' }}>{price}</div>
                <p style={{ color: 'rgba(245,237,224,0.6)', marginTop: '0.5rem', fontSize: '0.8rem' }}>Delivery: {timeline}</p>
                <a href="#contact" style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--cabo-clay)', fontSize: '0.85rem' }}>Request a tailored quote →</a>
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(245,237,224,0.55)', fontSize: '0.8rem', lineHeight: 1.7, marginTop: '1.25rem' }}>Indicative ranges in South African rand (ZAR), not binding offers. Final quotes depend on requirements, data readiness, number of systems, complexity, delivery urgency, testing, revisions and support. Third-party licences and expenses are itemised where applicable. Changes beyond the agreed scope are separately quoted and approved before work begins. Enterprise SaaS and large-scale platforms are custom quoted.</p>
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
              Registered non-profits and social enterprises may qualify for 30–40% reduced package rates, subject to confirmation. We believe data-driven social impact shouldn't be a luxury.
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