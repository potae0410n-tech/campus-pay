const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = __dirname;
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const W = 1500, H = 900;
const CX = 750, CY = 430, R = 180;
let s = '';

const t = (x, y, str, size = 15, bold = false, anchor = 'middle') =>
  s += `<text x="${x}" y="${y}" font-size="${size}" ${bold ? 'font-weight="700"' : ''} text-anchor="${anchor}" dominant-baseline="middle">${str}</text>`;

// แต่ละกระแสข้อมูล = 1 เส้น
const studentIn = ['ข้อมูลการลงทะเบียน', 'ข้อมูลการเข้าสู่ระบบ', 'หลักฐานการชำระเงิน (สลิปโอนเงิน)'];
const studentOut = ['ข้อมูลประกาศการชำระเงิน', 'QR Code พร้อมเพย์สำหรับชำระเงิน', 'ผลการตรวจสอบสถานะการชำระเงิน', 'รายงานประวัติการชำระเงินส่วนบุคคล'];
const adminIn = ['ข้อมูลการเข้าสู่ระบบ (รหัสลับแอดมิน)', 'ข้อมูลการสร้างประกาศเรียกเก็บเงิน', 'ผลการตรวจสอบสลิป (อนุมัติ / ปฏิเสธ)', 'ข้อมูลยอดเงินกองกลางและเงินรุ่น'];
const adminOut = ['รายการสลิปและข้อมูลการชำระเงิน', 'รายงานสรุปสถานะการชำระเงิน', 'รายงานยอดเงินกองกลางและเงินรุ่นคงเหลือ', 'รายงานประวัติการทำรายการทั้งหมด'];

const BOX_W = 210, BOX_H = 420;
const LX = 40, RX = W - 40 - BOX_W;
const top = CY - BOX_H / 2;

function side(flows, isLeft) {
  const n = flows.length;
  const gap = 48;
  const y0 = CY - (gap * (n - 1)) / 2;
  flows.forEach(([label, toSystem], i) => {
    const y = y0 + i * gap;
    const dx = Math.sqrt(R * R - (y - CY) ** 2);
    const boxEdge = isLeft ? LX + BOX_W : RX;
    const circEdge = isLeft ? CX - dx : CX + dx;
    const [x1, x2] = toSystem ? [boxEdge, circEdge] : [circEdge, boxEdge];
    s += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" class="ln" marker-end="url(#a)"/>`;
    t((boxEdge + circEdge) / 2, y - 12, label, 14);
  });
}

const left = [...studentIn.map(l => [l, true]), ...studentOut.map(l => [l, false])];
const right = [...adminIn.map(l => [l, true]), ...adminOut.map(l => [l, false])];
side(left, true);
side(right, false);

// Entities & process
s += `<rect x="${LX}" y="${top}" width="${BOX_W}" height="${BOX_H}" class="sh"/>`;
t(LX + BOX_W / 2, CY - 14, 'นักศึกษา', 22, true);
t(LX + BOX_W / 2, CY + 18, '(Student)', 16);
s += `<rect x="${RX}" y="${top}" width="${BOX_W}" height="${BOX_H}" class="sh"/>`;
t(RX + BOX_W / 2, CY - 14, 'เหรัญญิก / แอดมิน', 22, true);
t(RX + BOX_W / 2, CY + 18, '(Treasurer / Admin)', 16);

s += `<circle cx="${CX}" cy="${CY}" r="${R}" class="sh"/>`;
t(CX, CY - 60, '0', 40, true);
t(CX, CY, 'ระบบบริหารจัดการการชำระเงิน', 19, true);
t(CX, CY + 30, 'และเงินกองกลางนักศึกษา', 19, true);
t(CX, CY + 64, '(CampusPay)', 16);

t(CX, H - 70, 'Context Diagram', 22, true);
t(CX, H - 40, 'ระบบบริหารจัดการการชำระเงินและเงินกองกลางนักศึกษา (CampusPay)', 16);

const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>Context Diagram</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');
body{margin:0;background:#fff}svg{font-family:'Sarabun','Leelawadee UI',Tahoma,sans-serif}
.sh{fill:#fff;stroke:#000;stroke-width:2}.ln{stroke:#000;stroke-width:1.6}</style></head><body>
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="a" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,1 L9,5 L0,9 z" fill="#000"/></marker></defs>
${s}</svg></body></html>`;

const h = path.join(dir, 'context_diagram.html'), p = path.join(dir, 'context_diagram.png');
fs.writeFileSync(h, html, 'utf8');
execSync(`"${edge}" --headless=new --disable-gpu --hide-scrollbars --window-size=${W},${H} --screenshot="${p.replace(/\\/g, '/')}" "file:///${h.replace(/\\/g, '/')}"`);
console.log('Saved', p);
