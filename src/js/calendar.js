import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
require('flatpickr/dist/themes/material_blue.css');
import NewsApiService from './NewsApiService';
import { onSelectDataByCalendar } from './index.js';

const options = {
  dateFormat: 'd/m/Y',
  disableMobile: 'true',
  onClose(selectedDates) {
    onSelectDataByCalendar();
  },
};

const newsDate = new NewsApiService();
const calendarInput = document.querySelector('.calendar-input');

const fp = flatpickr(calendarInput, options);

calendarInput.addEventListener('input', onInput);

function onInput(event) {
  let selectedDate = event.target.value;

  newsDate.date = selectedDate;

  getNewDate(selectedDate)
    .then(data => console.log(data))
    .catch(error =>
      console.log('Вибачте, але новини по обраній даті відсутні.')
    );
}

function getNewDate(date) {
  const currentDate = new Date();
  const addDate = flatpickr.parseDate(date, 'd/m/Y');

  const promise = new Promise((resolve, reject) => {
    if (!(currentDate < addDate)) {
      resolve(date);
    } else {
      reject(date);
    }
  });
  return promise;
}
