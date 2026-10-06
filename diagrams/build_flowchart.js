const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = __dirname;
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const W = 1440, H = 1660;
let s = '';

const txt = (x, y, t, size = 17, bold = false) => {
  const lines = t.split('\n');
  const off = (lines.length - 1) * (size + 4) / 2;
  lines.forEach((l, i) => {
    s += `<text x="${x}" y="${y - off + i * (size + 4)}" font-size="${size}" ${bold ? 'font-weight="700"' : ''} text-anchor="middle" dominant-baseline="middle">${l}</text>`;
  });
};
const oval = (cx, cy, t, w = 200, h = 54) => { s += `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${h / 2}" class="sh"/>`; txt(cx, cy, t, 18, true); };
const rect = (cx, cy, t, w = 260, h = 64) => { s += `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" class="sh"/>`; txt(cx, cy, t); };
const para = (cx, cy, t, w = 270, h = 64) => { const k = 18; s += `<polygon points="${cx - w / 2 + k},${cy - h / 2} ${cx + w / 2 + k},${cy - h / 2} ${cx + w / 2 - k},${cy + h / 2} ${cx - w / 2 - k},${cy + h / 2}" class="sh"/>`; txt(cx, cy, t); };
const dia = (cx, cy, t, w = 230, h = 100) => { s += `<polygon points="${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}" class="sh"/>`; txt(cx, cy, t, 16); };
const arr = (pts, label, lx, ly) => {
  s += `<polyline points="${pts.map(p => p.join(',')).join(' ')}" class="ln" marker-end="url(#a)"/>`;
  if (label) txt(lx, ly, label, 15, true);
};

const C = 720, L = 380, R = 1040;

// ส่วนเข้าสู่ระบบ
oval(C, 50, 'เริ่มต้น');
rect(C, 140, 'เปิดเว็บไซต์ CampusPay');
para(C, 240, 'กรอกรหัสนักศึกษา/ชื่อผู้ใช้\nและรหัสผ่าน');
dia(C, 365, 'ข้อมูลถูกต้อง?');
rect(1130, 365, 'แสดงข้อความ\nแจ้งข้อผิดพลาด', 220, 64);
dia(C, 500, 'บทบาทผู้ใช้\n= ADMIN?');

arr([[C, 77], [C, 108]]);
arr([[C, 172], [C, 208]]);
arr([[C, 272], [C, 315]]);
arr([[C + 115, 365], [1020, 365]], 'ไม่ใช่', 905, 350);
arr([[1130, 333], [1130, 240], [C + 145, 240]]);
arr([[C, 415], [C, 450]], 'ใช่', C + 22, 432);
arr([[C - 115, 500], [L, 500], [L, 578]], 'ไม่ใช่ (นักศึกษา)', 520, 484);
arr([[C + 115, 500], [R, 500], [R, 578]], 'ใช่ (เหรัญญิก)', 915, 484);

// ฝั่งนักศึกษา
rect(L, 610, 'แสดงแดชบอร์ดนักศึกษา\n(รายการค้างชำระ)');
rect(L, 720, 'เลือกประกาศเรียกเก็บเงิน');
rect(L, 830, 'แสดงยอดเงิน เลขบัญชี\nและ QR Code พร้อมเพย์');
para(L, 940, 'อัปโหลดภาพสลิปโอนเงิน');
dia(L, 1065, 'ไฟล์ภาพ\nถูกต้อง?');
rect(L, 1195, 'บันทึกสลิปลงตาราง Payment\nสถานะ = PENDING', 290);
rect(L, 1305, 'ตรวจสอบสถานะ\nและประวัติการชำระเงิน');

arr([[L, 642], [L, 688]]);
arr([[L, 752], [L, 798]]);
arr([[L, 862], [L, 908]]);
arr([[L, 972], [L, 1015]]);
arr([[L - 115, 1065], [120, 1065], [120, 940], [L - 150, 940]], 'ไม่ใช่', 175, 1050);
arr([[L, 1115], [L, 1163]], 'ใช่', L + 22, 1138);
arr([[L, 1227], [L, 1273]]);

// ฝั่งเหรัญญิก
rect(R, 610, 'แสดงแดชบอร์ดผู้ดูแล\n(คำนวณยอดรายรับ/คงเหลือ)', 290);
para(R, 720, 'กรอกข้อมูลประกาศ ยอดเงิน\nบัญชี และวันครบกำหนด', 290);
rect(R, 830, 'บันทึกประกาศลงตาราง\nAnnouncement', 290);
rect(R, 940, 'เปิดรายการสลิป\nที่รอตรวจสอบ (PENDING)', 290);
dia(R, 1065, 'สลิปถูกต้อง?');
rect(R - 70, 1195, 'อัปเดตสถานะ\n= APPROVED', 200);
rect(1290, 1195, 'ระบุเหตุผล\nสถานะ = REJECTED', 210);
rect(R, 1305, 'ปรับปรุงยอดเงินกองกลาง\nและเงินรุ่น (GeneralFund)', 290);

arr([[R, 642], [R, 688]]);
arr([[R, 752], [R, 798]]);
arr([[R, 862], [R, 908]]);
arr([[R, 972], [R, 1015]]);
arr([[R, 1115], [R, 1140], [R - 70, 1140], [R - 70, 1163]], 'ใช่', R + 22, 1130);
arr([[R + 115, 1065], [1290, 1065], [1290, 1163]], 'ไม่ใช่', 1215, 1050);
arr([[R - 70, 1227], [R - 70, 1273]]);
arr([[1290, 1227], [1290, 1250], [R + 100, 1250], [R + 100, 1273]]);

// รวม → ออกจากระบบ
rect(C, 1450, 'ออกจากระบบ\n(ลบ Session Cookie)');
oval(C, 1570, 'สิ้นสุด');
arr([[L, 1337], [L, 1450], [C - 130, 1450]]);
arr([[R, 1337], [R, 1450], [C + 130, 1450]]);
arr([[C, 1482], [C, 1543]]);

const html = `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><title>Flowchart CampusPay</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');
body{margin:0;background:#fff}svg{font-family:'Sarabun','Leelawadee UI',Tahoma,sans-serif}
.sh{fill:#fff;stroke:#000;stroke-width:2}.ln{fill:none;stroke:#000;stroke-width:2}</style></head><body>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="a" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker></defs>
${s}</svg></body></html>`;

const h = path.join(dir, 'flowchart.html'), p = path.join(dir, 'flowchart.png');
fs.writeFileSync(h, html, 'utf8');
execSync(`"${edge}" --headless=new --disable-gpu --hide-scrollbars --window-size=${W},${H} --screenshot="${p.replace(/\\/g, '/')}" "file:///${h.replace(/\\/g, '/')}"`);
console.log('Saved', p);
