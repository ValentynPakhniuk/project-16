let activePage = window.location.pathname;
const path = window.location.pathname.split('/');
if (path[path.length - 1] === '') {
  activePage = '/index.html';
}
const menuNav = document.querySelector('.navigation__container');
const menuItem = menuNav.querySelector(`[href='${activePage}']`);
menuItem.classList.add('site-nav__link--current');

const mobMenu = document.querySelector('.site-nav__mobile');
const mobItem = mobMenu.querySelector(`[href='${activePage}']`);
mobItem.parentElement.classList.add('container__item--current');
