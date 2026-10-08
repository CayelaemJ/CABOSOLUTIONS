import { useState } from 'react';

const examples = [
  { tag:'Business intelligence', title:'Executive intelligence centre', description:'Explore how a unified decision workspace can bring financial, operational and customer indicators together.', metrics:['Revenue performance','Operational efficiency','Customer outcomes'], kind:'data' },
  { tag:'Automation', title:'Workflow orchestration', description:'See how approvals, notifications and routine reporting can flow through one accountable process.', metrics:['Trigger','Validate','Approve','Notify'], kind:'process' },
  { tag:'Operations', title:'Transformation roadmap', description:'A model for translating business bottlenecks into measurable improvements and accountable milestones.', metrics:['Discover','Design','Deliver','Measure'], kind:'roadmap' },
];
export function Portfolio() {
  const [selected,setSelected]=useState(0);
  const item=examples[selected];
  return <section id="work" className="cabo-work">
    <div className="cabo-work-inner">
      <div className="cabo-work-kicker">Interactive studio showcase</div>
      <h2>Work that connects <em>ideas to impact.</em></h2>
      <p className="cabo-work-lede">Explore interactive concept demonstrations of our capabilities. These are illustrative previews, not claims about completed client engagements. Verified client case studies can be published with approval.</p>
      <div className="cabo-work-tabs" role="tablist" aria-label="Explore project concepts">
        {examples.map((entry,index)=><button key={entry.title} role="tab" aria-selected={selected===index} className={selected===index?'active':''} onClick={()=>setSelected(index)}>{String(index+1).padStart(2,'0')} / {entry.tag}</button>)}
      </div>
      <div className="cabo-work-grid" role="tabpanel">
        <div className="cabo-work-visual" aria-label={item.title+' interactive illustration'}>
          <div className="cabo-work-orbit" key={item.kind}>
            <div className="cabo-work-center">CABO<span>{item.tag}</span></div>
            {item.metrics.map((metric,index)=><div key={metric} className={'cabo-work-node n'+index}>{metric}</div>)}
          </div>
        </div>
        <div className="cabo-work-copy"><span>CONCEPT {String(selected+1).padStart(2,'0')}</span><h3>{item.title}</h3><p>{item.description}</p><ul>{item.metrics.map(metric=><li key={metric}>{metric}</li>)}</ul><a href="#contact">Discuss a similar project →</a></div>
      </div>
    </div>
  </section>;
}
