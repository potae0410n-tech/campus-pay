const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const diagramsDir = __dirname;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const baseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: #ffffff;
    font-family: 'Sarabun', 'Leelawadee UI', Tahoma, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1200px;
    height: 1700px;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  svg {
    width: 1200px;
    height: 1700px;
  }
  text {
    font-family: 'Sarabun', 'Leelawadee UI', Tahoma, sans-serif;
    user-select: none;
  }
  .halo {
    paint-order: stroke fill;
    stroke: #ffffff;
    stroke-width: 6px;
    stroke-linejoin: round;
  }
`;

const defs = `
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000" />
    </marker>
  </defs>
  <rect x="70" y="60" width="1060" height="1460" fill="none" stroke="#000000" stroke-width="1.8" />
`;

// ====================================================================
// 1. DFD LEVEL 1 - PROCESS 1.0 (กระบวนการจัดการข้อมูลผู้ใช้และเข้าสู่ระบบ)
// ====================================================================
const p1Html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>DFD Level 1 - Process 1.0 - CampusPay</title>
  <style>${baseStyles}</style>
</head>
<body>
  <svg viewBox="0 0 1200 1700" xmlns="http://www.w3.org/2000/svg">
    ${defs}

    <!-- ENTITY: นักศึกษา (Student) -->
    <g id="entity-student">
      <rect x="90" y="470" width="180" height="110" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <text x="180" y="520" text-anchor="middle" font-size="23" font-weight="700" fill="#000">นักศึกษา</text>
      <text x="180" y="556" text-anchor="middle" font-size="17" font-weight="400" fill="#000">(Student)</text>
    </g>

    <!-- ENTITY: เหรัญญิก / แอดมิน (Treasurer / Admin) -->
    <g id="entity-admin">
      <rect x="930" y="470" width="180" height="110" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <text x="1020" y="520" text-anchor="middle" font-size="22" font-weight="700" fill="#000">เหรัญญิก / แอดมิน</text>
      <text x="1020" y="556" text-anchor="middle" font-size="17" font-weight="400" fill="#000">(Treasurer / Admin)</text>
    </g>

    <!-- PROCESS 1.1: ตรวจสอบการลงทะเบียน -->
    <g id="process-1-1">
      <circle cx="600" cy="220" r="74" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="526" y1="210" x2="674" y2="210" stroke="#000000" stroke-width="1.5" />
      <text x="600" y="192" text-anchor="middle" font-size="22" font-weight="700" fill="#000">1.1</text>
      <text x="600" y="238" text-anchor="middle" font-size="15" font-weight="600" fill="#000">ตรวจสอบ</text>
      <text x="600" y="262" text-anchor="middle" font-size="15" font-weight="600" fill="#000">การลงทะเบียน</text>
    </g>

    <!-- DATA STORE D1: แฟ้มข้อมูลผู้ใช้งาน -->
    <g id="datastore-d1">
      <rect x="475" y="360" width="250" height="40" fill="#ffffff" stroke="none" />
      <line x1="475" y1="360" x2="725" y2="360" stroke="#000000" stroke-width="1.8" />
      <line x1="475" y1="400" x2="725" y2="400" stroke="#000000" stroke-width="1.8" />
      <line x1="525" y1="360" x2="525" y2="400" stroke="#000000" stroke-width="1.5" />
      <text x="500" y="386" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D1</text>
      <text x="625" y="386" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">แฟ้มข้อมูลผู้ใช้งาน</text>
    </g>

    <!-- PROCESS 1.2: ตรวจสอบการเข้าสู่ระบบ -->
    <g id="process-1-2">
      <circle cx="600" cy="525" r="74" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="526" y1="515" x2="674" y2="515" stroke="#000000" stroke-width="1.5" />
      <text x="600" y="497" text-anchor="middle" font-size="22" font-weight="700" fill="#000">1.2</text>
      <text x="600" y="543" text-anchor="middle" font-size="15" font-weight="600" fill="#000">ตรวจสอบ</text>
      <text x="600" y="567" text-anchor="middle" font-size="15" font-weight="600" fill="#000">การเข้าสู่ระบบ</text>
    </g>

    <!-- PROCESS 1.3: จัดการเซสชันและออกจากระบบ -->
    <g id="process-1-3">
      <circle cx="600" cy="880" r="74" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="526" y1="870" x2="674" y2="870" stroke="#000000" stroke-width="1.5" />
      <text x="600" y="852" text-anchor="middle" font-size="22" font-weight="700" fill="#000">1.3</text>
      <text x="600" y="898" text-anchor="middle" font-size="15" font-weight="600" fill="#000">จัดการเซสชัน</text>
      <text x="600" y="922" text-anchor="middle" font-size="15" font-weight="600" fill="#000">และออกจากระบบ</text>
    </g>

    <!-- FLOWS FOR PROCESS 1.1 -->
    <!-- นักศึกษา -> 1.1 -->
    <path d="M 180 470 L 180 220 L 520 220" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="350" y="208" text-anchor="middle" font-size="13.5" fill="#000" class="halo">ข้อมูลลงทะเบียน นศ. (รหัส นศ./ชื่อ/รหัสผ่าน)</text>

    <!-- แอดมิน -> 1.1 -->
    <path d="M 1020 470 L 1020 220 L 680 220" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="850" y="208" text-anchor="middle" font-size="13.5" fill="#000" class="halo">ข้อมูลแอดมิน / รหัสลับ (ADMIN_SECRET)</text>

    <!-- 1.1 -> D1 -->
    <path d="M 600 294 L 600 355" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="610" y="330" text-anchor="start" font-size="13" fill="#000" class="halo">บันทึกข้อมูลผู้ใช้</text>

    <!-- FLOWS FOR PROCESS 1.2 -->
    <!-- D1 -> 1.2 -->
    <path d="M 600 400 L 600 445" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="610" y="426" text-anchor="start" font-size="13" fill="#000" class="halo">ดึงรหัสผ่านตรวจสอบ (Bcrypt)</text>

    <!-- นักศึกษา <-> 1.2 -->
    <!-- นักศึกษา -> 1.2 เข้าสู่ระบบ -->
    <path d="M 270 500 L 520 500" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="395" y="488" text-anchor="middle" font-size="12.5" fill="#000" class="halo">เข้าสู่ระบบ (รหัส นศ./รหัสผ่าน)</text>

    <!-- 1.2 -> นักศึกษา สิทธิ์การใช้งาน -->
    <path d="M 526 550 L 275 550" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="395" y="572" text-anchor="middle" font-size="12.5" fill="#000" class="halo">สิทธิ์การใช้งาน (STUDENT Session)</text>

    <!-- แอดมิน <-> 1.2 -->
    <!-- แอดมิน -> 1.2 เข้าสู่ระบบ -->
    <path d="M 930 500 L 680 500" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="805" y="488" text-anchor="middle" font-size="12.5" fill="#000" class="halo">เข้าสู่ระบบ (แอดมิน/รหัสผ่าน)</text>

    <!-- 1.2 -> แอดมิน สิทธิ์การใช้งาน -->
    <path d="M 674 550 L 925 550" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="805" y="572" text-anchor="middle" font-size="12.5" fill="#000" class="halo">สิทธิ์การใช้งาน (ADMIN Session)</text>

    <!-- FLOWS FOR PROCESS 1.3 -->
    <!-- นักศึกษา -> 1.3 -->
    <path d="M 180 580 L 180 880 L 520 880" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="350" y="868" text-anchor="middle" font-size="13.5" fill="#000" class="halo">คำขอออกจากระบบ (นศ.)</text>

    <!-- แอดมิน -> 1.3 -->
    <path d="M 1020 580 L 1020 880 L 680 880" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="850" y="868" text-anchor="middle" font-size="13.5" fill="#000" class="halo">คำขอออกจากระบบ (เหรัญญิก)</text>

    <!-- CAPTION -->
    <text x="600" y="1575" text-anchor="middle" font-size="26" font-weight="700" fill="#000">DFD Level 1: Process 1.0</text>
    <text x="600" y="1612" text-anchor="middle" font-size="19" font-weight="400" fill="#000">กระบวนการจัดการข้อมูลผู้ใช้และเข้าสู่ระบบ (CampusPay)</text>
  </svg>
</body>
</html>
`;

