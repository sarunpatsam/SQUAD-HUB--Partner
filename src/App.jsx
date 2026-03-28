import { useState, useEffect } from "react";
 
/* ═══════════════════════════════════════════
   SQUAD PARTNER v3
   ───────────────────────────────────────────
   Production setup:
   1. npm install @supabase/supabase-js
   2. สร้างไฟล์ src/supabase.js แล้วใส่ key จริง
   3. uncommment import supabase ด้านล่าง
   4. ลบ mock supabase ออก
   ═══════════════════════════════════════════ */
 
import { supabase } from "./supabase";
 
/* ═══════════════ DESIGN TOKENS ═══════════════ */
const C = {
  bg: "#070e0b", bg2: "#0d1812",
  surface: "rgba(255,255,255,0.05)", surface2: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.09)", borderHi: "rgba(16,185,129,0.32)",
  green: "#10b981", greenBr: "#34d399", greenDim: "rgba(16,185,129,0.1)",
  text: "#edfdf4", sub: "#9ca3af", muted: "#6b7280",
  red: "#ef4444", blue: "#60a5fa", amber: "#fbbf24",
};
 
/* ═══════════════ PIN LOGIN ═══════════════ */
const CORRECT_PIN = "198400"; // เปลี่ยน PIN ตรงนี้ได้เลย
 
const Tag = ({ children, color = C.green, bg, border }) => (
  <span style={{
    fontSize: 17, fontWeight: 800, letterSpacing: ".6px",
    padding: "3px 9px", borderRadius: 99, textTransform: "uppercase",
    display: "inline-flex", alignItems: "center", gap: 3,
    color, background: bg || `${color}1a`, border: `1px solid ${border || color + "40"}`,
  }}>{children}</span>
);
 
const HexLogo = () => (
  <div style={{ position: "relative", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ position: "absolute" }}>
      <polygon points="14,1.5 25.5,8 25.5,20 14,26.5 2.5,20 2.5,8" stroke={C.green} strokeWidth="1.5" fill="rgba(16,185,129,0.08)" />
    </svg>
    <svg width="13" height="13" viewBox="0 0 13 13" fill={C.green} style={{ position: "relative", zIndex: 1 }}>
      <path d="M7.5 1L2 7.5h4.5L5 12l6-7H6.5L7.5 1z" />
    </svg>
  </div>
);
 
