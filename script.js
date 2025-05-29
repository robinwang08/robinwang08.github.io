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
  "Weekend 500P PM": "3:00 PM - 11:00 PM",
  "Weekend LPCH": "7:30 AM - 5:00 PM",
  "Weekend BW AM": "7:00 AM - 1:00 PM",
  "Weekend BW PM": "1:00 PM - 7:00 PM",
  "Weekend SMOC AM": "7:00 AM - 1:00 PM",
  "Weekend SMOC PM": "1:00 PM - 7:00 PM",
  "Weekend PAIC AM": "7:00 AM - 1:00 PM",
  "Weekend PAIC PM": "1:00 PM - 7:00 PM",
  "Weekend CCSB": "7:00 AM - 3:00 PM",
  "Weekend Hoover": "7:00 AM - 3:00 PM"
}; //

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("userName"); //
  const pagerInput = document.getElementById("pager"); //
  const weeknightShiftDropdown = document.getElementById("weeknightShiftType"); //
  const weekendShiftDropdown = document.getElementById("weekendShiftType"); //
  const generateEmailButton = document.getElementById("generateEmailButton"); //

  nameInput.value = getCookie("userName"); //
  pagerInput.value = getCookie("pager"); //

  populateShiftDropdowns(); //

  nameInput.addEventListener("input", () => {
    setCookie("userName", nameInput.value); //
    updateDisplay(); //
  });

  pagerInput.addEventListener("input", () => {
    setCookie("pager", pagerInput.value); //
    updateDisplay(); //
  });

  weeknightShiftDropdown.addEventListener("change", () => {
    if (weeknightShiftDropdown.value) {
      weekendShiftDropdown.value = ""; // Clear the other dropdown
    }
    updateDisplay(); //
  });

  weekendShiftDropdown.addEventListener("change", () => {
    if (weekendShiftDropdown.value) {
      weeknightShiftDropdown.value = ""; // Clear the other dropdown
    }
    updateDisplay(); //
  });

  generateEmailButton.addEventListener("click", generateEmail); //

  renderCalendar(currentDate); //
});

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString(); //
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`; //
}

function getCookie(name) {
  const cookies = document.cookie.split("; "); //
  for (let c of cookies) {
    const [key, value] = c.split("="); //
    if (key === name) return decodeURIComponent(value); //
  }
  return ""; //
}

function populateShiftDropdowns() {
  const weeknightDropdown = document.getElementById("weeknightShiftType"); //
  const weekendDropdown = document.getElementById("weekendShiftType"); //

  weeknightDropdown.length = 1; //
  weekendDropdown.length = 1; //

  for (const key in shiftTimes) {
    if (shiftTimes.hasOwnProperty(key)) {
      const option = document.createElement("option"); //
      option.value = key; //

      if (key.startsWith("Weeknight ")) {
        option.text = key.substring("Weeknight ".length); //
        weeknightDropdown.appendChild(option); //
      } else if (key.startsWith("Weekend ")) {
        option.text = key.substring("Weekend ".length); //
        weekendDropdown.appendChild(option); //
      }
    }
  }
}

function renderCalendar(date) {
  const monthYear = document.getElementById("monthYear"); //
  const calendarDates = document.getElementById("calendarDates"); //

  const year = date.getFullYear(); //
  const month = date.getMonth(); //

  const firstDay = new Date(year, month, 1).getDay(); //
  const daysInMonth = new Date(year, month + 1, 0).getDate(); //

  monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`; //
  calendarDates.innerHTML = ""; //

  const today = new Date(); //
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month; //

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div"); //
    calendarDates.appendChild(emptyCell); //
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div"); //
    dayCell.textContent = day; //

    if (isCurrentMonth && today.getDate() === day && today.getFullYear() === year && today.getMonth() === month) {
      dayCell.classList.add("today"); //
    }

    if (
      selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    ) {
      dayCell.classList.add("selected"); //
    }

    dayCell.addEventListener("click", () => {
      selectedDate = new Date(year, month, day); //
      updateDisplay(); //
      renderCalendar(date); //
    });

    calendarDates.appendChild(dayCell); //
  }
  updateDisplay(); //
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1); //
  renderCalendar(currentDate); //
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1); //
  renderCalendar(currentDate); //
}

function calculateTotalHours(timeStr) {
  const [start, end] = timeStr.split("-").map(t => t.trim()); //

  const to24Hour = (t) => {
    const match = t.match(/(\d{1,2})(?::(\d{2}))?\s*([AP]M)/i); //
    if (!match) return null; //

    let hour = parseInt(match[1], 10); //
    const minute = match[2] ? parseInt(match[2], 10) : 0; //
    const meridian = match[3].toUpperCase(); //

    if (meridian === "PM" && hour !== 12) hour += 12; //
    if (meridian === "AM" && hour === 12) hour = 0; // Midnight case

    return hour + minute / 60; //
  };

  const startHour = to24Hour(start); //
  const endHour = to24Hour(end); //

  if (startHour === null || endHour === null) return ""; //

  let duration = endHour - startHour; //
  if (duration < 0) { // Handles overnight shifts
    duration += 24; //
  }
  return duration.toFixed(1); //
}