// ====================================================================
// 2. DFD LEVEL 1 - PROCESS 2.0 (กระบวนการดำเนินงานเรียกเก็บเงินและชำระเงิน)
// ====================================================================
const p2Html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>DFD Level 1 - Process 2.0 - CampusPay</title>
  <style>${baseStyles}</style>
</head>
<body>
  <svg viewBox="0 0 1200 1700" xmlns="http://www.w3.org/2000/svg">
    ${defs}

    <!-- ENTITY: นักศึกษา (Student) -->
    <g id="entity-student">
      <rect x="80" y="470" width="180" height="110" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <text x="170" y="520" text-anchor="middle" font-size="23" font-weight="700" fill="#000">นักศึกษา</text>
      <text x="170" y="556" text-anchor="middle" font-size="17" font-weight="400" fill="#000">(Student)</text>
    </g>

    <!-- DATA STORE D2: แฟ้มข้อมูลประกาศเรียกเก็บเงิน -->
    <g id="datastore-d2">
      <rect x="760" y="181" width="250" height="38" fill="#ffffff" stroke="none" />
      <line x1="760" y1="181" x2="1010" y2="181" stroke="#000000" stroke-width="1.8" />
      <line x1="760" y1="219" x2="1010" y2="219" stroke="#000000" stroke-width="1.8" />
      <line x1="805" y1="181" x2="805" y2="219" stroke="#000000" stroke-width="1.5" />
      <text x="782" y="206" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D2</text>
      <text x="908" y="206" text-anchor="middle" font-size="14" font-weight="600" fill="#000">แฟ้มข้อมูลประกาศเรียกเก็บเงิน</text>
    </g>

    <!-- DATA STORE D1: แฟ้มข้อมูลผู้ใช้งาน (วางระหว่าง 2.1 และ 2.2 เพื่อลดความซับซ้อน) -->
    <g id="datastore-d1">
      <rect x="365" y="340" width="230" height="38" fill="#ffffff" stroke="none" />
      <line x1="365" y1="340" x2="595" y2="340" stroke="#000000" stroke-width="1.8" />
      <line x1="365" y1="378" x2="595" y2="378" stroke="#000000" stroke-width="1.8" />
      <line x1="410" y1="340" x2="410" y2="378" stroke="#000000" stroke-width="1.5" />
      <text x="387" y="365" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D1</text>
      <text x="502" y="365" text-anchor="middle" font-size="14" font-weight="600" fill="#000">แฟ้มข้อมูลผู้ใช้งาน</text>
    </g>

    <!-- DATA STORE D3: แฟ้มข้อมูลการชำระเงิน -->
    <g id="datastore-d3">
      <rect x="760" y="681" width="250" height="38" fill="#ffffff" stroke="none" />
      <line x1="760" y1="681" x2="1010" y2="681" stroke="#000000" stroke-width="1.8" />
      <line x1="760" y1="719" x2="1010" y2="719" stroke="#000000" stroke-width="1.8" />
      <line x1="805" y1="681" x2="805" y2="719" stroke="#000000" stroke-width="1.5" />
      <text x="782" y="706" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D3</text>
      <text x="908" y="706" text-anchor="middle" font-size="14" font-weight="600" fill="#000">แฟ้มข้อมูลการชำระเงิน</text>
    </g>

    <!-- PROCESS 2.1: ดึงประกาศและสร้าง QR พร้อมเพย์ -->
    <g id="process-2-1">
      <circle cx="480" cy="200" r="74" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="406" y1="190" x2="554" y2="190" stroke="#000000" stroke-width="1.5" />
      <text x="480" y="172" text-anchor="middle" font-size="22" font-weight="700" fill="#000">2.1</text>
      <text x="480" y="218" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">ดึงข้อมูลประกาศ</text>
      <text x="480" y="242" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">และสร้าง QR พร้อมเพย์</text>
    </g>

    <!-- PROCESS 2.2: บันทึกหลักฐานสลิปโอนเงิน -->
    <g id="process-2-2">
      <circle cx="480" cy="490" r="74" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="406" y1="480" x2="554" y2="480" stroke="#000000" stroke-width="1.5" />
      <text x="480" y="462" text-anchor="middle" font-size="22" font-weight="700" fill="#000">2.2</text>
      <text x="480" y="508" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">บันทึกหลักฐาน</text>
      <text x="480" y="532" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">สลิปโอนเงิน</text>
    </g>

    <!-- PROCESS 2.3: แก้ไขหลักฐานสลิปโอนเงิน -->
    <g id="process-2-3">
      <circle cx="480" cy="780" r="74" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="406" y1="770" x2="554" y2="770" stroke="#000000" stroke-width="1.5" />
      <text x="480" y="752" text-anchor="middle" font-size="22" font-weight="700" fill="#000">2.3</text>
      <text x="480" y="798" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">แก้ไขหลักฐาน</text>
      <text x="480" y="822" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">สลิปโอนเงิน</text>
    </g>

    <!-- PROCESS 2.4: ตรวจสอบสถานะการชำระเงิน -->
    <g id="process-2-4">
      <circle cx="480" cy="1060" r="74" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="406" y1="1050" x2="554" y2="1050" stroke="#000000" stroke-width="1.5" />
      <text x="480" y="1032" text-anchor="middle" font-size="22" font-weight="700" fill="#000">2.4</text>
      <text x="480" y="1078" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">ตรวจสอบสถานะ</text>
      <text x="480" y="1102" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">การชำระเงิน</text>
    </g>

    <!-- FLOWS -->
    <!-- D2 -> 2.1 (แนวนอนตรง) -->
    <path d="M 760 200 L 560 200" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="660" y="188" text-anchor="middle" font-size="13" fill="#000" class="halo">ข้อมูลประกาศ / ยอดเงิน</text>

    <!-- 2.1 -> นักศึกษา -->
    <path d="M 406 200 L 170 200 L 170 465" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="280" y="188" text-anchor="middle" font-size="13" fill="#000" class="halo">ข้อมูลประกาศ / QR พร้อมเพย์</text>

    <!-- D1 -> 2.2 (เส้นตรงดิ่งลง) -->
    <path d="M 480 378 L 480 410" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="490" y="398" text-anchor="start" font-size="12.5" fill="#000" class="halo">ข้อมูลนักศึกษา</text>

    <!-- นักศึกษา -> 2.2 (แนวนอนตรง) -->
    <path d="M 260 490 L 400 490" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="330" y="478" text-anchor="middle" font-size="12.5" fill="#000" class="halo">ส่งสลิปโอนเงิน</text>

    <!-- 2.2 -> D3 (ออกขวาแล้วลง) -->
    <path d="M 554 490 L 670 490 L 670 690 L 755 690" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="660" y="478" text-anchor="middle" font-size="13" fill="#000" class="halo">บันทึกสลิป (สถานะ PENDING)</text>

    <!-- นักศึกษา -> 2.3 -->
    <path d="M 210 580 L 210 780 L 400 780" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="300" y="768" text-anchor="middle" font-size="13" fill="#000" class="halo">แก้ไขสลิปโอนเงิน</text>

    <!-- 2.3 -> D3 (ออกขวาแล้วขึ้นเข้า D3) -->
    <path d="M 554 780 L 710 780 L 710 710 L 755 710" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="635" y="798" text-anchor="middle" font-size="13" fill="#000" class="halo">อัปเดตสลิปใหม่</text>

    <!-- D3 -> 2.4 (ออกจาก D3 ลงล่างไป 2.4) -->
    <path d="M 885 719 L 885 1060 L 560 1060" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="730" y="1048" text-anchor="middle" font-size="13" fill="#000" class="halo">ดึงสถานะชำระเงิน</text>

    <!-- 2.4 -> นักศึกษา -->
    <path d="M 406 1060 L 120 1060 L 120 585" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="260" y="1048" text-anchor="middle" font-size="13" fill="#000" class="halo">ผลการตรวจ (รอตรวจ / อนุมัติ / ปฏิเสธ)</text>

    <!-- CAPTION -->
    <text x="600" y="1575" text-anchor="middle" font-size="26" font-weight="700" fill="#000">DFD Level 1: Process 2.0</text>
    <text x="600" y="1612" text-anchor="middle" font-size="19" font-weight="400" fill="#000">กระบวนการดำเนินการเรียกเก็บเงินและชำระเงิน (CampusPay)</text>
  </svg>
