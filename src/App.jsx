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
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const handle = async () => {
    if(!email.trim()||!password.trim())return;
    setLoading(true);setError("");
    try {
      const {error:e}=await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password});
      if(e){setError("Email หรือ Password ไม่ถูกต้อง");setLoading(false);return;}
      const {data:v}=await supabase.from("venues").select("*").eq("owner_email",email.trim().toLowerCase()).single();
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
          <div style={{marginBottom:22}}>
            <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Password</div>
            <input value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="••••••••" type="password" style={inp}/>
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
const TIMES = ["10:00","12:00","14:00","16:00","18:00","20:00","22:00"];
const DAYS_TH = ["จ","อ","พ","พฤ","ศ","ส","อา"];

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

const DayView = ({fields,slots,date,onSelectSlot}) => {
  const fieldNames = fields.map((_,i)=>`สนาม ${i+1}`);
  return (
    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"}}>
      <div style={{display:"grid",gridTemplateColumns:`56px ${fieldNames.map(()=>"1fr").join(" ")}`,borderBottom:`1px solid rgba(255,255,255,0.06)`}}>
        <div style={{padding:"10px 8px"}}/>
        {fieldNames.map((f,i)=>(
          <div key={i} style={{padding:"10px 12px",fontSize:11,fontWeight:800,letterSpacing:1.5,color:C.muted,textTransform:"uppercase",borderLeft:`1px solid rgba(255,255,255,0.04)`}}>⚽ {f}</div>
        ))}
      </div>
      {TIMES.map(time=>(
        <div key={time} style={{display:"grid",gridTemplateColumns:`56px ${fieldNames.map(()=>"1fr").join(" ")}`,borderBottom:`1px solid rgba(255,255,255,0.04)`,minHeight:72}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:C.muted,fontStyle:"italic"}}>{time}</div>
          {fieldNames.map((_,fi)=>{
            const slot = slots.find(s=>s.time===time&&s.field===fi+1);
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
  return (
    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"}}>
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
      {TIMES.map(time=>(
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
    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"}}>
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

/* ═══ BOOKING PANEL ═══ */
const BookingPanel = ({selected,onSave}) => {
  const [type,setType]=useState("platform");
  const [name,setName]=useState("");
  const [time,setTime]=useState(selected?.time||"18:00");
  const [price,setPrice]=useState("1500");
  const [matchType,setMatchType]=useState("7v7");
  const inp={width:"100%",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",fontSize:14,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:12};
  return (
    <div style={{background:C.bg2,border:`1px solid ${C.borderHi}`,borderRadius:16,padding:20,position:"sticky",top:20}}>
      <div style={{fontSize:15,fontWeight:900,color:C.text,marginBottom:3}}>+ สร้างการจอง</div>
      <div style={{fontSize:12,color:C.sub,marginBottom:18}}>{selected?`${selected.field} · ${selected.time}`:"เลือก slot จาก calendar"}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
        {["platform","offline"].map(t=>(
          <button key={t} onClick={()=>setType(t)}
            style={{padding:"9px",borderRadius:8,fontSize:13,fontWeight:800,cursor:"pointer",textAlign:"center",border:`1px solid ${type===t?t==="platform"?"rgba(16,185,129,0.5)":"rgba(255,255,255,0.2)":C.border}`,background:type===t?t==="platform"?C.greenDim:"rgba(255,255,255,0.03)":"transparent",color:type===t?t==="platform"?C.green:C.text:C.sub,transition:"all .15s"}}>
            {t==="platform"?"⚡ Platform":"📋 Offline"}
          </button>
        ))}
      </div>
      {type==="offline"&&(
        <div style={{background:"rgba(251,191,36,0.06)",border:`1px solid rgba(251,191,36,0.2)`,borderRadius:8,padding:"9px 12px",fontSize:11,color:C.amber,marginBottom:14,lineHeight:1.6}}>
          ⚠ Offline ไม่ได้ Stats Card, XP หรือสิทธิ์บน Platform
        </div>
      )}
      <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>ชื่อผู้จอง</div>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder={type==="platform"?"Platform จัดการเอง":"คุณบอย"} style={inp}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div>
          <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>เวลาเริ่ม</div>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} style={{...inp,marginBottom:0}}/>
        </div>
        <div>
          <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>ราคา ฿</div>
          <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="1500" style={{...inp,marginBottom:0}}/>
        </div>
      </div>
      <div style={{marginTop:12,marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>ประเภทแมตช์</div>
        <select value={matchType} onChange={e=>setMatchType(e.target.value)} style={{...inp,color:C.text,marginBottom:0}}>
          <option value="7v7">7v7 · 14 คน</option>
          <option value="5v5">5v5 · 10 คน</option>
          <option value="6v6">6v6 · 12 คน</option>
          <option value="9v9">9v9 · 18 คน</option>
        </select>
      </div>
      <button onClick={()=>onSave({type,name,time,price,matchType})}
        style={{width:"100%",padding:13,borderRadius:10,border:"none",background:`linear-gradient(135deg,#059669,${C.green})`,color:"#001a0d",fontSize:14,fontWeight:900,cursor:"pointer",letterSpacing:.3}}>
        บันทึกการจอง →
      </button>
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
const MobileApp = ({venue,slots,onLogout}) => {
  const [mTab,setMTab]=useState("scan");
  const [showScanner,setShowScanner]=useState(false);
  const [scanId,setScanId]=useState(null);
  const [activeMatch,setActiveMatch]=useState(null);
  const liveSlots=slots.filter(s=>s.status==="live");
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
                    <button onClick={()=>setActiveMatch(s)}
                      style={{width:"100%",padding:11,borderRadius:9,border:`1px solid rgba(251,191,36,0.4)`,background:`rgba(251,191,36,0.08)`,color:C.amber,fontSize:13,fontWeight:800,cursor:"pointer"}}>
                      ⏱ ยืนยันแมตช์จบ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {mTab==="schedule"&&(
          <div>
            <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>ตารางวันนี้</div>
            {slots.map((s,i)=>(
              <div key={i} style={{background:C.bg2,border:`1px solid ${s.status==="live"?C.borderHi:C.border}`,borderRadius:12,padding:"13px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:16,fontWeight:900,color:s.status==="live"?C.green:C.text}}>{s.time}</div>
                  <div style={{fontSize:11,color:C.sub,marginTop:2}}>{s.name||"ว่าง"} · {s.players||0}/{s.total||14}</div>
                </div>
                <Tag color={s.status==="live"?C.green:s.status==="filling"?C.amber:C.sub}>
                  {s.status==="live"?"LIVE":s.status==="filling"?"กำลังเติม":"ว่าง"}
                </Tag>
              </div>
            ))}
          </div>
        )}
        {activeMatch&&<MatchEndTab match={activeMatch} onDone={()=>setActiveMatch(null)}/>}
      </div>
      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(5,10,8,0.97)",backdropFilter:"blur(24px)",borderTop:`1px solid ${C.border}`,padding:"10px 0 20px",display:"flex",justifyContent:"space-around"}}>
        {[{id:"scan",icon:"🔲",label:"Scan"},{id:"schedule",icon:"📅",label:"ตาราง"}].map(n=>(
          <button key={n.id} onClick={()=>setMTab(n.id)}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 20px"}}>
            <span style={{fontSize:20}}>{n.icon}</span>
            <span style={{fontSize:9,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:mTab===n.id?C.green:C.sub}}>{n.label}</span>
          </button>
        ))}
      </nav>
      {showScanner&&<QRScanner onResult={id=>{setShowScanner(false);setScanId(id);}} onClose={()=>setShowScanner(false)}/>}
      {scanId&&<ScanResult playerId={scanId} onClose={()=>setScanId(null)}/>}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
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
  if(isMobile)return<MobileApp venue={venue} slots={todaySlots} onLogout={handleLogout}/>;

  const navItems=[
    {id:"calendar",icon:"📅",label:"ตารางสนาม"},
    {id:"matchend",icon:"⏱️",label:"ยืนยันแมตช์จบ",badge:liveCount||null},
    {id:"booking",icon:"📋",label:"การจองทั้งหมด"},
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
            <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 16px",textAlign:"right"}}>
              <div style={{fontSize:9,fontWeight:800,color:C.sub,letterSpacing:1.2,textTransform:"uppercase"}}>ยอดคงเหลือ</div>
              <div style={{fontSize:16,fontWeight:900,color:C.text}}>฿{(venue?.wallet_balance||0).toLocaleString()}</div>
            </div>
            <button onClick={()=>setShowScanner(true)} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:10,background:`linear-gradient(135deg,#059669,${C.green})`,border:"none",color:"#001a0d",fontSize:14,fontWeight:900,cursor:"pointer"}}>🔲 Scan Player</button>
          </div>
        </header>

        <main style={{padding:26}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:12,marginBottom:22}}>
            <MetricCard icon="🏟️" value={todaySlots.length||0} label="Slot วันนี้" foot={`${liveCount} กำลัง live`} footColor={liveCount>0?C.green:C.sub} hi/>
            <MetricCard icon="👥" value={todaySlots.reduce((a,s)=>a+(s.players||0),0)} label="ผู้เล่นวันนี้" foot="จากทุก slot"/>
            <MetricCard icon="💰" value={`฿${todaySlots.reduce((a,s)=>a+(s.amount||0),0).toLocaleString()}`} label="รายได้วันนี้" foot="Platform only"/>
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

              <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16}}>
                <div>
                  {calView==="day"&&<DayView fields={fields} slots={todaySlots} date={calDate} onSelectSlot={setSelectedSlot}/>}
                  {calView==="week"&&<WeekView slots={slots} weekStart={weekStart} onSelectSlot={setSelectedSlot}/>}
                  {calView==="month"&&<MonthView slots={slots} monthDate={calDate} onSelectDay={d=>{setCalDate(d);setCalView("day");}}/>}
                </div>
                <BookingPanel selected={selectedSlot} onSave={data=>console.log("save",data)}/>
              </div>
            </div>
          )}
          {tab==="matchend"&&<MatchEndTab match={activeMatch} onDone={()=>setTab("calendar")}/>}
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
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}*{box-sizing:border-box}`}</style>
    </div>
  );
}