function updateDisplay() {
  const name = document.getElementById("userName").value || "N/A"; //
  const pager = document.getElementById("pager").value || "N/A"; //
  const display = document.getElementById("selectedDateDisplay"); //

  const weeknightDropdown = document.getElementById("weeknightShiftType"); //
  const weekendDropdown = document.getElementById("weekendShiftType"); //

  let shiftType = ""; // Full key for shiftTimes
  let displayShiftTypeText = ""; // Text for display

  if (weeknightDropdown.value) {
    shiftType = weeknightDropdown.value; //
    displayShiftTypeText = weeknightDropdown.options[weeknightDropdown.selectedIndex].text; //
  } else if (weekendDropdown.value) {
    shiftType = weekendDropdown.value; //
    displayShiftTypeText = weekendDropdown.options[weekendDropdown.selectedIndex].text; //
  }

  if (!selectedDate || !shiftType) {
    display.innerHTML = ""; //
    return; //
  }

  if (shiftType === "Weekend 300P/LPCH PM" && selectedDate.getDay() === 0) { // 0 is Sunday
    const timePeriod1 = "3:00 PM - 5:00 PM"; //
    const site1 = "300P PM"; //
    const totalHours1 = calculateTotalHours(timePeriod1); //
    const message1 = `
      <strong>Name:</strong> ${name}<br>
      <strong>• Pager:</strong> ${pager}<br>
      <strong>• Position:</strong> Resident<br>
      <strong>• Employment:</strong> Hospital employee<br>
      <strong>• Date of coverage:</strong> ${selectedDate.toDateString()}<br>
      <strong>• Time period covered:</strong> ${timePeriod1}<br>
      <strong>• Site (ex. Sherman, SMOC, 500P, CCSB, 300P AM):</strong> ${site1}<br>
      <strong>• Modality(s):</strong> CT/MR<br>
      <strong>• Total hours:</strong> ${totalHours1}
    `; //

    const timePeriod2 = "5:00 PM - 11:00 PM"; //
    const site2 = displayShiftTypeText; //
    const totalHours2 = calculateTotalHours(timePeriod2); //
    const message2 = `
      <strong>Name:</strong> ${name}<br>
      <strong>• Pager:</strong> ${pager}<br>
      <strong>• Position:</strong> Resident<br>
      <strong>• Employment:</strong> Hospital employee<br>
      <strong>• Date of coverage:</strong> ${selectedDate.toDateString()}<br>
      <strong>• Time period covered:</strong> ${timePeriod2}<br>
      <strong>• Site (ex. Sherman, SMOC, 500P, CCSB, 300P AM):</strong> ${site2}<br>
      <strong>• Modality(s):</strong> CT/MR<br>
      <strong>• Total hours:</strong> ${totalHours2}
    `; //
    display.innerHTML = message1 + "<br><hr style='margin: 15px 0;'><br>" + message2; //
  } else {
    const shiftTime = shiftTimes[shiftType] || ""; //
    const totalHours = shiftTime ? calculateTotalHours(shiftTime) : ""; //

    const message = `
      <strong>Name:</strong> ${name}<br>
      <strong>• Pager:</strong> ${pager}<br>
      <strong>• Position:</strong> Resident<br>
      <strong>• Employment:</strong> Hospital employee<br>
      <strong>• Date of coverage:</strong> ${selectedDate.toDateString()}<br>
      <strong>• Time period covered:</strong> ${shiftTime}<br>
      <strong>• Site (ex. Sherman, SMOC, 500P, CCSB, 300P AM):</strong> ${displayShiftTypeText}<br>
      <strong>• Modality(s):</strong> CT/MR<br>
      <strong>• Total hours:</strong> ${totalHours}
    `; //
    display.innerHTML = message; //
  }
}

function getSelectedShiftText() {
  const weeknightDropdown = document.getElementById("weeknightShiftType"); //
  const weekendDropdown = document.getElementById("weekendShiftType"); //

  if (weeknightDropdown.value) {
    return weeknightDropdown.options[weeknightDropdown.selectedIndex].text; //
  } else if (weekendDropdown.value) {
    return weekendDropdown.options[weekendDropdown.selectedIndex].text; //
  }
  return ""; //
}

