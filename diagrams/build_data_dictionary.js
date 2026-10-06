const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const diagramsDir = __dirname;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const dataElements = [
  // --- MODEL 1: USER (8 elements) ---
  {
    tableNum: 1,
    name: "รหัสผู้ใช้",
    altName: "id, userId",
    typeLength: "Varchar 36 (UUID)",
    outputFormat: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    defaultValue: "สร้างอัตโนมัติ (UUID v4)",
    dataSource: "แหล่งเก็บข้อมูลผู้ใช้งาน (D1 User)",
    security: "ผู้ดูแลระบบและเจ้าของบัญชีเท่านั้นที่สามารถเข้าถึงได้",
    responsibleUser: "ผู้ดูแลระบบ (Admin)",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องไม่ซ้ำกัน (Unique)",
    derivationFormula: "-",
    note: "คีย์หลัก (Primary Key)"
  },
  {
    tableNum: 2,
    name: "ชื่อบัญชีผู้ใช้",
    altName: "username",
    typeLength: "Varchar 50",
    outputFormat: "xxxxxxxxxxxxxxxxxxxx",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลผู้ใช้งาน (D1 User)",
    security: "ผู้ดูแลระบบและเจ้าของบัญชีเท่านั้นที่สามารถเข้าถึงได้",
    responsibleUser: "นักศึกษา และ แอดมิน/เหรัญญิก",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องไม่ซ้ำกัน (Unique)",
    derivationFormula: "-",
    note: "ใช้สำหรับเข้าสู่ระบบ (Login)"
  },
  {
    tableNum: 3,
    name: "รหัสผ่าน",
    altName: "password",
    typeLength: "Varchar 100 (Bcrypt Hash)",
    outputFormat: "••••••••••••••••",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลผู้ใช้งาน (D1 User)",
    security: "มีการเข้ารหัสความปลอดภัยทางเดียวแบบ Bcrypt ห้ามแสดงผลรหัสจริง",
    responsibleUser: "นักศึกษา และ แอดมิน/เหรัญญิก",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ความยาวไม่น้อยกว่า 6 ตัวอักษร",
    derivationFormula: "-",
    note: "จัดเก็บในรูปแบบ Hashed Password"
  },
  {
    tableNum: 4,
    name: "ชื่อจริง",
    altName: "firstName",
    typeLength: "Varchar 50",
    outputFormat: "xxxxxxxxxxxxxxxxxxxx",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลผู้ใช้งาน (D1 User)",
    security: "ผู้ใช้งานในระบบสามารถอ่านได้ ผู้ดูแลระบบสามารถแก้ไขได้",
    responsibleUser: "นักศึกษา",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), รับเฉพาะตัวอักษร",
    derivationFormula: "-",
    note: "ชื่อจริงของนักศึกษาหรือแอดมิน"
  },
  {
    tableNum: 5,
    name: "นามสกุล",
    altName: "lastName",
    typeLength: "Varchar 50",
    outputFormat: "xxxxxxxxxxxxxxxxxxxx",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลผู้ใช้งาน (D1 User)",
    security: "ผู้ใช้งานในระบบสามารถอ่านได้ ผู้ดูแลระบบสามารถแก้ไขได้",
    responsibleUser: "นักศึกษา",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), รับเฉพาะตัวอักษร",
    derivationFormula: "-",
    note: "นามสกุลของนักศึกษาหรือแอดมิน"
  },
  {
    tableNum: 6,
    name: "รหัสนักศึกษา",
    altName: "studentId",
    typeLength: "Varchar 20",
    outputFormat: "xxxxxxxxxxxx",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลผู้ใช้งาน (D1 User)",
    security: "สมาชิกในระบบสามารถเรียกดูได้",
    responsibleUser: "นักศึกษา",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องไม่ซ้ำกัน (Unique)",
    derivationFormula: "-",
    note: "ใช้ระบุตัวตนนศ. และตรวจสอบยอดชำระเงิน"
  },
  {
    tableNum: 7,
    name: "บทบาทสิทธิ์การใช้งาน",
    altName: "role",
    typeLength: "Varchar 10",
    outputFormat: "xxxxxxxx",
    defaultValue: "\"STUDENT\"",
    dataSource: "แหล่งเก็บข้อมูลผู้ใช้งาน (D1 User)",
    security: "ผู้ดูแลระบบเท่านั้นที่สามารถกำหนดและแก้ไขได้",
    responsibleUser: "ผู้ดูแลระบบ (Admin)",
    validationRule: "กำหนดค่าได้เฉพาะ \"STUDENT\" หรือ \"ADMIN\" เท่านั้น",
    derivationFormula: "-",
    note: "ควบคุมสิทธิ์การเข้าถึงเมนูและการอนุมัติสลิป"
  },
  {
    tableNum: 8,
    name: "วันที่ลงทะเบียน",
    altName: "createdAt",
    typeLength: "DateTime",
    outputFormat: "วว/ดด/ปปปป ชช:นน:วว",
    defaultValue: "วันเวลาปัจจุบัน (Current Timestamp)",
    dataSource: "แหล่งเก็บข้อมูลผู้ใช้งาน (D1 User)",
    security: "บันทึกโดยระบบอัตโนมัติ ไม่อนุญาตให้แก้ไข",
    responsibleUser: "ระบบ (System)",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), รูปแบบวันเวลาสากล",
    derivationFormula: "-",
    note: "วันเวลาที่สร้างบัญชีผู้ใช้งาน"
  },

  // --- MODEL 2: ANNOUNCEMENT (10 elements) ---
  {
    tableNum: 9,
    name: "รหัสประกาศ",
    altName: "id, announcementId",
    typeLength: "Varchar 36 (UUID)",
    outputFormat: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    defaultValue: "สร้างอัตโนมัติ (UUID v4)",
    dataSource: "แหล่งเก็บข้อมูลประกาศ (D2 Announcement)",
    security: "ผู้ดูแลระบบเท่านั้นที่สามารถสร้างและแก้ไขได้",
    responsibleUser: "เหรัญญิก / แอดมิน (Treasurer/Admin)",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องไม่ซ้ำกัน (Unique)",
    derivationFormula: "-",
    note: "คีย์หลัก (Primary Key)"
  },
  {
    tableNum: 10,
    name: "หัวข้อประกาศ",
    altName: "title",
    typeLength: "Varchar 100",
    outputFormat: "xxxxxxxxxxxxxxxxxxxx",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลประกาศ (D2 Announcement)",
    security: "เหรัญญิก/แอดมินเป็นผู้แก้ไข นักศึกษาสามารถอ่านได้",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null)",
    derivationFormula: "-",
    note: "เช่น ค่าเสื้อรุ่น, ค่ากิจกรรมบายเนียร์"
  },
  {
    tableNum: 11,
    name: "รายละเอียดประกาศ",
    altName: "description",
    typeLength: "Text",
    outputFormat: "xxxxxxxxxxxxxxxxxxxx",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลประกาศ (D2 Announcement)",
    security: "เหรัญญิก/แอดมินเป็นผู้แก้ไข นักศึกษาสามารถอ่านได้",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "ยอมรับค่าว่างได้ (Nullable)",
    derivationFormula: "-",
    note: "ชี้แจงวัตถุประสงค์และรายละเอียดการจ่ายเงิน"
  },
  {
    tableNum: 12,
    name: "ยอดเงินที่เรียกเก็บ",
    altName: "amount",
    typeLength: "Float / Decimal(10,2)",
    outputFormat: "999,999.99 บาท",
    defaultValue: "0.00",
    dataSource: "แหล่งเก็บข้อมูลประกาศ (D2 Announcement)",
    security: "เหรัญญิก/แอดมินเป็นผู้กำหนด",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องเป็นตัวเลขมากกว่า 0",
    derivationFormula: "-",
    note: "จำนวนเงินต่อนักศึกษา 1 คน"
  },
  {
    tableNum: 13,
    name: "เลขที่บัญชีธนาคาร",
    altName: "bankAccount",
    typeLength: "Varchar 30",
    outputFormat: "xxx-x-xxxxx-x",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลประกาศ (D2 Announcement)",
    security: "เหรัญญิก/แอดมินเป็นผู้กำหนด",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), เฉพาะตัวเลข",
    derivationFormula: "-",
    note: "เลขบัญชีปลายทางที่รับโอนเงิน"
  },
  {
    tableNum: 14,
    name: "ชื่อธนาคาร",
    altName: "bankName",
    typeLength: "Varchar 50",
    outputFormat: "xxxxxxxxxxxxxxxxxxxx",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลประกาศ (D2 Announcement)",
    security: "เหรัญญิก/แอดมินเป็นผู้กำหนด",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null)",
    derivationFormula: "-",
    note: "เช่น ธนาคารกรุงไทย, ธนาคารกสิกรไทย"
  },
  {
    tableNum: 15,
    name: "คิวอาร์โค้ดพร้อมเพย์",
    altName: "qrCodeUrl",
    typeLength: "Varchar 255 (URL)",
    outputFormat: "https://...",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลประกาศ (D2 Announcement)",
    security: "จัดเก็บผ่านบริการ UploadThing CDN",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "ยอมรับค่าว่างได้ (Nullable), รูปแบบ URL ถูกต้อง",
    derivationFormula: "-",
    note: "รูปภาพ QR Code สำหรับสแกนชำระเงิน"
  },
  {
    tableNum: 16,
    name: "วันเริ่มชำระเงิน",
    altName: "startDate",
    typeLength: "DateTime",
    outputFormat: "วว/ดด/ปปปป",
    defaultValue: "วันที่สร้างประกาศ",
    dataSource: "แหล่งเก็บข้อมูลประกาศ (D2 Announcement)",
    security: "เหรัญญิก/แอดมินเป็นผู้กำหนด",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องเป็นวันที่ไม่เกินวันครบกำหนด",
    derivationFormula: "-",
    note: "วันเริ่มต้นที่เปิดให้นักศึกษาส่งสลิป"
  },
  {
    tableNum: 17,
    name: "วันครบกำหนดชำระ",
    altName: "dueDate",
    typeLength: "DateTime",
    outputFormat: "วว/ดด/ปปปป",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลประกาศ (D2 Announcement)",
    security: "เหรัญญิก/แอดมินเป็นผู้กำหนด",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องมากกว่าวันเริ่มชำระ",
    derivationFormula: "-",
    note: "วันสุดท้ายของการชำระเงินตามประกาศ"
  },
  {
    tableNum: 18,
    name: "วันที่สร้างประกาศ",
    altName: "createdAt",
    typeLength: "DateTime",
    outputFormat: "วว/ดด/ปปปป ชช:นน:วว",
    defaultValue: "วันเวลาปัจจุบัน (Current Timestamp)",
    dataSource: "แหล่งเก็บข้อมูลประกาศ (D2 Announcement)",
    security: "บันทึกโดยระบบอัตโนมัติ ไม่อนุญาตให้แก้ไข",
    responsibleUser: "ระบบ (System)",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null)",
    derivationFormula: "-",
    note: "วันเวลาที่บันทึกข้อมูลประกาศลงระบบ"
  },

  // --- MODEL 3: PAYMENT (8 elements) ---
  {
    tableNum: 19,
    name: "รหัสการชำระเงิน",
    altName: "id, paymentId",
    typeLength: "Varchar 36 (UUID)",
    outputFormat: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    defaultValue: "สร้างอัตโนมัติ (UUID v4)",
    dataSource: "แหล่งเก็บข้อมูลการชำระเงิน (D3 Payment)",
    security: "ผู้ดูแลระบบและเจ้าของรายการชำระเท่านั้นที่เข้าถึงได้",
    responsibleUser: "ระบบ (System)",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องไม่ซ้ำกัน (Unique)",
    derivationFormula: "-",
    note: "คีย์หลัก (Primary Key)"
  },
  {
    tableNum: 20,
    name: "รหัสผู้ใช้งานที่ชำระ",
    altName: "userId",
    typeLength: "Varchar 36 (UUID)",
    outputFormat: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลการชำระเงิน (D3 Payment)",
    security: "เชื่อมโยงตามบัญชีผู้ใช้งานที่กำลังเข้าสู่ระบบ",
    responsibleUser: "นักศึกษา / ระบบ",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องมีอยู่ในตาราง User",
    derivationFormula: "-",
    note: "คีย์นอก (Foreign Key) อ้างอิง User(id)"
  },
  {
    tableNum: 21,
    name: "รหัสประกาศที่ชำระ",
    altName: "announcementId",
    typeLength: "Varchar 36 (UUID)",
    outputFormat: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลการชำระเงิน (D3 Payment)",
    security: "เชื่อมโยงตามรายการประกาศที่เลือกชำระ",
    responsibleUser: "นักศึกษา / ระบบ",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องมีอยู่ในตาราง Announcement",
    derivationFormula: "-",
    note: "คีย์นอก (Foreign Key) อ้างอิง Announcement(id)"
  },
  {
    tableNum: 22,
    name: "หลักฐานสลิปโอนเงิน",
    altName: "slipUrl",
    typeLength: "Varchar 255 (URL)",
    outputFormat: "https://...",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลการชำระเงิน (D3 Payment)",
    security: "อัปโหลดและจัดเก็บบน CDN ที่มีความปลอดภัยสูง",
    responsibleUser: "นักศึกษา (ผู้อัปโหลด)",
    validationRule: "ยอมรับค่าว่างได้ขณะเริ่มต้น (UNPAID), ต้องเป็นไฟล์ภาพ .jpg/.png",
    derivationFormula: "-",
    note: "ภาพสลิปสำหรับให้เหรัญญิกตรวจสอบ"
  },
  {
    tableNum: 23,
    name: "สถานะการชำระเงิน",
    altName: "status",
    typeLength: "Varchar 15",
    outputFormat: "xxxxxxxxxx",
    defaultValue: "\"UNPAID\"",
    dataSource: "แหล่งเก็บข้อมูลการชำระเงิน (D3 Payment)",
    security: "เฉพาะเหรัญญิก/แอดมินเท่านั้นที่สามารถเปลี่ยนสถานะอนุมัติ/ปฏิเสธได้",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "กำหนดค่าได้เฉพาะ \"UNPAID\", \"PENDING\", \"APPROVED\", \"REJECTED\"",
    derivationFormula: "-",
    note: "UNPAID=ยังไม่จ่าย, PENDING=รอตรวจ, APPROVED=อนุมัติ, REJECTED=ปฏิเสธ"
  },
  {
    tableNum: 24,
    name: "เหตุผลที่ปฏิเสธสลิป",
    altName: "rejectReason",
    typeLength: "Text",
    outputFormat: "xxxxxxxxxxxxxxxxxxxx",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลการชำระเงิน (D3 Payment)",
    security: "เหรัญญิก/แอดมินเป็นผู้กรอกเมื่อปฏิเสธสลิป",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "ยอมรับค่าว่างได้ (Nullable)",
    derivationFormula: "-",
    note: "เช่น ยอดเงินไม่ตรง, สลิปซ้ำ, ภาพไม่ชัดเจน"
  },
  {
    tableNum: 25,
    name: "วันที่ส่งสลิปชำระเงิน",
    altName: "createdAt",
    typeLength: "DateTime",
    outputFormat: "วว/ดด/ปปปป ชช:นน:วว",
    defaultValue: "วันเวลาปัจจุบัน (Current Timestamp)",
    dataSource: "แหล่งเก็บข้อมูลการชำระเงิน (D3 Payment)",
    security: "บันทึกโดยระบบอัตโนมัติ ไม่อนุญาตให้แก้ไข",
    responsibleUser: "ระบบ (System)",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null)",
    derivationFormula: "-",
    note: "วันเวลาที่สร้างรายการชำระเงิน"
  },
  {
    tableNum: 26,
    name: "วันที่ตรวจสอบผล",
    altName: "updatedAt",
    typeLength: "DateTime",
    outputFormat: "วว/ดด/ปปปป ชช:นน:วว",
    defaultValue: "วันเวลาปัจจุบัน (Current Timestamp)",
    dataSource: "แหล่งเก็บข้อมูลการชำระเงิน (D3 Payment)",
    security: "บันทึกโดยระบบอัตโนมัติเมื่อมีการเปลี่ยนแปลงสถานะ",
    responsibleUser: "ระบบ (System)",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null)",
    derivationFormula: "-",
    note: "วันเวลาที่เหรัญญิกกดอนุมัติหรือปฏิเสธ"
  },

  // --- MODEL 4: GENERAL FUND (5 elements) ---
  {
    tableNum: 27,
    name: "รหัสเงินกองกลาง",
    altName: "id, fundId",
    typeLength: "Varchar 36 (UUID)",
    outputFormat: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    defaultValue: "สร้างอัตโนมัติ (UUID v4)",
    dataSource: "แหล่งเก็บข้อมูลเงินกองกลางและเงินรุ่น (D4 GeneralFund)",
    security: "ผู้ดูแลระบบเท่านั้นที่สามารถเข้าถึงได้",
    responsibleUser: "ผู้ดูแลระบบ (Admin)",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องไม่ซ้ำกัน (Unique)",
    derivationFormula: "-",
    note: "คีย์หลัก (Primary Key)"
  },
  {
    tableNum: 28,
    name: "ยอดเงินกองกลางคงเหลือ",
    altName: "generalBalance",
    typeLength: "Float / Decimal(10,2)",
    outputFormat: "999,999.99 บาท",
    defaultValue: "0.00",
    dataSource: "แหล่งเก็บข้อมูลเงินกองกลางและเงินรุ่น (D4 GeneralFund)",
    security: "เหรัญญิก/แอดมินเท่านั้นที่สามารถปรับปรุงยอดได้",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องเป็นตัวเลข",
    derivationFormula: "ยอดรายรับ - ยอดรายจ่ายกองกลาง",
    note: "เงินกองกลางสำหรับกิจกรรมสาขา"
  },
  {
    tableNum: 29,
    name: "ยอดเงินรุ่นคงเหลือ",
    altName: "classFund",
    typeLength: "Float / Decimal(10,2)",
    outputFormat: "999,999.99 บาท",
    defaultValue: "0.00",
    dataSource: "แหล่งเก็บข้อมูลเงินกองกลางและเงินรุ่น (D4 GeneralFund)",
    security: "เหรัญญิก/แอดมินเท่านั้นที่สามารถปรับปรุงยอดได้",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null), ต้องเป็นตัวเลข",
    derivationFormula: "ยอดเงินรุ่นคงเหลือ",
    note: "เงินรุ่นสำหรับบริหารจัดการภายในรุ่น"
  },
  {
    tableNum: 30,
    name: "ชื่อผู้ปรับปรุงยอด",
    altName: "updatedBy",
    typeLength: "Varchar 50",
    outputFormat: "xxxxxxxxxxxxxxxxxxxx",
    defaultValue: "-",
    dataSource: "แหล่งเก็บข้อมูลเงินกองกลางและเงินรุ่น (D4 GeneralFund)",
    security: "บันทึกชื่อของเหรัญญิกที่ล็อกอินเข้าใช้งาน",
    responsibleUser: "เหรัญญิก / แอดมิน",
    validationRule: "ยอมรับค่าว่างได้ (Nullable)",
    derivationFormula: "-",
    note: "ระบุว่าเหรัญญิกคนใดเป็นผู้อัปเดตยอดล่าสุด"
  },
  {
    tableNum: 31,
    name: "วันที่ปรับปรุงล่าสุด",
    altName: "updatedAt",
    typeLength: "DateTime",
    outputFormat: "วว/ดด/ปปปป ชช:นน:วว",
    defaultValue: "วันเวลาปัจจุบัน (Current Timestamp)",
    dataSource: "แหล่งเก็บข้อมูลเงินกองกลางและเงินรุ่น (D4 GeneralFund)",
    security: "บันทึกโดยระบบอัตโนมัติเมื่อมีการอัปเดตยอดเงิน",
    responsibleUser: "ระบบ (System)",
    validationRule: "ห้ามเป็นค่าว่าง (Not Null)",
    derivationFormula: "-",
    note: "วันเวลาที่ปรับปรุงยอดเงินครั้งล่าสุด"
  }
];

