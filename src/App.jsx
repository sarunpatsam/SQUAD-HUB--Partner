import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

/* ═══ TOKENS ═══ */
const C = {
  bg:"#050f0a", bg2:"#091510", bg3:"#0d1a12",
  surface:"rgba(16,185,129,0.04)", surface2:"rgba(255,255,255,0.05)",
  border:"rgba(16,185,129,0.14)", borderHi:"rgba(16,185,129,0.35)",
  green:"#10d484", greenBr:"#34d399", greenDim:"rgba(16,185,129,0.08)",
  text:"#e8fff4", sub:"#6b9e85", muted:"#3d6b52",
  red:"#ef4444", amber:"#fbbf24",
};
const OWNER_PIN = "198400";

/* ═══ SHARED ═══ */
const Wordmark = ({sm}) => (
  <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
    <div style={{width:1.5,height:sm?22:28,background:`linear-gradient(180deg,${C.green},rgba(16,212,132,0.05))`,borderRadius:2}}/>
    <div style={{display:"flex",flexDirection:"column",gap:2}}>
      <div style={{display:"flex",alignItems:"center",gap:5}}>
        <span style={{fontSize:sm?14:16,fontWeight:900,letterSpacing:1.5,color:C.text,lineHeight:1}}>SQUAD</span>
        <div style={{padding:"2px 7px",border:`1px solid rgba(16,212,132,0.55)`,borderRadius:3}}>
          <span style={{fontSize:sm?14:16,fontWeight:900,letterSpacing:1.5,color:C.green,lineHeight:1}}>HUB</span>
        </div>
      </div>
      <div style={{fontSize:6,fontWeight:600,letterSpacing:3,color:C.muted,textTransform:"uppercase"}}>Partner Portal</div>
    </div>
  </div>
);

const Tag = ({children,color=C.green}) => (
  <span style={{fontSize:11,fontWeight:800,padding:"2px 8px",borderRadius:4,background:`${color}18`,color,border:`1px solid ${color}40`}}>{children}</span>
);

const Btn = ({children,onClick,ghost,disabled,style={}}) => (
  <button onClick={disabled?undefined:onClick} disabled={disabled}
    style={{padding:"11px 18px",borderRadius:8,fontSize:14,fontWeight:800,border:ghost?`1px solid ${C.border}`:`1px solid ${C.green}`,cursor:disabled?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:ghost?"transparent":`linear-gradient(135deg,#059669,${C.green})`,color:ghost?C.sub:"#001a0d",opacity:disabled?.4:1,transition:"all .2s",...style}}>{children}</button>
);

const MetricCard = ({icon,value,label,foot,footColor,hi}) => (
  <div style={{background:hi?C.greenDim:C.surface,border:`1px solid ${hi?C.borderHi:C.border}`,borderRadius:14,padding:"16px 18px"}}>
    <div style={{fontSize:20,marginBottom:8}}>{icon}</div>
    <div style={{fontSize:24,fontWeight:900,color:hi?C.greenBr:C.text,lineHeight:1}}>{value}</div>
    <div style={{fontSize:10,fontWeight:800,letterSpacing:1.5,color:C.sub,marginTop:5,textTransform:"uppercase"}}>{label}</div>
    {foot&&<div style={{fontSize:12,color:footColor||C.sub,marginTop:3,fontWeight:700}}>{foot}</div>}
  </div>
);

/* ═══ LOGIN ═══ */
const VenueLogin = ({onSuccess}) => {
  const [email,setEmail]=useState(()=>localStorage.getItem("sq_partner_email")||"");
  const [password,setPassword]=useState(()=>localStorage.getItem("sq_partner_pw")||"");
  const [showPw,setShowPw]=useState(false);
  const [remember,setRemember]=useState(()=>!!localStorage.getItem("sq_partner_email"));
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const handle = async () => {
    if(!email.trim()||!password.trim())return;
    setLoading(true);setError("");
    try {
      const {error:e}=await supabase.auth.signInWithPassword({
        email:email.trim().toLowerCase(),password
      });
      if(e){setError("Email หรือ Password ไม่ถูกต้อง");setLoading(false);return;}
      if(remember){
        localStorage.setItem("sq_partner_email",email.trim().toLowerCase());
        localStorage.setItem("sq_partner_pw",password);
      } else {
        localStorage.removeItem("sq_partner_email");
        localStorage.removeItem("sq_partner_pw");
      }
      const {data:v}=await supabase.from("venues").select("*")
        .eq("owner_email",email.trim().toLowerCase()).single();
      onSuccess(v);
    } catch{setError("เกิดข้อผิดพลาด");setLoading(false);}
  };
 const inp = {width:"100%",background:C.surface2,border:`1px solid ${error?C.red:C.border}`,borderRadius:10,padding:"12px 14px",fontSize:15,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box"};
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',system-ui,sans-serif",padding:16}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:28}}><Wordmark/></div>
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:20,padding:28}}>
          <div style={{fontSize:16,fontWeight:900,color:C.text,marginBottom:4}}>เข้าสู่ระบบ</div>
          <div style={{fontSize:13,color:C.sub,marginBottom:22}}>Venue Admin Portal</div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Email</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="sone@squadhub.ai" type="email" style={inp}/>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Password</div>
            <div style={{position:"relative"}}>
              <input value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="••••••••" type={showPw?"text":"password"} style={{...inp,paddingRight:44}}/>
              <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:C.sub,fontSize:16,padding:4,lineHeight:1}}>
                {showPw?"🙈":"👁"}
              </button>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20,cursor:"pointer"}} onClick={()=>setRemember(r=>!r)}>
            <div style={{width:18,height:18,borderRadius:5,border:`1.5px solid ${remember?C.green:C.border}`,background:remember?C.greenDim:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
              {remember&&<span style={{fontSize:11,color:C.green,fontWeight:900}}>✓</span>}
            </div>
            <span style={{fontSize:13,color:C.sub,fontWeight:600,userSelect:"none"}}>จำ Email ไว้ในเครื่องนี้</span>
          </div>
          {error&&<div style={{fontSize:13,color:C.red,fontWeight:700,marginBottom:14,textAlign:"center"}}>{error}</div>}
          <Btn onClick={handle} disabled={loading||!email.trim()||!password.trim()} style={{width:"100%",padding:14,fontSize:15}}>
            {loading?"กำลังเข้าสู่ระบบ...":"เข้าสู่ระบบ →"}
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ═══ OWNER PIN ═══ */
const OwnerPin = ({onSuccess,onCancel}) => {
  const [pin,setPin]=useState("");
  const [err,setErr]=useState(false);
  const [shake,setShake]=useState(false);
  const tap = v => {
    if(v==="del"){setPin(p=>p.slice(0,-1));setErr(false);return;}
    if(pin.length>=6)return;
    const n=pin+v;setPin(n);
    if(n.length===6){
      if(n===OWNER_PIN)onSuccess();
      else{setShake(true);setErr(true);setTimeout(()=>{setPin("");setShake(false);setErr(false);},800);}
    }
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16}}>
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:20,padding:"32px 28px",width:320,textAlign:"center",animation:shake?"shake .4s":"none"}}>
        <div style={{fontSize:22,marginBottom:8}}>👑</div>
        <div style={{fontSize:16,fontWeight:900,color:C.text,marginBottom:4}}>Owner Access</div>
        <div style={{fontSize:13,color:C.sub,marginBottom:24}}>ใส่ PIN เพื่อดูข้อมูลการเงิน</div>
        <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:28}}>
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} style={{width:14,height:14,borderRadius:"50%",background:i<pin.length?(err?C.red:C.green):"rgba(255,255,255,0.12)",transition:"background .15s"}}/>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
          {["1","2","3","4","5","6","7","8","9","","0","del"].map((k,i)=>(
            <button key={i} onClick={()=>k&&tap(k)}
              style={{height:56,borderRadius:12,fontSize:k==="del"?18:22,fontWeight:800,fontFamily:"inherit",background:k===""?"transparent":k==="del"?"rgba(255,255,255,0.04)":C.surface2,border:k===""?"none":`1px solid ${C.border}`,color:k==="del"?C.sub:C.text,cursor:k===""?"default":"pointer"}}>
              {k==="del"?"⌫":k}
            </button>
          ))}
        </div>
        {err&&<div style={{fontSize:13,color:C.red,fontWeight:700,marginBottom:12}}>PIN ไม่ถูกต้อง</div>}
        <button onClick={onCancel} style={{fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>ยกเลิก</button>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  );
};

/* ═══ QR SCANNER ═══ */
const QRScanner = ({onResult,onClose}) => {
  const ref=useRef(null);
  const scanner=useRef(null);
  const [err,setErr]=useState("");
  useEffect(()=>{
    const s=document.createElement("script");
    s.src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";
    s.onload=()=>{
      if(!window.Html5Qrcode||!ref.current)return;
      const qr=new window.Html5Qrcode("qr-scan-box");
      scanner.current=qr;
      qr.start({facingMode:"environment"},{fps:10,qrbox:{width:220,height:220}},
        t=>{qr.stop().catch(()=>{});onResult(t);},()=>{})
        .catch(()=>setErr("ไม่สามารถเปิดกล้องได้ กรุณาอนุญาต permission"));
    };
    s.onerror=()=>setErr("ไม่สามารถโหลด QR Scanner");
    document.head.appendChild(s);
    return ()=>{scanner.current?.stop().catch(()=>{});if(document.head.contains(s))document.head.removeChild(s);};
  },[]);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
      <div style={{background:C.bg2,border:`1px solid ${C.borderHi}`,borderRadius:20,padding:20,width:"100%",maxWidth:380}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div style={{fontSize:16,fontWeight:900,color:C.text}}>🔲 Scan Player QR</div>
            <div style={{fontSize:12,color:C.sub,marginTop:2}}>ให้ผู้เล่นเปิด SQUAD HUB → กด "QR ของฉัน"</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"none",color:C.sub,fontSize:13,padding:"4px 10px",borderRadius:6,cursor:"pointer"}}>✕</button>
        </div>
        <div id="qr-scan-box" ref={ref} style={{width:"100%",borderRadius:12,overflow:"hidden",background:C.bg,minHeight:240,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {!err&&<div style={{fontSize:13,color:C.muted}}>กำลังเปิดกล้อง...</div>}
          {err&&<div style={{fontSize:13,color:C.red,padding:20,textAlign:"center"}}>{err}</div>}
        </div>
        <div style={{marginTop:12,fontSize:12,color:C.muted,textAlign:"center"}}>ส่องกล้องไปที่ QR code บนหน้าจอผู้เล่น</div>
      </div>
    </div>
  );
};

