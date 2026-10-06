const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const diagramsDir = __dirname;

// =============================================================
// 1. CONTEXT DIAGRAM HTML
// =============================================================
const contextDiagramHtml = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>Context Diagram - CampusPay</title>
  <style>
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
  </style>
</head>
<body>
  <svg viewBox="0 0 1200 1700" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000" />
      </marker>
    </defs>

    <!-- Page Outer Frame -->
    <rect x="70" y="60" width="1060" height="1460" fill="none" stroke="#000000" stroke-width="1.8" />

    <!-- ==================== ENTITY: นักศึกษา (Student) ==================== -->
    <g id="entity-student">
      <rect x="110" y="715" width="220" height="130" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <text x="220" y="770" text-anchor="middle" font-size="25" font-weight="700" fill="#000">นักศึกษา</text>
      <text x="220" y="808" text-anchor="middle" font-size="19" font-weight="400" fill="#000">(Student)</text>
    </g>

    <!-- ==================== ENTITY: เหรัญญิก / แอดมิน ==================== -->
    <g id="entity-admin">
      <rect x="870" y="715" width="220" height="130" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <text x="980" y="770" text-anchor="middle" font-size="23" font-weight="700" fill="#000">เหรัญญิก / แอดมิน</text>
      <text x="980" y="808" text-anchor="middle" font-size="19" font-weight="400" fill="#000">(Treasurer / Admin)</text>
    </g>

    <!-- ==================== PROCESS 0 ==================== -->
    <g id="process-0">
      <circle cx="600" cy="780" r="165" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <text x="600" y="720" text-anchor="middle" font-size="42" font-weight="700" fill="#000">0</text>
      <text x="600" y="772" text-anchor="middle" font-size="21" font-weight="600" fill="#000">ระบบบริหารจัดการการชำระเงิน</text>
      <text x="600" y="806" text-anchor="middle" font-size="21" font-weight="600" fill="#000">และเงินกองกลางนักศึกษา</text>
      <text x="600" y="844" text-anchor="middle" font-size="19" font-weight="400" fill="#000">(CampusPay)</text>
    </g>

    <!-- ==================== FLOWS: นักศึกษา <-> PROCESS 0 ==================== -->
    <!-- Input: นักศึกษา -> Process 0 (Loop over top) -->
    <path d="M 220 715 L 220 430 L 520 430 L 520 625" fill="none" stroke="#000" stroke-width="1.6" marker-end="url(#arrow)" />
    <!-- Labels on Student Input Flow (Above line 430) -->
    <text x="370" y="340" text-anchor="middle" font-size="15" fill="#000" class="halo">ข้อมูลการลงทะเบียน / เข้าสู่ระบบ</text>
    <text x="370" y="370" text-anchor="middle" font-size="15" fill="#000" class="halo">หลักฐานการชำระเงิน (สลิปโอนเงิน)</text>
    <text x="370" y="400" text-anchor="middle" font-size="15" fill="#000" class="halo">ข้อมูลการแก้ไขสลิปโอนเงิน</text>

    <!-- Output: Process 0 -> นักศึกษา (Loop under bottom) -->
    <path d="M 520 935 L 520 1130 L 220 1130 L 220 855" fill="none" stroke="#000" stroke-width="1.6" marker-end="url(#arrow)" />
    <!-- Labels on Student Output Flow (Above line 1130) -->
    <text x="370" y="1010" text-anchor="middle" font-size="15" fill="#000" class="halo">ข้อมูลประกาศรายการชำระเงิน</text>
    <text x="370" y="1040" text-anchor="middle" font-size="15" fill="#000" class="halo">QR Code พร้อมเพย์สำหรับชำระเงิน</text>
    <text x="370" y="1070" text-anchor="middle" font-size="15" fill="#000" class="halo">ผลการตรวจสอบสถานะการชำระเงิน</text>
    <text x="370" y="1100" text-anchor="middle" font-size="15" fill="#000" class="halo">รายงานประวัติการชำระเงินส่วนบุคคล</text>

    <!-- ==================== FLOWS: เหรัญญิก <-> PROCESS 0 ==================== -->
    <!-- Input: เหรัญญิก -> Process 0 (Loop over top) -->
    <path d="M 980 715 L 980 430 L 680 430 L 680 625" fill="none" stroke="#000" stroke-width="1.6" marker-end="url(#arrow)" />
    <!-- Labels on Admin Input Flow (Above line 430) -->
    <text x="830" y="310" text-anchor="middle" font-size="15" fill="#000" class="halo">ข้อมูลการเข้าสู่ระบบ (รหัสลับแอดมิน)</text>
    <text x="830" y="340" text-anchor="middle" font-size="15" fill="#000" class="halo">ข้อมูลการสร้างประกาศเรียกเก็บเงิน</text>
    <text x="830" y="370" text-anchor="middle" font-size="15" fill="#000" class="halo">ผลการตรวจสอบสลิป (อนุมัติ / ปฏิเสธ)</text>
    <text x="830" y="400" text-anchor="middle" font-size="15" fill="#000" class="halo">ข้อมูลยอดเงินกองกลางและเงินรุ่น</text>

    <!-- Output: Process 0 -> เหรัญญิก (Loop under bottom) -->
    <path d="M 680 935 L 680 1130 L 980 1130 L 980 855" fill="none" stroke="#000" stroke-width="1.6" marker-end="url(#arrow)" />
    <!-- Labels on Admin Output Flow (Above line 1130) -->
    <text x="830" y="1010" text-anchor="middle" font-size="15" fill="#000" class="halo">รายการสลิปและข้อมูลการชำระเงิน</text>
    <text x="830" y="1040" text-anchor="middle" font-size="15" fill="#000" class="halo">รายงานสรุปสถานะการชำระเงิน</text>
    <text x="830" y="1070" text-anchor="middle" font-size="15" fill="#000" class="halo">รายงานยอดเงินกองกลางและเงินรุ่นคงเหลือ</text>
    <text x="830" y="1100" text-anchor="middle" font-size="15" fill="#000" class="halo">รายงานประวัติการทำรายการทั้งหมด</text>

    <!-- ==================== CAPTION / TITLE ==================== -->
    <text x="600" y="1575" text-anchor="middle" font-size="26" font-weight="700" fill="#000">Context Diagram</text>
    <text x="600" y="1612" text-anchor="middle" font-size="19" font-weight="400" fill="#000">ระบบบริหารจัดการการชำระเงินและเงินกองกลางนักศึกษา (CampusPay)</text>
  </svg>
