import { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Founders', href: '#founders' },
  { label: 'Process', href: '#process' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className="cabo-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '1.1rem 5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(13,17,23,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid rgba(196,103,58,0.25)' : '1px solid transparent',
          transition: 'border-color 0.4s ease',
        }}
      >
        <a
          href="#"
          style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1 }}
        >
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 900,
            color: 'var(--cabo-clay)',
            letterSpacing: '0.05em',
            lineHeight: 1,
          }}>
            CABO
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            color: 'rgba(201,168,76,0.7)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            marginTop: '0.15rem',
          }}>
            Solutions
          </span>
        </a>

        {/* Desktop links */}
        <ul
          className="cabo-nav-links"
          style={{
            gap: '2.5rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            alignItems: 'center',
          }}
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--cabo-sand)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cabo-clay)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--cabo-sand)')}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                padding: '0.55rem 1.4rem',
                background: 'var(--cabo-clay)',
                color: 'var(--cabo-warm-white)',
                textDecoration: 'none',
                borderRadius: '2px',
                transition: 'background 0.2s, transform 0.2s',
                display: 'inline-block',
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
              Work With Us
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="cabo-nav-toggle"
          onClick={() => setOpen(!open)
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--cabo-clay)',
            cursor: 'pointer',
            padding: '0.25rem',
          }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="cabo-mobile-menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(13,17,23,0.97)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {[...links, { label: 'Work With Us', href: '#contact' }].map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                color: 'var(--cabo-warm-white)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}