</body>
</html>
`;

// ====================================================================
// 3. DFD LEVEL 1 - PROCESS 3.0 (กระบวนการจัดการประกาศและตรวจสอบสลิป)
// ====================================================================
const p3Html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>DFD Level 1 - Process 3.0 - CampusPay</title>
  <style>${baseStyles}</style>
</head>
<body>
  <svg viewBox="0 0 1200 1700" xmlns="http://www.w3.org/2000/svg">
    ${defs}

    <!-- ENTITY: เหรัญญิก / แอดมิน (Treasurer / Admin) -->
    <g id="entity-admin">
      <rect x="910" y="490" width="200" height="110" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <text x="1010" y="540" text-anchor="middle" font-size="22" font-weight="700" fill="#000">เหรัญญิก / แอดมิน</text>
      <text x="1010" y="576" text-anchor="middle" font-size="17" font-weight="400" fill="#000">(Treasurer / Admin)</text>
    </g>

    <!-- DATA STORE D2: แฟ้มข้อมูลประกาศ -->
    <g id="datastore-d2">
      <rect x="110" y="181" width="230" height="38" fill="#ffffff" stroke="none" />
      <line x1="110" y1="181" x2="340" y2="181" stroke="#000000" stroke-width="1.8" />
      <line x1="110" y1="219" x2="340" y2="219" stroke="#000000" stroke-width="1.8" />
      <line x1="155" y1="181" x2="155" y2="219" stroke="#000000" stroke-width="1.5" />
      <text x="132" y="206" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D2</text>
      <text x="247" y="206" text-anchor="middle" font-size="14" font-weight="600" fill="#000">แฟ้มข้อมูลประกาศ</text>
    </g>

    <!-- DATA STORE D1: แฟ้มข้อมูลผู้ใช้งาน -->
    <g id="datastore-d1">
      <rect x="110" y="320" width="230" height="38" fill="#ffffff" stroke="none" />
      <line x1="110" y1="320" x2="340" y2="320" stroke="#000000" stroke-width="1.8" />
      <line x1="110" y1="358" x2="340" y2="358" stroke="#000000" stroke-width="1.8" />
      <line x1="155" y1="320" x2="155" y2="358" stroke="#000000" stroke-width="1.5" />
      <text x="132" y="345" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D1</text>
      <text x="247" y="345" text-anchor="middle" font-size="14" font-weight="600" fill="#000">แฟ้มข้อมูลผู้ใช้งาน</text>
    </g>

    <!-- DATA STORE D3: แฟ้มข้อมูลการชำระเงิน (ตรงแนวนอนกับ 3.2 พอดี) -->
    <g id="datastore-d3">
      <rect x="110" y="526" width="230" height="38" fill="#ffffff" stroke="none" />
      <line x1="110" y1="526" x2="340" y2="526" stroke="#000000" stroke-width="1.8" />
      <line x1="110" y1="564" x2="340" y2="564" stroke="#000000" stroke-width="1.8" />
      <line x1="155" y1="526" x2="155" y2="564" stroke="#000000" stroke-width="1.5" />
      <text x="132" y="551" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D3</text>
      <text x="247" y="551" text-anchor="middle" font-size="14" font-weight="600" fill="#000">แฟ้มข้อมูลการชำระเงิน</text>
    </g>

    <!-- DATA STORE D4: แฟ้มข้อมูลเงินกองกลางและเงินรุ่น (ตรงแนวนอนกับ 3.3 พอดี) -->
    <g id="datastore-d4">
      <rect x="110" y="861" width="250" height="38" fill="#ffffff" stroke="none" />
      <line x1="110" y1="861" x2="360" y2="861" stroke="#000000" stroke-width="1.8" />
      <line x1="110" y1="899" x2="360" y2="899" stroke="#000000" stroke-width="1.8" />
      <line x1="155" y1="861" x2="155" y2="899" stroke="#000000" stroke-width="1.5" />
      <text x="132" y="886" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D4</text>
      <text x="257" y="886" text-anchor="middle" font-size="13.5" font-weight="600" fill="#000">แฟ้มข้อมูลเงินกองกลางและเงินรุ่น</text>
    </g>

    <!-- PROCESS 3.1: สร้างประกาศเรียกเก็บเงิน -->
    <g id="process-3-1">
      <circle cx="560" cy="200" r="74" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="486" y1="190" x2="634" y2="190" stroke="#000000" stroke-width="1.5" />
      <text x="560" y="172" text-anchor="middle" font-size="22" font-weight="700" fill="#000">3.1</text>
      <text x="560" y="218" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">สร้างประกาศ</text>
      <text x="560" y="242" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">เรียกเก็บเงิน</text>
    </g>

    <!-- PROCESS 3.2: ตรวจสอบหลักฐานสลิปการโอนเงิน -->
    <g id="process-3-2">
      <circle cx="560" cy="545" r="74" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="486" y1="535" x2="634" y2="535" stroke="#000000" stroke-width="1.5" />
      <text x="560" y="517" text-anchor="middle" font-size="22" font-weight="700" fill="#000">3.2</text>
      <text x="560" y="563" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">ตรวจสอบหลักฐาน</text>
      <text x="560" y="587" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">สลิปการโอนเงิน</text>
    </g>

    <!-- PROCESS 3.3: บันทึกผลการตรวจสลิป -->
    <g id="process-3-3">
      <circle cx="560" cy="880" r="74" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="486" y1="870" x2="634" y2="870" stroke="#000000" stroke-width="1.5" />
      <text x="560" y="852" text-anchor="middle" font-size="22" font-weight="700" fill="#000">3.3</text>
      <text x="560" y="898" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">บันทึกผลการตรวจสลิป</text>
      <text x="560" y="922" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">(อนุมัติ / ปฏิเสธ)</text>
    </g>

    <!-- FLOWS -->
    <!-- เหรัญญิก -> 3.1 -->
    <path d="M 1010 490 L 1010 200 L 640 200" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="825" y="188" text-anchor="middle" font-size="13.5" fill="#000" class="halo">ข้อมูลประกาศ / ยอดเงิน / วันครบกำหนด</text>

    <!-- 3.1 -> D2 (แนวนอนตรง) -->
    <path d="M 486 200 L 345 200" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="415" y="188" text-anchor="middle" font-size="13" fill="#000" class="halo">บันทึกประกาศ</text>

    <!-- D1 -> 3.1 -->
    <path d="M 340 339 L 430 339 L 430 250 L 490 250" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="390" y="328" text-anchor="middle" font-size="12.5" fill="#000" class="halo">ดึงรายชื่อ นศ.</text>

    <!-- 3.1 -> D3 -->
    <path d="M 530 273 L 530 440 L 225 440 L 225 520" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="375" y="428" text-anchor="middle" font-size="13" fill="#000" class="halo">สร้างรายการชำระตั้งต้น (UNPAID)</text>

    <!-- D3 -> 3.2 (แนวนอนตรง 100%) -->
    <path d="M 340 545 L 480 545" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="410" y="533" text-anchor="middle" font-size="13" fill="#000" class="halo">ดึงสลิปที่รอตรวจ</text>

    <!-- 3.2 -> เหรัญญิก (แนวนอนตรง 100%) -->
    <path d="M 634 545 L 905 545" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="770" y="533" text-anchor="middle" font-size="13" fill="#000" class="halo">รายการสลิปและหลักฐานโอนเงิน</text>

    <!-- เหรัญญิก -> 3.3 -->
    <path d="M 1010 600 L 1010 880 L 640 880" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="825" y="868" text-anchor="middle" font-size="13.5" fill="#000" class="halo">ผลตรวจ (อนุมัติ / ปฏิเสธ + เหตุผล)</text>

    <!-- 3.3 -> D3 (ขึ้นเข้าใต้ D3) -->
    <path d="M 530 807 L 530 660 L 225 660 L 225 570" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="375" y="648" text-anchor="middle" font-size="13" fill="#000" class="halo">อัปเดตสถานะชำระเงิน</text>

    <!-- 3.3 -> D4 (แนวนอนตรง 100%) -->
    <path d="M 486 880 L 365 880" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="425" y="868" text-anchor="middle" font-size="13" fill="#000" class="halo">อัปเดตยอดเข้ากองกลาง</text>

    <!-- CAPTION -->
    <text x="600" y="1575" text-anchor="middle" font-size="26" font-weight="700" fill="#000">DFD Level 1: Process 3.0</text>
    <text x="600" y="1612" text-anchor="middle" font-size="19" font-weight="400" fill="#000">กระบวนการจัดการประกาศและตรวจสอบสลิป (CampusPay)</text>
  </svg>
</body>
</html>
`;

