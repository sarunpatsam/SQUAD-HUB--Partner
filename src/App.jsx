import { useState, useEffect } from "react";
import { supabase } from "./supabase";

/* ═══════════════ DESIGN TOKENS ═══════════════ */
const C = {
  bg:"#050f0a", bg2:"#091510", bg3:"#0d1a12",
  surface:"rgba(16,185,129,0.04)", surface2:"rgba(255,255,255,0.05)",
  border:"rgba(16,185,129,0.14)", borderHi:"rgba(16,185,129,0.35)",
  green:"#10d484", greenBr:"#34d399", greenDim:"rgba(16,185,129,0.08)",
  text:"#e8fff4", sub:"#6b9e85", muted:"#3d6b52",
  red:"#ef4444", blue:"#60a5fa", amber:"#fbbf24", purple:"#a78bfa",
};

/* ═══════════════ SHARED COMPONENTS ═══════════════ */
const Wordmark = () => (
  <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
    <div style={{width:1.5,height:28,background:`linear-gradient(180deg,${C.green} 0%,rgba(16,212,132,0.05) 100%)`,borderRadius:2}}/>
    <div style={{display:"flex",flexDirection:"column",gap:2}}>
      <div style={{display:"flex",alignItems:"center",gap:5}}>
        <span style={{fontSize:15,fontWeight:900,letterSpacing:1.5,color:C.text,lineHeight:1}}>SQUAD</span>
        <div style={{padding:"2px 7px",border:`1px solid rgba(16,212,132,0.55)`,borderRadius:3}}>
          <span style={{fontSize:15,fontWeight:900,letterSpacing:1.5,color:C.green,lineHeight:1}}>HUB</span>
        </div>
      </div>
      <div style={{fontSize:6,fontWeight:600,letterSpacing:3,color:C.muted,textTransform:"uppercase"}}>Partner Portal</div>
    </div>
  </div>
);

const Tag = ({children,color=C.green}) => (
  <span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:4,background:`${color}18`,color,border:`1px solid ${color}40`,letterSpacing:.5}}>{children}</span>
);

const Btn = ({children,onClick,ghost,disabled,style={}}) => (
  <button onClick={disabled?undefined:onClick} disabled={disabled}
    style={{padding:"11px 18px",borderRadius:8,fontSize:13,fontWeight:800,border:ghost?`1px solid ${C.border}`:`1px solid ${C.green}`,cursor:disabled?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:ghost?"transparent":`linear-gradient(135deg,#059669,${C.green})`,color:ghost?C.sub:"#001a0d",opacity:disabled?.4:1,transition:"all .2s",letterSpacing:.3,...style}}>{children}</button>
);

const MetricCard = ({icon,value,label,foot,footColor,highlight}) => (
  <div style={{background:highlight?C.greenDim:C.surface,border:`1px solid ${highlight?C.borderHi:C.border}`,borderRadius:14,padding:"14px 16px"}}>
    <div style={{fontSize:18,marginBottom:6}}>{icon}</div>
    <div style={{fontSize:22,fontWeight:900,color:highlight?C.greenBr:C.text,lineHeight:1}}>{value}</div>
    <div style={{fontSize:9,fontWeight:800,letterSpacing:1.5,color:C.sub,marginTop:4,textTransform:"uppercase"}}>{label}</div>
    {foot&&<div style={{fontSize:11,color:footColor||C.sub,marginTop:3,fontWeight:700}}>{foot}</div>}
  </div>
);

