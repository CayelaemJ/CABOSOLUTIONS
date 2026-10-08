import { useRef, useEffect, useState } from 'react';
import { Linkedin } from 'lucide-react';

const founders = [
  {
    initial: 'CJ',
    portrait: '/images/founders/cayelaem.jpg',
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
    portrait: '/images/founders/bokamoso.jpg',
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
  const shortRole = index === 0 ? 'DATA & TECHNOLOGY' : 'OPERATIONS & GROWTH';
  const featuredSkills = index === 0
    ? ['Data Engineering & BI', 'Software Development', 'Automation & Integrations', 'Analytics & AI', 'Data Governance & QA', 'Azure, Fabric & Cloud']
    : ['Operations & Process', 'Marketing & Social Media', 'PR & Communications', 'Client Success & Delivery', 'Business Development'];
  return (
    <article ref={ref} className="cabo-founder-card" style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity .7s ease, transform .7s ease',
      transitionDelay: `${index * 120}ms`
    }}>
      <div className="cabo-founder-photo">
        <img src={founder.portrait} alt={`${founder.name} ${founder.surname}, CABO Solutions co-founder`} loading="lazy" />
        <div className="cabo-founder-photo-shade" aria-hidden="true" />
      </div>
      <div className="cabo-founder-info">
        <span className="cabo-founder-eyebrow">CO-FOUNDER</span>
        <h3>{founder.name} {founder.surname}</h3>
        <p className="cabo-founder-role">{shortRole}</p>
        <span className="cabo-founder-rule" aria-hidden="true" />
        <p className="cabo-founder-bio">{founder.bio}</p>
        <div className="cabo-founder-tags" aria-label="Areas of expertise">
          {featuredSkills.map(skill => <span key={skill}>{skill}</span>)}
        </div>
        <div className="cabo-founder-contact">
          <a href={`mailto:${founder.email}`}>✉ {founder.email}</a>
          <a href={founder.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={14} /> LinkedIn</a>
          <a href={`tel:${founder.phone}`}>✆ {founder.phone}</a>
        </div>
      </div>
    </article>
  );
}

export function Founders() {
  const { ref: headRef, visible: headVisible } = useReveal();

  return (
    <section
      id="founders"
      style={{
        background: '#0D1117',
        padding: 'clamp(4rem, 7vw, 8rem) clamp(1rem, 5vw, 5rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .cabo-founder-card{display:grid;grid-template-columns:46% minmax(0,1fr);position:relative;isolation:isolate;min-height:470px;background:#141313;border:1px solid rgba(196,103,58,.26);border-radius:15px;overflow:hidden}
        .cabo-founder-photo{position:relative;min-width:0;overflow:hidden;background:radial-gradient(ellipse at 46% 35%,#92502f 0%,#42271f 42%,#171414 78%)}
        .cabo-founder-photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:center top;filter:grayscale(.28) sepia(.48) saturate(.82) contrast(1.22) brightness(.73)}
        .cabo-founder-photo-shade{position:absolute;inset:0;background:radial-gradient(ellipse at 52% 33%,rgba(204,112,62,.10) 0%,rgba(59,28,20,.38) 49%,rgba(16,15,15,.8) 95%),linear-gradient(90deg,rgba(30,16,13,.15) 0%,rgba(20,19,19,.85) 100%),linear-gradient(0deg,#141313 0%,rgba(20,19,19,.45) 24%,transparent 53%);pointer-events:none}
        .cabo-founder-info{position:relative;z-index:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;padding:clamp(1.2rem,2.3vw,2.1rem) clamp(1rem,2.2vw,2rem)}
        .cabo-founder-eyebrow{font:600 .68rem var(--font-mono);letter-spacing:.2em;color:#cb7954}
        .cabo-founder-info h3{font-family:var(--font-display);font-size:clamp(1.45rem,2.3vw,2.4rem);font-weight:500;line-height:1.12;color:var(--cabo-warm-white);margin:.6rem 0 .8rem;overflow-wrap:anywhere}
        .cabo-founder-role{font:500 .67rem var(--font-mono);letter-spacing:.16em;color:#e2cfc2}
        .cabo-founder-rule{width:36px;height:3px;background:#c46b48;margin:1rem 0}
        .cabo-founder-bio{font:400 .82rem/1.65 var(--font-body);color:rgba(245,237,224,.72);margin:0 0 1.2rem;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:8;overflow:hidden}
        .cabo-founder-tags{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1.5rem}
        .cabo-founder-tags span{font:500 .59rem/1.35 var(--font-body);color:#e7c6b2;background:rgba(196,103,58,.1);border:1px solid rgba(196,103,58,.19);border-radius:20px;padding:.4rem .6rem}
        .cabo-founder-contact{display:flex;flex-direction:column;gap:.5rem;margin-top:auto;max-width:100%}
        .cabo-founder-contact a{display:flex;align-items:center;gap:.5rem;color:rgba(245,237,224,.74);font:400 .7rem/1.5 var(--font-body);text-decoration:none;overflow-wrap:anywhere}
        .cabo-founder-contact a:hover{color:#e9a17a}
        @media(max-width:1100px){.cabo-founder-card{grid-template-columns:1fr;min-height:0}.cabo-founder-photo{height:320px}.cabo-founder-photo-shade{background:radial-gradient(ellipse at 50% 30%,rgba(181,88,45,.08),rgba(21,17,17,.48) 75%),linear-gradient(0deg,#141313 0%,rgba(20,19,19,.8) 18%,transparent 65%),linear-gradient(90deg,rgba(20,19,19,.3),transparent 35%,rgba(20,19,19,.3))}.cabo-founder-info{padding:1.5rem}.cabo-founder-bio{-webkit-line-clamp:unset;display:block}}
        @media(max-width:640px){.cabo-founder-photo{height:300px}.cabo-founder-card{border-radius:10px}.cabo-founder-info h3{font-size:1.8rem}}
        @media(prefers-reduced-motion:reduce){.cabo-founder-card{transition:none!important}}
      `}</style>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 520px), 1fr))',
          gap: '1.4rem',
        }}>
          {founders.map((f, i) => (
            <FounderCard key={f.name} founder={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}