const PinLogin = ({ onSuccess }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
 
  const handleKey = (val) => {
    if (val === "del") { setPin(p => p.slice(0,-1)); setError(false); return; }
    if (pin.length >= 6) return;
    const next = pin + val;
    setPin(next);
    if (next.length === 6) {
      if (next === CORRECT_PIN) {
        onSuccess();
      } else {
        setShake(true); setError(true);
        setTimeout(() => { setPin(""); setShake(false); setError(false); }, 800);
      }
    }
  };
 
  const keys = ["1","2","3","4","5","6","7","8","9","","0","del"];
 
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <div style={{ background:C.bg2, border:`1px solid ${C.border}`, borderRadius:24, padding:"40px 36px", width:320, textAlign:"center", animation:shake?"shake .4s":"none" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:28 }}>
          <HexLogo />
          <div style={{ fontSize:20, fontWeight:900, fontStyle:"italic", color:C.text }}>SQUAD<span style={{ color:C.green }}>PARTNER</span></div>
        </div>
        <div style={{ fontSize:16, fontWeight:700, color:C.sub, marginBottom:24 }}>ใส่ PIN 6 หลัก</div>
        <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:32 }}>
          {Array.from({length:6}).map((_,i) => (
            <div key={i} style={{ width:16, height:16, borderRadius:"50%", background: i<pin.length?(error?C.red:C.green):"rgba(255,255,255,0.12)", transition:"background .15s", boxShadow:i<pin.length&&!error?`0 0 8px ${C.green}80`:"none" }} />
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {keys.map((k,i) => (
            <button key={i} onClick={()=>k!==""&&handleKey(k)} style={{ height:64, borderRadius:14, fontSize:k==="del"?20:26, fontWeight:800, fontFamily:"inherit", background:k===""?"transparent":k==="del"?"rgba(255,255,255,0.04)":C.surface, border:k===""?"none":`1px solid ${C.border}`, color:k==="del"?C.sub:C.text, cursor:k===""?"default":"pointer" }}>
              {k==="del"?"⌫":k}
            </button>
          ))}
        </div>
        {error&&<div style={{ marginTop:16, fontSize:14, color:C.red, fontWeight:700 }}>PIN ไม่ถูกต้อง ลองใหม่</div>}
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  );
};
 
/* ═══════════════ CONFIG ═══════════════ */
const N8N_WEBHOOK_MATCH_END = "https://primary-production-e855.up.railway.app/webhook/match-end";
const VENUE_ID = 1; // S-One Football Club
 
/* ═══════════════ MOCK DATA (Fallback) ═══════════════ */
const MOCK_VENUE = { id: 1, name: "S-One Football Club" };
 
const MOCK_BOOKINGS = [
  { id: 1, time: "14:00", end: "16:00", duration: 2, name: "ทีมออฟฟิศ", players: 6, source: "offline", amount: 1200, status: "ended", field: 1 },
  { id: 2, time: "16:00", end: "18:00", duration: 2, name: "MATCH #SQ-0824-A", players: 12, total_players: 14, source: "platform", amount: 1800, status: "live", field: 1, captain_a: "กัปตัน", captain_b: "นิว" },
  { id: 3, time: "18:00", end: "20:00", duration: 2, name: "MATCH #SQ-0825-B", players: 8, total_players: 14, source: "platform", amount: 1200, status: "filling", field: 1 },
  { id: 4, time: "20:00", end: "22:00", duration: 2, name: "คุณบอย · เหมาสนาม", players: 0, source: "offline", amount: 1500, status: "upcoming", field: 1 },
  { id: 5, time: "22:00", end: "24:00", duration: 2, name: "", players: 0, source: "none", amount: 0, status: "available", field: 1 },
];
 
/* ═══════════════ SHARED COMPONENTS ═══════════════ */
 
const Pip = ({ filled }) => (
  <div style={{
    width: 8, height: 8, borderRadius: "50%",
    background: filled ? C.green : "rgba(255,255,255,0.1)",
    boxShadow: filled ? `0 0 4px ${C.green}80` : "none",
  }} />
);
 
const PipBar = ({ filled, total }) => (
  <div style={{ display: "flex", gap: 2.5, flexWrap: "wrap", alignItems: "center", marginTop: 5 }}>
    {Array.from({ length: total }).map((_, i) => <Pip key={i} filled={i < filled} />)}
    <span style={{ fontSize: 18, color: C.sub, marginLeft: 4 }}>{filled}/{total}</span>
  </div>
);
 
const NavItem = ({ icon, label, active, badge, badgeColor, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 9, padding: "9px 12px",
    borderRadius: 10, fontSize: 18, fontWeight: 700,
    color: active ? C.green : C.sub,
    background: active ? C.greenDim : "none",
    border: active ? `1px solid ${C.borderHi}` : "1px solid transparent",
    cursor: "pointer", width: "100%", textAlign: "left",
    transition: "all .15s", marginBottom: 2,
  }}>
    <span style={{ opacity: active ? 1 : .7, flexShrink: 0 }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {badge && (
      <span style={{
        fontSize: 18, fontWeight: 900, padding: "1px 7px", borderRadius: 99,
        background: badgeColor === "amber" ? "rgba(251,191,36,.15)" : C.green,
        color: badgeColor === "amber" ? C.amber : "#000",
        border: badgeColor === "amber" ? "1px solid rgba(251,191,36,.25)" : "none",
      }}>{badge}</span>
    )}
  </button>
);
 
const MetricCard = ({ icon, value, label, foot, footColor, highlight }) => (
  <div style={{
    background: highlight ? C.greenDim : C.surface,
    border: `1px solid ${highlight ? C.borderHi : C.border}`,
    borderRadius: 14, padding: 14,
  }}>
    <div style={{ fontSize: 17, marginBottom: 4 }}>{icon}</div>
    <div style={{ fontSize: 24, fontWeight: 900, color: highlight ? C.greenBr : C.text, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: ".5px", color: C.sub, marginTop: 4, textTransform: "uppercase" }}>{label}</div>
    {foot && <div style={{ fontSize: 16, color: footColor || C.sub, marginTop: 3 }}>{foot}</div>}
  </div>
);
 
/* ═══════════════ MODAL ═══════════════ */
const Modal = ({ open, onClose, title, subtitle, children, maxWidth = 460 }) => {
  if (!open) return null;
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}>
      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, width: "100%", maxWidth, maxHeight: "85vh", overflowY: "auto" }}>
        <button onClick={onClose} style={{ float: "right", background: "none", border: "none", color: C.sub, cursor: "pointer", fontSize: 18 }}>✕</button>
        <div style={{ fontSize: 16, fontWeight: 900, color: C.text, marginBottom: 3, fontStyle: "italic" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 18, color: C.sub, marginBottom: 20 }}>{subtitle}</div>}
        {children}
      </div>
    </div>
  );
};
 
/* ═══════════════ FORM INPUT ═══════════════ */
const FormRow = ({ label, children }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1, color: C.sub, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
    {children}
  </div>
);
 
const Input = ({ ...props }) => (
  <input {...props} style={{
    width: "100%", background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: "9px 12px", fontSize: 18, fontWeight: 700,
    color: C.text, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
    ...props.style,
  }}
    onFocus={e => e.target.style.borderColor = C.borderHi}
    onBlur={e => e.target.style.borderColor = C.border}
  />
);
 
const Select = ({ children, ...props }) => (
  <select {...props} style={{
    width: "100%", background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: "9px 12px", fontSize: 18, fontWeight: 700,
    color: C.text, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
    ...props.style,
  }}>{children}</select>
);
 
const GreenBtn = ({ children, onClick, style = {} }) => (
  <button onClick={onClick} style={{
    width: "100%", padding: "11px 16px", borderRadius: 12,
    background: `linear-gradient(135deg,#059669,${C.green})`,
    border: "none", fontSize: 18, fontWeight: 800, color: "#fff",
    cursor: "pointer", boxShadow: "0 4px 18px rgba(16,185,129,.22)",
    letterSpacing: ".3px", ...style,
  }}>{children}</button>
);
 