/* ═══ SCAN RESULT ═══ */
const ScanResult = ({playerId,onClose}) => {
  const [player,setPlayer]=useState(null);
  const [loading,setLoading]=useState(true);
  const [done,setDone]=useState(false);
  useEffect(()=>{
    supabase.from("players").select("*").eq("id",playerId).single()
      .then(({data})=>{setPlayer(data);setLoading(false);});
  },[playerId]);
  if(loading)return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
      <div style={{fontSize:14,color:C.sub}}>กำลังโหลดข้อมูล...</div>
    </div>
  );
  if(!player)return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
      <div style={{background:C.bg2,border:`1px solid ${C.red}40`,borderRadius:20,padding:24,width:"100%",maxWidth:360,textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:12}}>❌</div>
        <div style={{fontSize:15,fontWeight:900,color:C.red,marginBottom:8}}>ไม่พบผู้เล่น</div>
        <Btn ghost onClick={onClose} style={{width:"100%"}}>สแกนใหม่</Btn>
      </div>
    </div>
  );
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
      <div style={{background:C.bg2,border:`1px solid ${done?C.borderHi:C.border}`,borderRadius:20,padding:24,width:"100%",maxWidth:380}}>
        {done?(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:52,marginBottom:12}}>✅</div>
            <div style={{fontSize:18,fontWeight:900,color:C.green,marginBottom:6}}>Check-in สำเร็จ!</div>
            <div style={{fontSize:13,color:C.sub,marginBottom:20}}>{player.display_name} เข้าสนามแล้ว</div>
            <Btn ghost onClick={onClose} style={{width:"100%"}}>สแกนคนต่อไป</Btn>
          </div>
        ):(
          <>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:800,color:C.green,letterSpacing:1.5,textTransform:"uppercase"}}>ผลการสแกน</div>
              <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"none",color:C.sub,fontSize:12,padding:"3px 9px",borderRadius:6,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:14,padding:14,background:C.greenDim,border:`1px solid ${C.borderHi}`,borderRadius:14,marginBottom:14}}>
              <div style={{width:52,height:52,clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",background:"rgba(139,92,246,0.15)",border:"2px solid #8b5cf6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#8b5cf6",flexShrink:0}}>
                {player.display_name?.[0]?.toUpperCase()||"?"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:18,fontWeight:900,color:C.text}}>{player.display_name}</div>
                <div style={{fontSize:12,color:C.sub,marginTop:3}}>{player.position} · {player.tier} · SQ-{player.id}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:28,fontWeight:900,color:C.green,lineHeight:1}}>{player.ovr||71}</div>
                <div style={{fontSize:9,color:C.muted,fontWeight:700,letterSpacing:1}}>OVR</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
              {[{v:"✓",l:"จองแล้ว",c:C.green},{v:"✓",l:"ชำระแล้ว",c:C.green},{v:player.tier,l:"Tier",c:C.amber}].map((x,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.03)",border:`1px solid rgba(255,255,255,0.06)`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                  <div style={{fontSize:15,fontWeight:900,color:x.c}}>{x.v}</div>
                  <div style={{fontSize:9,color:C.muted,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginTop:3}}>{x.l}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>setDone(true)} style={{width:"100%",padding:14,borderRadius:12,border:"none",background:`linear-gradient(135deg,#059669,${C.green})`,color:"#001a0d",fontSize:15,fontWeight:900,cursor:"pointer"}}>
              ✅ Check-in เข้าสนาม
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ═══ CALENDAR ═══ */
const TIMES_DAY = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
const TIMES_NIGHT = ["18:00","19:00","20:00","21:00","22:00","23:00","00:00"];
const TIMES = [...TIMES_DAY,...TIMES_NIGHT];

const SlotBlock = ({slot,onClick}) => {
  if(!slot) return (
    <div onClick={onClick} style={{height:"100%",borderRadius:8,padding:"7px 9px",cursor:"pointer",border:`1px dashed rgba(255,255,255,0.08)`,background:"transparent",transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center"}}
      onMouseEnter={e=>{e.currentTarget.style.background="rgba(16,185,129,0.06)";e.currentTarget.style.borderColor="rgba(16,185,129,0.3)";}}
      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";}}>
      <span style={{fontSize:12,color:C.muted,fontWeight:700}}>+ ว่าง</span>
    </div>
  );
  const colors = {live:{bg:"rgba(16,185,129,0.16)",border:"rgba(16,185,129,0.55)",name:C.greenBr},platform:{bg:"rgba(16,185,129,0.08)",border:"rgba(16,185,129,0.28)",name:C.text},offline:{bg:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.12)",name:C.text},full:{bg:"rgba(239,68,68,0.07)",border:"rgba(239,68,68,0.25)",name:C.text}};
  const s = colors[slot.status]||colors.platform;
  return (
    <div onClick={onClick} style={{height:"100%",borderRadius:8,padding:"7px 9px",cursor:"pointer",background:s.bg,border:`1px solid ${s.border}`,transition:"all .15s"}}>
      <div style={{fontSize:11,fontWeight:800,color:s.name,lineHeight:1.3,marginBottom:2}}>{slot.name}</div>
      <div style={{fontSize:9,color:C.sub}}>{slot.source==="platform"?"Platform":"Offline"} · {slot.players||0}/{slot.total||14}</div>
      {slot.status!=="full"&&(
        <div style={{display:"flex",gap:2,marginTop:4,flexWrap:"wrap"}}>
          {Array.from({length:Math.min(slot.total||14,14)}).map((_,i)=>(
            <div key={i} style={{width:5,height:5,borderRadius:"50%",background:i<(slot.players||0)?C.green:"rgba(255,255,255,0.1)"}}/>
          ))}
        </div>
      )}
      {slot.status==="live"&&<div style={{fontSize:8,fontWeight:900,padding:"1px 5px",borderRadius:99,background:"rgba(16,185,129,0.2)",color:C.greenBr,border:`1px solid rgba(16,185,129,0.4)`,display:"inline-block",marginTop:3}}>● LIVE</div>}
    </div>
  );
};

const MOCK_SLOTS = [
  {id:1,date:"TODAY",time:"14:00",field:1,name:"ทีมออฟฟิศ",players:6,total:6,source:"offline",status:"offline",amount:1200},
  {id:2,date:"TODAY",time:"16:00",field:1,name:"MATCH #SQ-0824",players:12,total:14,source:"platform",status:"live",amount:1800},
  {id:3,date:"TODAY",time:"16:00",field:2,name:"MATCH #SQ-0825",players:8,total:14,source:"platform",status:"platform",amount:1400},
  {id:4,date:"TODAY",time:"18:00",field:1,name:"MATCH #SQ-0826",players:4,total:14,source:"platform",status:"platform",amount:600},
  {id:5,date:"TODAY",time:"20:00",field:1,name:"คุณบอย · เหมา",players:0,total:0,source:"offline",status:"offline",amount:1500},
  {id:6,date:"TODAY",time:"20:00",field:2,name:"MATCH #SQ-0827",players:14,total:14,source:"platform",status:"full",amount:2100},
];

const DayView = ({fields,slots,date,onSelectSlot}) => {
  const [period,setPeriod]=useState("night"); // day | night
  const times = period==="day" ? TIMES_DAY : TIMES_NIGHT;
  const today = new Date().toISOString().split("T")[0];
  const isToday = date.toISOString().split("T")[0]===today;
  const displaySlots = isToday&&slots.length===0 ? MOCK_SLOTS : slots;
  const fieldNames = fields.map((_,i)=>`สนาม ${i+1}`);
  return (
    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"}}>
      {/* Day/Night toggle */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderBottom:`1px solid rgba(255,255,255,0.06)`}}>
        <div style={{display:"flex",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
          <button onClick={()=>setPeriod("day")}
            style={{padding:"6px 16px",fontSize:12,fontWeight:800,border:"none",cursor:"pointer",background:period==="day"?"rgba(251,191,36,0.15)":"transparent",color:period==="day"?C.amber:C.sub,transition:"all .15s"}}>
            ☀️ กลางวัน
          </button>
          <button onClick={()=>setPeriod("night")}
            style={{padding:"6px 16px",fontSize:12,fontWeight:800,border:"none",cursor:"pointer",background:period==="night"?C.greenDim:"transparent",color:period==="night"?C.green:C.sub,transition:"all .15s"}}>
            🌙 กลางคืน
          </button>
        </div>
        <div style={{fontSize:11,color:C.muted}}>
          {period==="day"?"06:00 – 17:00":"18:00 – 00:00"}
        </div>
      </div>
      {/* Header */}
      <div style={{display:"grid",gridTemplateColumns:`56px ${fieldNames.map(()=>"1fr").join(" ")}`,borderBottom:`1px solid rgba(255,255,255,0.06)`}}>
        <div style={{padding:"10px 8px"}}/>
        {fieldNames.map((f,i)=>(
          <div key={i} style={{padding:"10px 12px",fontSize:11,fontWeight:800,letterSpacing:1.5,color:C.muted,textTransform:"uppercase",borderLeft:`1px solid rgba(255,255,255,0.04)`}}>⚽ {f}</div>
        ))}
      </div>
      {/* Rows */}
      {times.map(time=>(
        <div key={time} style={{display:"grid",gridTemplateColumns:`56px ${fieldNames.map(()=>"1fr").join(" ")}`,borderBottom:`1px solid rgba(255,255,255,0.04)`,minHeight:72}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:C.muted,fontStyle:"italic"}}>{time}</div>
          {fieldNames.map((_,fi)=>{
            const slot = displaySlots.find(s=>s.time===time&&s.field===fi+1);
            return (
              <div key={fi} style={{borderLeft:`1px solid rgba(255,255,255,0.04)`,padding:6}}>
                <SlotBlock slot={slot} onClick={()=>onSelectSlot({field:`สนาม ${fi+1}`,time,slot})}/>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const WeekView = ({slots,weekStart,onSelectSlot}) => {
  const days = Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return d;});
  const today = new Date();
  const SHOW_TIMES = ["10:00","12:00","14:00","16:00","18:00","20:00","22:00"];
  return (
    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",minHeight:400}}>
      <div style={{display:"grid",gridTemplateColumns:`56px repeat(7,1fr)`,borderBottom:`1px solid rgba(255,255,255,0.06)`}}>
        <div/>
        {days.map((d,i)=>{
          const isToday = d.toDateString()===today.toDateString();
          return (
            <div key={i} style={{padding:"9px 6px",fontSize:10,fontWeight:800,letterSpacing:1,color:isToday?C.green:C.muted,textTransform:"uppercase",textAlign:"center",borderLeft:`1px solid rgba(255,255,255,0.04)`,background:isToday?"rgba(16,185,129,0.05)":undefined}}>
              {DAYS_TH[i]}<br/>
              <span style={{fontSize:15,fontWeight:900,color:isToday?C.green:C.sub}}>{d.getDate()}</span>
            </div>
          );
        })}
      </div>
      {SHOW_TIMES.map(time=>(
        <div key={time} style={{display:"grid",gridTemplateColumns:`56px repeat(7,1fr)`,borderBottom:`1px solid rgba(255,255,255,0.04)`,minHeight:52}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:C.muted,fontStyle:"italic"}}>{time}</div>
          {days.map((d,di)=>{
            const dateStr = d.toISOString().split("T")[0];
            const slot = slots.find(s=>s.date===dateStr&&s.time===time);
            return (
              <div key={di} style={{borderLeft:`1px solid rgba(255,255,255,0.04)`,padding:4}}>
                {slot?(
                  <div style={{height:"100%",borderRadius:6,padding:"5px 7px",cursor:"pointer",background:slot.status==="live"?"rgba(16,185,129,0.2)":slot.source==="platform"?"rgba(16,185,129,0.1)":"rgba(255,255,255,0.04)",border:`1px solid ${slot.status==="live"?"rgba(16,185,129,0.6)":slot.source==="platform"?"rgba(16,185,129,0.3)":"rgba(255,255,255,0.1)"}`,fontSize:10,fontWeight:800,color:slot.status==="live"?C.greenBr:C.text}}>
                    <div style={{lineHeight:1.2}}>{slot.name}</div>
                    <div style={{fontSize:9,color:C.sub,marginTop:2}}>{slot.players}/{slot.total}</div>
                    {slot.status==="live"&&<div style={{fontSize:8,color:C.greenBr}}>● LIVE</div>}
                  </div>
                ):(
                  <div onClick={()=>onSelectSlot({field:"สนาม 1",time,date:dateStr})} style={{height:"100%",borderRadius:6,cursor:"pointer",border:`1px dashed rgba(255,255,255,0.06)`,minHeight:40}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(16,185,129,0.04)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}/>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const MonthView = ({slots,monthDate,onSelectDay}) => {
  const year=monthDate.getFullYear(), month=monthDate.getMonth();
  const firstDay=(new Date(year,month,1).getDay()+6)%7;
  const daysInMonth=new Date(year,month+1,0).getDate();
  const cells=[];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);
  while(cells.length%7!==0) cells.push(null);
  const today=new Date();
  const slotsByDay={};
  slots.forEach(s=>{const d=new Date(s.date);if(d.getFullYear()===year&&d.getMonth()===month){const k=d.getDate();if(!slotsByDay[k])slotsByDay[k]=[];slotsByDay[k].push(s);}});
  return (
    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",minHeight:400}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`1px solid rgba(255,255,255,0.06)`}}>
        {DAYS_TH.map(d=><div key={d} style={{padding:"9px 8px",fontSize:10,fontWeight:800,letterSpacing:1.5,color:C.muted,textTransform:"uppercase",textAlign:"center"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
        {cells.map((d,i)=>{
          if(!d) return <div key={i} style={{borderRight:`1px solid rgba(255,255,255,0.04)`,borderBottom:`1px solid rgba(255,255,255,0.04)`,minHeight:72}}/>;
          const isToday=today.getFullYear()===year&&today.getMonth()===month&&today.getDate()===d;
          const daySlots=slotsByDay[d]||[];
          const liveCount=daySlots.filter(s=>s.status==="live").length;
          return (
            <div key={i} onClick={()=>onSelectDay(new Date(year,month,d))}
              style={{borderRight:`1px solid rgba(255,255,255,0.04)`,borderBottom:`1px solid rgba(255,255,255,0.04)`,padding:6,minHeight:72,cursor:"pointer",background:isToday?"rgba(16,185,129,0.05)":undefined,transition:"background .15s"}}
              onMouseEnter={e=>!isToday&&(e.currentTarget.style.background="rgba(255,255,255,0.02)")}
              onMouseLeave={e=>!isToday&&(e.currentTarget.style.background="transparent")}>
              <div style={{fontSize:13,fontWeight:800,color:isToday?C.green:C.sub,marginBottom:4}}>{d}</div>
              {daySlots.length>0&&(
                <div style={{fontSize:10,fontWeight:800,padding:"2px 6px",borderRadius:4,background:liveCount>0?"rgba(16,185,129,0.2)":"rgba(16,185,129,0.08)",color:liveCount>0?C.greenBr:C.green,border:`1px solid ${liveCount>0?"rgba(16,185,129,0.5)":"rgba(16,185,129,0.2)"}`}}>
                  {daySlots.length} slot{liveCount>0?` · ${liveCount} Live`:""}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══ SHOP TAB ═══ */
const SHOP_ITEMS=[
  {id:1,name:"น้ำเปล่า",price:15,icon:"💧",cat:"drink"},
  {id:2,name:"เกเตอเรด",price:35,icon:"⚡",cat:"drink"},
  {id:3,name:"โค้ก",price:25,icon:"🥤",cat:"drink"},
  {id:4,name:"ขนมปัง",price:20,icon:"🍞",cat:"food"},
  {id:5,name:"กล้วยหอม",price:15,icon:"🍌",cat:"food"},
  {id:6,name:"โปรตีนบาร์",price:60,icon:"💪",cat:"food"},
  {id:7,name:"ถุงเท้า SQUAD HUB",price:120,icon:"🧦",cat:"gear"},
  {id:8,name:"ผ้าเช็ดตัว",price:150,icon:"🏊",cat:"gear"},
  {id:9,name:"เสื้อ SQUAD HUB",price:490,icon:"👕",cat:"merch"},
];
const ShopTab = ({ownerUnlocked}) => {
  const [cart,setCart]=useState({});
  const [cat,setCat]=useState("all");
  const [payMode,setPayMode]=useState(null);
  const [done,setDone]=useState(false);
  const add=(id)=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
  const rem=(id)=>setCart(c=>{const n={...c};n[id]>1?n[id]--:delete n[id];return n;});
  const items=cat==="all"?SHOP_ITEMS:SHOP_ITEMS.filter(i=>i.cat===cat);
  const total=Object.entries(cart).reduce((s,[id,q])=>{const it=SHOP_ITEMS.find(i=>i.id===+id);return s+(it?.price||0)*q;},0);
  const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);
  if(done)return(
    <div style={{maxWidth:500,background:C.bg2,border:`1px solid ${C.borderHi}`,borderRadius:16,padding:28,textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:12}}>✅</div>
      <div style={{fontSize:18,fontWeight:900,color:C.green,marginBottom:6}}>รับเงินแล้ว ฿{total.toLocaleString()}</div>
      <div style={{fontSize:13,color:C.sub,marginBottom:22}}>บันทึก transaction เรียบร้อย</div>
      <Btn ghost onClick={()=>{setCart({});setPayMode(null);setDone(false);}} style={{width:"100%"}}>ขายต่อ</Btn>
    </div>
  );
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16}}>
      <div>
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {[{id:"all",l:"ทั้งหมด"},{id:"drink",l:"🥤 เครื่องดื่ม"},{id:"food",l:"🍌 อาหาร"},{id:"gear",l:"⚽ อุปกรณ์"},{id:"merch",l:"👕 Merchandise"}].map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)}
              style={{padding:"7px 14px",borderRadius:8,fontSize:12,fontWeight:800,border:`1px solid ${cat===c.id?C.borderHi:C.border}`,background:cat===c.id?C.greenDim:"transparent",color:cat===c.id?C.green:C.sub,cursor:"pointer"}}>
              {c.l}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
          {items.map(item=>(
            <div key={item.id} onClick={()=>add(item.id)}
              style={{background:C.bg2,border:`1px solid ${cart[item.id]?C.borderHi:C.border}`,borderRadius:14,padding:"16px 12px",textAlign:"center",cursor:"pointer",transition:"all .15s"}}>
              <div style={{fontSize:32,marginBottom:8}}>{item.icon}</div>
              <div style={{fontSize:13,fontWeight:800,color:C.text,marginBottom:4}}>{item.name}</div>
              <div style={{fontSize:14,fontWeight:900,color:C.green}}>฿{item.price}</div>
              {cart[item.id]>0&&(
                <div style={{marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  <button onClick={e=>{e.stopPropagation();rem(item.id);}} style={{width:24,height:24,borderRadius:"50%",background:"rgba(255,255,255,0.08)",border:`1px solid ${C.border}`,color:C.text,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{fontSize:15,fontWeight:900,color:C.greenBr}}>{cart[item.id]}</span>
                  <button onClick={e=>{e.stopPropagation();add(item.id);}} style={{width:24,height:24,borderRadius:"50%",background:C.greenDim,border:`1px solid ${C.borderHi}`,color:C.green,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,padding:18,position:"sticky",top:20}}>
        <div style={{fontSize:15,fontWeight:900,color:C.text,marginBottom:14}}>
          🛒 ตะกร้า {cartCount>0&&<span style={{fontSize:12,color:C.green}}>({cartCount} รายการ)</span>}
        </div>
        {cartCount===0?(
          <div style={{textAlign:"center",padding:"24px 0",color:C.muted,fontSize:13}}>ยังไม่มีสินค้า<br/>กดสินค้าเพื่อเพิ่ม</div>
        ):(
          <div style={{marginBottom:14}}>
            {Object.entries(cart).map(([id,q])=>{
              const it=SHOP_ITEMS.find(i=>i.id===+id);
              if(!it)return null;
              return(
                <div key={id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid rgba(255,255,255,0.04)`}}>
                  <div style={{fontSize:13,color:C.text}}>{it.icon} {it.name} ×{q}</div>
                  <div style={{fontSize:13,fontWeight:800,color:C.green}}>฿{(it.price*q).toLocaleString()}</div>
                </div>
              );
            })}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,marginTop:4}}>
              <div style={{fontSize:14,fontWeight:800,color:C.text}}>รวม</div>
              <div style={{fontSize:22,fontWeight:900,color:C.green}}>฿{total.toLocaleString()}</div>
            </div>
          </div>
        )}
        {cartCount>0&&!payMode&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            <button onClick={()=>setPayMode("cash")} style={{padding:"10px",borderRadius:8,border:`1px solid rgba(251,191,36,0.4)`,background:`rgba(251,191,36,0.08)`,color:C.amber,fontSize:13,fontWeight:800,cursor:"pointer"}}>💵 เงินสด</button>
            <button onClick={()=>setPayMode("qr")} style={{padding:"10px",borderRadius:8,border:`1px solid ${C.borderHi}`,background:C.greenDim,color:C.green,fontSize:13,fontWeight:800,cursor:"pointer"}}>📱 QR Pay</button>
          </div>
        )}
        {payMode&&(
          <div style={{background:C.greenDim,border:`1px solid ${C.borderHi}`,borderRadius:10,padding:12,marginBottom:10,textAlign:"center"}}>
            <div style={{fontSize:12,fontWeight:800,color:C.green,marginBottom:4}}>{payMode==="cash"?"รับเงินสด":"สแกน QR PromptPay"}</div>
            <div style={{fontSize:22,fontWeight:900,color:C.text}}>฿{total.toLocaleString()}</div>
          </div>
        )}
        {payMode&&<button onClick={()=>setDone(true)} style={{width:"100%",padding:12,borderRadius:10,border:"none",background:`linear-gradient(135deg,#059669,${C.green})`,color:"#001a0d",fontSize:14,fontWeight:900,cursor:"pointer"}}>✅ รับเงินแล้ว</button>}
        {cartCount>0&&<button onClick={()=>setCart({})} style={{width:"100%",marginTop:8,padding:"8px",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>ล้างตะกร้า</button>}
        {ownerUnlocked&&(
          <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid rgba(255,255,255,0.06)`}}>
            <div style={{fontSize:9,fontWeight:800,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>ยอดขายวันนี้ (Owner)</div>
            <div style={{fontSize:20,fontWeight:900,color:C.amber}}>฿1,240</div>
            <div style={{fontSize:11,color:C.sub,marginTop:2}}>18 รายการ</div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══ BOOKING PANEL ═══ */
const MOCK_PLAYERS = [
  {id:4,name:"นิว",position:"MF",tier:"Gold",ovr:80},
  {id:1,name:"กัปตัน",position:"FW",tier:"Diamond",ovr:92},
  {id:2,name:"อาร์ม",position:"FW",tier:"Platinum",ovr:85},
  {id:5,name:"โจ้",position:"DF",tier:"Gold",ovr:76},
  {id:6,name:"Sarun Jr.",position:"MF",tier:"Bronze",ovr:71},
];

const BookingPanel = ({selected,venueId,onSave,onRefresh}) => {
  const [mode,setMode]=useState("create"); // create | manage | block
  const [type,setType]=useState("platform");
  const [name,setName]=useState("");
  const [time,setTime]=useState(selected?.time||"18:00");
  const [endTime,setEndTime]=useState("20:00");
  const [price,setPrice]=useState("1500");
  const [matchType,setMatchType]=useState("7v7");
  const [playerName,setPlayerName]=useState("");
  const [addedPlayers,setAddedPlayers]=useState([]);
  const [blockReason,setBlockReason]=useState("");
  const [blockType,setBlockType]=useState("slot"); // slot | day
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(null); // null | "success" | "error"
  const [confirm,setConfirm]=useState(false);

  const inp={width:"100%",background:"#091510",border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",fontSize:14,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:12};
  const filtered=playerName.trim().length>0?MOCK_PLAYERS.filter(p=>p.name.includes(playerName.trim())):[];

  const maxPlayers = {
    "7v7_2t":14,"7v7_3t":21,"7v7_4t":28,
    "6v6_2t":12,"6v6_3t":18,"6v6_4t":24,
    "5v5_2t":10,"5v5_3t":15,
  };

  // สร้าง slot ใหม่
  const handleCreate = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const {error} = await supabase.from("slots").insert({
        venue_id: venueId,
        date: today,
        start_time: time+":00",
        end_time: endTime+":00",
        price_per_player: parseInt(price)||0,
        max_players: maxPlayers[matchType]||14,
        match_type: matchType,
        status: type==="platform"?"open":"offline",
        field_number: selected?.field||1,
      });
      if(error) throw error;
      setDone("success");
      onRefresh?.();
    } catch(e) {
      console.error(e);
      setDone("error");
    }
    setLoading(false);
  };

  // แก้ไข slot
  const handleEdit = async () => {
    if(!selected?.slot?.id) return;
    setLoading(true);
    try {
      const {error} = await supabase.from("slots").update({
        start_time: time+":00",
        price_per_player: parseInt(price)||0,
        max_players: maxPlayers[matchType]||14,
        match_type: matchType,
      }).eq("id", selected.slot.id);
      if(error) throw error;
      setDone("success");
      onRefresh?.();
    } catch(e) {
      setDone("error");
    }
    setLoading(false);
  };

  // บล็อก slot / ทั้งวัน
  const handleBlock = async () => {
    setLoading(true);
    try {
      if(blockType==="slot"&&selected?.slot?.id) {
        const {error} = await supabase.from("slots").update({
          status:"blocked",
          block_reason: blockReason||"ปิดชั่วคราว",
        }).eq("id", selected.slot.id);
        if(error) throw error;
      } else {
        // ปิดทั้งวัน — update ทุก slot ของ venue วันนี้
        const today = new Date().toISOString().split("T")[0];
        const {error} = await supabase.from("slots").update({
          status:"blocked",
          block_reason: blockReason||"ปิดสนามชั่วคราว",
        }).eq("venue_id", venueId).eq("date", today).eq("status","open");
        if(error) throw error;
      }
      setDone("success");
      onRefresh?.();
    } catch(e) {
      setDone("error");
    }
    setLoading(false);
    setConfirm(false);
  };

  // ยกเลิก slot
  const handleCancel = async () => {
    if(!selected?.slot?.id) return;
    setLoading(true);
    try {
      const {error} = await supabase.from("slots").update({
        status:"cancelled",
        block_reason: blockReason||"ยกเลิก slot",
      }).eq("id", selected.slot.id);
      if(error) throw error;
      setDone("success");
      onRefresh?.();
    } catch(e) {
      setDone("error");
    }
    setLoading(false);
    setConfirm(false);
  };

  // Success / Error state
  if(done) return (
    <div style={{background:C.bg2,border:`1px solid ${done==="success"?C.borderHi:"rgba(239,68,68,0.3)"}`,borderRadius:16,padding:20,position:"sticky",top:20,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:12}}>{done==="success"?"✅":"❌"}</div>
      <div style={{fontSize:15,fontWeight:900,color:done==="success"?C.green:C.red,marginBottom:8}}>
        {done==="success"?"บันทึกสำเร็จ!":"เกิดข้อผิดพลาด"}
      </div>
      <div style={{fontSize:12,color:C.sub,marginBottom:20}}>
        {done==="success"?"ข้อมูลอัพเดตใน User App แล้ว":"ลองใหม่อีกครั้ง"}
      </div>
      <Btn ghost onClick={()=>{setDone(null);setConfirm(false);}} style={{width:"100%"}}>
        {done==="success"?"จัดการ slot อื่น":"ลองใหม่"}
      </Btn>
    </div>
  );

  // Confirm dialog
  if(confirm) return (
    <div style={{background:C.bg2,border:`1px solid rgba(239,68,68,0.35)`,borderRadius:16,padding:20,position:"sticky",top:20}}>
      <div style={{fontSize:14,fontWeight:900,color:C.red,marginBottom:8}}>
        ⚠ ยืนยันการ{mode==="block"?"บล็อก":"ยกเลิก"} slot
      </div>
      <div style={{fontSize:12,color:C.sub,marginBottom:6,lineHeight:1.7}}>
        {mode==="block"&&blockType==="day"
          ?"ต้องการปิดสนามทั้งวันใช่ไหม? slot ที่มีคนจองแล้วจะได้รับ LINE notify อัตโนมัติ"
          :"ต้องการบล็อก/ยกเลิก slot นี้ใช่ไหม? ถ้ามีคนจองแล้วจะได้รับ LINE notify อัตโนมัติ"
        }
      </div>
      <div style={{background:"rgba(251,191,36,0.06)",border:`1px solid rgba(251,191,36,0.2)`,borderRadius:8,padding:"9px 12px",fontSize:11,color:C.amber,marginBottom:16,lineHeight:1.6}}>
        📱 LINE notify จะถูกส่งให้ผู้เล่นที่จองแล้วทุกคนอัตโนมัติ
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <Btn ghost onClick={()=>setConfirm(false)} style={{width:"100%"}}>ยกเลิก</Btn>
        <button onClick={mode==="block"?handleBlock:handleCancel} disabled={loading}
          style={{padding:"11px",borderRadius:8,border:`1px solid rgba(239,68,68,0.4)`,background:`rgba(239,68,68,0.1)`,color:C.red,fontSize:14,fontWeight:800,cursor:"pointer"}}>
          {loading?"กำลังดำเนินการ...":"ยืนยัน"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{background:C.bg2,border:`1px solid ${C.borderHi}`,borderRadius:16,padding:20,position:"sticky",top:20,maxHeight:"80vh",overflowY:"auto"}}>

      {/* Header */}
      <div style={{fontSize:15,fontWeight:900,color:C.text,marginBottom:3}}>
        {mode==="create"?"+ สร้าง slot ใหม่":mode==="manage"?"✏️ แก้ไข slot":"🚫 บล็อก slot"}
      </div>
      <div style={{fontSize:12,color:C.sub,marginBottom:14}}>
        {selected?.slot
          ? `${selected.field} · ${selected.time} · ${selected.slot.name||"ว่าง"}`
          : selected
          ? `${selected.field} · ${selected.time}`
          : "เลือก slot จาก calendar"}
      </div>

      {/* Mode tabs */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,marginBottom:16}}>
        {[
          {id:"create",l:"➕ สร้าง"},
          {id:"manage",l:"✏️ แก้ไข",disabled:!selected?.slot},
          {id:"block",l:"🚫 บล็อก",disabled:!selected?.slot},
        ].map(m=>(
          <button key={m.id} onClick={()=>!m.disabled&&setMode(m.id)}
            style={{padding:"7px 4px",borderRadius:8,fontSize:11,fontWeight:800,cursor:m.disabled?"not-allowed":"pointer",textAlign:"center",border:`1px solid ${mode===m.id?C.borderHi:C.border}`,background:mode===m.id?C.greenDim:"transparent",color:mode===m.id?C.green:m.disabled?C.muted:C.sub,opacity:m.disabled?.4:1,transition:"all .15s"}}>
            {m.l}
          </button>
        ))}
      </div>

      {/* ── CREATE MODE ── */}
      {mode==="create"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
            {["platform","offline"].map(t=>(
              <button key={t} onClick={()=>setType(t)}
                style={{padding:"9px",borderRadius:8,fontSize:12,fontWeight:800,cursor:"pointer",textAlign:"center",border:`1px solid ${type===t?t==="platform"?"rgba(16,185,129,0.5)":"rgba(255,255,255,0.2)":C.border}`,background:type===t?t==="platform"?C.greenDim:"rgba(255,255,255,0.03)":"transparent",color:type===t?t==="platform"?C.green:C.text:C.sub,transition:"all .15s"}}>
                {t==="platform"?"⚡ Platform":"📋 Offline"}
              </button>
            ))}
          </div>
          {type==="offline"&&(
            <div style={{background:"rgba(251,191,36,0.06)",border:`1px solid rgba(251,191,36,0.2)`,borderRadius:8,padding:"9px 12px",fontSize:11,color:C.amber,marginBottom:14,lineHeight:1.6}}>
              ⚠ Offline ไม่ได้ Stats Card, XP หรือสิทธิ์บน Platform
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:4}}>
            <div>
              <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>เวลาเริ่ม</div>
              <select value={time} onChange={e=>setTime(e.target.value)} style={{...inp,marginBottom:0,background:"#091510",color:C.text}}>
                {TIMES.map(t=><option key={t} value={t} style={{background:"#091510"}}>{t}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>เวลาสิ้นสุด</div>
              <select value={endTime} onChange={e=>setEndTime(e.target.value)} style={{...inp,marginBottom:0,background:"#091510",color:C.text}}>
                {TIMES.map(t=><option key={t} value={t} style={{background:"#091510"}}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:4}}>
            <div>
              <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>ราคา/คน ฿</div>
              <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="150" style={{...inp,marginBottom:0}}/>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>ประเภท</div>
              <select value={matchType} onChange={e=>setMatchType(e.target.value)} style={{...inp,color:C.text,marginBottom:0,background:"#091510"}}>
  <optgroup label="7v7" style={{background:"#091510",color:"#6b9e85"}}>
    <option style={{background:"#091510"}} value="7v7_2t">7v7 · 2 ทีม · 14 คน</option>
    <option style={{background:"#091510"}} value="7v7_3t">7v7 · 3 ทีม · 21 คน</option>
    <option style={{background:"#091510"}} value="7v7_4t">7v7 · 4 ทีม · 28 คน</option>
  </optgroup>
  <optgroup label="6v6" style={{background:"#091510",color:"#6b9e85"}}>
    <option style={{background:"#091510"}} value="6v6_2t">6v6 · 2 ทีม · 12 คน</option>
    <option style={{background:"#091510"}} value="6v6_3t">6v6 · 3 ทีม · 18 คน</option>
    <option style={{background:"#091510"}} value="6v6_4t">6v6 · 4 ทีม · 24 คน</option>
  </optgroup>
  <optgroup label="5v5" style={{background:"#091510",color:"#6b9e85"}}>
    <option style={{background:"#091510"}} value="5v5_2t">5v5 · 2 ทีม · 10 คน</option>
    <option style={{background:"#091510"}} value="5v5_3t">5v5 · 3 ทีม · 15 คน</option>
  </optgroup>
</select>
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>สนามที่</div>
            <select style={{...inp,color:C.text,marginBottom:0,background:"#091510"}}>
              {[1,2,3].map(n=>(
                <option key={n} style={{background:"#091510"}} value={n}>สนาม {n}</option>
              ))}
            </select>
          </div>
          <Btn onClick={handleCreate} disabled={loading} style={{width:"100%",padding:13}}>
            {loading?"กำลังสร้าง...":"สร้าง slot → ผู้เล่นเห็นทันที"}
          </Btn>
        </>
      )}

      {/* ── MANAGE MODE ── */}
{mode==="manage"&&selected?.slot&&(
  <>
    <div style={{background:C.greenDim,border:`1px solid ${C.borderHi}`,borderRadius:8,padding:"10px 12px",marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:800,color:C.green,marginBottom:4}}>แก้ไขได้ทันที</div>
      <div style={{fontSize:11,color:C.sub,lineHeight:1.7}}>
        ⚠ ราคาที่แก้จะใช้กับคนจองใหม่เท่านั้น<br/>คนที่จองแล้วได้ราคาเดิม (Price lock)
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:4}}>
      <div>
        <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>เวลาเริ่ม</div>
        <select value={time} onChange={e=>setTime(e.target.value)} style={{...inp,marginBottom:0,background:"#091510",color:C.text}}>
          {TIMES.map(t=><option key={t} value={t} style={{background:"#091510"}}>{t}</option>)}
        </select>
      </div>
      <div>
        <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>ราคา/คน ฿</div>
        <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="150" style={{...inp,marginBottom:0}}/>
      </div>
    </div>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>ประเภท</div>
      <select value={matchType} onChange={e=>setMatchType(e.target.value)} style={{...inp,color:C.text,marginBottom:0,background:"#091510"}}>
        <optgroup label="7v7" style={{background:"#091510",color:"#6b9e85"}}>
          <option style={{background:"#091510"}} value="7v7_3t">7v7 · 3 ทีม · 21 คน</option>
          <option style={{background:"#091510"}} value="7v7_4t">7v7 · 4 ทีม · 28 คน</option>
        </optgroup>
        <optgroup label="6v6" style={{background:"#091510",color:"#6b9e85"}}>
          <option style={{background:"#091510"}} value="6v6_3t">6v6 · 3 ทีม · 18 คน</option>
        </optgroup>
        <optgroup label="5v5" style={{background:"#091510",color:"#6b9e85"}}>
          <option style={{background:"#091510"}} value="5v5_2t">5v5 · 2 ทีม · 10 คน</option>
          <option style={{background:"#091510"}} value="5v5_3t">5v5 · 3 ทีม · 15 คน</option>
        </optgroup>
      </select>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      <Btn ghost onClick={()=>setConfirm(true)} style={{width:"100%",color:C.red,borderColor:"rgba(239,68,68,0.3)"}}>
        🗑 ยกเลิก slot
      </Btn>
      <Btn onClick={handleEdit} disabled={loading} style={{width:"100%"}}>
        {loading?"กำลังบันทึก...":"บันทึก ✓"}
      </Btn>
    </div>
  </>
)}

      {/* ── BLOCK MODE ── */}
      {mode==="block"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
            {[{id:"slot",l:"🚫 ทีละ slot"},{id:"day",l:"🔒 ทั้งวัน"}].map(b=>(
              <button key={b.id} onClick={()=>setBlockType(b.id)}
                style={{padding:"9px",borderRadius:8,fontSize:12,fontWeight:800,cursor:"pointer",textAlign:"center",border:`1px solid ${blockType===b.id?"rgba(239,68,68,0.5)":C.border}`,background:blockType===b.id?"rgba(239,68,68,0.08)":"transparent",color:blockType===b.id?C.red:C.sub,transition:"all .15s"}}>
                {b.l}
              </button>
            ))}
          </div>
          {blockType==="day"&&(
            <div style={{background:"rgba(239,68,68,0.06)",border:`1px solid rgba(239,68,68,0.2)`,borderRadius:8,padding:"9px 12px",fontSize:11,color:C.red,marginBottom:14,lineHeight:1.6}}>
              ⚠ จะบล็อก slot ที่ยังว่างทั้งหมดในวันนี้ slot ที่มีคนจองแล้วจะไม่ถูกกระทบ
            </div>
          )}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>เหตุผล (optional)</div>
            <input value={blockReason} onChange={e=>setBlockReason(e.target.value)}
              placeholder="เช่น สนามซ่อมบำรุง, ฝนตก..."
              style={{...inp,marginBottom:0}}/>
          </div>
          <div style={{background:"rgba(251,191,36,0.06)",border:`1px solid rgba(251,191,36,0.2)`,borderRadius:8,padding:"9px 12px",fontSize:11,color:C.amber,marginBottom:16,lineHeight:1.6}}>
            📱 LINE notify จะส่งให้ผู้เล่นที่จองไว้แล้วอัตโนมัติ
          </div>
          <button onClick={()=>setConfirm(true)}
            style={{width:"100%",padding:13,borderRadius:10,border:`1px solid rgba(239,68,68,0.4)`,background:`rgba(239,68,68,0.08)`,color:C.red,fontSize:14,fontWeight:900,cursor:"pointer"}}>
            🚫 {blockType==="day"?"ปิดสนามทั้งวัน":"บล็อก slot นี้"}
          </button>
        </>
      )}

    </div>
  );
};

/* ═══ MATCH END ═══ */
const MatchEndTab = ({match,onDone}) => {
  const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(false);
  const confirm = async () => {
    setLoading(true);
    try { await fetch("https://primary-production-e855.up.railway.app/webhook/match-end",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({match_id:match?.id||1,venue_id:match?.venue_id||1})}); }
    catch(e){console.error(e);}
    setSent(true);setLoading(false);
  };
  if(sent)return(
    <div style={{background:C.bg2,border:`1px solid ${C.borderHi}`,borderRadius:16,padding:28,textAlign:"center",maxWidth:500}}>
      <div style={{fontSize:36,marginBottom:14}}>✅</div>
      <div style={{fontSize:17,fontWeight:900,color:C.green,marginBottom:8}}>ส่งแจ้งกัปตันแล้ว!</div>
      <div style={{fontSize:13,color:C.sub,lineHeight:1.9,marginBottom:22}}>LINE Bot ส่งฟอร์มสรุปให้กัปตันแต่ละทีมแล้ว<br/>กัปตันสรุปผล → AI บันทึก Stats + XP</div>
      <Btn ghost onClick={onDone} style={{width:"100%"}}>กลับหน้าหลัก</Btn>
    </div>
  );
  return(
    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,padding:24,maxWidth:500}}>
      <div style={{fontSize:11,fontWeight:800,color:C.green,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>ยืนยันแมตช์จบ</div>
      <div style={{fontSize:19,fontWeight:900,color:C.text,marginBottom:6}}>{match?.name||"Match"}</div>
      <div style={{fontSize:13,color:C.sub,marginBottom:20}}>{match?.time||"—"} · {match?.players||0} ผู้เล่น</div>
      <div style={{background:C.greenDim,border:`1px solid ${C.borderHi}`,borderRadius:12,padding:"14px 16px",marginBottom:22,fontSize:12,color:C.greenBr,lineHeight:1.9,fontWeight:700}}>
        หลังกดยืนยัน:<br/><span style={{color:C.sub,fontWeight:400}}>LINE Bot → แจ้งกัปตัน → กัปตันส่งสรุป → AI บันทึก Stats + XP</span>
      </div>
      <Btn onClick={confirm} disabled={loading} style={{width:"100%",padding:14,fontSize:15}}>
        {loading?"กำลังส่ง...":"⏱ ยืนยันแมตช์จบ →"}
      </Btn>
    </div>
  );
};

/* ═══ FINANCE ═══ */
const FinanceTab = ({venue}) => (
  <div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:12,marginBottom:22}}>
      <MetricCard icon="💰" value={`฿${(venue?.wallet_balance||0).toLocaleString()}`} label="ยอดคงเหลือ" foot="พร้อมถอน" footColor={C.green} hi/>
      <MetricCard icon="📈" value="—" label="รายได้เดือนนี้" foot="เร็วๆนี้"/>
      <MetricCard icon="📊" value="5%" label="Commission rate" foot="Founding Partner" footColor={C.amber}/>
    </div>
    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,padding:22,textAlign:"center"}}>
      <div style={{fontSize:13,color:C.sub,marginBottom:16}}>ประวัติการเงินจะแสดงเมื่อมีข้อมูลจริง</div>
      <Btn ghost style={{margin:"0 auto",width:"fit-content"}}>ถอนเงิน →</Btn>
    </div>
  </div>
);

/* ═══ MOBILE ═══ */
const MobileApp = ({venue,slots,ownerUnlocked,onLogout}) => {
  const [mTab,setMTab]=useState("scan");
  const [showScanner,setShowScanner]=useState(false);
  const [scanId,setScanId]=useState(null);
  const [activeMatch,setActiveMatch]=useState(null);
  const [showOwnerPin,setShowOwnerPin]=useState(false);
  const [mOwner,setMOwner]=useState(ownerUnlocked||false);
  const liveSlots=slots.filter(s=>s.status==="live");

  const mNavItems=[
  {id:"scan",icon:"🔲",label:"Scan"},
  {id:"schedule",icon:"📅",label:"ตาราง"},
  {id:"matchend",icon:"⏱️",label:"จบแมตช์",badge:liveSlots.length||null},
  {id:"finance",icon:"💰",label:"รายได้",ownerOnly:true},
];

  const displaySlots = slots.length===0 ? MOCK_SLOTS : slots;

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <header style={{padding:"12px 16px",background:"rgba(5,10,8,0.97)",backdropFilter:"blur(24px)",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
        <Wordmark sm/>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:13,fontWeight:800,color:C.text}}>{venue?.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end",marginTop:2}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:C.green}}/>
            <span style={{fontSize:10,color:C.green}}>ออนไลน์</span>
          </div>
        </div>
      </header>

      <div style={{padding:"16px 16px 80px"}}>

        {/* ── SCAN ── */}
        {mTab==="scan"&&(
          <div>
            <div style={{background:C.bg2,border:`1px solid ${C.borderHi}`,borderRadius:16,padding:20,textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:48,marginBottom:12}}>🔲</div>
              <div style={{fontSize:17,fontWeight:900,color:C.text,marginBottom:6}}>Scan Player QR</div>
              <div style={{fontSize:13,color:C.sub,marginBottom:20,lineHeight:1.7}}>ให้ผู้เล่นเปิด SQUAD HUB<br/>แล้วโชว์ "QR ของฉัน"</div>
              <Btn onClick={()=>setShowScanner(true)} style={{width:"100%",padding:14,fontSize:15}}>🔲 เปิดกล้องสแกน</Btn>
            </div>
            {liveSlots.length>0&&(
              <div>
                <div style={{fontSize:10,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>แมตช์ที่ต้องยืนยัน</div>
                {liveSlots.map(s=>(
                  <div key={s.id} style={{background:C.bg2,border:`1px solid ${C.borderHi}`,borderRadius:14,padding:"14px 16px",marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <div style={{width:6,height:6,borderRadius:"50%",background:C.green}}/>
                          <span style={{fontSize:14,fontWeight:900,color:C.green}}>{s.name}</span>
                        </div>
                        <div style={{fontSize:11,color:C.sub,marginTop:3}}>{s.time} · {s.players}/{s.total||14} คน</div>
                      </div>
                      <Tag color={C.green}>LIVE</Tag>
                    </div>
                    <button onClick={()=>{setActiveMatch(s);setMTab("matchend");}}
                      style={{width:"100%",padding:11,borderRadius:9,border:`1px solid rgba(251,191,36,0.4)`,background:`rgba(251,191,36,0.08)`,color:C.amber,fontSize:13,fontWeight:800,cursor:"pointer"}}>
                      ⏱ ยืนยันแมตช์จบ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SCHEDULE ── */}
{mTab==="schedule"&&(
  <div>
    {/* Dashboard metrics */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
      <div style={{background:C.greenDim,border:`1px solid ${C.borderHi}`,borderRadius:12,padding:"12px 14px"}}>
        <div style={{fontSize:9,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Slot วันนี้</div>
        <div style={{fontSize:22,fontWeight:900,color:C.greenBr,lineHeight:1}}>{displaySlots.length}</div>
        <div style={{fontSize:10,color:liveSlots.length>0?C.green:C.sub,marginTop:3,fontWeight:700}}>{liveSlots.length} กำลัง live</div>
      </div>
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px"}}>
        <div style={{fontSize:9,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>ผู้เล่นวันนี้</div>
        <div style={{fontSize:22,fontWeight:900,color:C.text,lineHeight:1}}>{displaySlots.reduce((a,s)=>a+(s.players||0),0)}</div>
        <div style={{fontSize:10,color:C.sub,marginTop:3,fontWeight:700}}>จากทุก slot</div>
      </div>
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px"}}>
        <div style={{fontSize:9,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>รายได้วันนี้</div>
        <div style={{fontSize:22,fontWeight:900,color:C.text,lineHeight:1}}>฿{displaySlots.reduce((a,s)=>a+(s.amount||0),0).toLocaleString()}</div>
        <div style={{fontSize:10,color:C.sub,marginTop:3,fontWeight:700}}>รวมทุกช่องทาง</div>
      </div>
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px"}}>
        <div style={{fontSize:9,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Utilization</div>
        <div style={{fontSize:22,fontWeight:900,color:C.text,lineHeight:1}}>{displaySlots.length>0?`${Math.round(displaySlots.filter(s=>s.status!=="available").length/displaySlots.length*100)}%`:"—"}</div>
        <div style={{fontSize:10,color:C.sub,marginTop:3,fontWeight:700}}>{displaySlots.filter(s=>s.status!=="available").length}/{displaySlots.length} slot</div>
      </div>
    </div>

    {/* Calendar Grid */}
    <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",marginBottom:20}}>
      <div style={{minWidth:380}}>
        <div style={{display:"grid",gridTemplateColumns:`52px repeat(3,1fr)`,marginBottom:4}}>
          <div/>
          {[1,2,3].map(i=>(
            <div key={i} style={{padding:"6px 8px",fontSize:10,fontWeight:800,letterSpacing:1,color:C.muted,textTransform:"uppercase",textAlign:"center"}}>⚽ {i}</div>
          ))}
        </div>
        {TIMES_NIGHT.map(time=>(
          <div key={time} style={{display:"grid",gridTemplateColumns:`52px repeat(3,1fr)`,marginBottom:4,minHeight:64}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:C.muted,fontStyle:"italic",flexShrink:0}}>{time}</div>
            {[1,2,3].map(fi=>{
              const slot=displaySlots.find(s=>s.time===time&&s.field===fi);
              return(
                <div key={fi} style={{padding:3}}>
                  {slot?(
                    <div onClick={()=>{if(slot.status==="live"){setActiveMatch(slot);setMTab("matchend");}}}
                      style={{height:"100%",borderRadius:8,padding:"7px 8px",background:slot.status==="live"?"rgba(16,185,129,0.18)":slot.source==="platform"?"rgba(16,185,129,0.08)":slot.status==="full"?"rgba(239,68,68,0.08)":"rgba(255,255,255,0.04)",border:`1px solid ${slot.status==="live"?"rgba(16,185,129,0.6)":slot.source==="platform"?"rgba(16,185,129,0.28)":slot.status==="full"?"rgba(239,68,68,0.25)":"rgba(255,255,255,0.1)"}`,cursor:"pointer"}}>
                      <div style={{fontSize:10,fontWeight:800,color:slot.status==="live"?C.greenBr:C.text,lineHeight:1.3,marginBottom:2}}>{slot.name||"—"}</div>
                      <div style={{fontSize:8,color:C.sub}}>{slot.source==="platform"?"Platform":"Offline"}</div>
                      {slot.total>0&&(
                        <div style={{display:"flex",gap:2,marginTop:4,flexWrap:"wrap"}}>
                          {Array.from({length:Math.min(slot.total,10)}).map((_,pi)=>(
                            <div key={pi} style={{width:5,height:5,borderRadius:"50%",background:pi<(slot.players||0)?C.green:"rgba(255,255,255,0.15)"}}/>
                          ))}
                        </div>
                      )}
                      {slot.status==="live"&&<div style={{fontSize:8,fontWeight:900,padding:"1px 5px",borderRadius:99,background:"rgba(16,185,129,0.2)",color:C.greenBr,border:`1px solid rgba(16,185,129,0.4)`,display:"inline-block",marginTop:3}}>● LIVE</div>}
                    </div>
                  ):(
                    <div style={{height:"100%",borderRadius:8,border:`1px dashed rgba(255,255,255,0.07)`,display:"flex",alignItems:"center",justifyContent:"center",minHeight:58}}>
                      <span style={{fontSize:10,color:C.muted}}>ว่าง</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>

    {/* Booking list ด้านล่าง */}
    <div style={{fontSize:10,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>รายการจองทั้งหมด</div>
    <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
      <Tag color={C.green}>Platform {displaySlots.filter(s=>s.source==="platform").length}</Tag>
      <Tag color={C.sub}>Offline {displaySlots.filter(s=>s.source==="offline").length}</Tag>
      {liveSlots.length>0&&<Tag color={C.greenBr}>Live {liveSlots.length}</Tag>}
    </div>
    {displaySlots.map((s,i)=>(
      <div key={s.id||i} style={{background:C.bg2,border:`1px solid ${s.status==="live"?C.borderHi:C.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14,fontWeight:900,color:s.status==="live"?C.green:C.text}}>{s.time}</span>
            <span style={{fontSize:10,color:C.muted}}>สนาม {s.field}</span>
            {s.status==="live"&&<div style={{width:5,height:5,borderRadius:"50%",background:C.green}}/>}
          </div>
          <div style={{fontSize:11,color:C.sub,marginTop:2}}>{s.name||"ว่าง"} · {s.players||0}/{s.total||0} คน</div>
        </div>
        <div style={{textAlign:"right"}}>
          {s.amount>0&&<div style={{fontSize:13,fontWeight:900,color:C.text,marginBottom:3}}>฿{s.amount.toLocaleString()}</div>}
          <Tag color={s.source==="platform"?C.green:C.sub}>{s.source==="platform"?"Platform":"Offline"}</Tag>
        </div>
      </div>
    ))}
  </div>
)}

        {/* ── MATCH END ── */}
        {mTab==="matchend"&&(
          <MatchEndTab match={activeMatch} onDone={()=>setMTab("scan")}/>
        )}

        {/* ── FINANCE (owner only) ── */}
        {mTab==="finance"&&(
          mOwner ? (
            <div>
              <div style={{fontSize:11,fontWeight:800,color:C.amber,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>👑 รายได้ & กระเป๋า</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                <div style={{background:C.greenDim,border:`1px solid ${C.borderHi}`,borderRadius:14,padding:"16px 14px"}}>
                  <div style={{fontSize:10,fontWeight:800,color:C.sub,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>ยอดคงเหลือ</div>
                  <div style={{fontSize:22,fontWeight:900,color:C.green}}>฿{(venue?.wallet_balance||0).toLocaleString()}</div>
                  <div style={{fontSize:11,color:C.sub,marginTop:4}}>พร้อมถอน</div>
                </div>
                <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 14px"}}>
                  <div style={{fontSize:10,fontWeight:800,color:C.sub,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Commission rate</div>
                  <div style={{fontSize:22,fontWeight:900,color:C.amber}}>5%</div>
                  <div style={{fontSize:11,color:C.sub,marginTop:4}}>Founding Partner</div>
                </div>
              </div>
              <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 14px",marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:800,color:C.sub,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>รายได้วันนี้</div>
                <div style={{fontSize:26,fontWeight:900,color:C.text,marginBottom:4}}>฿{displaySlots.reduce((a,s)=>a+(s.amount||0),0).toLocaleString()}</div>
                <div style={{fontSize:11,color:C.sub}}>รวมทุกช่องทาง</div>
              </div>
              <Btn ghost onClick={handleLogout} style={{width:"100%",fontSize:13}}>↩ ออกจากระบบ</Btn>
            </div>
          ) : (
            <div style={{textAlign:"center",paddingTop:40}}>
              <div style={{fontSize:36,marginBottom:16}}>🔒</div>
              <div style={{fontSize:16,fontWeight:900,color:C.text,marginBottom:8}}>Owner Access</div>
              <div style={{fontSize:13,color:C.sub,marginBottom:24}}>ใส่ PIN เพื่อดูข้อมูลการเงิน</div>
              <Btn onClick={()=>setShowOwnerPin(true)} style={{width:"100%",maxWidth:280,margin:"0 auto"}}>ใส่ Owner PIN</Btn>
            </div>
          )
        )}

      </div>

      {/* Bottom Nav */}
      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(5,10,8,0.97)",backdropFilter:"blur(24px)",borderTop:`1px solid ${C.border}`,padding:"8px 0 18px",display:"flex",justifyContent:"space-around"}}>
        {mNavItems.map(n=>{
          const locked=n.ownerOnly&&!mOwner;
          return(
            <button key={n.id} onClick={()=>{if(locked){setShowOwnerPin(true);return;}setMTab(n.id);}}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 8px",position:"relative"}}>
              <span style={{fontSize:18}}>{n.icon}</span>
              <span style={{fontSize:8,fontWeight:800,letterSpacing:.5,textTransform:"uppercase",color:mTab===n.id?C.green:locked?C.muted:C.sub}}>{n.label}</span>
              {n.badge>0&&(
                <div style={{position:"absolute",top:0,right:4,width:14,height:14,borderRadius:"50%",background:C.amber,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:900,color:"#000"}}>{n.badge}</div>
              )}
              {locked&&<span style={{fontSize:8,color:C.muted}}>🔒</span>}
            </button>
          );
        })}
      </nav>

      {showOwnerPin&&<OwnerPin onSuccess={()=>{setMOwner(true);setShowOwnerPin(false);setMTab("finance");}} onCancel={()=>setShowOwnerPin(false)}/>}
      {showScanner&&<QRScanner onResult={id=>{setShowScanner(false);setScanId(id);}} onClose={()=>setShowScanner(false)}/>}
      {scanId&&<ScanResult playerId={scanId} onClose={()=>setScanId(null)}/>}
      <style>{`
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  *{box-sizing:border-box}
  input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:0.6;cursor:pointer}
`}</style>
    </div>
  );
};
/* ═══ MAIN ═══ */
export default function SquadPartner() {
  const [unlocked,setUnlocked]=useState(false);
  const [venue,setVenue]=useState(null);
  const [tab,setTab]=useState("calendar");
  const [calView,setCalView]=useState("day");
  const [slots,setSlots]=useState([]);
  const [selectedSlot,setSelectedSlot]=useState(null);
  const [activeMatch,setActiveMatch]=useState(null);
  const [showPin,setShowPin]=useState(false);
  const [ownerUnlocked,setOwnerUnlocked]=useState(false);
  const [showScanner,setShowScanner]=useState(false);
  const [scanId,setScanId]=useState(null);
  const [isMobile,setIsMobile]=useState(window.innerWidth<768);
  const [calDate,setCalDate]=useState(new Date());

  useEffect(()=>{
    const fn=()=>setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);
  },[]);

  useEffect(()=>{
    if(!venue)return;
    (async()=>{
      const today=new Date().toISOString().split("T")[0];
      const {data}=await supabase.from("slots").select("*").eq("venue_id",venue.id).gte("date",today).order("date").order("start_time");
      if(data)setSlots(data.map(s=>({
        id:s.id,date:s.date,time:s.start_time?.slice(0,5)||"—",
        field:s.field_number||1,name:s.match_id?`MATCH #SQ-${s.match_id}`:"",
        players:0,total:s.max_players||14,
        source:s.match_id?"platform":"offline",
        status:s.status==="open"?"available":s.status==="full"?"full":"live",
        venue_id:venue.id,
      })));
    })();
  },[venue]);

  const handleLogout=async()=>{await supabase.auth.signOut();setUnlocked(false);setVenue(null);setSlots([]);setOwnerUnlocked(false);};
  const todaySlots=slots.filter(s=>s.date===new Date().toISOString().split("T")[0]);
  const liveCount=todaySlots.filter(s=>s.status==="live").length;
  const fields=Array.from({length:venue?.field_count||3});

  // week start (Monday)
  const weekStart=new Date(calDate);
  weekStart.setDate(calDate.getDate()-((calDate.getDay()+6)%7));

  const navDate = () => {
    if(calView==="day") return calDate.toLocaleDateString("th-TH",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
    if(calView==="week"){const e=new Date(weekStart);e.setDate(e.getDate()+6);return `${weekStart.getDate()} – ${e.getDate()} ${e.toLocaleDateString("th-TH",{month:"long",year:"numeric"})}`;}
    return calDate.toLocaleDateString("th-TH",{month:"long",year:"numeric"});
  };
  const navPrev=()=>{const d=new Date(calDate);calView==="day"?d.setDate(d.getDate()-1):calView==="week"?d.setDate(d.getDate()-7):d.setMonth(d.getMonth()-1);setCalDate(d);};
  const navNext=()=>{const d=new Date(calDate);calView==="day"?d.setDate(d.getDate()+1):calView==="week"?d.setDate(d.getDate()+7):d.setMonth(d.getMonth()+1);setCalDate(d);};

  if(!unlocked)return<VenueLogin onSuccess={v=>{setVenue(v);setUnlocked(true);}}/>;
  if(isMobile)return<MobileApp venue={venue} slots={todaySlots} ownerUnlocked={ownerUnlocked} onLogout={handleLogout}/>;

  const navItems=[
    {id:"calendar",icon:"📅",label:"ตารางสนาม"},
    {id:"matchend",icon:"⏱️",label:"ยืนยันแมตช์จบ",badge:liveCount||null},
    {id:"booking",icon:"📋",label:"การจองทั้งหมด"},
    {id:"shop",icon:"🛒",label:"ร้านค้าสนาม"},
    {id:"finance",icon:"💰",label:"รายได้ & กระเป๋า",ownerOnly:true},
  ];

  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <aside style={{width:220,background:C.bg2,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,height:"100vh",zIndex:100}}>
        <div style={{padding:"16px 18px 14px",borderBottom:`1px solid ${C.border}`}}><Wordmark/></div>
        <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:14,fontWeight:800,color:C.text,marginBottom:5}}>{venue?.name||"—"}</div>
          <div style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:C.green,background:C.greenDim,border:`1px solid ${C.borderHi}`,padding:"3px 9px",borderRadius:99}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite"}}/>
            ออนไลน์
          </div>
        </div>
        <nav style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
          <div style={{padding:"8px 10px 4px",fontSize:9,fontWeight:800,letterSpacing:1.8,color:C.muted,textTransform:"uppercase"}}>จัดการ</div>
          {navItems.map(n=>{
            const locked=n.ownerOnly&&!ownerUnlocked;
            return(
              <button key={n.id} onClick={()=>{if(locked){setShowPin(true);return;}setTab(n.id);}}
                style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",borderRadius:10,fontSize:14,fontWeight:700,color:tab===n.id?C.green:locked?C.muted:C.sub,background:tab===n.id?C.greenDim:"none",border:tab===n.id?`1px solid ${C.borderHi}`:"1px solid transparent",cursor:"pointer",width:"100%",textAlign:"left",transition:"all .15s",marginBottom:2,opacity:locked?.6:1}}>
                <span style={{opacity:tab===n.id?1:.7}}>{n.icon}</span>
                <span style={{flex:1}}>{n.label}</span>
                {n.badge>0&&<span style={{fontSize:11,fontWeight:900,padding:"1px 7px",borderRadius:99,background:"rgba(251,191,36,.15)",color:C.amber,border:"1px solid rgba(251,191,36,.25)"}}>{n.badge}</span>}
                {locked&&<span style={{fontSize:11}}>🔒</span>}
              </button>
            );
          })}
        </nav>
        <div style={{padding:"10px 12px 8px",margin:"0 8px 8px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10}}>
          <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:2}}>เข้าสู่ระบบในฐานะ</div>
          <div style={{fontSize:13,fontWeight:800,color:ownerUnlocked?C.amber:C.sub}}>{ownerUnlocked?"👑 เจ้าของ":"👤 Staff"}</div>
        </div>
        <div style={{padding:"12px 8px",borderTop:`1px solid ${C.border}`}}>
          <button onClick={handleLogout} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:10,fontSize:13,fontWeight:700,color:C.muted,background:"none",border:"1px solid transparent",cursor:"pointer",width:"100%",textAlign:"left"}}>↩ ออกจากระบบ</button>
        </div>
      </aside>

      <div style={{marginLeft:220,flex:1,display:"flex",flexDirection:"column"}}>
        <header style={{position:"sticky",top:0,height:56,background:"rgba(5,10,8,0.96)",backdropFilter:"blur(24px)",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 26px",zIndex:90}}>
          <div>
            <div style={{fontSize:16,fontWeight:900,color:C.text,textTransform:"uppercase",letterSpacing:.3}}>{navItems.find(n=>n.id===tab)?.label||"Dashboard"}</div>
            <div style={{fontSize:12,color:C.sub,marginTop:1}}>{new Date().toLocaleDateString("th-TH",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setShowScanner(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:10,background:`linear-gradient(135deg,#059669,${C.green})`,border:"none",color:"#001a0d",fontSize:14,fontWeight:900,cursor:"pointer"}}>🔲 Scan Player</button>
          </div>
        </header>

        <main style={{padding:26}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:12,marginBottom:22}}>
            <MetricCard icon="🏟️" value={todaySlots.length||0} label="Slot วันนี้" foot={`${liveCount} กำลัง live`} footColor={liveCount>0?C.green:C.sub} hi/>
            <MetricCard icon="👥" value={todaySlots.reduce((a,s)=>a+(s.players||0),0)} label="ผู้เล่นวันนี้" foot="จากทุก slot"/>
            <MetricCard icon="💰" value={`฿${todaySlots.reduce((a,s)=>a+(s.amount||0),0).toLocaleString()}`} label="รายได้วันนี้" foot="รวมทุกช่องทาง"/>
            <MetricCard icon="📊" value={todaySlots.length>0?`${Math.round(todaySlots.filter(s=>s.status!=="available").length/todaySlots.length*100)}%`:"—"} label="Utilization" foot={`${venue?.field_count||1} สนาม`}/>
          </div>

          {tab==="calendar"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{display:"flex",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
                  {["day","week","month"].map(v=>(
                    <button key={v} onClick={()=>setCalView(v)}
                      style={{padding:"8px 18px",fontSize:13,fontWeight:800,border:"none",cursor:"pointer",letterSpacing:.5,background:calView===v?"rgba(16,185,129,0.15)":"transparent",color:calView===v?C.green:C.sub,transition:"all .15s"}}>
                      {{day:"Day",week:"Week",month:"Month"}[v]}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <button onClick={navPrev} style={{width:32,height:32,borderRadius:7,background:C.bg2,border:`1px solid ${C.border}`,color:C.sub,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
                  <div style={{fontSize:14,fontWeight:800,color:C.text,minWidth:200,textAlign:"center"}}>{navDate()}</div>
                  <button onClick={navNext} style={{width:32,height:32,borderRadius:7,background:C.bg2,border:`1px solid ${C.border}`,color:C.sub,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
                  <button onClick={()=>setCalDate(new Date())} style={{padding:"6px 12px",borderRadius:7,background:C.greenDim,border:`1px solid ${C.borderHi}`,color:C.green,fontSize:12,fontWeight:800,cursor:"pointer"}}>วันนี้</button>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:16}}>
                <div>
                  {calView==="day"&&<DayView fields={fields} slots={todaySlots} date={calDate} onSelectSlot={setSelectedSlot}/>}
                  {calView==="week"&&<WeekView slots={slots} weekStart={weekStart} onSelectSlot={setSelectedSlot}/>}
                  {calView==="month"&&<MonthView slots={slots} monthDate={calDate} onSelectDay={d=>{setCalDate(d);setCalView("day");}}/>}
                </div>
                <BookingPanel selected={selectedSlot} venueId={venue?.id} onSave={data=>console.log("save",data)} onRefresh={()=>window.location.reload()}/>
              </div>
            </div>
          )}
          {tab==="matchend"&&<MatchEndTab match={activeMatch} onDone={()=>setTab("calendar")}/>}
          {tab==="shop"&&<ShopTab ownerUnlocked={ownerUnlocked}/>}
          {tab==="finance"&&<FinanceTab venue={venue}/>}
          {tab==="booking"&&(
            <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,padding:24,maxWidth:600}}>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.green,textTransform:"uppercase",marginBottom:6}}>การจองทั้งหมด</div>
              <div style={{fontSize:13,color:C.sub,textAlign:"center",padding:"24px 0"}}>รายการจองทั้งหมดจะแสดงเมื่อเชื่อมกับ Supabase</div>
            </div>
          )}
        </main>
      </div>

      {showPin&&<OwnerPin onSuccess={()=>{setOwnerUnlocked(true);setShowPin(false);setTab("finance");}} onCancel={()=>setShowPin(false)}/>}
      {showScanner&&<QRScanner onResult={id=>{setShowScanner(false);setScanId(id);}} onClose={()=>setShowScanner(false)}/>}
      {scanId&&<ScanResult playerId={scanId} onClose={()=>setScanId(null)}/>}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}*{box-sizing:border-box}input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:0.6;cursor:pointer}input[type="time"]{color-scheme:dark}`}</style>
    </div>
  );
}
