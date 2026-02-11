// Активный пункт меню (десктоп)
document.querySelectorAll('.menu__link').forEach((link) => {
  link.addEventListener('click', function (e) {
    document
      .querySelectorAll('.menu__link')
      .forEach((l) => l.classList.remove('menu__link--active'));
    this.classList.add('menu__link--active');
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
// Открытие/закрытие мобильного меню
const burgerOpen = document.getElementById('burgerOpen');
const burgerClose = document.getElementById('burgerClose');
const mobileMenu = document.getElementById('mobileMenu');
burgerOpen.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});
burgerClose.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
});
// Активный пункт меню (мобильное)
document.querySelectorAll('.mobile-menu__link').forEach((link) => {
  link.addEventListener('click', function (e) {
    document
      .querySelectorAll('.mobile-menu__link')
      .forEach((l) => l.classList.remove('mobile-menu__link--active'));
    this.classList.add('mobile-menu__link--active');
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Закрыть меню
      if (mobileMenu) mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});
// Функция для изменения стиля cards-row в зависимости от размера экрана
function updateCardsRowStyle() {
  const cardsRow = document.querySelector('.cards-row');
  if (cardsRow) {
    if (window.innerWidth <= 900) {
      // Мобильная версия - flex
      cardsRow.style.display = 'flex';
      cardsRow.style.flexWrap = 'wrap';
      cardsRow.style.justifyContent = 'center';
      cardsRow.style.gap = '10px';
      // Убираем grid свойства
      cardsRow.style.gridTemplateColumns = '';
      cardsRow.style.gridAutoRows = '';
    } else {
      // Десктопная версия - grid
      cardsRow.style.display = 'grid';
      cardsRow.style.gridTemplateColumns = '1fr 1fr';
      cardsRow.style.gridAutoRows = 'min-content';
      cardsRow.style.gap = '32px';
      // Убираем flex свойства
      cardsRow.style.flexWrap = '';
      cardsRow.style.justifyContent = '';
    }
  }
}

// Вызываем функцию при загрузке страницы
window.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    var hero = document.querySelector('.hero-section');
    if (hero) hero.classList.add('visible');
  }, 100);
  updateCardsRowStyle();

  // Показываем карточки по умолчанию (категория "Premium")
  filterCards('premium');
  if (window.innerWidth < 432) {
    document.querySelectorAll('.bottles-down-mob-img').forEach((el) => {
      el.classList.add('visible');
    });
  }
  // Проверка возраста (теперь всегда показываем модалку)
  document.getElementById('ageModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.getElementById('ageYesBtn').onclick = function () {
    document.getElementById('ageModal').style.display = 'none';
    document.body.style.overflow = '';
  };
  document.getElementById('ageNoBtn').onclick = function () {
    window.location.href = 'https://www.google.com/';
  };
});

// Вызываем функцию при изменении размера окна
window.addEventListener('resize', updateCardsRowStyle);

// Функция для показа кнопки 'Показать все' и логики раскрытия
function showMoreButton(categoryCards) {
  // Удаляем старую кнопку, если есть
  let oldBtn = document.getElementById('showMoreBtn');
  if (oldBtn) oldBtn.remove();
  if (categoryCards.length > 4) {
    const btn = document.createElement('img');
    btn.src = './img/show-more.svg';
    btn.alt = 'Показать все';
    btn.id = 'showMoreBtn';
    btn.style.display = 'block';
    btn.style.margin = '5% auto 0 auto';
    btn.style.cursor = 'pointer';
    const cardsRow = document.querySelector('.cards-row');
    cardsRow.parentNode.insertBefore(btn, cardsRow.nextSibling);
    btn.addEventListener('click', function () {
      categoryCards.forEach((card) => (card.style.display = ''));
      btn.remove();
    });
  }
}

// Общая функция фильтрации карточек
function filterCards(flavor) {
  const cards = Array.from(document.querySelectorAll('.cards-row > .card'));
  let filteredCards = [];

  // Сначала скрываем ВСЕ карточки
  cards.forEach(function(card) {
    card.style.display = 'none';
    // Закрываем открытые карточки при переключении
    card.classList.remove('open');
    var more = card.querySelector('.card-more');
    if (more) more.classList.remove('open');
    var viewBtn = card.querySelector('.js-card-view-more');
    if (viewBtn) viewBtn.style.display = '';
  });

  if (flavor === 'prime') {
    // Prime — показываем только карточки с классом "prime"
    filteredCards = cards.filter(function(card) {
      return card.classList.contains('prime');
    });
  } else {
    // Premium — показываем все карточки кроме "soon" и "prime"
    filteredCards = cards.filter(function(card) {
      return !card.classList.contains('soon') && !card.classList.contains('prime');
    });
  }

  // Показываем первые 4 карточки
  filteredCards.forEach(function(card, i) {
    card.style.display = i < 4 ? '' : 'none';
  });

  showMoreButton(filteredCards);
}

// Обработчик фильтрации вкусов
document.querySelectorAll('.flavors-menu li[data-flavor]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    document
      .querySelectorAll('.flavors-menu li[data-flavor]')
      .forEach(function(l) { l.classList.remove('active'); });
    this.classList.add('active');
    var flavor = this.textContent.trim().toLowerCase();
    filterCards(flavor);
  });
});

