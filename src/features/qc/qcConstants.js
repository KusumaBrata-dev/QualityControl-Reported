export const T = {
  bg: "#0D1117", surface: "#161B22", surface2: "#1C2330",
  border: "#30363D", border2: "#21262D",
  text: "#E6EDF3", muted: "#7D8590", muted2: "#484F58",
  blue: "#2F81F7", blueD: "#1C5FAD", blueL: "#1C2D3F",
  green: "#3FB950", greenD: "#238636", greenL: "#1A2E21",
  red: "#F85149", redD: "#B91C1C", redL: "#2D1B1B",
  yellow: "#D29922", yellowL: "#2D2200",
  purple: "#A371F7", purpleL: "#221A3E",
  aqua: "#39D2EE", aquaL: "#0D2535",
  pink: "#FF7EB3", pinkL: "#2D1525",
  orange: "#F0883E",
  r: "8px", r2: "12px",
  font: "'Outfit', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

export const PRODUCTS = {
  1: { model: "WM1091SK", color: "Blue" },
  2: { model: "WM1091SK", color: "Purple" },
  3: { model: "WM891SK",  color: "Aqua" },
  4: { model: "WM891SK",  color: "Pink" },
};

export const COLOR_HEX = { Blue: T.blue, Purple: T.purple, Aqua: T.aqua, Pink: T.pink };
export const COLOR_BGL = { Blue: T.blueL, Purple: T.purpleL, Aqua: T.aquaL, Pink: T.pinkL };

export const ROLE_GRAD = {
  admin:    "linear-gradient(135deg,#B45309,#F0883E)",
  operator: "linear-gradient(135deg,#1C5FAD,#2F81F7)",
  viewer:   "linear-gradient(135deg,#196127,#3FB950)",
};

export const CHECKPOINTS = [
  "Visual Inspection – Body Panel", "Dimensional Check – Door Frame",
  "Electrical Safety Test",         "Water Leak Test",
  "Drum Balance Test",              "Label Placement Check",
  "Color Matching",                 "Function Test – All Modes",
];

export const INSPECTORS = [
  { v: "Ahmad Kusuma|EMP-001",   l: "Ahmad Kusuma (EMP-001)"   },
  { v: "Siti Rahayu|EMP-002",    l: "Siti Rahayu (EMP-002)"    },
  { v: "Budi Santoso|EMP-003",   l: "Budi Santoso (EMP-003)"   },
  { v: "Lena Dewi|EMP-004",      l: "Lena Dewi (EMP-004)"      },
  { v: "Hendra Tanjung|EMP-005", l: "Hendra Tanjung (EMP-005)" },
];

export const DEFECT_CATS = [
  { v: "Surface Scratch",     l: "DC01 – Surface Scratch"     },
  { v: "Color Inconsistency", l: "DC02 – Color Inconsistency" },
  { v: "Dimensional Defect",  l: "DC03 – Dimensional Defect"  },
  { v: "Assembly Error",      l: "DC04 – Assembly Error"      },
  { v: "Electrical Fault",    l: "DC05 – Electrical Fault"    },
  { v: "Crack/Fracture",      l: "DC06 – Crack/Fracture"      },
  { v: "Missing Component",   l: "DC07 – Missing Component"   },
  { v: "Label/Print Error",   l: "DC08 – Label/Print Error"   },
];

export const mkCp = (result = "pass") =>
  CHECKPOINTS.map(c => ({ name: c, result, value: "" }));

// SEC 3 Mitigation: Client-side authentication is fundamentally insecure.
// In a real production system, consider implementing a proper backend auth (e.g., JWT).
export const SEED_USERS = [
  { id:1, name:"Admin QC",       username:"admin",    role:"admin",    password:"admin123", active:true,  created_at:"2025-01-01T00:00:00Z" },
  { id:2, name:"Ahmad Operator", username:"ahmad",    role:"operator", password:"operator", active:true,  created_at:"2025-01-02T00:00:00Z" },
  { id:3, name:"Viewer Only",    username:"viewer",   role:"viewer",   password:"viewer",   active:true,  created_at:"2025-01-03T00:00:00Z" },
];

export const SEED_REPORTS = [
  { id:1, product_id:1, model:"WM1091SK", color:"Blue",   batch_no:"B-WM1091-0001", production_date:"2025-03-01", inspection_date:"2025-03-01T08:30", inspector:"Ahmad Kusuma",   inspector_id:"EMP-001", shift:"A", qty_produced:200, qty_inspected:200, qty_pass:196, qty_fail:4,  qty_rework:2,  defect_rate:2.00,  defect_cat:"Surface Scratch",    defect_loc:"Top panel",     station:"QA",       overall_status:"fail", notes:"Minor surface scratches on 4 units",     serial_numbers:["SN-BL-20001","SN-BL-20002","SN-BL-20003","SN-BL-20004"], images:[], checkpoints:mkCp(),       created_at:"2025-03-01T08:30:00Z" },
  { id:2, product_id:1, model:"WM1091SK", color:"Blue",   batch_no:"B-WM1091-0002", production_date:"2025-03-01", inspection_date:"2025-03-01T13:00", inspector:"Siti Rahayu",    inspector_id:"EMP-002", shift:"B", qty_produced:200, qty_inspected:200, qty_pass:193, qty_fail:7,  qty_rework:5,  defect_rate:3.50,  defect_cat:"Color Inconsistency", defect_loc:"Side panel",    station:"Repair",   overall_status:"fail", notes:"Color inconsistency detected",            serial_numbers:["SN-BL-20101","SN-BL-20102"], images:[], checkpoints:mkCp(),       created_at:"2025-03-01T13:00:00Z" },
  { id:3, product_id:2, model:"WM1091SK", color:"Purple", batch_no:"B-WM1091P-001", production_date:"2025-03-01", inspection_date:"2025-03-01T09:15", inspector:"Budi Santoso",   inspector_id:"EMP-003", shift:"A", qty_produced:150, qty_inspected:150, qty_pass:148, qty_fail:2,  qty_rework:2,  defect_rate:1.33,  defect_cat:"",                    defect_loc:"",              station:"QA",       overall_status:"pass", notes:"OK",                                      serial_numbers:[],                             images:[], checkpoints:mkCp(),       created_at:"2025-03-01T09:15:00Z" },
  { id:4, product_id:2, model:"WM1091SK", color:"Purple", batch_no:"B-WM1091P-002", production_date:"2025-03-01", inspection_date:"2025-03-01T14:30", inspector:"Lena Dewi",      inspector_id:"EMP-004", shift:"B", qty_produced:150, qty_inspected:150, qty_pass:115, qty_fail:35, qty_rework:10, defect_rate:23.33, defect_cat:"Dimensional Defect",  defect_loc:"Door frame",    station:"Repair",   overall_status:"fail", notes:"Dimensional defect – stop production",    serial_numbers:["SN-PU-10001","SN-PU-10002"], images:[], checkpoints:mkCp("fail"), created_at:"2025-03-01T14:30:00Z" },
  { id:5, product_id:3, model:"WM891SK",  color:"Aqua",   batch_no:"B-WM891A-001",  production_date:"2025-03-01", inspection_date:"2025-03-01T08:00", inspector:"Hendra Tanjung", inspector_id:"EMP-005", shift:"A", qty_produced:300, qty_inspected:300, qty_pass:298, qty_fail:2,  qty_rework:2,  defect_rate:0.67,  defect_cat:"Surface Scratch",    defect_loc:"Front panel",   station:"Assembly", overall_status:"pass", notes:"Excellent quality",                       serial_numbers:["SN-AQ-30001"],               images:[], checkpoints:mkCp(),       created_at:"2025-03-01T08:00:00Z" },
  { id:6, product_id:4, model:"WM891SK",  color:"Pink",   batch_no:"B-WM891P-001",  production_date:"2025-03-01", inspection_date:"2025-03-01T09:00", inspector:"Ahmad Kusuma",   inspector_id:"EMP-001", shift:"A", qty_produced:300, qty_inspected:300, qty_pass:291, qty_fail:9,  qty_rework:7,  defect_rate:3.00,  defect_cat:"Assembly Error",      defect_loc:"Drum assembly", station:"Assembly", overall_status:"fail", notes:"Assembly check required",                 serial_numbers:["SN-PK-40001"],               images:[], checkpoints:mkCp(),       created_at:"2025-03-01T09:00:00Z" },
  { id:7, product_id:3, model:"WM891SK",  color:"Aqua",   batch_no:"B-WM891A-002",  production_date:"2025-03-02", inspection_date:"2025-03-02T08:00", inspector:"Siti Rahayu",    inspector_id:"EMP-002", shift:"A", qty_produced:300, qty_inspected:300, qty_pass:300, qty_fail:0,  qty_rework:0,  defect_rate:0.00,  defect_cat:"",                    defect_loc:"",              station:"QA",       overall_status:"pass", notes:"Perfect batch",                           serial_numbers:[],                             images:[], checkpoints:mkCp(),       created_at:"2025-03-02T08:00:00Z" },
  { id:8, product_id:4, model:"WM891SK",  color:"Pink",   batch_no:"B-WM891P-002",  production_date:"2025-03-02", inspection_date:"2025-03-02T10:00", inspector:"Budi Santoso",   inspector_id:"EMP-003", shift:"B", qty_produced:300, qty_inspected:300, qty_pass:285, qty_fail:15, qty_rework:8,  defect_rate:5.00,  defect_cat:"Color Inconsistency", defect_loc:"Front panel",   station:"Repair",   overall_status:"fail", notes:"Pink dye variation",                      serial_numbers:["SN-PK-40101"],               images:[], checkpoints:mkCp(),       created_at:"2025-03-02T10:00:00Z" },
];

export const genNo = (id, date) => "QC-" + new Date(date || Date.now()).getFullYear() + "-" + String(id).padStart(4, "0");
export const drColor = r => r > 5 ? T.red : r > 2 ? T.yellow : T.green;
