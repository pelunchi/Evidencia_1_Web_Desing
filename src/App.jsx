import { useState, useEffect } from "react";

/* ─── GOOGLE FONTS ──────────────────────────────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #0D0F14;
      --surface:  #161921;
      --card:     #1E2330;
      --border:   #2A3040;
      --amber:    #F59E0B;
      --amber2:   #FCD34D;
      --red:      #EF4444;
      --green:    #22C55E;
      --blue:     #3B82F6;
      --cyan:     #06B6D4;
      --text:     #F1F5F9;
      --muted:    #64748B;
      --font-h:   'Barlow Condensed', sans-serif;
      --font-b:   'Barlow', sans-serif;
    }

    body { background: var(--bg); color: var(--text); font-family: var(--font-b); }

    ::-webkit-scrollbar { width: 6px; } 
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

    input, select, textarea {
      background: var(--bg);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 6px;
      padding: 10px 14px;
      font-family: var(--font-b);
      font-size: 14px;
      width: 100%;
      transition: border-color .2s;
      outline: none;
    }
    input:focus, select:focus, textarea:focus { border-color: var(--amber); }
    input::placeholder, textarea::placeholder { color: var(--muted); }
    select option { background: var(--surface); }

    button { cursor: pointer; font-family: var(--font-h); letter-spacing: .5px; border: none; border-radius: 6px; transition: all .15s; }

    @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes pulse  { 0%,100% { opacity:1; } 50% { opacity:.5; } }
    .fadein  { animation: fadeIn .3s ease; }
    .fadeup  { animation: fadeUp .35s ease; }
  `}</style>
);

/* ─── MOCK DATA ─────────────────────────────────────────────────────────── */
const STATUS_MAP = {
  ordered:    { label: "Ordenado",      color: "#F59E0B", bg: "#78350F22" },
  in_process: { label: "En Proceso",    color: "#3B82F6", bg: "#1E3A5F22" },
  in_route:   { label: "En Ruta",       color: "#8B5CF6", bg: "#3B0764 22" },
  delivered:  { label: "Entregado",     color: "#22C55E", bg: "#14532D22" },
};

const ROLES = ["Admin", "Ventas", "Almacén", "Compras", "Ruta"];

const MOCK_ORDERS = [
  { id:1, invoice:"F-0001", custNum:"C-101", custName:"Construcciones del Norte S.A.", date:"2024-06-01 09:15", address:"Blvd. Insurgentes 450, Culiacán", status:"delivered", notes:"Urgente – entregar antes de las 2pm", deleted:false,
    loadPhoto:"https://placehold.co/400x300/1E2330/F59E0B?text=📦+Carga", deliveryPhoto:"https://placehold.co/400x300/1E2330/22C55E?text=✅+Entregado",
    fiscal:"RFC: CDN901015AB1\nAv. Reforma 100, CDMX" },
  { id:2, invoice:"F-0002", custNum:"C-102", custName:"Materiales Pacífico", date:"2024-06-02 11:30", address:"Calle Hidalgo 78, Mazatlán", status:"in_route", notes:"", deleted:false,
    loadPhoto:"https://placehold.co/400x300/1E2330/8B5CF6?text=🚛+En+Ruta", deliveryPhoto:null,
    fiscal:"RFC: MPA870223CD5\nCalle Juárez 55, Mazatlán" },
  { id:3, invoice:"F-0003", custNum:"C-103", custName:"Grupo Edificador MX", date:"2024-06-03 08:00", address:"Av. López Mateos 200, Los Mochis", status:"in_process", notes:"Verificar varilla 3/8", deleted:false,
    loadPhoto:null, deliveryPhoto:null,
    fiscal:"RFC: GEM960710EF9\nAv. Obregón 33, Los Mochis" },
  { id:4, invoice:"F-0004", custNum:"C-104", custName:"Hdez y Asociados", date:"2024-06-04 14:45", address:"Calle Benito Juárez 12, Guamúchil", status:"ordered", notes:"", deleted:false,
    loadPhoto:null, deliveryPhoto:null,
    fiscal:"RFC: HEAJ780501GH2\nCalle 5 de Mayo 8, Guamúchil" },
  { id:5, invoice:"F-0005", custNum:"C-105", custName:"CIMSA Constructora", date:"2024-06-05 10:00", address:"Blvd. Zapata 900, Culiacán", status:"ordered", notes:"Cemento gris 50 sacos", deleted:false,
    loadPhoto:null, deliveryPhoto:null,
    fiscal:"RFC: CCI910830JK4\nResidencial del Valle, Culiacán" },
  { id:6, invoice:"F-0006", custNum:"C-101", custName:"Construcciones del Norte S.A.", date:"2024-05-20 09:00", address:"Blvd. Insurgentes 450, Culiacán", status:"delivered", notes:"Pedido cancelado parcialmente", deleted:true,
    loadPhoto:null, deliveryPhoto:null,
    fiscal:"RFC: CDN901015AB1\nAv. Reforma 100, CDMX" },
];

const MOCK_USERS = [
  { id:1, name:"Administrador",       username:"admin",    role:"Admin",    active:true  },
  { id:2, name:"Carlos Mendoza",      username:"cmendoza", role:"Ventas",   active:true  },
  { id:3, name:"Lupita Ramírez",      username:"lramirez", role:"Almacén",  active:true  },
  { id:4, name:"Jorge Soto",          username:"jsoto",    role:"Compras",  active:true  },
  { id:5, name:"Miguel Ángel Torres", username:"matorres", role:"Ruta",     active:true  },
  { id:6, name:"Sandra Villalba",     username:"svilalba", role:"Ventas",   active:false },
];