function generateTableBox(item) {
  return `
    <div class="data-element-card">
      <div class="field-row"><span class="label">ชื่อหน่วยข้อมูล (Data Element Name) :</span><span class="value val-title">${item.name}</span></div>
      <div class="field-row"><span class="label">ชื่ออื่น (Alternate Name) :</span><span class="value">${item.altName}</span></div>
      <div class="field-row"><span class="label">ประเภทและความยาว (Type and Length) :</span><span class="value">${item.typeLength}</span></div>
      <div class="field-row"><span class="label">รูปแบบการแสดงผล (Output Format) :</span><span class="value">${item.outputFormat}</span></div>
      <div class="field-row"><span class="label">ค่าที่กำหนด (Default Value) :</span><span class="value">${item.defaultValue}</span></div>
      <div class="field-row"><span class="label">แหล่งข้อมูล (Data Source) :</span><span class="value">${item.dataSource}</span></div>
      <div class="field-row"><span class="label">ความปลอดภัย (Security) :</span><span class="value">${item.security}</span></div>
      <div class="field-row"><span class="label">ผู้ใช้ที่รับผิดชอบ (Responsible End User) :</span><span class="value">${item.responsibleUser}</span></div>
      <div class="field-row"><span class="label">กฎการตรวจสอบความถูกต้อง (Validation Rule) :</span><span class="value">${item.validationRule}</span></div>
      <div class="field-row"><span class="label">สูตรในการคำนวณ (Derivation Formula) :</span><span class="value">${item.derivationFormula}</span></div>
      <div class="field-row"><span class="label">หมายเหตุ :</span><span class="value">${item.note}</span></div>
    </div>
    <div class="table-caption">ตารางที่ ${item.tableNum} พจนานุกรมของหน่วยข้อมูล${item.name}</div>
  `;
}

