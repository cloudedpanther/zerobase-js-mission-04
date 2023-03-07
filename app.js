import Calendar from "./js/calendar.js";

const $datePickers = [
  ...document.querySelectorAll(".date-picker"),
];

$datePickers.forEach(($datePicker) => {
  Calendar($datePicker);

  const formatYear = (year) => {
    const yearString = String(year);
    return "0".repeat(4 - yearString.length) + yearString;
  };

  const formatMonthDate = (date) => {
    const dateString = String(date);
    return "0".repeat(2 - dateString.length) + dateString;
  };

  $datePicker.addEventListener("ondatepick", (e) => {
    try {
      const { year, month, date } = e.detail;

      const dateFormat = `${formatYear(
        year
      )}-${formatMonthDate(month + 1)}-${formatMonthDate(
        date
      )}`;

      e.target.value = dateFormat;
    } catch (error) {
      alert("올바른 접근이 아닙니다.");
      console.log(error);
    }
  });
});
