const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = __dirname;
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const W = 1360, H = 1500, R = 85;
let shapes = '', lines = '', labels = '';

const P = { p1: [650, 200], p2: [500, 620], p3: [1080, 620], p4: [780, 1250] };
// จุดบนขอบวงกลม: แนวนอนที่ระดับ y (ซ้าย/ขวา) หรือแนวตั้งที่ระดับ x (บน/ล่าง)
const eL = (p, y) => [P[p][0] - Math.sqrt(R * R - (y - P[p][1]) ** 2), y];
const eR = (p, y) => [P[p][0] + Math.sqrt(R * R - (y - P[p][1]) ** 2), y];
const eT = (p, x) => [x, P[p][1] - Math.sqrt(R * R - (x - P[p][0]) ** 2)];
const eB = (p, x) => [x, P[p][1] + Math.sqrt(R * R - (x - P[p][0]) ** 2)];

const text = (x, y, t, size, bold, anchor = 'middle') =>
  `<text x="${x}" y="${y}" font-size="${size}" ${bold ? 'font-weight="700"' : ''} text-anchor="${anchor}" dominant-baseline="middle">${t}</text>`;

// ป้ายชื่อกระแสข้อมูล: มีพื้นขาว + กรอบบาง แยกจากเส้นชัดเจน
function label(x, y, t, anchor = 'middle') {
  const rows = t.split('\n');
  const fs_ = 14, lh = 18;
  const w = Math.max(...rows.map(r => r.length)) * 7.4 + 14;
  const h = rows.length * lh + 6;
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'start' ? x : x - w;
  labels += `<rect x="${x0}" y="${y - h / 2}" width="${w}" height="${h}" rx="4" fill="#fff" stroke="#999" stroke-width="0.8"/>`;
  rows.forEach((r, i) => labels += text(x0 + w / 2, y - ((rows.length - 1) * lh) / 2 + i * lh, r, fs_, false));
}
const flow = (pts, t, lx, ly, anchor) => {
  lines += `<polyline points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#000" stroke-width="1.6" marker-end="url(#a)"/>`;
  label(lx, ly, t, anchor);
};

// ---------- กระแสข้อมูล (1 ข้อมูล = 1 เส้น) ----------
// นักศึกษา (box 40-220, 560-680)
flow([[80, 560], [80, 165], eL('p1', 165)], 'ข้อมูลลงทะเบียน / เข้าสู่ระบบ', 330, 165);
flow([eL('p1', 235), [170, 235], [170, 560]], 'ผลการเข้าสู่ระบบ', 370, 235);
flow([[220, 590], eL('p2', 590)], 'ข้อมูลสลิปโอนเงิน', 315, 568);
flow([eL('p2', 650), [220, 650]], 'ข้อมูลประกาศ / QR Code\n/ สถานะการชำระเงิน', 315, 682);
flow([eL('p4', 1300), [130, 1300], [130, 680]], 'รายงานประวัติการชำระเงินส่วนบุคคล', 400, 1300);

// เหรัญญิก (box 1000-1320, 140-260)
flow([[1000, 170], eR('p1', 170)], 'ข้อมูลเข้าสู่ระบบแอดมิน', 868, 170);
flow([eR('p1', 230), [1000, 230]], 'ผลการเข้าสู่ระบบ', 868, 230);
flow([[1030, 260], eT('p3', 1030)], 'ข้อมูลประกาศ /\nผลการตรวจสลิป', 1020, 400, 'end');
flow([eT('p3', 1110), [1110, 260]], 'รายการสลิป /\nข้อมูลการชำระเงิน', 1122, 400, 'start');
flow([[1270, 260], [1270, 1250], eR('p4', 1250)], 'ข้อมูลปรับปรุงเงินกองกลาง / เงินรุ่น', 1080, 1250);
flow([eR('p4', 1300), [1300, 1300], [1300, 260]], 'รายงานสรุปการเงิน / ประวัติทั้งหมด', 1080, 1300);

