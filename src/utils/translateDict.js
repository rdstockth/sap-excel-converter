// ══════════════════════════════════════════════════════════════
// TAGGED MAINTENANCE DICTIONARY (FULL EDITION: UTILITY + AUTOMATION)
// t: A=Action  C=Component  S=Symptom  L=Location  M=Modifier
// sys: System Category (Optional for Analytics Dashboard)
// ══════════════════════════════════════════════════════════════

export const _dict = Object.freeze({
  // ── Symptoms (S) ──
  "ไม่ทำงาน":{en:"not working",t:"S"},"เสีย":{en:"faulty",t:"S"},
  "ชำรุด":{en:"damaged",t:"S"},"พัง":{en:"broken",t:"S"},
  "เออเร่อ":{en:"error",t:"S"},"เอ่อเร่อ":{en:"error",t:"S"},
  "ช๊อต":{en:"short circuit",t:"S"},"ช็อต":{en:"short circuit",t:"S"},
  "ไฟรั่ว":{en:"electrical leak",t:"S"},"โอเวอร์โหลด":{en:"overload",t:"S"},
  "น๊อค":{en:"system crash",t:"S"},"สวิตส์ไฟทิป":{en:"breaker tripped",t:"S"},
  "ไฟตัด":{en:"breaker tripped",t:"S"},"ไฟตก":{en:"voltage drop",t:"S"},
  "ไฟไม่เข้า":{en:"no power",t:"S"},"ไฟดับ":{en:"power outage",t:"S"},
  "เปิดไม่ติด":{en:"won't turn on",t:"S"},"จอดับ":{en:"blank screen",t:"S"},
  "หน้าจอไม่ติด":{en:"display off",t:"S"},"ติดๆดับๆ":{en:"flickering",t:"S"},
  "ค้าง":{en:"jammed",t:"S"},"ติด":{en:"jammed",t:"S"},
  "งัด":{en:"binding",t:"S"},"หนีบ":{en:"pinched",t:"S"},
  "ฝืด":{en:"stiff",t:"S"},"แน่นเกินไป":{en:"too tight",t:"S"},
  "แนนเกินไป":{en:"too tight",t:"S"},"ยืด":{en:"stretched",t:"S"},
  "รูด":{en:"stripped",t:"S"},"เกลียวรูด":{en:"stripped thread",t:"S"},
  "เฟืองรูด":{en:"stripped gear",t:"S"},"ปีนร่อง":{en:"derailed",t:"S"},
  "ตกล่อง":{en:"off track",t:"S"},"หลุด":{en:"disconnected",t:"S"},
  "หลวม":{en:"loose",t:"S"},"โยก":{en:"wobbly",t:"S"},
  "คลอน":{en:"excessive play",t:"S"},"หย่อน":{en:"slack",t:"S"},
  "ไม่ตึง":{en:"not tight enough",t:"S"},"ตก":{en:"sagging",t:"S"},
  "ร่วง":{en:"dropped",t:"S"},"ปลิว":{en:"blown away",t:"S"},
  "ไม่ตรง":{en:"misaligned",t:"S"},"เคลื่อนไม่ตรงกัน":{en:"out of sync",t:"S"},
  "ศูนย์ไม่ได้":{en:"off-center",t:"S"},"เช็นเตอร์":{en:"off-center",t:"S"},
  "ไม่ตรงกลาง":{en:"off-center",t:"S"},"เอียง":{en:"tilted",t:"S"},
  "กระตุก":{en:"jerking",t:"S"},"สั่น":{en:"heavy vibration",t:"S"},
  "มีเสียงดัง":{en:"abnormal noise",t:"S"},"กระแทกเสียงดัง":{en:"loud impact noise",t:"S"},
  "หัก":{en:"snapped",t:"S"},"ขาด":{en:"torn",t:"S"},
  "แตก":{en:"cracked",t:"S"},"สึก":{en:"worn out",t:"S"},
  "เป็นรอย":{en:"scratched",t:"S"},"โก่งขึ้น":{en:"buckled",t:"S"},
  "โก่ง":{en:"bent",t:"S"},"ไม่หมุน":{en:"not rotating",t:"S"},
  "หมุนช้า":{en:"rotating slowly",t:"S"},"ไม่ได้รอบ":{en:"incorrect RPM",t:"S"},
  "หมุนๆหยุดๆ":{en:"intermittent rotation",t:"S"},"เดินๆหยุดๆ":{en:"intermittent movement",t:"S"},
  "ลดสปีดไม่อยู่":{en:"runaway speed",t:"S"},"ไปไม่สุด":{en:"incomplete stroke",t:"S"},
  "กลับไม่สุด":{en:"incomplete return",t:"S"},"ไม่ดูด":{en:"no suction",t:"S"},
  "ดูดน้อย":{en:"low suction",t:"S"},"ไม่จุ๊ฟ":{en:"pad not gripping",t:"S"},
  "ไม่ปล่อย":{en:"won't release",t:"S"},"เสียบไม่เข้า":{en:"cannot insert",t:"S"},
  "ปาดโดน":{en:"rubbing",t:"S"},"ชนขอบ":{en:"hitting edge",t:"S"},
  "ปิดไม่สนิท":{en:"not sealing completely",t:"S"},"เปิดยาก":{en:"hard to open",t:"S"},
  "รั่ว":{en:"leak",t:"S"},"รั้ว":{en:"leak",t:"S"},
  "ซึม":{en:"seeping",t:"S"},"หยด":{en:"dripping",t:"S"},
  "ล้น":{en:"overflowing",t:"S"},"ไหลไม่หยุด":{en:"flowing continuously",t:"S"},
  "ไม่ไหล":{en:"no flow",t:"S"},"ตัน":{en:"clogged",t:"S"},
  "ตันบ่อย":{en:"frequently clogged",t:"S"},"อั้น":{en:"restricted flow",t:"S"},
  "ไม่ฉีด":{en:"not spraying",t:"S"},"ฉีดตลอด":{en:"spraying continuously",t:"S"},
  "ฉีดบ้างไม่ฉีดบ้าง":{en:"intermittent spray",t:"S"},"ไม่เติม":{en:"not refilling",t:"S"},
  "ไม่มีแรงดัน":{en:"no pressure",t:"S"},"เบา":{en:"low pressure",t:"S"},
  "น้ำแข็งเกาะ":{en:"frost buildup",t:"S"},"หม้อต้มไม่ร้อน":{en:"boiler not heating",t:"S"},
  "ไม่เดือด":{en:"not boiling",t:"S"},"ไม่ละลาย":{en:"not melting",t:"S"},
  "ร้อน":{en:"overheating",t:"S"},"เหม็นไหม้":{en:"burning smell",t:"S"},
  "กลิ่นน้ำยาแรง":{en:"strong chemical smell",t:"S"},"ไม่ได้ค่าที่กำหนด":{en:"out of spec",t:"S"},
  "ไม่ตรงที่ตั้งไว้":{en:"setpoint deviation",t:"S"},"เกินค่ากำหนด":{en:"over limit",t:"S"},
  "ต่ำ":{en:"low level",t:"S"},"ต่ำกว่าค่ากำหนด":{en:"below target",t:"S"},
  "สูง":{en:"high level",t:"S"},"อุณหภูมิไม่ขึ้น":{en:"temperature not rising",t:"S"},
  "ไม่คงที่":{en:"unstable",t:"S"},
  "ขึ้น ลง":{en:"fluctuating",t:"S"},"ตัวเลขเบิ้ล":{en:"display ghosting",t:"S"},
  "ไม่ผ่าน":{en:"QA failed",t:"S"},"สีไม่ออก":{en:"no ink",t:"S"},
  "สีแตก":{en:"ink bleeding",t:"S"},"สีหยด":{en:"ink dripping",t:"S"},
  "หมึกเลอะ":{en:"ink smudged",t:"S"},"เลอะ":{en:"smeared",t:"S"},
  "ดำเกินไป":{en:"too dark",t:"S"},"เป็นเส้นดำ":{en:"black streaks",t:"S"},
  "เป็นเส้นปะ":{en:"dotted lines",t:"S"},"เทปยับย่น":{en:"tape wrinkled",t:"S"},
  "เทปย่น":{en:"tape wrinkled",t:"S"},"พับไม่สวย":{en:"poor folding",t:"S"},
  "พันไม่สวย":{en:"poor wrapping",t:"S"},"ไม่สมบูรณ์":{en:"incomplete process",t:"S"},
  "ผิดตำแหน่ง":{en:"wrong position",t:"S"},"ไม่ได้ระยะ":{en:"wrong clearance",t:"S"},
  "สแกนไม่ได้":{en:"cannot scan",t:"S"},"อ่านบาร์โค๊ตข้างเดียว":{en:"scans one side only",t:"S"},
  "ไม่อ่านบาร์โค๊ต":{en:"cannot read barcode",t:"S"},"สัญลักษณ์ขาดหาย":{en:"missing characters",t:"S"},
  "ไม่ชัด":{en:"unclear ",t:"S"},"กระดาษติด":{en:"paper jam",t:"S"},
  "ไม่ได้ยินเสียง":{en:"no sound",t:"S"},"ไม่มีเสียงเตือน":{en:"no alarm sound",t:"S"},
  "สกปรกมาก":{en:"very dirty",t:"S"},"สกปรก":{en:"dirty",t:"S"},
  "เสื่อม":{en:"degraded",t:"S"},"หมดอายุ":{en:"expired",t:"S"},
  "ติดเศษ":{en:"debris jammed",t:"S"},"แรงดันต่ำ":{en:"low pressure",t:"S"},
  "แรงดันสูง":{en:"high pressure",t:"S"},"อุดตัน":{en:"blocked",t:"S"},
  "อ่านบาร์โค้ดข้างเดียว":{en:"scans one side only",t:"S"},"ไม่อ่านบาร์โค้ด":{en:"cannot read barcode",t:"S"},

  // ── Lens Quality Defect Symptoms ──
  "เลนส์เป็นรอย":{en:"scratched lens",t:"S"},"เลนส์แตก":{en:"cracked lens",t:"S"},
  "เลนส์บิ่น":{en:"chipped lens",t:"S"},"เลนส์มัว":{en:"hazy lens",t:"S"},
  "เลนส์ขุ่น":{en:"cloudy lens",t:"S"},"เลนส์เป็นฝ้า":{en:"foggy lens",t:"S"},
  "เลนส์เบี้ยว":{en:"warped lens",t:"S"},"ผิวไม่เรียบ":{en:"rough surface",t:"S"},
  "ผิวไม่เงา":{en:"dull surface",t:"S"},"ขัดไม่ออก":{en:"cannot polish out",t:"S"},
  "เคลือบไม่ติด":{en:"coating won't stick",t:"S"},"เคลือบลอก":{en:"peeling coating",t:"S"},
  "เคลือบไม่สม่ำเสมอ":{en:"uneven coating",t:"S"},"สีเพี้ยน":{en:"wrong color",t:"S"},
  "ฟองอากาศ":{en:"air bubbles",t:"S"},"ฝุ่นติด":{en:"dust trapped",t:"S"},
  "คราบน้ำ":{en:"water stains",t:"S"},"ผิวส้ม":{en:"orange peel defect",t:"S"},
  "ผิวไหม้":{en:"burnt surface",t:"S"},"ผิวด่าง":{en:"stained surface",t:"S"},
  "ลายขัด":{en:"polishing marks",t:"S"},"รอยขนแมว":{en:"hairline scratches",t:"S"},
  "ขัดกิน":{en:"over-polished",t:"S"},"ขัดไม่ถึง":{en:"under-polished",t:"S"},
  "เลนส์บวม":{en:"swollen lens",t:"S"},"เลนส์บาง":{en:"lens too thin",t:"S"},
  "เลนส์หนา":{en:"lens too thick",t:"S"},"กำลังเลนส์ผิด":{en:"wrong lens power",t:"S"},
  "ความโค้งผิด":{en:"wrong curvature",t:"S"},"ศูนย์เลนส์เพี้ยน":{en:"off-center lens",t:"S"},

  // ── Lens Machine Process Symptoms ──
  "ขัดไม่หมุน":{en:"polishing plate not rotating",t:"S"},"ขัดไม่สม่ำเสมอ":{en:"uneven polishing",t:"S"},
  "เลนส์หลุด":{en:"lens detached",t:"S"},"ดูดไม่ติด":{en:"won't vacuum hold",t:"S"},
  "เลนส์หมุน":{en:"lens slipping",t:"S"},"เลนส์เอียง":{en:"lens tilted",t:"S"},
  "ขัดแรงเกิน":{en:"excessive polishing force",t:"S"},"กินผิว":{en:"over-grinding",t:"S"},

  // ── Electrical Fault Symptoms ──
  "ไฟเกิน":{en:"overvoltage",t:"S"},"ไฟตกบ่อย":{en:"frequent voltage drop",t:"S"},
  "ไฟไม่เสถียร":{en:"unstable power",t:"S"},"เฟสหาย":{en:"phase loss",t:"S"},
  "เฟสสลับ":{en:"wrong phase sequence",t:"S"},"ฟิวส์ขาด":{en:"blown fuse",t:"S"},
  "โอเวอร์เคอเรนท์":{en:"overcurrent",t:"S"},"โอเวอร์โวลต์":{en:"overvoltage",t:"S"},
  "ไฟกระชาก":{en:"power surge",t:"S"},"กราวด์รั่ว":{en:"ground fault",t:"S"},
  "วงจรเปิด":{en:"open circuit",t:"S"},"ไฟไม่ครบเฟส":{en:"missing phase",t:"S"},
  "กระแสเกิน":{en:"overcurrent",t:"S"},"สัญญาณขาด":{en:"signal loss",t:"S"},
  "สัญญาณรบกวน":{en:"signal noise",t:"S"},

  // ── Motor / Drive Symptoms ──
  "มอเตอร์ร้อน":{en:"motor overheating",t:"S"},"มอเตอร์ไม่หมุน":{en:"motor not rotating",t:"S"},
  "มอเตอร์สะดุด":{en:"motor stalling",t:"S"},"สั่นแรง":{en:"heavy vibration",t:"S"},
  "ตำแหน่งเพี้ยน":{en:"position drifted",t:"S"},

  // ── Process / Production Symptoms ──
  "ชิ้นงานติด":{en:"part jammed",t:"S"},"ชิ้นงานเอียง":{en:"part misaligned",t:"S"},
  "ชิ้นงานตก":{en:"part dropped",t:"S"},"งานค้าง":{en:"process stalled",t:"S"},
  "งานล้น":{en:"product overflow",t:"S"},"หยิบไม่ขึ้น":{en:"cannot pick up",t:"S"},
  "วางไม่ลง":{en:"cannot place",t:"S"},"หยิบพลาด":{en:"mispicked",t:"S"},
  "ขนาดผิด":{en:"wrong dimension",t:"S"},"ตำแหน่งผิด":{en:"wrong position",t:"S"},

  // ── Pneumatic Symptoms ──
  "ลมรั่ว":{en:"air leak",t:"S"},"ลมไม่เข้า":{en:"no air supply",t:"S"},
  "ไม่มีลม":{en:"no air supply",t:"S"},"แรงดันลมตก":{en:"air pressure drop",t:"S"},
  "แรงดันลมต่ำ":{en:"low air pressure",t:"S"},"ลมไม่พอ":{en:"insufficient air",t:"S"},
  "กระบอกลมช้า":{en:"slow cylinder",t:"S"},"กระบอกลมไม่ทำงาน":{en:"cylinder not working",t:"S"},
  "วาล์วค้าง":{en:"stuck valve",t:"S"},"วาล์วรั่ว":{en:"leaking valve",t:"S"},

  // ── Corrosion & Wear Symptoms ──
  "เป็นสนิม":{en:"corroded",t:"S"},"สนิม":{en:"rust",t:"S"},
  "กัดกร่อน":{en:"corrosion",t:"S"},"สึกหรอ":{en:"worn out",t:"S"},
  "ผุ":{en:"decayed",t:"S"},"กะเทาะ":{en:"chipped",t:"S"},

  // ── Communication & Control Symptoms ──
  "การสื่อสารขาด":{en:"communication lost",t:"S"},"ไม่สื่อสาร":{en:"communication lost",t:"S"},
  "ไทม์เอาท์":{en:"timeout",t:"S"},"เน็ตเวิร์คขาด":{en:"network disconnected",t:"S"},
  "โปรแกรมล่ม":{en:"program crashed",t:"S"},"โปรแกรมค้าง":{en:"program frozen",t:"S"},
  "ไม่ตอบสนอง":{en:"unresponsive",t:"S"},"หน้าจอค้าง":{en:"screen frozen",t:"S"},
  "ขั้วไหม้":{en:"burnt terminal",t:"S"},"สายไหม้":{en:"burnt wire",t:"S"},
  "แรงบิดต่ำ":{en:"low torque",t:"S"},"กำลังตก":{en:"power drop",t:"S"},
  "โอเวอร์เทมป์":{en:"overtemp",t:"S"},"อุณหภูมิเกิน":{en:"overtemp",t:"S"},
  "ม่านแสงทริป":{en:"light curtain tripped",t:"S"},"เซฟตี้ทริป":{en:"safety tripped",t:"S"},

  // ── Components (C) ──
  "สายพาน":{en:"conveyor belt",t:"C"},"สายพาย":{en:"conveyor belt",t:"C"},
  "สายพราน":{en:"conveyor belt",t:"C"},"โซ่":{en:"chain",t:"C"},
  "มอเตอร์":{en:"motor",t:"C"},"เฟืองมอเตอร์":{en:"motor pinion",t:"C"},
  "ลูกยาง":{en:"rubber roller",t:"C"},"ยางดำ":{en:"rubber seal",t:"C"},
  "ฟองน้ำ":{en:"sponge pad",t:"C"},"กระบอกสูบ":{en:"cylinder",t:"C"},
  "กระบอกลม":{en:"pneumatic cylinder",t:"C"},"กระบอกโช๊คลม":{en:"shock absorber",t:"C"},
  "สเลนเดอร์":{en:"cylinder",t:"C"},"แกน":{en:"shaft",t:"C"},
  "แกนกระทุ้ง":{en:"ejector pin",t:"C"},"กะทุ้ง":{en:"ejector",t:"C"},
  "ลูกตุ้ม":{en:"counterweight",t:"C"},"เฟือง":{en:"gear",t:"C"},
  "เกลียว":{en:"thread",t:"C"},"วงแหวน":{en:"retaining ring",t:"C"},
  "ใบมีด":{en:"blade",t:"C"},"ใบพัดลม":{en:"fan blade",t:"C"},
  "สปริง":{en:"spring",t:"C"},"สปิง":{en:"spring",t:"C"},
  "สลิง":{en:"wire rope / sling",t:"C"},"ตะขอ":{en:"hook",t:"C"},
  "ลิฟท์":{en:"lift",t:"C"},"ล้อ":{en:"wheel",t:"C"},
  "ล้อรถเข็น":{en:"caster wheel",t:"C"},"ขา":{en:"leg",t:"C"},
  "ฐาน":{en:"base",t:"C"},"ราง":{en:"guide rail",t:"C"},
  "ม่าน":{en:"strip curtain",t:"C"},"ฉากกัน":{en:"safety guard",t:"C"},
  "กันชน":{en:"bumper",t:"C"},"สายลม":{en:"air hose",t:"C"},
  "ท่อลม":{en:"air pipe",t:"C"},"ท่อน้ำ":{en:"water pipe",t:"C"},
  "สายน้ำ":{en:"water hose",t:"C"},"สายน้ำยา":{en:"chemical hose",t:"C"},
  "ท่อน้ำทิ้ง":{en:"drain pipe",t:"C"},"ท่อเมน":{en:"main pipe",t:"C"},
  "รูท่อระบายน้ำ":{en:"drain hole",t:"C"},"ข้อต่อ":{en:"fitting",t:"C"},
  "คอปเปอร์":{en:"quick coupler",t:"C"},"วาล์ว":{en:"valve",t:"C"},
  "วาล์วไนโตรเจน":{en:"nitrogen valve",t:"C"},"ปั้ม":{en:"pump",t:"C"},
  "ปั๊ม":{en:"pump",t:"C"},"เกจวัด":{en:"pressure gauge",t:"C"},
  "หลอดแก้ว":{en:"sight glass",t:"C"},"ซีล":{en:"seal",t:"C"},
  "โอริง":{en:"o-ring",t:"C"},"โฟลมิเตอร์":{en:"flow meter",t:"C"},
  "โฟเลท":{en:"flow sensor",t:"C"},"ท่อหุ้ม":{en:"insulation jacket",t:"C"},
  "น๊อต":{en:"bolt / nut",t:"C"},"น็อต":{en:"bolt / nut",t:"C"},
  "สลัก":{en:"pin",t:"C"},"เดือย":{en:"locating pin",t:"C"},
  "กิ๊ปเปอร์":{en:"gripper",t:"C"},"ตัวจับ":{en:"fixture",t:"C"},
  "ตัวหนีบ":{en:"clamp",t:"C"},"ขาหนีบ":{en:"gripper arm",t:"C"},
  "ตัวจุ๊บ":{en:"vacuum pad",t:"C"},"ชัค":{en:"chuck",t:"C"},
  "สพินเดิ้ล":{en:"spindle",t:"C"},"เบ้าบล๊อก":{en:"block socket",t:"C"},
  "ตัวดัน":{en:"pusher",t:"C"},"แขนลาก":{en:"pulling arm",t:"C"},
  "แขนผลัก":{en:"pushing arm",t:"C"},"สเตท":{en:"stage",t:"C"},
  "สเตจ":{en:"stage",t:"C"},"ตะแกรง":{en:"wire mesh basket",t:"C"},
  "ฟันตะแกรง":{en:"basket index teeth",t:"C"},"ถาด":{en:"tray",t:"C"},
  "ถาดรอง":{en:"drip pan",t:"C"},"แหร็คปล่อยงาน":{en:"unloading rack",t:"C"},
  "อ่าง":{en:"bath / tub",t:"C"},"ถัง":{en:"tank",t:"C"},
  "หม้อต้ม":{en:"boiler",t:"C"},"บอยเลอร์":{en:"boiler",t:"C"},
  "ตู้":{en:"cabinet",t:"C"},"ตู้อบ":{en:"oven",t:"C"},
  "ตู้เย็น":{en:"refrigerator",t:"C"},"แอร์":{en:"air conditioner",t:"C"},
  "ท่อแอร์":{en:"HVAC duct",t:"C"},"แผงคอยล์เย็น":{en:"evaporator coil",t:"C"},
  "ฮีตเตอร์":{en:"heater",t:"C"},"ฉนวน":{en:"insulation",t:"C"},
  "ตู้ไฟ":{en:"electrical panel",t:"C"},"ตู้คอนโทรล":{en:"control panel",t:"C"},
  "แผงวงจร":{en:"PCB",t:"C"},"เซ็นเซอร์":{en:"sensor",t:"C"},
  "แท่งเซ็นเซอร์":{en:"sensor probe",t:"C"},"สวิทช์":{en:"switch",t:"C"},
  "ฟุทสวิทส์":{en:"foot switch",t:"C"},"ฟุตสวิตท์":{en:"foot switch",t:"C"},
  "ปุ่มกด":{en:"push button",t:"C"},"สายไฟ":{en:"power cable",t:"C"},
  "ปลั๊กไฟ":{en:"plug",t:"C"},"สายกราวน์":{en:"ground wire",t:"C"},
  "สายกราวด์":{en:"ground wire",t:"C"},"สายแลน":{en:"LAN cable",t:"C"},
  "หน้าจอ":{en:"HMI screen",t:"C"},"จอคอม":{en:"monitor",t:"C"},
  "หลอดไฟ":{en:"lamp / light bulb",t:"C"},"บาแลม":{en:"bar lamp",t:"C"},
  "แวคคั่ม":{en:"vacuum pump",t:"C"},"แอคซอส":{en:"exhaust fan",t:"C"},
  "สายวัดอุณหภูมิ":{en:"thermocouple wire",t:"C"},"แท่งวัดอุณหภูมิ":{en:"temperature probe",t:"C"},
  "ตาชั่ง":{en:"scale",t:"C"},"เครื่องชั่ง":{en:"scale",t:"C"},
  "เวอร์เนีย":{en:"vernier caliper",t:"C"},"แบตเตอรี่":{en:"battery",t:"C"},
  "ถ่าน":{en:"carbon brush",t:"C"},"อัลลอยด์":{en:"alloy",t:"C"},
  "โมโนเมอร์":{en:"monomer",t:"C"},"เรซิน":{en:"resin",t:"C"},
  "แลคเกอร์":{en:"lacquer",t:"C"},"น้ำหล่อเย็น":{en:"coolant",t:"C"},
  "น้ำกรด":{en:"acid",t:"C"},"ฟิล์มผ้าติดกระจกสุญญากาศ":{en:"vacuum glass film",t:"C"},
  "ซอง":{en:"pouch / envelope",t:"C"},"การ์ด":{en:"job card",t:"C"},
  "ลาเบล":{en:"label",t:"C"},"ลิปบอน":{en:"ribbon",t:"C"},
  "กระดาษ":{en:"paper",t:"C"},"สี":{en:"ink / paint",t:"C"},
  "เลนส์":{en:"lens",t:"C"},"โมลด์":{en:"mold",t:"C"},
  "หัวฉีด":{en:"nozzle",t:"C"},"หัวสเปรย์":{en:"spray nozzle",t:"C"},
  "ฝักบัว":{en:"shower head",t:"C"},"หัวสี":{en:"ink head",t:"C"},
  "หัวขัด":{en:"polishing head",t:"C"},"หัวทองเหลือง":{en:"brass fitting",t:"C"},
  "โรลเลอร์":{en:"roller",t:"C"},"ถังกวน":{en:"agitator tank",t:"C"},
  "สติวเลอร์":{en:"stirrer",t:"C"},"สติลเลอร์":{en:"stirrer",t:"C"},
  "ฝา":{en:"lid",t:"C"},"กระจก":{en:"glass",t:"C"},
  "ฟิวเตอร์":{en:"filter",t:"C"},"คอม":{en:"PC",t:"C"},
  "ชุดคอม":{en:"PC set",t:"C"},"คีย์บอร์ด":{en:"keyboard",t:"C"},
  "ลำโพง":{en:"speaker",t:"C"},"โทรศัพท์":{en:"telephone",t:"C"},
  "โปรเจคเตอร์":{en:"projector",t:"C"},"รีโมท":{en:"remote",t:"C"},
  "ปริ้นเตอร์":{en:"printer",t:"C"},"ปริ้น":{en:"print",t:"C"},"ปลิ้น":{en:"print",t:"C"},"ปลิ้นเตอร์":{en:"printer",t:"C"},
  "ปริ้นเฮด":{en:"print head",t:"C"},"ปลิ้นเฮด":{en:"print head",t:"C"},"หัวปลิ้น":{en:"print head",t:"C"},"หัวปริ้น":{en:"print head",t:"C"},
  "ฝาปิด":{en:"cover",t:"C"},"ฝาครอบ":{en:"cover",t:"C"},
  "เครื่อง":{en:"machine",t:"C"},"เครื่องผสม":{en:"mixer",t:"C"},
  "เครื่องแพ็ค":{en:"packing machine",t:"C"},"เครื่องล้าง":{en:"washing machine",t:"C"},
  "เครื่องพิมพ์":{en:"printing machine",t:"C"},"เครื่องอบ":{en:"drying oven",t:"C"},

  // ── Optical Manufacturing Components ──
  "บล็อกเลนส์":{en:"lens block",t:"C"},"แม่พิมพ์เลนส์":{en:"lens mold",t:"C"},
  "แท่นขัด":{en:"polishing plate",t:"C"},"จานขัด":{en:"polishing plate",t:"C"},
  "จานเจียร":{en:"grinding plate",t:"C"},"หัวจับเลนส์":{en:"lens holder",t:"C"},
  "หัวบล็อก":{en:"blocking chuck",t:"C"},"แท่นหมุน":{en:"rotary table",t:"C"},
  "สปินเดิล":{en:"spindle",t:"C"},"จิ๊ก":{en:"jig",t:"C"},
  "ฟิกซ์เจอร์":{en:"fixture",t:"C"},"แท่นวาง":{en:"work platform",t:"C"},
  "ถาดเลนส์":{en:"lens tray",t:"C"},"ตะแกรงเลนส์":{en:"lens basket",t:"C"},
  "หัวดูด":{en:"vacuum head",t:"C"},"ปั๊มสุญญากาศ":{en:"vacuum pump",t:"C"},
  "ท่อสุญญากาศ":{en:"vacuum pipe",t:"C"},"ผ้าขัด":{en:"polishing pad",t:"C"},
  "เพลาขัด":{en:"polishing spindle",t:"C"},"หัวจับ":{en:"chuck",t:"C"},
  "แท่นจับ":{en:"clamping stage",t:"C"},"ตัวตั้งศูนย์":{en:"alignment unit",t:"C"},
  "ชุดสุญญากาศ":{en:"vacuum system",t:"C"},"หัววัด":{en:"probe",t:"C"},
  "เครื่องวัดผิว":{en:"surface profiler",t:"C"},"เครื่องวัดศูนย์":{en:"centering machine",t:"C"},
  "เครื่องเจียรเลนส์":{en:"lens grinding machine",t:"C"},"เครื่องขัดเลนส์":{en:"lens polishing machine",t:"C"},
  "เครื่องเคลือบเลนส์":{en:"coating machine",t:"C"},"เครื่องล้างเลนส์":{en:"lens washing machine",t:"C"},
  "เครื่องบล็อกเลนส์":{en:"blocking machine",t:"C"},"เครื่องดีบล็อก":{en:"deblocking machine",t:"C"},
  "เครื่องตรวจเลนส์":{en:"lens inspection machine",t:"C"},"เครื่องวัดกำลังเลนส์":{en:"lens power meter",t:"C"},
  "เครื่องวัดความโค้ง":{en:"curvature meter",t:"C"},"เครื่องวัดความหนา":{en:"thickness gauge",t:"C"},
  "ผงขัด":{en:"polishing powder",t:"C"},"น้ำยาขัด":{en:"polishing slurry",t:"C"},
  "สารเคลือบ":{en:"coating chemical",t:"C"},"สารเคลือบแข็ง":{en:"hard coating",t:"C"},
  "สารเคลือบกันสะท้อน":{en:"AR coating",t:"C"},"น้ำยาอัลตร้าโซนิค":{en:"ultrasonic chemical",t:"C"},
  "กาวบล็อก":{en:"blocking glue",t:"C"},"เทปกันรอย":{en:"protective tape",t:"C"},

  // ── Mechanical Wear Parts ──
  "ลูกปืน":{en:"bearing",t:"C"},"ตลับลูกปืน":{en:"bearing",t:"C"},
  "แบริ่ง":{en:"bearing",t:"C"},"บูช":{en:"bushing",t:"C"},
  "ซีลน้ำมัน":{en:"oil seal",t:"C"},"ซีลยาง":{en:"rubber seal",t:"C"},
  "โอริงยาง":{en:"rubber o-ring",t:"C"},"พูลเลย์":{en:"pulley",t:"C"},
  "มู่เล่ย์":{en:"pulley",t:"C"},"โซ่สเตอร์":{en:"sprocket",t:"C"},
  "คัปปลิ้ง":{en:"coupling",t:"C"},"เพลา":{en:"shaft",t:"C"},
  "เฟืองทด":{en:"reduction gear",t:"C"},"เกียร์บ็อก":{en:"gearbox",t:"C"},
  "เกียร์บ็อกซ์":{en:"gearbox",t:"C"},"ลูกกลิ้ง":{en:"roller",t:"C"},
  "ลูกล้อ":{en:"idler roller",t:"C"},"ยอย":{en:"universal joint",t:"C"},
  "สลักเพลา":{en:"shaft pin",t:"C"},"สายพานไทม์มิ่ง":{en:"timing belt",t:"C"},
  "ผ้าเบรก":{en:"brake pad",t:"C"},

  // ── Automation / Electrical Components ──
  "PLC":{en:"PLC",t:"C"},"อินเวอร์เตอร์":{en:"inverter",t:"C"},
  "VFD":{en:"VFD",t:"C"},"เซอร์โวมอเตอร์":{en:"servo motor",t:"C"},
  "เซอร์โวไดรฟ์":{en:"servo drive",t:"C"},"รีเลย์":{en:"relay",t:"C"},
  "แมกเนติก":{en:"magnetic contactor",t:"C"},"คอนแทคเตอร์":{en:"contactor",t:"C"},
  "คอนแทค":{en:"contactor",t:"C"},"เบรกเกอร์":{en:"breaker",t:"C"},
  "ฟิวส์":{en:"fuse",t:"C"},"เทอร์มินอล":{en:"terminal block",t:"C"},
  "เพาเวอร์ซัพพลาย":{en:"power supply",t:"C"},"เอ็นโค้ดเดอร์":{en:"encoder",t:"C"},
  "ลิมิตสวิทช์":{en:"limit switch",t:"C"},"โพร๊ก":{en:"proximity sensor",t:"C"},
  "โฟโต้":{en:"photo sensor",t:"C"},"โฟโต้เซ็นเซอร์":{en:"photo sensor",t:"C"},
  "โมดูล":{en:"module",t:"C"},
  "ไอโอการ์ด":{en:"I/O card",t:"C"},"อินพุตการ์ด":{en:"input card",t:"C"},
  "เอาต์พุตการ์ด":{en:"output card",t:"C"},"คอมมิวนิเคชั่นการ์ด":{en:"comm card",t:"C"},
  "ซอฟต์สตาร์ท":{en:"soft starter",t:"C"},"สตาร์ทเตอร์":{en:"motor starter",t:"C"},
  "ไดรฟ์":{en:"drive",t:"C"},"ไทเมอร์":{en:"timer",t:"C"},
  "เคาน์เตอร์รีเลย์":{en:"counter",t:"C"},"โอเวอร์โหลดรีเลย์":{en:"overload relay",t:"C"},
  "เทอร์มอลโอเวอร์โหลด":{en:"thermal overload",t:"C"},"เทอร์โมคัปเปิล":{en:"thermocouple",t:"C"},
  "PT100":{en:"PT100 sensor",t:"C"},"SCADA":{en:"SCADA",t:"C"},
  "สกาดา":{en:"SCADA",t:"C"},"HMI":{en:"HMI",t:"C"},
  "UPS":{en:"UPS",t:"C"},"ยูพีเอส":{en:"UPS",t:"C"},
  "แบตเตอรี่ UPS":{en:"UPS battery",t:"C"},

  // ── Pneumatic Accessories ──
  "ถังลม":{en:"air tank",t:"C"},"ถังพักลม":{en:"air buffer tank",t:"C"},
  "เรกูเลเตอร์":{en:"regulator",t:"C"},"เรกกูเลเตอร์":{en:"regulator",t:"C"},
  "ลูบริเคเตอร์":{en:"lubricator",t:"C"},"ชุด FRL":{en:"FRL unit",t:"C"},
  "แมนิโฟลด์":{en:"manifold",t:"C"},"ไซเลนเซอร์":{en:"silencer",t:"C"},
  "ชุดกรองลม":{en:"air filter unit",t:"C"},"วาล์วกัน":{en:"check valve",t:"C"},
  "วาล์วควบคุมความเร็ว":{en:"speed controller",t:"C"},"วาล์ว 5/2":{en:"5/2 valve",t:"C"},
  "วาล์ว 3/2":{en:"3/2 valve",t:"C"},"โซลินอยด์":{en:"solenoid valve",t:"C"},

  // ── Linear Motion ──
  "บอลสกรู":{en:"ball screw",t:"C"},"ลิเนียร์ไกด์":{en:"linear guide",t:"C"},
  "รางสไลด์":{en:"slide rail",t:"C"},"แกนสไลด์":{en:"slide shaft",t:"C"},
  "สกรูลีด":{en:"lead screw",t:"C"},"แกนลีด":{en:"lead shaft",t:"C"},
  "สกรูบอล":{en:"ball screw",t:"C"},"แท่นเลื่อน":{en:"linear stage",t:"C"},

  // ── Air Movement ──
  "พัดลม":{en:"fan",t:"C"},"พัดลมระบาย":{en:"exhaust fan",t:"C"},
  "โบลว์เวอร์":{en:"blower",t:"C"},"โบลว์เออร์":{en:"blower",t:"C"},
  "พัดลมดูดควัน":{en:"fume extractor",t:"C"},"มอเตอร์พัดลม":{en:"fan motor",t:"C"},
  "ใบพัด":{en:"impeller / blade",t:"C"},"แอร์ไนฟ์":{en:"air knife",t:"C"},

  // ── Safety & Signal ──
  "อีสต็อป":{en:"e-stop",t:"C"},"ปุ่มฉุกเฉิน":{en:"emergency stop",t:"C"},
  "ม่านแสง":{en:"light curtain",t:"C"},"ไลท์เคอร์เทน":{en:"light curtain",t:"C"},
  "แลมป์สัญญาณ":{en:"tower light",t:"C"},"สัญญาณไฟ":{en:"indicator light",t:"C"},
  "ไฟแสดงสถานะ":{en:"status light",t:"C"},"บัซเซอร์":{en:"buzzer",t:"C"},
  "สัญญาณเตือน":{en:"alarm",t:"C"},"เซฟตี้รีเลย์":{en:"safety relay",t:"C"},
  "ประตูนิรภัย":{en:"safety door switch",t:"C"},"แมทสวิทช์":{en:"safety mat switch",t:"C"},

  // ── Actions (A) ──
  "เปลี่ยน":{en:"replace",t:"A"},"เปลื่ยน":{en:"replace",t:"A"},
  "เปลียน":{en:"replace",t:"A"},"เปรี่ยน":{en:"replace",t:"A"},
  "ซ่อม":{en:"repair",t:"A"},"ช่อม":{en:"repair",t:"A"},
  "แก้ไข":{en:"fix / resolve",t:"A"},"ปรับ":{en:"adjust",t:"A"},
  "ตั้งศูนย์":{en:"align",t:"A"},"คาริเบท":{en:"calibrate",t:"A"},
  "ติดตั้ง":{en:"install",t:"A"},"ทำ":{en:"make / fabricate",t:"A"},
  "ประกอบ":{en:"assemble",t:"A"},"เชื่อม":{en:"weld",t:"A"},
  "ถอด":{en:"dismantle",t:"A"},"เอาออก":{en:"remove",t:"A"},
  "แกะ":{en:"disassemble",t:"A"},"ย้าย":{en:"relocate",t:"A"},
  "ย้าน":{en:"relocate",t:"A"},"จัดเก็บ":{en:"organize",t:"A"},
  "ล้าง":{en:"clean",t:"A"},"ล้างท่อ":{en:"flush pipe",t:"A"},
  "ล้างเครื่อง":{en:"wash machine",t:"A"},"ทำความสะอาด":{en:"clean",t:"A"},
  "เคลียฝุ่น":{en:"clear dust",t:"A"},"ปัด":{en:"wipe",t:"A"},
  "อุดรู":{en:"plug hole",t:"A"},"เจาะรู":{en:"drill hole",t:"A"},
  "ลากสาย":{en:"route cable",t:"A"},"ทาสี":{en:"paint",t:"A"},
  "ตอก":{en:"punch mark",t:"A"},"แยก":{en:"sort",t:"A"},
  "แปลง":{en:"retrofit",t:"A"},"ยิงจ๊อบ":{en:"scan job",t:"A"},
  "ตรวจสอบ":{en:"inspect",t:"A"},"ตรวจเช็ค":{en:"inspect",t:"A"},
  "เช็ค":{en:"check",t:"A"},"วัดค่า":{en:"measure",t:"A"},
  "ละลายน้ำแข็ง":{en:"defrost",t:"A"},"ดึง":{en:"pull",t:"A"},
  "เติม":{en:"top-up",t:"A"},"เพิ่ม":{en:"add",t:"A"},
  "เบิก":{en:"requisition",t:"A"},"เบิกของ":{en:"withdraw material",t:"A"},
  "สั่ง":{en:"order",t:"A"},"สลับ":{en:"swap",t:"A"},
  "ต่อตรง":{en:"bypass",t:"A"},"บายพาส":{en:"bypass",t:"A"},
  "หุ้มฉนวน":{en:"apply insulation",t:"A"},"ขัด":{en:"polish",t:"A"},
  "เจียร":{en:"grind",t:"A"},"บล็อก":{en:"block",t:"A"},
  "ดีบล็อก":{en:"deblock",t:"A"},"เคลือบ":{en:"coat",t:"A"},
  "ตั้งแรงดูด":{en:"adjust vacuum",t:"A"},"ตั้งแรงกด":{en:"adjust pressure",t:"A"},
  "ตั้งความเร็ว":{en:"adjust speed",t:"A"},"เปลี่ยนผงขัด":{en:"replace polishing powder",t:"A"},
  "เติมน้ำยาขัด":{en:"add polishing slurry",t:"A"},"รีเซ็ต":{en:"reset",t:"A"},
  "รีสตาร์ท":{en:"restart",t:"A"},"รีบูต":{en:"reboot",t:"A"},
  "ขัน":{en:"tighten",t:"A"},"คลาย":{en:"loosen",t:"A"},
  "อัดจารบี":{en:"grease",t:"A"},"หล่อลื่น":{en:"lubricate",t:"A"},
  "ตั้งค่า":{en:"configure",t:"A"},"โปรแกรม":{en:"program",t:"A"},
  "ตั้งโปรแกรม":{en:"program",t:"A"},"โหลดโปรแกรม":{en:"upload program",t:"A"},
  "ดาวน์โหลดโปรแกรม":{en:"download program",t:"A"},"ทดสอบ":{en:"test",t:"A"},
  "รีเซ็ตเออเร่อ":{en:"reset fault",t:"A"},"เดินเครื่อง":{en:"run machine",t:"A"},
  "ทดลอง":{en:"trial run",t:"A"},
  "บัดกรี":{en:"solder",t:"A"},"ต่อสาย":{en:"reconnect wire",t:"A"},
  "ต่อสายไฟ":{en:"rewire",t:"A"},"ตัดสายไฟ":{en:"cut wire",t:"A"},
  "เปลี่ยนแบตเตอรี่":{en:"replace battery",t:"A"},"ชาร์จแบตเตอรี่":{en:"charge battery",t:"A"},
  "เปลี่ยนน้ำมัน":{en:"change oil",t:"A"},"ถ่ายน้ำมัน":{en:"drain oil",t:"A"},
  "เติมน้ำมันเกียร์":{en:"add gear oil",t:"A"},"ทาจาระบี":{en:"grease",t:"A"},
  "อัดจาระบี":{en:"grease",t:"A"},"เปลี่ยนไส้กรองลม":{en:"replace air filter",t:"A"},
  "วัดความต้านทาน":{en:"measure resistance",t:"A"},"วัดกระแส":{en:"measure current",t:"A"},
  "วัดแรงดันไฟ":{en:"measure voltage",t:"A"},"เมกเกอร์":{en:"megger test",t:"A"},
  "สำรองข้อมูล":{en:"backup data",t:"A"},"แบ็คอัพ":{en:"backup",t:"A"},
  "อัปเดตเฟิร์มแวร์":{en:"update firmware",t:"A"},"อัปเดตโปรแกรม":{en:"update program",t:"A"},
  "รีโปรแกรม":{en:"reprogram",t:"A"},"ตั้งค่าใหม่":{en:"reconfigure",t:"A"},
  "เปลี่ยนซีล":{en:"replace seal",t:"A"},"เปลี่ยนโอริง":{en:"replace o-ring",t:"A"},
  "เปลี่ยนไส้กรอง":{en:"replace filter",t:"A"},"เป่าทำความสะอาด":{en:"blow clean",t:"A"},
  "ตรวจรับ":{en:"incoming inspect",t:"A"},"บันทึก":{en:"record",t:"A"},
  "ล็อก":{en:"lock out",t:"A"},"ปลดล็อก":{en:"unlock",t:"A"},
  "สอบเทียบ":{en:"calibrate",t:"A"},"ตรวจโปรแกรม":{en:"check program",t:"A"},

  // ── Locations (L) ──
  "ห้องคลีนรูม":{en:"cleanroom",t:"L"},"ห้องผสม":{en:"mixing room",t:"L"},
  "ห้องโมโนเมอร์":{en:"monomer room",t:"L"},"ห้องแยกงาน":{en:"sorting area",t:"L"},
  "ห้องน้ำ":{en:"restroom",t:"L"},"ห้องเก็บก๊าช":{en:"gas storage",t:"L"},
  "ห้องเก็บก๊าซ":{en:"gas storage",t:"L"},"ห้องประชุม":{en:"meeting room",t:"L"},
  "โรงอาหาร":{en:"canteen",t:"L"},"เพดาน":{en:"ceiling",t:"L"},
  "ฝ้าเพดาน":{en:"ceiling",t:"L"},"ฝ้า":{en:"ceiling",t:"L"},
  "หลังคา":{en:"roof",t:"L"},"หน้าต่าง":{en:"window",t:"L"},
  "พื้น":{en:"floor",t:"L"},"ทางเดิน":{en:"walkway",t:"L"},
  "ด้านเว้า":{en:"concave side",t:"L"},"ด้านนูน":{en:"convex side",t:"L"},
  "ข้าง":{en:"side",t:"L"},"ข้างหลัง":{en:"rear",t:"L"},
  "ใต้เครื่อง":{en:"under machine",t:"L"},"หน้าเครื่อง":{en:"machine front",t:"L"},
  "หลังเครื่อง":{en:"machine rear",t:"L"},"ซ้าย":{en:"left",t:"L"},
  "ขวา":{en:"right",t:"L"},"สเต๊ปแรก":{en:"first step",t:"L"},
  "สเต๊ปสุดท้าย":{en:"last step",t:"L"},
  "สถานี":{en:"station",t:"L"},"จุดรับงาน":{en:"loading station",t:"L"},
  "จุดส่งงาน":{en:"unloading station",t:"L"},"หัวไลน์":{en:"line start",t:"L"},
  "ท้ายไลน์":{en:"line end",t:"L"},"ห้องผลิต":{en:"production area",t:"L"},
  "ห้องซ่อม":{en:"maintenance shop",t:"L"},"ห้องควบคุม":{en:"control room",t:"L"},
  "ห้องเย็น":{en:"cold room",t:"L"},"ห้องแลป":{en:"lab",t:"L"},
  "โซน A":{en:"zone A",t:"L"},"โซน B":{en:"zone B",t:"L"},
  "โซน C":{en:"zone C",t:"L"},"แนวการผลิต":{en:"production line",t:"L"},
  "ด้านขาเข้า":{en:"infeed side",t:"L"},"ด้านขาออก":{en:"outfeed side",t:"L"},
  "ท่อเมน":{en:"main line",t:"L"},"ตู้ไฟหลัก":{en:"main electrical panel",t:"L"},

  // ── Modifiers (M) ──
  "อุณหภูมิ":{en:"temperature",t:"M"},"ความชื้น":{en:"humidity",t:"M"},
  "แรงดัน":{en:"pressure",t:"M"},"ศูนย์":{en:"center",t:"M"},
  "ระยะ":{en:"clearance",t:"M"},"ระดับน้ำ":{en:"water level",t:"M"},
  "ค่าน้ำ":{en:"moisture content",t:"M"},"มาก":{en:"severely",t:"M"},
  "หนัก":{en:"severe",t:"M"},"เล็กน้อย":{en:"slightly",t:"M"},
  "นิดหน่อย":{en:"minor",t:"M"},"ปานกลาง":{en:"moderate",t:"M"},
  "ด่วน":{en:"urgent",t:"M"},"เร่งด่วน":{en:"urgent",t:"M"},
  "บ่อย":{en:"frequently",t:"M"},"ตลอด":{en:"continuously",t:"M"},
  "บางครั้ง":{en:"occasionally",t:"M"},"เป็นพักๆ":{en:"intermittently",t:"M"},
  "ทันที":{en:"immediately",t:"M"},
  "เป็นประจำ":{en:"regularly",t:"M"},"ชั่วคราว":{en:"temporarily",t:"M"},
  "ถาวร":{en:"permanently",t:"M"},"นาน":{en:"prolonged",t:"M"},
  "เร็ว":{en:"quickly",t:"M"},"ช้า":{en:"slowly",t:"M"},

  // =======================================================================
  // 🏭 UTILITIES & FACILITY SYSTEMS
  // =======================================================================
  
  // 💨 1. Compressed Air System
  "สกรู":{en:"air end",t:"C",sys:"Air Compressor"},"หัวสกรู":{en:"air end",t:"C",sys:"Air Compressor"},
  "ออโต้เดรน":{en:"auto drain valve",t:"C",sys:"Air Compressor"},"ตัวเดรนน้ำ":{en:"auto drain valve",t:"C",sys:"Air Compressor"},
  "เซปปะเรเตอร์":{en:"separator",t:"C",sys:"Air Compressor"},"กรองน้ำมัน":{en:"oil filter",t:"C",sys:"Air Compressor"},
  "วาล์วไอดี":{en:"inlet valve",t:"C",sys:"Air Compressor"},"อันโหลดเดอร์":{en:"unloader valve",t:"C",sys:"Air Compressor"},
  "ลมไม่ตัด":{en:"continuous loading",t:"S",sys:"Air Compressor"},"โหลดตลอด":{en:"continuous loading",t:"S",sys:"Air Compressor"},
  "อุณหภูมิปลายทางสูง":{en:"high discharge temp",t:"S",sys:"Air Compressor"},"ร้อนจัด":{en:"overheating",t:"S",sys:"Air Compressor"},
  "น้ำมันหาย":{en:"oil loss",t:"S",sys:"Air Compressor"},"น้ำมันปนไปกับลม":{en:"oil carryover",t:"S",sys:"Air Compressor"},
  "ลมมีน้ำ":{en:"water in air line",t:"S",sys:"Air Compressor"},"น้ำเกาะท่อ":{en:"moisture in pipe",t:"S",sys:"Air Compressor"},
  "ลมตก":{en:"pressure drop",t:"S",sys:"Air Compressor"},"เพรสเชอร์ตก":{en:"pressure drop",t:"S",sys:"Air Compressor"},
  "ถ่ายน้ำมันเครื่อง":{en:"change oil",t:"A",sys:"Air Compressor"},"เปลี่ยนกรองดักน้ำ":{en:"replace water separator",t:"A",sys:"Air Compressor"},

  // ❄️ 2. Chilled Water & HVAC System
  "อีแวป":{en:"evaporator",t:"C",sys:"Chiller"},"คูลเลอร์":{en:"cooler",t:"C",sys:"Chiller"},
  "คอนเดนเซอร์":{en:"condenser",t:"C",sys:"Chiller"},"รังผึ้งร้อน":{en:"condenser coil",t:"C",sys:"Chiller"},
  "เอ็กซ์แพนชั่น":{en:"expansion valve",t:"C",sys:"Chiller"},"วาล์วฉีดน้ำยา":{en:"expansion valve",t:"C",sys:"Chiller"},
  "คูลลิ่งทาวเวอร์":{en:"cooling tower",t:"C",sys:"Chiller"},"หอหล่อเย็น":{en:"cooling tower",t:"C",sys:"Chiller"},
  "ไฮเพรสเชอร์":{en:"high pressure alarm",t:"S",sys:"Chiller"},"แรงดันไฮสูง":{en:"high pressure alarm",t:"S",sys:"Chiller"},
  "โลว์เพรสเชอร์":{en:"low pressure alarm",t:"S",sys:"Chiller"},"แรงดันโลว์ต่ำ":{en:"low pressure alarm",t:"S",sys:"Chiller"},
  "ตะกรันเกาะ":{en:"scaling",t:"S",sys:"Chiller"},"ตะกรันหนา":{en:"heavy scale",t:"S",sys:"Chiller"},
  "น้ำยาขาด":{en:"low refrigerant",t:"S",sys:"Chiller"},"น้ำยารั่ว":{en:"refrigerant leak",t:"S",sys:"Chiller"},
  "แอร์ไม่ฉ่ำ":{en:"not cooling enough",t:"S",sys:"Chiller"},"ล้างทิ้ว":{en:"tube cleaning",t:"A",sys:"Chiller"},
  "แยงทิ้ว":{en:"tube punching",t:"A",sys:"Chiller"},"เติมน้ำยาแอร์":{en:"top-up refrigerant",t:"A",sys:"Chiller"},

  // 🕳️ 3. Vacuum System
  "เวรน":{en:"vane",t:"C",sys:"Vacuum Pump"},"ใบพัดคาร์บอน":{en:"carbon vane",t:"C",sys:"Vacuum Pump"},
  "กรองไอเสีย":{en:"exhaust filter",t:"C",sys:"Vacuum Pump"},"กรองฝุ่น":{en:"inlet filter",t:"C",sys:"Vacuum Pump"},
  "ออยซิล":{en:"oil seal",t:"C",sys:"Vacuum Pump"},"ซีลคอเพลา":{en:"shaft seal",t:"C",sys:"Vacuum Pump"},
  "แวคไม่ลง":{en:"cannot reach vacuum",t:"S",sys:"Vacuum Pump"},"ดูดไม่ขึ้น":{en:"no suction",t:"S",sys:"Vacuum Pump"},
  "ควันขาว":{en:"white smoke",t:"S",sys:"Vacuum Pump"},"น้ำมันพ่น":{en:"oil mist exhaust",t:"S",sys:"Vacuum Pump"},
  "โอเวอร์ฮีต":{en:"overheating",t:"S",sys:"Vacuum Pump"},"เปลี่ยนแผ่นเวรน":{en:"replace vanes",t:"A",sys:"Vacuum Pump"},
  "ล้างไส้กรอง":{en:"clean filter",t:"A",sys:"Vacuum Pump"},

  // ♨️ 4. Steam & Boiler System
  "สตีมแทรป":{en:"steam trap",t:"C",sys:"Boiler"},"กับดักไอน้ำ":{en:"steam trap",t:"C",sys:"Boiler"},
  "เบิร์นเนอร์":{en:"burner",t:"C",sys:"Boiler"},"หัวเผา":{en:"burner",t:"C",sys:"Boiler"},
  "เซฟตี้วาล์ว":{en:"safety valve",t:"C",sys:"Boiler"},"วาล์วระบาย":{en:"relief valve",t:"C",sys:"Boiler"},
  "ฮีตเอ็กเชนเจอร์":{en:"heat exchanger",t:"C",sys:"Boiler"},"ตัวแลกเปลี่ยน":{en:"heat exchanger",t:"C",sys:"Boiler"},
  "จุดไม่ติด":{en:"ignition failure",t:"S",sys:"Boiler"},"หัวเผาเฟล":{en:"burner failure",t:"S",sys:"Boiler"},
  "สตีมไม่พอ":{en:"insufficient steam",t:"S",sys:"Boiler"},"สตีมรั่ว":{en:"steam leak",t:"S",sys:"Boiler"},
  "ไอน้ำออก":{en:"steam leak",t:"S",sys:"Boiler"},"น้ำแห้ง":{en:"boiler dry",t:"S",sys:"Boiler"},
  "ระดับน้ำโลว์":{en:"low water level",t:"S",sys:"Boiler"},"โบลว์ดาวน์":{en:"blowdown",t:"A",sys:"Boiler"},
  "เดรนน้ำทิ้ง":{en:"drain water",t:"A",sys:"Boiler"},

  // 💧 5. Water Treatment System
  "เมมเบรน":{en:"RO membrane",t:"C",sys:"Water Treatment"},"ไส้กรอง RO":{en:"RO filter",t:"C",sys:"Water Treatment"},
  "ปั๊มโดส":{en:"dosing pump",t:"C",sys:"Water Treatment"},"ปั๊มเติมเคมี":{en:"chemical pump",t:"C",sys:"Water Treatment"},
  "เรซิ่น":{en:"resin",t:"C",sys:"Water Treatment"},"สารกรอง":{en:"filter media",t:"C",sys:"Water Treatment"},
  "ค่าน้ำเกิน":{en:"high conductivity",t:"S",sys:"Water Treatment"},"คอนดักเกิน":{en:"high conductivity",t:"S",sys:"Water Treatment"},
  "เพรสเชอร์ดิฟ":{en:"high diff pressure",t:"S",sys:"Water Treatment"},"ดิฟสูง":{en:"high diff pressure",t:"S",sys:"Water Treatment"},
  "แบ็ควอช":{en:"backwash",t:"A",sys:"Water Treatment"},"ล้างย้อน":{en:"backwash",t:"A",sys:"Water Treatment"},
  "เติมเกลือ":{en:"add salt",t:"A",sys:"Water Treatment"},"ฟื้นฟูเรซิ่น":{en:"regenerate resin",t:"A",sys:"Water Treatment"},

  // ⚡ 6. Electrical & Power System
  "คาปา":{en:"capacitor bank",t:"C",sys:"Power System"},"แคปแบงค์":{en:"capacitor bank",t:"C",sys:"Power System"},
  "เบรกเกอร์เมน":{en:"main breaker",t:"C",sys:"Power System"},"เอ็มซีบี":{en:"main breaker",t:"C",sys:"Power System"},
  "ทริป":{en:"tripped",t:"S",sys:"Power System"},"เด้ง":{en:"tripped",t:"S",sys:"Power System"},
  "พีเอฟตก":{en:"low power factor",t:"S",sys:"Power System"},"ค่าไฟเกิน":{en:"high power consumption",t:"S",sys:"Power System"},
  "ขั้วหลวม":{en:"loose connection",t:"S",sys:"Power System"},"รอยไหม้":{en:"burn mark",t:"S",sys:"Power System"},
  "ขันเทอร์มินอล":{en:"tighten terminal",t:"A",sys:"Power System"},"ย้ำหางปลา":{en:"re-crimp terminal",t:"A",sys:"Power System"},
  "ส่องกล้องความร้อน":{en:"thermoscan",t:"A",sys:"Power System"},

  // =======================================================================
  // 🤖 END OF LINE & AUTOMATION SYSTEMS
  // =======================================================================

  // 📦 7. Auto Packing System
  "ตัวดูดซอง":{en:"envelope picker",t:"C",sys:"Auto Packing"},"แมกกาซีนซอง":{en:"envelope magazine",t:"C",sys:"Auto Packing"},
  "ตัวเปิดซอง":{en:"envelope opener",t:"C",sys:"Auto Packing"},"ตัวดันเลนส์":{en:"lens pusher",t:"C",sys:"Auto Packing"},
  "ฮีตเตอร์ซีล":{en:"sealing heater",t:"C",sys:"Auto Packing"},"ตัวซีลปากซอง":{en:"sealer jaw",t:"C",sys:"Auto Packing"},
  "ตัวพิมพ์วันที่":{en:"date coder",t:"C",sys:"Auto Packing"},"ซองติด":{en:"envelope jammed",t:"S",sys:"Auto Packing"},
  "ดูดซองไม่ขึ้น":{en:"failed to pick envelope",t:"S",sys:"Auto Packing"},"ดูดซองซ้อน":{en:"double pick",t:"S",sys:"Auto Packing"},
  "เปิดซองไม่ออก":{en:"failed to open envelope",t:"S",sys:"Auto Packing"},"ใส่เลนส์ไม่เข้า":{en:"failed to insert lens",t:"S",sys:"Auto Packing"},
  "ซีลไม่สนิท":{en:"incomplete seal",t:"S",sys:"Auto Packing"},"ซีลรั่ว":{en:"leaking seal",t:"S",sys:"Auto Packing"},
  "ซีลไหม้":{en:"burnt seal",t:"S",sys:"Auto Packing"},"ซองยับ":{en:"wrinkled envelope",t:"S",sys:"Auto Packing"},
  "เติมซอง":{en:"add envelopes",t:"A",sys:"Auto Packing"},"ตั้งความร้อนซีล":{en:"adjust seal temp",t:"A",sys:"Auto Packing"},

  // 🛣️ 8. Conveyor System
  "สต็อปเปอร์":{en:"stopper",t:"C",sys:"Conveyor System"},"ตัวปัดงาน":{en:"rejector",t:"C",sys:"Conveyor System"},
  "ตัวคัดแยก":{en:"diverter",t:"C",sys:"Conveyor System"},"ไกด์ประคอง":{en:"guide rail",t:"C",sys:"Conveyor System"},
  "สายพานลื่น":{en:"belt slipping",t:"S",sys:"Conveyor System"},"สายพานส่าย":{en:"belt wandering",t:"S",sys:"Conveyor System"},
  "สายพานปีนขอบ":{en:"belt off track",t:"S",sys:"Conveyor System"},"สายพานขาด":{en:"broken belt",t:"S",sys:"Conveyor System"},
  "ชิ้นงานชนกัน":{en:"parts colliding",t:"S",sys:"Conveyor System"},"สต็อปเปอร์ค้าง":{en:"stopper jammed",t:"S",sys:"Conveyor System"},
  "ตั้งความตึงสายพาน":{en:"tension belt",t:"A",sys:"Conveyor System"},"ตั้งศูนย์สายพาน":{en:"align belt",t:"A",sys:"Conveyor System"},

  // ⚡ 9. Laser Marking Machine
  "หัวเลเซอร์":{en:"laser head",t:"C",sys:"Laser Marking"},"เลนส์โฟกัส":{en:"focus lens",t:"C",sys:"Laser Marking"},
  "ซอร์สเลเซอร์":{en:"laser source",t:"C",sys:"Laser Marking"},"เครื่องดูดควัน":{en:"fume extractor",t:"C",sys:"Laser Marking"},
  "เลเซอร์ไม่ยิง":{en:"laser not firing",t:"S",sys:"Laser Marking"},"มาร์คไม่ชัด":{en:"faint mark",t:"S",sys:"Laser Marking"},
  "ยิงไม่เข้า":{en:"shallow mark",t:"S",sys:"Laser Marking"},"ตัวอักษรเบี้ยว":{en:"distorted letters",t:"S",sys:"Laser Marking"},
  "ตัวอักษรขาด":{en:"incomplete mark",t:"S",sys:"Laser Marking"},"รอยยิงไหม้":{en:"burnt mark",t:"S",sys:"Laser Marking"},
  "ยิงตกขอบ":{en:"mark out of bound",t:"S",sys:"Laser Marking"},"โฟกัสเพี้ยน":{en:"out of focus",t:"S",sys:"Laser Marking"},
  "ควันเยอะ":{en:"excessive fume",t:"S",sys:"Laser Marking"},"ปรับโฟกัสเลเซอร์":{en:"adjust laser focus",t:"A",sys:"Laser Marking"},
  "ทำความสะอาดเลนส์โฟกัส":{en:"clean focus lens",t:"A",sys:"Laser Marking"},

  // 👁️ 10. Vision Inspection System (AOI)
  "กล้องวิชั่น":{en:"vision camera",t:"C",sys:"Vision Inspection"},"เลนส์กล้อง":{en:"camera lens",t:"C",sys:"Vision Inspection"},
  "ไฟริงไลท์":{en:"ring light",t:"C",sys:"Vision Inspection"},"ชุดส่องสว่าง":{en:"lighting unit",t:"C",sys:"Vision Inspection"},
  "ฉากหลัง":{en:"backlight",t:"C",sys:"Vision Inspection"},"ตัวประมวลผลภาพ":{en:"vision controller",t:"C",sys:"Vision Inspection"},
  "จับภาพไม่ได้":{en:"cannot capture image",t:"S",sys:"Vision Inspection"},"กล้องค้าง":{en:"camera frozen",t:"S",sys:"Vision Inspection"},
  "ภาพเบลอ":{en:"blurry image",t:"S",sys:"Vision Inspection"},"แสงไม่พอ":{en:"insufficient light",t:"S",sys:"Vision Inspection"},
  "แสงจ้าไป":{en:"overexposed",t:"S",sys:"Vision Inspection"},"แสงสะท้อน":{en:"glare",t:"S",sys:"Vision Inspection"},
  "ดีดงานทิ้งผิด":{en:"false reject",t:"S",sys:"Vision Inspection"},"ปล่อยงานเสียผ่าน":{en:"false accept",t:"S",sys:"Vision Inspection"},
  "คาลิเบรทกล้อง":{en:"calibrate camera",t:"A",sys:"Vision Inspection"},"สอนภาพใหม่":{en:"retrain vision",t:"A",sys:"Vision Inspection"},
  "ปรับแสงกล้อง":{en:"adjust lighting",t:"A",sys:"Vision Inspection"},

  // ── Symptoms (S) เพิ่มเติมจากหน้างาน ──
  "ไม่ได้ระดับ":{en:"unleveled",t:"S"},"เกลียวหวาน":{en:"stripped thread",t:"S"},
  "บิด":{en:"twisted",t:"S"},"หมด":{en:"empty",t:"S"},
  "ร้องไม่หยุด":{en:"continuous alarm",t:"S"},"ขึ้นช้า":{en:"rising slowly",t:"S"},
  "ลงช้า":{en:"dropping slowly",t:"S"},"สีจาง":{en:"faded color",t:"S"},
  "ยับย่น":{en:"wrinkled",t:"S"},"ยับ":{en:"wrinkled",t:"S"},
  "ไม่ตัด":{en:"won't stop",t:"S"},"ติดผนึก":{en:"frost buildup",t:"S"},
  "ไม่รีเซ็ต":{en:"won't reset",t:"S"},"ผิดปกติ":{en:"abnormal",t:"S"},
  "อ่านข้างเดียว":{en:"scans one side only",t:"S"},"ไม่ขึ้น":{en:"won't rise",t:"S"},
  "ไม่ลง":{en:"won't drop",t:"S"},"เดินไม่หยุด":{en:"running continuously",t:"S"},
  "หยุดบ่อย":{en:"stopping frequently",t:"S"},"งานร่วง":{en:"part dropped",t:"S"},
  "เลนส์ร่วง":{en:"lens dropped",t:"S"},"งานไม่เข้า":{en:"part not feeding",t:"S"},
  "ยิงงานไม่ได้":{en:"cannot scan job",t:"S"},

  // ── Components (C) เพิ่มเติมจากหน้างาน ──
  "อ่างล้างตา":{en:"eyewash station",t:"C"},"อ่างล้างมือ":{en:"washbasin",t:"C"},
  "โถฉี่":{en:"urinal",t:"C"},"ชักโครก":{en:"toilet bowl",t:"C"},
  "ใบจ๊อบ":{en:"job ticket",t:"C"},"เครื่องเคลือบฟิล์ม":{en:"film coater",t:"C"},
  "เครื่องดูดฝุ่น":{en:"vacuum cleaner",t:"C"},"เครื่องซักผ้า":{en:"washing machine",t:"C"},
  "ตู้แช่":{en:"freezer",t:"C"},"โช๊คเก้าอี้":{en:"gas cylinder",t:"C"},
  "เก้าอี้":{en:"chair",t:"C"},"โต๊ะ":{en:"table",t:"C"},
  "ชั้นวางของ":{en:"shelf",t:"C"},"ลิ้นชัก":{en:"drawer",t:"C"},
  "บานพับ":{en:"hinge",t:"C"},"กลอนประตู":{en:"door latch",t:"C"},
  "มือจับประตู":{en:"door handle",t:"C"},"หูจับประตู":{en:"door handle",t:"C"},
  "หัววัดงาน":{en:"measuring probe",t:"C"},"เครื่องเจียร์":{en:"grinding machine",t:"C"},
  "แผ่นรอง":{en:"support plate",t:"C"},"รถแยกงาน":{en:"sorting cart",t:"C"},
  "รถเข็น":{en:"cart",t:"C"},"อ่างล้างเลนส์":{en:"lens washing tank",t:"C"},
  "หัว wiping":{en:"wiping head",t:"C"},"หัว polishing":{en:"polishing head",t:"C"},
  "เครื่อง padprinting":{en:"pad printer",t:"C"},"เครื่องเคลือบ":{en:"coating machine",t:"C"},
  "เครื่อง casting":{en:"casting machine",t:"C"},

  // ── Facility Issues (S) ──
  "น้ำท่วม":{en:"flooded",t:"S"},"ฝ้าร่วง":{en:"collapsed ceiling",t:"S"},
  "หลังคารั่ว":{en:"roof leak",t:"S"},"ท่อแตก":{en:"pipe burst",t:"S"}
})

