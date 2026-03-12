// ══════════════════════════════════════════════════════════════
// TAGGED MAINTENANCE DICTIONARY (FULL EDITION: UTILITY + AUTOMATION)
// t: A=Action  C=Component  S=Symptom  L=Location  M=Modifier
// sys: System Category (Optional for Analytics Dashboard)
// ══════════════════════════════════════════════════════════════
export const _dict = Object.freeze({
  // ── Symptoms (S) ──
  "ไม่ทำงาน":{en:"not working",t:"S"},"เสีย":{en:"defective",t:"S"},
  "ชำรุด":{en:"damaged",t:"S"},"พัง":{en:"breakdown",t:"S"},
  "เออเร่อ":{en:"error",t:"S"},"เอ่อเร่อ":{en:"error",t:"S"},
  "ช๊อต":{en:"short circuit",t:"S"},"ช็อต":{en:"short circuit",t:"S"},
  "ไฟรั่ว":{en:"current leakage",t:"S"},"โอเวอร์โหลด":{en:"overload",t:"S"},
  "น๊อค":{en:"system crash",t:"S"},"สวิตส์ไฟทิป":{en:"breaker tripped",t:"S"},
  "ไฟตัด":{en:"breaker tripped",t:"S"},"ไฟตก":{en:"voltage drop",t:"S"},
  "ไฟไม่เข้า":{en:"no power supply",t:"S"},"ไฟดับ":{en:"power outage",t:"S"},
  "เปิดไม่ติด":{en:"cannot power on",t:"S"},"จอดับ":{en:"blank display",t:"S"},
  "หน้าจอไม่ติด":{en:"display off",t:"S"},"ติดๆดับๆ":{en:"flickering",t:"S"},
  "ค้าง":{en:"jammed",t:"S"},"ติด":{en:"jammed",t:"S"},
  "งัด":{en:"mechanical interference",t:"S"},"หนีบ":{en:"pinched",t:"S"},
  "ฝืด":{en:"stiff",t:"S"},"แน่นเกินไป":{en:"overtightened",t:"S"},
  "แนนเกินไป":{en:"overtightened",t:"S"},"ยืด":{en:"elongated",t:"S"},
  "รูด":{en:"stripped",t:"S"},"เกลียวรูด":{en:"stripped thread",t:"S"},
  "เฟืองรูด":{en:"stripped gear",t:"S"},"ปีนร่อง":{en:"derailed",t:"S"},
  "ตกล่อง":{en:"fallen off track",t:"S"},"หลุด":{en:"disconnected",t:"S"},
  "หลวม":{en:"loose connection",t:"S"},"โยก":{en:"wobbly",t:"S"},
  "คลอน":{en:"excessive play",t:"S"},"หย่อน":{en:"slack",t:"S"},
  "ไม่ตึง":{en:"insufficient tension",t:"S"},"ตก":{en:"sagging",t:"S"},
  "ร่วง":{en:"dropped",t:"S"},"ปลิว":{en:"blown away",t:"S"},
  "ไม่ตรง":{en:"misaligned",t:"S"},"เคลื่อนไม่ตรงกัน":{en:"synchronization loss",t:"S"},
  "ศูนย์ไม่ได้":{en:"off-center",t:"S"},"เช็นเตอร์":{en:"off-center",t:"S"},
  "ไม่ตรงกลาง":{en:"off-center",t:"S"},"เอียง":{en:"tilted",t:"S"},
  "กระตุก":{en:"jerking",t:"S"},"สั่น":{en:"vibrating excessively",t:"S"},
  "มีเสียงดัง":{en:"making abnormal noise",t:"S"},"กระแทกเสียงดัง":{en:"making a loud impact noise",t:"S"},
  "หัก":{en:"snapped",t:"S"},"ขาด":{en:"torn",t:"S"},
  "แตก":{en:"cracked",t:"S"},"สึก":{en:"worn out",t:"S"},
  "เป็นรอย":{en:"scratched",t:"S"},"โก่งขึ้น":{en:"buckled",t:"S"},
  "โก่ง":{en:"bent",t:"S"},"ไม่หมุน":{en:"not rotating",t:"S"},
  "หมุนช้า":{en:"rotating slowly",t:"S"},"ไม่ได้รอบ":{en:"RPM out of spec",t:"S"},
  "หมุนๆหยุดๆ":{en:"intermittent rotation",t:"S"},"เดินๆหยุดๆ":{en:"intermittent movement",t:"S"},
  "ลดสปีดไม่อยู่":{en:"runaway speed",t:"S"},"ไปไม่สุด":{en:"stroke incomplete",t:"S"},
  "กลับไม่สุด":{en:"incomplete return stroke",t:"S"},"ไม่ดูด":{en:"loss of vacuum",t:"S"},
  "ดูดน้อย":{en:"low vacuum pressure",t:"S"},"ไม่จุ๊ฟ":{en:"vacuum pad failure",t:"S"},
  "ไม่ปล่อย":{en:"failure to release",t:"S"},"เสียบไม่เข้า":{en:"cannot insert",t:"S"},
  "ปาดโดน":{en:"rubbing",t:"S"},"ชนขอบ":{en:"collision with edge",t:"S"},
  "ปิดไม่สนิท":{en:"improper sealing",t:"S"},"เปิดยาก":{en:"hard to open",t:"S"},
  "รั่ว":{en:"leakage",t:"S"},"รั้ว":{en:"leakage",t:"S"},
  "ซึม":{en:"seepage",t:"S"},"หยด":{en:"dripping",t:"S"},
  "ล้น":{en:"overflow",t:"S"},"ไหลไม่หยุด":{en:"continuous flow",t:"S"},
  "ไม่ไหล":{en:"no flow",t:"S"},"ตัน":{en:"clogged",t:"S"},
  "ตันบ่อย":{en:"frequent clogging",t:"S"},"อั้น":{en:"flow restriction",t:"S"},
  "ไม่ฉีด":{en:"not spraying",t:"S"},"ฉีดตลอด":{en:"continuous spraying",t:"S"},
  "ฉีดบ้างไม่ฉีดบ้าง":{en:"intermittent spraying",t:"S"},"ไม่เติม":{en:"not refilling",t:"S"},
  "ไม่มีแรงดัน":{en:"zero pressure",t:"S"},"เบา":{en:"low pressure",t:"S"},
  "น้ำแข็งเกาะ":{en:"frost buildup",t:"S"},"หม้อต้มไม่ร้อน":{en:"boiler heating failure",t:"S"},
  "ไม่เดือด":{en:"not boiling",t:"S"},"ไม่ละลาย":{en:"not melting",t:"S"},
  "ร้อน":{en:"overheating",t:"S"},"เหม็นไหม้":{en:"burning odor",t:"S"},
  "กลิ่นน้ำยาแรง":{en:"strong chemical fume",t:"S"},"ไม่ได้ค่าที่กำหนด":{en:"out of specification",t:"S"},
  "ไม่ตรงที่ตั้งไว้":{en:"setpoint deviation",t:"S"},"เกินค่ากำหนด":{en:"over limit",t:"S"},
  "ต่ำ":{en:"low level",t:"S"},"ต่ำกว่าค่ากำหนด":{en:"below setpoint",t:"S"},
  "สูง":{en:"high level",t:"S"},"อุณหภูมิไม่ขึ้น":{en:"temperature failing to rise",t:"S"},
  "ไม่ลง":{en:"temperature failing to drop",t:"S"},"ไม่คงที่":{en:"unstable reading",t:"S"},
  "ขึ้น ลง":{en:"fluctuating",t:"S"},"ตัวเลขเบิ้ล":{en:"ghosting",t:"S"},
  "ไม่ผ่าน":{en:"QA failed",t:"S"},"สีไม่ออก":{en:"ink starvation",t:"S"},
  "สีแตก":{en:"ink dispersion issue",t:"S"},"สีหยด":{en:"ink dripping",t:"S"},
  "หมึกเลอะ":{en:"ink smudged",t:"S"},"เลอะ":{en:"smeared",t:"S"},
  "ดำเกินไป":{en:"over-inking",t:"S"},"เป็นเส้นดำ":{en:"black streak",t:"S"},
  "เป็นเส้นปะ":{en:"dotted line defect",t:"S"},"เทปยับย่น":{en:"tape wrinkling",t:"S"},
  "เทปย่น":{en:"tape wrinkling",t:"S"},"พับไม่สวย":{en:"poor folding",t:"S"},
  "พันไม่สวย":{en:"poor wrapping",t:"S"},"ไม่สมบูรณ์":{en:"incomplete process",t:"S"},
  "ผิดตำแหน่ง":{en:"positioning error",t:"S"},"ไม่ได้ระยะ":{en:"incorrect clearance",t:"S"},
  "สแกนไม่ได้":{en:"barcode reading failure",t:"S"},"อ่านบาร์โค๊ตข้างเดียว":{en:"single-side scan failure",t:"S"},
  "ไม่อ่านบาร์โค๊ต":{en:"barcode reader failure",t:"S"},"สัญลักษณ์ขาดหาย":{en:"missing character",t:"S"},
  "ไม่ชัด":{en:"poor print clarity",t:"S"},"กระดาษติด":{en:"media jam",t:"S"},
  "ไม่ได้ยินเสียง":{en:"no sound",t:"S"},"ไม่มีเสียงเตือน":{en:"audible alarm failure",t:"S"},
  "สกปรกมาก":{en:"heavy contamination",t:"S"},"สกปรก":{en:"contaminated",t:"S"},
  "เสื่อม":{en:"degraded",t:"S"},"หมดอายุ":{en:"service life expired",t:"S"},
  "ติดเศษ":{en:"debris obstruction",t:"S"},"แรงดันต่ำ":{en:"low supply pressure",t:"S"},
  "แรงดันสูง":{en:"high supply pressure",t:"S"},"อุดตัน":{en:"system blockage",t:"S"},
  "อ่านบาร์โค้ดข้างเดียว":{en:"single-side scan failure",t:"S"},"ไม่อ่านบาร์โค้ด":{en:"barcode reader failure",t:"S"},

  // ── Lens Quality Defect Symptoms ──
  "เลนส์เป็นรอย":{en:"lens scratched",t:"S"},"เลนส์แตก":{en:"lens cracked",t:"S"},
  "เลนส์บิ่น":{en:"lens chipped",t:"S"},"เลนส์มัว":{en:"lens haze",t:"S"},
  "เลนส์ขุ่น":{en:"lens cloudy",t:"S"},"เลนส์เป็นฝ้า":{en:"lens fogging",t:"S"},
  "เลนส์เบี้ยว":{en:"lens warped",t:"S"},"ผิวไม่เรียบ":{en:"surface roughness defect",t:"S"},
  "ผิวไม่เงา":{en:"insufficient polishing",t:"S"},"ขัดไม่ออก":{en:"polishing incomplete",t:"S"},
  "เคลือบไม่ติด":{en:"coating adhesion failure",t:"S"},"เคลือบลอก":{en:"coating peeling",t:"S"},
  "เคลือบไม่สม่ำเสมอ":{en:"uneven coating",t:"S"},"สีเพี้ยน":{en:"coating color deviation",t:"S"},
  "ฟองอากาศ":{en:"air bubble defect",t:"S"},"ฝุ่นติด":{en:"dust contamination",t:"S"},
  "คราบน้ำ":{en:"water stain",t:"S"},"ผิวส้ม":{en:"orange peel surface",t:"S"},
  "ผิวไหม้":{en:"surface burn",t:"S"},"ผิวด่าง":{en:"surface stain",t:"S"},
  "ลายขัด":{en:"polishing marks",t:"S"},"รอยขนแมว":{en:"fine scratches",t:"S"},
  "ขัดกิน":{en:"over-polishing",t:"S"},"ขัดไม่ถึง":{en:"under-polishing",t:"S"},
  "เลนส์บวม":{en:"lens swelling",t:"S"},"เลนส์บาง":{en:"lens too thin",t:"S"},
  "เลนส์หนา":{en:"lens too thick",t:"S"},"กำลังเลนส์ผิด":{en:"incorrect lens power",t:"S"},
  "ความโค้งผิด":{en:"incorrect curvature",t:"S"},"ศูนย์เลนส์เพี้ยน":{en:"lens center deviation",t:"S"},

  // ── Lens Machine Process Symptoms ──
  "ขัดไม่หมุน":{en:"polishing plate not rotating",t:"S"},"ขัดไม่สม่ำเสมอ":{en:"uneven polishing",t:"S"},
  "เลนส์หลุด":{en:"lens detached",t:"S"},"ดูดไม่ติด":{en:"vacuum holding failure",t:"S"},
  "เลนส์หมุน":{en:"lens slipping",t:"S"},"เลนส์เอียง":{en:"lens tilted",t:"S"},
  "ขัดแรงเกิน":{en:"excessive polishing force",t:"S"},"กินผิว":{en:"over grinding",t:"S"},

  // ── Electrical Fault Symptoms ──
  "ไฟเกิน":{en:"overvoltage",t:"S"},"ไฟตกบ่อย":{en:"frequent voltage drop",t:"S"},
  "ไฟไม่เสถียร":{en:"unstable power supply",t:"S"},"เฟสหาย":{en:"phase loss",t:"S"},
  "เฟสสลับ":{en:"phase sequence error",t:"S"},"ฟิวส์ขาด":{en:"blown fuse",t:"S"},
  "โอเวอร์เคอเรนท์":{en:"overcurrent fault",t:"S"},"โอเวอร์โวลต์":{en:"overvoltage fault",t:"S"},
  "ไฟกระชาก":{en:"power surge",t:"S"},"กราวด์รั่ว":{en:"ground leakage",t:"S"},
  "วงจรเปิด":{en:"open circuit",t:"S"},"ไฟไม่ครบเฟส":{en:"missing phase",t:"S"},
  "กระแสเกิน":{en:"overcurrent",t:"S"},"สัญญาณขาด":{en:"signal loss",t:"S"},
  "สัญญาณรบกวน":{en:"signal noise",t:"S"},

  // ── Motor / Drive Symptoms ──
  "มอเตอร์ร้อน":{en:"motor overheating",t:"S"},"มอเตอร์ไม่หมุน":{en:"motor not rotating",t:"S"},
  "มอเตอร์สะดุด":{en:"motor stalling",t:"S"},"สั่นแรง":{en:"vibrating severely",t:"S"},
  "ตำแหน่งเพี้ยน":{en:"position drift",t:"S"},

  // ── Process / Production Symptoms ──
  "ชิ้นงานติด":{en:"workpiece jam",t:"S"},"ชิ้นงานเอียง":{en:"workpiece misaligned",t:"S"},
  "ชิ้นงานตก":{en:"workpiece dropped",t:"S"},"งานค้าง":{en:"process stalled",t:"S"},
  "งานล้น":{en:"product overflow",t:"S"},"หยิบไม่ขึ้น":{en:"pick failure",t:"S"},
  "วางไม่ลง":{en:"place failure",t:"S"},"หยิบพลาด":{en:"mis-pick",t:"S"},
  "ขนาดผิด":{en:"dimension out of spec",t:"S"},"ตำแหน่งผิด":{en:"incorrect position",t:"S"},

  // ── Components (C) ──
  "สายพาน":{en:"conveyor belt",t:"C"},"สายพาย":{en:"conveyor belt",t:"C"},
  "สายพราน":{en:"conveyor belt",t:"C"},"โซ่":{en:"roller chain",t:"C"},
  "มอเตอร์":{en:"electric motor",t:"C"},"เฟืองมอเตอร์":{en:"motor pinion",t:"C"},
  "ลูกยาง":{en:"rubber roller",t:"C"},"ยางดำ":{en:"rubber seal",t:"C"},
  "ฟองน้ำ":{en:"sponge pad",t:"C"},"กระบอกสูบ":{en:"pneumatic actuator",t:"C"},
  "กระบอกลม":{en:"pneumatic cylinder",t:"C"},"กระบอกโช๊คลม":{en:"pneumatic shock absorber",t:"C"},
  "สเลนเดอร์":{en:"pneumatic cylinder",t:"C"},"แกน":{en:"shaft",t:"C"},
  "แกนกระทุ้ง":{en:"ejector pin",t:"C"},"กะทุ้ง":{en:"ejector",t:"C"},
  "ลูกตุ้ม":{en:"counterweight",t:"C"},"เฟือง":{en:"gear",t:"C"},
  "เกลียว":{en:"screw thread",t:"C"},"วงแหวน":{en:"retaining ring",t:"C"},
  "ใบมีด":{en:"cutting blade",t:"C"},"ใบพัดลม":{en:"fan impeller",t:"C"},
  "สปริง":{en:"tension spring",t:"C"},"สปิง":{en:"spring",t:"C"},
  "สลิง":{en:"wire rope",t:"C"},"ตะขอ":{en:"lifting hook",t:"C"},
  "ลิฟท์":{en:"material lift",t:"C"},"ล้อ":{en:"wheel",t:"C"},
  "ล้อรถเข็น":{en:"cart caster wheel",t:"C"},"ขา":{en:"support leg",t:"C"},
  "ฐาน":{en:"machine base",t:"C"},"ราง":{en:"guide rail",t:"C"},
  "ม่าน":{en:"strip curtain",t:"C"},"ฉากกัน":{en:"safety guard",t:"C"},
  "กันชน":{en:"bumper",t:"C"},"สายลม":{en:"pneumatic hose",t:"C"},
  "ท่อลม":{en:"compressed air pipe",t:"C"},"ท่อน้ำ":{en:"cooling water pipe",t:"C"},
  "สายน้ำ":{en:"water hose",t:"C"},"สายน้ำยา":{en:"chemical feed hose",t:"C"},
  "ท่อน้ำทิ้ง":{en:"drainage pipe",t:"C"},"ท่อเมน":{en:"main header line",t:"C"},
  "รูท่อระบายน้ำ":{en:"drain hole",t:"C"},"ข้อต่อ":{en:"pipe fitting",t:"C"},
  "คอปเปอร์":{en:"quick coupler",t:"C"},"วาล์ว":{en:"control valve",t:"C"},
  "วาล์วไนโตรเจน":{en:"nitrogen gas valve",t:"C"},"ปั้ม":{en:"fluid pump",t:"C"},
  "ปั๊ม":{en:"fluid pump",t:"C"},"เกจวัด":{en:"pressure gauge",t:"C"},
  "หลอดแก้ว":{en:"sight glass",t:"C"},"ซีล":{en:"mechanical seal",t:"C"},
  "โอริง":{en:"o-ring seal",t:"C"},"โฟลมิเตอร์":{en:"flow meter",t:"C"},
  "โฟเลท":{en:"flow rate sensor",t:"C"},"ท่อหุ้ม":{en:"insulation jacket",t:"C"},
  "น๊อต":{en:"bolt",t:"C"},"น็อต":{en:"bolt",t:"C"},
  "สลัก":{en:"locking pin",t:"C"},"เดือย":{en:"locating pin",t:"C"},
  "กิ๊ปเปอร์":{en:"robotic gripper",t:"C"},"ตัวจับ":{en:"workholding fixture",t:"C"},
  "ตัวหนีบ":{en:"clamping mechanism",t:"C"},"ขาหนีบ":{en:"gripper arm",t:"C"},
  "ตัวจุ๊บ":{en:"vacuum pad",t:"C"},"ชัค":{en:"spindle chuck",t:"C"},
  "สพินเดิ้ล":{en:"spindle drive",t:"C"},"เบ้าบล๊อก":{en:"block socket",t:"C"},
  "ตัวดัน":{en:"pusher cylinder",t:"C"},"แขนลาก":{en:"pulling arm",t:"C"},
  "แขนผลัก":{en:"pushing arm",t:"C"},"สเตท":{en:"working stage",t:"C"},
  "สเตจ":{en:"stage",t:"C"},"ตะแกรง":{en:"wire mesh basket",t:"C"},
  "ฟันตะแกรง":{en:"basket index teeth",t:"C"},"ถาด":{en:"process tray",t:"C"},
  "ถาดรอง":{en:"drip pan",t:"C"},"แหร็คปล่อยงาน":{en:"unloading rack",t:"C"},
  "อ่าง":{en:"chemical bath",t:"C"},"ถัง":{en:"storage tank",t:"C"},
  "หม้อต้ม":{en:"industrial boiler",t:"C"},"บอยเลอร์":{en:"boiler unit",t:"C"},
  "ตู้":{en:"equipment cabinet",t:"C"},"ตู้อบ":{en:"industrial oven",t:"C"},
  "ตู้เย็น":{en:"industrial refrigerator",t:"C"},"แอร์":{en:"HVAC unit",t:"C"},
  "ท่อแอร์":{en:"HVAC duct",t:"C"},"แผงคอยล์เย็น":{en:"evaporator coil",t:"C"},
  "ฮีตเตอร์":{en:"heating element",t:"C"},"ฉนวน":{en:"thermal insulation",t:"C"},
  "ตู้ไฟ":{en:"electrical control panel",t:"C"},"ตู้คอนโทรล":{en:"PLC control panel",t:"C"},
  "แผงวงจร":{en:"PCB",t:"C"},"เซ็นเซอร์":{en:"sensor",t:"C"},
  "แท่งเซ็นเซอร์":{en:"sensor probe",t:"C"},"สวิทช์":{en:"electrical switch",t:"C"},
  "ฟุทสวิทส์":{en:"foot pedal switch",t:"C"},"ฟุตสวิตท์":{en:"foot pedal switch",t:"C"},
  "ปุ่มกด":{en:"push button",t:"C"},"สายไฟ":{en:"power cable",t:"C"},
  "ปลั๊กไฟ":{en:"power receptacle",t:"C"},"สายกราวน์":{en:"grounding cable",t:"C"},
  "สายกราวด์":{en:"grounding cable",t:"C"},"สายแลน":{en:"ethernet cable",t:"C"},
  "หน้าจอ":{en:"HMI screen",t:"C"},"จอคอม":{en:"workstation monitor",t:"C"},
  "หลอดไฟ":{en:"luminaire",t:"C"},"บาแลม":{en:"inspection bar lamp",t:"C"},
  "แวคคั่ม":{en:"vacuum pump",t:"C"},"แอคซอส":{en:"exhaust fan",t:"C"},
  "สายวัดอุณหภูมิ":{en:"thermocouple wire",t:"C"},"แท่งวัดอุณหภูมิ":{en:"RTD probe",t:"C"},
  "ตาชั่ง":{en:"weighing scale",t:"C"},"เครื่องชั่ง":{en:"weighing scale",t:"C"},
  "เวอร์เนีย":{en:"vernier caliper",t:"C"},"แบตเตอรี่":{en:"battery backup",t:"C"},
  "ถ่าน":{en:"motor carbon brush",t:"C"},"อัลลอยด์":{en:"alloy material",t:"C"},
  "โมโนเมอร์":{en:"monomer solution",t:"C"},"เรซิน":{en:"resin compound",t:"C"},
  "แลคเกอร์":{en:"lacquer coating",t:"C"},"น้ำหล่อเย็น":{en:"coolant",t:"C"},
  "น้ำกรด":{en:"acidic solution",t:"C"},"ฟิล์มผ้าติดกระจกสุญญากาศ":{en:"vacuum window film",t:"C"},
  "ซอง":{en:"packaging pouch",t:"C"},"การ์ด":{en:"job card",t:"C"},
  "ลาเบล":{en:"product label",t:"C"},"ลิปบอน":{en:"thermal transfer ribbon",t:"C"},
  "กระดาษ":{en:"printing paper",t:"C"},"สี":{en:"industrial ink",t:"C"},
  "เลนส์":{en:"optical lens",t:"C"},"โมลด์":{en:"casting mold",t:"C"},
  "หัวฉีด":{en:"spray nozzle",t:"C"},"หัวสเปรย์":{en:"atomizing nozzle",t:"C"},
  "ฝักบัว":{en:"safety shower head",t:"C"},"หัวสี":{en:"ink dispensing head",t:"C"},
  "หัวขัด":{en:"polishing head",t:"C"},"หัวทองเหลือง":{en:"brass fitting",t:"C"},
  "โรลเลอร์":{en:"conveyor roller",t:"C"},"ถังกวน":{en:"agitator",t:"C"},
  "สติวเลอร์":{en:"magnetic stirrer",t:"C"},"สติลเลอร์":{en:"magnetic stirrer",t:"C"},
  "ฝา":{en:"tank lid",t:"C"},"กระจก":{en:"inspection glass",t:"C"},
  "ฟิวเตอร์":{en:"filter element",t:"C"},"คอม":{en:"workstation PC",t:"C"},
  "ชุดคอม":{en:"PC workstation set",t:"C"},"คีย์บอร์ด":{en:"keyboard",t:"C"},
  "ลำโพง":{en:"speaker",t:"C"},"โทรศัพท์":{en:"telephone",t:"C"},
  "โปรเจคเตอร์":{en:"projector",t:"C"},"รีโมท":{en:"remote control",t:"C"},
  "ปริ้นเตอร์":{en:"label printer",t:"C"},"ปลิ้นเตอร์":{en:"label printer",t:"C"},
  "ฝาปิด":{en:"cover plate",t:"C"},"ฝาครอบ":{en:"enclosure cover",t:"C"},
  "เครื่อง":{en:"machine",t:"C"},"เครื่องผสม":{en:"mixing machine",t:"C"},
  "เครื่องแพ็ค":{en:"packing machine",t:"C"},"เครื่องล้าง":{en:"washing machine",t:"C"},
  "เครื่องพิมพ์":{en:"printing machine",t:"C"},"เครื่องอบ":{en:"drying machine",t:"C"},

  // ── Optical Manufacturing Components ──
  "บล็อกเลนส์":{en:"lens block",t:"C"},"แม่พิมพ์เลนส์":{en:"lens mold",t:"C"},
  "แท่นขัด":{en:"polishing plate",t:"C"},"จานขัด":{en:"polishing plate",t:"C"},
  "จานเจียร":{en:"grinding plate",t:"C"},"หัวจับเลนส์":{en:"lens holder",t:"C"},
  "หัวบล็อก":{en:"blocking chuck",t:"C"},"แท่นหมุน":{en:"rotary table",t:"C"},
  "สปินเดิล":{en:"spindle",t:"C"},"จิ๊ก":{en:"alignment jig",t:"C"},
  "ฟิกซ์เจอร์":{en:"fixture",t:"C"},"แท่นวาง":{en:"work platform",t:"C"},
  "ถาดเลนส์":{en:"lens tray",t:"C"},"ตะแกรงเลนส์":{en:"lens basket",t:"C"},
  "หัวดูด":{en:"vacuum head",t:"C"},"ปั๊มสุญญากาศ":{en:"vacuum pump",t:"C"},
  "ท่อสุญญากาศ":{en:"vacuum line",t:"C"},"ผ้าขัด":{en:"polishing pad",t:"C"},
  "เพลาขัด":{en:"polishing spindle",t:"C"},"หัวจับ":{en:"chuck",t:"C"},
  "แท่นจับ":{en:"clamping stage",t:"C"},"ตัวตั้งศูนย์":{en:"alignment unit",t:"C"},
  "ชุดสุญญากาศ":{en:"vacuum system",t:"C"},"หัววัด":{en:"measurement probe",t:"C"},
  "เครื่องวัดผิว":{en:"surface profiler",t:"C"},"เครื่องวัดศูนย์":{en:"centering machine",t:"C"},
  "เครื่องเจียรเลนส์":{en:"lens grinding machine",t:"C"},"เครื่องขัดเลนส์":{en:"lens polishing machine",t:"C"},
  "เครื่องเคลือบเลนส์":{en:"lens coating machine",t:"C"},"เครื่องล้างเลนส์":{en:"lens cleaning machine",t:"C"},
  "เครื่องบล็อกเลนส์":{en:"lens blocking machine",t:"C"},"เครื่องดีบล็อก":{en:"lens deblocking machine",t:"C"},
  "เครื่องตรวจเลนส์":{en:"lens inspection machine",t:"C"},"เครื่องวัดกำลังเลนส์":{en:"lens power meter",t:"C"},
  "เครื่องวัดความโค้ง":{en:"lens curvature meter",t:"C"},"เครื่องวัดความหนา":{en:"lens thickness gauge",t:"C"},
  "ผงขัด":{en:"polishing compound",t:"C"},"น้ำยาขัด":{en:"polishing slurry",t:"C"},
  "สารเคลือบ":{en:"coating material",t:"C"},"สารเคลือบแข็ง":{en:"hard coating",t:"C"},
  "สารเคลือบกันสะท้อน":{en:"anti-reflective coating",t:"C"},"น้ำยาอัลตร้าโซนิค":{en:"ultrasonic cleaning solution",t:"C"},
  "กาวบล็อก":{en:"blocking adhesive",t:"C"},"เทปกันรอย":{en:"protective tape",t:"C"},

  // ── Mechanical Wear Parts ──
  "ลูกปืน":{en:"bearing",t:"C"},"ตลับลูกปืน":{en:"bearing housing",t:"C"},
  "แบริ่ง":{en:"bearing",t:"C"},"บูช":{en:"bushing",t:"C"},
  "ซีลน้ำมัน":{en:"oil seal",t:"C"},"ซีลยาง":{en:"rubber seal",t:"C"},
  "โอริงยาง":{en:"rubber o-ring",t:"C"},"พูลเลย์":{en:"pulley",t:"C"},
  "มู่เล่ย์":{en:"pulley",t:"C"},"โซ่สเตอร์":{en:"sprocket",t:"C"},
  "คัปปลิ้ง":{en:"shaft coupling",t:"C"},"เพลา":{en:"drive shaft",t:"C"},
  "เฟืองทด":{en:"reduction gear",t:"C"},"เกียร์บ็อก":{en:"gearbox",t:"C"},
  "เกียร์บ็อกซ์":{en:"gearbox",t:"C"},"ลูกกลิ้ง":{en:"roller",t:"C"},
  "ลูกล้อ":{en:"idler roller",t:"C"},"ยอย":{en:"coupling joint",t:"C"},
  "สลักเพลา":{en:"shaft pin",t:"C"},"สายพานไทม์มิ่ง":{en:"timing belt",t:"C"},
  "ผ้าเบรก":{en:"brake pad",t:"C"},

  // ── Automation / Electrical Components ──
  "PLC":{en:"PLC controller",t:"C"},"อินเวอร์เตอร์":{en:"variable frequency drive",t:"C"},
  "VFD":{en:"variable frequency drive",t:"C"},"เซอร์โวมอเตอร์":{en:"servo motor",t:"C"},
  "เซอร์โวไดรฟ์":{en:"servo drive",t:"C"},"รีเลย์":{en:"relay module",t:"C"},
  "แมกเนติก":{en:"magnetic contactor",t:"C"},"คอนแทคเตอร์":{en:"contactor",t:"C"},
  "คอนแทค":{en:"contactor",t:"C"},"เบรกเกอร์":{en:"circuit breaker",t:"C"},
  "ฟิวส์":{en:"fuse",t:"C"},"เทอร์มินอล":{en:"terminal block",t:"C"},
  "เพาเวอร์ซัพพลาย":{en:"power supply unit",t:"C"},"เอ็นโค้ดเดอร์":{en:"rotary encoder",t:"C"},
  "ลิมิตสวิทช์":{en:"limit switch",t:"C"},"โพร๊ก":{en:"proximity sensor",t:"C"},
  "โฟโต้":{en:"photoelectric sensor",t:"C"},"โฟโต้เซ็นเซอร์":{en:"photoelectric sensor",t:"C"},
  "โมดูล":{en:"control module",t:"C"},

  // ── Actions (A) ──
  "เปลี่ยน":{en:"replace",t:"A"},"เปลื่ยน":{en:"replace",t:"A"},
  "เปลียน":{en:"replace",t:"A"},"เปรี่ยน":{en:"replace",t:"A"},
  "ซ่อม":{en:"repair",t:"A"},"ช่อม":{en:"repair",t:"A"},
  "แก้ไข":{en:"rectify",t:"A"},"ปรับ":{en:"adjust",t:"A"},
  "ตั้งศูนย์":{en:"align",t:"A"},"คาริเบท":{en:"calibrate",t:"A"},
  "ติดตั้ง":{en:"install",t:"A"},"ทำ":{en:"fabricate",t:"A"},
  "ประกอบ":{en:"assemble",t:"A"},"เชื่อม":{en:"weld",t:"A"},
  "ถอด":{en:"dismantle",t:"A"},"เอาออก":{en:"extract",t:"A"},
  "แกะ":{en:"disassemble",t:"A"},"ย้าย":{en:"relocate",t:"A"},
  "ย้าน":{en:"relocate",t:"A"},"จัดเก็บ":{en:"organize",t:"A"},
  "ล้าง":{en:"clean",t:"A"},"ล้างท่อ":{en:"flush",t:"A"},
  "ล้างเครื่อง":{en:"wash",t:"A"},"ทำความสะอาด":{en:"clean",t:"A"},
  "เคลียฝุ่น":{en:"vacuum dust",t:"A"},"ปัด":{en:"wipe down",t:"A"},
  "อุดรู":{en:"seal off",t:"A"},"เจาะรู":{en:"drill",t:"A"},
  "ลากสาย":{en:"route cable",t:"A"},"ทาสี":{en:"repaint",t:"A"},
  "ตอก":{en:"punch mark",t:"A"},"แยก":{en:"segregate",t:"A"},
  "แปลง":{en:"retrofit",t:"A"},"ยิงจ๊อบ":{en:"scan job order",t:"A"},
  "ตรวจสอบ":{en:"inspect",t:"A"},"ตรวจเช็ค":{en:"inspect",t:"A"},
  "เช็ค":{en:"check",t:"A"},"วัดค่า":{en:"measure",t:"A"},
  "ละลายน้ำแข็ง":{en:"defrost cycle",t:"A"},"ดึง":{en:"pull",t:"A"},
  "เติม":{en:"top-up",t:"A"},"เพิ่ม":{en:"add",t:"A"},
  "เบิก":{en:"spare part requisition",t:"A"},"เบิกของ":{en:"material withdrawal",t:"A"},
  "สั่ง":{en:"issue PO",t:"A"},"สลับ":{en:"swap",t:"A"},
  "ต่อตรง":{en:"bypass",t:"A"},"บายพาส":{en:"bypass",t:"A"},
  "หุ้มฉนวน":{en:"apply insulation",t:"A"},"ขัด":{en:"polish",t:"A"},
  "เจียร":{en:"grind",t:"A"},"บล็อก":{en:"block lens",t:"A"},
  "ดีบล็อก":{en:"deblock lens",t:"A"},"เคลือบ":{en:"apply coating",t:"A"},
  "ตั้งแรงดูด":{en:"adjust vacuum pressure",t:"A"},"ตั้งแรงกด":{en:"adjust polishing force",t:"A"},
  "ตั้งความเร็ว":{en:"adjust rotation speed",t:"A"},"เปลี่ยนผงขัด":{en:"replace polishing compound",t:"A"},
  "เติมน้ำยาขัด":{en:"add polishing slurry",t:"A"},"รีเซ็ต":{en:"reset",t:"A"},
  "รีสตาร์ท":{en:"restart",t:"A"},"รีบูต":{en:"reboot",t:"A"},
  "ขัน":{en:"tighten",t:"A"},"คลาย":{en:"loosen",t:"A"},
  "อัดจารบี":{en:"apply grease",t:"A"},"หล่อลื่น":{en:"lubricate",t:"A"},
  "ตั้งค่า":{en:"configure",t:"A"},"โปรแกรม":{en:"program",t:"A"},
  "ตั้งโปรแกรม":{en:"program",t:"A"},"โหลดโปรแกรม":{en:"upload program",t:"A"},
  "ดาวน์โหลดโปรแกรม":{en:"download program",t:"A"},"ทดสอบ":{en:"test",t:"A"},
  "รีเซ็ตเออเร่อ":{en:"reset fault",t:"A"},"เดินเครื่อง":{en:"run test",t:"A"},
  "ทดลอง":{en:"trial run",t:"A"},

  // ── Locations (L) ──
  "ห้องคลีนรูม":{en:"cleanroom",t:"L"},"ห้องผสม":{en:"formulation room",t:"L"},
  "ห้องโมโนเมอร์":{en:"monomer preparation room",t:"L"},"ห้องแยกงาน":{en:"sorting area",t:"L"},
  "ห้องน้ำ":{en:"restroom",t:"L"},"ห้องเก็บก๊าช":{en:"gas cylinder storage",t:"L"},
  "ห้องเก็บก๊าซ":{en:"gas cylinder storage",t:"L"},"ห้องประชุม":{en:"conference room",t:"L"},
  "โรงอาหาร":{en:"factory canteen",t:"L"},"เพดาน":{en:"ceiling",t:"L"},
  "ฝ้าเพดาน":{en:"drop ceiling",t:"L"},"ฝ้า":{en:"drop ceiling",t:"L"},
  "หลังคา":{en:"factory roof",t:"L"},"หน้าต่าง":{en:"facility window",t:"L"},
  "พื้น":{en:"shop floor",t:"L"},"ทางเดิน":{en:"walkway",t:"L"},
  "ด้านเว้า":{en:"concave side",t:"L"},"ด้านนูน":{en:"convex side",t:"L"},
  "ข้าง":{en:"lateral side",t:"L"},"ข้างหลัง":{en:"rear side",t:"L"},
  "ใต้เครื่อง":{en:"underneath machine base",t:"L"},"หน้าเครื่อง":{en:"machine front",t:"L"},
  "หลังเครื่อง":{en:"machine rear",t:"L"},"ซ้าย":{en:"left side",t:"L"},
  "ขวา":{en:"right side",t:"L"},"สเต๊ปแรก":{en:"initial process step",t:"L"},
  "สเต๊ปสุดท้าย":{en:"final process step",t:"L"},

  // ── Modifiers (M) ──
  "อุณหภูมิ":{en:"temperature",t:"M"},"ความชื้น":{en:"relative humidity",t:"M"},
  "แรงดัน":{en:"system pressure",t:"M"},"ศูนย์":{en:"center alignment",t:"M"},
  "ระยะ":{en:"clearance",t:"M"},"ระดับน้ำ":{en:"fluid level",t:"M"},
  "ค่าน้ำ":{en:"water content",t:"M"},"มาก":{en:"severely",t:"M"},
  "หนัก":{en:"severe",t:"M"},"เล็กน้อย":{en:"slightly",t:"M"},
  "นิดหน่อย":{en:"minor",t:"M"},"ปานกลาง":{en:"moderate",t:"M"},
  "ด่วน":{en:"urgent",t:"M"},"เร่งด่วน":{en:"urgent",t:"M"},
  "บ่อย":{en:"frequently",t:"M"},"ตลอด":{en:"continuously",t:"M"},
  "บางครั้ง":{en:"occasionally",t:"M"},"เป็นพักๆ":{en:"intermittently",t:"M"},
  "ทันที":{en:"immediately",t:"M"},

  // =======================================================================
  // 🏭 UTILITIES & FACILITY SYSTEMS
  // =======================================================================
  
  // 💨 1. Compressed Air System
  "สกรู":{en:"air end",t:"C",sys:"Air Compressor"},"หัวสกรู":{en:"air end",t:"C",sys:"Air Compressor"},
  "ออโต้เดรน":{en:"auto drain valve",t:"C",sys:"Air Compressor"},"ตัวเดรนน้ำ":{en:"auto drain valve",t:"C",sys:"Air Compressor"},
  "เซปปะเรเตอร์":{en:"oil separator",t:"C",sys:"Air Compressor"},"กรองน้ำมัน":{en:"oil filter",t:"C",sys:"Air Compressor"},
  "วาล์วไอดี":{en:"inlet valve",t:"C",sys:"Air Compressor"},"อันโหลดเดอร์":{en:"unloader valve",t:"C",sys:"Air Compressor"},
  "ลมไม่ตัด":{en:"continuous loading",t:"S",sys:"Air Compressor"},"โหลดตลอด":{en:"continuous loading",t:"S",sys:"Air Compressor"},
  "อุณหภูมิปลายทางสูง":{en:"high discharge temperature",t:"S",sys:"Air Compressor"},"ร้อนจัด":{en:"high temperature",t:"S",sys:"Air Compressor"},
  "น้ำมันหาย":{en:"oil carryover",t:"S",sys:"Air Compressor"},"น้ำมันปนไปกับลม":{en:"oil carryover",t:"S",sys:"Air Compressor"},
  "ลมมีน้ำ":{en:"moisture in compressed air",t:"S",sys:"Air Compressor"},"น้ำเกาะท่อ":{en:"moisture in pipe",t:"S",sys:"Air Compressor"},
  "ลมตก":{en:"pressure drop",t:"S",sys:"Air Compressor"},"เพรสเชอร์ตก":{en:"pressure drop",t:"S",sys:"Air Compressor"},
  "ถ่ายน้ำมันเครื่อง":{en:"change compressor oil",t:"A",sys:"Air Compressor"},"เปลี่ยนกรองดักน้ำ":{en:"replace moisture separator",t:"A",sys:"Air Compressor"},

  // ❄️ 2. Chilled Water & HVAC System
  "อีแวป":{en:"evaporator",t:"C",sys:"Chiller"},"คูลเลอร์":{en:"cooler",t:"C",sys:"Chiller"},
  "คอนเดนเซอร์":{en:"condenser",t:"C",sys:"Chiller"},"รังผึ้งร้อน":{en:"condenser coil",t:"C",sys:"Chiller"},
  "เอ็กซ์แพนชั่น":{en:"expansion valve",t:"C",sys:"Chiller"},"วาล์วฉีดน้ำยา":{en:"expansion valve",t:"C",sys:"Chiller"},
  "คูลลิ่งทาวเวอร์":{en:"cooling tower",t:"C",sys:"Chiller"},"หอหล่อเย็น":{en:"cooling tower",t:"C",sys:"Chiller"},
  "ไฮเพรสเชอร์":{en:"high condenser pressure",t:"S",sys:"Chiller"},"แรงดันไฮสูง":{en:"high condenser pressure",t:"S",sys:"Chiller"},
  "โลว์เพรสเชอร์":{en:"low evaporator pressure",t:"S",sys:"Chiller"},"แรงดันโลว์ต่ำ":{en:"low evaporator pressure",t:"S",sys:"Chiller"},
  "ตะกรันเกาะ":{en:"scaling",t:"S",sys:"Chiller"},"ตะกรันหนา":{en:"heavy scaling",t:"S",sys:"Chiller"},
  "น้ำยาขาด":{en:"low refrigerant",t:"S",sys:"Chiller"},"น้ำยารั่ว":{en:"refrigerant leak",t:"S",sys:"Chiller"},
  "แอร์ไม่ฉ่ำ":{en:"low cooling capacity",t:"S",sys:"Chiller"},"ล้างทิ้ว":{en:"tube cleaning",t:"A",sys:"Chiller"},
  "แยงทิ้ว":{en:"tube punching",t:"A",sys:"Chiller"},"เติมน้ำยาแอร์":{en:"top-up refrigerant",t:"A",sys:"Chiller"},

  // 🕳️ 3. Vacuum System
  "เวรน":{en:"rotary vane",t:"C",sys:"Vacuum Pump"},"ใบพัดคาร์บอน":{en:"carbon vane",t:"C",sys:"Vacuum Pump"},
  "กรองไอเสีย":{en:"exhaust filter",t:"C",sys:"Vacuum Pump"},"กรองฝุ่น":{en:"inlet filter",t:"C",sys:"Vacuum Pump"},
  "ออยซิล":{en:"oil seal",t:"C",sys:"Vacuum Pump"},"ซีลคอเพลา":{en:"shaft seal",t:"C",sys:"Vacuum Pump"},
  "แวคไม่ลง":{en:"low vacuum",t:"S",sys:"Vacuum Pump"},"ดูดไม่ขึ้น":{en:"cannot reach target vacuum",t:"S",sys:"Vacuum Pump"},
  "ควันขาว":{en:"white smoke exhaust",t:"S",sys:"Vacuum Pump"},"น้ำมันพ่น":{en:"oil mist exhaust",t:"S",sys:"Vacuum Pump"},
  "โอเวอร์ฮีต":{en:"overheating",t:"S",sys:"Vacuum Pump"},"เปลี่ยนแผ่นเวรน":{en:"replace carbon vanes",t:"A",sys:"Vacuum Pump"},
  "ล้างไส้กรอง":{en:"clean filter",t:"A",sys:"Vacuum Pump"},

  // ♨️ 4. Steam & Boiler System
  "สตีมแทรป":{en:"steam trap",t:"C",sys:"Boiler"},"กับดักไอน้ำ":{en:"steam trap",t:"C",sys:"Boiler"},
  "เบิร์นเนอร์":{en:"burner",t:"C",sys:"Boiler"},"หัวเผา":{en:"burner",t:"C",sys:"Boiler"},
  "เซฟตี้วาล์ว":{en:"safety relief valve",t:"C",sys:"Boiler"},"วาล์วระบาย":{en:"relief valve",t:"C",sys:"Boiler"},
  "ฮีตเอ็กเชนเจอร์":{en:"heat exchanger",t:"C",sys:"Boiler"},"ตัวแลกเปลี่ยน":{en:"heat exchanger",t:"C",sys:"Boiler"},
  "จุดไม่ติด":{en:"ignition failure",t:"S",sys:"Boiler"},"หัวเผาเฟล":{en:"burner failure",t:"S",sys:"Boiler"},
  "สตีมไม่พอ":{en:"low steam pressure",t:"S",sys:"Boiler"},"สตีมรั่ว":{en:"steam leakage",t:"S",sys:"Boiler"},
  "ไอน้ำออก":{en:"steam leakage",t:"S",sys:"Boiler"},"น้ำแห้ง":{en:"dry boiler",t:"S",sys:"Boiler"},
  "ระดับน้ำโลว์":{en:"low water level",t:"S",sys:"Boiler"},"โบลว์ดาวน์":{en:"bottom blowdown",t:"A",sys:"Boiler"},
  "เดรนน้ำทิ้ง":{en:"drain water",t:"A",sys:"Boiler"},

  // 💧 5. Water Treatment System
  "เมมเบรน":{en:"RO membrane",t:"C",sys:"Water Treatment"},"ไส้กรอง RO":{en:"RO membrane",t:"C",sys:"Water Treatment"},
  "ปั๊มโดส":{en:"chemical dosing pump",t:"C",sys:"Water Treatment"},"ปั๊มเติมเคมี":{en:"chemical dosing pump",t:"C",sys:"Water Treatment"},
  "เรซิ่น":{en:"ion exchange resin",t:"C",sys:"Water Treatment"},"สารกรอง":{en:"filter media",t:"C",sys:"Water Treatment"},
  "ค่าน้ำเกิน":{en:"high conductivity",t:"S",sys:"Water Treatment"},"คอนดักเกิน":{en:"high conductivity",t:"S",sys:"Water Treatment"},
  "เพรสเชอร์ดิฟ":{en:"high differential pressure",t:"S",sys:"Water Treatment"},"ดิฟสูง":{en:"high differential pressure",t:"S",sys:"Water Treatment"},
  "แบ็ควอช":{en:"backwash",t:"A",sys:"Water Treatment"},"ล้างย้อน":{en:"backwash",t:"A",sys:"Water Treatment"},
  "เติมเกลือ":{en:"add salt",t:"A",sys:"Water Treatment"},"ฟื้นฟูเรซิ่น":{en:"resin regeneration",t:"A",sys:"Water Treatment"},

  // ⚡ 6. Electrical & Power System
  "คาปา":{en:"capacitor bank",t:"C",sys:"Power System"},"แคปแบงค์":{en:"capacitor bank",t:"C",sys:"Power System"},
  "เบรกเกอร์เมน":{en:"main breaker",t:"C",sys:"Power System"},"เอ็มซีบี":{en:"main breaker",t:"C",sys:"Power System"},
  "ทริป":{en:"breaker tripped",t:"S",sys:"Power System"},"เด้ง":{en:"breaker tripped",t:"S",sys:"Power System"},
  "พีเอฟตก":{en:"low power factor",t:"S",sys:"Power System"},"ค่าไฟเกิน":{en:"high power consumption",t:"S",sys:"Power System"},
  "ขั้วหลวม":{en:"loose connection",t:"S",sys:"Power System"},"รอยไหม้":{en:"burn mark",t:"S",sys:"Power System"},
  "ขันเทอร์มินอล":{en:"retighten terminal",t:"A",sys:"Power System"},"ย้ำหางปลา":{en:"re-crimp terminal",t:"A",sys:"Power System"},
  "ส่องกล้องความร้อน":{en:"thermoscan inspection",t:"A",sys:"Power System"},

  // =======================================================================
  // 🤖 END OF LINE & AUTOMATION SYSTEMS
  // =======================================================================

  // 📦 7. Auto Packing System
  "ตัวดูดซอง":{en:"envelope vacuum picker",t:"C",sys:"Auto Packing"},"แมกกาซีนซอง":{en:"envelope magazine",t:"C",sys:"Auto Packing"},
  "ตัวเปิดซอง":{en:"envelope opener",t:"C",sys:"Auto Packing"},"ตัวดันเลนส์":{en:"lens pusher",t:"C",sys:"Auto Packing"},
  "ฮีตเตอร์ซีล":{en:"sealing heater",t:"C",sys:"Auto Packing"},"ตัวซีลปากซอง":{en:"sealer jaw",t:"C",sys:"Auto Packing"},
  "ตัวพิมพ์วันที่":{en:"date coder",t:"C",sys:"Auto Packing"},"ซองติด":{en:"envelope jam",t:"S",sys:"Auto Packing"},
  "ดูดซองไม่ขึ้น":{en:"failed to pick envelope",t:"S",sys:"Auto Packing"},"ดูดซองซ้อน":{en:"double envelope pick",t:"S",sys:"Auto Packing"},
  "เปิดซองไม่ออก":{en:"failed to open envelope",t:"S",sys:"Auto Packing"},"ใส่เลนส์ไม่เข้า":{en:"failed to insert lens",t:"S",sys:"Auto Packing"},
  "ซีลไม่สนิท":{en:"incomplete seal",t:"S",sys:"Auto Packing"},"ซีลรั่ว":{en:"leaking seal",t:"S",sys:"Auto Packing"},
  "ซีลไหม้":{en:"burnt seal",t:"S",sys:"Auto Packing"},"ซองยับ":{en:"wrinkled envelope",t:"S",sys:"Auto Packing"},
  "เติมซอง":{en:"replenish envelopes",t:"A",sys:"Auto Packing"},"ตั้งความร้อนซีล":{en:"adjust sealing temperature",t:"A",sys:"Auto Packing"},

  // 🛣️ 8. Conveyor System
  "สต็อปเปอร์":{en:"stopper cylinder",t:"C",sys:"Conveyor System"},"ตัวปัดงาน":{en:"rejector mechanism",t:"C",sys:"Conveyor System"},
  "ตัวคัดแยก":{en:"diverter",t:"C",sys:"Conveyor System"},"ไกด์ประคอง":{en:"guide rail",t:"C",sys:"Conveyor System"},
  "สายพานลื่น":{en:"belt slipping",t:"S",sys:"Conveyor System"},"สายพานส่าย":{en:"belt wandering",t:"S",sys:"Conveyor System"},
  "สายพานปีนขอบ":{en:"belt tracking issue",t:"S",sys:"Conveyor System"},"สายพานขาด":{en:"broken belt",t:"S",sys:"Conveyor System"},
  "ชิ้นงานชนกัน":{en:"parts colliding",t:"S",sys:"Conveyor System"},"สต็อปเปอร์ค้าง":{en:"stopper jammed",t:"S",sys:"Conveyor System"},
  "ตั้งความตึงสายพาน":{en:"tension belt",t:"A",sys:"Conveyor System"},"ตั้งศูนย์สายพาน":{en:"align belt tracking",t:"A",sys:"Conveyor System"},

  // ⚡ 9. Laser Marking Machine
  "หัวเลเซอร์":{en:"laser head",t:"C",sys:"Laser Marking"},"เลนส์โฟกัส":{en:"f-theta focus lens",t:"C",sys:"Laser Marking"},
  "ซอร์สเลเซอร์":{en:"laser source",t:"C",sys:"Laser Marking"},"เครื่องดูดควัน":{en:"fume extractor",t:"C",sys:"Laser Marking"},
  "เลเซอร์ไม่ยิง":{en:"laser not firing",t:"S",sys:"Laser Marking"},"มาร์คไม่ชัด":{en:"faint marking",t:"S",sys:"Laser Marking"},
  "ยิงไม่เข้า":{en:"insufficient marking depth",t:"S",sys:"Laser Marking"},"ตัวอักษรเบี้ยว":{en:"distorted characters",t:"S",sys:"Laser Marking"},
  "ตัวอักษรขาด":{en:"incomplete marking",t:"S",sys:"Laser Marking"},"รอยยิงไหม้":{en:"burnt mark",t:"S",sys:"Laser Marking"},
  "ยิงตกขอบ":{en:"marking out of bound",t:"S",sys:"Laser Marking"},"โฟกัสเพี้ยน":{en:"out of focus",t:"S",sys:"Laser Marking"},
  "ควันเยอะ":{en:"excessive fume",t:"S",sys:"Laser Marking"},"ปรับโฟกัสเลเซอร์":{en:"adjust laser focus",t:"A",sys:"Laser Marking"},
  "ทำความสะอาดเลนส์โฟกัส":{en:"clean focus lens",t:"A",sys:"Laser Marking"},

  // 👁️ 10. Vision Inspection System (AOI)
  "กล้องวิชั่น":{en:"vision camera",t:"C",sys:"Vision Inspection"},"เลนส์กล้อง":{en:"camera lens",t:"C",sys:"Vision Inspection"},
  "ไฟริงไลท์":{en:"ring light illumination",t:"C",sys:"Vision Inspection"},"ชุดส่องสว่าง":{en:"illumination unit",t:"C",sys:"Vision Inspection"},
  "ฉากหลัง":{en:"backlight",t:"C",sys:"Vision Inspection"},"ตัวประมวลผลภาพ":{en:"vision controller",t:"C",sys:"Vision Inspection"},
  "จับภาพไม่ได้":{en:"image capture failure",t:"S",sys:"Vision Inspection"},"กล้องค้าง":{en:"camera frozen",t:"S",sys:"Vision Inspection"},
  "ภาพเบลอ":{en:"blurred image",t:"S",sys:"Vision Inspection"},"แสงไม่พอ":{en:"insufficient illumination",t:"S",sys:"Vision Inspection"},
  "แสงจ้าไป":{en:"overexposure",t:"S",sys:"Vision Inspection"},"แสงสะท้อน":{en:"glare reflection issue",t:"S",sys:"Vision Inspection"},
  "ดีดงานทิ้งผิด":{en:"false reject",t:"S",sys:"Vision Inspection"},"ปล่อยงานเสียผ่าน":{en:"false acceptance",t:"S",sys:"Vision Inspection"},
  "คาลิเบรทกล้อง":{en:"calibrate camera",t:"A",sys:"Vision Inspection"},"สอนภาพใหม่":{en:"re-train vision model",t:"A",sys:"Vision Inspection"},
  "ปรับแสงกล้อง":{en:"adjust illumination",t:"A",sys:"Vision Inspection"}
})

