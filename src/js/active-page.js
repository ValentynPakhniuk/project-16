const activePage = window.location.pathname;
const menuNav = document.querySelector('.navigation__container');
const menuItem = menuNav.querySelector(`[href='${activePage}']`);
menuItem.classList.add('site-nav__link--current');

const mobMenu = document.querySelector('.site-nav__mobile');
const mobItem = mobMenu.querySelector(`[href='${activePage}']`);
mobItem.parentElement.classList.add('container__item--current');