// ── Phrase priority table (checked before tokenize) ──
export const _phrases = Object.freeze({
  // ==========================================
  // ⚙️ Mechanical & Drives (เครื่องกล กลไก และขับเคลื่อน)
  // ==========================================
  'สายพานหลุด': 'The conveyor belt has come off.',
  'สายพานขาด': 'The conveyor belt is broken.',
  'สายพานหย่อน': 'The conveyor belt tension is loose.',
  'สายพานลื่น': 'The conveyor belt is slipping.',
  'สายพานปีนขอบ': 'The conveyor belt is off track.',
  'สายพานไทม์มิ่งขาด': 'The timing belt is broken.',
  'ลูกปืนแตก': 'The bearing has failed.',
  'ตลับลูกปืนแตก': 'The bearing housing is broken.',
  'ลูกปืนมีเสียงดัง': 'The bearing is making an abnormal noise.',
  'แบริ่งร้อนจัด': 'The bearing is overheating severely.',
  'บูชหลวม': 'The bushing is loose.',
  'มอเตอร์ไม่หมุน': 'The motor is not rotating.',
  'มอเตอร์ร้อนจัด': 'The motor is overheating.',
  'มอเตอร์สะดุด': 'The motor is stalling.',
  'มอเตอร์มีเสียงดัง': 'The motor is making an abnormal noise.',
  'มอเตอร์กินกระแสสูง': 'The motor is drawing high current.',
  'เฟืองมอเตอร์รูด': 'The motor pinion is stripped.',
  'คัปปลิ้งหัก': 'The coupling is broken.',
  'ยอยหัก': 'The universal joint is broken.',
  'เฟืองรูด': 'The gear is stripped.',
  'เกียร์บ็อกซ์มีเสียงดัง': 'The gearbox is making an abnormal noise.',
  'เกียร์บ็อกซ์ซึม': 'The gearbox is seeping oil.',
  'เกลียวหวาน': 'The thread is stripped.',
  'เกลียวรูด': 'The thread is stripped.',
  'โซ่หลุด': 'The chain has derailed.',
  'โซ่หย่อน': 'The chain is loose.',
  'โซ่สเตอร์รูด': 'The sprocket is stripped.',
  'ลูกกลิ้งฝืด': 'The roller is stiff.',
  'ลูกล้อตาย': 'The idler roller is seized.',
  'น็อตหลวม': 'The bolt is loose.',
  'น็อตขาด': 'The bolt is snapped.',
  'แกนสไลด์ฝืด': 'The slide shaft is stiff.',
  'ลิเนียร์ไกด์ติดเศษ': 'The linear guide is jammed with debris.',
  'บอลสกรูรูด': 'The ball screw is stripped.',
  'สกรูลีดงัด': 'The lead screw is binding.',
  'ซีลน้ำมันรั่ว': 'The oil seal is leaking.',
  'โอริงขาด': 'The o-ring is torn.',
  'สปริงหัก': 'The spring is snapped.',
  'สปริงล้า': 'The spring has lost tension.',
  'เพลาโก่ง': 'The shaft is bent.',
  'สลักหลุด': 'The pin is disconnected.',
  'ใบพัดลมแตก': 'The fan blade is cracked.',
  'ใบมีดบิ่น': 'The cutting blade is chipped.',
  'ล้อรถเข็นหลุด': 'The cart caster wheel has fallen off.',

  // ==========================================
  // ⚡ Electrical, Controls & Automation (ไฟฟ้า และออโตเมชั่น)
  // ==========================================
  'ไฟไม่เข้าตู้คอนโทรล': 'There is no power to the control panel.',
  'ตู้ไฟหลักทริป': 'The main electrical panel has tripped.',
  'ไฟไม่ครบเฟส': 'Missing phase in power supply.',
  'เฟสสลับ': 'Wrong phase sequence.',
  'เฟสหาย': 'Phase loss detected.',
  'เบรกเกอร์ทริป': 'The circuit breaker has tripped.',
  'เบรกเกอร์เมนทริป': 'The main breaker has tripped.',
  'ฟิวส์ขาด': 'The fuse is blown.',
  'แมกเนติกไม่ดูด': 'The magnetic contactor is not engaging.',
  'แมกเนติกค้าง': 'The contactor is stuck.',
  'เทอร์มอลโอเวอร์โหลดทริป': 'The thermal overload relay has tripped.',
  'โอเวอร์โหลดรีเลย์ตัด': 'The overload relay has tripped.',
  'ไฟตกบ่อย': 'Frequent voltage drops are occurring.',
  'ไฟกระชาก': 'Power surge detected.',
  'สายไฟช็อต': 'The power cable has short-circuited.',
  'สายไฟขาด': 'The power cable is broken.',
  'สายกราวด์หลุด': 'The ground wire is disconnected.',
  'ขั้วสายไฟไหม้': 'The wiring terminal is burnt.',
  'เทอร์มินอลหลวม': 'The terminal connection is loose.',
  'อินเวอร์เตอร์ทริป': 'The inverter has tripped.',
  'อินเวอร์เตอร์เออเร่อ': 'The VFD is showing a fault code.',
  'เพาเวอร์ซัพพลายช็อต': 'The power supply unit short-circuited.',
  'เซอร์โวเออเร่อ': 'The servo drive is showing an error.',
  'เซอร์โวไดรฟ์โอเวอร์โหลด': 'The servo drive is overloaded.',
  'เอ็นโค้ดเดอร์อ่านค่าเพี้ยน': 'The encoder is reading incorrectly.',
  'PLCค้าง': 'The PLC is frozen.',
  'โปรแกรมล่ม': 'The program crashed.',
  'การสื่อสารขาด': 'Communication lost.',
  'PLCไม่สื่อสาร': 'The PLC has lost communication.',
  'โมดูลเออเร่อ': 'The control module is showing an error.',
  'หน้าจอค้าง': 'The HMI screen is unresponsive.',
  'หน้าจอไม่ติด': 'The HMI screen will not turn on.',
  'ทัชสกรีนไม่ไป': 'The touch screen is unresponsive.',
  'เซ็นเซอร์เออเร่อ': 'The sensor is showing an error.',
  'เซ็นเซอร์ไม่ตรวจจับ': 'The sensor is not detecting.',
  'เซ็นเซอร์ค้าง': 'The sensor signal is stuck.',
  'แท่งเซ็นเซอร์หัก': 'The sensor probe is snapped.',
  'โฟโต้เซ็นเซอร์สกปรก': 'The photo sensor is dirty.',
  'โพร๊กซิมีตี้พัง': 'The proximity sensor is broken.',
  'ลิมิตสวิทช์ไม่ทำงาน': 'The limit switch is not actuating.',
  'ลิมิตสวิทช์ค้าง': 'The limit switch is stuck.',
  'อีสต็อปค้าง': 'The emergency stop button is stuck.',
  'ม่านแสงทริป': 'The light curtain has tripped.',
  'เซฟตี้ทริป': 'The safety circuit tripped.',
  'สัญญาณไฟไม่ติด': 'The indicator light is not turning on.',
  'บัซเซอร์ไม่ดัง': 'The buzzer has no sound.',

  // ==========================================
  // 💨 Pneumatics, Hydraulics & Vacuums (ลม ของเหลว และสูญญากาศ)
  // ==========================================
  'กระบอกลมค้าง': 'The pneumatic cylinder is stuck.',
  'กระบอกสูบไม่ทำงาน': 'The cylinder is not working.',
  'กระบอกลมทำงานช้า': 'The cylinder is moving slowly.',
  'กระบอกลมไม่มีแรง': 'The cylinder lacks force.',
  'ซีลกระบอกลมรั่ว': 'The cylinder seal is leaking.',
  'ลมรั่ว': 'Compressed air is leaking.',
  'ไม่มีลมเข้าเครื่อง': 'There is no air supply to the machine.',
  'แรงดันลมตก': 'The air pressure has dropped.',
  'แรงดันลมต่ำเกินไป': 'The air pressure is too low.',
  'แรงดันลมไม่นิ่ง': 'The air pressure is unstable.',
  'โซลินอยด์วาล์วเสีย': 'The solenoid valve is faulty.',
  'วาล์ว 5/2 รั่ว': 'The 5/2 valve is leaking.',
  'วาล์วค้าง': 'The valve is stuck.',
  'ชุด FRL รั่ว': 'The FRL unit is leaking.',
  'เรกูเลเตอร์ปรับไม่ได้': 'The pressure regulator cannot be adjusted.',
  'ข้อต่อลมหลุด': 'The air fitting is disconnected.',
  'สายลมพับ': 'The air hose is pinched.',
  'สายลมแตก': 'The air hose is burst.',
  'ปั๊มน้ำไม่ไหล': 'The water pump has no flow.',
  'ปั๊มไม่ดูด': 'The pump has no suction.',
  'ปั๊มน้ำมันรั่ว': 'The pump is leaking oil.',
  'น้ำยาไม่ไหล': 'The chemical solution is not flowing.',
  'โฟลมิเตอร์ไม่ขึ้นค่า': 'The flow meter is not showing any reading.',
  'ท่อตัน': 'The pipe is clogged.',
  'กิ๊ปเปอร์หนีบไม่แน่น': 'The gripper is not clamping tightly.',
  'กิ๊ปเปอร์ไม่ปล่อยงาน': 'The gripper will not release the part.',
  'ตัวจุ๊บไม่ดูดงาน': 'The vacuum pad is not picking up the part.',
  'ตัวจุ๊บฉีกขาด': 'The vacuum pad is torn.',
  'แวคคั่มดูดไม่ลง': 'The vacuum pump cannot reach the target pressure.',
  'ปั๊มแวคคั่มมีควันขาว': 'The vacuum pump is emitting white smoke.',
  'ปั๊มแวคคั่มน้ำมันหาย': 'The vacuum pump is losing oil.',
  'ปั๊มแวคคั่มโอเวอร์ฮีต': 'The vacuum pump is overheating.',
  'กรองไอเสียแวคคั่มตัน': 'The vacuum exhaust filter is clogged.',

  // ==========================================
  // 🏭 Utilities & Facilities (ระบบปั๊มลม ชิลเลอร์ บอยเลอร์ และน้ำ)
  // ==========================================
  'สกรูคอมเพรสเซอร์มีเสียงดัง': 'The air end is making an abnormal noise.',
  'ปั๊มลมโหลดไม่ตัด': 'The air compressor is loading continuously.',
  'ปั๊มลมร้อนจัด': 'The air compressor is overheating.',
  'อุณหภูมิปลายทางสูง': 'High discharge temperature detected.',
  'น้ำมันปนไปกับลม': 'Oil carryover in the compressed air.',
  'ลมมีน้ำปน': 'Moisture found in the compressed air line.',
  'ออโต้เดรนไม่ทำงาน': 'The auto drain valve is not working.',
  'เซปปะเรเตอร์ตัน': 'The separator is clogged.',
  'ชิลเลอร์ไฮเพรสเชอร์': 'The chiller has a high-pressure alarm.',
  'ชิลเลอร์โลว์เพรสเชอร์': 'The chiller has a low-pressure alarm.',
  'ชิลเลอร์อุณหภูมิไม่ลง': 'The chiller temperature is not dropping.',
  'อุณหภูมิน้ำหล่อเย็นสูง': 'The cooling water temperature is too high.',
  'แอร์ไม่เย็น': 'The air conditioner is not cooling.',
  'แอร์น้ำหยด': 'The air conditioner is dripping water.',
  'น้ำยาแอร์รั่ว': 'The refrigerant is leaking.',
  'น้ำยาแอร์ขาด': 'The refrigerant level is low.',
  'แผงคอยล์เย็นเป็นน้ำแข็ง': 'Frost buildup on the evaporator coil.',
  'คูลลิ่งทาวเวอร์น้ำล้น': 'The cooling tower is overflowing.',
  'ตะกรันเกาะหนา': 'Heavy scaling buildup.',
  'หม้อต้มไม่ร้อน': 'The boiler is not heating.',
  'หม้อต้มจุดไม่ติด': 'The boiler ignition failed.',
  'เบิร์นเนอร์เออเร่อ': 'The burner is showing an error.',
  'ระดับน้ำโลว์': 'Low water level alarm.',
  'ท่อสตีมรั่ว': 'The steam pipe is leaking.',
  'สตีมแทรปตัน': 'The steam trap is clogged.',
  'ค่าน้ำเกินกำหนด': 'The water conductivity is out of spec.',
  'ไส้กรอง RO อุดตัน': 'The RO filter is blocked.',
  'เพรสเชอร์ดิฟสูง': 'High differential pressure detected.',
  'ปั๊มโดสไม่ทำงาน': 'The dosing pump is not working.',
  'เรซิ่นหมดอายุ': 'The resin is expired.',
  'แคปแบงค์ระเบิด': 'The capacitor bank has blown.',
  'หลอดไฟขาด': 'The light bulb is burnt out.',
  'ท่อประปาแตก': 'The water pipe has burst.',
  'หลังคารั่วโซนผลิต': 'The roof is leaking in the production area.',
  'น้ำท่วมพื้นโรงงาน': 'Flooded shop floor.',

  // ==========================================
  // 📦 Packing, Vision, Laser & Conveyors (ระบบแพ็คกิ้ง วิชั่น เลเซอร์)
  // ==========================================
  'กล้องจับภาพไม่ได้': 'The vision camera cannot capture the image.',
  'กล้องวิชั่นเออเร่อ': 'The vision camera has an error.',
  'แสงสว่างไม่พอ': 'There is insufficient lighting for the camera.',
  'แสงสะท้อนชิ้นงาน': 'Glare reflection on the workpiece.',
  'ภาพเบลอไม่ชัด': 'The image is blurry.',
  'ดีดงานทิ้งผิดปกติ': 'Abnormal false reject rate.',
  'ปล่อยงานเสียผ่าน': 'False acceptance of defective parts.',
  'อ่านบาร์โค้ดไม่ได้': 'The barcode reader cannot scan.',
  'อ่านบาร์โค้ดข้างเดียว': 'Scans one side only.',
  'เครื่องแพ็คซองติด': 'The packing machine has an envelope jam.',
  'ดูดซองไม่ขึ้น': 'Failed to pick the envelope.',
  'เปิดซองไม่ออก': 'Failed to open the envelope.',
  'ใส่เลนส์ไม่เข้าซอง': 'Failed to insert the lens into the envelope.',
  'ซีลไม่สนิท': 'The package seal is incomplete.',
  'ซีลรั่ว': 'The package seal is leaking.',
  'รอยซีลไหม้': 'The package seal is burnt.',
  'ซองยับย่น': 'The envelope is wrinkled.',
  'พับไม่สวย': 'Poor folding quality.',
  'ตัวพิมพ์วันที่สีไม่ออก': 'The date coder has no ink.',
  'เครื่องปริ้นเลเบลไม่ออก': 'The label printer is not printing.',
  'กระดาษสติ๊กเกอร์ติด': 'The sticker paper is jammed.',
  'บาร์โค้ดเป็นเส้นปะ': 'The barcode has dotted line defects.',
  'หมึกเลอะซอง': 'Ink smudged on the envelope.',
  'เลเซอร์ยิงไม่เข้า': 'The laser marking is too shallow.',
  'รอยเลเซอร์เบลอ': 'The laser marking is blurred.',
  'เลเซอร์ยิงตกขอบ': 'The laser mark is out of bound.',
  'เลนส์โฟกัสสกปรก': 'The focus lens is dirty.',
  'ชิ้นงานชนกันบนสายพาน': 'The workpieces are colliding on the conveyor.',
  'งานค้างในเครื่อง': 'There is a product jammed inside the machine.',
  'งานล้นสายพาน': 'The product is overflowing the conveyor.',
  'สต็อปเปอร์ค้าง': 'The stopper is jammed.',
  'ตัวปัดงานไม่ทำงาน': 'The rejector is not working.',

  // ==========================================
  // 👓 Optical / Lens Manufacturing (งานขัด เคลือบ และประกอบเลนส์)
  // ==========================================
  'เครื่องเคลือบหมุนไม่ได้รอบ': 'The spin coater is not reaching the target RPM.',
  'เคลือบน้ำยาไม่สม่ำเสมอ': 'The coating is uneven.',
  'เคลือบไม่ติดผิว': 'The coating will not adhere to the surface.',
  'เคลือบลอก': 'The lens coating is peeling.',
  'สีเคลือบเพี้ยน': 'The coating color is out of specification.',
  'เครื่องขัดไม่หมุน': 'The polishing machine is not rotating.',
  'หัวขัดสั่นแรง': 'The polishing head is vibrating severely.',
  'ขัดกินผิวมากไป': 'The lens is over-polished.',
  'ขัดรอยไม่ออก': 'The polishing cannot remove the scratches.',
  'ตั้งศูนย์ไม่ได้': 'Cannot align the center.',
  'เลนส์หลุดจากบล็อก': 'The lens detached from the block.',
  'ดูดเลนส์ไม่อยู่': 'The vacuum cannot hold the lens.',
  'เลนส์เป็นรอย': 'The lens is scratched.',
  'รอยขนแมวเต็มเลนส์': 'Heavy hairline scratches found on the lens.',
  'เลนส์บิ่นขอบ': 'The lens is chipped at the edge.',
  'เลนส์แตกคามือ': 'The lens cracked during handling.',
  'เลนส์เป็นฝ้า': 'The lens is foggy.',
  'เลนส์ขุ่นมัว': 'The lens is cloudy.',
  'มีฟองอากาศในชิ้นงาน': 'Air bubbles found in the workpiece.',
  'ผิวส้มบนเลนส์': 'Orange peel defect on the lens surface.',
  'ผิวเลนส์ด่าง': 'The lens surface is stained.',
  'ค่าความโค้งผิดเพี้ยน': 'The curvature is out of specification.',
  'กำลังเลนส์ผิด': 'Incorrect lens power.',
  'ความหนาไม่ได้สเปค': 'The thickness is out of specification.',
  'ขนาดไม่ได้สเปค': 'The dimension is out of specification.',
  'น้ำยาขัดหมด': 'The polishing slurry is depleted.',
  'โมโนเมอร์เสื่อมสภาพ': 'The monomer is degraded.',

  // ==========================================
  // 🛠️ Maintenance Actions & Operations (การซ่อมบำรุง และ PM)
  // ==========================================
  'เปลี่ยนลูกปืนใหม่': 'Replace with a new bearing.',
  'เปลี่ยนไส้กรองลม': 'Replace the air filter.',
  'ถ่ายน้ำมันเครื่องปั๊มลม': 'Change the air compressor oil.',
  'เติมน้ำยาแอร์': 'Top-up the refrigerant.',
  'ล้างทิ้วชิลเลอร์': 'Perform tube cleaning for the chiller.',
  'ล้างแอร์': 'Clean the HVAC unit.',
  'อัดจารบีลูกปืน': 'Grease the bearing.',
  'ตั้งความตึงสายพาน': 'Adjust the conveyor belt tension.',
  'ตั้งศูนย์สายพานใหม่': 'Realign the conveyor belt.',
  'ขันน็อตให้แน่น': 'Tighten the bolts.',
  'สอบเทียบเครื่องชั่ง': 'Calibrate the weighing scale.',
  'แบ็คอัพโปรแกรม PLC': 'Backup the PLC program.',
  'โหลดโปรแกรมใหม่': 'Upload the program again.',
  'รีเซ็ตเออเร่ออินเวอร์เตอร์': 'Reset the inverter fault.',
  'ตัดต่อสายไฟใหม่': 'Rewire the connection.',
  'ซ่อมบอร์ดคอนโทรล': 'Repair the control board.',
  'เบิกอะไหล่ด่วน': 'Urgent spare part requisition.',
  'รออะไหล่ต่างประเทศ': 'Waiting for overseas spare parts.',
  'ทำ PM ประจำเดือน': 'Perform monthly preventive maintenance.',
  'เดินเครื่องทดสอบ': 'Run a machine test.',
  'เครื่องพร้อมใช้งาน': 'The machine is ready for operation.'
})

