import cards from '../cards/cards';

const categories = Object.keys(cards);

const key = 'stats';

const saveStats = (stats) => {
  localStorage.setItem(key, JSON.stringify(stats));
};

const resetStats = () => {
  const stats = {};

  categories.forEach((category) => {
    stats[category] = [];

    cards[category].forEach((word) => {
      stats[category].push({
        word: word.word,
        translation: word.translation,
        trains: 0,
        corrects: 0,
        errors: 0,
      });
    });

    saveStats(stats);
  });

  return stats;
};

const loadStats = () => {
  const stats = localStorage.getItem(key);
  if (stats && Object.keys(stats).length > 0) {
    return JSON.parse(stats);
  }

  return resetStats();
};

export { saveStats, resetStats, loadStats };