/* ═══════════════ SCHEDULE TAB ═══════════════ */
const ScheduleTab = ({ lang, onSwitchTab }) => {
  const [activeField, setActiveField] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [offlineWarn, setOfflineWarn] = useState(false);
  const [bookingSource, setBookingSource] = useState("platform");
 
  const bookings = MOCK_BOOKINGS.filter(b => b.field === activeField);
  const th = lang === "th";
  if (!unlocked) return <PinLogin onSuccess={() => setUnlocked(true)} />;
 
  const slotStyle = (b) => {
    const base = {
      display: "grid", gridTemplateColumns: "68px 1fr 100px 84px 68px",
      gap: 10, padding: "13px 16px", borderBottom: `1px solid ${C.border}`,
      alignItems: "center", cursor: "pointer", transition: "background .12s",
    };
    if (b.status === "live") return { ...base, borderLeft: `3px solid ${C.green}`, background: "rgba(16,185,129,.07)" };
    if (b.status === "filling") return { ...base, borderLeft: `3px solid ${C.green}`, background: "rgba(16,185,129,.04)" };
    if (b.status === "offline" || b.source === "offline") return { ...base, borderLeft: `3px solid ${C.muted}`, background: "rgba(255,255,255,.018)" };
    if (b.status === "ended" || b.status === "available") return { ...base, opacity: .38 };
    return base;
  };
 
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "start" }}>
        {/* LEFT */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 5 }}>
              {[1, 2, 3].map(f => (
                <button key={f} onClick={() => setActiveField(f)} style={{
                  padding: "5px 13px", borderRadius: 99, fontSize: 17, fontWeight: 800,
                  border: `1px solid ${activeField === f ? C.green : C.border}`,
                  background: activeField === f ? C.green : "transparent",
                  color: activeField === f ? "#000" : C.sub, cursor: "pointer",
                }}>
                  {th ? `สนาม ${f}` : `Field ${f}`}
                </button>
              ))}
            </div>
            <button onClick={() => setShowAddModal(true)} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "6px 13px",
              borderRadius: 99, background: C.surface2, border: `1px solid ${C.border}`,
              fontSize: 17, fontWeight: 800, color: C.sub, cursor: "pointer",
            }}>
              + {th ? "เพิ่มการจอง" : "Add Booking"}
            </button>
          </div>
 
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "68px 1fr 100px 84px 68px", gap: 10, padding: "9px 16px", background: "rgba(255,255,255,.025)", borderBottom: `1px solid ${C.border}` }}>
              {[th ? "เวลา" : "Time", th ? "รายการ" : "Booking", th ? "ช่องทาง" : "Source", th ? "ยอด" : "Amt", ""].map((h, i) => (
                <div key={i} style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1.2, color: C.muted, textTransform: "uppercase", textAlign: i >= 3 ? "right" : "left" }}>{h}</div>
              ))}
            </div>
 
            {bookings.map((b, idx) => (
              <div key={b.id} style={{ ...slotStyle(b) }} onMouseEnter={e => e.currentTarget.style.background = b.status === "live" ? "rgba(16,185,129,.1)" : "rgba(255,255,255,.025)"} onMouseLeave={e => e.currentTarget.style.background = slotStyle(b).background || ""}>
                {/* Time */}
                <div>
                  <div style={{ fontSize: 17, fontWeight: 900, fontStyle: "italic", color: b.status === "live" ? C.greenBr : C.text }}>{b.time}</div>
                  <div style={{ fontSize: 18, color: C.muted, fontWeight: 700, marginTop: 1 }}>{b.duration} HRS</div>
                </div>
 
                {/* Name */}
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: b.status === "available" ? C.sub : C.text, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 5 }}>
                    {b.status === "available" ? (th ? "ว่าง" : "Available") : b.name}
                    {b.status === "live" && <span style={{ fontSize: 17, fontWeight: 900, padding: "2px 7px", borderRadius: 99, background: "rgba(16,185,129,.18)", color: C.greenBr, border: `1px solid rgba(16,185,129,.3)`, animation: "livepulse 1.5s infinite" }}>LIVE</span>}
                    {b.status === "filling" && <span style={{ fontSize: 17, fontWeight: 900, padding: "2px 7px", borderRadius: 99, background: "rgba(251,191,36,.12)", color: C.amber, border: `1px solid rgba(251,191,36,.2)` }}>{th ? "กำลังเติม" : "Filling"}</span>}
                    {b.source === "offline" && b.status !== "available" && <span style={{ fontSize: 17, fontWeight: 900, padding: "2px 7px", borderRadius: 99, background: "rgba(255,255,255,.06)", color: C.muted, border: `1px solid ${C.border}` }}>{th ? "ออฟไลน์" : "Offline"}</span>}
                  </div>
                  {b.source === "offline" && b.status !== "available" && (
                    <div style={{ fontSize: 16, color: C.muted, marginTop: 3 }}>⚠️ {th ? "ไม่ได้ Stats Card · ไม่ได้ XP" : "No Stats Card · No XP"}</div>
                  )}
                  {b.status === "available" && <div style={{ fontSize: 16, color: C.muted, marginTop: 3 }}>{th ? "ยังไม่มีการจอง" : "No booking yet"}</div>}
                  {b.total_players && <PipBar filled={b.players} total={b.total_players} />}
                  {b.status !== "available" && !b.total_players && <div style={{ fontSize: 16, color: C.sub, marginTop: 3 }}>{b.players} {th ? "คน" : "players"}</div>}
                </div>
 
                {/* Source tag */}
                <div style={{ textAlign: "center" }}>
                  {b.source === "platform" && <Tag color={C.green}>Platform</Tag>}
                  {b.source === "offline" && <Tag color={C.sub} bg="rgba(255,255,255,.06)" border={C.border}>{th ? "ออฟไลน์" : "Offline"}</Tag>}
                  {b.source === "none" && <Tag color={C.sub} bg="rgba(255,255,255,.06)" border={C.border}>{th ? "ว่าง" : "Open"}</Tag>}
                </div>
 
                {/* Amount */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: b.status === "live" ? C.greenBr : b.amount === 0 ? C.muted : C.text }}>
                    {b.amount > 0 ? `฿${b.amount.toLocaleString()}` : "—"}
                  </div>
                </div>
 
                {/* Action */}
                <div style={{ textAlign: "right" }}>
                  {b.status === "live" && (
                    <button onClick={() => onSwitchTab("matchend")} style={{ fontSize: 16, fontWeight: 800, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.borderHi}`, background: "transparent", color: C.green, cursor: "pointer" }}>
                      {th ? "ยืนยันจบ" : "End Match"}
                    </button>
                  )}
                  {b.status === "offline" && b.source === "offline" && b.status !== "ended" && (
                    <button onClick={() => setShowTeamModal(true)} style={{ fontSize: 16, fontWeight: 800, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.sub, cursor: "pointer" }}>
                      {th ? "จัดทีม" : "Team"}
                    </button>
                  )}
                  {b.status === "upcoming" && b.source === "offline" && (
                    <button onClick={() => setShowTeamModal(true)} style={{ fontSize: 16, fontWeight: 800, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.sub, cursor: "pointer" }}>
                      {th ? "จัดทีม" : "Team"}
                    </button>
                  )}
                  {(b.status === "ended" || b.status === "filling") && (
                    <button style={{ fontSize: 16, fontWeight: 800, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.sub, cursor: "pointer" }}>
                      {th ? "ดู" : "View"}
                    </button>
                  )}
                  {b.status === "available" && (
                    <button style={{ fontSize: 16, fontWeight: 800, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.sub, cursor: "pointer" }}>
                      {th ? "บล็อก" : "Block"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* RIGHT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Platform nudge */}
          <div style={{ background: "linear-gradient(135deg,rgba(16,185,129,.08),rgba(16,185,129,.04))", border: `1px solid ${C.borderHi}`, borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.greenBr, marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
              ⚡ {th ? "แนะนำลูกค้าจอง Platform" : "Recommend Platform Booking"}
            </div>
            {[
              [th ? "ได้ Player Stats Card" : "Gets Player Stats Card", th ? "บันทึกสถิติอัตโนมัติ" : "Auto-tracked stats"],
              [th ? "ได้ XP & Level Up" : "Earns XP & Levels Up", th ? "ยิ่งเล่นยิ่งได้สิทธิ์" : "More play = more perks"],
              ["AI Matchmaking", th ? "จับคู่แมตช์อัตโนมัติ" : "Auto match pairing"],
              [th ? "สนามได้ Analytics" : "Venue gets analytics", th ? "รู้จัก player base" : "Know your player base"],
            ].map(([bold, sub], i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, flexShrink: 0, marginTop: 4 }} />
                <div style={{ fontSize: 17, color: C.sub, lineHeight: 1.5 }}>
                  <strong style={{ color: C.text, fontWeight: 800 }}>{bold}</strong> — {sub}
                </div>
              </div>
            ))}
            <GreenBtn style={{ marginTop: 12 }}>
              + {th ? "สร้างลิงก์จองผ่าน Platform →" : "Create Platform Booking Link →"}
            </GreenBtn>
          </div>
 
          {/* Quick offline log */}
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18 }}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: C.green, textTransform: "uppercase", marginBottom: 14 }}>
              {th ? "บันทึกออฟไลน์" : "Log Offline Booking"}
            </div>
            <div style={{ background: "rgba(255,255,255,.04)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", marginBottom: 12, fontSize: 16, color: C.muted, lineHeight: 1.6 }}>
              ⚠️ {th ? "ออฟไลน์ไม่ได้ Stats Card, XP หรือสิทธิ์ใดๆ" : "Offline bookings have no platform perks"}
            </div>
            <FormRow label={th ? "ชื่อผู้จอง" : "Customer name"}><Input placeholder={th ? "เช่น คุณบอย" : "e.g. John"} /></FormRow>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <FormRow label={th ? "เวลา" : "Time"}><Input type="time" defaultValue="22:00" /></FormRow>
              <FormRow label={th ? "ราคา ฿" : "Price ฿"}><Input placeholder="1500" /></FormRow>
            </div>
            <button style={{ width: "100%", padding: 11, borderRadius: 12, background: C.surface2, border: `1px solid ${C.border}`, fontSize: 18, fontWeight: 800, color: C.sub, cursor: "pointer", marginTop: 2 }}>
              {th ? "บันทึกออฟไลน์" : "Save Offline"}
            </button>
          </div>
 
          {/* Pending matches */}
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: 18 }}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: C.green, textTransform: "uppercase", marginBottom: 14 }}>
              {th ? "แมตช์รอยืนยัน" : "Matches Pending"}
            </div>
            {[
              { id: "SQ-0824-A", time: "16:00–18:00", status: "live" },
              { id: "SQ-0823-A", time: "14:00–16:00", status: "ended" },
            ].map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.status === "live" ? C.green : C.muted, boxShadow: m.status === "live" ? `0 0 5px ${C.green}80` : "none", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: m.status === "ended" ? C.sub : C.text }}>MATCH #{m.id}</div>
                  <div style={{ fontSize: 16, color: C.sub }}>{m.time}</div>
                </div>
                {m.status === "live"
                  ? <><Tag color={C.amber}>{th ? "รอจบ" : "Ongoing"}</Tag><button onClick={() => onSwitchTab("matchend")} style={{ fontSize: 16, fontWeight: 800, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.sub, cursor: "pointer", marginLeft: 4 }}>{th ? "ยืนยัน" : "Confirm"}</button></>
                  : <Tag color={C.green}>{th ? "จบแล้ว" : "Ended"}</Tag>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* ADD BOOKING MODAL */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title={th ? "เพิ่มการจองใหม่" : "New Booking"} subtitle={th ? "เลือกช่องทางการจอง" : "Choose booking source"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {["platform", "offline"].map(src => (
            <button key={src} onClick={() => { setBookingSource(src); setOfflineWarn(src === "offline"); }} style={{
              padding: "11px 10px", borderRadius: 13, cursor: "pointer", textAlign: "center", transition: "all .15s",
              border: `1px solid ${bookingSource === src && src === "platform" ? C.borderHi : bookingSource === src ? "rgba(255,255,255,.2)" : C.border}`,
              background: bookingSource === src && src === "platform" ? C.greenDim : bookingSource === src ? "rgba(255,255,255,.03)" : "transparent",
              color: bookingSource === src && src === "platform" ? C.green : C.sub,
            }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{src === "platform" ? "⚡" : "📋"}</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{src === "platform" ? "Platform" : (th ? "ออฟไลน์" : "Offline")}</div>
              <div style={{ fontSize: 18, opacity: .6, marginTop: 2 }}>
                {src === "platform" ? (th ? "ได้ Stats Card + XP" : "Gets Stats + XP") : (th ? "ไม่มีสิทธิ์พิเศษ" : "No platform perks")}
              </div>
            </button>
          ))}
        </div>
        {offlineWarn && (
          <div style={{ background: "rgba(255,255,255,.04)", border: `1px solid ${C.border}`, borderRadius: 11, padding: "11px 13px", marginBottom: 14, fontSize: 17, color: C.muted, lineHeight: 1.7 }}>
            ⚠️ {th ? "การจองออฟไลน์ไม่ได้ Stats Card, XP หรือสิทธิ์ใดๆ บน Platform" : "Offline bookings have no Stats Card, XP or platform perks"}
          </div>
        )}
        <FormRow label={th ? "ชื่อผู้จอง" : "Name"}><Input placeholder={th ? "คุณบอย" : "John"} /></FormRow>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FormRow label={th ? "สนาม" : "Field"}><Select><option>1</option><option>2</option><option>3</option></Select></FormRow>
          <FormRow label={th ? "เวลา" : "Time"}><Input type="time" defaultValue="20:00" /></FormRow>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FormRow label={th ? "ชั่วโมง" : "Hours"}><Select><option>1</option><option selected>2</option><option>3</option></Select></FormRow>
          <FormRow label={th ? "ราคา ฿" : "Price ฿"}><Input defaultValue="1500" /></FormRow>
        </div>
        <GreenBtn style={{ marginTop: 4 }} onClick={() => setShowAddModal(false)}>
          {th ? "บันทึกการจอง" : "Save Booking"}
        </GreenBtn>
      </Modal>
 
      {/* TEAM BUILDER MODAL */}
      <Modal open={showTeamModal} onClose={() => setShowTeamModal(false)} title={th ? "จัดทีม · คุณบอย" : "Team Setup · Khun Boy"} subtitle={th ? "จองออฟไลน์ 20:00–22:00 · สนาม 1" : "Offline 20:00–22:00 · Field 1"}>
        <div style={{ background: C.greenDim, border: `1px solid ${C.borderHi}`, borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: C.greenBr, marginBottom: 6 }}>💡 {th ? "ให้ผู้เล่นได้สิทธิ์พิเศษ" : "Give players platform perks"}</div>
          <div style={{ fontSize: 17, color: C.sub, marginBottom: 10, lineHeight: 1.6 }}>
            {th ? "ถ้าผู้เล่นดาวน์โหลด SQUAD HUB และแสดง QR — ระบบ link Stats อัตโนมัติ" : "If players download SQUAD HUB and show QR — stats auto-link"}
          </div>
          <GreenBtn style={{ padding: 9, fontSize: 11 }}>📲 {th ? "สร้าง QR แชร์ให้ลูกค้า →" : "Create QR to share →"}</GreenBtn>
        </div>
        {[{ color: C.red, name: "ทีม A" }, { color: C.blue, name: "ทีม B" }].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 11, padding: "10px 13px", marginBottom: 7 }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, background: t.color, flexShrink: 0 }} />
            <input defaultValue={t.name} style={{ flex: 1, background: "transparent", border: "none", fontSize: 16, fontWeight: 800, color: C.text, outline: "none", fontFamily: "inherit" }} />
            <span style={{ fontSize: 16, color: C.sub }}>0/7</span>
            <button style={{ fontSize: 16, fontWeight: 800, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.borderHi}`, background: C.greenDim, color: C.green, cursor: "pointer" }}>+</button>
          </div>
        ))}
        <GreenBtn style={{ marginTop: 14 }}>✓ {th ? "บันทึกทีม" : "Save Teams"}</GreenBtn>
      </Modal>
    </div>
  );
};
 