// ── Grammar noun-phrase rewrites ──
const _nounRewrite = Object.freeze({
  'loose connection': 'loose',
})

// ── Production metrics ──
export let _metrics = { fuzzyHits: 0, unknownTokens: 0 }

// ── LRU Cache (max 5000) ──
class LRU {
  constructor(max) { this.max = max; this.map = new Map() }
  get(k) {
    if (!this.map.has(k)) return undefined
    const v = this.map.get(k); this.map.delete(k); this.map.set(k, v); return v
  }
  set(k, v) {
    if (this.map.has(k)) this.map.delete(k)
    else if (this.map.size >= this.max) this.map.delete(this.map.keys().next().value)
    this.map.set(k, v)
  }
  has(k) { return this.map.has(k) }
}

// ── Trie for O(n) tokenization ──
function buildTrie() {
  const trie = Object.create(null)
  for (const k of Object.keys(_dict)) {
    let node = trie
    for (const ch of Array.from(k)) {
      if (!node[ch]) node[ch] = Object.create(null)
      node = node[ch]
    }
    node.$ = { en: _dict[k].en, t: _dict[k].t, sys: _dict[k].sys }
  }
  return trie
}
const TRIE = buildTrie()

// ── Length + first-char indexed fuzzy lookup ──
const _dictByLen = (() => {
  const map = {}
  for (const k of Object.keys(_dict)) {
    const l = Array.from(k).length
    if (!map[l]) map[l] = []
    map[l].push(k)
  }
  return map
})()

