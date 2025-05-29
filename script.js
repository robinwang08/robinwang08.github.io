let currentDate = new Date();
let selectedDate = null;

function renderCalendar(date) {
  const monthYear = document.getElementById("monthYear");
  const calendarDates = document.getElementById("calendarDates");

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;
  calendarDates.innerHTML = "";

  // Blank starting cells
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    calendarDates.appendChild(emptyCell);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.textContent = day;

    dayCell.addEventListener("click", () => {
      const previouslySelected = document.querySelector(".calendar-dates .selected");
      if (previouslySelected) {
        previouslySelected.classList.remove("selected");
      }
      dayCell.classList.add("selected");
      selectedDate = new Date(year, month, day);
      console.log("Selected date:", selectedDate.toDateString());
    });

    calendarDates.appendChild(dayCell);
  }
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