// ====================================================================
// 4. DFD LEVEL 1 - PROCESS 4.0 (กระบวนการจัดทำรายงานและประวัติการเงิน)
// ====================================================================
const p4Html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>DFD Level 1 - Process 4.0 - CampusPay</title>
  <style>${baseStyles}</style>
</head>
<body>
  <svg viewBox="0 0 1200 1700" xmlns="http://www.w3.org/2000/svg">
    ${defs}

    <!-- ROW 1 (TOP): STUDENT & PERSONAL PAYMENT HISTORY -->
    <!-- ENTITY: นักศึกษา -->
    <g id="entity-student">
      <rect x="80" y="195" width="180" height="110" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <text x="170" y="245" text-anchor="middle" font-size="23" font-weight="700" fill="#000">นักศึกษา</text>
      <text x="170" y="281" text-anchor="middle" font-size="17" font-weight="400" fill="#000">(Student)</text>
    </g>

    <!-- PROCESS 4.2: ออกรายงานประวัติชำระเงินส่วนบุคคล -->
    <g id="process-4-2">
      <circle cx="500" cy="250" r="74" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="426" y1="240" x2="574" y2="240" stroke="#000000" stroke-width="1.5" />
      <text x="500" y="222" text-anchor="middle" font-size="22" font-weight="700" fill="#000">4.2</text>
      <text x="500" y="268" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">ออกรายงานประวัติ</text>
      <text x="500" y="292" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">ชำระเงินส่วนบุคคล</text>
    </g>

    <!-- DATA STORE D3: แฟ้มข้อมูลการชำระเงิน -->
    <g id="datastore-d3">
      <rect x="750" y="231" width="240" height="38" fill="#ffffff" stroke="none" />
      <line x1="750" y1="231" x2="990" y2="231" stroke="#000000" stroke-width="1.8" />
      <line x1="750" y1="269" x2="990" y2="269" stroke="#000000" stroke-width="1.8" />
      <line x1="795" y1="231" x2="795" y2="269" stroke="#000000" stroke-width="1.5" />
      <text x="772" y="256" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D3</text>
      <text x="892" y="256" text-anchor="middle" font-size="14" font-weight="600" fill="#000">แฟ้มข้อมูลการชำระเงิน</text>
    </g>

    <!-- ROW 2 (MIDDLE): ADMIN & GENERAL FUND ADJUSTMENT -->
    <!-- DATA STORE D4: แฟ้มข้อมูลเงินกองกลางและเงินรุ่น -->
    <g id="datastore-d4">
      <rect x="80" y="561" width="250" height="38" fill="#ffffff" stroke="none" />
      <line x1="80" y1="561" x2="330" y2="561" stroke="#000000" stroke-width="1.8" />
      <line x1="80" y1="599" x2="330" y2="599" stroke="#000000" stroke-width="1.8" />
      <line x1="125" y1="561" x2="125" y2="599" stroke="#000000" stroke-width="1.5" />
      <text x="102" y="586" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D4</text>
      <text x="227" y="586" text-anchor="middle" font-size="13.5" font-weight="600" fill="#000">แฟ้มข้อมูลเงินกองกลางและเงินรุ่น</text>
    </g>

    <!-- PROCESS 4.1: ปรับปรุงยอดเงินกองกลางและเงินรุ่น -->
    <g id="process-4-1">
      <circle cx="500" cy="580" r="74" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="426" y1="570" x2="574" y2="570" stroke="#000000" stroke-width="1.5" />
      <text x="500" y="552" text-anchor="middle" font-size="22" font-weight="700" fill="#000">4.1</text>
      <text x="500" y="596" text-anchor="middle" font-size="14" font-weight="600" fill="#000">ปรับปรุงยอดเงิน</text>
      <text x="500" y="620" text-anchor="middle" font-size="14" font-weight="600" fill="#000">กองกลางและเงินรุ่น</text>
    </g>

    <!-- ENTITY: เหรัญญิก / แอดมิน -->
    <g id="entity-admin">
      <rect x="750" y="525" width="200" height="110" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <text x="850" y="575" text-anchor="middle" font-size="22" font-weight="700" fill="#000">เหรัญญิก / แอดมิน</text>
      <text x="850" y="611" text-anchor="middle" font-size="17" font-weight="400" fill="#000">(Treasurer / Admin)</text>
    </g>

    <!-- ROW 3 (BOTTOM): OVERALL SUMMARY REPORT -->
    <!-- PROCESS 4.3: สรุปรายงานสถานะการเงินและประวัติทั้งหมด -->
    <g id="process-4-3">
      <circle cx="500" cy="940" r="80" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="420" y1="930" x2="580" y2="930" stroke="#000000" stroke-width="1.5" />
      <text x="500" y="910" text-anchor="middle" font-size="22" font-weight="700" fill="#000">4.3</text>
      <text x="500" y="958" text-anchor="middle" font-size="15" font-weight="600" fill="#000">สรุปรายงานสถานะการเงิน</text>
      <text x="500" y="982" text-anchor="middle" font-size="15" font-weight="600" fill="#000">และประวัติทั้งหมด</text>
    </g>

    <!-- FLOWS -->
    <!-- ROW 1 FLOWS: D3 -> 4.2 -> นักศึกษา (แนวนอนตรง 100%) -->
    <path d="M 750 250 L 580 250" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="665" y="238" text-anchor="middle" font-size="13" fill="#000" class="halo">ดึงประวัติชำระเงินเฉพาะบุคคล</text>

    <path d="M 426 250 L 265 250" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="345" y="238" text-anchor="middle" font-size="13" fill="#000" class="halo">ประวัติชำระเงินและใบเสร็จ</text>

    <!-- ROW 2 FLOWS: เหรัญญิก -> 4.1 -> D4 (แนวนอนตรง 100%) -->
    <path d="M 750 580 L 580 580" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="665" y="568" text-anchor="middle" font-size="13" fill="#000" class="halo">ข้อมูลปรับปรุงยอดเงิน</text>

    <path d="M 426 580 L 335 580" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="380" y="568" text-anchor="middle" font-size="13" fill="#000" class="halo">บันทึกยอดเงินคงเหลือ</text>

    <!-- ROW 3 FLOWS: D4 -> 4.3 (ทางซ้าย) -->
    <path d="M 205 599 L 205 940 L 415 940" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="310" y="928" text-anchor="middle" font-size="13" fill="#000" class="halo">ยอดเงินกองกลางและเงินรุ่น</text>

    <!-- 4.3 -> เหรัญญิก (วิ่งออกขวาแล้วขึ้นตรงเข้าใต้แอดมิน ที่ x=850) -->
    <path d="M 580 930 L 850 930 L 850 640" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="715" y="898" text-anchor="middle" font-size="12.5" fill="#000" class="halo">รายงานสรุปสถานะการเงิน</text>
    <text x="715" y="918" text-anchor="middle" font-size="12.5" fill="#000" class="halo">ประวัติชำระทั้งหมด / ยอดกองกลาง</text>

    <!-- D3 -> 4.3 (วิ่งลงทางขวา อ้อมขวาสุดที่ x=1050 ลงไปใต้ 4.3 ที่ y=1040 แล้วเลี้ยวเข้าใต้ 4.3 - ไม่ตัดกับเส้นใดๆ 100%) -->
    <path d="M 990 250 L 1050 250 L 1050 1040 L 500 1040 L 500 1025" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="760" y="1030" text-anchor="middle" font-size="13" fill="#000" class="halo">ข้อมูลประวัติชำระเงินทั้งหมด</text>

    <!-- CAPTION -->
    <text x="600" y="1575" text-anchor="middle" font-size="26" font-weight="700" fill="#000">DFD Level 1: Process 4.0</text>
    <text x="600" y="1612" text-anchor="middle" font-size="19" font-weight="400" fill="#000">กระบวนการจัดทำรายงานและประวัติการเงิน (CampusPay)</text>
  </svg>