const _fuzzyCache = new LRU(5000)
export let _fuzzyHits = 0
function fuzzyLookup(word, threshold = 0.80) {
  if (!word || word.length < 2) return null
  const cached = _fuzzyCache.get(word)
  if (cached !== undefined) return cached
  const wChars = Array.from(word), wLen = wChars.length
  const wFirst = wChars[0]
  let best = null, bestSim = threshold - 0.001
  const minLen = Math.ceil(wLen * threshold)
  const maxLen = Math.floor(wLen / threshold)
  for (let l = minLen; l <= maxLen; l++) {
    const bucket = _dictByLen[l]
    if (!bucket) continue
    for (const k of bucket) {
      if (Array.from(k)[0] !== wFirst) continue   
      if (k.slice(0,2) !== word.slice(0,2)) continue  
      const dist = levenshtein(word, k)
      const sim = 1 - dist / Math.max(wLen, l)
      if (sim > bestSim) { bestSim = sim; best = { ..._dict[k], key: k, sim } }
    }
  }
  _fuzzyCache.set(word, best)
  if (best) { _fuzzyHits++; _metrics.fuzzyHits++ }
  return best
}

// ── Trie-based tokenizer ──
export function tokenize(text) {
  const result = []
  const chars = Array.from(String(text).trim())
  const trie = TRIE   
  let i = 0
  while (i < chars.length) {
    if (chars[i] === ' ') { i++; continue }

    let node = trie, lastMatch = null, lastEnd = i, j = i
    while (j < chars.length && node[chars[j]]) {
      node = node[chars[j]]; j++
      if (node.$) { lastMatch = node.$; lastEnd = j }
    }

    if (lastMatch) {
      result.push({ en: lastMatch.en, t: lastMatch.t, sys: lastMatch.sys, raw: chars.slice(i, lastEnd).join('') })
      i = lastEnd
    } else {
      let end = i + 1
      while (end < chars.length && chars[end] !== ' ') {
        if (trie[chars[end]]) break   
        let n2 = trie, k2 = end, hit = false
        while (k2 < chars.length && n2[chars[k2]]) {
          n2 = n2[chars[k2]]; k2++
          if (n2.$) { hit = true; break }
        }
        if (hit) break
        end++
      }
      const unk = chars.slice(i, end).join('').trim()
      if (unk) {
        const fm = fuzzyLookup(unk)
        if (fm) {
          result.push({ en: fm.en, t: fm.t, sys: fm.sys, raw: unk, fuzzy: true })
        } else {
          _metrics.unknownTokens++   
          if (result.length && result[result.length-1].t === 'U') {
            result[result.length-1].en += ' ' + unk; result[result.length-1].raw += unk
          } else {
            result.push({ en: unk, t: 'U', raw: unk })
          }
        }
      }
      i = end
    }
  }
  return result
}

