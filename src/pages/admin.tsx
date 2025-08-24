
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import type { PromptPack, TemplateKey } from "../lib/types.prompts";

function App() {
  const [key, setKey] = useState("");
  const [pack, setPack] = useState<PromptPack | null>(null);
  const [tab, setTab] = useState<"prompts"|"hooks">("prompts");
  const [sel, setSel] = useState<TemplateKey | "globals">("globals");

  async function load() {
    const res = await fetch(`/api/admin/prompts?key=${encodeURIComponent(key)}`);
    if (res.ok) setPack(await res.json());
    else alert("دسترسی نامعتبر");
  }
  function save() {
    fetch("/api/admin/prompts", {
      method:"PUT",
      headers:{ "Content-Type":"application/json", "x-admin-key": key },
      body: JSON.stringify(pack)
    }).then(r=>r.json()).then(setPack);
  }

  return (
    <main style={{maxWidth:960, margin:"0 auto", padding:24}}>
      <h1 style={{fontWeight:700, fontSize:20}}>مدیریت پرامپت‌ها و قلاب‌ها</h1>
      <div style={{display:"flex", gap:8, margin:"12px 0"}}>
        <input placeholder="پسورد ادمین" type="password" value={key} onChange={e=>setKey(e.target.value)} />
        <button onClick={load}>ورود</button>
        {pack && <button onClick={save}>ذخیره</button>}
      </div>

      {pack && (
        <>
          <div style={{display:"flex", gap:8}}>
            <button onClick={()=>setTab("prompts")} style={{fontWeight: tab==="prompts"?700:400}}>پرامپت‌ها</button>
            <button onClick={()=>setTab("hooks")} style={{fontWeight: tab==="hooks"?700:400}}>قلاب‌ها</button>
          </div>

          {tab==="prompts" ? (
            <section style={{display:"grid", gridTemplateColumns:"1fr 3fr", gap:12, marginTop:12}}>
              <aside style={{display:"flex", flexDirection:"column", gap:6}}>
                {(["globals","Idea120","PainDiscovery-edu","PainDiscovery-service","PainDiscovery-product","Story","Limit","Contrast","WrongRight","ProNovice","Warning","NoWords","Suspense","Review","Empathy","Choice","Compare","Fortune","ToDo","VisualExample"] as any[])
                  .map((k:any)=><button key={k} onClick={()=>setSel(k)} style={{textAlign:"right", background: sel===k?"#f3f4f6":"#fff", border:"1px solid #e5e7eb", padding:"8px 12px"}}>{k}</button>)}
              </aside>
              <div style={{display:"flex", flexDirection:"column", gap:8}}>
                {sel==="globals" ? (
                  <>
                    <label>System (سراسری)</label>
                    <textarea style={{height:160}} value={pack.globals.system} onChange={e=>setPack({...pack, globals:{...pack.globals, system:e.target.value}} as PromptPack)} />
                    <label>Guardrails</label>
                    <textarea style={{height:120}} value={pack.globals.guardrails.join("\n")} onChange={e=>setPack({...pack, globals:{...pack.globals, guardrails:e.target.value.split("\n").map(s=>s.trim()).filter(Boolean)}} as PromptPack)} />
                  </>
                ) : (
                  (()=> {
                    const tpl = (pack.templates as any)[sel] || { system:"", user:"", notes:"" };
                    return (
                      <>
                        <label>System (قوانین قالب)</label>
                        <textarea style={{height:160}} value={tpl.system} onChange={e=>setPack({ ...pack, templates:{...pack.templates, [sel]:{...tpl, system:e.target.value}} } as any)} />
                        <label>User (الگوی دستور)</label>
                        <textarea style={{height:160}} value={tpl.user} onChange={e=>setPack({ ...pack, templates:{...pack.templates, [sel]:{...tpl, user:e.target.value}} } as any)} />
                        <label>Notes</label>
                        <textarea style={{height:100}} value={tpl.notes||""} onChange={e=>setPack({ ...pack, templates:{...pack.templates, [sel]:{...tpl, notes:e.target.value}} } as any)} />
                      </>
                    );
                  })()
                )}
              </div>
            </section>
          ) : (
            <Hooks pack={pack} setPack={setPack}/>
          )}
        </>
      )}
    </main>
  );
}