// Анимация при скролле
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Наблюдаем за всеми info-block
document.querySelectorAll('.info-block').forEach((block) => {
  observer.observe(block);
});
// Наблюдаем за bg-text2 и block-premium
document.querySelectorAll('.bg-text2, .block-premium').forEach((el) => {
  observer.observe(el);
});
// Наблюдаем за bg-dop и кнопкой перейти
document.querySelectorAll('.bg-dop-img, .btn-go-link').forEach((el) => {
  observer.observe(el);
});
// Наблюдаем за бутылками и телеграм-блоком
document
  .querySelectorAll('.bottles-down-img, .bottles-down-mob-img, .telegram-block-inner')
  .forEach((el) => {
    observer.observe(el);
  });

// Открытие/закрытие информации о товаре в карточке
document.querySelectorAll('.js-card-view-more').forEach((btn) => {
  btn.addEventListener('click', function () {
    const card = btn.closest('.card');
    btn.style.display = 'none';
    const more = card.querySelector('.card-more');
    more.classList.add('open');
    card.classList.add('open');
  });
});
document.querySelectorAll('.js-card-close').forEach((btn) => {
  btn.addEventListener('click', function () {
    const card = btn.closest('.card');
    card.querySelector('.card-more').classList.remove('open');
    card.classList.remove('open');
    card.querySelector('.js-card-view-more').style.display = '';
  });
});

// Анимация при скролле для меню (фильтр)
const obsMenu = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);
document.querySelectorAll('.flavors-block').forEach((el) => obsMenu.observe(el));

function updateCardTitleFontSize() {
  document.querySelectorAll('.card-title').forEach((title) => {
    const spans = title.querySelectorAll('span');
    if (spans.length === 2) {
      title.classList.add('card-title--large');
    } else {
      title.classList.remove('card-title--large');
    }
  });
}
updateCardTitleFontSize();
// После фильтрации тоже обновлять
document.querySelectorAll('.flavors-menu li[data-flavor]').forEach((link) => {
  link.addEventListener('click', function () {
    setTimeout(updateCardTitleFontSize, 0);
  });
});

// Плавный скролл для ссылок в футере
const footerScrollMap = {
  Главная: '#hero-section',
  'О нас': '#main-content',
  Линейки: '#vkus-block',
};
document.querySelectorAll('.footer-link').forEach((link) => {
  link.addEventListener('click', function (e) {
    const text = this.textContent.trim();
    const href = footerScrollMap[text];
    if (href) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

const parCard1 = document.querySelector('.par__card1');
if (parCard1) {
  parCard1.style.cursor = 'pointer';
  parCard1.addEventListener('click', function () {
    window.open('https://t.me/closed_opt', '_blank');
  });
}

const parCard2 = document.querySelector('.par__card2');
if (parCard2) {
  parCard2.style.cursor = 'pointer';
  parCard2.addEventListener('click', function () {
    window.open('https://t.me/par_tovar_opt', '_blank');
  });
}

const parCard3 = document.querySelector('.par__card3');
if (parCard3) {
  parCard3.style.cursor = 'pointer';
  parCard3.addEventListener('click', function () {
    window.open('https://t.me/gamedov_095', '_blank');
  });
}

const parCard4 = document.querySelector('.par__card4');
if (parCard4) {
  parCard4.style.cursor = 'pointer';
  parCard4.addEventListener('click', function () {
    window.open('https://t.me/olegprem', '_blank');
  });
}

const parCard6 = document.querySelector('.par__card6');
if (parCard6) {
  parCard6.style.cursor = 'pointer';
  parCard6.addEventListener('click', function () {
    window.open('https://t.me/oggomsk', '_blank');
  });
}

const partner1 = document.querySelector('.partner-logo--1');
if (partner1) {
  partner1.style.cursor = 'pointer';
  partner1.addEventListener('click', function () {
    window.open('https://t.me/closed_opt', '_blank');
  });
}

const partner2 = document.querySelector('.partner-logo--2');
if (partner2) {
  partner2.style.cursor = 'pointer';
  partner2.addEventListener('click', function () {
    window.open('https://t.me/par_tovar_opt', '_blank');
  });
}

const partner3 = document.querySelector('.partner-logo--3');
if (partner3) {
  partner3.style.cursor = 'pointer';
  // partner3.addEventListener('click', function () {
  //   window.open('https://t.me/gamedov_095', '_blank');
  // });
}

const partner4 = document.querySelector('.partner-logo--4');
if (partner4) {
  partner4.style.cursor = 'pointer';
  partner4.addEventListener('click', function () {
    window.open('https://t.me/olegprem', '_blank');
  });
}

const partner8 = document.querySelector('.partner-logo--8');
if (partner8) {
  partner8.style.cursor = 'pointer';
  partner8.addEventListener('click', function () {
    window.open('https://t.me/oggoliquid', '_blank');
  });
}

// Анимация появления снизу вверх для partner__img и par__card
function animateOnScroll() {
  const animatedEls = document.querySelectorAll('.partner__img, .par__card');
  animatedEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('DOMContentLoaded', animateOnScroll);

// Прелоадер
window.addEventListener('load', function () {
  const preloader = document.querySelector('.preloader');
  setTimeout(function () {
    preloader.classList.add('hidden');

    // Удаляем прелоадер из DOM после завершения анимации
    setTimeout(function () {
      preloader.remove();
    }, 500);
  }, 1000); // Минимальное время показа прелоадера - 1 секунда
});

// Альтернатива на случай, если событие load не сработает
setTimeout(function () {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.classList.add('hidden');
    setTimeout(function () {
      preloader.remove();
    }, 500);
  }
}, 5000); // Максимальное время - 5 секунд
