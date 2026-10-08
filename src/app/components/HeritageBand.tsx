import { useRef, useEffect, useState } from 'react';

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

/* Ndebele / Kente-inspired SVG pattern overlay */
function GeometricPattern() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="ndebele" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* Outer diamond */}
          <polygon points="40,4 76,40 40,76 4,40"
            fill="none" stroke="rgba(245,237,224,0.08)" strokeWidth="1" />
          {/* Inner diamond */}
          <polygon points="40,16 64,40 40,64 16,40"
            fill="none" stroke="rgba(245,237,224,0.05)" strokeWidth="0.8" />
          {/* Kente stripe accents */}
          <rect x="36" y="0" width="8" height="4" fill="rgba(245,237,224,0.06)" />
          <rect x="36" y="76" width="8" height="4" fill="rgba(245,237,224,0.06)" />
          <rect x="0" y="36" width="4" height="8" fill="rgba(245,237,224,0.06)" />
          <rect x="76" y="36" width="4" height="8" fill="rgba(245,237,224,0.06)" />
          {/* Centre dot */}
          <circle cx="40" cy="40" r="2" fill="rgba(245,237,224,0.07)" />
        </pattern>
        {/* Beadwork top/bottom border strip */}
        <pattern id="beads" x="0" y="0" width="24" height="8" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="8" height="8" fill="rgba(196,103,58,0.25)" />
          <rect x="8" y="0" width="8" height="8" fill="rgba(201,168,76,0.2)" />
          <rect x="16" y="0" width="8" height="8" fill="rgba(29,107,107,0.2)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ndebele)" />
    </svg>
  );
}

const philosophies = [
  {
    heritage: 'Xhosa · Coloured',
    concept: '"Ubuntu"',
    translation: '"I am because we are."',
    body: 'Ubuntu — the philosophy of shared humanity — is how CABO Solutions operates. Every dataset tells a human story. Every insight serves a community.',
  },
  {
    heritage: 'Tswana',
    concept: '"Botho"',
    translation: '"Motho ke motho ka batho."',
    body: 'A person is a person through other people. Botho shapes how we build relationships with clients, carry out our work, and measure success beyond the bottom line.',
  },
  {
    heritage: 'Sesotho · Zulu',
    concept: '"Mahala"',
    translation: '"Freely given, freely shared."',
    body: 'The spirit of generosity runs through everything we do — in how we price for NGOs, share knowledge, and build capacity so communities can sustain their own data futures.',
  },
];

export function HeritageBand() {
  const { ref, visible } = useReveal();
  const { ref: quoteRef, visible: quoteVisible } = useReveal();

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #9B3E1A 0%, #C4673A 45%, #1D6B6B 100%)',
      }}
    >
      {/* Beadwork border — top */}
      <div style={{ height: '8px', background: 'url()', position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="8" preserveAspectRatio="none">
          <defs>
            <pattern id="beadTop" x="0" y="0" width="24" height="8" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="8" height="8" fill="rgba(196,103,58,0.6)" />
              <rect x="8" y="0" width="8" height="8" fill="rgba(201,168,76,0.5)" />
              <rect x="16" y="0" width="8" height="8" fill="rgba(29,107,107,0.5)" />
            </pattern>
          </defs>
          <rect width="100%" height="8" fill="url(#beadTop)" />
        </svg>
      </div>

      <div style={{ padding: '7rem 5rem', position: 'relative' }}>
        <GeometricPattern />

        {/* Overlay to darken */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(13,17,23,0.38)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Section label */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'rgba(245,237,224,0.65)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            marginBottom: '3.5rem',
          }}>
            <span style={{ width: '28px', height: '1px', background: 'rgba(245,237,224,0.45)', display: 'block', flexShrink: 0 }} />
            Rooted in African Philosophy
          </div>

          {/* Three-column philosophy grid */}
          <div
            ref={ref}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '3rem',
              marginBottom: '5rem',
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              opacity: visible ? 1 : 0,
              transition: 'all 0.8s ease',
            }}
          >
            {philosophies.map((p, i) => (
              <div key={p.heritage}>
                {/* Heritage tag */}
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  color: 'rgba(245,237,224,0.5)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  marginBottom: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    background: i === 0 ? '#C4673A' : i === 1 ? '#C9A84C' : '#1D6B6B',
                    borderRadius: '1px',
                    transform: 'rotate(45deg)',
                    flexShrink: 0,
                  }} />
                  {p.heritage}
                </div>

                {/* Concept */}
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: 'var(--cabo-warm-white)',
                  marginBottom: '0.5rem',
                  lineHeight: 1.2,
                }}>
                  {p.concept}
                </h3>

                {/* Translation */}
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'rgba(245,237,224,0.75)',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                  marginBottom: '1rem',
                }}>
                  {p.translation}
                </div>

                {/* Body */}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'rgba(245,237,224,0.55)',
                  lineHeight: 1.8,
                }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>

          {/* Ornament divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '4rem',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(245,237,224,0.12)' }} />
            <span style={{ color: 'rgba(245,237,224,0.3)', fontSize: '0.8rem', letterSpacing: '0.5em' }}>⟡ ◈ ⟡</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(245,237,224,0.12)' }} />
          </div>

          {/* Founders' quote */}
          <div
            ref={quoteRef}
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              textAlign: 'center',
              transform: quoteVisible ? 'translateY(0)' : 'translateY(24px)',
              opacity: quoteVisible ? 1 : 0,
              transition: 'all 0.9s ease',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              fontStyle: 'italic',
              color: 'rgba(245,237,224,0.9)',
              lineHeight: 1.75,
              marginBottom: '1.5rem',
            }}>
              "We are not outsiders looking in at Africa's data problem. We are the solution Africa produced from within itself — and we build for everyone who is part of this continent's future."
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: 'rgba(245,237,224,0.4)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              — Cayelaem Jantjies & Bokamoso Molefi · Co-Founders, CABO Solutions
            </div>
          </div>

          {/* Inclusive mission strip */}
          <div style={{
            marginTop: '4rem',
            padding: '1.5rem 2rem',
            border: '1px solid rgba(245,237,224,0.12)',
            borderRadius: '2px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            justifyContent: 'center',
          }}>
            {[
              'Start-ups & Founders',
              'SMEs & Growing Businesses',
              'Enterprises & Corporates',
              'NGOs & Non-Profits',
              'Government & Public Sector',
              'Creative & Cultural Organisations',
            ].map((group) => (
              <div
                key={group}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  color: 'rgba(245,237,224,0.55)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span style={{ color: 'var(--cabo-clay)', fontSize: '0.6rem' }}>◈</span>
                {group}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Beadwork border — bottom */}
      <div style={{ height: '8px', overflow: 'hidden' }}>
        <svg width="100%" height="8" preserveAspectRatio="none">
          <defs>
            <pattern id="beadBot" x="0" y="0" width="24" height="8" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="8" height="8" fill="rgba(29,107,107,0.5)" />
              <rect x="8" y="0" width="8" height="8" fill="rgba(201,168,76,0.5)" />
              <rect x="16" y="0" width="8" height="8" fill="rgba(196,103,58,0.6)" />
            </pattern>
          </defs>
          <rect width="100%" height="8" fill="url(#beadBot)" />
        </svg>
      </div>
    </section>
  );
}