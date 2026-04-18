import { useState, useEffect, useRef } from "react";
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

const OWNER_PIN = "198400";

/* ═══════════════ SHARED UI ═══════════════ */
const Wordmark = ({size="md"}) => {
  const fs = size==="sm"?14:17;
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
      <div style={{width:1.5,height:size==="sm"?22:28,background:`linear-gradient(180deg,${C.green} 0%,rgba(16,212,132,0.05) 100%)`,borderRadius:2}}/>
      <div style={{display:"flex",flexDirection:"column",gap:2}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <span style={{fontSize:fs,fontWeight:900,letterSpacing:1.5,color:C.text,lineHeight:1}}>SQUAD</span>
          <div style={{padding:"2px 7px",border:`1px solid rgba(16,212,132,0.55)`,borderRadius:3}}>
            <span style={{fontSize:fs,fontWeight:900,letterSpacing:1.5,color:C.green,lineHeight:1}}>HUB</span>
          </div>
        </div>
        <div style={{fontSize:6,fontWeight:600,letterSpacing:3,color:C.muted,textTransform:"uppercase"}}>Partner Portal</div>
      </div>
    </div>
  );
};

const Tag = ({children,color=C.green}) => (
  <span style={{fontSize:11,fontWeight:800,padding:"3px 9px",borderRadius:4,background:`${color}18`,color,border:`1px solid ${color}40`,letterSpacing:.5}}>{children}</span>
);

const Btn = ({children,onClick,ghost,danger,disabled,style={}}) => (
  <button onClick={disabled?undefined:onClick} disabled={disabled}
    style={{padding:"11px 18px",borderRadius:8,fontSize:14,fontWeight:800,border:ghost?`1px solid ${C.border}`:danger?`1px solid ${C.red}40`:`1px solid ${C.green}`,cursor:disabled?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:ghost?"transparent":danger?`rgba(239,68,68,0.1)`:`linear-gradient(135deg,#059669,${C.green})`,color:ghost?C.sub:danger?C.red:"#001a0d",opacity:disabled?.4:1,transition:"all .2s",letterSpacing:.3,...style}}>{children}</button>
);