export const _normRules = [
  // ==========================================
  // 🚨 ดักคำพิมพ์ผิดที่เจอบ่อยขั้นวิกฤต (Critical Typos)
  // ==========================================
  [/อุณภูมิ|อุณภุมิ|อุณหถูมิ|อุณหภูม/g, 'อุณหภูมิ'],
  [/ไมได้|ใมได้|ใม่|ม่าย|ให่ม/g, 'ไม่ได้'],
  [/อ้างล้างมือ/g, 'อ่างล้างมือ'],
  [/สปรย์|สเปรย|สเปร์ย/g, 'สเปรย์'],
  [/ทิป|ทริป|trip/gi, 'ทริป'],
  [/erorr|error|เอ่อเร่อ|เอเร่อ|เออเร่อะ|ออเร่อ/gi, 'เออเร่อ'],
  [/alarm|อาราม|อะลาม/gi, 'เออเร่อ'],
  [/ปลิ้นเตอร์|ปลิ้น|ปรินเตอร์|พริ้นเตอร์/g, 'ปริ้นเตอร์'],
  [/สานพาน|สายพาย|สายพราน/g, 'สายพาน'],
  [/กะตุก|กะตุกๆ/g, 'กระตุก'],
  [/บูล่ิง|บูลิ่ง|Cooling|cooling/gi, 'คูลลิ่ง'],
  [/สวตว์|สวิท|สวิต|สวิทซ์|สวิตช์|สวิทส์|ฟุตสวิตท์|ฟุ๊ตสวิทช์/g, 'สวิทช์'],
  [/สแลนเดอร์|ซิลิเดอร์/g, 'กระบอกลม'],
  [/วาส์ว|วาร์ว|วาว์ล|วาวล์|วาว/g, 'วาล์ว'],
  [/ลลอย|Alloy|alloy/gi, 'อัลลอยด์'],
  [/รถเข๊น/g, 'รถเข็น'],
  [/นำยา|นั้ายา|น้ำยาา/g, 'น้ำยา'],
  [/เตรื่อง|เดรื่อง|เคื่อง|เครือง/g, 'เครื่อง'],
  [/ซํกผ้า|ชักผ้า/g, 'ซักผ้า'],
  [/ฟลิม์|ฟิลม์|ฟิล์ม/g, 'ฟิล์ม'],
  [/laek|leak|ลีค|ลี๊ก/gi, 'รั่ว'],

  // ==========================================
  // 🌬️ ระบบแอร์ ชิลเลอร์ และบอยเลอร์ (HVAC & Boiler)
  // ==========================================
  [/อีแวป|อีแวบ|คอยล์เย็น|evap|evaporator/gi, 'อีแวป'],
  [/คอนเดนเซอ|คอยร้อน|condenser/gi, 'คอนเดนเซอร์'],
  [/เอ็กแพนชัน|เอ็กแพนชั่น|expansion valve/gi, 'เอ็กซ์แพนชั่น'],
  [/ไฮเพลสเชอร์|ไฮเพรชเชอร์|high pressure/gi, 'ไฮเพรสเชอร์'],
  [/โลเพลสเชอร์|โลเพรชเชอร์|low pressure/gi, 'โลว์เพรสเชอร์'],
  [/สตีมแทรป|สตีมแท็ป|steam trap/gi, 'สตีมแทรป'],
  [/เบินเนอ|เบิร์นเนอ|burner/gi, 'เบิร์นเนอร์'],
  [/เซฟตี้วาล(?=[^์]|$)|safety valve/gi, 'เซฟตี้วาล์ว'],
  [/ฮีตเอ็กเชนเจอ|heat exchanger/gi, 'ฮีตเอ็กเชนเจอร์'],
  [/ฮีดเตอร์|ฮิตเตอร์/g, 'ฮีตเตอร์'],
  [/บอยเลอ|boiler/gi, 'บอยเลอร์'],
  [/คูลลิ่งทาวเวอ|cooling tower/gi, 'คูลลิ่งทาวเวอร์'],

  // ==========================================
  // 🕳️ ระบบลม และ แวคคั่มปั๊ม (Pneumatics & Vacuum)
  // ==========================================
  [/เวน|แผ่นเวน|ใบพัดคาร์บอน|vane/gi, 'เวรน'],
  [/ออยซิล|ออยซีล|ซีลน้ำมัน/g, 'ซีลน้ำมัน'],
  [/โอลิ่ง|oring|o-ring/gi, 'โอริง'],
  [/แมนิโฟล|แมนิโฟลด์|manifold/gi, 'แมนิโฟลด์'],
  [/เรกูเลเตอ|เรกกูเลเตอ|regulator/gi, 'เรกกูเลเตอร์'],
  [/ลูบริเคเตอ|ลูบริเคเตอร์|lubricator/gi, 'ลูบริเคเตอร์'],
  [/ไซเลนเซอ|ตัวเก็บเสียง|silencer/gi, 'ไซเลนเซอร์'],
  [/แอร์ไนฟ|air knife/gi, 'แอร์ไนฟ์'],
  [/ออโต้เดรน|auto drain/gi, 'ออโต้เดรน'],
  [/เซปปะเรเตอ|เซปพาเรเตอร์|separator/gi, 'เซปปะเรเตอร์'],
  [/คอปเปอ|คอปเปอร์ลม|coupler/gi, 'คอปเปอร์'],
  [/โซลินอยด์|โซลินอย|โซลินอยล์/g, 'โซลินอยด์'],
  [/วาล(?=[^ว์]|$)/g, 'วาล์ว'],
  [/แรงดันลมตก|ลมตก/g, 'แรงดันลมต่ำ'],
  [/ลมไม่เข้า|ไม่มีลมมา/g, 'ไม่มีลม'],
  [/แวคคัม|แวคคั่ม|vacuum/gi, 'แวคคั่ม'],
  [/ตัวจุ๊บ|ตัวดูดชิ้นงาน|suction cup/gi, 'ตัวจุ๊บ'],
  [/กิ๊ปเปอ|กริปเปอร์|gripper/gi, 'กิ๊ปเปอร์'],
  [/คอมเพรสเซอ|คอมแอร์|compressor/gi, 'คอมเพรสเซอร์'],

  // ==========================================
  // ⚙️ เครื่องกล & อุปกรณ์ (Mechanical & Hardware)
  // ==========================================
  [/สายพานลำเลียง/g, 'สายพาน'],
  [/พูลเล่ย์|มู่เล่ย์|พูเล่/g, 'พูลเลย์'],
  [/เฟืองเกียร์|เฟือง/g, 'เกียร์'],
  [/ลูกปืน|เบริ่ง|แบริ่งแตก|ลูกปืนแตก/g, 'แบริ่ง'],
  [/เพลาหัก|เพลาแตก/g, 'เพลาเสีย'],
  [/ตระแกรง/g, 'ตะแกรง'],
  [/คัปปลิง|คัปปิ้ง|คัปปิง|ยอย|จอยต์|joint/gi, 'คัปปลิ้ง'],
  [/ไฮดรอลิค|ไฮโดรลิค|ไฮโดรลิก/g, 'ไฮดรอลิก'],
  [/จารบี|จารบรี/g, 'จาระบี'],
  [/ลูกกลิ้ง|โรลเลอร์|roller/gi, 'โรลเลอร์'],
  [/ประแจ|ปะแจ/g, 'ประแจ'],
  [/เวอเนีย|เวอเนียร์|vernier/gi, 'เวอร์เนีย'],
  [/น๊อต|สกรู|น๊อตตัวเมีย|น๊อตตัวผู้/g, 'น็อต'],
  [/สปิง|สปริงค์/g, 'สปริง'],
  [/กะทุ้ง/g, 'แกนกระทุ้ง'],
  [/เบ้าบล๊อก/g, 'เบ้าบล็อก'],
  [/สเตท|สเตจ/g, 'สเตจ'],
  [/แร็ค|แหร็ค/g, 'แหร็คปล่อยงาน'],
  [/ลูกล้อตาย|ลูกล้อ/g, 'ลูกล้อ'],
  [/บล็อกสกรู/g, 'บอลสกรู'],
  [/ลิเนียไกด์|linear guide/gi, 'ลิเนียร์ไกด์'],
  [/สกรูลีด|lead screw/gi, 'สกรูลีด'],
  [/ชัก|ชัค|หัวชัค|chuck/gi, 'ชัค'],
  [/สพินเดิล|สปินเดิล|spindle/gi, 'สพินเดิ้ล'],

  // ==========================================
  // ⚡ ไฟฟ้า คอนโทรล และอุปกรณ์เสริม (Electrical & Control)
  // ==========================================
  [/เบรคเกอร์|เบรกเกอ|breaker/gi, 'เบรกเกอร์'],
  [/สายกราวน์|สายดิน/g, 'สายกราวด์'],
  [/ปลั๊กไฟ/g, 'ปลั๊ก'],
  [/ไฟไม่เข้า|ไฟไม่มา/g, 'ไม่มีไฟ'],
  [/ไฟตก/g, 'แรงดันตก'],
  [/ไฟเกิน/g, 'แรงดันเกิน'],
  [/ไฟช็อต|ไฟช๊อต|ช๊อต|ช๊อตต/g, 'ไฟช็อต'],
  [/แมกเนติก|แม๊คเนติก|แมคเนติก|แมคเนติค/g, 'แมกเนติก'],
  [/คาปาซิเตอ|คาปา|แคป|คอนเดนเซอร์ไฟ|cap bank/gi, 'คาปา'],
  [/พาวเวอ|พาวเวอร์|เพาเวอ|power supply/gi, 'เพาเวอร์ซัพพลาย'],
  [/ซัพพลาย|ซับพลาย/g, 'เพาเวอร์ซัพพลาย'],
  [/แผงวงจร|เมนบอร์ด|บอร์ด|pcb/gi, 'แผงวงจร'],
  [/รีเล|รีเลย์|relay/gi, 'รีเลย์'],
  [/ไทเมอ|timer/gi, 'ไทเมอร์'],
  [/เคาท์เตอ|counter/gi, 'เคาน์เตอร์รีเลย์'],
  [/อาร์ทีดี|rtd/gi, 'PT100'],
  [/พีเอฟ|power factor/gi, 'พีเอฟตก'],
  [/เอนโค้เดอ(?=[^ร]|$)|เอนโค้ดเดอ|encoder/gi, 'เอ็นโค้ดเดอร์'],
  [/เทอมินอล|terminal/gi, 'เทอร์มินอล'],
  [/บัซเซอ|ออดเตือน|buzzer/gi, 'บัซเซอร์'],
  [/บาแลมป์|บาร์แลมป์|bar lamp/gi, 'บาแลม'],
  [/แอคซอส|เอ็กซอส|exhaust fan/gi, 'แอคซอส'],
  [/โฟวเรท|โฟลเรท|flow rate/gi, 'โฟเลท'],
  [/โฟลมิเตอ|flow meter/gi, 'โฟลมิเตอร์'],

  // ==========================================
  // 🤖 Automation, Sensor & PLC
  // ==========================================
  [/เซนเซอร์|เซ็นเซอ(?=[^ร]|$)|sensor/gi, 'เซ็นเซอร์'],
  [/โฟโตเซนเซอร์|photo sensor/gi, 'โฟโต้เซ็นเซอร์'],
  [/prox sensor|prox|พร็อกซิมิตี้|พร็อกมิซิตี้/gi, 'โพร๊ก'],
  [/วิชัน|วิชั่น|vision/gi, 'วิชั่น'],
  [/เลเซอ(?=[^ร]|$)|laser/gi, 'เลเซอร์'],
  [/อ่านบาร์โค๊ต|อ่านบาร์โค้ต|อ่านบาร์โคด|ยิงบาร์โค้ดไม่ได้/g, 'ไม่อ่านบาร์โค้ด'],
  [/บาร์โค๊ตข้างเดียว|บาร์โค้ตข้างเดียว/g, 'อ่านบาร์โค้ดข้างเดียว'],
  [/พีแอลซี/g, 'PLC'],
  [/เฮชเอ็มไอ|จอทัชสกรีน/g, 'หน้าจอ'],
  [/สกาดา/g, 'SCADA'],
  [/ลิมิตสวิทส์|ลิมิตสวิช|ลิมิตสวิตซ์/g, 'ลิมิตสวิทช์'],
  [/เทอร์โมคัปเปิ้ล|เทอร์โมคัพเปิล|เทอร์โมคับเปิล/g, 'เทอร์โมคัปเปิล'],
  [/โบลว์เออ(?=[^ร]|$)|โบลเวอ(?=[^ร]|$)/g, 'โบลว์เวอร์'],
  [/อีสต๊อป|emergency stop|ปุ่มฉุกเฉิน/gi, 'อีสต็อป'],
  [/ซอฟสตาร์ท|ซ็อฟต์สตาร์ท/g, 'ซอฟต์สตาร์ท'],
  [/อินเวอร์เตอ(?=[^ร]|$)|inverter|vfd/gi, 'อินเวอร์เตอร์'],

  // ==========================================
  // 🛣️ Conveyor & Motion
  // ==========================================
  [/คอนเวเยอ(?=[^ร]|$)|คอนเวนเยอร์/g, 'คอนเวเยอร์'],
  [/สายพานหยุด/g, 'คอนเวเยอร์หยุด'],
  [/สายพานเอียง|สายพานเบี้ยว/g, 'สายพานปีนขอบ'],
  [/มอเตอ(?=[^ร]|$)|motor/gi, 'มอเตอร์'],
  [/เซอร์โวมอเตอ(?=[^ร]|$)/g, 'เซอร์โวมอเตอร์'],
  [/รอบไม่นิ่ง|ความเร็วไม่นิ่ง/g, 'รอบไม่คงที่'],
  [/หมุนไม่ได้/g, 'ไม่หมุน'],
  [/หมุนช้า/g, 'รอบต่ำ'],

  // ==========================================
  // 👓 งานผลิตเลนส์ และกระบวนการผลิต (Optical & Production)
  // ==========================================
  [/โพลิช|polish/gi, 'ขัด'],
  [/ดีบล๊อก|ดีบล็อค|deblock/gi, 'ดีบล็อก'],
  [/อัลตราโซนิค|ultrasonic/gi, 'น้ำยาอัลตร้าโซนิค'],
  [/โมล|โมลด์|mold/gi, 'โมลด์'],
  [/สติวเลอ|เครื่องกวน|stirrer/gi, 'สติวเลอร์'],
  [/แพดพริ้นติ้ง|pad printing/gi, 'เครื่อง padprinting'],
  [/รอยขนแมว/g, 'รอยขนแมว'],
  [/ผิวส้ม/g, 'ผิวส้ม'],
  [/สีเพี้ยน|สีไม่ตรง/g, 'สีเพี้ยน'],
  [/เคลิอบ|เครือบ|เคลืบ|โค้ทติ้ง/g, 'เคลือบ'],
  [/พอลลิช|โพลิช/gi, 'ขัด'],

  // ==========================================
  // 🔧 สะกดผิดทั่วไป & คำกริยา (Verbs & General)
  // ==========================================
  [/เปลื่ยน|เปลียน|เปรี่ยน|เปี่ยน|เปลี่ยนน/g, 'เปลี่ยน'],
  [/แนนเกินไป|แน่นไป/g, 'แน่นเกินไป'],
  [/หลวมเกินไป|หลวมไป/g, 'หลวม'],
  [/เสียหาย|พัง|ชำรุด|เดี้ยง|พังแล้ว/g, 'เสีย'],
  [/ใช้งานไม่ได้|ใช้ไม่ได้|รันไม่ได้/g, 'เสีย'],
  [/ทำงานใม่ได้|ไม่ทำงานแล้ว/g, 'ทำงานไม่ได้'],
  [/ช่อม|ซ่อมแซม|ซอม|แก้ไข|ซ่อมบำรุง/g, 'ซ่อม'],
  [/ย้าน/g, 'ย้าย'],
  [/ปรับตั่ง|ตั้งค่า|เซ็ตอัพ|setup/gi, 'ปรับตั้ง'],
  [/ตรวจเช็ค|เช็ค|เชค|เชก/g, 'ตรวจสอบ'],
  [/เคลียฝุ่น|เคลียร์ฝุ่น|เป่าฝุ่น/g, 'ทำความสะอาด'],
  [/รีเซต|reset|รีเซ็ท/gi, 'รีเซ็ต'],
  [/คาลิเบรต|แคลลิเบรท|คาริเบรท|calibrate/gi, 'คาลิเบรท'],
  [/กะแทก|กระแท๊ก/g, 'กระแทก'],
  [/ปะกอบ|ประกอบการ/g, 'ประกอบ'],
  [/ทะลัก|ล้นออกมา/g, 'ล้น'],
  [/กะเด็น|กระเดน/g, 'กระเด็น'],
  [/แพคกิ้ง|แพ๊คกิ้ง|packing/gi, 'แพ็คกิ้ง'],
  [/แบคอัพ|แบ๊คอัพ|backup/gi, 'แบ็คอัพ'],

  // ==========================================
  // 🩺 อาการเสียที่มักพิมพ์ผิด/พิมพ์สั้นๆ (Symptoms Slang)
  // ==========================================
  [/ตกล่อง|ตกร่อง/g, 'ตกล่อง'],
  [/เช็นเตอ|เซนเตอ|center/gi, 'เช็นเตอร์'],
  [/ไม่จุ๊บ|ไม่ดูดงาน/g, 'ไม่จุ๊ฟ'],
  [/ไม่ได้รอบ|รอบตก/g, 'ไม่ได้รอบ'],
  [/ตัวเลขเบิ้ล|จอเบิ้ล/g, 'ตัวเลขเบิ้ล'],
  [/ยับย่น|เทปย่น/g, 'เทปยับย่น'],
  [/ไฟรั้ว|แอร์รั้ว|ลมรั้ว/g, 'รั่ว'],
  [/อั้น|ลมตัน/g, 'อั้น'],
  [/โอเวอร์เทมป|over temp/gi, 'โอเวอร์เทมป์'],
  [/น๊อค|น็อค/g, 'น๊อค'],
  [/ติดๆดับๆ/g, 'ติดๆดับๆ'],
  [/ไปไม่สุด|ดันไม่สุด/g, 'ไปไม่สุด'],
  [/กลับไม่สุด|ถอยไม่สุด/g, 'กลับไม่สุด'],
  [/ตันบ่อย|อุดตัน/g, 'ตัน'],
  [/ติดขัด/g, 'ติด'],
  [/หลุดบ่อย/g, 'หลุด'],
  [/เสียงดัง/g, 'มีเสียงดัง'],
  [/สั่นแรง|สั่นสะเทือน/g, 'สั่น'],
  [/ร้อนเกิน|โอเวอร์ฮีต|overheat/gi, 'ร้อนจัด'],
  [/ซึมๆ|น้ำมันซึม/g, 'ซึม'],
  [/ไหม้แล้ว|มีกลิ่นไหม้/g, 'เหม็นไหม้'],

  // ==========================================
  // 🛠️ คำกริยาและการกระทำเพิ่มเติม (Actions & Maintenance)
  // ==========================================
  [/คาริเบท|แคล/g, 'คาริเบท'],
  [/แยงทิ้ว|แยงท่อ/g, 'แยงทิ้ว'],
  [/ล้างทิ้ว/g, 'ล้างทิ้ว'],
  [/เมกเกอ|megger/gi, 'เมกเกอร์'],
  [/บายพาส|ต่อตรง/g, 'บายพาส'],
  [/อัดจารบี|อัดจาระบี|ทาจารบี/g, 'อัดจารบี'],
  [/รีบูท|reboot/gi, 'รีบูต'],
  [/ดาวโหลด/g, 'ดาวน์โหลดโปรแกรม'],
  [/อัพเดท|อัปเดต/g, 'อัปเดตเฟิร์มแวร์'],

  // ==========================================
  // 🧹 Text Normalize (จัดการอักขระและช่องว่าง)
  // ** คำเตือน: กฎส่วนนี้ต้องอยู่ล่างสุดเสมอ เพื่อไม่ให้กวนการตัดคำด้านบน **
  // ==========================================
  
  // ดักพวกพิมพ์ลากยาว เช่น ร้อนนนนนน -> ร้อนน, ติดดดด -> ติดด
  [/([\u0E00-\u0E7F])\1{2,}/g, '$1$1'],
  
  // ยุบช่องว่างหลายๆ เคาะให้เหลือเคาะเดียว เพื่อให้ระบบ Tokenize อ่านง่าย
  [/\s+/g, ' ']
]

