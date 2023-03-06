// (() => {
//   const tgl = document.querySelector('.switch__theme');
//   tgl.addEventListener('click', e => {
//     if (e.target.classList.contains('theme-light')) {
//       document.body.classList.remove('dark-mode');
//     } else if (e.target.classList.contains('theme-dark')) {
//       document.body.classList.add('dark-mode');
//     }
//   });
// })();

// mode switcher with Local Storage

const tgl = document.querySelector('.switch__theme');
tgl.addEventListener('click', onSwitchMode);

addClassToBody();

function onSwitchMode() {
  if (localStorage.getItem('theme') === 'dark-mode') {
    localStorage.removeItem('theme');
  } else {
    localStorage.setItem('theme', 'dark-mode');
  }
  addClassToBody();
}

function addClassToBody() {
  if (localStorage.getItem('theme') === 'dark-mode') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

const mobileMenu = document.querySelector('#menu-container');
const containerLogoSearch = document.querySelector('.container-logo-search');
const searchForm = document.querySelector('#search-form');

const moveToggleBtn = function () {
  if (window.innerWidth < 768) {
    mobileMenu.appendChild(tgl);
    containerLogoSearch.appendChild(searchForm);
  } else {
    document.querySelector('.container').appendChild(tgl);
    document.querySelector('.container__search').appendChild(searchForm);
  }
};

moveToggleBtn(); // виклик переміщення при завантаженні сторінки

window.addEventListener('resize', function () {
  moveToggleBtn();
});

mobileMenu.addEventListener('click', function () {
  moveToggleBtn();
});
