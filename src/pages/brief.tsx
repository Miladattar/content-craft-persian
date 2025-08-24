
import React, { useState } from "react";
import { createRoot } from "react-dom/client";

async function post(url:string, data:any) {
  const r = await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(data) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

function App() {
  const [brief, setBrief] = useState<any>({
    goal: "sales", industry: "", pageType: "آموزشی", audience: "",
    tone: "خودمونی-حرفه‌ای", guardrails: ["بی‌اغراق/بدون منبع ممنوع","بدون ایموجی/نقل‌قول"], capacity: 5
  });
  const [snap, setSnap] = useState<any>(null);
  const [ideas, setIdeas] = useState<any>(null);
  const [script, setScript] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function makeSnapshot() {
    try { setLoading(true); setErr(""); setSnap(await post("/api/strategy/snapshot", brief)); }
    catch(e:any){ setErr(e.message) } finally { setLoading(false); }
  }
  async function makeBacklog() {
    try { setLoading(true); setErr(""); setIdeas(await post("/api/backlog", { strategy: brief })); }
    catch(e:any){ setErr(e.message) } finally { setLoading(false); }
  }
  async function makeScript() {
    try { setLoading(true); setErr(""); setScript(await post("/api/script", { idea:{ template:"WrongRight", format:"reels" }, strategy: brief })); }
    catch(e:any){ setErr(e.message) } finally { setLoading(false); }
  }

  return (
    <main style={{maxWidth:960, margin:"0 auto", padding:24}}>
      <h1 style={{fontWeight:700, fontSize:20}}>ویزارد تولید محتوا</h1>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, border:"1px solid #e5e7eb", borderRadius:8, padding:12}}>
        <div>
          <label>هدف کمپین</label>
          <select value={brief.goal} onChange={e=>setBrief({...brief,goal:e.target.value})}>
            <option value="sales">افزایش فروش</option><option value="awareness">آگاهی</option><option value="leads">لیدگیری</option>
          </select>
        </div>
        <div><label>حوزه/صنعت</label><input value={brief.industry} onChange={e=>setBrief({...brief,industry:e.target.value})}/></div>
        <div><label>نوع پیج</label><select value={brief.pageType} onChange={e=>setBrief({...brief,pageType:e.target.value})}><option>آموزشی</option><option>خدماتی</option><option>محصول‌محور</option></select></div>
        <div style={{gridColumn:"1 / -1"}}><label>مخاطب هدف</label><textarea value={brief.audience} onChange={e=>setBrief({...brief,audience:e.target.value})}/></div>
        <div><label>لحن</label><select value={brief.tone} onChange={e=>setBrief({...brief,tone:e.target.value})}><option>خودمونی-حرفه‌ای</option><option>رسمی</option><option>خودمونی</option></select></div>
        <div><label>ظرفیت هفتگی</label><input type="number" value={brief.capacity} onChange={e=>setBrief({...brief,capacity:Number(e.target.value)})}/></div>
      </div>

      <div style={{display:"flex", gap:8, marginTop:12}}>
        <button onClick={makeSnapshot} disabled={loading}>اسنپ‌شات استراتژی</button>
        <button onClick={makeBacklog} disabled={loading}>۱۲۰ ایده</button>
        <button onClick={makeScript} disabled={loading}>اسکریپت نمونه (WrongRight)</button>
      </div>
      {loading && <p>در حال ساخت…</p>}
      {err && <p style={{color:"#b91c1c"}}>{err}</p>}

      {snap && (
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginTop:12}}>
          <div style={{border:"1px solid #e5e7eb", borderRadius:8, padding:12}}><h3 style={{fontWeight:700}}>ستون‌ها</h3><ul>{snap.pillars?.map((p:string,i:number)=>(<li key={i}>{p}</li>))}</ul></div>
          <div style={{border:"1px solid #e5e7eb", borderRadius:8, padding:12}}><h3 style={{fontWeight:700}}>قیف</h3><div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8}}><div>آگاهی {Math.round((snap.funnel?.awareness||0)*100)}%</div><div>تأمل {Math.round((snap.funnel?.consideration||0)*100)}%</div><div>اقدام {Math.round((snap.funnel?.action||0)*100)}%</div></div></div>
          <div style={{border:"1px solid #e5e7eb", borderRadius:8, padding:12}}><h3 style={{fontWeight:700}}>برنامه هفتگی</h3><div>Reels: {snap.mix_weekly?.reels} / Stories: {snap.mix_weekly?.stories} / Posts: {snap.mix_weekly?.posts}</div></div>
        </div>
      )}

      {ideas && (
        <div style={{border:"1px solid #e5e7eb", borderRadius:8, padding:12, marginTop:12}}>
          <h3 style={{fontWeight:700}}>ایده‌ها</h3>
          <ul>{ideas.items?.map((it:any,i:number)=>(<li key={i}>{it.title} — {it.format||""}</li>))}</ul>
        </div>
      )}

      {script && (
        <div style={{border:"1px solid #e5e7eb", borderRadius:8, padding:12, marginTop:12}}>
          <h3 style={{fontWeight:700}}>اسکریپت</h3>
          <pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(script, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App/>);