const _normCache = new LRU(5000)
export function normalizeThaiText(text) {
  if (!text) return text
  const s = String(text).trim()
  const cached = _normCache.get(s)
  if (cached !== undefined) return cached
  
  let out = s
  for (const [rx, rep] of _normRules) out = out.replace(rx, rep)
  out = out.trim()
  
  _normCache.set(s, out)
  return out
}

// ── Levenshtein distance ──
function levenshtein(a, b) {
  const ac = Array.from(a), bc = Array.from(b)
  const m = ac.length, n = bc.length
  if (m === 0) return n; if (n === 0) return m
  let prev = Array.from({length: n+1}, (_, i) => i), curr = []
  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = ac[i-1] === bc[j-1] ? 0 : 1
      curr[j] = Math.min(prev[j]+1, curr[j-1]+1, prev[j-1]+cost)
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[n]
}

// ── Grammar assembler ──
const _nonFluidComps = new Set([
  'conveyor belt','roller chain','cutting blade','fan impeller','tension spring',
  'wire rope','gear','motor pinion','conveyor roller','rubber roller','sponge pad',
  'rubber seal','support leg','machine base','guide rail','strip curtain','safety guard',
  'bumper','working stage','stage','ejector pin','pushing arm','pulling arm',
  'motor carbon brush','thermal insulation','alloy material','capacitor bank',
  'main breaker','rotary vane','exhaust filter','burner',
  'envelope vacuum picker','envelope magazine','envelope opener','lens pusher',
  'sealing heater','sealer jaw','date coder','stopper cylinder','rejector mechanism',
  'diverter','laser head','f-theta focus lens','laser source','fume extractor',
  'vision camera','camera lens','ring light illumination','illumination unit','vision controller'
])
const _fluidSymptoms = new Set(['leakage','seepage','dripping','overflow','continuous flow','no flow','clogged','frequent clogging','flow restriction','not spraying','continuous spraying','intermittent spraying','not refilling','zero pressure'])
const _measureMods   = new Set(['temperature','relative humidity','system pressure','fluid level','clearance','water content','center alignment'])
const _urgencyMods   = new Set(['severely','severe','urgent','slightly','minor','moderate','frequently','continuously','occasionally','intermittently','immediately'])
const _hasSymptoms   = new Set(['no flow','not filling','zero pressure','no power supply','no sound','audio failure','loss of vacuum','low vacuum pressure'])
const _hasRewrites   = {'no flow':'no water flow','not filling':'not filling','zero pressure':'no pressure','no power supply':'no power supply','audio failure':'no audio','loss of vacuum':'no vacuum','low vacuum pressure':'low vacuum'}
const _nounSymptoms  = {'error':'is showing an error','media jam':'has a media jam','overload':'is showing an overload fault','short circuit':'has a short circuit','current leakage':'has a current leakage','system crash':'has crashed','QA failed':'has failed QA inspection','breaker tripped':'has tripped'}

