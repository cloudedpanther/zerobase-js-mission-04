import { makeDOMWithProperties } from "./utils.js";

const Calendar = ($datePicker) => {
  let currentDate = new Date();
  const originalMonth = currentDate.getMonth();
  const today = currentDate.getDate();

  let selectedDate = null;

  const dayMap = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
  ];
  const monthMap = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const isCurrentMonthPage = (month, currentMonth, day) => {
    let monthFlag;
    if (currentMonth === 0) {
      monthFlag = month === 11 || month === 0;
    } else {
      monthFlag =
        month === currentMonth - 1 ||
        month === currentMonth;
    }

    return monthFlag || day > 0;
  };

  const getDateClassName = (
    date,
    month,
    currentMonth,
    day
  ) => {
    let className = "calendar-date";

    if (month < currentMonth) {
      className += " previous-month";
    } else if (month > currentMonth) {
      className += " next-month";
    } else {
      className += " current-month";

      if (month === originalMonth && date === today)
        className += " today";
      if (day === 0) className += " holiday";
    }

    return className;
  };

  const getDateDOMList = () => {
    const dateDOMList = [];

    const dateMap = new Date(currentDate);
    const currentMonth = dateMap.getMonth();

    dateMap.setDate(1);
    while (dateMap.getDay() > 0) {
      dateMap.setDate(dateMap.getDate() - 1);
    }

    let year = dateMap.getFullYear();
    let month = dateMap.getMonth();
    let date = dateMap.getDate();
    let day = dateMap.getDay();

    while (isCurrentMonthPage(month, currentMonth, day)) {
      const dateDOM = makeDOMWithProperties("p", {
        className: getDateClassName(
          date,
          month,
          currentMonth,
          day
        ),
        dataSet: {
          year,
          month,
          date,
        },
        innerHTML: date,
      });
      dateDOMList.push(dateDOM);

      dateMap.setDate(dateMap.getDate() + 1);
      year = dateMap.getFullYear();
      month = dateMap.getMonth();
      date = dateMap.getDate();
      day = dateMap.getDay();
    }

    return dateDOMList;
  };

  const setCalendarGrid = (calendarGridDOM) => {
    const dayDOMList = getDayDOMList();
    const dateDOMList = getDateDOMList();

    dayDOMList.forEach((dayDOM) =>
      calendarGridDOM.appendChild(dayDOM)
    );
    dateDOMList.forEach((dateDOM) =>
      calendarGridDOM.appendChild(dateDOM)
    );
  };

  const setCalendarView = () => {
    const $calendar = $datePicker.nextElementSibling;
    const $calendarNav =
      $calendar.querySelector(".calendar-nav");
    const $calendarGrid = $calendar.querySelector(
      ".calendar-grid"
    );
    const currentMonthDOM = $calendarNav.querySelector(
      ".calendar-month"
    );
    const currentYearDOM = $calendarNav.querySelector(
      ".calendar-year"
    );
    currentMonthDOM.innerHTML = `${getCurrentMonth()}`;
    currentYearDOM.innerHTML = `${getCurrentYear()}`;
    $calendarGrid.innerHTML = "";
    setCalendarGrid($calendarGrid);
  };

  const createCalendar = () => {
    const calendarDOM = makeDOMWithProperties("div", {
      className: "calendar",
    });

    return calendarDOM;
  };

  const getCurrentMonth = () => {
    return monthMap[currentDate.getMonth()];
  };

  const getCurrentYear = () => {
    return currentDate.getFullYear();
  };

  const createCalendarNav = () => {
    const calendarNavDOM = makeDOMWithProperties("div", {
      className: "calendar-nav",
    });

    const prevButtonDOM = makeDOMWithProperties("button", {
      className: "calendar-prev-btn",
    });

    const prevArrowDOM = makeDOMWithProperties("i", {
      className: "bx bxs-left-arrow",
    });

    prevButtonDOM.appendChild(prevArrowDOM);

    const currentPageInfoDOM = makeDOMWithProperties(
      "div",
      {
        className: "calendar-current",
      }
    );

    const currentMonthDOM = makeDOMWithProperties("p", {
      className: "calendar-month",
      innerHTML: `${getCurrentMonth()}`,
    });

    const currentYearDOM = makeDOMWithProperties("p", {
      className: "calendar-year",
      innerHTML: `${getCurrentYear()}`,
    });

    currentPageInfoDOM.appendChild(currentMonthDOM);
    currentPageInfoDOM.appendChild(currentYearDOM);

    const nextButtonDOM = makeDOMWithProperties("button", {
      className: "calendar-next-btn",
    });

    const nextArrowDOM = makeDOMWithProperties("i", {
      className: "bx bxs-right-arrow",
    });

    nextButtonDOM.appendChild(nextArrowDOM);

    calendarNavDOM.appendChild(prevButtonDOM);
    calendarNavDOM.appendChild(currentPageInfoDOM);
    calendarNavDOM.appendChild(nextButtonDOM);

    return calendarNavDOM;
  };

  const getDayDOMList = () => {
    return dayMap.map((day) =>
      makeDOMWithProperties("p", {
        className: "day-of-week",
        innerHTML: day,
      })
    );
  };

  const createCaledarGrid = () => {
    const calendarGridDOM = makeDOMWithProperties("div", {
      className: "calendar-grid",
    });

    setCalendarGrid(calendarGridDOM);

    return calendarGridDOM;
  };

  const moveToPrevMonth = (e) => {
    if (e.target.className !== "calendar-prev-btn") return;

    currentDate.setMonth(currentDate.getMonth() - 1);
    setCalendarView();
  };

  const moveToNextMonth = (e) => {
    if (e.target.className !== "calendar-next-btn") return;

    currentDate.setMonth(currentDate.getMonth() + 1);
    setCalendarView();
  };

  const showCalendar = (e) => {
    e.target.nextElementSibling.classList.add("showing");
  };

  const hideCalendar = (e) => {
    const calendarDOM = $datePicker.nextElementSibling;

    if (!calendarDOM.className.includes("showing")) return;

    if (e) {
      if (e.target === $datePicker) return;
      if (calendarDOM.contains(e.target)) return;
    }

    calendarDOM.classList.remove("showing");
  };

  const dispatchDatePickEvent = () => {
    const datePickEvent = new CustomEvent("ondatepick", {
      bubbles: true,
      cancelable: true,
      detail: selectedDate,
    });
    $datePicker.dispatchEvent(datePickEvent);
  };

  const selectDate = (e) => {
    if (!e.target.className.includes("calendar-date"))
      return;

    const dateDOMList = document.querySelectorAll(
      ".calendar-date"
    );
    dateDOMList.forEach((dateDOM) => {
      dateDOM.classList.remove("selected-date");
    });

    selectedDate = e.target.dataSet;

    e.target.classList.add("selected-date");

    dispatchDatePickEvent();
    hideCalendar();
  };

  const init = () => {
    const calendarDOM = createCalendar();
    const calendarNavDOM = createCalendarNav();
    const calendarGridDOM = createCaledarGrid();

    calendarDOM.appendChild(calendarNavDOM);
    calendarDOM.appendChild(calendarGridDOM);
    $datePicker.after(calendarDOM);

    calendarDOM.addEventListener("click", moveToPrevMonth);
    calendarDOM.addEventListener("click", moveToNextMonth);
    calendarDOM.addEventListener("click", selectDate);

    $datePicker.addEventListener("click", showCalendar);
    document.addEventListener("click", hideCalendar);
  };

  init();
};

export default Calendar;
