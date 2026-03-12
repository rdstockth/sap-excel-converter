// ══════════════════════════════════════════════════════════════
// TAGGED MAINTENANCE DICTIONARY
// t: A=Action  C=Component  S=Symptom  L=Location  M=Modifier
// ══════════════════════════════════════════════════════════════
export const _dict = {
  // ── Symptoms (S) ──
  "ไม่ทำงาน":{en:"not working",t:"S"},"เสีย":{en:"defective",t:"S"},
  "ชำรุด":{en:"damaged",t:"S"},"พัง":{en:"breakdown",t:"S"},
  "เออเร่อ":{en:"error",t:"S"},"เอ่อเร่อ":{en:"error",t:"S"},
  "ช๊อต":{en:"short circuit",t:"S"},"ช็อต":{en:"short circuit",t:"S"},
  "ไฟรั่ว":{en:"current leakage",t:"S"},"โอเวอร์โหลด":{en:"overload",t:"S"},
  "น๊อค":{en:"system crash",t:"S"},"สวิตส์ไฟทิป":{en:"breaker tripped",t:"S"},
  "ไฟตัด":{en:"breaker tripped",t:"S"},"ไฟตก":{en:"voltage drop",t:"S"},
  "ไฟไม่เข้า":{en:"no power supply",t:"S"},"ไฟดับ":{en:"power outage",t:"S"},
  "เปิดไม่ติด":{en:"cannot power on",t:"S"},"จอดับ":{en:"display blank",t:"S"},
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
  "กระตุก":{en:"jerking",t:"S"},"สั่น":{en:"excessive vibration",t:"S"},
  "มีเสียงดัง":{en:"abnormal noise",t:"S"},"กระแทกเสียงดัง":{en:"loud impact noise",t:"S"},
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
  "ไม่ได้ยินเสียง":{en:"audio failure",t:"S"},"สกปรกมาก":{en:"heavy contamination",t:"S"},
  "สกปรก":{en:"contaminated",t:"S"},"เสื่อม":{en:"degraded",t:"S"},
  "หมดอายุ":{en:"service life expired",t:"S"},"ติดเศษ":{en:"debris obstruction",t:"S"},
  "แรงดันต่ำ":{en:"low supply pressure",t:"S"},"แรงดันสูง":{en:"high supply pressure",t:"S"},
  "อุดตัน":{en:"system blockage",t:"S"},"อ่านบาร์โค้ดข้างเดียว":{en:"single-side scan failure",t:"S"},
  "ไม่อ่านบาร์โค้ด":{en:"barcode reader failure",t:"S"},
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
  "โรลเลอร์":{en:"conveyor roller",t:"C"},"สติวเลอร์":{en:"magnetic stirrer",t:"C"},
  "สติลเลอร์":{en:"stirrer",t:"C"},"ฝา":{en:"tank lid",t:"C"},
  "กระจก":{en:"inspection glass",t:"C"},"ฟิวเตอร์":{en:"filter element",t:"C"},
  "คอม":{en:"workstation PC",t:"C"},"ชุดคอม":{en:"PC workstation set",t:"C"},
  "คีย์บอร์ด":{en:"keyboard",t:"C"},"ลำโพง":{en:"speaker",t:"C"},
  "โทรศัพท์":{en:"telephone",t:"C"},"โปรเจคเตอร์":{en:"projector",t:"C"},
  "รีโมท":{en:"remote control",t:"C"},"ปริ้นเตอร์":{en:"label printer",t:"C"},
  "ปลิ้นเตอร์":{en:"label printer",t:"C"},"ฝาปิด":{en:"cover plate",t:"C"},
  "ฝาครอบ":{en:"enclosure cover",t:"C"},"เครื่อง":{en:"machine",t:"C"},
  "เครื่องผสม":{en:"mixing machine",t:"C"},"เครื่องแพ็ค":{en:"packing machine",t:"C"},
  "เครื่องล้าง":{en:"washing machine",t:"C"},"เครื่องพิมพ์":{en:"printing machine",t:"C"},
  "เครื่องอบ":{en:"drying machine",t:"C"},
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
  "ทำความสะอาด":{en:"clean",t:"A"},"ล้าง":{en:"flush",t:"A"},
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
  "สั่ง":{en:"issue PO",t:"A"},"สลับ":{en:"bypass",t:"A"},
  "หุ้มฉนวน":{en:"apply insulation",t:"A"},
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
  "ทันที":{en:"immediately",t:"M"}
}

