const classHide = 'hide';
const startPage = 'Categories';
const statsPage = 'Statistics';

const EFFECTS = {
  correct: '/assets/audio/correct.mp3',
  error: '/assets/audio/error.mp3',
  failure: '/assets/audio/failure.mp3',
  success: '/assets/audio/success.mp3',
};

const MODES = {
  train: 'train',
  play: 'play',
};

const sidenav = document.getElementById('sidenav');
const logo = document.getElementById('logo');
const modeBtn = document.getElementById('mode-btn');
const rating = document.getElementById('rating');
const pageContainer = document.getElementById('page-container');
const playBtn = document.getElementById('play-btn');
const repeatBtn = document.getElementById('repeat-btn');
const modal = document.getElementById('modal');

export {
  classHide,
  startPage,
  statsPage,
  EFFECTS,
  MODES,
  sidenav,
  logo,
  modeBtn,
  rating,
  pageContainer,
  playBtn,
  repeatBtn,
  modal,
};
