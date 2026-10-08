import { useEffect, useRef } from 'react';
import { CaboDataUniverse } from './CaboDataUniverse';

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1100,
      r: Math.random() * 1.2 + 0.3,
      base: Math.random() * 0.5 + 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.6 + 0.3,
    }));

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const t = Date.now() * 0.001;
      stars.forEach((s) => {
        const opacity = s.base + Math.sin(t * s.speed + s.phase) * 0.15;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,237,224,${Math.max(0.05, Math.min(0.75, opacity))})`;
        ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '8rem 5rem 5rem',
        background: 'var(--cabo-bg)',
      }}
    >
      <StarField />

      {/* Warm radial gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 70% at 25% 50%, rgba(196,103,58,0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 75% 50%, rgba(29,107,107,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4rem',
      }}>
        {/* Left — headline block */}
        <div style={{ flex: 1 }}>
          {/* Eyebrow */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--cabo-clay)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span style={{ display: 'block', width: '32px', height: '1px', background: 'var(--cabo-clay)', flexShrink: 0 }} />
            Data Intelligence & Business Growth · Johannesburg
          </div>

          {/* Main headline */}
          <div style={{ lineHeight: 1.05, marginBottom: '1.8rem' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.8rem, 8vw, 7.5rem)',
              fontWeight: 900,
              color: 'var(--cabo-warm-white)',
              display: 'block',
            }}>
              Data.
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.8rem, 8vw, 7.5rem)',
              fontWeight: 700,
              fontStyle: 'italic',
              color: 'var(--cabo-clay)',
              display: 'block',
            }}>
              Story.
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.8rem, 8vw, 7.5rem)',
              fontWeight: 400,
              color: 'var(--cabo-sand)',
              display: 'block',
            }}>
              Power.
            </div>
          </div>

          {/* Subheading */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            color: 'rgba(245,237,224,0.65)',
            maxWidth: '520px',
            lineHeight: 1.75,
            marginBottom: '2.5rem',
          }}>
            CABO Solutions is a full-service data intelligence and business growth studio built for Africa's next chapter, open to every kind of business, every sector, every stage of growth.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <a
              href="#services"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '0.9rem 2.2rem',
                background: 'var(--cabo-clay)',
                color: 'var(--cabo-warm-white)',
                textDecoration: 'none',
                borderRadius: '2px',
                transition: 'all 0.25s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--cabo-rust)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--cabo-clay)';
                el.style.transform = 'translateY(0)';
              }}
            >
              Explore Our Services
            </a>
            <a
              href="#contact"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '0.9rem 2.2rem',
                background: 'transparent',
                color: 'var(--cabo-sand)',
                textDecoration: 'none',
                borderRadius: '2px',
                border: '1px solid rgba(232,213,190,0.3)',
                transition: 'all 0.25s',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--cabo-clay)';
                el.style.color = 'var(--cabo-clay)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(232,213,190,0.3)';
                el.style.color = 'var(--cabo-sand)';
              }}
            >
              Work With Us
            </a>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(196,103,58,0.2)',
            flexWrap: 'wrap',
          }}>
            {[
              { value: '7+', label: 'Industries Served' },
              { value: '50–70%', label: 'Manual Work Reduced' },
              { value: 'Any Stage', label: 'Start-up to Enterprise' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  color: 'var(--cabo-clay)',
                  lineHeight: 1,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  color: 'rgba(245,237,224,0.5)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginTop: '0.35rem',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — interactive CABO data universe */}
        <div className="cabo-hero-universe-wrap">
          <CaboDataUniverse />
        </div>
      </div>

      {/* Bottom left badge */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '5rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'rgba(245,237,224,0.4)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
      }}>
        <span style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, var(--cabo-clay), transparent)', display: 'block' }} />
        Johannesburg, South Africa · Est. 2026
      </div>
    </section>
  );
}