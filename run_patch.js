const fs = require('fs');

// 1. Update src/actions/room.ts
let roomTs = fs.readFileSync("src/actions/room.ts", "utf8");
roomTs = roomTs.replace(
  'return { success: false, error: "คอเสรเร้เร้เิเดไรเตnกแตกดิิ" };',
  'return { success: true, payment: existingPayment, alreadyJoined: true };'
);
fs.writeFileSync("src/actions/room.ts", roomTs, "utf8");
// 2. Update src/app/student/join/page.tsx
let joinCode = fs.readFileSync("src/app/student/join/page.tsx", "utf8");
joinCode = joinCode.replace(
  'router.push(`/student/dashboard`);',
  'router.push(`/student/rooms/${selectedRoom.id}`);'
);
joinCode = joinCode.replace(
  'if (res.success9 if(",
  'if (res.success || res.error === "คมเพหเิเดไมเพหเิเด") {'
);
joinCode = joinCode.replace(
  'if (res.success) {',
  'if (res.success || res.error === "คมเพหเิเดไมเพหเิเด") {'
);
joinCode = joinCode.replace(
  'alert("คมเพหเิเดไมเพหเิเด!");',
  'if (res.alreadyJoined || res.error === "คඨเสรเร้เร้เิเดไรแตกแตกดิิ") { alert("คඨเสรเร้เร้เิเดไรแตกแตกดิิคเรเร้เร้เิเดไรแตกแตกดิิ"); } else { alert("คอเสรเร้เร้เิเดไรเตnกแตกดิิ!"); }'
);
fs.writeFileSync("src/app/student/join/page.tsx", joinCode, 'utf8");

// 3. Update src/app/student/dashboard/page.tsx
let dashCode = fs.readFileSync("src/app/student/dashboard/page.tsx", "utf8");
dashCode = dashCode.replace(
  'if (res.error === "คඨเสรเร้เร้เิเดไรแตกแตกดิิ") {
',
  'if (res.alreadyJoined || res.error === "คඨเสรเร้เร้เิเดไรแตกแตกดิิ") {\n      alert("คมเพหเิเดไมเพหเิเดคเรเร้��й�ร้เิเดไรแตกแตกดิิ");'
);
fs.writeFileSync("src/app/student/dashboard/page.tsx", dashCode, 'utf8');

console.log('PATCH_SUCCESSFUL');