/* ═══════════════ MATCH END TAB ═══════════════ */
const MatchEndTab = ({ lang }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [capADone, setCapADone] = useState(false);
  const [capBDone, setCapBDone] = useState(false);
  const th = lang === "th";
  if (!unlocked) return <PinLogin onSuccess={() => setUnlocked(true)} />;
 
  const handleConfirm = async (matchId) => {
    setConfirmed(true);
    try {
      await fetch(N8N_WEBHOOK_MATCH_END, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ match_id: matchId || 3, venue_id: VENUE_ID }),
      });
    } catch(e) {
      console.error("Webhook error:", e);
    }
  };
 
  const progress = [capADone, capBDone].filter(Boolean).length;
 
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: 22, maxWidth: 580 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: C.green, textTransform: "uppercase", marginBottom: 4 }}>
          {th ? "ยืนยันแมตช์จบ" : "Confirm Match End"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: C.text, fontStyle: "italic" }}>
          {th ? "สนามกดจบ — ผู้เล่นอัพ Stats เอง" : "Venue confirms end — Players update stats"}
        </div>
        <div style={{ fontSize: 18, color: C.sub, marginTop: 5, lineHeight: 1.7 }}>
          {th
            ? "หลังกด \"ยืนยันแมตช์จบ\" ระบบส่ง LINE Message หากัปตันแต่ละทีมอัตโนมัติ กัปตันสรุปผล — AI บันทึก Stats + XP ให้ทุกคน"
            : "After confirming, LINE Bot notifies each captain automatically. Captain submits summary — AI records Stats + XP for everyone."}
        </div>
      </div>
 
      {/* Live match row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
        borderRadius: 14, border: `1px solid ${confirmed ? C.borderHi : C.border}`,
        background: confirmed ? "rgba(16,185,129,.04)" : C.surface, marginBottom: 10,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}99`, flexShrink: 0, animation: "pulse 1.5s infinite" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: C.text }}>MATCH #SQ-0824-A</div>
          <div style={{ fontSize: 17, color: C.sub, marginTop: 3 }}>
            16:00–18:00 · Field 1 · 12 {th ? "ผู้เล่น" : "players"} ·{" "}
            <span style={{ color: C.amber, fontWeight: 700 }}>
              {th ? "กัปตัน: กัปตัน (A), นิว (B)" : "Captains: Captain (A), Niw (B)"}
            </span>
          </div>
        </div>
        {!confirmed ? (
          <button onClick={handleConfirm} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
            borderRadius: 11, background: `linear-gradient(135deg,#059669,${C.green})`,
            border: "none", fontSize: 18, fontWeight: 800, color: "#fff",
            cursor: "pointer", boxShadow: "0 4px 16px rgba(16,185,129,.25)", whiteSpace: "nowrap",
          }}>
            ✓ {th ? "ยืนยันแมตช์จบ" : "Confirm Match End"}
          </button>
        ) : (
          <button style={{ padding: "9px 18px", borderRadius: 11, background: C.surface, border: `1px solid ${C.border}`, fontSize: 18, fontWeight: 800, color: C.sub, cursor: "default" }}>
            {th ? "✓ ส่งแล้ว" : "✓ Sent"}
          </button>
        )}
      </div>
 
      {/* Wait bar (shows after confirm) */}
      {confirmed && (
        <div style={{ background: "rgba(16,185,129,.06)", border: `1px solid ${C.borderHi}`, borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.green, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            🤖 {th ? "LINE Bot ส่งแล้ว · รอกัปตันตอบกลับ" : "LINE Bot sent · Waiting for captains"}
          </div>
          {[
            { av: "ก", name: th ? "กัปตัน" : "Captain", team: "A", done: capADone },
            { av: "น", name: th ? "นิว" : "Niw", team: "B", done: capBDone },
          ].map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(16,185,129,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: C.green }}>{c.av}</div>
              <div style={{ flex: 1, fontSize: 17, fontWeight: 700, color: C.text }}>{c.name} <span style={{ fontSize: 18, color: C.sub }}>· {th ? "ทีม" : "Team"} {c.team}</span></div>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.amber, background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.2)", padding: "1px 6px", borderRadius: 99 }}>🎖️ {th ? "กัปตัน" : "Captain"}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: c.done ? C.green : C.muted }}>
                {c.done ? `✓ ${th ? "ตอบแล้ว" : "Replied"}` : (th ? "รอตอบ..." : "Waiting...")}
              </span>
            </div>
          ))}
          <div style={{ height: 4, background: "rgba(255,255,255,.06)", borderRadius: 99, marginTop: 12, overflow: "hidden" }}>
            <div style={{ height: "100%", background: `linear-gradient(90deg,#059669,${C.green})`, borderRadius: 99, width: `${progress * 50}%`, transition: "width .6s ease" }} />
          </div>
          <div style={{ fontSize: 16, color: progress === 2 ? C.green : C.sub, marginTop: 5, textAlign: "right", fontWeight: progress === 2 ? 800 : 400 }}>
            {progress === 2 ? `✅ ${th ? "Stats & XP อัพแล้วทุกคน!" : "Stats & XP updated for all!"}` : `${progress}/2 ${th ? "ตอบแล้ว" : "replied"}`}
          </div>
        </div>
      )}
 
      {/* Already ended match */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, opacity: .45 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.muted, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: C.sub }}>MATCH #SQ-0823-A</div>
          <div style={{ fontSize: 17, color: C.sub, marginTop: 3 }}>14:00–16:00 · <span style={{ color: C.green, fontWeight: 700 }}>✓ {th ? "กัปตันตอบแล้ว · Stats อัพแล้ว" : "Captain replied · Stats updated"}</span></div>
        </div>
        <button style={{ padding: "9px 18px", borderRadius: 11, background: C.surface, border: `1px solid ${C.border}`, fontSize: 18, fontWeight: 800, color: C.sub, cursor: "default" }}>
          ✓ {th ? "จบแล้ว" : "Ended"}
        </button>
      </div>
 
      {/* How it works */}
      <div style={{ marginTop: 20, background: "rgba(255,255,255,.03)", border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1.5, color: C.sub, textTransform: "uppercase", marginBottom: 12 }}>
          {th ? "ระบบทำงานยังไง" : "How it works"}
        </div>
        {[
          [th ? "สนามกด \"ยืนยันแมตช์จบ\"" : "Venue taps \"Confirm Match End\"", th ? "แค่กดปุ่มเดียว สนามไม่ต้องกรอกอะไรเพิ่ม" : "One tap — venue enters nothing else"],
          [th ? "LINE Bot ส่งหากัปตันอัตโนมัติ" : "LINE Bot notifies captains", th ? "n8n trigger ทันที ทั้ง 2 ทีม" : "n8n triggers instantly for all teams"],
          [th ? "กัปตันตอบสั้นๆ ใน LINE" : "Captain replies briefly in LINE", th ? "\"A:2,1 B:1,2 MVP:A\" — 10 ตัวอักษรจบ" : "\"A:2,1 B:1,2 MVP:A\" — done in seconds"],
          [th ? "AI อัพ Stats + XP ให้ทุกคนอัตโนมัติ" : "AI auto-updates Stats + XP for all", th ? "ไม่มีใครต้องทำอะไรอีก" : "No one needs to do anything else"],
        ].map(([title, sub], i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.greenDim, border: `1px solid ${C.borderHi}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: C.green, flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: 17, color: C.sub, paddingTop: 2, lineHeight: 1.6 }}>
              <strong style={{ color: i === 3 ? C.green : C.text }}>{title}</strong><br />{sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
 
/* ═══════════════ SCAN MODAL ═══════════════ */
const ScanModal = ({ open, onClose, lang }) => (
  <Modal open={open} onClose={onClose} title={lang === "th" ? "สแกน QR ผู้เล่น" : "Scan Player QR"} subtitle={lang === "th" ? "ให้ผู้เล่นแสดง QR จาก SQUAD HUB App" : "Ask player to show QR from SQUAD HUB App"} maxWidth={340}>
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 160, height: 160, border: `2px dashed ${C.borderHi}`, borderRadius: 16, margin: "20px auto", display: "flex", alignItems: "center", justifyContent: "center", background: C.greenDim }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke={C.green} strokeWidth="2" opacity=".6">
          <rect x="6" y="6" width="15" height="15" rx="2" />
          <rect x="27" y="6" width="15" height="15" rx="2" />
          <rect x="6" y="27" width="15" height="15" rx="2" />
          <rect x="27" y="27" width="15" height="15" rx="2" />
        </svg>
      </div>
      <div style={{ fontSize: 17, color: C.sub }}>{lang === "th" ? "กำลังรอสแกน..." : "Waiting for scan..."}</div>
    </div>
  </Modal>
);
 
/* ═══════════════ MAIN APP ═══════════════ */
export default function SquadPartner() {
  const [tab, setTab] = useState("schedule");
  const [lang, setLang] = useState("th");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
 
  const th = lang === "th";
  if (!unlocked) return <PinLogin onSuccess={() => setUnlocked(true)} />;
 
  const navItems = [
    { id: "schedule", icon: "📅", label: th ? "ตารางสนาม" : "Schedule", badge: "5" },
    { id: "booking", icon: "📋", label: th ? "การจองทั้งหมด" : "All Bookings", badge: "2", badgeColor: "amber" },
    { id: "matchend", icon: "⏱️", label: th ? "ยืนยันแมตช์จบ" : "Confirm Match End", badge: "1", badgeColor: "amber" },
    { id: "finance", icon: "💰", label: th ? "รายได้ & กระเป๋า" : "Revenue & Wallet" },
  ];
 
  const toolItems = [
    { id: "scan", icon: "🔲", label: th ? "สแกน QR ผู้เล่น" : "Scan Player QR", action: () => setShowScan(true) },
  ];
 
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans',system-ui,sans-serif" }}>
 
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 99 }} />
      )}
 
      {/* SIDEBAR */}
      <aside style={{
        width: 236, background: C.bg2, borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0,
        height: "100vh", zIndex: 100,
        transform: sidebarOpen ? "translateX(0)" : undefined,
      }}>
        {/* Logo */}
        <div style={{ padding: "16px 18px 13px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 9 }}>
          <HexLogo />
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-.3px", fontStyle: "italic", color: C.text }}>
              SQUAD<span style={{ color: C.green }}>PARTNER</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginTop: 1 }}>
              {th ? "ระบบจัดการสนาม" : "Venue Admin"}
            </div>
          </div>
        </div>
 
        {/* Venue info */}
        <div style={{ padding: "13px 18px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 5 }}>{MOCK_VENUE.name}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 18, fontWeight: 800, letterSpacing: ".8px", textTransform: "uppercase", color: C.green, background: C.greenDim, border: `1px solid ${C.borderHi}`, padding: "3px 9px", borderRadius: 99 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
            {th ? "ออนไลน์" : "Online"}
          </div>
        </div>
 
        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          <div style={{ padding: "10px 10px 3px", fontSize: 18, fontWeight: 800, letterSpacing: 1.8, color: C.muted, textTransform: "uppercase" }}>
            {th ? "จัดการ" : "Manage"}
          </div>
          {navItems.map(item => (
            <NavItem key={item.id} icon={item.icon} label={item.label} active={tab === item.id} badge={item.badge} badgeColor={item.badgeColor} onClick={() => { setTab(item.id); setSidebarOpen(false); }} />
          ))}
          <div style={{ padding: "10px 10px 3px", marginTop: 8, fontSize: 18, fontWeight: 800, letterSpacing: 1.8, color: C.muted, textTransform: "uppercase" }}>
            {th ? "เครื่องมือ" : "Tools"}
          </div>
          {toolItems.map(item => (
            <NavItem key={item.id} icon={item.icon} label={item.label} onClick={item.action} />
          ))}
        </nav>
      </aside>
 
      {/* MAIN */}
      <div style={{ marginLeft: 236, flex: 1, display: "flex", flexDirection: "column" }}>
 
        {/* Topbar */}
        <header style={{ position: "sticky", top: 0, left: 0, right: 0, height: 54, background: "rgba(7,14,11,.96)", backdropFilter: "blur(24px)", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", zIndex: 90 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.sub, padding: 4 }}>☰</button>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: C.text, fontStyle: "italic", textTransform: "uppercase", letterSpacing: ".3px" }}>
                {navItems.find(n => n.id === tab)?.label || ""}
              </div>
              <div style={{ fontSize: 16, color: C.sub, marginTop: 1 }}>
                {th ? "อาทิตย์ 15 มี.ค. 2026 · 3 สนาม" : "Sun 15 Mar 2026 · 3 Fields"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            {/* Lang toggle */}
            <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 99, overflow: "hidden", background: C.surface }}>
              {["th", "en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 10px", fontSize: 18, fontWeight: 800, background: lang === l ? C.greenDim : "transparent", border: "none", color: lang === l ? C.green : C.sub, cursor: "pointer", borderRadius: 99, letterSpacing: ".8px" }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            {/* Wallet */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 14px" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: 1.2, color: C.sub, textTransform: "uppercase" }}>{th ? "ยอดคงเหลือ" : "Balance"}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: C.text, fontStyle: "italic" }}>฿14,500</div>
              </div>
            </div>
            <button style={{ padding: "6px 13px", borderRadius: 99, background: C.greenDim, border: `1px solid ${C.borderHi}`, fontSize: 16, fontWeight: 800, color: C.green, cursor: "pointer" }}>
              {th ? "ถอนเงิน" : "Withdraw"}
            </button>
            <button onClick={() => setShowScan(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 15px", borderRadius: 13, background: `linear-gradient(135deg,#059669,${C.green})`, border: "none", fontSize: 17, fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: "0 4px 16px rgba(16,185,129,.28)" }}>
              🔲 {th ? "สแกนผู้เล่น" : "Scan Player"}
            </button>
          </div>
        </header>
 
        {/* Content */}
        <main style={{ padding: 26 }}>
          {/* Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10, marginBottom: 22 }}>
            <MetricCard icon="🏟️" value="24" label={th ? "จองวันนี้" : "Bookings Today"} foot={`+4 ${th ? "ใหม่" : "new"}`} footColor={C.green} highlight />
            <MetricCard icon="💰" value="฿9,600" label={th ? "รายได้วันนี้" : "Revenue Today"} foot="+฿1,200" footColor={C.green} />
            <MetricCard icon="⏳" value="฿4,200" label={th ? "รอถอน" : "Pending"} foot={th ? "พร้อมถอน" : "Ready"} footColor={C.amber} />
            <MetricCard icon="📊" value="78%" label={th ? "อัตราจอง" : "Utilization"} foot={`6/8 ${th ? "สล็อต" : "slots"}`} />
          </div>
 
          {/* Tab content */}
          {tab === "schedule" && <ScheduleTab lang={lang} onSwitchTab={setTab} />}
          {tab === "matchend" && <MatchEndTab lang={lang} />}
          {tab === "booking" && (
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: 22, maxWidth: 600 }}>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: C.green, textTransform: "uppercase", marginBottom: 6 }}>{th ? "การจองทั้งหมดวันนี้" : "All Bookings Today"}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}><Tag color={C.green}>Platform 3</Tag><Tag color={C.sub} bg="rgba(255,255,255,.06)" border={C.border}>{th ? "ออฟไลน์ 2" : "Offline 2"}</Tag></div>
              <div style={{ fontSize: 18, color: C.sub, textAlign: "center", padding: "24px 0" }}>{th ? "รายการจองทั้งหมดจะแสดงเมื่อเชื่อมกับ Supabase" : "Full booking list appears when connected to Supabase"}</div>
            </div>
          )}
          {tab === "finance" && (
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 18, padding: 22, maxWidth: 480 }}>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: C.green, textTransform: "uppercase", marginBottom: 14 }}>{th ? "รายได้และกระเป๋าเงิน" : "Revenue & Wallet"}</div>
              <div style={{ fontSize: 18, color: C.sub, textAlign: "center", padding: "24px 0" }}>{th ? "ระบบการเงินจะแสดงเมื่อเชื่อมกับ Supabase" : "Finance dashboard appears when connected to Supabase"}</div>
            </div>
          )}
        </main>
      </div>
 
      {/* Scan Modal */}
      <ScanModal open={showScan} onClose={() => setShowScan(false)} lang={lang} />
 
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:.45} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