const MetricCard = ({icon,value,label,foot,footColor,highlight}) => (
  <div style={{background:highlight?C.greenDim:C.surface,border:`1px solid ${highlight?C.borderHi:C.border}`,borderRadius:14,padding:"16px 18px"}}>
    <div style={{fontSize:20,marginBottom:8}}>{icon}</div>
    <div style={{fontSize:26,fontWeight:900,color:highlight?C.greenBr:C.text,lineHeight:1}}>{value}</div>
    <div style={{fontSize:10,fontWeight:800,letterSpacing:1.5,color:C.sub,marginTop:5,textTransform:"uppercase"}}>{label}</div>
    {foot&&<div style={{fontSize:12,color:footColor||C.sub,marginTop:3,fontWeight:700}}>{foot}</div>}
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
      const {error:authErr} = await supabase.auth.signInWithPassword({
        email:email.trim().toLowerCase(), password,
      });
      if(authErr){setError("Email หรือ Password ไม่ถูกต้อง");setLoading(false);return;}
      const {data:venue} = await supabase.from("venues").select("*")
        .eq("owner_email",email.trim().toLowerCase()).single();
      onSuccess(venue);
    } catch(e){setError("เกิดข้อผิดพลาด ลองใหม่");setLoading(false);}
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',system-ui,sans-serif",padding:16}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><Wordmark/></div>
          <div style={{fontSize:13,color:C.sub,letterSpacing:1}}>เข้าสู่ระบบจัดการสนาม</div>
        </div>
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:20,padding:28}}>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Email</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              placeholder="sone@squadhub.ai" type="email"
              style={{width:"100%",background:C.surface2,border:`1px solid ${error?C.red:C.border}`,borderRadius:10,padding:"12px 14px",fontSize:15,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:22}}>
            <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Password</div>
            <input value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              placeholder="••••••••" type="password"
              style={{width:"100%",background:C.surface2,border:`1px solid ${error?C.red:C.border}`,borderRadius:10,padding:"12px 14px",fontSize:15,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          {error&&<div style={{fontSize:13,color:C.red,fontWeight:700,marginBottom:14,textAlign:"center"}}>{error}</div>}
          <Btn onClick={handleLogin} disabled={loading||!email.trim()||!password.trim()} style={{width:"100%",padding:14,fontSize:15}}>
            {loading?"กำลังเข้าสู่ระบบ...":"เข้าสู่ระบบ →"}
          </Btn>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════ OWNER PIN GATE ═══════════════ */
const OwnerPinGate = ({onSuccess,onCancel}) => {
  const [pin,setPin] = useState("");
  const [error,setError] = useState(false);
  const [shake,setShake] = useState(false);

  const handleKey = (val) => {
    if(val==="del"){setPin(p=>p.slice(0,-1));setError(false);return;}
    if(pin.length>=6)return;
    const next = pin+val;
    setPin(next);
    if(next.length===6){
      if(next===OWNER_PIN){onSuccess();}
      else{setShake(true);setError(true);setTimeout(()=>{setPin("");setShake(false);setError(false);},800);}
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:20,padding:"32px 28px",width:320,textAlign:"center",animation:shake?"shake .4s":"none"}}>
        <div style={{fontSize:20,marginBottom:8}}>👑</div>
        <div style={{fontSize:16,fontWeight:900,color:C.text,marginBottom:4}}>Owner Access</div>
        <div style={{fontSize:13,color:C.sub,marginBottom:24}}>ใส่ PIN เพื่อดูข้อมูลการเงิน</div>
        <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:28}}>
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} style={{width:14,height:14,borderRadius:"50%",background:i<pin.length?(error?C.red:C.green):"rgba(255,255,255,0.12)",transition:"background .15s"}}/>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
          {["1","2","3","4","5","6","7","8","9","","0","del"].map((k,i)=>(
            <button key={i} onClick={()=>k!==""&&handleKey(k)}
              style={{height:56,borderRadius:12,fontSize:k==="del"?18:22,fontWeight:800,fontFamily:"inherit",background:k===""?"transparent":k==="del"?"rgba(255,255,255,0.04)":C.surface2,border:k===""?"none":`1px solid ${C.border}`,color:k==="del"?C.sub:C.text,cursor:k===""?"default":"pointer"}}>
              {k==="del"?"⌫":k}
            </button>
          ))}
        </div>
        {error&&<div style={{fontSize:13,color:C.red,fontWeight:700,marginBottom:12}}>PIN ไม่ถูกต้อง</div>}
        <button onClick={onCancel} style={{fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>ยกเลิก</button>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  );
};