</body>
</html>
`;

// =============================================================
// 2. DFD LEVEL 0 HTML (ZERO LINE CROSSINGS, SPACED PERFECTLY)
// =============================================================
const dfdLevel0Html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>DFD Level 0 - CampusPay</title>
  <style>
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
  </style>
</head>
<body>
  <svg viewBox="0 0 1200 1700" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#000" />
      </marker>
    </defs>

    <!-- Page Outer Frame -->
    <rect x="70" y="60" width="1060" height="1460" fill="none" stroke="#000000" stroke-width="1.8" />

    <!-- ==================== EXTERNAL ENTITIES ==================== -->
    <!-- 1. นักศึกษา (Student) -->
    <g id="entity-student">
      <rect x="80" y="500" width="180" height="110" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <text x="170" y="550" text-anchor="middle" font-size="23" font-weight="700" fill="#000">นักศึกษา</text>
      <text x="170" y="586" text-anchor="middle" font-size="17" font-weight="400" fill="#000">(Student)</text>
    </g>

    <!-- 2. เหรัญญิก / แอดมิน (Treasurer / Admin) -->
    <g id="entity-admin">
      <rect x="830" y="110" width="220" height="100" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <text x="940" y="155" text-anchor="middle" font-size="22" font-weight="700" fill="#000">เหรัญญิก / แอดมิน</text>
      <text x="940" y="190" text-anchor="middle" font-size="17" font-weight="400" fill="#000">(Treasurer / Admin)</text>
    </g>

    <!-- ==================== PROCESSES ==================== -->
    <!-- Process 1.0: จัดการข้อมูลผู้ใช้และเข้าสู่ระบบ -->
    <g id="process-1">
      <circle cx="580" cy="160" r="70" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="510" y1="150" x2="650" y2="150" stroke="#000000" stroke-width="1.5" />
      <text x="580" y="135" text-anchor="middle" font-size="22" font-weight="700" fill="#000">1.0</text>
      <text x="580" y="178" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">จัดการข้อมูลผู้ใช้</text>
      <text x="580" y="200" text-anchor="middle" font-size="14" font-weight="600" fill="#000">และเข้าสู่ระบบ</text>
    </g>

    <!-- Process 2.0: ดำเนินการเรียกเก็บเงินและชำระเงิน -->
    <g id="process-2">
      <circle cx="450" cy="555" r="75" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="375" y1="545" x2="525" y2="545" stroke="#000000" stroke-width="1.5" />
      <text x="450" y="528" text-anchor="middle" font-size="22" font-weight="700" fill="#000">2.0</text>
      <text x="450" y="575" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">ดำเนินการเรียกเก็บเงิน</text>
      <text x="450" y="598" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">และชำระเงิน</text>
    </g>

    <!-- Process 3.0: จัดการประกาศและตรวจสอบสลิป -->
    <g id="process-3">
      <circle cx="900" cy="555" r="75" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="825" y1="545" x2="975" y2="545" stroke="#000000" stroke-width="1.5" />
      <text x="900" y="528" text-anchor="middle" font-size="22" font-weight="700" fill="#000">3.0</text>
      <text x="900" y="575" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">จัดการประกาศ</text>
      <text x="900" y="598" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">และตรวจสอบสลิป</text>
    </g>

    <!-- Process 4.0: จัดทำรายงานและประวัติการเงิน -->
    <g id="process-4">
      <circle cx="600" cy="1120" r="85" fill="#ffffff" stroke="#000000" stroke-width="2" />
      <line x1="515" y1="1110" x2="685" y2="1110" stroke="#000000" stroke-width="1.5" />
      <text x="600" y="1090" text-anchor="middle" font-size="24" font-weight="700" fill="#000">4.0</text>
      <text x="600" y="1140" text-anchor="middle" font-size="16" font-weight="600" fill="#000">จัดทำรายงาน</text>
      <text x="600" y="1165" text-anchor="middle" font-size="16" font-weight="600" fill="#000">และประวัติการเงิน</text>
    </g>

    <!-- ==================== DATA STORES ==================== -->
    <!-- D1 แฟ้มข้อมูลผู้ใช้งาน -->
    <g id="datastore-d1">
      <rect x="330" y="330" width="230" height="38" fill="#ffffff" stroke="none" />
      <line x1="330" y1="330" x2="560" y2="330" stroke="#000000" stroke-width="1.8" />
      <line x1="330" y1="368" x2="560" y2="368" stroke="#000000" stroke-width="1.8" />
      <line x1="375" y1="330" x2="375" y2="368" stroke="#000000" stroke-width="1.5" />
      <text x="352" y="355" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D1</text>
      <text x="465" y="355" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">แฟ้มข้อมูลผู้ใช้งาน</text>
    </g>

    <!-- D2 แฟ้มข้อมูลประกาศเรียกเก็บเงิน -->
    <g id="datastore-d2">
      <rect x="590" y="536" width="190" height="38" fill="#ffffff" stroke="none" />
      <line x1="590" y1="536" x2="780" y2="536" stroke="#000000" stroke-width="1.8" />
      <line x1="590" y1="574" x2="780" y2="574" stroke="#000000" stroke-width="1.8" />
      <line x1="635" y1="536" x2="635" y2="574" stroke="#000000" stroke-width="1.5" />
      <text x="612" y="561" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D2</text>
      <text x="708" y="561" text-anchor="middle" font-size="13" font-weight="600" fill="#000">แฟ้มข้อมูลประกาศ</text>
    </g>

    <!-- D3 แฟ้มข้อมูลการชำระเงิน -->
    <g id="datastore-d3">
      <rect x="330" y="780" width="230" height="38" fill="#ffffff" stroke="none" />
      <line x1="330" y1="780" x2="560" y2="780" stroke="#000000" stroke-width="1.8" />
      <line x1="330" y1="818" x2="560" y2="818" stroke="#000000" stroke-width="1.8" />
      <line x1="375" y1="780" x2="375" y2="818" stroke="#000000" stroke-width="1.5" />
      <text x="352" y="805" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D3</text>
      <text x="465" y="805" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">แฟ้มข้อมูลการชำระเงิน</text>
    </g>

    <!-- D4 แฟ้มข้อมูลเงินกองกลางและเงินรุ่น -->
    <g id="datastore-d4">
      <rect x="660" y="780" width="260" height="38" fill="#ffffff" stroke="none" />
      <line x1="660" y1="780" x2="920" y2="780" stroke="#000000" stroke-width="1.8" />
      <line x1="660" y1="818" x2="920" y2="818" stroke="#000000" stroke-width="1.8" />
      <line x1="705" y1="780" x2="705" y2="818" stroke="#000000" stroke-width="1.5" />
      <text x="682" y="805" text-anchor="middle" font-size="15" font-weight="700" fill="#000">D4</text>
      <text x="810" y="805" text-anchor="middle" font-size="13.5" font-weight="600" fill="#000">แฟ้มข้อมูลเงินกองกลางและเงินรุ่น</text>
    </g>

    <!-- ==================== FLOWS / ARROWS (ZERO CROSSINGS) ==================== -->
    <!-- 1. เหรัญญิก -> Process 1.0 (แนวนอนตรง ไม่ตัดกับอะไร) -->
    <path d="M 830 160 L 655 160" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="742" y="146" text-anchor="middle" font-size="13.5" fill="#000">ข้อมูลแอดมิน / รหัสลับ</text>

    <!-- 2. นักศึกษา -> Process 1.0 (วิ่งขอบซ้ายขึ้นไปด้านบน ไม่ตัดกับอะไร) -->
    <path d="M 170 500 L 170 160 L 505 160" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="340" y="146" text-anchor="middle" font-size="13.5" fill="#000">ข้อมูลลงทะเบียน / เข้าสู่ระบบ</text>

    <!-- 3. Process 1.0 -> D1 (ดิ่งตรงลง D1) -->
    <path d="M 545 225 L 545 285 L 450 285 L 450 325" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="500" y="275" text-anchor="middle" font-size="13" fill="#000">บันทึกข้อมูลผู้ใช้</text>

    <!-- 4. D1 -> Process 2.0 (ดิ่งตรงลง Process 2.0 ไม่ตัดกับอะไร) -->
    <path d="M 450 368 L 450 475" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="440" y="425" text-anchor="end" font-size="13" fill="#000">ข้อมูลนักศึกษา</text>

    <!-- 5. นักศึกษา <-> Process 2.0 (แนวนอนตรง 2 เส้น ไม่มีเส้นตัดผ่าน) -->
    <!-- ส่งสลิป/แก้ไขสลิป -->
    <path d="M 260 535 L 370 535" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="315" y="522" text-anchor="middle" font-size="12" fill="#000">ส่งสลิป / แก้ไขสลิป</text>

    <!-- ประกาศ / QR / ผลตรวจสถานะ -->
    <path d="M 370 575 L 265 575" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="315" y="595" text-anchor="middle" font-size="12" fill="#000">ประกาศ / QR / ผลตรวจ</text>

    <!-- 6. D2 -> Process 2.0 (ดึงข้อมูลประกาศและยอดชำระ แนวนอนตรง) -->
    <path d="M 590 555 L 530 555" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="560" y="538" text-anchor="middle" font-size="12" fill="#000">ข้อมูลประกาศ</text>

    <!-- 7. Process 2.0 -> D3 (ดิ่งตรงลง D3 ไม่ตัดกับอะไร) -->
    <path d="M 450 630 L 450 775" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="440" y="705" text-anchor="end" font-size="13" fill="#000">บันทึกข้อมูลการชำระเงิน</text>

    <!-- 8. เหรัญญิก <-> Process 3.0 (ดิ่งตรงคู่ขนาน 2 เส้น ไม่ตัดกับอะไร) -->
    <!-- ข้อมูลประกาศ / ผลตรวจสอบสลิป -->
    <path d="M 870 210 L 870 475" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="860" y="340" text-anchor="end" font-size="13" fill="#000">ข้อมูลประกาศ / ผลตรวจสลิป</text>

    <!-- รายการสลิปที่ต้องตรวจ -->
    <path d="M 930 475 L 930 210" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="940" y="340" text-anchor="start" font-size="13" fill="#000">รายการสลิปและข้อมูลชำระเงิน</text>

    <!-- 9. Process 3.0 -> D2 (บันทึกประกาศ แนวนอนตรง) -->
    <path d="M 825 555 L 785 555" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="805" y="538" text-anchor="middle" font-size="12" fill="#000">บันทึกประกาศ</text>

    <!-- 10. Process 3.0 -> D3 (อัปเดตสถานะสลิป วิ่งใต้ D2) -->
    <path d="M 860 625 L 860 720 L 520 720 L 520 775" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="690" y="710" text-anchor="middle" font-size="13" fill="#000">อัปเดตผลการตรวจสลิป</text>

    <!-- 11. Process 3.0 -> D4 (ปรับปรุงเงินกองกลาง/เงินรุ่น) -->
    <path d="M 900 630 L 900 775" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="910" y="705" text-anchor="start" font-size="13" fill="#000">บันทึกยอดเงินกองกลาง</text>

    <!-- 12. D3, D4 -> Process 4.0 (ดิ่งลงสู่ Process 4.0 อย่างเป็นระเบียบ) -->
    <!-- D3 -> 4.0 -->
    <path d="M 450 818 L 450 970 L 560 970 L 560 1035" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="460" y="900" text-anchor="start" font-size="13" fill="#000">ข้อมูลการชำระเงิน</text>

    <!-- D4 <-> 4.0 -->
    <path d="M 780 818 L 780 970 L 640 970 L 640 1035" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="770" y="900" text-anchor="end" font-size="13" fill="#000">ข้อมูลเงินกองกลาง / เงินรุ่น</text>

    <!-- 13. Process 4.0 -> นักศึกษา (รายงานประวัติ วิ่งขอบซ้ายล่างสุด) -->
    <path d="M 515 1120 L 120 1120 L 120 615" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="320" y="1110" text-anchor="middle" font-size="13.5" fill="#000">รายงานประวัติการชำระเงินส่วนบุคคล</text>

    <!-- 14. เหรัญญิก <-> Process 4.0 (วิ่งขอบขวาสุด) -->
    <!-- ปรับปรุงเงินกองกลาง -->
    <path d="M 980 210 L 980 1050 L 685 1050" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="860" y="1040" text-anchor="middle" font-size="13.5" fill="#000">ข้อมูลปรับปรุงเงินกองกลาง / เงินรุ่น</text>

    <!-- รายงานสรุปส่งแอดมิน -->
    <path d="M 685 1120 L 1040 1120 L 1040 210" fill="none" stroke="#000" stroke-width="1.5" marker-end="url(#arrow)" />
    <text x="860" y="1110" text-anchor="middle" font-size="13.5" fill="#000">รายงานสรุปการเงิน / ประวัติชำระเงินทั้งหมด</text>

    <!-- ==================== CAPTION / TITLE ==================== -->
    <text x="600" y="1575" text-anchor="middle" font-size="26" font-weight="700" fill="#000">DFD Level 0</text>
    <text x="600" y="1612" text-anchor="middle" font-size="19" font-weight="400" fill="#000">ระบบบริหารจัดการการชำระเงินและเงินกองกลางนักศึกษา (CampusPay)</text>
  </svg>
</body>
</html>
`;