const _joinAnd = p => !p?.length ? '' : p.length===1 ? p[0] : p.length===2 ? p[0]+' and '+p[1] : p.slice(0,-1).join(', ')+', and '+p[p.length-1]
const _cap     = s => s ? s.charAt(0).toUpperCase()+s.slice(1) : s
const _ofType  = (toks, t) => toks.filter(x => x.t === t)
const _en      = toks => toks.map(x => x.en)
const _locPrep = en => /room|restroom|canteen|cleanroom|storage|walkway|area/i.test(en) ? 'in the ' : /floor|ceiling|roof|window/i.test(en) ? 'on the ' : 'at the '
const _locStr  = locs => locs.length ? locs.map(l => _locPrep(l.en)+l.en).join(', ') : ''

function _symptomStr(syms, urgMods, isPlural = false) {
  let parts = _en(syms).map(p => _nounRewrite[p] || p);
  let urgStrs = urgMods ? _en(urgMods) : [];

  if (urgStrs.includes('severely') || urgStrs.includes('severe')) {
    let absorbed = false;
    parts = parts.map(p => {
      if (p.includes('slowly')) { absorbed = true; return p.replace('slowly', 'very slowly'); }
      if (p.includes('low ')) { absorbed = true; return p.replace('low ', 'very low '); }
      if (p === 'damaged' || p === 'cracked' || p === 'worn out' || p === 'scratched') { absorbed = true; return 'severely ' + p; }
      if (p === 'overheating') { absorbed = true; return 'overheating severely'; }
      return p;
    });
    if (absorbed) {
      urgStrs = urgStrs.filter(m => m !== 'severely' && m !== 'severe');
    }
  }

  const urgSuffix = urgStrs.length ? ' (' + urgStrs.join(', ') + ')' : '';
  const beVerb = isPlural ? 'are' : 'is';
  const haveVerb = isPlural ? 'have' : 'has';

  if (!parts.length) return urgSuffix.trim();

  if (parts.length === 1 && _nounSymptoms[parts[0]]) {
    let phrase = _nounSymptoms[parts[0]];
    if (phrase.startsWith('is ')) phrase = beVerb + ' ' + phrase.slice(3);
    else if (phrase.startsWith('has ')) phrase = haveVerb + ' ' + phrase.slice(4);
    return phrase + urgSuffix;
  }

  if (parts.every(p => _hasSymptoms.has(p))) return haveVerb + ' ' + _joinAnd(parts.map(p => _hasRewrites[p]||p)) + urgSuffix;
  
  return beVerb + ' ' + _joinAnd(parts) + urgSuffix;
}