/* ─── SMALL COMPONENTS ──────────────────────────────────────────────────── */
const Badge = ({ status }) => {
  const s = STATUS_MAP[status] || { label: status, color: "#64748B", bg: "#1e293b" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px",
      borderRadius:20, background: s.bg || "#1e293b22", border:`1px solid ${s.color}44`,
      color: s.color, fontFamily:"var(--font-h)", fontSize:13, fontWeight:700, letterSpacing:.5,
      whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background: s.color }} />
      {s.label}
    </span>
  );
};

const RoleBadge = ({ role }) => {
  const colors = { Admin:"#F59E0B", Ventas:"#3B82F6", "Almacén":"#8B5CF6", Compras:"#06B6D4", Ruta:"#22C55E" };
  const c = colors[role] || "#64748B";
  return (
    <span style={{ padding:"3px 10px", borderRadius:20, background:`${c}22`,
      border:`1px solid ${c}44`, color:c, fontFamily:"var(--font-h)", fontSize:12, fontWeight:700 }}>
      {role}
    </span>
  );
};

const Btn = ({ children, onClick, variant="primary", size="md", fullWidth, style={}, disabled }) => {
  const styles = {
    primary:  { background: "var(--amber)",  color: "#000", fontWeight:800 },
    secondary:{ background: "var(--card)",   color: "var(--text)", border:"1px solid var(--border)" },
    danger:   { background: "#EF444418",     color: "#EF4444", border:"1px solid #EF444444" },
    ghost:    { background: "transparent",   color: "var(--muted)", border:"1px solid var(--border)" },
    success:  { background: "#22C55E18",     color: "#22C55E", border:"1px solid #22C55E44" },
  };
  const sizes = { sm:"6px 14px", md:"9px 20px", lg:"12px 28px" };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...styles[variant], padding: sizes[size], fontSize: size==="sm"?12:size==="lg"?16:14,
        fontFamily:"var(--font-h)", letterSpacing:.6, borderRadius:7, display:"inline-flex",
        alignItems:"center", gap:6, opacity: disabled?.8:1, width: fullWidth?"100%":undefined,
        justifyContent: fullWidth?"center":undefined, ...style }}
      onMouseEnter={e => { if(!disabled) e.currentTarget.style.filter="brightness(1.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter="brightness(1)"; }}>
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    {label && <label style={{ fontSize:12, fontWeight:600, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1 }}>{label}</label>}
    <input {...props} />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    {label && <label style={{ fontSize:12, fontWeight:600, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1 }}>{label}</label>}
    <select {...props}>{children}</select>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    {label && <label style={{ fontSize:12, fontWeight:600, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1 }}>{label}</label>}
    <textarea rows={3} style={{ resize:"vertical" }} {...props} />
  </div>
);

const Card = ({ children, style={} }) => (
  <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:12, padding:24, ...style }}>
    {children}
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div style={{ position:"fixed", inset:0, background:"#000A", zIndex:1000,
    display:"flex", alignItems:"center", justifyContent:"center", padding:24, animation:"fadeIn .2s" }}>
    <Card style={{ maxWidth:560, width:"100%", maxHeight:"90vh", overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <span style={{ fontFamily:"var(--font-h)", fontSize:22, fontWeight:800 }}>{title}</span>
        <button onClick={onClose} style={{ background:"none", color:"var(--muted)", fontSize:20, padding:"4px 8px" }}>✕</button>
      </div>
      {children}
    </Card>
  </div>
);

const Alert = ({ type="info", children }) => {
  const colors = { info:"#3B82F6", success:"#22C55E", warning:"#F59E0B", error:"#EF4444" };
  const c = colors[type];
  return (
    <div style={{ background:`${c}18`, border:`1px solid ${c}44`, borderRadius:8,
      padding:"10px 14px", color:c, fontSize:14, display:"flex", gap:8, alignItems:"flex-start" }}>
      <span>{type==="success"?"✓":type==="warning"?"⚠":type==="error"?"✕":"ℹ"}</span>
      <span>{children}</span>
    </div>
  );
};

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
const Sidebar = ({ user, screen, setScreen, onLogout }) => {
  const navItems = [
    { id:"dashboard",  icon:"📋", label:"Pedidos",         roles:["Admin","Ventas","Almacén","Compras","Ruta"] },
    { id:"archived",   icon:"🗃",  label:"Archivados",      roles:["Admin","Ventas"] },
    { id:"users",      icon:"👥", label:"Usuarios",         roles:["Admin"] },
  ];
  const visible = navItems.filter(n => n.roles.includes(user.role));

  return (
    <nav style={{ width:220, minHeight:"100vh", background:"var(--surface)",
      borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column",
      padding:"0 0 24px 0", flexShrink:0 }}>
      {/* Logo */}
      <div style={{ padding:"28px 24px 20px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ fontFamily:"var(--font-h)", fontSize:28, fontWeight:900, letterSpacing:2,
          color:"var(--amber)", lineHeight:1 }}>HALCON</div>
        <div style={{ fontSize:11, color:"var(--muted)", letterSpacing:2, marginTop:2 }}>MATERIALES</div>
      </div>
      {/* User */}
      <div style={{ padding:"16px 24px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ width:38, height:38, borderRadius:"50%", background:"var(--amber)",
          color:"#000", display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"var(--font-h)", fontWeight:900, fontSize:16, marginBottom:8 }}>
          {user.name[0]}
        </div>
        <div style={{ fontWeight:600, fontSize:14, lineHeight:1.3 }}>{user.name}</div>
        <RoleBadge role={user.role} />
      </div>
      {/* Nav */}
      <div style={{ flex:1, padding:"12px 12px" }}>
        {visible.map(item => (
          <button key={item.id} onClick={() => setScreen(item.id)}
            style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px",
              borderRadius:8, background: screen===item.id ? "#F59E0B22" : "transparent",
              border: screen===item.id ? "1px solid #F59E0B44" : "1px solid transparent",
              color: screen===item.id ? "var(--amber)" : "var(--muted)", fontSize:14,
              fontFamily:"var(--font-b)", fontWeight: screen===item.id ? 600 : 400,
              cursor:"pointer", marginBottom:4, textAlign:"left", transition:"all .15s" }}>
            <span>{item.icon}</span><span>{item.label}</span>
          </button>
        ))}
      </div>
      {/* Logout */}
      <div style={{ padding:"0 12px" }}>
        <button onClick={onLogout}
          style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 14px",
            borderRadius:8, background:"transparent", border:"1px solid var(--border)",
            color:"var(--muted)", fontSize:14, fontFamily:"var(--font-b)", cursor:"pointer" }}>
          <span>🚪</span><span>Cerrar sesión</span>
        </button>
      </div>
    </nav>
  );
};

