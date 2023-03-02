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
