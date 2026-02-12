// --- 1. Function เดิมของคุณ (คงไว้เพื่อให้ระบบหน้าจอทำงานปกติ) ---

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function nextStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
    
    document.querySelectorAll('.step').forEach((s, index) => {
        if (index + 1 <= step) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });

    // เพิ่มเติม: ทุกครั้งที่มาถึง Step 4 ให้วาดปฏิทินใหม่เพื่อให้ข้อมูลเป็นปัจจุบัน
    if(step === 4) {
        renderCalendar();
    }
}


document.querySelectorAll('form').forEach(form => {
    form.onsubmit = function() {
        const btn = form.querySelector('button[type="submit"]');
        if(btn) {
            btn.innerText = "Sending...";
            btn.style.opacity = "0.7";
        }
    };
});

// --- 2. ระบบปฏิทิน (ส่วนที่เพิ่มใหม่เพื่อให้เหมือนในรูป) ---

const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

function initCalendar() {
    const mSelect = document.getElementById('calendar-month');
    const ySelect = document.getElementById('calendar-year');
    
    if(!mSelect || !ySelect) return; // กัน Error ถ้าหา Element ไม่เจอ

    // เติมรายชื่อเดือนลงใน Dropdown
    monthNames.forEach((m, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = m;
        mSelect.appendChild(opt);
    });

    // เติมปี (แสดงเป็น พ.ศ. 2569 ตามรูป)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 1; i <= currentYear + 3; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i + 543; // แปลง ค.ศ. เป็น พ.ศ.
        ySelect.appendChild(opt);
    }

    // ตั้งค่าเริ่มต้นเป็นเดือนและปีปัจจุบัน
    mSelect.value = new Date().getMonth();
    ySelect.value = currentYear;

    // ผูก Event เมื่อมีการเปลี่ยนเดือนหรือปี ให้วาดปฏิทินใหม่
    mSelect.onchange = renderCalendar;
    ySelect.onchange = renderCalendar;

    renderCalendar(); // วาดครั้งแรก
}

function renderCalendar() {
    const calendarBody = document.getElementById('calendar-body');
    const mSelect = document.getElementById('calendar-month');
    const ySelect = document.getElementById('calendar-year');
    const dateInput = document.getElementById('app_date'); // Hidden input ที่เก็บค่าส่งไป Formspree

    if(!calendarBody) return;

    const month = parseInt(mSelect.value);
    const year = parseInt(ySelect.value);
    
    calendarBody.innerHTML = ''; // ล้างตารางเก่า

    const firstDay = new Date(year, month, 1).getDay(); // หาวันแรกของเดือน (0=อาทิตย์)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // หาจำนวนวันในเดือนนั้น

    let date = 1;
    for (let i = 0; i < 6; i++) { // สร้างแถว (สูงสุด 6 สัปดาห์)
        let row = document.createElement('tr');
        let hasData = false;

        for (let j = 0; j < 7; j++) { // สร้างคอลัมน์ (7 วัน)
            let cell = document.createElement('td');
            
            if (i === 0 && j < firstDay) {
                cell.innerHTML = ""; // ช่องว่างก่อนเริ่มวันที่ 1
            } else if (date > daysInMonth) {
                cell.innerHTML = ""; // ช่องว่างหลังสิ้นเดือน
            } else {
                cell.innerHTML = date;
                hasData = true;
                
                const fullDateValue = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
                
                // ตรวจสอบว่าถ้าวันที่นี้ถูกเลือกอยู่ให้ใส่ Class selected
                if (dateInput.value === fullDateValue) {
                    cell.classList.add('selected');
                }

                // Event เมื่อคลิกเลือกวันที่
                cell.onclick = function() {
                    // ลบ Class selected ออกจากช่องอื่นทั้งหมด
                    document.querySelectorAll('.calendar-table td').forEach(td => td.classList.remove('selected'));
                    // เพิ่ม Class ให้ช่องที่ถูกคลิก
                    cell.classList.add('selected');
                    // เก็บค่าวันที่ลงใน Input ลับเพื่อส่ง Formspree
                    dateInput.value = fullDateValue;
                };
                date++;
            }
            row.appendChild(cell);
        }
        if (hasData) calendarBody.appendChild(row);
    }
}

// เริ่มทำงานเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', initCalendar);