import { useEffect } from 'react';

type Profile = { name: string; role: string; email: string; phone: string; linkedin: string; photo: string; slug: string; summary: string };
const profiles: Record<string, Profile> = {
  cayelaem: { slug: 'cayelaem', name: 'Cayelaem Jantjies', role: 'Co-Founder · Data & Technology', email: 'cayelaem@cabosolutions.co.za', phone: '+27 64 500 7574', linkedin: 'https://www.linkedin.com/in/cayelaem-jantjies-000b45144/', photo: '/images/founders/cayelaem.jpg', summary: 'Data engineering, business intelligence, software development and automation.' },
  bokamoso: { slug: 'bokamoso', name: 'Bokamoso Molefi', role: 'Co-Founder · Operations & Growth', email: 'bokamoso@cabosolutions.co.za', phone: '+27 74 787 7904', linkedin: 'https://www.linkedin.com/in/bokamoso-molefi-4a1b89239/', photo: '/images/founders/bokamoso.jpg', summary: 'Operations, marketing strategy, communications and business development.' },
};
const escapeVCard = (value: string) => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
export function NfcProfile({ slug }: { slug: string }) {
  const person = profiles[slug];
  useEffect(() => { document.title = person ? `${person.name} | CABO Solutions` : 'Digital Business Card | CABO Solutions'; }, [person]);
  if (!person) return <main style={{ minHeight: '100vh', padding: '4rem 1rem', background: '#0D1117', color: '#F5EDE0', textAlign: 'center' }}><h1>Profile not found</h1><p>That CABO digital card is not available.</p><a href="/" style={{ color: '#C4673A' }}>Back to CABO Solutions</a></main>;
  const saveContact = () => {
    const parts = person.name.split(' ');
    const card = ['BEGIN:VCARD','VERSION:3.0',`N:${escapeVCard(parts.slice(1).join(' '))};${escapeVCard(parts[0])};;;`,`FN:${escapeVCard(person.name)}`,`ORG:CABO Solutions`,`TITLE:${escapeVCard(person.role)}`,`EMAIL;TYPE=WORK:${person.email}`,`TEL;TYPE=CELL:${person.phone}`,`URL:https://cabosolutions.co.za`,`URL;TYPE=LinkedIn:${person.linkedin}`,'END:VCARD'].join('\r\n');
    const url = URL.createObjectURL(new Blob([card], { type: 'text/vcard;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `CABO-${person.slug}.vcf`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const linkStyle = { display: 'block', textDecoration: 'none', textAlign: 'center' as const, padding: '0.95rem 1rem', borderRadius: '4px', fontWeight: 600, fontFamily: 'var(--font-body)', border: '1px solid rgba(196,103,58,.45)', color: '#F5EDE0' };
  return <main style={{ minHeight: '100vh', background: '#0D1117', color: '#F5EDE0', padding: 'clamp(1.25rem,5vw,4rem) 1rem', fontFamily: 'var(--font-body)' }}>
    <div style={{ width: '100%', maxWidth: 460, margin: '0 auto', background: '#171A1D', border: '1px solid rgba(196,103,58,.28)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ height: 4, background: '#C4673A' }} />
      <div style={{ padding: '1.75rem' }}>
        <a href="/" style={{ color: '#C4673A', textDecoration: 'none', fontSize: '.76rem', letterSpacing: '.16em', fontWeight: 700 }}>CABO SOLUTIONS</a>
        <div style={{ marginTop: '1.5rem', width: 136, height: 136, borderRadius: '50%', overflow: 'hidden', background: '#31241e', border: '2px solid #C4673A' }}>
          <img src={person.photo} alt={`Portrait of ${person.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 28%' }} />
        </div>
        <p style={{ color: '#C4673A', textTransform: 'uppercase', letterSpacing: '.14em', fontSize: '.7rem', margin: '1.5rem 0 .5rem' }}>Digital business card</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 7vw, 2.8rem)', lineHeight: 1.1, margin: '0 0 .65rem' }}>{person.name}</h1>
        <p style={{ color: '#D9C5B5', margin: '0 0 1rem' }}>{person.role}</p>
        <p style={{ color: '#BFB7AF', lineHeight: 1.7, marginBottom: '1.8rem' }}>{person.summary}</p>
        <div style={{ display: 'grid', gap: '.7rem' }}>
          <button onClick={saveContact} style={{ ...linkStyle, cursor: 'pointer', background: '#C4673A', color: '#111', borderColor: '#C4673A', fontSize: '1rem' }}>Save contact</button>
          <a href={`mailto:${person.email}`} style={linkStyle}>Email</a>
          <a href={`tel:${person.phone.replace(/\s/g, '')}`} style={linkStyle}>Call</a>
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" style={linkStyle}>LinkedIn</a>
          <a href="/#contact" style={linkStyle}>Enquire with CABO</a>
        </div>
        <p style={{ color: '#958A81', fontSize: '.75rem', lineHeight: 1.6, marginTop: '1.5rem' }}>Save this profile to your contacts. NFC tags can be programmed with this page's URL once the website is deployed.</p>
      </div>
    </div>
  </main>;
}
