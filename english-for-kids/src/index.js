import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min';

import './styles.css';
import cards from './cards/cards';

const categories = Object.keys(cards);
const sidenav = document.getElementById('sidenav');
const logo = document.getElementById('logo');
const modeBtn = document.getElementById('mode-btn');
const rating = document.getElementById('rating');
const pageContainer = document.getElementById('page-container');
const playBtn = document.getElementById('play-btn');
const repeatBtn = document.getElementById('repeat-btn');
const audioPlayer = document.getElementById('audio');
const modal = document.getElementById('modal');

const classHide = 'hide';
const startPage = 'Categories';

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

const currentState = {
  mode: MODES.train,
  gameStarted: false,
  wordsArray: [],
  word: {},
  correctAnswers: 0,
  wrongAnswers: 0,
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

const updateRating = (success) => {
  const star = document.createElement('img');

  star.setAttribute(
    'src',
    success ? '/assets/img/star-win.svg' : '/assets/img/star.svg',
  );
  star.setAttribute('alt', success ? 'win' : 'lose');

  rating.append(star);
};

const updateMode = () => {
  currentState.gameStarted = false;
  currentState.wordsArray = [];
  currentState.word = {};
  currentState.correctAnswers = 0;
  currentState.wrongAnswers = 0;

  const activeLink = getActiveLink();
  const pageAddRemove = currentState.mode === MODES.play ? 'add' : 'remove';

  modeBtn.textContent = currentState.mode;
  modeBtn.classList[pageAddRemove](MODES.play);
  sidenav.classList[pageAddRemove](MODES.play);

  rating.innerHTML = '';

  if (activeLink.textContent === startPage) {
    const elementsToUpdate = pageContainer.querySelectorAll('.badge');
    elementsToUpdate.forEach((e) => e.classList[pageAddRemove](MODES.play));

    playBtn.classList.add(classHide);
    repeatBtn.classList.add(classHide);
  } else {
    const elementsToUpdate = pageContainer.querySelectorAll('.card-content');
    elementsToUpdate.forEach((e) => e.classList[pageAddRemove](classHide));

    if (currentState.mode === MODES.play) {
      if (currentState.gameStarted) {
        playBtn.classList.add(classHide);
        repeatBtn.classList.remove(classHide);
      } else {
        playBtn.classList.remove(classHide);
        repeatBtn.classList.add(classHide);
      }
    } else {
      playBtn.classList.add(classHide);
      repeatBtn.classList.add(classHide);
    }

    document
      .querySelectorAll('.card.word.inactive')
      .forEach((e) => e.classList.remove('inactive'));
  }
};

const playNextWord = () => {
  if (currentState.wordsArray.length) {
    currentState.word = currentState.wordsArray.pop();

    playAudio(`/cards/${currentState.word.audioSrc}`);
  } else {
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalTitle = document.createElement('h2');
    const modalImg = document.createElement('img');

    if (currentState.wrongAnswers === 0) {
      modalTitle.textContent = 'You win!';
      modalImg.setAttribute('src', '/assets/img/success.jpg');
      modalImg.setAttribute('alt', 'success');

      setTimeout(() => playAudio(EFFECTS.success), 0);
    } else {
      modalTitle.textContent = `You have ${currentState.wrongAnswers} error(s)!`;
      modalImg.setAttribute('src', '/assets/img/failure.jpg');
      modalImg.setAttribute('alt', 'failure');

      setTimeout(() => playAudio(EFFECTS.failure), 0);
    }

    modalContent.append(modalTitle);
    modalContent.append(modalImg);

    modal.innerHTML = '';
    modal.append(modalContent);

    M.Modal.init(modal);
    const instance = M.Modal.getInstance(modal);
    instance.open();

    updateMode();
    sidenav.querySelector('a.top').click();
  }
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

  modeBtn.addEventListener('click', (e) => {
    currentState.mode = e.target.classList.contains(MODES.play)
      ? MODES.train
      : MODES.play;

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

      return;
    }

    if (!currentState.gameStarted) return;

    if (card.dataset.key === currentState.word.word) {
      card.classList.add('inactive');
      currentState.correctAnswers += 1;

      playAudio(EFFECTS.correct);
      updateRating(true);

      setTimeout(() => playNextWord(), 1000);
    } else if (!card.classList.contains('inactive')) {
      currentState.wrongAnswers += 1;

      playAudio(EFFECTS.error);
      updateRating(false);
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

  playBtn.addEventListener('click', () => {
    currentState.gameStarted = true;

    playBtn.classList.add(classHide);
    repeatBtn.classList.remove(classHide);

    currentState.wordsArray = [...cards[logo.textContent]].sort(
      () => Math.random() - 0.5,
    );

    setTimeout(() => playNextWord(), 500);
  });

  repeatBtn.addEventListener('click', () =>
    playAudio(`/cards/${currentState.word.audioSrc}`),
  );
};

renderSidenav();
renderPageContainer();

addListeners();
