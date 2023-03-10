let activePage = window.location.pathname;
const path = activePage.split('/');
if (path[path.length - 1] === '') {
  const menuNav = document.querySelector('.navigation__container');
  const menuItem = menuNav.querySelector(`.nav__link.site-nav__link.link`);
  menuItem.classList.add('site-nav__link--current');

  const mobMenu = document.querySelector('.site-nav__mobile');
  const mobItem = mobMenu.querySelector(
    `.nav__link.site-nav__link.mobile__nav-link.link`
  );
  mobItem.parentElement.classList.add('container__item--current');
} else {
  const menuNav = document.querySelector('.navigation__container');
  const menuItem = menuNav.querySelector(`[href='${activePage}']`);
  menuItem.classList.add('site-nav__link--current');

  const mobMenu = document.querySelector('.site-nav__mobile');
  const mobItem = mobMenu.querySelector(`[href='${activePage}']`);
  mobItem.parentElement.classList.add('container__item--current');
}