</body>
</html>
`;

// Save HTML files
fs.writeFileSync(path.join(diagramsDir, 'dfd_level1_process1.html'), p1Html, 'utf8');
fs.writeFileSync(path.join(diagramsDir, 'dfd_level1_process2.html'), p2Html, 'utf8');
fs.writeFileSync(path.join(diagramsDir, 'dfd_level1_process3.html'), p3Html, 'utf8');
fs.writeFileSync(path.join(diagramsDir, 'dfd_level1_process4.html'), p4Html, 'utf8');
console.log('Saved 4 polished DFD Level 1 HTML files.');

// Render to PNG
const targets = [
  { name: 'Process 1.0', html: 'dfd_level1_process1.html', png: 'dfd_level1_process1.png', desk: '..\\DFD_Level1_Process1_CampusPay.png' },
  { name: 'Process 2.0', html: 'dfd_level1_process2.html', png: 'dfd_level1_process2.png', desk: '..\\DFD_Level1_Process2_CampusPay.png' },
  { name: 'Process 3.0', html: 'dfd_level1_process3.html', png: 'dfd_level1_process3.png', desk: '..\\DFD_Level1_Process3_CampusPay.png' },
  { name: 'Process 4.0', html: 'dfd_level1_process4.html', png: 'dfd_level1_process4.png', desk: '..\\DFD_Level1_Process4_CampusPay.png' },
];

for (const t of targets) {
  const htmlFile = path.join(diagramsDir, t.html).replace(/\\/g, '/');
  const pngFile = path.join(diagramsDir, t.png).replace(/\\/g, '/');
  console.log('Rendering ' + t.name + '...');
  execSync('"' + edgePath + '" --headless=new --disable-gpu --window-size=1200,1700 --screenshot="' + pngFile + '" "file:///' + htmlFile + '"');
  fs.copyFileSync(path.join(diagramsDir, t.png), path.join(diagramsDir, t.desk));
  console.log('Copied ' + t.name + ' to Desktop folder.');
}

console.log('All 4 DFD Level 1 diagrams rendered and copied successfully!');
