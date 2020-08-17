import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min';

import './styles.css';
import cards from './cards/cards';
import {
  classHide,
  startPage,
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
  statsPage,
} from './helpers/constants';
import { getActiveLink, playAudio, sortTable } from './helpers/utils';
import { createCategoryCard, createWordCard } from './helpers/creators';
import { loadStats, saveStats } from './helpers/stats';

const categories = Object.keys(cards);

const currentState = {
  mode: MODES.train,
  gameStarted: false,
  wordsArray: [],
  word: {},
  correctAnswers: 0,
  wrongAnswers: 0,
  stats: {},
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
  } else if (activeLink.textContent === statsPage) {
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

  const li = document.createElement('li');
  li.innerHTML = `<a href="#" class="bottom">${statsPage}</a>`;
  sidenav.append(li);
};

const renderPageContainer = () => {
  const activeLink = getActiveLink();
  logo.textContent = activeLink.textContent;

  if (logo.textContent === statsPage) {
    const statsTable = document.createElement('table');
    statsTable.className = 'striped responsive-table';

    const statsTHead = document.createElement('thead');
    const statsTR = document.createElement('tr');

    const statsTH1 = document.createElement('th');
    statsTH1.textContent = 'Category';

    const statsTH2 = document.createElement('th');
    statsTH2.textContent = 'Word';

    const statsTH3 = document.createElement('th');
    statsTH3.textContent = 'Translation';

    const statsTH4 = document.createElement('th');
    statsTH4.textContent = 'Trains';

    const statsTH5 = document.createElement('th');
    statsTH5.textContent = 'Plays';

    const statsTH6 = document.createElement('th');
    statsTH6.textContent = 'Errors';

    const statsTH7 = document.createElement('th');
    statsTH7.textContent = '% errors';

    const statsTBody = document.createElement('tbody');

    statsTR.append(statsTH1);
    statsTR.append(statsTH2);
    statsTR.append(statsTH3);
    statsTR.append(statsTH4);
    statsTR.append(statsTH5);
    statsTR.append(statsTH6);
    statsTR.append(statsTH7);

    statsTHead.append(statsTR);

    statsTable.append(statsTHead);
    statsTable.append(statsTBody);

    categories.forEach((category) => {
      currentState.stats[category].forEach((word) => {
        const total = word.corrects + word.errors;
        const row = statsTBody.insertRow();

        row.insertCell().textContent = category;
        row.insertCell().textContent = word.word;
        row.insertCell().textContent = word.translation;
        row.insertCell().textContent = word.trains;
        row.insertCell().textContent = total;
        row.insertCell().textContent = word.errors;
        row.insertCell().textContent =
          total === 0 ? 0 : Math.round((word.errors * 100) / total);
      });
    });

    pageContainer.innerHTML = '';
    pageContainer.append(statsTable);

    statsTH1.addEventListener('click', () => sortTable(statsTable, 0));
    statsTH2.addEventListener('click', () => sortTable(statsTable, 1));
    statsTH3.addEventListener('click', () => sortTable(statsTable, 2));
    statsTH4.addEventListener('click', () => sortTable(statsTable, 3));
    statsTH5.addEventListener('click', () => sortTable(statsTable, 4));
    statsTH6.addEventListener('click', () => sortTable(statsTable, 5));
    statsTH7.addEventListener('click', () => sortTable(statsTable, 6));
  } else {
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
  }

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

      currentState.stats[logo.textContent].find(
        (w) => w.word === word.word,
      ).trains += 1;
      saveStats(currentState.stats);

      return;
    }

    if (!currentState.gameStarted) return;

    if (card.dataset.key === currentState.word.word) {
      card.classList.add('inactive');
      currentState.correctAnswers += 1;

      playAudio(EFFECTS.correct);
      updateRating(true);

      currentState.stats[logo.textContent].find(
        (w) => w.word === currentState.word.word,
      ).corrects += 1;
      saveStats(currentState.stats);

      setTimeout(() => playNextWord(), 1000);
    } else if (!card.classList.contains('inactive')) {
      currentState.wrongAnswers += 1;

      playAudio(EFFECTS.error);
      updateRating(false);

      currentState.stats[logo.textContent].find(
        (w) => w.word === currentState.word.word,
      ).errors += 1;
      saveStats(currentState.stats);
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

currentState.stats = loadStats();

renderSidenav();
renderPageContainer();

addListeners();