// Group into pages (2 tables per page)
const pages = [];
for (let i = 0; i < dataElements.length; i += 2) {
  pages.push(dataElements.slice(i, i + 2));
}

const htmlPages = pages.map((pageItems, pIndex) => {
  return `
    <div class="a4-page" id="page-${pIndex + 1}">
      <div class="page-content">
        ${pageItems.map(generateTableBox).join('<div class="spacer"></div>')}
      </div>
    </div>
  `;
}).join('\n');

const fullHtml = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>พจนานุกรมข้อมูล (Data Dictionary) - CampusPay</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #e9ecef;
      font-family: 'Sarabun', 'Leelawadee UI', Tahoma, sans-serif;
      color: #000000;
      padding-bottom: 60px;
    }
    .top-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #1e293b;
      color: #ffffff;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .toolbar-title {
      font-size: 18px;
      font-weight: 600;
    }
    .toolbar-actions {
      display: flex;
      gap: 12px;
    }
    .btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #1d4ed8;
    }
    .btn-secondary {
      background: #475569;
    }
    .btn-secondary:hover {
      background: #334155;
    }
    .a4-page {
      width: 1000px;
      min-height: 1414px;
      background: #ffffff;
      margin: 30px auto;
      padding: 70px 80px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      page-break-after: always;
      break-after: page;
      position: relative;
    }
    .page-indicator {
      text-align: right;
      font-size: 14px;
      color: #888888;
      margin-bottom: 20px;
    }
    .page-content {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    .data-element-card {
      border: 1.8px solid #000000;
      padding: 22px 28px;
      width: 100%;
      background: #ffffff;
    }
    .field-row {
      display: flex;
      line-height: 2.05;
      font-size: 16px;
    }
    .label {
      font-weight: 400;
      color: #000000;
      white-space: nowrap;
      min-width: 320px;
    }
    .value {
      color: #000000;
      padding-left: 8px;
      word-break: break-word;
    }
    .val-title {
      font-weight: 600;
    }
    .table-caption {
      text-align: center;
      font-size: 16.5px;
      font-weight: 600;
      margin-top: 12px;
      margin-bottom: 30px;
      color: #000000;
    }
    .spacer {
      height: 15px;
    }
    @media print {
      body { background: none; padding: 0; }
      .no-print { display: none !important; }
      @page {
        size: A4 portrait;
        margin: 15mm 20mm;
      }
      .a4-page {
        width: 100%;
        min-height: auto;
        margin: 0;
        padding: 0;
        box-shadow: none;
        page-break-after: always;
        break-after: page;
      }
      .page-indicator {
        display: none;
      }
      .data-element-card {
        border: 1.5pt solid #000000;
        padding: 16pt 20pt;
      }
      .field-row {
        line-height: 1.9;
        font-size: 13.5pt;
      }
      .label {
        min-width: 250pt;
      }
      .table-caption {
        font-size: 14pt;
        margin-top: 10pt;
        margin-bottom: 25pt;
      }
      .spacer {
        height: 10pt;
      }
    }
  </style>
</head>
<body>
  <div class="top-toolbar no-print">
    <div class="toolbar-title">📚 พจนานุกรมข้อมูล (Data Dictionary) ทั้งหมด 31 ตาราง (หน้าละ 2 ตาราง)</div>
    <div class="toolbar-actions">
      <button class="btn" onclick="window.print()">🖨️ พิมพ์ / บันทึก PDF (Print)</button>
    </div>
  </div>
  ${pages.map((pageItems, pIndex) => `
    <div class="a4-page" id="page-${pIndex + 1}">
      <div class="page-indicator no-print">หน้า ${pIndex + 1} จาก ${pages.length}</div>
      <div class="page-content">
        ${pageItems.map(generateTableBox).join('<div class="spacer"></div>')}
      </div>
    </div>
  `).join('\n')}
</body>
</html>
`;

// Save the complete HTML file
fs.writeFileSync(path.join(diagramsDir, 'data_dictionary.html'), fullHtml, 'utf8');
console.log('Saved data_dictionary.html successfully.');

// Render all 16 pages into PNG files
const pagesDir = path.join(diagramsDir, 'data_dictionary_pages');
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

function renderPage(pageNum, items) {
  const pHtml = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>Data Dictionary Page ${pageNum}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #ffffff;
      font-family: 'Sarabun', 'Leelawadee UI', Tahoma, sans-serif;
      width: 1200px;
      height: 1600px;
      margin: 0;
      padding: 80px 90px;
      overflow: hidden;
      color: #000000;
    }
    .data-element-card {
      border: 1.8px solid #000000;
      padding: 24px 30px;
      width: 100%;
      background: #ffffff;
    }
    .field-row {
      display: flex;
      line-height: 2.1;
      font-size: 16px;
    }
    .label {
      font-weight: 400;
      color: #000000;
      white-space: nowrap;
      min-width: 320px;
    }
    .value {
      color: #000000;
      padding-left: 8px;
    }
    .val-title {
      font-weight: 600;
    }
    .table-caption {
      text-align: center;
      font-size: 17px;
      font-weight: 600;
      margin-top: 14px;
      margin-bottom: 35px;
      color: #000000;
    }
    .spacer {
      height: 20px;
    }
  </style>
</head>
<body>
  ${items.map(generateTableBox).join('<div class="spacer"></div>')}
</body>
</html>
`;
  const pad = String(pageNum).padStart(2, '0');
  const hPath = path.join(pagesDir, `page_${pageNum}.html`);
  const pPath = path.join(diagramsDir, `data_dictionary_page_${pad}.png`);
  fs.writeFileSync(hPath, pHtml, 'utf8');
  execSync('"' + edgePath + '" --headless=new --disable-gpu --window-size=1200,1600 --screenshot="' + pPath.replace(/\\/g, '/') + '" "file:///' + hPath.replace(/\\/g, '/') + '"');
}

console.log('Rendering all 16 pages...');
for (let p = 0; p < pages.length; p++) {
  renderPage(p + 1, pages[p]);
  process.stdout.write(`Page ${p + 1}/${pages.length} done.\r`);
}
console.log('\nAll 16 pages rendered directly into diagrams/data_dictionary_page_01.png - page_16.png');


console.log('All Data Dictionary builds completed successfully!');

