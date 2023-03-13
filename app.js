import Calendar from './js/calendar.js';

const $datePickers = [...document.querySelectorAll('.date-picker')];

$datePickers.forEach(($datePicker) => {
  Calendar($datePicker, '18rem');

  $datePicker.addEventListener('ondatepick', (e) => {
    try {
      e.target.value = e.detail;
    } catch (error) {
      console.log(error);
    }
  });
});
