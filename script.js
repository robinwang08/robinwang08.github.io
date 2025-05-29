let currentDate = new Date();
let selectedDate = null;

function renderCalendar(date) {
  const monthYear = document.getElementById("monthYear");
  const calendarDates = document.getElementById("calendarDates");
  const selectedDisplay = document.getElementById("selectedDateDisplay");

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;
  calendarDates.innerHTML = "";

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // Blank starting cells
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    calendarDates.appendChild(emptyCell);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.textContent = day;

    // Highlight today
    if (isCurrentMonth && today.getDate() === day) {
      dayCell.classList.add("today");
    }

    // Mark selected
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
      selectedDisplay.textContent = `Selected date: ${selectedDate.toDateString()}`;
      renderCalendar(date); // Re-render to apply selected styling
    });

    calendarDates.appendChild(dayCell);
  }

  // Show selected date
  selectedDisplay.textContent = selectedDate
    ? `Selected date: ${selectedDate.toDateString()}`
    : "";
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
}

renderCalendar(currentDate);