// --- NEW HELPER FUNCTIONS ---
function convertHtmlToPlainText(htmlString) {
  let text = htmlString;
  // Replace <hr> tags with a '---' separator surrounded by newlines.
  text = text.replace(/<hr[^>]*>/gi, "\n---\n");
  // Convert <br> tags to newlines.
  text = text.replace(/<br\s*\/?>/gi, "\n");
  // Remove <strong> and <b> tags but keep their content.
  text = text.replace(/<strong>(.*?)<\/strong>/gi, "$1");
  text = text.replace(/<b>(.*?)<\/b>/gi, "$1");
  // Remove any other HTML tags that might remain.
  text = text.replace(/<[^>]+>/g, "");
  // Normalize multiple consecutive newlines (and newlines surrounded by whitespace)
  text = text.replace(/(\s*\n\s*)+/g, "\n");
  // Trim leading/trailing whitespace (which includes newlines) from the final body.
  text = text.trim();
  return text;
}

function openOutlookEmail(recipient, subject, body) {
  const owaUrlBase = "https://outlook.office.com/mail/deeplink/compose";
  const encodedRecipient = encodeURIComponent(recipient);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const owaLink = `${owaUrlBase}?to=${encodedRecipient}&subject=${encodedSubject}&body=${encodedBody}`;
  window.open(owaLink, '_blank');
}

// --- MODIFIED generateEmail FUNCTION ---
function generateEmail() {
  const name = document.getElementById("userName").value || "N/A"; //
  const pager = document.getElementById("pager").value || "N/A"; //

  const weeknightDropdown = document.getElementById("weeknightShiftType"); //
  const weekendDropdown = document.getElementById("weekendShiftType"); //
  let shiftTypeKey = ""; // Full key e.g. "Weekend 300P/LPCH PM"
  let displayShiftText = getSelectedShiftText(); // Short text e.g. "300P/LPCH PM"

  if (weeknightDropdown.value) {
    shiftTypeKey = weeknightDropdown.value; //
  } else if (weekendDropdown.value) {
    shiftTypeKey = weekendDropdown.value; //
  }

  if (!selectedDate || !shiftTypeKey) {
    alert("Please select a date and a shift type first.");
    return;
  }

  const formattedDate = selectedDate.toDateString(); //

  // Special handling for "Weekend 300P/LPCH PM" on a Sunday
  if (shiftTypeKey === "Weekend 300P/LPCH PM" && selectedDate.getDay() === 0) { // 0 is Sunday
    // Message 1 Construction
    const timePeriod1 = "3:00 PM - 5:00 PM"; //
    const site1 = "300P PM"; //
    const totalHours1 = calculateTotalHours(timePeriod1); //
    const message1Html = `
      <strong>Name:</strong> ${name}<br>
      <strong>• Pager:</strong> ${pager}<br>
      <strong>• Position:</strong> Resident<br>
      <strong>• Employment:</strong> Hospital employee<br>
      <strong>• Date of coverage:</strong> ${formattedDate}<br>
      <strong>• Time period covered:</strong> ${timePeriod1}<br>
      <strong>• Site (ex. Sherman, SMOC, 500P, CCSB, 300P AM):</strong> ${site1}<br>
      <strong>• Modality(s):</strong> CT/MR<br>
      <strong>• Total hours:</strong> ${totalHours1}
    `; //
    const body1Plain = convertHtmlToPlainText(message1Html);
    const subject1 = `${formattedDate} - ${site1}`;
    openOutlookEmail("SHC-RAD-Inject-Shift@stanfordhealthcare.org", subject1, body1Plain);

    // Message 2 Construction
    const timePeriod2 = "5:00 PM - 11:00 PM"; //
    // site2 uses displayShiftText which for "Weekend 300P/LPCH PM" is "300P/LPCH PM"
    const site2 = displayShiftText; //
    const totalHours2 = calculateTotalHours(timePeriod2); //
    const message2Html = `
      <strong>Name:</strong> ${name}<br>
      <strong>• Pager:</strong> ${pager}<br>
      <strong>• Position:</strong> Resident<br>
      <strong>• Employment:</strong> Hospital employee<br>
      <strong>• Date of coverage:</strong> ${formattedDate}<br>
      <strong>• Time period covered:</strong> ${timePeriod2}<br>
      <strong>• Site (ex. Sherman, SMOC, 500P, CCSB, 300P AM):</strong> ${site2}<br>
      <strong>• Modality(s):</strong> CT/MR<br>
      <strong>• Total hours:</strong> ${totalHours2}
    `; //
    const body2Plain = convertHtmlToPlainText(message2Html);
    const subject2 = `${formattedDate} - ${site2}`;
    openOutlookEmail("MLlanes@stanfordchildrens.org", subject2, body2Plain);

  } else {
    // Regular email generation
    const displayElement = document.getElementById("selectedDateDisplay"); //
    const bodyHtml = displayElement.innerHTML; //
    const bodyPlain = convertHtmlToPlainText(bodyHtml);
    const subjectGeneric = `${formattedDate} - ${displayShiftText}`; //
    const recipientGeneric = "SHC-RAD-Inject-Shift@stanfordhealthcare.org"; //
    openOutlookEmail(recipientGeneric, subjectGeneric, bodyPlain);
  }
}