// ── Thai Normalizer rules ──
const _normRules = [
  [/เปลื่ยน|เปลียน|เปรี่ยน|เปลื่ยน/g, 'เปลี่ยน'],
  [/ช่อม/g, 'ซ่อม'], [/ย้าน/g, 'ย้าย'], [/ตรวจเช็ค/g, 'ตรวจสอบ'],
  [/เคลียฝุ่น|เคลียร์ฝุ่น/g, 'ทำความสะอาด'],
  [/สายพาย|สายพราน/g, 'สายพาน'], [/สายกราวน์/g, 'สายกราวด์'],
  [/ปลิ้นเตอร์/g, 'ปริ้นเตอร์'], [/ตระแกรง/g, 'ตะแกรง'],
  [/โฟเลท/g, 'โฟลมิเตอร์'], [/สเลนเดอร์/g, 'กระบอกลม'],
  [/ฟุตสวิตท์|ฟุ๊ตสวิทช์/g, 'ฟุทสวิทส์'],
  [/น๊อค/g, 'น็อต'], [/น๊อต/g, 'น็อต'],
  [/มอเตอ(?=[^ร]|$)/g, 'มอเตอร์'],
  [/เซนเซอร์|เซ็นเซอ(?=[^ร]|$)/g, 'เซ็นเซอร์'],
  [/สวิทซ์|สวิตช์|สวิทส์/g, 'สวิทช์'],
  [/เอ่อเร่อ|เอเร่อ/g, 'เออเร่อ'], [/แนนเกินไป/g, 'แน่นเกินไป'],
  [/ตันบ่อย/g, 'ตัน'],
  [/อ่านบาร์โค๊ต|อ่านบาร์โค้ต|อ่านบาร์โคด/g, 'ไม่อ่านบาร์โค้ด'],
  [/บาร์โค๊ตข้างเดียว|บาร์โค้ตข้างเดียว/g, 'อ่านบาร์โค้ดข้างเดียว'],
  [/ใม่/g, 'ไม่'],
  [/([\u0E00-\u0E7F])\1{2,}/g, '$1$1'],
  [/\s+/g, ' '],
]
const _normCache = {}
export function normalizeThaiText(text) {
  if (!text) return text
  const s = String(text).trim()
  if (_normCache[s] !== undefined) return _normCache[s]
  let out = s
  for (const [rx, rep] of _normRules) out = out.replace(rx, rep)
  _normCache[s] = out.trim()
  return _normCache[s]
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

let _dictKeys = null
function getDictKeys() {
  if (_dictKeys) return _dictKeys
  _dictKeys = Object.keys(_dict).sort((a, b) => b.length - a.length)
  return _dictKeys
}

const _fuzzyCache = {}
export let _fuzzyHits = 0
function fuzzyLookup(word, threshold = 0.80) {
  if (!word || word.length < 2) return null
  if (_fuzzyCache[word] !== undefined) return _fuzzyCache[word]
  const keys = getDictKeys(), wChars = Array.from(word), wLen = wChars.length
  let best = null, bestSim = threshold - 0.001
  for (const k of keys) {
    const kLen = Array.from(k).length
    if (Math.min(wLen, kLen) / Math.max(wLen, kLen) < threshold) continue
    const dist = levenshtein(word, k)
    const sim = 1 - dist / Math.max(wLen, kLen)
    if (sim > bestSim) { bestSim = sim; best = { en: _dict[k].en, t: _dict[k].t, key: k, sim } }
  }
  _fuzzyCache[word] = best
  if (best) _fuzzyHits++
  return best
}

export function tokenize(text) {
  const result = [], keys = getDictKeys()
  let s = String(text).trim()
  while (s.length) {
    const sp = s.match(/^\s+/)
    if (sp) { s = s.slice(sp[0].length); continue }
    let found = false
    for (const k of keys) {
      if (s.slice(0, k.length) === k) {
        result.push({ en: _dict[k].en, t: _dict[k].t, raw: k }); s = s.slice(k.length); found = true; break
      }
    }
    if (!found) {
      let end = 1
      while (end < s.length) {
        if (keys.some(k => s.slice(end, end + k.length) === k)) break
        end++
      }
      const unk = s.slice(0, end).trim()
      if (unk) {
        const fm = fuzzyLookup(unk)
        if (fm) { result.push({ en: fm.en, t: fm.t, raw: unk, fuzzy: true }) }
        else {
          if (result.length && result[result.length-1].t === 'U') { result[result.length-1].en += ' '+unk; result[result.length-1].raw += unk }
          else result.push({ en: unk, t: 'U', raw: unk })
        }
      }
      s = s.slice(end)
    }
  }
  return result
}

// Grammar assembler
const _nonFluidComps = new Set(['conveyor belt','roller chain','cutting blade','fan impeller','tension spring','wire rope','gear','motor pinion','conveyor roller','rubber roller','sponge pad','rubber seal','support leg','machine base','guide rail','strip curtain','safety guard','bumper','working stage','stage','ejector pin','pushing arm','pulling arm','motor carbon brush','thermal insulation','alloy material'])
const _fluidSymptoms = new Set(['leakage','seepage','dripping','overflow','continuous flow','no flow','clogged','frequent clogging','flow restriction','not spraying','continuous spraying','intermittent spraying','not refilling','zero pressure'])
const _measureMods   = new Set(['temperature','relative humidity','system pressure','fluid level','clearance','water content','center alignment'])
const _urgencyMods   = new Set(['severely','severe','urgent','slightly','minor','moderate','frequently','continuously','occasionally','intermittently','immediately'])
const _hasSymptoms   = new Set(['no flow','not filling','zero pressure','no power supply','no sound','audio failure','loss of vacuum','low vacuum pressure'])
const _hasRewrites   = {'no flow':'no water flow','not filling':'not filling','zero pressure':'no pressure','no power supply':'no power supply','audio failure':'no audio','loss of vacuum':'no vacuum','low vacuum pressure':'low vacuum'}
const _nounSymptoms  = {'error':'is showing an error','media jam':'has a media jam','overload':'is showing an overload fault','short circuit':'has a short circuit','current leakage':'has a current leakage','system crash':'has crashed','QA failed':'failed QA inspection'}

const _joinAnd = p => !p?.length ? '' : p.length===1 ? p[0] : p.length===2 ? p[0]+' and '+p[1] : p.slice(0,-1).join(', ')+', and '+p[p.length-1]
const _cap     = s => s ? s.charAt(0).toUpperCase()+s.slice(1) : s
const _ofType  = (toks, t) => toks.filter(x => x.t === t)
const _en      = toks => toks.map(x => x.en)
const _locPrep = en => /room|restroom|canteen|cleanroom|storage|walkway|area/i.test(en) ? 'in the ' : /floor|ceiling|roof|window/i.test(en) ? 'on the ' : 'at the '
const _locStr  = locs => locs.length ? locs.map(l => _locPrep(l.en)+l.en).join(', ') : ''

function _symptomStr(syms, urgMods) {
  const parts = _en(syms), urgSuffix = urgMods?.length ? ' ('+_en(urgMods).join(', ')+')' : ''
  if (!parts.length) return ''
  if (parts.length===1 && _nounSymptoms[parts[0]]) return _nounSymptoms[parts[0]]+urgSuffix
  if (parts.every(p => _hasSymptoms.has(p))) return 'has '+_joinAnd(parts.map(p => _hasRewrites[p]||p))+urgSuffix
  return 'is '+_joinAnd(parts)+urgSuffix
}

export function assemble(tokens) {
  if (!tokens.length) return ''
  if (tokens.length===1) return _cap(tokens[0].en)+'.'
  let comps=_ofType(tokens,'C'),syms=_ofType(tokens,'S'),acts=_ofType(tokens,'A'),locs=_ofType(tokens,'L'),mods=_ofType(tokens,'M'),unks=_ofType(tokens,'U')
  const measMods=mods.filter(m=>_measureMods.has(m.en)), urgMods=mods.filter(m=>_urgencyMods.has(m.en))
  if (comps.length && comps.some(c=>_nonFluidComps.has(c.en))) syms=syms.filter(s=>!_fluidSymptoms.has(s.en))
  const locPart=_locStr(locs), hasUnk=unks.length>0
  if (acts.length&&tokens[0].t==='A') {
    let s=_joinAnd(_en(acts)); if(comps.length) s+=' the '+_joinAnd(_en(comps)); if(locPart) s+=' '+locPart; if(syms.length) s+=' — symptom: '+_joinAnd(_en(syms)); if(urgMods.length) s+=' ('+_en(urgMods).join(', ')+')'; if(hasUnk) s+=' '+_en(unks).join(' '); return _cap(s)+'.'
  }
  if (comps.length&&tokens[0].t==='C') {
    let d='The '+_joinAnd(_en(comps)); if(locPart) d+=' '+locPart; if(syms.length) d+=' '+_symptomStr(syms,urgMods); else if(urgMods.length) d+=' ('+_en(urgMods).join(', ')+')'; if(hasUnk) d+=' '+_en(unks).join(' '); return _cap(d)+'.'
  }
  if (measMods.length&&tokens[0].t==='M') {
    let ms=_en(measMods).join(' '); if(comps.length) ms+=' reading of the '+_joinAnd(_en(comps)); let md=_cap(ms); if(locPart) md+=' '+locPart; if(syms.length) md+=' is '+_joinAnd(_en(syms)); if(urgMods.length) md+=' ('+_en(urgMods).join(', ')+')'; if(hasUnk) md+=' '+_en(unks).join(' '); return md+'.'
  }
  if (urgMods.length&&tokens[0].t==='M'&&!measMods.length) {
    const urgLabel=_cap(_en(urgMods).join(', ')), rest=[]
    if(comps.length){let s='The '+_joinAnd(_en(comps)); if(locPart) s+=' '+locPart; if(syms.length) s+=' '+_symptomStr(syms,[]); rest.push(s)} else if(syms.length) rest.push(_joinAnd(_en(syms)))
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
  const norm = normalizeThaiText(s)
  if (_dict[norm]) return _dict[norm].en
  return assemble(tokenize(norm))
}

export function hasThai(text) {
  if (!text) return false
  return /[\u0E00-\u0E7F]/.test(String(text))
}

export function resetFuzzyHits() { _fuzzyHits = 0 }