/* ─── PUBLIC PORTAL ─────────────────────────────────────────────────────── */
const PublicPortal = ({ onLogin }) => {
  const [form, setForm] = useState({ custNum:"", invoice:"" });
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const found = MOCK_ORDERS.find(o =>
      !o.deleted &&
      o.custNum.toLowerCase() === form.custNum.toLowerCase() &&
      o.invoice.toLowerCase() === form.invoice.toLowerCase()
    );
    setResult(found || null);
    setSearched(true);
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column" }}>
      <FontLink />
      {/* Header */}
      <header style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)",
        padding:"0 40px", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ fontFamily:"var(--font-h)", fontSize:26, fontWeight:900,
            letterSpacing:2, color:"var(--amber)" }}>HALCON</div>
          <span style={{ color:"var(--border)", fontSize:20 }}>|</span>
          <span style={{ color:"var(--muted)", fontSize:13 }}>Seguimiento de Pedidos</span>
        </div>
        <Btn onClick={onLogin} variant="ghost" size="sm">Acceso empleados →</Btn>
      </header>

      {/* Hero */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div style={{ maxWidth:480, width:"100%", animation:"fadeUp .4s ease" }}>
          {/* Big title */}
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontFamily:"var(--font-h)", fontSize:56, fontWeight:900, lineHeight:1,
              letterSpacing:2, marginBottom:8 }}>
              RASTREAR<br/>
              <span style={{ color:"var(--amber)" }}>PEDIDO</span>
            </div>
            <p style={{ color:"var(--muted)", fontSize:15 }}>
              Ingresa tu número de cliente y el número de factura para consultar el estado de tu pedido.
            </p>
          </div>

          <Card>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <Input label="Número de Cliente" placeholder="Ej: C-101"
                value={form.custNum} onChange={e => setForm({...form, custNum:e.target.value})} />
              <Input label="Número de Factura" placeholder="Ej: F-0001"
                value={form.invoice} onChange={e => setForm({...form, invoice:e.target.value})} />
              <Btn onClick={handleSearch} fullWidth size="lg"
                disabled={!form.custNum || !form.invoice}>
                CONSULTAR PEDIDO
              </Btn>
            </div>
          </Card>

          {/* Result */}
          {searched && (
            <div style={{ marginTop:20, animation:"fadeUp .3s ease" }}>
              {result ? (
                <Card style={{ borderColor: STATUS_MAP[result.status]?.color + "44" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                    <div>
                      <div style={{ fontFamily:"var(--font-h)", fontSize:22, fontWeight:800 }}>
                        {result.custName}
                      </div>
                      <div style={{ color:"var(--muted)", fontSize:13, marginTop:2 }}>
                        Factura: {result.invoice} · Cliente: {result.custNum}
                      </div>
                    </div>
                    <Badge status={result.status} />
                  </div>
                  <div style={{ fontSize:14, color:"var(--muted)", marginBottom:4 }}>
                    📅 {result.date}
                  </div>
                  <div style={{ fontSize:14, color:"var(--muted)" }}>
                    📍 {result.address}
                  </div>
                  {result.status === "delivered" && result.deliveryPhoto && (
                    <div style={{ marginTop:16 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"var(--amber)",
                        textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>
                        📸 Evidencia de Entrega
                      </div>
                      <img src={result.deliveryPhoto} alt="Evidencia"
                        style={{ width:"100%", borderRadius:8, border:"1px solid var(--border)" }} />
                    </div>
                  )}
                </Card>
              ) : (
                <Alert type="error">
                  No se encontró ningún pedido activo con esos datos. Verifica tu número de cliente y factura.
                </Alert>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── LOGIN ─────────────────────────────────────────────────────────────── */
const Login = ({ onLogin, onBack }) => {
  const [form, setForm] = useState({ username:"", password:"" });
  const [error, setError] = useState("");
  const CREDS = [
    { username:"admin",    password:"admin123",    name:"Administrador",       role:"Admin"    },
    { username:"cmendoza", password:"ventas123",   name:"Carlos Mendoza",      role:"Ventas"   },
    { username:"lramirez", password:"alma123",     name:"Lupita Ramírez",      role:"Almacén"  },
    { username:"jsoto",    password:"compras123",  name:"Jorge Soto",          role:"Compras"  },
    { username:"matorres", password:"ruta123",     name:"Miguel Ángel Torres", role:"Ruta"     },
  ];

  const handleLogin = () => {
    const user = CREDS.find(c => c.username===form.username && c.password===form.password);
    if (user) { setError(""); onLogin(user); }
    else setError("Usuario o contraseña incorrectos.");
  };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex",
      alignItems:"center", justifyContent:"center", padding:24 }}>
      <FontLink />
      <div style={{ maxWidth:400, width:"100%", animation:"fadeUp .4s ease" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontFamily:"var(--font-h)", fontSize:44, fontWeight:900,
            letterSpacing:3, color:"var(--amber)", marginBottom:4 }}>HALCON</div>
          <div style={{ color:"var(--muted)", fontSize:14 }}>Panel Administrativo</div>
        </div>
        <Card>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <Input label="Usuario" placeholder="Ej: admin" value={form.username}
              onChange={e => setForm({...form, username:e.target.value})} />
            <Input label="Contraseña" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form, password:e.target.value})}
              onKeyDown={e => e.key==="Enter" && handleLogin()} />
            {error && <Alert type="error">{error}</Alert>}
            <Btn onClick={handleLogin} fullWidth size="lg">INICIAR SESIÓN</Btn>
            <div style={{ background:"var(--bg)", borderRadius:8, padding:12, fontSize:12, color:"var(--muted)" }}>
              <strong style={{ color:"var(--amber)" }}>Demo:</strong><br/>
              admin/admin123 · cmendoza/ventas123<br/>lramirez/alma123 · matorres/ruta123
            </div>
          </div>
        </Card>
        <div style={{ textAlign:"center", marginTop:16 }}>
          <button onClick={onBack} style={{ background:"none", color:"var(--muted)",
            fontSize:13, textDecoration:"underline", cursor:"pointer" }}>
            ← Regresar al portal de clientes
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── ORDER ROW ─────────────────────────────────────────────────────────── */
const OrderRow = ({ order, onClick }) => (
  <tr onClick={onClick} style={{ cursor:"pointer", borderBottom:"1px solid var(--border)",
    transition:"background .1s" }}
    onMouseEnter={e => e.currentTarget.style.background="var(--surface)"}
    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
    <td style={{ padding:"13px 16px", fontFamily:"var(--font-h)", fontWeight:700, color:"var(--amber)", fontSize:15 }}>{order.invoice}</td>
    <td style={{ padding:"13px 16px", fontSize:13, color:"var(--muted)" }}>{order.custNum}</td>
    <td style={{ padding:"13px 16px", fontSize:14, fontWeight:500 }}>{order.custName}</td>
    <td style={{ padding:"13px 16px", fontSize:13, color:"var(--muted)" }}>{order.date.split(" ")[0]}</td>
    <td style={{ padding:"13px 16px" }}><Badge status={order.status} /></td>
    <td style={{ padding:"13px 16px" }}>
      <span style={{ fontSize:11, color:"var(--muted)", padding:"3px 8px", background:"var(--bg)",
        borderRadius:4, border:"1px solid var(--border)" }}>ver →</span>
    </td>
  </tr>
);

/* ─── DASHBOARD ──────────────────────────────────────────────────────────── */
const Dashboard = ({ user, orders, setOrders, openOrder }) => {
  const [filters, setFilters] = useState({ search:"", status:"", date:"" });
  const [showForm, setShowForm] = useState(false);

  const active = orders.filter(o => !o.deleted);
  const filtered = active.filter(o => {
    const q = filters.search.toLowerCase();
    const matchQ = !q || o.invoice.toLowerCase().includes(q) ||
      o.custNum.toLowerCase().includes(q) || o.custName.toLowerCase().includes(q);
    const matchS = !filters.status || o.status === filters.status;
    const matchD = !filters.date || o.date.startsWith(filters.date);
    return matchQ && matchS && matchD;
  });

  const stats = [
    { label:"Ordenados",   count: active.filter(o=>o.status==="ordered").length,    color:"var(--amber)", icon:"📥" },
    { label:"En Proceso",  count: active.filter(o=>o.status==="in_process").length, color:"var(--blue)",  icon:"⚙️" },
    { label:"En Ruta",     count: active.filter(o=>o.status==="in_route").length,   color:"#8B5CF6",      icon:"🚛" },
    { label:"Entregados",  count: active.filter(o=>o.status==="delivered").length,  color:"var(--green)", icon:"✅" },
  ];

  return (
    <div style={{ flex:1, padding:32, overflowY:"auto", animation:"fadeIn .3s" }}>
      <FontLink />
      {/* Header row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
        <div>
          <div style={{ fontFamily:"var(--font-h)", fontSize:36, fontWeight:900, letterSpacing:1 }}>
            PEDIDOS
          </div>
          <div style={{ color:"var(--muted)", fontSize:14 }}>{filtered.length} pedido(s) activo(s)</div>
        </div>
        {user.role === "Ventas" && (
          <Btn onClick={() => setShowForm(true)}>+ Nuevo Pedido</Btn>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
        {stats.map(s => (
          <Card key={s.label} style={{ padding:20, borderColor:`${s.color}33` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:32, fontFamily:"var(--font-h)", fontWeight:900, color:s.color }}>{s.count}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{s.label}</div>
              </div>
              <span style={{ fontSize:28 }}>{s.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card style={{ marginBottom:16, padding:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 200px 160px", gap:12 }}>
          <input placeholder="🔍 Buscar por factura, cliente, nombre..." value={filters.search}
            onChange={e => setFilters({...filters, search:e.target.value})} />
          <select value={filters.status} onChange={e => setFilters({...filters, status:e.target.value})}>
            <option value="">Todos los estados</option>
            {Object.entries(STATUS_MAP).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input type="date" value={filters.date}
            onChange={e => setFilters({...filters, date:e.target.value})} />
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"var(--bg)", borderBottom:"2px solid var(--border)" }}>
              {["Factura","# Cliente","Cliente","Fecha","Estado",""].map(h => (
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11,
                  fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:"var(--muted)" }}>
                Sin resultados para esta búsqueda.
              </td></tr>
            ) : filtered.map(o => (
              <OrderRow key={o.id} order={o} onClick={() => openOrder(o)} />
            ))}
          </tbody>
        </table>
      </Card>

      {/* New Order Modal */}
      {showForm && (
        <NewOrderModal orders={orders} setOrders={setOrders} onClose={() => setShowForm(false)} user={user} />
      )}
    </div>
  );
};

/* ─── NEW ORDER MODAL ────────────────────────────────────────────────────── */
const NewOrderModal = ({ orders, setOrders, onClose, user }) => {
  const [form, setForm] = useState({
    invoice:"", custNum:"", custName:"", fiscal:"", address:"", notes:""
  });
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!form.invoice || !form.custNum || !form.custName || !form.address) {
      setError("Completa los campos obligatorios: Factura, # Cliente, Nombre y Dirección.");
      return;
    }
    if (orders.find(o => !o.deleted && o.invoice === form.invoice)) {
      setError("Ya existe un pedido activo con ese número de factura.");
      return;
    }
    const newOrder = {
      id: orders.length + 1,
      invoice: form.invoice,
      custNum: form.custNum,
      custName: form.custName,
      fiscal: form.fiscal,
      date: new Date().toISOString().slice(0,16).replace("T"," "),
      address: form.address,
      notes: form.notes,
      status: "ordered",
      deleted: false,
      loadPhoto: null,
      deliveryPhoto: null,
    };
    setOrders([newOrder, ...orders]);
    onClose();
  };

  return (
    <Modal title="📋 Nuevo Pedido" onClose={onClose}>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {error && <Alert type="error">{error}</Alert>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Input label="# Factura *" placeholder="F-0007" value={form.invoice}
            onChange={e => setForm({...form, invoice:e.target.value})} />
          <Input label="# Cliente *" placeholder="C-101" value={form.custNum}
            onChange={e => setForm({...form, custNum:e.target.value})} />
        </div>
        <Input label="Nombre / Razón Social *" placeholder="Empresa constructora S.A." value={form.custName}
          onChange={e => setForm({...form, custName:e.target.value})} />
        <Textarea label="Datos Fiscales" placeholder="RFC, dirección fiscal..." value={form.fiscal}
          onChange={e => setForm({...form, fiscal:e.target.value})} />
        <Input label="Dirección de Entrega *" placeholder="Calle, número, ciudad" value={form.address}
          onChange={e => setForm({...form, address:e.target.value})} />
        <Textarea label="Notas / Información Extra" placeholder="Instrucciones especiales..." value={form.notes}
          onChange={e => setForm({...form, notes:e.target.value})} />
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
          <Btn onClick={onClose} variant="ghost">Cancelar</Btn>
          <Btn onClick={handleSave}>Guardar Pedido</Btn>
        </div>
      </div>
    </Modal>
  );
};

/* ─── ORDER DETAIL ───────────────────────────────────────────────────────── */
const OrderDetail = ({ order, user, orders, setOrders, onBack }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    custName: order.custName, fiscal: order.fiscal,
    address: order.address, notes: order.notes, invoice: order.invoice
  });
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const cur = orders.find(o => o.id === order.id);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateOrder = (updates) => {
    setOrders(orders.map(o => o.id===cur.id ? {...o, ...updates} : o));
  };

  const handleSaveEdit = () => {
    updateOrder({ ...form });
    setEditing(false);
    showToast("Pedido actualizado correctamente.");
  };

  const handleStatusChange = (newStatus) => {
    updateOrder({ status: newStatus });
    showToast(`Estado cambiado a "${STATUS_MAP[newStatus]?.label}".`);
  };

  const handleUploadLoad = () => {
    updateOrder({ loadPhoto:"https://placehold.co/400x300/1E2330/8B5CF6?text=📦+Carga+Simulada" });
    showToast("Foto de carga subida correctamente.");
  };

  const handleUploadDelivery = () => {
    updateOrder({ deliveryPhoto:"https://placehold.co/400x300/1E2330/22C55E?text=✅+Entrega+Simulada", status:"delivered" });
    showToast("Evidencia de entrega subida. Estado cambiado a Entregado.", "success");
  };

  const handleDelete = () => {
    updateOrder({ deleted: true });
    setConfirmDelete(false);
    showToast("Pedido archivado correctamente.", "warning");
    setTimeout(onBack, 1200);
  };

  const STATUS_TRANSITIONS = {
    ordered:    { next:"in_process", label:"Cambiar a En Proceso", role:"Almacén" },
    in_process: { next:"in_route",   label:"Cambiar a En Ruta",    role:"Almacén" },
  };

  const canEdit   = ["Ventas","Admin"].includes(user.role);
  const canDelete = ["Ventas","Admin"].includes(user.role);
  const canRoute  = user.role === "Ruta";
  const transition = STATUS_TRANSITIONS[cur.status];
  const canTransit = transition && user.role === transition.role;

  return (
    <div style={{ flex:1, padding:32, overflowY:"auto", animation:"fadeIn .3s" }}>
      <FontLink />
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, right:20, zIndex:999,
          background: toast.type==="success"?"#22C55E":toast.type==="warning"?"#F59E0B":"#EF4444",
          color:"#000", padding:"12px 20px", borderRadius:8, fontWeight:700,
          fontFamily:"var(--font-h)", fontSize:16, animation:"fadeUp .3s", boxShadow:"0 4px 20px #0008" }}>
          {toast.msg}
        </div>
      )}

      {/* Back + title */}
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
        <button onClick={onBack} style={{ background:"var(--card)", border:"1px solid var(--border)",
          color:"var(--muted)", padding:"8px 14px", borderRadius:8, cursor:"pointer",
          fontFamily:"var(--font-b)", fontSize:14 }}>← Volver</button>
        <div>
          <div style={{ fontFamily:"var(--font-h)", fontSize:32, fontWeight:900, letterSpacing:1,
            display:"flex", alignItems:"center", gap:12 }}>
            {cur.invoice}
            <Badge status={cur.status} />
          </div>
          <div style={{ color:"var(--muted)", fontSize:13 }}>Pedido creado: {cur.date}</div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:24 }}>
        {/* Left: info */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <Card>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <span style={{ fontFamily:"var(--font-h)", fontSize:18, fontWeight:800 }}>Información del Pedido</span>
              {canEdit && !cur.deleted && !editing && (
                <Btn onClick={() => setEditing(true)} variant="ghost" size="sm">✏️ Editar</Btn>
              )}
            </div>
            {editing ? (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <Input label="# Factura" value={form.invoice}
                  onChange={e => setForm({...form, invoice:e.target.value})} />
                <Input label="Nombre / Razón Social" value={form.custName}
                  onChange={e => setForm({...form, custName:e.target.value})} />
                <Textarea label="Datos Fiscales" value={form.fiscal}
                  onChange={e => setForm({...form, fiscal:e.target.value})} />
                <Input label="Dirección de Entrega" value={form.address}
                  onChange={e => setForm({...form, address:e.target.value})} />
                <Textarea label="Notas" value={form.notes}
                  onChange={e => setForm({...form, notes:e.target.value})} />
                <div style={{ display:"flex", gap:10 }}>
                  <Btn onClick={handleSaveEdit}>Guardar</Btn>
                  <Btn onClick={() => setEditing(false)} variant="ghost">Cancelar</Btn>
                </div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  ["# Cliente",       cur.custNum],
                  ["Cliente",         cur.custName],
                  ["Dirección",       cur.address],
                  ["Datos Fiscales",  cur.fiscal || "—"],
                  ["Notas",           cur.notes || "—"],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:"grid", gridTemplateColumns:"150px 1fr",
                    gap:8, fontSize:14, borderBottom:"1px solid var(--border)", paddingBottom:12 }}>
                    <span style={{ color:"var(--muted)", fontWeight:600, fontSize:12,
                      textTransform:"uppercase", letterSpacing:.8, paddingTop:2 }}>{k}</span>
                    <span style={{ whiteSpace:"pre-line" }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Photos */}
          <Card>
            <div style={{ fontFamily:"var(--font-h)", fontSize:18, fontWeight:800, marginBottom:16 }}>
              Fotografías
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:"var(--muted)", textTransform:"uppercase",
                  letterSpacing:1, marginBottom:8 }}>📦 Carga de Unidad</div>
                {cur.loadPhoto ? (
                  <img src={cur.loadPhoto} alt="Carga"
                    style={{ width:"100%", borderRadius:8, border:"1px solid var(--border)" }} />
                ) : (
                  <div style={{ height:120, background:"var(--bg)", borderRadius:8,
                    border:"2px dashed var(--border)", display:"flex", alignItems:"center",
                    justifyContent:"center", color:"var(--muted)", fontSize:13, flexDirection:"column", gap:8 }}>
                    <span style={{ fontSize:24 }}>📷</span>
                    Sin foto
                  </div>
                )}
                {canRoute && cur.status==="in_route" && !cur.loadPhoto && (
                  <Btn onClick={handleUploadLoad} size="sm" variant="secondary" style={{ marginTop:8, width:"100%" }}>
                    📸 Subir foto de carga
                  </Btn>
                )}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:"var(--muted)", textTransform:"uppercase",
                  letterSpacing:1, marginBottom:8 }}>✅ Evidencia de Entrega</div>
                {cur.deliveryPhoto ? (
                  <img src={cur.deliveryPhoto} alt="Entrega"
                    style={{ width:"100%", borderRadius:8, border:"1px solid var(--border)" }} />
                ) : (
                  <div style={{ height:120, background:"var(--bg)", borderRadius:8,
                    border:"2px dashed var(--border)", display:"flex", alignItems:"center",
                    justifyContent:"center", color:"var(--muted)", fontSize:13, flexDirection:"column", gap:8 }}>
                    <span style={{ fontSize:24 }}>📷</span>
                    Sin foto
                  </div>
                )}
                {canRoute && cur.status==="in_route" && !cur.deliveryPhoto && (
                  <Btn onClick={handleUploadDelivery} size="sm" variant="success" style={{ marginTop:8, width:"100%" }}>
                    ✅ Subir evidencia y marcar entregado
                  </Btn>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right: actions */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Status card */}
          <Card style={{ borderColor: STATUS_MAP[cur.status]?.color + "44" }}>
            <div style={{ fontFamily:"var(--font-h)", fontSize:16, fontWeight:800, marginBottom:12 }}>
              Estado Actual
            </div>
            <div style={{ marginBottom:16 }}><Badge status={cur.status} /></div>
            {/* Timeline */}
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {Object.entries(STATUS_MAP).map(([key, s], i, arr) => {
                const statuses = Object.keys(STATUS_MAP);
                const curIdx = statuses.indexOf(cur.status);
                const thisIdx = statuses.indexOf(key);
                const done = thisIdx <= curIdx;
                return (
                  <div key={key} style={{ display:"flex", alignItems:"flex-start", gap:12, position:"relative" }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                      <div style={{ width:24, height:24, borderRadius:"50%", flexShrink:0,
                        background: done ? s.color : "var(--border)",
                        border: `2px solid ${done ? s.color : "var(--border)"}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color: done ? "#000":"var(--muted)", fontSize:11, fontWeight:900 }}>
                        {done ? "✓" : i+1}
                      </div>
                      {i < arr.length-1 && (
                        <div style={{ width:2, height:24, background: done ? s.color+"66":"var(--border)" }} />
                      )}
                    </div>
                    <div style={{ paddingTop:3, paddingBottom: i < arr.length-1 ? 0 : 0 }}>
                      <div style={{ fontSize:13, fontWeight: done?600:400,
                        color: done ? s.color : "var(--muted)" }}>{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {canTransit && !cur.deleted && (
              <Btn onClick={() => handleStatusChange(transition.next)} fullWidth
                variant="primary" style={{ marginTop:16 }}>
                ⬆️ {transition.label}
              </Btn>
            )}
          </Card>

          {/* Actions */}
          {(canDelete || canRoute) && !cur.deleted && cur.status !== "delivered" && (
            <Card>
              <div style={{ fontFamily:"var(--font-h)", fontSize:16, fontWeight:800, marginBottom:12 }}>
                Acciones
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {canDelete && (
                  <Btn onClick={() => setConfirmDelete(true)} variant="danger" fullWidth>
                    🗃 Archivar Pedido
                  </Btn>
                )}
              </div>
            </Card>
          )}

          {cur.deleted && (
            <Alert type="warning">Este pedido ha sido archivado y no es visible en el portal público.</Alert>
          )}
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <Modal title="⚠️ Archivar Pedido" onClose={() => setConfirmDelete(false)}>
          <p style={{ color:"var(--muted)", marginBottom:20 }}>
            ¿Estás seguro de que deseas archivar el pedido <strong style={{ color:"var(--amber)" }}>{cur.invoice}</strong>?
            No se eliminará de la base de datos y podrá restaurarse desde la sección de Archivados.
          </p>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn onClick={() => setConfirmDelete(false)} variant="ghost">Cancelar</Btn>
            <Btn onClick={handleDelete} variant="danger">Sí, Archivar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── ARCHIVED ───────────────────────────────────────────────────────────── */
const Archived = ({ orders, setOrders, user }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const deleted = orders.filter(o => o.deleted);

  const restore = (id) => {
    setOrders(orders.map(o => o.id===id ? {...o, deleted:false} : o));
  };

  if (selectedOrder) {
    const cur = orders.find(o => o.id === selectedOrder.id);
    return (
      <OrderDetail order={cur} user={user} orders={orders} setOrders={setOrders}
        onBack={() => setSelectedOrder(null)} />
    );
  }

  return (
    <div style={{ flex:1, padding:32, overflowY:"auto", animation:"fadeIn .3s" }}>
      <FontLink />
      <div style={{ marginBottom:28 }}>
        <div style={{ fontFamily:"var(--font-h)", fontSize:36, fontWeight:900, letterSpacing:1 }}>
          ARCHIVADOS
        </div>
        <div style={{ color:"var(--muted)", fontSize:14 }}>{deleted.length} pedido(s) archivado(s)</div>
      </div>
      <Card style={{ padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"var(--bg)", borderBottom:"2px solid var(--border)" }}>
              {["Factura","# Cliente","Cliente","Fecha","Estado","Acciones"].map(h => (
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11,
                  fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deleted.length === 0 ? (
              <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:"var(--muted)" }}>
                No hay pedidos archivados.
              </td></tr>
            ) : deleted.map(o => (
              <tr key={o.id} style={{ borderBottom:"1px solid var(--border)", opacity:.8 }}>
                <td style={{ padding:"13px 16px", fontFamily:"var(--font-h)", fontWeight:700, color:"var(--amber)", fontSize:15 }}>{o.invoice}</td>
                <td style={{ padding:"13px 16px", fontSize:13, color:"var(--muted)" }}>{o.custNum}</td>
                <td style={{ padding:"13px 16px", fontSize:14 }}>{o.custName}</td>
                <td style={{ padding:"13px 16px", fontSize:13, color:"var(--muted)" }}>{o.date.split(" ")[0]}</td>
                <td style={{ padding:"13px 16px" }}><Badge status={o.status} /></td>
                <td style={{ padding:"13px 16px", display:"flex", gap:8 }}>
                  <Btn onClick={() => setSelectedOrder(o)} variant="ghost" size="sm">✏️ Editar</Btn>
                  <Btn onClick={() => restore(o.id)} variant="success" size="sm">↩ Restaurar</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ─── USERS ──────────────────────────────────────────────────────────────── */
const Users = ({ users, setUsers }) => {
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name:"", username:"", password:"", role:"Ventas", active:true });
  const [error, setError] = useState("");

  const openNew = () => { setEditUser(null); setForm({ name:"", username:"", password:"", role:"Ventas", active:true }); setError(""); setShowModal(true); };
  const openEdit = (u) => { setEditUser(u); setForm({ name:u.name, username:u.username, password:"", role:u.role, active:u.active }); setError(""); setShowModal(true); };

  const handleSave = () => {
    if (!form.name || !form.username) { setError("Nombre y usuario son obligatorios."); return; }
    if (!editUser && users.find(u => u.username===form.username)) { setError("Ese usuario ya existe."); return; }
    if (editUser) {
      setUsers(users.map(u => u.id===editUser.id ? {...u, name:form.name, username:form.username, role:form.role, active:form.active} : u));
    } else {
      setUsers([...users, { id: users.length+1, name:form.name, username:form.username, role:form.role, active:form.active }]);
    }
    setShowModal(false);
  };

  const toggleActive = (id) => setUsers(users.map(u => u.id===id ? {...u, active:!u.active} : u));

  return (
    <div style={{ flex:1, padding:32, overflowY:"auto", animation:"fadeIn .3s" }}>
      <FontLink />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
        <div>
          <div style={{ fontFamily:"var(--font-h)", fontSize:36, fontWeight:900, letterSpacing:1 }}>USUARIOS</div>
          <div style={{ color:"var(--muted)", fontSize:14 }}>{users.length} usuario(s) registrado(s)</div>
        </div>
        <Btn onClick={openNew}>+ Nuevo Usuario</Btn>
      </div>

      <Card style={{ padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"var(--bg)", borderBottom:"2px solid var(--border)" }}>
              {["Nombre","Usuario","Rol","Estado","Acciones"].map(h => (
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11,
                  fontWeight:700, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom:"1px solid var(--border)", opacity: u.active?1:.55 }}>
                <td style={{ padding:"13px 16px", fontWeight:600 }}>{u.name}</td>
                <td style={{ padding:"13px 16px", color:"var(--muted)", fontFamily:"monospace", fontSize:13 }}>{u.username}</td>
                <td style={{ padding:"13px 16px" }}><RoleBadge role={u.role} /></td>
                <td style={{ padding:"13px 16px" }}>
                  <span style={{ color: u.active?"var(--green)":"var(--red)", fontWeight:600, fontSize:13 }}>
                    {u.active ? "● Activo" : "○ Inactivo"}
                  </span>
                </td>
                <td style={{ padding:"13px 16px", display:"flex", gap:8 }}>
                  <Btn onClick={() => openEdit(u)} variant="ghost" size="sm">✏️ Editar</Btn>
                  <Btn onClick={() => toggleActive(u.id)} variant={u.active?"danger":"success"} size="sm">
                    {u.active ? "Desactivar" : "Activar"}
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showModal && (
        <Modal title={editUser ? "✏️ Editar Usuario" : "➕ Nuevo Usuario"} onClose={() => setShowModal(false)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {error && <Alert type="error">{error}</Alert>}
            <Input label="Nombre Completo *" value={form.name}
              onChange={e => setForm({...form, name:e.target.value})} />
            <Input label="Usuario *" value={form.username}
              onChange={e => setForm({...form, username:e.target.value})} disabled={!!editUser} />
            {!editUser && (
              <Input label="Contraseña *" type="password" value={form.password}
                onChange={e => setForm({...form, password:e.target.value})} />
            )}
            <Select label="Rol *" value={form.role}
              onChange={e => setForm({...form, role:e.target.value})}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
            {editUser && (
              <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", fontSize:14 }}>
                <input type="checkbox" checked={form.active}
                  onChange={e => setForm({...form, active:e.target.checked})}
                  style={{ width:16, height:16, accentColor:"var(--amber)" }} />
                Usuario activo
              </label>
            )}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
              <Btn onClick={() => setShowModal(false)} variant="ghost">Cancelar</Btn>
              <Btn onClick={handleSave}>{editUser ? "Guardar Cambios" : "Crear Usuario"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── APP ROOT ───────────────────────────────────────────────────────────── */
export default function App() {
  const [view, setView] = useState("public");    // public | login | app
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("dashboard");
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [users, setUsers] = useState(MOCK_USERS);
  const [openedOrder, setOpenedOrder] = useState(null);

  const handleLogin = (u) => { setUser(u); setView("app"); setScreen("dashboard"); };
  const handleLogout = () => { setUser(null); setView("public"); setOpenedOrder(null); };

  if (view === "public") return <PublicPortal onLogin={() => setView("login")} />;
  if (view === "login") return <Login onLogin={handleLogin} onBack={() => setView("public")} />;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)" }}>
      <FontLink />
      <Sidebar user={user} screen={screen} setScreen={(s) => { setScreen(s); setOpenedOrder(null); }} onLogout={handleLogout} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {screen === "dashboard" && !openedOrder && (
          <Dashboard user={user} orders={orders} setOrders={setOrders}
            openOrder={(o) => setOpenedOrder(o)} />
        )}
        {screen === "dashboard" && openedOrder && (
          <OrderDetail order={openedOrder} user={user} orders={orders} setOrders={setOrders}
            onBack={() => setOpenedOrder(null)} />
        )}
        {screen === "archived" && (
          <Archived orders={orders} setOrders={setOrders} user={user} />
        )}
        {screen === "users" && user.role==="Admin" && (
          <Users users={users} setUsers={setUsers} />
        )}
      </div>
    </div>
  );
}