export function assemble(tokens) {
  if (!tokens.length) return ''
  if (tokens.length===1) return _cap(tokens[0].en)+'.'
  let comps=_ofType(tokens,'C'),syms=_ofType(tokens,'S'),acts=_ofType(tokens,'A'),locs=_ofType(tokens,'L'),mods=_ofType(tokens,'M'),unks=_ofType(tokens,'U')
  const measMods=mods.filter(m=>_measureMods.has(m.en)), urgMods=mods.filter(m=>_urgencyMods.has(m.en))
  if (comps.length && comps.some(c=>_nonFluidComps.has(c.en))) syms=syms.filter(s=>!_fluidSymptoms.has(s.en))
  
  const locPart=_locStr(locs), hasUnk=unks.length>0
  const isPlural = comps.length > 1

  if (acts.length&&tokens[0].t==='A') {
    let s=_joinAnd(_en(acts)); if(comps.length) s+=' the '+_joinAnd(_en(comps)); if(locPart) s+=' '+locPart; if(syms.length) s+=' — symptom: '+_joinAnd(_en(syms)); if(urgMods.length) s+=' ('+_en(urgMods).join(', ')+')'; if(hasUnk) s+=' '+_en(unks).join(' '); return _cap(s)+'.'
  }
  if (comps.length&&tokens[0].t==='C') {
    let d='The '+_joinAnd(_en(comps)); if(locPart) d+=' '+locPart; 
    if(syms.length) d+=' '+_symptomStr(syms,urgMods,isPlural); 
    else if(urgMods.length) d+=' ('+_en(urgMods).join(', ')+')'; 
    if(hasUnk) d+=' '+_en(unks).join(' '); return _cap(d)+'.'
  }
  if (measMods.length&&tokens[0].t==='M') {
    let ms=_en(measMods).join(' '); if(comps.length) ms+=' reading of the '+_joinAnd(_en(comps)); let md=_cap(ms); if(locPart) md+=' '+locPart; 
    if(syms.length) md+= (isPlural ? ' are ' : ' is ') + _joinAnd(_en(syms)); 
    if(urgMods.length) md+=' ('+_en(urgMods).join(', ')+')'; if(hasUnk) md+=' '+_en(unks).join(' '); return md+'.'
  }
  if (urgMods.length&&tokens[0].t==='M'&&!measMods.length) {
    const urgLabel=_cap(_en(urgMods).join(', ')), rest=[]
    if(comps.length){let s='The '+_joinAnd(_en(comps)); if(locPart) s+=' '+locPart; if(syms.length) s+=' '+_symptomStr(syms,[],isPlural); rest.push(s)} else if(syms.length) rest.push(_joinAnd(_en(syms)))
    if(hasUnk) rest.push(_en(unks).join(' ')); return urgLabel+(rest.length?' — '+rest.join(' '):'')+'.';
  }
  if (syms.length&&!comps.length&&!acts.length) {
    let s=_cap(_joinAnd(_en(syms))); if(urgMods.length) s+=' ('+_en(urgMods).join(', ')+')'; if(locPart) s+=' '+locPart; if(hasUnk) s+=' '+_en(unks).join(' '); return s+'.'
  }
  return _cap(tokens.map(t=>t.en).join(' '))+'.'
}

export function dictTranslate(text) {
  if (!text) return text;
  let s = String(text).trim();

  // --- 🔥 Error Code Parser (New Feature) ---
  let errorCodeStr = '';
  // ดักจับ Error, Alarm, Err, โค้ด, เออเร่อ ที่ตามด้วยรหัส
  const errRegex = /(?:error|alarm|err|เออเร่อ|โค้ด)\s*[-_:]?\s*([a-zA-Z0-9]+)/i;
  const errMatch = s.match(errRegex);
  
  if (errMatch) {
    errorCodeStr = ` (Error Code: ${errMatch[1].toUpperCase()})`;
    // ยุบรวมประโยคให้เหลือแค่ "เออเร่อ" เพื่อให้ Tokenizer นำไปแปลตามไวยากรณ์หลักต่อ
    s = s.replace(errRegex, 'เออเร่อ');
  }

  // --- Translation Logic ---
  let result = "";
  if (_dict[s]) result = _dict[s].en;
  else if (_phrases[s]) result = _phrases[s];
  else {
    const norm = normalizeThaiText(s);
    if (_phrases[norm]) result = _phrases[norm];
    else if (_dict[norm]) result = _dict[norm].en;
    else result = assemble(tokenize(norm));
  }

  // --- Append Error Code ---
  if (errorCodeStr) {
    // นำ Error Code ไปแทรกก่อนจุด Full stop (ถ้ามี)
    if (result.endsWith('.')) {
      result = result.slice(0, -1) + errorCodeStr + '.';
    } else {
      result += errorCodeStr;
    }
  }

  return result;
}

export function hasThai(text) {
  if (!text) return false
  return /[\u0E00-\u0E7F]/.test(String(text))
}

export function resetFuzzyHits() { _fuzzyHits = 0 }
export function resetMetrics() { _metrics.fuzzyHits = 0; _metrics.unknownTokens = 0 }
