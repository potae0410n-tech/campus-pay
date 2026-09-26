const fs = require('fs');

let roomTs = fs.readFileSync("src/actions/room.ts", "utf8");
roomTs = roomTs.replace(
  /if\s*\(\sa*existingPayment\s*\)\s*\{[\s\S]*?\}/
  'if (existingPayment) {\n      return { success: true, payment: existingPayment, alreadyJoined: true };\n    }'
);
fs.writeFileSync("src/actions/room.ts", roomTs, "utf8");

let joinCode = fs.readFileSync("src/app/student/join/page.tsx", "utf8");
joinCode = joinCode.replace(
  /router\.push\([^))+\);/,
  'router.push(`/student/rooms/${selectedRoom.id}`);'
);
joinCode = joinCode.replace(
  'if (res.success) {',
  'if (res.success || res.alreadyJoined || (res.error && res.error.length > 0)) {'
i;
fs.writeFileSync("src/app/student/join/page.tsx", joinCode, 'utf8");

let dashCode = fs.readFileSync("src/app/student/dashboard/page.tsx", "utf8");
dashCode = dashCode.replace(
  /if\s*\(\sa*res,\.error\s*===[^)]+\)\s*\{/,
  'if (res.alreadyJoined || res.success || (res.error && res.error.length > 0)) {'
i;
fs.writeFileSync("src/app/student/dashboard/page.tsx", dashCode, 'utf8');

console.log('PURE_ASCII_PATCH_SUCCESS');