/* ═══════════════ QR SCANNER ═══════════════ */
const QRScanner = ({onResult,onClose}) => {
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const [scanning,setScanning] = useState(false);
  const [error,setError] = useState("");

  useEffect(()=>{
    const script = document.createElement("script");
    script.src = "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";
    script.onload = () => startScanner();
    script.onerror = () => setError("ไม่สามารถโหลด QR Scanner ได้");
    document.head.appendChild(script);
    return () => {
      stopScanner();
      if(document.head.contains(script)) document.head.removeChild(script);
    };
  },[]);

  const startScanner = () => {
    if(!window.Html5Qrcode||!scannerRef.current)return;
    const scanner = new window.Html5Qrcode("qr-reader");
    html5QrRef.current = scanner;
    setScanning(true);
    scanner.start(
      {facingMode:"environment"},
      {fps:10,qrbox:{width:220,height:220}},
      (text)=>{
        stopScanner();
        onResult(text);
      },
      ()=>{}
    ).catch(()=>setError("ไม่สามารถเปิดกล้องได้ กรุณาอนุญาต permission"));
  };

  const stopScanner = () => {
    if(html5QrRef.current){
      html5QrRef.current.stop().catch(()=>{});
      html5QrRef.current = null;
    }
    setScanning(false);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
      <div style={{background:C.bg2,border:`1px solid ${C.borderHi}`,borderRadius:20,padding:20,width:"100%",maxWidth:380}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div>
            <div style={{fontSize:16,fontWeight:900,color:C.text}}>🔲 Scan Player QR</div>
            <div style={{fontSize:12,color:C.sub,marginTop:2}}>ให้ผู้เล่นเปิด SQUAD HUB → กด "QR ของฉัน"</div>
          </div>
          <button onClick={()=>{stopScanner();onClose();}} style={{background:"rgba(255,255,255,0.06)",border:"none",color:C.sub,fontSize:13,padding:"4px 10px",borderRadius:6,cursor:"pointer"}}>✕</button>
        </div>

        <div id="qr-reader" ref={scannerRef} style={{width:"100%",borderRadius:12,overflow:"hidden",background:C.bg,minHeight:240,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {!scanning&&!error&&<div style={{fontSize:13,color:C.muted}}>กำลังเปิดกล้อง...</div>}
          {error&&<div style={{fontSize:13,color:C.red,padding:20,textAlign:"center"}}>{error}</div>}
        </div>

        <div style={{marginTop:14,fontSize:12,color:C.muted,textAlign:"center"}}>
          ส่องกล้องไปที่ QR code บนหน้าจอผู้เล่น
        </div>
      </div>
    </div>
  );
};

/* ═══════════════ SCAN RESULT ═══════════════ */
const ScanResult = ({playerId,onCheckin,onClose}) => {
  const [player,setPlayer] = useState(null);
  const [loading,setLoading] = useState(true);
  const [done,setDone] = useState(false);

  useEffect(()=>{
    (async()=>{
      const {data} = await supabase.from("players").select("*").eq("id",playerId).single();
      setPlayer(data); setLoading(false);
    })();
  },[playerId]);

  const handleCheckin = async () => {
    setDone(true);
    onCheckin(player);
  };

  if(loading) return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
      <div style={{fontSize:14,color:C.sub}}>กำลังโหลดข้อมูลผู้เล่น...</div>
    </div>
  );

  if(!player) return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
      <div style={{background:C.bg2,border:`1px solid ${C.red}40`,borderRadius:20,padding:24,width:"100%",maxWidth:360,textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:12}}>❌</div>
        <div style={{fontSize:16,fontWeight:900,color:C.red,marginBottom:8}}>ไม่พบผู้เล่น</div>
        <div style={{fontSize:13,color:C.sub,marginBottom:20}}>QR code ไม่ถูกต้องหรือหมดอายุ</div>
        <Btn ghost onClick={onClose} style={{width:"100%"}}>สแกนใหม่</Btn>
      </div>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}>
      <div style={{background:C.bg2,border:`1px solid ${done?C.borderHi:C.border}`,borderRadius:20,padding:24,width:"100%",maxWidth:380,transition:"all .3s"}}>
        {done ? (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:48,marginBottom:12}}>✅</div>
            <div style={{fontSize:18,fontWeight:900,color:C.green,marginBottom:6}}>Check-in สำเร็จ!</div>
            <div style={{fontSize:14,color:C.sub,marginBottom:20}}>{player.display_name} เข้าสนามแล้ว</div>
            <Btn ghost onClick={onClose} style={{width:"100%"}}>สแกนคนต่อไป</Btn>
          </div>
        ) : (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:800,color:C.green,letterSpacing:1.5,textTransform:"uppercase"}}>ผลการสแกน</div>
              <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"none",color:C.sub,fontSize:13,padding:"3px 9px",borderRadius:6,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,padding:"14px",background:C.greenDim,border:`1px solid ${C.borderHi}`,borderRadius:14}}>
              <div style={{width:52,height:52,clipPath:"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",background:`rgba(139,92,246,0.15)`,border:`2px solid #8b5cf6`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900,color:"#8b5cf6",flexShrink:0}}>
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
              {[
                {icon:"✓",label:"จองแล้ว",color:C.green},
                {icon:"✓",label:"ชำระแล้ว",color:C.green},
                {icon:player.tier||"Bronze",label:"Tier",color:C.amber},
              ].map((item,i)=>(
                <div key={i} style={{background:"rgba(255,255,255,0.03)",border:`1px solid rgba(255,255,255,0.06)`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                  <div style={{fontSize:16,fontWeight:900,color:item.color}}>{item.icon}</div>
                  <div style={{fontSize:9,color:C.muted,fontWeight:800,letterSpacing:1,textTransform:"uppercase",marginTop:3}}>{item.label}</div>
                </div>
              ))}
            </div>
            <button onClick={handleCheckin}
              style={{width:"100%",padding:14,borderRadius:12,border:"none",background:`linear-gradient(135deg,#059669,${C.green})`,color:"#001a0d",fontSize:15,fontWeight:900,cursor:"pointer",letterSpacing:.3}}>
              ✅ Check-in เข้าสนาม
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ═══════════════ SCHEDULE TAB ═══════════════ */
const ScheduleTab = ({venue,slots,onMatchEnd}) => {
  const [showOffline,setShowOffline] = useState(false);
  const [offName,setOffName] = useState("");
  const [offTime,setOffTime] = useState("20:00");
  const [offPrice,setOffPrice] = useState("1500");

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.sub,textTransform:"uppercase"}}>ตารางวันนี้</div>
        <button onClick={()=>setShowOffline(!showOffline)}
          style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.sub,fontSize:13,fontWeight:700,cursor:"pointer"}}>
          + บันทึกออฟไลน์
        </button>
      </div>

      {showOffline&&(
        <div style={{background:C.bg2,border:`1px solid rgba(251,191,36,0.2)`,borderRadius:14,padding:16,marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:800,color:C.amber,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>⚠ บันทึกออฟไลน์ — ไม่ได้ Stats/XP</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
            {[
              {label:"ชื่อผู้จอง",val:offName,set:setOffName,ph:"คุณบอย",type:"text"},
              {label:"เวลา",val:offTime,set:setOffTime,ph:"",type:"time"},
              {label:"ราคา ฿",val:offPrice,set:setOffPrice,ph:"1500",type:"text"},
            ].map((f,i)=>(
              <div key={i}>
                <div style={{fontSize:10,color:C.sub,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{f.label}</div>
                <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
                  style={{width:"100%",background:C.surface2,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 10px",fontSize:14,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
          <Btn ghost onClick={()=>setShowOffline(false)} style={{width:"100%"}}>บันทึก</Btn>
        </div>
      )}

      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"90px 1fr 110px 90px 110px",padding:"11px 20px",borderBottom:`1px solid rgba(255,255,255,0.06)`}}>
          {["เวลา","รายการ","ช่องทาง","ยอด",""].map((h,i)=>(
            <div key={i} style={{fontSize:10,fontWeight:800,letterSpacing:1.5,color:C.muted,textTransform:"uppercase",textAlign:i>=3?"right":"left"}}>{h}</div>
          ))}
        </div>
        {slots.length===0&&(
          <div style={{textAlign:"center",padding:"32px 0",color:C.sub,fontSize:14}}>ยังไม่มี slot วันนี้</div>
        )}
        {slots.map((s,i)=>(
          <div key={s.id||i} style={{display:"grid",gridTemplateColumns:"90px 1fr 110px 90px 110px",padding:"15px 20px",alignItems:"center",borderBottom:i<slots.length-1?`1px solid rgba(255,255,255,0.04)`:undefined,background:s.status==="live"?"rgba(16,185,129,0.04)":undefined}}>
            <div>
              <div style={{fontSize:16,fontWeight:900,fontStyle:"italic",color:s.status==="live"?C.greenBr:C.text}}>{s.time}</div>
              <div style={{fontSize:11,color:C.muted,fontWeight:700,marginTop:2}}>2 HRS</div>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                <span style={{fontSize:14,fontWeight:800,color:s.status==="available"?C.muted:C.text}}>{s.name||"ว่าง"}</span>
                {s.status==="live"&&<span style={{fontSize:10,fontWeight:900,padding:"2px 8px",borderRadius:99,background:"rgba(16,185,129,0.18)",color:C.greenBr,border:`1px solid rgba(16,185,129,0.3)`}}>LIVE</span>}
                {s.status==="filling"&&<span style={{fontSize:10,fontWeight:900,padding:"2px 8px",borderRadius:99,background:"rgba(251,191,36,0.12)",color:C.amber,border:`1px solid rgba(251,191,36,.2)`}}>กำลังเติม</span>}
              </div>
              {s.total_players&&(
                <div style={{display:"flex",gap:3,marginTop:6,alignItems:"center"}}>
                  {Array.from({length:s.total_players}).map((_,pi)=>(
                    <div key={pi} style={{width:7,height:7,borderRadius:"50%",background:pi<(s.players||0)?C.green:"rgba(255,255,255,0.1)"}}/>
                  ))}
                  <span style={{fontSize:11,color:C.sub,marginLeft:4}}>{s.players||0}/{s.total_players}</span>
                </div>
              )}
            </div>
            <div>
              {s.source==="platform"
                ?<Tag color={C.green}>Platform</Tag>
                :<Tag color={C.sub}>Offline</Tag>}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:14,fontWeight:900,color:s.amount>0?C.text:C.muted}}>{s.amount>0?`฿${s.amount.toLocaleString()}`:"—"}</div>
            </div>
            <div style={{textAlign:"right"}}>
              {s.status==="live"&&(
                <button onClick={()=>onMatchEnd(s)}
                  style={{fontSize:12,fontWeight:800,padding:"6px 12px",borderRadius:8,border:`1px solid ${C.borderHi}`,background:C.greenDim,color:C.green,cursor:"pointer"}}>
                  ยืนยันจบ
                </button>
              )}
              {s.status==="available"&&(
                <button style={{fontSize:12,fontWeight:700,padding:"6px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.muted,cursor:"pointer"}}>บล็อก</button>
              )}
              {(s.status==="ended"||s.status==="filling")&&(
                <button style={{fontSize:12,fontWeight:700,padding:"6px 12px",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.sub,cursor:"pointer"}}>ดู</button>
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
    <div style={{background:C.bg2,border:`1px solid ${C.borderHi}`,borderRadius:16,padding:28,textAlign:"center",maxWidth:500}}>
      <div style={{fontSize:36,marginBottom:14}}>✅</div>
      <div style={{fontSize:17,fontWeight:900,color:C.green,marginBottom:8}}>ส่งแจ้งกัปตันแล้ว!</div>
      <div style={{fontSize:13,color:C.sub,lineHeight:1.9,marginBottom:22}}>LINE Bot กำลังส่งฟอร์มสรุปให้กัปตันแต่ละทีม<br/>กัปตันสรุปผล → AI บันทึก Stats + XP อัตโนมัติ</div>
      <Btn ghost onClick={onDone} style={{width:"100%"}}>กลับหน้าหลัก</Btn>
    </div>
  );

  return (
    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,padding:24,maxWidth:500}}>
      <div style={{fontSize:11,fontWeight:800,color:C.green,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>ยืนยันแมตช์จบ</div>
      <div style={{fontSize:19,fontWeight:900,color:C.text,marginBottom:6}}>{match?.name||"Match"}</div>
      <div style={{fontSize:13,color:C.sub,marginBottom:20}}>{match?.time||"—"} · {match?.players||0} ผู้เล่น</div>
      <div style={{background:C.greenDim,border:`1px solid ${C.borderHi}`,borderRadius:12,padding:"14px 16px",marginBottom:22}}>
        <div style={{fontSize:12,color:C.greenBr,lineHeight:1.9,fontWeight:700}}>
          หลังกดยืนยัน:<br/>
          <span style={{color:C.sub,fontWeight:400}}>LINE Bot → แจ้งกัปตันแต่ละทีม → กัปตันส่งสรุป → AI บันทึก Stats + XP</span>
        </div>
      </div>
      <Btn onClick={handleConfirm} disabled={loading} style={{width:"100%",padding:14,fontSize:15}}>
        {loading?"กำลังส่ง...":"⏱ ยืนยันแมตช์จบ →"}
      </Btn>
    </div>
  );
};

/* ═══════════════ FINANCE TAB ═══════════════ */
const FinanceTab = ({venue}) => (
  <div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:12,marginBottom:22}}>
      <MetricCard icon="💰" value={`฿${(venue?.wallet_balance||0).toLocaleString()}`} label="ยอดคงเหลือ" foot="พร้อมถอน" footColor={C.green} highlight/>
      <MetricCard icon="📈" value="—" label="รายได้เดือนนี้" foot="เร็วๆนี้"/>
      <MetricCard icon="📊" value="—" label="Commission ที่จ่าย" foot="5% Founding rate" footColor={C.amber}/>
    </div>
    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,padding:22,textAlign:"center"}}>
      <div style={{fontSize:13,color:C.sub,marginBottom:16}}>ประวัติการเงินจะแสดงเมื่อมีข้อมูลจริง</div>
      <Btn ghost style={{margin:"0 auto",width:"fit-content"}}>ถอนเงิน →</Btn>
    </div>
  </div>
);

/* ═══════════════ MOBILE APP ═══════════════ */
const MobileApp = ({venue,slots,onMatchEnd,onLogout}) => {
  const [showScanner,setShowScanner] = useState(false);
  const [scanPlayerId,setScanPlayerId] = useState(null);
  const [mobileTab,setMobileTab] = useState("scan");

  const liveMatches = slots.filter(s=>s.status==="live");

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <header style={{padding:"12px 16px",background:"rgba(5,10,8,0.97)",backdropFilter:"blur(24px)",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
        <Wordmark size="sm"/>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:13,fontWeight:800,color:C.text}}>{venue?.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end",marginTop:2}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:C.green}}/>
            <span style={{fontSize:10,color:C.green}}>ออนไลน์</span>
          </div>
        </div>
      </header>

      <div style={{padding:"16px 16px 80px"}}>
        {mobileTab==="scan"&&(
          <div>
            <div style={{background:C.bg2,border:`1px solid ${C.borderHi}`,borderRadius:16,padding:20,textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:48,marginBottom:12}}>🔲</div>
              <div style={{fontSize:17,fontWeight:900,color:C.text,marginBottom:6}}>Scan Player QR</div>
              <div style={{fontSize:13,color:C.sub,marginBottom:20,lineHeight:1.7}}>ให้ผู้เล่นเปิด SQUAD HUB<br/>แล้วโชว์ "QR ของฉัน"</div>
              <Btn onClick={()=>setShowScanner(true)} style={{width:"100%",padding:14,fontSize:15}}>
                🔲 เปิดกล้องสแกน
              </Btn>
            </div>
            {liveMatches.length>0&&(
              <div>
                <div style={{fontSize:10,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>แมตช์ที่ต้องยืนยัน</div>
                {liveMatches.map(m=>(
                  <div key={m.id} style={{background:C.bg2,border:`1px solid ${C.borderHi}`,borderRadius:14,padding:"14px 16px",marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <div style={{width:6,height:6,borderRadius:"50%",background:C.green}}/>
                          <span style={{fontSize:14,fontWeight:900,color:C.green}}>{m.name}</span>
                        </div>
                        <div style={{fontSize:11,color:C.sub,marginTop:3}}>{m.time} · {m.players}/{m.total_players||14} คน</div>
                      </div>
                      <Tag color={C.green}>LIVE</Tag>
                    </div>
                    <button onClick={()=>onMatchEnd(m)}
                      style={{width:"100%",padding:11,borderRadius:9,border:`1px solid rgba(251,191,36,0.4)`,background:`rgba(251,191,36,0.08)`,color:C.amber,fontSize:13,fontWeight:800,cursor:"pointer"}}>
                      ⏱ ยืนยันแมตช์จบ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {mobileTab==="schedule"&&(
          <div>
            <div style={{fontSize:11,fontWeight:800,color:C.sub,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>ตารางวันนี้</div>
            {slots.map((s,i)=>(
              <div key={s.id||i} style={{background:C.bg2,border:`1px solid ${s.status==="live"?C.borderHi:C.border}`,borderRadius:12,padding:"13px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:16,fontWeight:900,color:s.status==="live"?C.green:C.text}}>{s.time}</div>
                  <div style={{fontSize:11,color:C.sub,marginTop:2}}>{s.name||"ว่าง"}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <Tag color={s.status==="live"?C.green:s.status==="filling"?C.amber:C.sub}>
                    {s.status==="live"?"LIVE":s.status==="filling"?"กำลังเติม":"ว่าง"}
                  </Tag>
                  {s.amount>0&&<div style={{fontSize:11,color:C.sub,marginTop:5}}>฿{s.amount.toLocaleString()}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(5,10,8,0.97)",backdropFilter:"blur(24px)",borderTop:`1px solid ${C.border}`,padding:"10px 0 20px",display:"flex",justifyContent:"space-around"}}>
        {[{id:"scan",icon:"🔲",label:"Scan"},{id:"schedule",icon:"📅",label:"ตาราง"}].map(n=>(
          <button key={n.id} onClick={()=>setMobileTab(n.id)}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 20px"}}>
            <span style={{fontSize:20}}>{n.icon}</span>
            <span style={{fontSize:9,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:mobileTab===n.id?C.green:C.sub}}>{n.label}</span>
          </button>
        ))}
      </nav>

      {showScanner&&(
        <QRScanner
          onResult={id=>{setShowScanner(false);setScanPlayerId(id);}}
          onClose={()=>setShowScanner(false)}/>
      )}
      {scanPlayerId&&(
        <ScanResult
          playerId={scanPlayerId}
          onCheckin={()=>{}}
          onClose={()=>setScanPlayerId(null)}/>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
};

/* ═══════════════ MAIN APP ═══════════════ */
export default function SquadPartner() {
  const [unlocked,setUnlocked] = useState(false);
  const [venue,setVenue] = useState(null);
  const [tab,setTab] = useState("schedule");
  const [slots,setSlots] = useState([]);
  const [activeMatch,setActiveMatch] = useState(null);
  const [showOwnerPin,setShowOwnerPin] = useState(false);
  const [ownerUnlocked,setOwnerUnlocked] = useState(false);
  const [showScanner,setShowScanner] = useState(false);
  const [scanPlayerId,setScanPlayerId] = useState(null);
  const [isMobile,setIsMobile] = useState(window.innerWidth<768);

  useEffect(()=>{
    const fn = () => setIsMobile(window.innerWidth<768);
    window.addEventListener("resize",fn);
    return ()=>window.removeEventListener("resize",fn);
  },[]);

  useEffect(()=>{
    if(!venue)return;
    (async()=>{
      const today = new Date().toISOString().split("T")[0];
      const {data} = await supabase.from("slots").select("*")
        .eq("venue_id",venue.id).gte("date",today).lte("date",today).order("start_time");
      if(data) setSlots(data.map(s=>({
        id:s.id, time:s.start_time?.slice(0,5)||"—", end:s.end_time?.slice(0,5)||"—",
        name:s.match_id?`MATCH #SQ-${s.match_id}`:"ว่าง",
        players:0, total_players:s.max_players||14,
        source:s.match_id?"platform":"offline",
        amount:s.price_per_player?s.price_per_player*(s.max_players||14):0,
        status:s.status==="open"?"available":s.status==="full"?"full":"live",
        venue_id:venue.id,
      })));
    })();
  },[venue]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUnlocked(false); setVenue(null); setSlots([]); setOwnerUnlocked(false);
  };

  const handleMatchEnd = (match) => { setActiveMatch(match); setTab("matchend"); };

  if(!unlocked) return <VenueLogin onSuccess={v=>{setVenue(v);setUnlocked(true);}}/>;
  if(isMobile) return <MobileApp venue={venue} slots={slots} onMatchEnd={handleMatchEnd} onLogout={handleLogout}/>;

  const navItems = [
    {id:"schedule",icon:"📅",label:"ตารางสนาม"},
    {id:"matchend",icon:"⏱️",label:"ยืนยันแมตช์จบ",badge:slots.filter(s=>s.status==="live").length||null},
    {id:"booking",icon:"📋",label:"การจองทั้งหมด"},
    {id:"finance",icon:"💰",label:"รายได้ & กระเป๋า",ownerOnly:true},
  ];

  const liveCount = slots.filter(s=>s.status==="live").length;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',system-ui,sans-serif"}}>

      {/* SIDEBAR */}
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
            const isOwnerLocked = n.ownerOnly&&!ownerUnlocked;
            return (
              <button key={n.id}
                onClick={()=>{
                  if(isOwnerLocked){setShowOwnerPin(true);return;}
                  setTab(n.id);
                }}
                style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",borderRadius:10,fontSize:14,fontWeight:700,color:tab===n.id?C.green:isOwnerLocked?C.muted:C.sub,background:tab===n.id?C.greenDim:"none",border:tab===n.id?`1px solid ${C.borderHi}`:"1px solid transparent",cursor:"pointer",width:"100%",textAlign:"left",transition:"all .15s",marginBottom:2,opacity:isOwnerLocked?.6:1}}>
                <span style={{opacity:tab===n.id?1:.7}}>{n.icon}</span>
                <span style={{flex:1}}>{n.label}</span>
                {n.badge>0&&<span style={{fontSize:11,fontWeight:900,padding:"1px 7px",borderRadius:99,background:"rgba(251,191,36,.15)",color:C.amber,border:"1px solid rgba(251,191,36,.25)"}}>{n.badge}</span>}
                {isOwnerLocked&&<span style={{fontSize:11}}>🔒</span>}
              </button>
            );
          })}
        </nav>
        <div style={{padding:"10px 12px 8px",margin:"0 8px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:8,marginRight:8,marginLeft:8}}>
          <div style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:.5,marginBottom:2}}>เข้าสู่ระบบในฐานะ</div>
          <div style={{fontSize:13,fontWeight:800,color:ownerUnlocked?C.amber:C.sub}}>{ownerUnlocked?"👑 เจ้าของ":"👤 Staff"}</div>
        </div>
        <div style={{padding:"12px 8px",borderTop:`1px solid ${C.border}`}}>
          <button onClick={handleLogout}
            style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:10,fontSize:13,fontWeight:700,color:C.muted,background:"none",border:"1px solid transparent",cursor:"pointer",width:"100%",textAlign:"left"}}>
            ↩ ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{marginLeft:220,flex:1,display:"flex",flexDirection:"column"}}>
        <header style={{position:"sticky",top:0,height:56,background:"rgba(5,10,8,0.96)",backdropFilter:"blur(24px)",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 26px",zIndex:90}}>
          <div>
            <div style={{fontSize:16,fontWeight:900,color:C.text,textTransform:"uppercase",letterSpacing:.3}}>
              {navItems.find(n=>n.id===tab)?.label||"Dashboard"}
            </div>
            <div style={{fontSize:12,color:C.sub,marginTop:1}}>
              {new Date().toLocaleDateString("th-TH",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{background:C.surface2,border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 16px",textAlign:"right"}}>
              <div style={{fontSize:9,fontWeight:800,color:C.sub,letterSpacing:1.2,textTransform:"uppercase"}}>ยอดคงเหลือ</div>
              <div style={{fontSize:16,fontWeight:900,color:C.text}}>฿{(venue?.wallet_balance||0).toLocaleString()}</div>
            </div>
            <button onClick={()=>setShowScanner(true)}
              style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:10,background:`linear-gradient(135deg,#059669,${C.green})`,border:"none",color:"#001a0d",fontSize:14,fontWeight:900,cursor:"pointer",letterSpacing:.3}}>
              🔲 Scan Player
            </button>
          </div>
        </header>

        <main style={{padding:26}}>
          {/* Metrics */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",gap:12,marginBottom:24}}>
            <MetricCard icon="🏟️" value={slots.length||0} label="Slot วันนี้" foot={`${liveCount} กำลัง live`} footColor={liveCount>0?C.green:C.sub} highlight/>
            <MetricCard icon="👥" value={slots.reduce((a,s)=>a+(s.players||0),0)} label="ผู้เล่นวันนี้" foot="จากทุก slot"/>
            <MetricCard icon="💰" value={`฿${slots.reduce((a,s)=>a+(s.amount||0),0).toLocaleString()}`} label="รายได้วันนี้" foot="Platform only"/>
            <MetricCard icon="📊" value={slots.length>0?`${Math.round(slots.filter(s=>s.status!=="available").length/slots.length*100)}%`:"—"} label="Utilization" foot={`${venue?.field_count||1} สนาม`}/>
          </div>

          {tab==="schedule"&&<ScheduleTab venue={venue} slots={slots} onMatchEnd={handleMatchEnd}/>}
          {tab==="matchend"&&<MatchEndTab match={activeMatch} onDone={()=>setTab("schedule")}/>}
          {tab==="finance"&&<FinanceTab venue={venue}/>}
          {tab==="booking"&&(
            <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:16,padding:24,maxWidth:600}}>
              <div style={{fontSize:11,fontWeight:800,letterSpacing:2,color:C.green,textTransform:"uppercase",marginBottom:6}}>การจองทั้งหมดวันนี้</div>
              <div style={{fontSize:13,color:C.sub,textAlign:"center",padding:"24px 0"}}>รายการจองทั้งหมดจะแสดงเมื่อเชื่อมกับ Supabase</div>
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      {showOwnerPin&&(
        <OwnerPinGate
          onSuccess={()=>{setOwnerUnlocked(true);setShowOwnerPin(false);setTab("finance");}}
          onCancel={()=>setShowOwnerPin(false)}/>
      )}
      {showScanner&&(
        <QRScanner
          onResult={id=>{setShowScanner(false);setScanPlayerId(id);}}
          onClose={()=>setShowScanner(false)}/>
      )}
      {scanPlayerId&&(
        <ScanResult
          playerId={scanPlayerId}
          onCheckin={()=>{}}
          onClose={()=>setScanPlayerId(null)}/>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}*{box-sizing:border-box}`}</style>
    </div>
  );
}
