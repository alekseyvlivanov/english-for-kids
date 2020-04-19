import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min';

import './styles.css';
import cards from './cards/cards';

const categories = Object.keys(cards);
const sidenav = document.getElementById('sidenav');
const logo = document.getElementById('logo');
const playBtn = document.getElementById('play-btn');
const pageContainer = document.getElementById('page-container');
const audioPlayer = document.getElementById('audio');

const startPage = 'Categories';

// const EFFECTS = {
//   correct: '/assets/audio/correct.mp3',
//   error: '/assets/audio/error.mp3',
//   failure: '/assets/audio/failure.mp3',
//   success: '/assets/audio/success.mp3',
// };

const MODES = {
  train: 'train',
  play: 'play',
};

const currentState = {
  mode: MODES.train,
};

const playAudio = (url) => {
  if (url) {
    audioPlayer.src = url;
    audioPlayer.play();
  }
};

const createCategoryCard = (category) => {
  const categoryCard = document.createElement('div');
  categoryCard.className = 'col s12 m6 l4 xl3';

  const classCard = document.createElement('div');
  classCard.className = 'card hoverable category';
  classCard.dataset.key = category;

  const classCardImage = document.createElement('div');
  classCardImage.className = 'card-image';

  const cardImage = document.createElement('img');
  cardImage.setAttribute(
    'src',
    `/cards/${
      cards[category][Math.floor(Math.random() * cards[category].length)].image
    }`,
  );
  cardImage.setAttribute('alt', category);

  const cardTitle = document.createElement('span');
  cardTitle.className = 'card-title';
  cardTitle.innerHTML = `<span class="new badge truncate" data-badge-caption="">${category}</span>`;

  classCardImage.append(cardImage);
  classCardImage.append(cardTitle);
  classCard.append(classCardImage);
  categoryCard.append(classCard);

  return categoryCard;
};

const createWordCard = (word) => {
  const wordCard = document.createElement('div');
  wordCard.className = 'col s12 m6 l4 xl3';

  const flipCard = document.createElement('div');
  flipCard.className = 'flip-card';

  const cardFaceFront = document.createElement('div');
  cardFaceFront.className = 'card-face-front';

  const classCardFront = document.createElement('div');
  classCardFront.className = 'card hoverable word';
  classCardFront.dataset.key = word.word;

  const classCardFrontImage = document.createElement('div');
  classCardFrontImage.className = 'card-image';

  const cardFrontImage = document.createElement('img');
  cardFrontImage.setAttribute('src', `/cards/${word.image}`);
  cardFrontImage.setAttribute('alt', word.word);

  const classCardFrontContent = document.createElement('div');
  classCardFrontContent.className = 'card-content truncate';
  classCardFrontContent.innerHTML = `<div>${word.word}</div><div class="rotate"></div>`;

  const cardFaceBack = document.createElement('div');
  cardFaceBack.className = 'card-face-back';

  const classCardBack = document.createElement('div');
  classCardBack.className = 'card hoverable word';
  classCardBack.dataset.key = word.word;

  const classCardBackImage = document.createElement('div');
  classCardBackImage.className = 'card-image';

  const cardBackImage = document.createElement('img');
  cardBackImage.setAttribute('src', `/cards/${word.image}`);
  cardBackImage.setAttribute('alt', word.word);

  const classCardBackContent = document.createElement('div');
  classCardBackContent.className = 'card-content truncate';
  classCardBackContent.innerHTML = `<div>${word.translation}</div>`;

  classCardFrontImage.append(cardFrontImage);
  classCardBackImage.append(cardBackImage);
  classCardFront.append(classCardFrontImage);
  classCardFront.append(classCardFrontContent);
  classCardBack.append(classCardBackImage);
  classCardBack.append(classCardBackContent);
  cardFaceFront.append(classCardFront);
  cardFaceBack.append(classCardBack);
  flipCard.append(cardFaceFront);
  flipCard.append(cardFaceBack);
  wordCard.append(flipCard);

  return wordCard;
};

const getActiveLink = () => {
  return sidenav.querySelector('a.active');
};

const updateMode = () => {
  playBtn.textContent = currentState.mode;

  const activeLink = getActiveLink();
  const elementsToUpdate =
    activeLink.textContent === startPage ? '.badge' : '.card-content';
  const addRemove = currentState.mode === MODES.play ? 'add' : 'remove';

  pageContainer
    .querySelectorAll(elementsToUpdate)
    .forEach((a) => a.classList[addRemove]('play'));
};

const renderSidenav = () => {
  categories.forEach((e) => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#">${e}</a>`;
    sidenav.append(li);
  });
};

const renderPageContainer = () => {
  const activeLink = getActiveLink();
  logo.textContent = activeLink.textContent;

  const row = document.createElement('div');
  row.className = 'row';

  if (activeLink.textContent === startPage) {
    categories.forEach((category) => {
      row.append(createCategoryCard(category));
    });
  } else {
    cards[activeLink.textContent]
      .sort(() => Math.random() - 0.5)
      .forEach((word) => {
        row.append(createWordCard(word));
      });
  }

  pageContainer.innerHTML = '';
  pageContainer.append(row);

  updateMode();
};

const addListeners = () => {
  document.addEventListener('DOMContentLoaded', () => {
    M.Sidenav.init(sidenav);
  });

  sidenav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && !e.target.classList.contains('active')) {
      getActiveLink().classList.remove('active');
      e.target.classList.add('active');

      renderPageContainer();
    }

    const instance = M.Sidenav.getInstance(sidenav);
    instance.close();
  });

  playBtn.addEventListener('click', (e) => {
    e.target.classList.toggle('play');
    currentState.mode = e.target.classList.contains('play')
      ? MODES.play
      : MODES.train;

    updateMode();
  });

  pageContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.card');

    if (!card) return;

    const activeLink = getActiveLink();

    if (activeLink.textContent === startPage) {
      const sidenavLinks = Array.from(sidenav.querySelectorAll('a'));
      const targetLink = sidenavLinks.find(
        (a) => a.textContent === card.dataset.key,
      );

      getActiveLink().classList.remove('active');
      targetLink.classList.add('active');

      renderPageContainer();

      return;
    }

    if (e.target.classList.contains('rotate')) {
      const flipCard = e.target.closest('.flip-card');
      flipCard.classList.add('is-flipped');

      return;
    }

    if (currentState.mode === MODES.train) {
      const categoryWords = cards[logo.textContent];
      const word = categoryWords.find((w) => w.word === card.dataset.key);

      playAudio(`/cards/${word.audioSrc}`);
    }
  });

  pageContainer.addEventListener('mouseout', (e) => {
    const flipCard = e.target.closest('.is-flipped');

    if (flipCard && e.relatedTarget.contains(flipCard)) {
      flipCard.classList.remove('is-flipped');
    }
  });

  pageContainer.addEventListener('touchend', (e) => {
    if (e.target.classList.contains('rotate')) {
      setTimeout(() => {
        const flipCard = e.target.closest('.is-flipped');
        if (flipCard) {
          flipCard.classList.remove('is-flipped');
        }
      }, 1500);
    }
  });
};

renderSidenav();
renderPageContainer();

addListeners();
