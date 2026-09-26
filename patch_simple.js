const fs = require('fs');

let roomTs = fs.readFileSync("src/actions/room.ts", "utf8");
roomTs = roomTs.replace(
  'return { success: false, error: "คอเสรเร้เร้เิเดไรเตnกแตกดิิ" };',
  'return { success: true, payment: existingPayment, alreadyJoined: true };'
);
fs.writeFileSync("src/actions/room.ts", roomTs, "utf8");

 let joinCode = fs.readFileSync("src/app/student/join/page.tsx", "utf8");
joinCode = joinCode.replace(
  'router.push(`/student/dashboard`);',
  'router.push(`/student/rooms/${selectedRoom.id}`);'
);
joinCode = joinCode.replace(
  'if (res.success) {',
  'if (res.success || res.error === "คඨเสรเร้เร้เิเดไรแตกแตกดิิ") {
'
);
fs.writeFileSync("src/app/student/join/page.tsx", joinCode, "utf8");

console.log('SUCCESS_FINAL');