import { useRef, useEffect, useState } from 'react';
import { Linkedin } from 'lucide-react';

const founders = [
  {
    initial: 'CJ',
    name: 'Cayelaem',
    surname: 'Jantjies',
    pronoun: 'he/him',
    title: 'Data Engineer · BI & Analytics Engineer · Full-Stack Developer · Automation & QA',
    heritage: 'Coloured · Xhosa · Pretoria-born',
    bio: 'BCom Statistics & Data Science graduate from the University of Pretoria. 3+ years delivering data solutions across manufacturing, banking, FMCG, broadcasting, agriculture, and non-profits. Experience delivering multi-tenant financial-wellness software, data integrations, security and governance controls, regression testing, and production deployments, as well as independently owning BI and automation for an Australian manufacturer. These engagements reflect individual professional experience, not necessarily direct CABO client contracts.',
    skills: ['Power BI', 'SQL / T-SQL', 'Microsoft Fabric', 'Python', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Power Automate', 'QA & CI', 'RBAC', 'Data Governance'],
    email: 'cayelaem@cabosolutions.co.za',
    phone: '+27 64 500 7574',
    linkedin: 'https://www.linkedin.com/in/cayelaem-jantjies-000b45144/',
    accentChar: '◈',
  },
  {
    initial: 'BM',
    name: 'Bokamoso',
    surname: 'Molefi',
    pronoun: 'she/her',
    title: 'Operations Lead · Marketing Strategist · Business Developer',
    heritage: 'Tswana · Johannesburg-based',
    bio: 'BBM Honours graduate — Dean\'s Award recipient at Botho University. 4+ years across operations management, project coordination, and marketing strategy. She is the connector and builder behind CABO Solutions\' business development, client relationships, and communications infrastructure.',
    skills: ['Operations Management', 'Project Coordination', 'Marketing Strategy', 'PR & Communications', 'SOP Development', 'Business Development', 'Stakeholder Management'],
    email: 'bokamoso@cabosolutions.co.za',
    phone: '+27 74 787 7904',
    linkedin: 'https://www.linkedin.com/in/bokamoso-molefi-4a1b89239/',
    accentChar: '⟡',
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

function FounderCard({ founder, index }: { founder: typeof founders[0]; index: number }) {
  const { ref, visible } = useReveal();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--cabo-ink)',
        border: `1px solid ${hovered ? 'rgba(196,103,58,0.35)' : 'rgba(196,103,58,0.15)'}`,
        borderRadius: '4px',
        overflow: 'hidden',
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.8s ease, border-color 0.3s',
        transitionDelay: `${index * 0.2}s`,
      }}
    >
      {/* Clay top bar */}
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, var(--cabo-clay), var(--cabo-gold))',
      }} />

      <div style={{ padding: '2.5rem 2.5rem 3rem' }}>
        {/* Monogram avatar */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1.2rem',
          marginBottom: '1.8rem',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(196,103,58,0.3), rgba(201,168,76,0.2))',
            border: '1px solid rgba(196,103,58,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--cabo-clay)',
            flexShrink: 0,
          }}>
            {founder.initial}
          </div>
          <div>
            {/* Name */}
            <div style={{ marginBottom: '0.2rem' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.8rem',
                fontWeight: 700,
                color: 'var(--cabo-warm-white)',
              }}>
                {founder.name}{' '}
              </span>
              <em style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.8rem',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'var(--cabo-sand)',
              }}>
                {founder.surname}
              </em>
            </div>
            {/* Pronoun */}
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              color: 'rgba(201,168,76,0.5)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              {founder.pronoun}
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--cabo-gold)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '0.9rem',
          lineHeight: 1.65,
        }}>
          {founder.title}
        </div>

        {/* Heritage line */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'rgba(245,237,224,0.4)',
          letterSpacing: '0.1em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
        }}>
          <span style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: 'var(--cabo-clay)',
            display: 'inline-block',
            flexShrink: 0,
          }} />
          {founder.heritage}
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'rgba(196,103,58,0.12)',
          marginBottom: '1.5rem',
        }} />

        {/* Bio */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          color: 'rgba(245,237,224,0.58)',
          lineHeight: 1.8,
          marginBottom: '2rem',
        }}>
          {founder.bio}
        </p>

        {/* Skills */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: 'rgba(196,103,58,0.45)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '0.8rem',
          }}>
            Core Skills
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {founder.skills.map((skill) => (
              <span
                key={skill}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.57rem',
                  letterSpacing: '0.07em',
                  padding: '0.28rem 0.75rem',
                  background: 'rgba(196,103,58,0.1)',
                  border: '1px solid rgba(196,103,58,0.22)',
                  borderRadius: '2px',
                  color: 'var(--cabo-clay)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Contact row */}
        <div style={{
          borderTop: '1px solid rgba(196,103,58,0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.55rem',
        }}>
          <a
            href={`mailto:${founder.email}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'rgba(245,237,224,0.45)',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cabo-clay)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,237,224,0.45)')}
          >
            ✉ {founder.email}
          </a>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a
              href={`tel:${founder.phone}`}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                color: 'rgba(245,237,224,0.45)',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cabo-clay)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,237,224,0.45)')}
            >
              ✆ {founder.phone}
            </a>
            <a
              href={founder.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                color: 'rgba(245,237,224,0.35)',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cabo-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,237,224,0.35)')}
            >
              <Linkedin size={12} />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Founders() {
  const { ref: headRef, visible: headVisible } = useReveal();

  return (
    <section
      id="founders"
      style={{
        background: '#0D1117',
        padding: '8rem 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* African kente-inspired top border */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'repeating-linear-gradient(90deg, var(--cabo-clay) 0px, var(--cabo-clay) 12px, var(--cabo-gold) 12px, var(--cabo-gold) 18px, var(--cabo-teal) 18px, var(--cabo-teal) 24px, transparent 24px, transparent 36px)',
        opacity: 0.5,
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(196,103,58,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(29,107,107,0.03) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

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
          The Founders
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
            Built by people who{' '}
            <em style={{ color: 'var(--cabo-clay)', fontStyle: 'italic' }}>live the work.</em>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'rgba(245,237,224,0.55)',
            maxWidth: '620px',
            lineHeight: 1.75,
          }}>
            CABO Solutions was founded by two people who bring complementary expertise and a shared conviction: Africa deserves world-class data intelligence — built by Africans, for every business, in every sector, at every stage.
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
        }}>
          {founders.map((f, i) => (
            <FounderCard key={f.name} founder={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}