let currentDate = new Date();
let selectedDate = null;

const shiftTimes = {
  "Weeknight 300P": "5:00 PM - 11:00 PM",
  "Weeknight AMC/BW": "5:30 PM - 11:00 PM",
  "Weeknight LPCH": "5:30 PM - 11:00 PM",
  "Weeknight PAIC": "5:30 PM - 11:00 PM",
  "Weeknight SMOC": "5:30 PM - 11:00 PM",
  "Weeknight CCSB": "5:00 PM - 11:00 PM",
  "Weekend 300P/500P AM": "7:00 AM - 3:00 PM",
  "Weekend 300P/LPCH PM": "3:00 PM - 11:00 PM",
  "Weekend BW AM": "7:00 AM - 1:00 PM",
  "Weekend BW PM": "1:00 PM - 7:00 PM",
  "Weekend SMOC AM": "7:00 AM - 1:00 PM",
  "Weekend SMOC PM": "1:00 PM - 7:00 PM",
  "Weekend CCSB": "7:00 AM - 3:00 PM",
  "Weekend Hoover": "7:00 AM - 3:00 PM",
  "Weekend PAIC AM": "7:00 AM - 1:00 PM",
  "Weekend PAIC PM": "1:00 PM - 7:00 PM",
  "Weekend 500P PM": "3:00 PM - 11:00 PM"
};

document.addEventListener("DOMContentLoaded", () => {
const nameInput = document.getElementById("userName");
const pagerInput = document.getElementById("pager");

nameInput.value = getCookie("userName");
pagerInput.value = getCookie("pager");

nameInput.addEventListener("input", () => {
  setCookie("userName", nameInput.value);
  updateDisplay();
});

pagerInput.addEventListener("input", () => {
  setCookie("pager", pagerInput.value);
  updateDisplay();
});

  document.getElementById("shiftType").addEventListener("change", updateDisplay);
  renderCalendar(currentDate);
});

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days*24*60*60*1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let c of cookies) {
    const [key, value] = c.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return "";
}


function renderCalendar(date) {
  const monthYear = document.getElementById("monthYear");
  const calendarDates = document.getElementById("calendarDates");

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;
  calendarDates.innerHTML = "";

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    calendarDates.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.textContent = day;

    if (isCurrentMonth && today.getDate() === day) {
      dayCell.classList.add("today");
    }

    if (
      selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    ) {
      dayCell.classList.add("selected");
    }

    dayCell.addEventListener("click", () => {
      selectedDate = new Date(year, month, day);
      updateDisplay();
      renderCalendar(date);
    });

    calendarDates.appendChild(dayCell);
  }

  updateDisplay();
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
}

function calculateTotalHours(timeStr) {
  const [start, end] = timeStr.split("-").map(t => t.trim());

  const to24Hour = (t) => {
    const match = t.match(/(\d{1,2})(?::(\d{2}))?\s*([AP]M)/i);
    if (!match) return null;

    let hour = parseInt(match[1], 10);
    const minute = match[2] ? parseInt(match[2], 10) : 0;
    const meridian = match[3].toUpperCase();

    if (meridian === "PM" && hour !== 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;

    return hour + minute / 60;
  };

  const startHour = to24Hour(start);
  const endHour = to24Hour(end);

  if (startHour === null || endHour === null) return "";

  // Handle cases where the end time is past midnight
  const adjustedEnd = endHour < startHour ? endHour + 24 : endHour;

  return (adjustedEnd - startHour).toFixed(1);
}


function updateDisplay() {
  const name = document.getElementById("userName").value || "N/A";
  const pager = document.getElementById("pager").value || "N/A";
  const display = document.getElementById("selectedDateDisplay");
  const shiftType = document.getElementById("shiftType").value;
  const shiftTime = shiftTimes[shiftType] || "";
  const totalHours = shiftTime ? calculateTotalHours(shiftTime) : "";

  if (!selectedDate || !shiftType) {
    display.innerHTML = "";
    return;
  }

  const message = `
    <strong>Name:</strong> ${name}<br>
    <strong>• Pager:</strong> ${pager}<br>
    <strong>• Position:</strong> Resident<br>
    <strong>• Employment:</strong> Hospital employee<br>
    <strong>• Date of coverage:</strong> ${selectedDate.toDateString()}<br>
    <strong>• Time period covered:</strong> ${shiftTime}<br>
    <strong>• Site (ex. Sherman, SMOC, 500P, CCSB, 300P AM):</strong> ${shiftType}<br>
    <strong>• Modality(s):</strong> CT/MR<br>
    <strong>• Total hours:</strong> ${totalHours}
  `;

  display.innerHTML = message;
}
