'use strict';
(() => {
  const menuBtnRef = document.querySelector('[data-menu-button]');
  const mobileMenuRef = document.querySelector('[data-menu]');
  const searchForm = document.querySelector('#search-form');
  const body = document.body;

  menuBtnRef.addEventListener('click', () => {
    const expanded =
      menuBtnRef.getAttribute('aria-expanded') === 'true' || false;
    menuBtnRef.classList.toggle('is-open');
    searchForm.classList.toggle('visually-hidden');
    menuBtnRef.getAttribute('aria-expanded', !expanded);
    mobileMenuRef.classList.toggle('is-open');
    body.classList.toggle('modal-open');
  });
})();
