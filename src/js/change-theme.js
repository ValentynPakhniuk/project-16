(() => {
  const tgl = document.querySelector('.switch__theme');
  tgl.addEventListener('click', e => {
    if (e.target.classList.contains('theme-light')) {
      document.body.classList.remove('dark-mode');
    } else if (e.target.classList.contains('theme-dark')) {
      document.body.classList.add('dark-mode');
    }
  });
})();