/* ═══════════════ LOGIN ═══════════════ */
const VenueLogin = ({onSuccess}) => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const handleLogin = async () => {
    if(!email.trim()||!password.trim())return;
    setLoading(true); setError("");
    try {
      const {error:authErr} = await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password});
      if(authErr){setError("Email หรือ Password ไม่ถูกต้อง");setLoading(false);return;}
      const {data:venue} = await supabase.from("venues").select("*").eq("owner_email",email.trim().toLowerCase()).single();
      onSuccess(venue);
    } catch(e){setError("เกิดข้อผิดพลาด ลองใหม่");setLoading(false);}
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',system-ui,sans-serif",padding:16}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <Wordmark/>
          <div style={{fontSize:12,color:C.sub,marginTop:12,letterSpacing:1}}>เข้าสู่ระบบจัดการสนาม</div>
        </div>
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:20,padding:28}}>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Email</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              placeholder="sone@squadhub.ai" type="email"
              style={{width:"100%",background:C.surface2,border:`1px solid ${error?C.red:C.border}`,borderRadius:10,padding:"11px 14px",fontSize:14,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{fontSize:10,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Password</div>
            <input value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              placeholder="••••••••" type="password"
              style={{width:"100%",background:C.surface2,border:`1px solid ${error?C.red:C.border}`,borderRadius:10,padding:"11px 14px",fontSize:14,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          {error&&<div style={{fontSize:12,color:C.red,fontWeight:700,marginBottom:12,textAlign:"center"}}>{error}</div>}
          <Btn onClick={handleLogin} disabled={loading||!email.trim()||!password.trim()} style={{width:"100%",padding:13}}>
            {loading?"กำลังเข้าสู่ระบบ...":"เข้าสู่ระบบ →"}
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════ MOBILE MATCH CARD (accept/end) ═══════════════ */
const MobileMatchCard = ({match,onAccept,onEnd}) => (
  <div style={{background:C.bg2,border:`1px solid ${match.status==="live"?C.borderHi:C.border}`,borderRadius:16,padding:16,marginBottom:10}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
          {match.status==="live"&&<div style={{width:7,height:7,borderRadius:"50%",background:C.green,boxShadow:`0 0 6px ${C.green}`}}/>}
          <span style={{fontSize:13,fontWeight:900,color:match.status==="live"?C.green:C.text}}>{match.name}</span>
        </div>
        <div style={{fontSize:11,color:C.sub}}>{match.time} · {match.players}/{match.total_players||14} คน</div>
      </div>
      <Tag color={match.status==="live"?C.green:match.status==="filling"?C.amber:C.sub}>
        {match.status==="live"?"LIVE":match.status==="filling"?"รอคน":"รอยืนยัน"}
      </Tag>
    </div>
    {match.status==="pending"&&(
      <Btn onClick={()=>onAccept(match)} style={{width:"100%",marginTop:4}}>✓ รับจอง</Btn>
    )}
    {match.status==="live"&&(
      <button onClick={()=>onEnd(match)}
        style={{width:"100%",padding:11,borderRadius:8,border:`1px solid ${C.amber}55`,background:`rgba(251,191,36,0.08)`,color:C.amber,fontSize:13,fontWeight:800,cursor:"pointer",letterSpacing:.3}}>
        ⏱ ยืนยันแมตช์จบ
      </button>
    )}
  </div>
);

/* ═══════════════ SCHEDULE TAB ═══════════════ */
const ScheduleTab = ({venue,slots,onMatchEnd}) => {
  const [showOffline,setShowOffline] = useState(false);
  const [offName,setOffName] = useState("");
  const [offTime,setOffTime] = useState("20:00");
  const [offPrice,setOffPrice] = useState("1500");

  const statusColor = s => s==="live"?C.green:s==="filling"?C.amber:s==="full"?C.red:s==="open"?C.greenBr:C.sub;
  const statusLabel = s => ({live:"LIVE",filling:"กำลังเติม",full:"เต็ม",open:"ว่าง",ended:"จบแล้ว",upcoming:"รอเริ่ม",available:"ว่าง"}[s]||s);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:13,fontWeight:800,color:C.sub,letterSpacing:1,textTransform:"uppercase"}}>ตารางวันนี้</div>
        <button onClick={()=>setShowOffline(!showOffline)}
          style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.sub,fontSize:12,fontWeight:700,cursor:"pointer"}}>
          + บันทึกออฟไลน์
        </button>
      </div>

      {showOffline&&(
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:16,marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:800,color:C.amber,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>
            ⚠ บันทึกออฟไลน์ — ไม่ได้ Stats/XP
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            <div>
              <div style={{fontSize:9,color:C.sub,fontWeight:700,letterSpacing:1,marginBottom:4}}>ชื่อผู้จอง</div>
              <input value={offName} onChange={e=>setOffName(e.target.value)} placeholder="คุณบอย"
                style={{width:"100%",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",fontSize:13,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
            <div>
              <div style={{fontSize:9,color:C.sub,fontWeight:700,letterSpacing:1,marginBottom:4}}>เวลา</div>
              <input type="time" value={offTime} onChange={e=>setOffTime(e.target.value)}
                style={{width:"100%",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",fontSize:13,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
            <div>
              <div style={{fontSize:9,color:C.sub,fontWeight:700,letterSpacing:1,marginBottom:4}}>ราคา ฿</div>
              <input value={offPrice} onChange={e=>setOffPrice(e.target.value)} placeholder="1500"
                style={{width:"100%",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",fontSize:13,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
            </div>
          </div>
          <Btn ghost onClick={()=>setShowOffline(false)} style={{width:"100%"}}>บันทึก</Btn>
        </div>
      )}

      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"80px 1fr 100px 80px 90px",gap:0,padding:"10px 16px",borderBottom:`1px solid ${C.border}`}}>
          {["เวลา","รายการ","ช่องทาง","ยอด",""].map((h,i)=>(
            <div key={i} style={{fontSize:9,fontWeight:800,letterSpacing:1.5,color:C.muted,textTransform:"uppercase",textAlign:i>=3?"right":"left"}}>{h}</div>
          ))}
        </div>
        {slots.length===0&&(
          <div style={{textAlign:"center",padding:"32px 0",color:C.sub,fontSize:13}}>ยังไม่มี slot วันนี้</div>
        )}
        {slots.map((s,i)=>(
          <div key={s.id||i} style={{display:"grid",gridTemplateColumns:"80px 1fr 100px 80px 90px",gap:0,padding:"13px 16px",borderBottom:i<slots.length-1?`1px solid rgba(255,255,255,0.04)`:undefined,alignItems:"center",background:s.status==="live"?"rgba(16,185,129,0.04)":undefined}}>
            <div>
              <div style={{fontSize:14,fontWeight:900,color:s.status==="live"?C.green:C.text,fontStyle:"italic"}}>{s.time}</div>
              <div style={{fontSize:10,color:C.muted,fontWeight:700,marginTop:1}}>{s.duration||2} HRS</div>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                <span style={{fontSize:13,fontWeight:800,color:s.status==="available"?C.sub:C.text}}>{s.name||"ว่าง"}</span>
                {s.status==="live"&&<span style={{fontSize:10,fontWeight:900,padding:"2px 7px",borderRadius:99,background:"rgba(16,185,129,0.18)",color:C.greenBr,border:`1px solid rgba(16,185,129,0.3)`}}>LIVE</span>}
                {s.status==="filling"&&<span style={{fontSize:10,fontWeight:900,padding:"2px 7px",borderRadius:99,background:"rgba(251,191,36,0.12)",color:C.amber,border:`1px solid rgba(251,191,36,0.2)`}}>กำลังเติม</span>}
              </div>
              {s.total_players&&<div style={{display:"flex",gap:3,marginTop:5,alignItems:"center"}}>
                {Array.from({length:s.total_players}).map((_,pi)=>(
                  <div key={pi} style={{width:6,height:6,borderRadius:"50%",background:pi<(s.players||0)?C.green:"rgba(255,255,255,0.1)"}}/>
                ))}
                <span style={{fontSize:10,color:C.sub,marginLeft:4}}>{s.players||0}/{s.total_players}</span>
              </div>}
            </div>
            <div style={{textAlign:"center"}}>
              {s.source==="platform"?<Tag color={C.green}>Platform</Tag>:<Tag color={C.sub}>Offline</Tag>}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:13,fontWeight:900,color:s.amount>0?C.text:C.muted}}>{s.amount>0?`฿${s.amount.toLocaleString()}`:"—"}</div>
            </div>
            <div style={{textAlign:"right"}}>
              {s.status==="live"&&(
                <button onClick={()=>onMatchEnd(s)} style={{fontSize:11,fontWeight:800,padding:"5px 10px",borderRadius:7,border:`1px solid ${C.borderHi}`,background:C.greenDim,color:C.green,cursor:"pointer"}}>ยืนยันจบ</button>
              )}
              {s.status==="available"&&(
                <button style={{fontSize:11,fontWeight:700,padding:"5px 10px",borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",color:C.sub,cursor:"pointer"}}>บล็อก</button>
              )}
              {(s.status==="ended"||s.status==="filling")&&(
                <button style={{fontSize:11,fontWeight:700,padding:"5px 10px",borderRadius:7,border:`1px solid ${C.border}`,background:"transparent",color:C.sub,cursor:"pointer"}}>ดู</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════ MATCH END TAB ═══════════════ */
const MatchEndTab = ({match,onDone}) => {
  const [sent,setSent] = useState(false);
  const [loading,setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await fetch("https://primary-production-e855.up.railway.app/webhook/match-end",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({match_id:match?.id||1,venue_id:match?.venue_id||1}),
      });
    } catch(e){console.error(e);}
    setSent(true); setLoading(false);
  };

  if(sent) return (
    <div style={{background:C.bg2,border:`1px solid ${C.borderHi}`,borderRadius:16,padding:24,textAlign:"center",maxWidth:500}}>
      <div style={{fontSize:32,marginBottom:12}}>✅</div>
      <div style={{fontSize:16,fontWeight:900,color:C.green,marginBottom:8}}>ส่งแจ้งกัปตันแล้ว!</div>
      <div style={{fontSize:12,color:C.sub,lineHeight:1.8,marginBottom:20}}>LINE Bot กำลังส่งฟอร์มสรุปให้กัปตันแต่ละทีม<br/>กัปตันสรุปผล → AI บันทึก Stats + XP อัตโนมัติ</div>
      <Btn ghost onClick={onDone} style={{width:"100%"}}>กลับหน้าหลัก</Btn>
    </div>
  );

  return (
    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,padding:24,maxWidth:500}}>
      <div style={{fontSize:10,fontWeight:800,color:C.green,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>ยืนยันแมตช์จบ</div>
      <div style={{fontSize:18,fontWeight:900,color:C.text,marginBottom:6}}>{match?.name||"Match #SQ-0824"}</div>
      <div style={{fontSize:12,color:C.sub,marginBottom:20}}>{match?.time||"16:00"}–{match?.end||"18:00"} · {match?.players||0} ผู้เล่น</div>
      <div style={{background:C.greenDim,border:`1px solid ${C.borderHi}`,borderRadius:12,padding:"12px 14px",marginBottom:20}}>
        <div style={{fontSize:11,fontWeight:700,color:C.greenBr,lineHeight:1.8}}>
          หลังกดยืนยัน:<br/>
          <span style={{color:C.sub}}>LINE Bot → แจ้งกัปตันแต่ละทีม → กัปตันส่งสรุป → AI บันทึก Stats + XP ให้ทุกคน</span>
        </div>
      </div>
      <Btn onClick={handleConfirm} disabled={loading} style={{width:"100%",padding:13}}>
        {loading?"กำลังส่ง...":"⏱ ยืนยันแมตช์จบ →"}
      </Btn>
    </div>
  );
};

/* ═══════════════ FINANCE TAB ═══════════════ */
const FinanceTab = ({venue}) => (
  <div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:10,marginBottom:20}}>
      <MetricCard icon="💰" value={`฿${(venue?.wallet_balance||0).toLocaleString()}`} label="ยอดคงเหลือ" foot="พร้อมถอน" footColor={C.green} highlight/>
      <MetricCard icon="📈" value="—" label="รายได้เดือนนี้" foot="เร็วๆนี้"/>
      <MetricCard icon="⏳" value="—" label="รอชำระ" foot="เร็วๆนี้"/>
    </div>
    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,padding:20,textAlign:"center"}}>
      <div style={{fontSize:12,color:C.sub,marginBottom:16}}>ประวัติการเงินจะแสดงเมื่อมีข้อมูลจริง</div>
      <Btn ghost style={{margin:"0 auto"}}>ถอนเงิน →</Btn>
    </div>
  </div>
);

/* ═══════════════ MAIN APP ═══════════════ */
export default function SquadPartner() {
  const [unlocked,setUnlocked] = useState(false);
  const [venue,setVenue] = useState(null);
  const [tab,setTab] = useState("schedule");
  const [slots,setSlots] = useState([]);
  const [activeMatch,setActiveMatch] = useState(null);
  const [isMobile,setIsMobile] = useState(window.innerWidth<768);

  useEffect(()=>{
    const handleResize = () => setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",handleResize);
    return ()=>window.removeEventListener("resize",handleResize);
  },[]);

  // Load slots when venue is set
  useEffect(()=>{
    if(!venue)return;
    (async()=>{
      const today = new Date().toISOString().split("T")[0];
      const {data} = await supabase.from("slots")
        .select("*")
        .eq("venue_id",venue.id)
        .gte("date",today)
        .lte("date",today)
        .order("start_time");
      if(data) setSlots(data.map(s=>({
        id:s.id, time:s.start_time?.slice(0,5)||"—", end:s.end_time?.slice(0,5)||"—",
        duration:2, name:s.match_id?`MATCH #SQ-${s.match_id}`:"ว่าง",
        players:0, total_players:s.max_players||14,
        source:s.match_id?"platform":"offline",
        amount:s.price_per_player?s.price_per_player*(s.max_players||14):0,
        status:s.status==="open"?"available":s.status==="full"?"full":"live",
      })));
    })();
  },[venue]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUnlocked(false); setVenue(null); setSlots([]);
  };

  if(!unlocked) return <VenueLogin onSuccess={v=>{setVenue(v);setUnlocked(true);}}/>;

  const navItems = [
    {id:"schedule",icon:"📅",label:"ตารางสนาม"},
    {id:"matchend",icon:"⏱️",label:"ยืนยันแมตช์จบ"},
    {id:"finance",icon:"💰",label:"รายได้ & กระเป๋า"},
  ];

  const liveMatches = slots.filter(s=>s.status==="live");
  const pendingMatches = slots.filter(s=>s.status==="pending");

  /* ── MOBILE LAYOUT ── */
  if(isMobile) return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <header style={{padding:"12px 16px",background:"rgba(5,10,8,0.97)",backdropFilter:"blur(24px)",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
        <Wordmark/>
        <div style={{fontSize:11,color:C.sub,textAlign:"right"}}>
          <div style={{fontWeight:800,color:C.text}}>{venue?.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end",marginTop:2}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:C.green}}/>
            <span style={{color:C.green,fontSize:10}}>ออนไลน์</span>
          </div>
        </div>
      </header>
      <div style={{padding:"16px 16px 80px"}}>
        <div style={{fontSize:10,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>แมตช์ที่ต้องดำเนินการ</div>
        {liveMatches.length===0&&pendingMatches.length===0&&(
          <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:20,textAlign:"center",color:C.sub,fontSize:12,marginBottom:16}}>ไม่มีแมตช์ที่รอดำเนินการ</div>
        )}
        {[...pendingMatches,...liveMatches].map(m=>(
          <MobileMatchCard key={m.id} match={m}
            onAccept={()=>{}}
            onEnd={m=>{setActiveMatch(m);setTab("matchend");}}/>
        ))}
        <div style={{fontSize:10,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10,marginTop:4}}>ตารางวันนี้</div>
        {slots.map((s,i)=>(
          <div key={s.id||i} style={{background:C.bg2,border:`1px solid ${s.status==="live"?C.borderHi:C.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:14,fontWeight:900,color:s.status==="live"?C.green:C.text}}>{s.time}</div>
              <div style={{fontSize:11,color:C.sub,marginTop:2}}>{s.name||"ว่าง"}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <Tag color={s.status==="live"?C.green:s.status==="filling"?C.amber:C.sub}>
                {s.status==="live"?"LIVE":s.status==="filling"?"กำลังเติม":"ว่าง"}
              </Tag>
              {s.amount>0&&<div style={{fontSize:11,color:C.sub,marginTop:4}}>฿{s.amount.toLocaleString()}</div>}
            </div>
          </div>
        ))}
      </div>
      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(5,10,8,0.97)",backdropFilter:"blur(24px)",borderTop:`1px solid ${C.border}`,padding:"10px 0 20px",display:"flex",justifyContent:"space-around"}}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 16px"}}>
            <span style={{fontSize:18}}>{n.icon}</span>
            <span style={{fontSize:8,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:tab===n.id?C.green:C.sub}}>{n.label}</span>
          </button>
        ))}
      </nav>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );

  /* ── DESKTOP LAYOUT ── */
  return (
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',system-ui,sans-serif"}}>

      {/* SIDEBAR */}
      <aside style={{width:220,background:C.bg2,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,height:"100vh",zIndex:100}}>
        <div style={{padding:"16px 18px 14px",borderBottom:`1px solid ${C.border}`}}>
          <Wordmark/>
        </div>
        <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:4}}>{venue?.name||"—"}</div>
          <div style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:C.green,background:C.greenDim,border:`1px solid ${C.borderHi}`,padding:"3px 9px",borderRadius:99}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite"}}/>
            ออนไลน์
          </div>
        </div>
        <nav style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
          <div style={{padding:"8px 10px 4px",fontSize:9,fontWeight:800,letterSpacing:1.8,color:C.muted,textTransform:"uppercase"}}>จัดการ</div>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)}
              style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",borderRadius:10,fontSize:13,fontWeight:700,color:tab===n.id?C.green:C.sub,background:tab===n.id?C.greenDim:"none",border:tab===n.id?`1px solid ${C.borderHi}`:"1px solid transparent",cursor:"pointer",width:"100%",textAlign:"left",transition:"all .15s",marginBottom:2}}>
              <span style={{opacity:tab===n.id?1:.7}}>{n.icon}</span>
              <span style={{flex:1}}>{n.label}</span>
              {n.id==="matchend"&&liveMatches.length>0&&(
                <span style={{fontSize:10,fontWeight:900,padding:"1px 7px",borderRadius:99,background:"rgba(251,191,36,.15)",color:C.amber,border:"1px solid rgba(251,191,36,.25)"}}>{liveMatches.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div style={{padding:"12px 8px",borderTop:`1px solid ${C.border}`}}>
          <button onClick={handleLogout}
            style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:10,fontSize:12,fontWeight:700,color:C.muted,background:"none",border:"1px solid transparent",cursor:"pointer",width:"100%",textAlign:"left"}}>
            ↩ ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{marginLeft:220,flex:1,display:"flex",flexDirection:"column"}}>
        <header style={{position:"sticky",top:0,height:54,background:"rgba(5,10,8,0.96)",backdropFilter:"blur(24px)",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",zIndex:90}}>
          <div>
            <div style={{fontSize:15,fontWeight:900,color:C.text,textTransform:"uppercase",letterSpacing:.3}}>
              {navItems.find(n=>n.id===tab)?.label||""}
            </div>
            <div style={{fontSize:11,color:C.sub,marginTop:1}}>
              {new Date().toLocaleDateString("th-TH",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:"6px 14px",textAlign:"right"}}>
              <div style={{fontSize:9,fontWeight:800,color:C.sub,letterSpacing:1.2,textTransform:"uppercase"}}>ยอดคงเหลือ</div>
              <div style={{fontSize:15,fontWeight:900,color:C.text}}>฿{(venue?.wallet_balance||0).toLocaleString()}</div>
            </div>
            <Btn ghost style={{padding:"7px 14px",fontSize:12}}>ถอนเงิน</Btn>
          </div>
        </header>

        <main style={{padding:24}}>
          {/* Metrics */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:10,marginBottom:22}}>
            <MetricCard icon="📅" value={slots.length} label="Slot วันนี้" foot={`${liveMatches.length} กำลัง live`} footColor={C.green} highlight/>
            <MetricCard icon="👥" value={slots.reduce((a,s)=>a+(s.players||0),0)} label="ผู้เล่นวันนี้" foot="จากทุก slot"/>
            <MetricCard icon="💰" value={`฿${slots.reduce((a,s)=>a+(s.amount||0),0).toLocaleString()}`} label="รายได้วันนี้" foot="Platform only"/>
            <MetricCard icon="📊" value={slots.length>0?`${Math.round(slots.filter(s=>s.status!=="available").length/slots.length*100)}%`:"—"} label="Utilization" foot={`${venue?.field_count||1} สนาม`}/>
          </div>

          {tab==="schedule"&&<ScheduleTab venue={venue} slots={slots} onMatchEnd={m=>{setActiveMatch(m);setTab("matchend");}}/>}
          {tab==="matchend"&&<MatchEndTab match={activeMatch} onDone={()=>setTab("schedule")}/>}
          {tab==="finance"&&<FinanceTab venue={venue}/>}
        </main>
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}*{box-sizing:border-box}`}</style>
    </div>
  );
}
