import { useEffect, useRef } from 'react';

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

/* African geometric mandala — inspired by Ndebele beadwork and Kente weave rhythm */
function AfricanMandala() {
  const rings = [200, 170, 138, 104, 72];
  const centre = 210;

  // Ndebele-inspired diamond points around the outer rings
  const outerPoints = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15 - 90) * Math.PI / 180;
    return {
      x: centre + rings[0] * Math.cos(angle),
      y: centre + rings[0] * Math.sin(angle),
      major: i % 6 === 0,
      accent: i % 3 === 0,
    };
  });

  // Kente-inspired segmented arcs on second ring
  const kente = Array.from({ length: 12 }, (_, i) => {
    const startAngle = (i * 30 - 90) * Math.PI / 180;
    const endAngle = ((i * 30 + 22) - 90) * Math.PI / 180;
    const r = rings[1];
    return {
      x1: centre + r * Math.cos(startAngle),
      y1: centre + r * Math.sin(startAngle),
      x2: centre + r * Math.cos(endAngle),
      y2: centre + r * Math.sin(endAngle),
      startAngle,
      endAngle,
      color: i % 3 === 0 ? '#C4673A' : i % 3 === 1 ? '#C9A84C' : '#1D6B6B',
      opacity: 0.5,
    };
  });

  return (
    <div style={{
      position: 'relative',
      width: '420px',
      height: '420px',
      flexShrink: 0,
    }}>
      <style>{`
        @keyframes mandala-outer { to { transform: rotate(360deg); } }
        @keyframes mandala-inner { to { transform: rotate(-360deg); } }
        @keyframes mandala-mid { to { transform: rotate(180deg); } }
        @keyframes pulse-centre {
          0%,100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.97); }
        }
      `}</style>

      {/* Outermost slow ring */}
      <div style={{
        position: 'absolute',
        inset: 0,
        animation: 'mandala-outer 80s linear infinite',
        transformOrigin: 'center',
      }}>
        <svg viewBox="0 0 420 420" style={{ width: '100%', height: '100%' }}>
          {/* Outer ring */}
          <circle cx={centre} cy={centre} r={rings[0]} fill="none" stroke="#C4673A" strokeWidth="1" strokeOpacity="0.22" />

          {/* Ndebele diamond points */}
          {outerPoints.map((p, i) => (
            <g key={i}>
              {p.major ? (
                /* Large diamond at cardinal points */
                <polygon
                  points={`
                    ${p.x},${p.y - 7}
                    ${p.x + 4},${p.y}
                    ${p.x},${p.y + 7}
                    ${p.x - 4},${p.y}
                  `}
                  fill={i % 12 === 0 ? '#C4673A' : '#C9A84C'}
                  fillOpacity={i % 12 === 0 ? 0.7 : 0.45}
                />
              ) : p.accent ? (
                /* Medium marks */
                <rect
                  x={p.x - 2}
                  y={p.y - 2}
                  width="4"
                  height="4"
                  fill="#C9A84C"
                  fillOpacity="0.3"
                  transform={`rotate(45, ${p.x}, ${p.y})`}
                />
              ) : (
                /* Small tick */
                <circle cx={p.x} cy={p.y} r="1.2" fill="#C9A84C" fillOpacity="0.18" />
              )}
            </g>
          ))}

          {/* Dash ring just inside */}
          <circle cx={centre} cy={centre} r={rings[0] - 12} fill="none"
            stroke="#C4673A" strokeWidth="0.5" strokeOpacity="0.12"
            strokeDasharray="3 9" />
        </svg>
      </div>

      {/* Kente-inspired segmented arcs — counter-rotate */}
      <div style={{
        position: 'absolute',
        inset: 0,
        animation: 'mandala-inner 60s linear infinite',
        transformOrigin: 'center',
      }}>
        <svg viewBox="0 0 420 420" style={{ width: '100%', height: '100%' }}>
          {kente.map((seg, i) => (
            <path
              key={i}
              d={`M ${centre + rings[1] * Math.cos(seg.startAngle)} ${centre + rings[1] * Math.sin(seg.startAngle)}
                  A ${rings[1]} ${rings[1]} 0 0 1 ${centre + rings[1] * Math.cos(seg.endAngle)} ${centre + rings[1] * Math.sin(seg.endAngle)}`}
              fill="none"
              stroke={seg.color}
              strokeWidth="4"
              strokeOpacity={seg.opacity}
              strokeLinecap="round"
            />
          ))}
          {/* Solid ring under kente */}
          <circle cx={centre} cy={centre} r={rings[1]} fill="none"
            stroke="rgba(196,103,58,0.1)" strokeWidth="12" />
        </svg>
      </div>

      {/* Inner geometric ring — slow clockwise */}
      <div style={{
        position: 'absolute',
        inset: 0,
        animation: 'mandala-mid 120s linear infinite',
        transformOrigin: 'center',
      }}>
        <svg viewBox="0 0 420 420" style={{ width: '100%', height: '100%' }}>
          {/* Beadwork-style dotted ring */}
          {Array.from({ length: 32 }, (_, i) => {
            const angle = (i * 360 / 32 - 90) * Math.PI / 180;
            const x = centre + rings[2] * Math.cos(angle);
            const y = centre + rings[2] * Math.sin(angle);
            return (
              <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 3 : 1.5}
                fill={i % 4 === 0 ? '#C4673A' : '#C9A84C'}
                fillOpacity={i % 4 === 0 ? 0.55 : 0.25} />
            );
          })}

          {/* Thin structural ring */}
          <circle cx={centre} cy={centre} r={rings[3]} fill="none"
            stroke="#1D6B6B" strokeWidth="0.75" strokeOpacity="0.3"
            strokeDasharray="5 5" />

          {/* Cross / plus marks at 8 compass points */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i * 45 - 90) * Math.PI / 180;
            const x = centre + rings[3] * Math.cos(angle);
            const y = centre + rings[3] * Math.sin(angle);
            return (
              <g key={i} transform={`translate(${x},${y}) rotate(${i * 45})`}>
                <line x1="-4" y1="0" x2="4" y2="0" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.5" />
                <line x1="0" y1="-4" x2="0" y2="4" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.5" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Centre mark — static */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          textAlign: 'center',
          animation: 'pulse-centre 5s ease-in-out infinite',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 900,
            color: 'var(--cabo-clay)',
            letterSpacing: '0.1em',
            lineHeight: 1,
          }}>
            CABO
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.45rem',
            color: 'rgba(201,168,76,0.6)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginTop: '0.2rem',
          }}>
            Solutions
          </div>
          <div style={{
            width: '30px',
            height: '1px',
            background: 'var(--cabo-clay)',
            margin: '0.4rem auto 0',
            opacity: 0.5,
          }} />
        </div>
      </div>
    </div>
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
            CABO Solutions is a full-service data intelligence and business growth studio — built for Africa's next chapter, open to every kind of business, every sector, every stage of growth.
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

        {/* Right — African mandala */}
        <div className="hidden lg:flex" style={{ alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <AfricanMandala />
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