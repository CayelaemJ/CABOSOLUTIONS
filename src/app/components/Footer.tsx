function KenteStrip({ flipped = false }: { flipped?: boolean }) {
  const colors = flipped
    ? ['rgba(29,107,107,0.5)', 'rgba(201,168,76,0.5)', 'rgba(196,103,58,0.6)']
    : ['rgba(196,103,58,0.6)', 'rgba(201,168,76,0.5)', 'rgba(29,107,107,0.5)'];
  return (
    <div style={{ height: '4px', display: 'flex', overflow: 'hidden' }}>
      {Array.from({ length: 200 }, (_, i) => (
        <div key={i} style={{ flex: 1, background: colors[i % 3], minWidth: '8px' }} />
      ))}
    </div>
  );
}

export function Footer() {
  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Founders', href: '#founders' },
    { label: 'Process', href: '#process' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer style={{ background: '#080c10' }}>
      <KenteStrip />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3.5rem 5rem 2.5rem' }}>
        {/* Top row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}>
          {/* Logo */}
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 900,
              color: 'var(--cabo-clay)',
              letterSpacing: '0.06em',
              lineHeight: 1,
            }}>
              CABO
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.48rem',
              color: 'rgba(201,168,76,0.5)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              marginTop: '0.2rem',
            }}>
              Solutions
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.52rem',
              color: 'rgba(245,237,224,0.25)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginTop: '0.4rem',
            }}>
              Data · Story · Power
            </div>
          </div>

          {/* Tagline */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'rgba(245,237,224,0.4)',
            textAlign: 'center',
          }}>
            "Built for Africa's next chapter."
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  color: 'rgba(245,237,224,0.35)',
                  textDecoration: 'none',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cabo-clay)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,237,224,0.35)')}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'rgba(196,103,58,0.12)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <span style={{
            position: 'absolute',
            color: 'rgba(196,103,58,0.3)',
            fontSize: '0.75rem',
            background: '#080c10',
            padding: '0 0.75rem',
          }}>◈</span>
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'rgba(245,237,224,0.25)',
            letterSpacing: '0.08em',
          }}>
            © 2026 CABO Solutions. All rights reserved.
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            color: 'rgba(245,237,224,0.2)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Johannesburg, South Africa · Est. 2026
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            color: 'rgba(245,237,224,0.2)',
            letterSpacing: '0.08em',
          }}>
            Cayelaem Jantjies · Bokamoso Molefi
          </div>
        </div>
      </div>
      <KenteStrip flipped />
    </footer>
  );
}