// ── Phrase priority table (checked before tokenize) ──
export const _phrases = Object.freeze({
  'สายพานหลุด': 'The conveyor belt has come off.',
  'มอเตอร์ไม่หมุน': 'The electric motor is not rotating.',
  'ปั๊มน้ำไม่ไหล': 'The fluid pump has no water flow.',
  'เซ็นเซอร์เออเร่อ': 'The sensor is showing an error.',
  'หม้อต้มไม่ร้อน': 'The industrial boiler is not heating.',
  'หน้าจอค้าง': 'The HMI screen is unresponsive.',
  'PLCค้าง': 'The PLC is frozen.',
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

const _normRules = [
  [/เปลื่ยน|เปลียน|เปรี่ยน|เปลื่ยน/g, 'เปลี่ยน'],
  [/ช่อม/g, 'ซ่อม'], [/ย้าน/g, 'ย้าย'], [/ตรวจเช็ค/g, 'ตรวจสอบ'],
  [/เคลียฝุ่น|เคลียร์ฝุ่น/g, 'ทำความสะอาด'],
  [/สายพาย|สายพราน/g, 'สายพาน'], [/สายกราวน์/g, 'สายกราวด์'],
  [/ปลิ้นเตอร์/g, 'ปริ้นเตอร์'], [/ตระแกรง/g, 'ตะแกรง'],
  [/โฟเลท/g, 'โฟลมิเตอร์'], [/สเลนเดอร์/g, 'กระบอกลม'],
  [/ฟุตสวิตท์|ฟุ๊ตสวิทช์/g, 'ฟุทสวิทส์'],
  [/น๊อต/g, 'น็อต'],
  [/เซนเซอร์/g, 'เซ็นเซอร์'],
  [/มอเตอ(?=[^ร]|$)/g, 'มอเตอร์'],
  [/ปั้ม/g, 'ปั๊ม'],
  [/วาล(?=[^ว์]|$)/g, 'วาล์ว'],
  [/แวคคัม/g, 'แวคคั่ม'],
  [/เซนเซอร์|เซ็นเซอ(?=[^ร]|$)/g, 'เซ็นเซอร์'],
  [/สวิทซ์|สวิตช์|สวิทส์/g, 'สวิทช์'],
  [/เอ่อเร่อ|เอเร่อ/g, 'เออเร่อ'], [/แนนเกินไป/g, 'แน่นเกินไป'],
  [/ตันบ่อย/g, 'ตัน'],
  [/อ่านบาร์โค๊ต|อ่านบาร์โค้ต|อ่านบาร์โคด/g, 'ไม่อ่านบาร์โค้ด'],
  [/บาร์โค๊ตข้างเดียว|บาร์โค้ตข้างเดียว/g, 'อ่านบาร์โค้ดข้างเดียว'],
  [/ใม่/g, 'ไม่'],
  [/มู่เล่ย์/g, 'พูลเลย์'],
  [/เบรคเกอร์/g, 'เบรกเกอร์'],
  [/อินเวอร์เตอ(?=[^ร]|$)/g, 'อินเวอร์เตอร์'],
  [/เซอร์โวมอเตอ(?=[^ร]|$)/g, 'เซอร์โวมอเตอร์'],
  [/เลเซอ(?=[^ร]|$)/g, 'เลเซอร์'],
  [/วิชัน|วิชั่น/g, 'วิชั่น'],
  [/แพคกิ้ง|แพ๊คกิ้ง/g, 'แพ็คกิ้ง'],
  [/คอนเวเยอ(?=[^ร]|$)|คอนเวนเยอร์/g, 'คอนเวเยอร์'],
  [/คาลิเบรต|แคลลิเบรท/g, 'คาลิเบรท'],
  [/([\u0E00-\u0E7F])\1{2,}/g, '$1$1'],
  [/\s+/g, ' '],
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
  if (!text) return text
  const s = String(text).trim()
  if (_dict[s]) return _dict[s].en
  if (_phrases[s]) return _phrases[s]   
  const norm = normalizeThaiText(s)
  if (_phrases[norm]) return _phrases[norm]   
  if (_dict[norm]) return _dict[norm].en
  return assemble(tokenize(norm))
}

export function hasThai(text) {
  if (!text) return false
  return /[\u0E00-\u0E7F]/.test(String(text))
}

export function resetFuzzyHits() { _fuzzyHits = 0 }
export function resetMetrics() { _metrics.fuzzyHits = 0; _metrics.unknownTokens = 0 }