function Hooks({ pack, setPack }: { pack: any, setPack: (p:any)=>void }) {
  const [sel, setSel] = useState<any>("Idea120");
  const [filter, setFilter] = useState<any>({ tone:"", form:"", q:"" });
  const list = (pack.hooks[sel] || []);
  const filtered = list.filter((h:any) => (filter.tone? h.tone===filter.tone : true) && (filter.form? h.form===filter.form : true) && (filter.q? h.text.includes(filter.q): true) && (h.active!==false));

  function add() {
    const id = (crypto as any)?.randomUUID?.() || Math.random().toString(36).slice(2);
    const next = { ...pack, hooks: { ...pack.hooks, [sel]: [{ id, text:"", lang:"fa", active:true }, ...list] } };
    setPack(next);
  }
  function up(id: string, patch: any) {
    const nextArr = list.map((h:any) => h.id===id ? { ...h, ...patch } : h);
    setPack({ ...pack, hooks: { ...pack.hooks, [sel]: nextArr } });
  }
  function rm(id: string) {
    const nextArr = list.filter((h:any) => h.id!==id);
    setPack({ ...pack, hooks: { ...pack.hooks, [sel]: nextArr } });
  }

  return (
    <section style={{marginTop:12, display:"flex", flexDirection:"column", gap:12}}>
      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <select value={sel} onChange={e=>setSel(e.target.value)}>
          {["Idea120","PainDiscovery-edu","PainDiscovery-service","PainDiscovery-product","Story","Limit","Contrast","WrongRight","ProNovice","Warning","NoWords","Suspense","Review","Empathy","Choice","Compare","Fortune","ToDo","VisualExample"].map(k=><option key={k} value={k}>{k}</option>)}
        </select>
        <input placeholder="جستجو…" value={filter.q} onChange={e=>setFilter({...filter,q:e.target.value})}/>
        <select value={filter.tone} onChange={e=>setFilter({...filter,tone:e.target.value})}>
          <option value="">همه لحن‌ها</option><option>خودمونی-حرفه‌ای</option><option>رسمی</option><option>خودمونی</option>
        </select>
        <select value={filter.form} onChange={e=>setFilter({...filter,form:e.target.value})}>
          <option value="">همه فرم‌ها</option><option>reels</option><option>story</option><option>post</option><option>live</option>
        </select>
        <button onClick={add}>+ قلاب جدید</button>
      </div>
      <ul style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
        {filtered.map((h:any) => (
          <li key={h.id} style={{border:"1px solid #e5e7eb", borderRadius:8, padding:12}}>
            <textarea style={{width:"100%", height:96}} value={h.text} onChange={e=>up(h.id,{text:e.target.value})}/>
            <div style={{display:"flex", gap:8, marginTop:8}}>
              <select value={h.tone||""} onChange={e=>up(h.id,{tone:e.target.value})}>
                <option value="">— لحن —</option><option>خودمونی-حرفه‌ای</option><option>رسمی</option><option>خودمونی</option>
              </select>
              <select value={h.form||""} onChange={e=>up(h.id,{form:e.target.value})}>
                <option value="">— فرم —</option><option>reels</option><option>story</option><option>post</option><option>live</option>
              </select>
              <input style={{flex:1}} placeholder="تگ‌ها با کاما" value={(h.tags||[]).join(",")} onChange={e=>up(h.id,{tags:e.target.value.split(",").map((s:string)=>s.trim()).filter(Boolean)})}/>
            </div>
            <div style={{display:"flex", alignItems:"center", gap:8, marginTop:8}}>
              <label style={{fontSize:12}}><input type="checkbox" checked={h.active!==false} onChange={e=>up(h.id,{active:e.target.checked})}/> فعال</label>
              <button style={{marginInlineStart:"auto", color:"#dc2626"}} onClick={()=>rm(h.id)}>حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

createRoot(document.getElementById("root")!).render(<App/>);
