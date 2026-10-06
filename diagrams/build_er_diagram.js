const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const diagramsDir = __dirname;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const erHtml = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>ER-Diagram - CampusPay</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #ffffff;
      font-family: 'Sarabun', 'Leelawadee UI', Tahoma, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1200px;
      height: 1500px;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    svg {
      width: 1200px;
      height: 1500px;
      display: block;
    }
    text {
      font-family: 'Sarabun', 'Leelawadee UI', Tahoma, sans-serif;
      user-select: none;
    }
    .halo {
      paint-order: stroke fill;
      stroke: #ffffff;
      stroke-width: 5px;
      stroke-linejoin: round;
    }
  </style>
</head>
<body>
  <svg viewBox="0 0 1200 1500" width="1200" height="1500" xmlns="http://www.w3.org/2000/svg">

    <!-- A4 BORDER FRAME (กรอบแผนภาพ ER) -->
    <rect x="50" y="50" width="1100" height="1400" fill="none" stroke="#000000" stroke-width="1.8" />


    <!-- ========================================================== -->
    <!-- 1. RELATIONSHIP CONNECTING LINES (เส้นเชื่อมเอนทิตีกับความสัมพันธ์) -->
    <!-- ========================================================== -->

    <!-- USER <--- (1) --- [สร้างประกาศ] --- (M) ---> ANNOUNCEMENT -->
    <line x1="330" y1="715" x2="480" y2="465" stroke="#000000" stroke-width="1.6" />
    <text x="365" y="630" font-size="16" font-weight="700" fill="#000" class="halo">1</text>

    <line x1="560" y1="415" x2="710" y2="315" stroke="#000000" stroke-width="1.6" />
    <text x="660" y="350" font-size="16" font-weight="700" fill="#000" class="halo">M</text>

    <!-- USER <--- (1) --- [ชำระเงิน] --- (M) ---> PAYMENT (เส้นตรงแนวนอนกลางภาพ) -->
    <line x1="365" y1="750" x2="485" y2="750" stroke="#000000" stroke-width="1.6" />
    <text x="415" y="740" font-size="16" font-weight="700" fill="#000" class="halo">1</text>

    <line x1="615" y1="750" x2="720" y2="750" stroke="#000000" stroke-width="1.6" />
    <text x="670" y="740" font-size="16" font-weight="700" fill="#000" class="halo">M</text>

    <!-- USER <--- (1) --- [ปรับปรุงยอด] --- (M) ---> GENERALFUND -->
    <line x1="330" y1="785" x2="480" y2="1035" stroke="#000000" stroke-width="1.6" />
    <text x="365" y="870" font-size="16" font-weight="700" fill="#000" class="halo">1</text>

    <line x1="560" y1="1085" x2="700" y2="1185" stroke="#000000" stroke-width="1.6" />
    <text x="655" y="1150" font-size="16" font-weight="700" fill="#000" class="halo">M</text>

    <!-- ANNOUNCEMENT <--- (1) --- [มีรายการชำระ] --- (M) ---> PAYMENT (เส้นดิ่งตรง 100%) -->
    <line x1="820" y1="335" x2="820" y2="490" stroke="#000000" stroke-width="1.6" />
    <text x="835" y="415" font-size="16" font-weight="700" fill="#000" class="halo">1</text>

    <line x1="820" y1="560" x2="820" y2="715" stroke="#000000" stroke-width="1.6" />
    <text x="835" y="650" font-size="16" font-weight="700" fill="#000" class="halo">M</text>

    <!-- PAYMENT <--- (M) --- [โอนเข้ากองกลาง] --- (1) ---> GENERALFUND (เส้นดิ่งตรง 100%) -->
    <line x1="820" y1="785" x2="820" y2="940" stroke="#000000" stroke-width="1.6" />
    <text x="835" y="865" font-size="16" font-weight="700" fill="#000" class="halo">M</text>

    <line x1="820" y1="1010" x2="820" y2="1165" stroke="#000000" stroke-width="1.6" />
    <text x="835" y="1095" font-size="16" font-weight="700" fill="#000" class="halo">1</text>


    <!-- ========================================================== -->
    <!-- 2. ATTRIBUTE LINES (เส้นเชื่อมแอตทริบิวต์) -->
    <!-- ========================================================== -->

    <!-- USER ATTRIBUTES LINES (8 เส้น พัดออกซ้าย โค้งรับสมมาตร) -->
    <line x1="125" y1="535" x2="205" y2="725" stroke="#555" stroke-width="1.2" />
    <line x1="110" y1="595" x2="195" y2="735" stroke="#555" stroke-width="1.2" />
    <line x1="100" y1="655" x2="195" y2="745" stroke="#555" stroke-width="1.2" />
    <line x1="95" y1="715" x2="195" y2="750" stroke="#555" stroke-width="1.2" />
    <line x1="95" y1="775" x2="195" y2="755" stroke="#555" stroke-width="1.2" />
    <line x1="100" y1="835" x2="195" y2="760" stroke="#555" stroke-width="1.2" />
    <line x1="110" y1="895" x2="195" y2="770" stroke="#555" stroke-width="1.2" />
    <line x1="125" y1="955" x2="205" y2="780" stroke="#555" stroke-width="1.2" />

    <!-- ANNOUNCEMENT ATTRIBUTES LINES (10 เส้น) -->
    <!-- แถวบน 5 เส้น -->
    <line x1="590" y1="170" x2="740" y2="265" stroke="#555" stroke-width="1.2" />
    <line x1="710" y1="170" x2="780" y2="265" stroke="#555" stroke-width="1.2" />
    <line x1="830" y1="170" x2="820" y2="265" stroke="#555" stroke-width="1.2" />
    <line x1="950" y1="170" x2="860" y2="265" stroke="#555" stroke-width="1.2" />
    <line x1="1060" y1="170" x2="900" y2="270" stroke="#555" stroke-width="1.2" />
    <!-- ฝั่งขวา 5 เส้น -->
    <line x1="1055" y1="230" x2="925" y2="285" stroke="#555" stroke-width="1.2" />
    <line x1="1060" y1="290" x2="930" y2="300" stroke="#555" stroke-width="1.2" />
    <line x1="1055" y1="350" x2="925" y2="315" stroke="#555" stroke-width="1.2" />
    <line x1="1040" y1="410" x2="915" y2="325" stroke="#555" stroke-width="1.2" />
    <line x1="1010" y1="470" x2="890" y2="335" stroke="#555" stroke-width="1.2" />

    <!-- PAYMENT ATTRIBUTES LINES (8 เส้น พัดออกขวา) -->
    <line x1="1005" y1="540" x2="910" y2="725" stroke="#555" stroke-width="1.2" />
    <line x1="1030" y1="600" x2="920" y2="735" stroke="#555" stroke-width="1.2" />
    <line x1="1045" y1="660" x2="920" y2="745" stroke="#555" stroke-width="1.2" />
    <line x1="1050" y1="720" x2="920" y2="750" stroke="#555" stroke-width="1.2" />
    <line x1="1050" y1="780" x2="920" y2="755" stroke="#555" stroke-width="1.2" />
    <line x1="1045" y1="840" x2="920" y2="760" stroke="#555" stroke-width="1.2" />
    <line x1="1030" y1="900" x2="920" y2="770" stroke="#555" stroke-width="1.2" />
    <line x1="1005" y1="960" x2="910" y2="780" stroke="#555" stroke-width="1.2" />

    <!-- GENERAL FUND ATTRIBUTES LINES (5 เส้น) -->
    <line x1="1040" y1="1135" x2="940" y2="1185" stroke="#555" stroke-width="1.2" />
    <line x1="1050" y1="1200" x2="940" y2="1200" stroke="#555" stroke-width="1.2" />
    <line x1="1040" y1="1265" x2="940" y2="1215" stroke="#555" stroke-width="1.2" />
    <line x1="930" y1="1335" x2="860" y2="1235" stroke="#555" stroke-width="1.2" />
    <line x1="790" y1="1335" x2="790" y2="1235" stroke="#555" stroke-width="1.2" />


    <!-- ========================================================== -->
    <!-- 3. RELATIONSHIP DIAMONDS (สี่เหลี่ยมข้าวหลามตัดความสัมพันธ์) -->
    <!-- ========================================================== -->

    <!-- Diamond 1: สร้างประกาศ (520, 440) -->
    <g id="diamond-create-announcement">
      <polygon points="520,405 585,440 520,475 455,440" fill="#ffffff" stroke="#000000" stroke-width="1.8" />
      <text x="520" y="445" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">สร้างประกาศ</text>
    </g>

    <!-- Diamond 2: ชำระเงิน (550, 750) -->
    <g id="diamond-make-payment">
      <polygon points="550,715 615,750 550,785 485,750" fill="#ffffff" stroke="#000000" stroke-width="1.8" />
      <text x="550" y="755" text-anchor="middle" font-size="15" font-weight="600" fill="#000">ชำระเงิน</text>
    </g>

    <!-- Diamond 3: มีรายการชำระ (820, 525) -->
    <g id="diamond-has-payment">
      <polygon points="820,490 895,525 820,560 745,525" fill="#ffffff" stroke="#000000" stroke-width="1.8" />
      <text x="820" y="530" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">มีรายการชำระ</text>
    </g>

    <!-- Diamond 4: ปรับปรุงยอด (520, 1060) -->
    <g id="diamond-manage-fund">
      <polygon points="520,1025 585,1060 520,1095 455,1060" fill="#ffffff" stroke="#000000" stroke-width="1.8" />
      <text x="520" y="1065" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">ปรับปรุงยอด</text>
    </g>

    <!-- Diamond 5: โอนเข้ากองกลาง (820, 975) -->
    <g id="diamond-transfer-fund">
      <polygon points="820,940 900,975 820,1010 740,975" fill="#ffffff" stroke="#000000" stroke-width="1.8" />
      <text x="820" y="980" text-anchor="middle" font-size="14.5" font-weight="600" fill="#000">โอนเข้ากองกลาง</text>
    </g>


    <!-- ========================================================== -->
    <!-- 4. ENTITY RECTANGLES (เอนทิตี) -->
    <!-- ========================================================== -->

    <!-- Entity 1: ผู้ใช้งาน (User) -->
    <g id="entity-user">
      <rect x="195" y="718" width="170" height="65" fill="#ffffff" stroke="#000000" stroke-width="2.2" />
      <text x="280" y="745" text-anchor="middle" font-size="17" font-weight="700" fill="#000">ผู้ใช้งาน</text>
      <text x="280" y="768" text-anchor="middle" font-size="14.5" font-weight="500" fill="#000">(User)</text>
    </g>

    <!-- Entity 2: ประกาศเรียกเก็บเงิน (Announcement) -->
    <g id="entity-announcement">
      <rect x="710" y="268" width="220" height="65" fill="#ffffff" stroke="#000000" stroke-width="2.2" />
      <text x="820" y="295" text-anchor="middle" font-size="17" font-weight="700" fill="#000">ประกาศเรียกเก็บเงิน</text>
      <text x="820" y="318" text-anchor="middle" font-size="14.5" font-weight="500" fill="#000">(Announcement)</text>
    </g>

    <!-- Entity 3: การชำระเงิน (Payment) -->
    <g id="entity-payment">
      <rect x="720" y="718" width="200" height="65" fill="#ffffff" stroke="#000000" stroke-width="2.2" />
      <text x="820" y="745" text-anchor="middle" font-size="17" font-weight="700" fill="#000">การชำระเงิน</text>
      <text x="820" y="768" text-anchor="middle" font-size="14.5" font-weight="500" fill="#000">(Payment)</text>
    </g>

    <!-- Entity 4: เงินกองกลางและเงินรุ่น (GeneralFund) -->
    <g id="entity-generalfund">
      <rect x="700" y="1168" width="240" height="65" fill="#ffffff" stroke="#000000" stroke-width="2.2" />
      <text x="820" y="1195" text-anchor="middle" font-size="16.5" font-weight="700" fill="#000">เงินกองกลางและเงินรุ่น</text>
      <text x="820" y="1218" text-anchor="middle" font-size="14.5" font-weight="500" fill="#000">(GeneralFund)</text>
    </g>


    <!-- ========================================================== -->
    <!-- 5. ATTRIBUTE OVALS (แอตทริบิวต์) -->
    <!-- ========================================================== -->

    <!-- --- USER ATTRIBUTES (ฝั่งซ้าย) --- -->
    <!-- id (PK) -->
    <g transform="translate(125, 535)">
      <ellipse cx="0" cy="0" rx="55" ry="20" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12.5" font-weight="700" fill="#000">รหัสผู้ใช้ (id)</text>
      <line x1="-36" y1="8" x2="36" y2="8" stroke="#000000" stroke-width="1.2" />
    </g>
    <!-- studentId -->
    <g transform="translate(110, 595)">
      <ellipse cx="0" cy="0" rx="52" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">รหัสนักศึกษา</text>
    </g>
    <!-- username -->
    <g transform="translate(100, 655)">
      <ellipse cx="0" cy="0" rx="50" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">ชื่อผู้ใช้</text>
    </g>
    <!-- password -->
    <g transform="translate(95, 715)">
      <ellipse cx="0" cy="0" rx="48" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">รหัสผ่าน</text>
    </g>
    <!-- firstName -->
    <g transform="translate(95, 775)">
      <ellipse cx="0" cy="0" rx="48" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">ชื่อจริง</text>
    </g>
    <!-- lastName -->
    <g transform="translate(100, 835)">
      <ellipse cx="0" cy="0" rx="48" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">นามสกุล</text>
    </g>
    <!-- role -->
    <g transform="translate(110, 895)">
      <ellipse cx="0" cy="0" rx="50" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">บทบาทสิทธิ์</text>
    </g>
    <!-- createdAt -->
    <g transform="translate(125, 955)">
      <ellipse cx="0" cy="0" rx="56" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="11.5" fill="#000">วันที่ลงทะเบียน</text>
    </g>

    <!-- --- ANNOUNCEMENT ATTRIBUTES (ด้านบนและขวาบน) --- -->
    <!-- id (PK) -->
    <g transform="translate(590, 170)">
      <ellipse cx="0" cy="0" rx="55" ry="20" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12.5" font-weight="700" fill="#000">รหัสประกาศ (id)</text>
      <line x1="-42" y1="8" x2="42" y2="8" stroke="#000000" stroke-width="1.2" />
    </g>
    <!-- title -->
    <g transform="translate(710, 170)">
      <ellipse cx="0" cy="0" rx="50" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">หัวข้อประกาศ</text>
    </g>
    <!-- description -->
    <g transform="translate(830, 170)">
      <ellipse cx="0" cy="0" rx="48" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">รายละเอียด</text>
    </g>
    <!-- amount -->
    <g transform="translate(950, 170)">
      <ellipse cx="0" cy="0" rx="52" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">ยอดเงินเรียกเก็บ</text>
    </g>
    <!-- bankAccount -->
    <g transform="translate(1060, 170)">
      <ellipse cx="0" cy="0" rx="50" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">เลขที่บัญชี</text>
    </g>
    <!-- bankName -->
    <g transform="translate(1055, 230)">
      <ellipse cx="0" cy="0" rx="48" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">ชื่อธนาคาร</text>
    </g>
    <!-- qrCodeUrl -->
    <g transform="translate(1060, 290)">
      <ellipse cx="0" cy="0" rx="52" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">QR พร้อมเพย์</text>
    </g>
    <!-- startDate -->
    <g transform="translate(1055, 350)">
      <ellipse cx="0" cy="0" rx="48" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">วันเริ่มชำระ</text>
    </g>
    <!-- dueDate -->
    <g transform="translate(1040, 410)">
      <ellipse cx="0" cy="0" rx="50" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">วันครบกำหนด</text>
    </g>
    <!-- createdAt -->
    <g transform="translate(1010, 470)">
      <ellipse cx="0" cy="0" rx="50" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">วันที่สร้าง</text>
    </g>

    <!-- --- PAYMENT ATTRIBUTES (ฝั่งขวา) --- -->
    <!-- id (PK) -->
    <g transform="translate(1005, 540)">
      <ellipse cx="0" cy="0" rx="55" ry="20" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12.5" font-weight="700" fill="#000">รหัสชำระ (id)</text>
      <line x1="-38" y1="8" x2="38" y2="8" stroke="#000000" stroke-width="1.2" />
    </g>
    <!-- userId (FK) -->
    <g transform="translate(1030, 600)">
      <ellipse cx="0" cy="0" rx="54" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">รหัสผู้ใช้ (FK)</text>
    </g>
    <!-- announcementId (FK) -->
    <g transform="translate(1045, 660)">
      <ellipse cx="0" cy="0" rx="56" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">รหัสประกาศ(FK)</text>
    </g>
    <!-- slipUrl -->
    <g transform="translate(1050, 720)">
      <ellipse cx="0" cy="0" rx="52" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">หลักฐานสลิป</text>
    </g>
    <!-- status -->
    <g transform="translate(1050, 780)">
      <ellipse cx="0" cy="0" rx="50" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">สถานะชำระ</text>
    </g>
    <!-- rejectReason -->
    <g transform="translate(1045, 840)">
      <ellipse cx="0" cy="0" rx="52" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">เหตุผลปฏิเสธ</text>
    </g>
    <!-- createdAt -->
    <g transform="translate(1030, 900)">
      <ellipse cx="0" cy="0" rx="52" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="11.5" fill="#000">วันที่ส่งสลิป</text>
    </g>
    <!-- updatedAt -->
    <g transform="translate(1005, 960)">
      <ellipse cx="0" cy="0" rx="52" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="11.5" fill="#000">วันที่อัปเดต</text>
    </g>

    <!-- --- GENERAL FUND ATTRIBUTES (ฝั่งขวาและล่าง) --- -->
    <!-- id (PK) -->
    <g transform="translate(1040, 1135)">
      <ellipse cx="0" cy="0" rx="55" ry="20" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12.5" font-weight="700" fill="#000">รหัสกองทุน (id)</text>
      <line x1="-40" y1="8" x2="40" y2="8" stroke="#000000" stroke-width="1.2" />
    </g>
    <!-- generalBalance -->
    <g transform="translate(1050, 1200)">
      <ellipse cx="0" cy="0" rx="54" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">เงินกองกลาง</text>
    </g>
    <!-- classFund -->
    <g transform="translate(1040, 1265)">
      <ellipse cx="0" cy="0" rx="50" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">ยอดเงินรุ่น</text>
    </g>
    <!-- updatedBy -->
    <g transform="translate(930, 1335)">
      <ellipse cx="0" cy="0" rx="50" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">ชื่อผู้อัปเดต</text>
    </g>
    <!-- updatedAt -->
    <g transform="translate(790, 1335)">
      <ellipse cx="0" cy="0" rx="52" ry="19" fill="#ffffff" stroke="#000000" stroke-width="1.4" />
      <text x="0" y="5" text-anchor="middle" font-size="12" fill="#000">วันที่ปรับปรุง</text>
    </g>

  </svg>
</body>
</html>
`;

fs.writeFileSync(path.join(diagramsDir, 'er_diagram.html'), erHtml, 'utf8');
console.log('Saved er_diagram.html successfully.');

const htmlFile = path.join(diagramsDir, 'er_diagram.html').replace(/\\/g, '/');
const pngFile = path.join(diagramsDir, 'er_diagram.png').replace(/\\/g, '/');
const rootPng = path.join(diagramsDir, '..\\..\\ER_Diagram_CampusPay.png');
const deskPng = path.join(diagramsDir, '..\\ER_Diagram_CampusPay.png');

console.log('Rendering ER-Diagram to PNG...');
execSync('"' + edgePath + '" --headless=new --disable-gpu --window-size=1200,1500 --screenshot="' + pngFile + '" "file:///' + htmlFile + '"');
fs.copyFileSync(pngFile, deskPng);
try {
  fs.copyFileSync(pngFile, rootPng);
} catch (e) {}

console.log('ER Diagram rendered successfully without bottom caption!');