fs.writeFileSync(path.join(diagramsDir, 'context_diagram.html'), contextDiagramHtml, 'utf8');
fs.writeFileSync(path.join(diagramsDir, 'dfd_level0.html'), dfdLevel0Html, 'utf8');
console.log('Successfully wrote updated HTML files.');

const edgePath = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';
const cdHtml = path.join(diagramsDir, 'context_diagram.html').replace(/\\\\/g, '/');
const cdPng = path.join(diagramsDir, 'context_diagram.png').replace(/\\\\/g, '/');
const dfdHtml = path.join(diagramsDir, 'dfd_level0.html').replace(/\\\\/g, '/');
const dfdPng = path.join(diagramsDir, 'dfd_level0.png').replace(/\\\\/g, '/');

try {
  console.log('Rendering Context Diagram to PNG...');
  execSync('"' + edgePath + '" --headless=new --disable-gpu --window-size=1200,1700 --screenshot="' + cdPng + '" "file:///' + cdHtml + '"');
  console.log('Rendering DFD Level 0 to PNG...');
  execSync('"' + edgePath + '" --headless=new --disable-gpu --window-size=1200,1700 --screenshot="' + dfdPng + '" "file:///' + dfdHtml + '"');
  console.log('All diagrams generated successfully as PNG and HTML!');
} catch (e) {
  console.error('Error rendering PNG:', e.message);
}
