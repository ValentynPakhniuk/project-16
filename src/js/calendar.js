import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
require("flatpickr/dist/themes/material_blue.css");


const options = {
    // defaultDate: new Date(),
    dateFormat: "d/m/Y",
    onClose(selectedDates) {
      console.log(selectedDates[0]);
    },
};

const calendarInput = document.querySelector('.calendar-input');
console.log(calendarInput);

const fp = flatpickr(calendarInput, options);