// แฟ้มข้อมูล
flow([eB('p1', 650), [650, 380]], 'บันทึกข้อมูลผู้ใช้', 662, 330, 'start');
flow([[540, 420], eT('p2', 540)], 'ข้อมูลนักศึกษา', 552, 490, 'start');
flow([eL('p3', 650), [900, 650]], 'บันทึกประกาศ', 948, 628);
flow([[700, 650], eR('p2', 650)], 'ข้อมูลประกาศ', 642, 628);
flow([eB('p2', 500), [500, 960]], 'บันทึกข้อมูลการชำระเงิน', 512, 830, 'start');
flow([eB('p3', 1040), [1040, 880], [580, 880], [580, 960]], 'อัปเดตผลการตรวจสลิป', 810, 880);
flow([eB('p3', 1110), [1110, 960]], 'บันทึกยอดเงินกองกลาง', 1098, 830, 'end');
flow([[460, 1000], [460, 1250], eL('p4', 1250)], 'ข้อมูลการชำระเงิน', 580, 1250);
flow([[1060, 1000], [1060, 1100], [810, 1100], eT('p4', 810)], 'ข้อมูลเงินกองกลาง / เงินรุ่น', 935, 1100);

// ---------- สัญลักษณ์ ----------
const proc = (k, no, name) => {
  const [cx, cy] = P[k];
  shapes += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="#000" stroke-width="2"/>`;
  shapes += `<line x1="${cx - 80}" y1="${cy - 25}" x2="${cx + 80}" y2="${cy - 25}" stroke="#000" stroke-width="1.5"/>`;
  shapes += text(cx, cy - 50, no, 24, true);
  name.split('\n').forEach((n, i) => shapes += text(cx, cy + 5 + i * 22, n, 15, true));
};
const entity = (x, y, w, h, a, b) => {
  shapes += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#000" stroke-width="2"/>`;
  shapes += text(x + w / 2, y + h / 2 - 12, a, 20, true) + text(x + w / 2, y + h / 2 + 16, b, 14, false);
};
const store = (x, y, w, id, name) => {
  shapes += `<rect x="${x}" y="${y}" width="${w}" height="40" fill="#fff" stroke="none"/>`;
  shapes += `<path d="M${x + w},${y} H${x} V${y + 40} H${x + w} M${x + 50},${y} V${y + 40}" fill="none" stroke="#000" stroke-width="2"/>`;
  shapes += text(x + 25, y + 20, id, 15, true) + text(x + 50 + (w - 50) / 2, y + 20, name, 14, true);
};

entity(40, 560, 180, 120, 'นักศึกษา', '(Student)');
entity(1000, 140, 320, 120, 'เหรัญญิก / แอดมิน', '(Treasurer / Admin)');
proc('p1', '1.0', 'จัดการข้อมูลผู้ใช้\nและเข้าสู่ระบบ');
proc('p2', '2.0', 'ดำเนินการเรียกเก็บเงิน\nและชำระเงิน');
proc('p3', '3.0', 'จัดการประกาศ\nและตรวจสอบสลิป');
proc('p4', '4.0', 'จัดทำรายงาน\nและประวัติการเงิน');
store(500, 380, 280, 'D1', 'แฟ้มข้อมูลผู้ใช้งาน');
store(700, 630, 200, 'D2', 'แฟ้มข้อมูลประกาศ');
store(380, 960, 280, 'D3', 'แฟ้มข้อมูลการชำระเงิน');
store(940, 960, 300, 'D4', 'แฟ้มข้อมูลเงินกองกลางและเงินรุ่น');

const caption = text(W / 2, H - 70, 'DFD Level 0', 22, true) +
  text(W / 2, H - 40, 'ระบบบริหารจัดการการชำระเงินและเงินกองกลางนักศึกษา (CampusPay)', 16, false);

const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>DFD Level 0 - CampusPay</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');
body{margin:0;background:#fff}svg{font-family:'Sarabun','Leelawadee UI',Tahoma,sans-serif}</style></head><body>
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="a" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,1 L9,5 L0,9 z" fill="#000"/></marker></defs>
<rect x="20" y="110" width="${W - 40}" height="1260" fill="none" stroke="#000" stroke-width="1.5"/>
${lines}${shapes}${labels}${caption}</svg></body></html>`;

const h = path.join(dir, 'dfd_level0.html'), p = path.join(dir, 'dfd_level0.png');
fs.writeFileSync(h, html, 'utf8');
execSync(`"${edge}" --headless=new --disable-gpu --hide-scrollbars --window-size=${W},${H} --screenshot="${p.replace(/\\/g, '/')}" "file:///${h.replace(/\\/g, '/')}"`);
console.log('Saved', p);
