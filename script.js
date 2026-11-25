
document.addEventListener('DOMContentLoaded', () => {
  //Данные для табов программы
  const programs = {
    "Сила": {
      title: "Силовая база",
      desc: "Приседы, тяги, жимы с контролем техники. Растёт сила, плотность мышц и уверенность.",
      list: ["Работа со штангой и гантелями", "Прогрессия нагрузки", "Разбор техники на видео"],
      stats: [80, 60, 70]
    },
    "Калистеника": {
      title: "Свой вес — твой инструмент",
      desc: "Подтягивания, отжимания, стойки и базовые элементы с нуля.",
      list: ["Прогрессии для новичков", "Контроль корпуса", "Работа над гибкостью"],
      stats: [55, 85, 60]
    },
    "Выносливость": {
      title: "Дыхание и энергия",
      desc: "Интервальные форматы и кардио-блоки без изнурения.",
      list: ["Пульсовые зоны", "Контроль восстановления", "Короткие интенсивные сессии"],
      stats: [40, 90, 65]
    },
    "Мобильность": {
      title: "Свободное движение",
      desc: "Растяжка, суставная гимнастика и коррекция осанки.",
      list: ["Работа с «зажимами»", "Осанка и спина", "Профилактика травм"],
      stats: [30, 50, 95]
    }
  };

  const statLabels = ["Сила", "Выносливость", "Гибкость"];

  //Логика табов программы
  const tabsContainer = document.querySelector('#program-tabs');
  const programContent = document.querySelector('#program-content');

  /**
   * Назначение: отображает содержимое выбранной программы в блоке #program-content,
   * обновляет активное состояние кнопок табов и анимирует полосы статистики.
   * Параметры:
   * programKey — строковый ключ программы из объекта programs.
   * Побочные эффекты: изменяет DOM (innerHTML, классы is-active, inline-стиль width).
   */
  function renderProgram(programKey) {
    const { title, desc, list, stats } = programs[programKey];

    tabsContainer.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('is-active', btn.textContent === programKey);
    });

    let statsHTML = '';
    stats.forEach((val, i) => {
      statsHTML += `
        <div class="stat-bar">
          <i data-width="${val}"></i>
          <span>${statLabels[i]} · ${val}%</span>
        </div>`;
    });

    programContent.innerHTML = `
      <div class="program-card__info">
        <h3>${title}</h3>
        <p class="section__lead">${desc}</p>
        <ul class="program-card__list">
          ${list.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="program-card__stats">
        ${statsHTML}
      </div>
    `;

    requestAnimationFrame(() => {
      setTimeout(() => {
        programContent.querySelectorAll('.stat-bar i').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }, 30);
    });
  }

  Object.keys(programs).forEach(key => {
    const btn = document.createElement('button');
    btn.classList.add('tabs__btn');
    btn.textContent = key;
    btn.addEventListener('click', () => renderProgram(key));
    tabsContainer.appendChild(btn);
  });

  renderProgram("Сила");


  //Выбор даты и времени
  const dayNames = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const timeSlots = ["10:00", "12:00", "14:00", "17:00", "19:00"];
  
  const daySelector = document.querySelector('#day-selector');
  const timeSelector = document.querySelector('#time-selector');
  
  let selectedDate = null;
  let selectedTime = null;

for (let i = 1; i <= 7; i++) {
  const date = new Date();
  date.setDate(date.getDate() + i);

  const label = `${dayNames[date.getDay()]} ${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}`;

  const btn = document.createElement('button');
  btn.classList.add('day-btn');
  btn.innerHTML = label.replace(' ', '<br>'); 

  btn.addEventListener('click', () => {
    selectedDate = label; 
    selectedTime = null;

    daySelector.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b === btn));
    renderTimeSlots(date.getDate() * 7 + date.getDay());
  });

  daySelector.appendChild(btn);
}

  /**
   * Назначение: формирует и отображает список доступных временных слотов
   * для выбранного дня. Часть слотов блокируется по детерминированному правилу.
   * Параметры:
   * seed — числовое значение (сид), влияющее на то, какие слоты будут недоступны.
   * Побочные эффекты: очищает и заполняет #time-selector кнопками, навешивает обработчики click.
   */
  function renderTimeSlots(seed) {
    timeSelector.innerHTML = '';
    
    timeSlots.forEach((time, index) => {
      const btn = document.createElement('button');
      btn.classList.add('time-btn');
      btn.textContent = time;
      btn.disabled = (seed + index * 3) % 5 === 0;
      
      btn.addEventListener('click', () => {
        selectedTime = time;
        timeSelector.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b === btn));
      });
      
      timeSelector.appendChild(btn);
    });
  }


  //Отправка формы
  const bookingForm = document.querySelector('#booking-form');
  const formMessage = document.querySelector('#form-message');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = bookingForm.querySelector('input[name="name"]');
    const phoneInput = bookingForm.querySelector('input[name="phone"]');
    
    const isNameValid = nameInput.value.trim().length > 1;
    const isPhoneValid = phoneInput.value.replace(/\D/g, "").length >= 10;

    nameInput.classList.toggle('is-invalid', !isNameValid);
    phoneInput.classList.toggle('is-invalid', !isPhoneValid);

    if (!selectedDate || !selectedTime) {
      formMessage.style.color = "#e5484d";
      formMessage.textContent = "Выбери день и время слева";
      return;
    }

    if (!isNameValid || !isPhoneValid) {
      formMessage.style.color = "#e5484d";
      formMessage.textContent = "Проверь имя и телефон";
      return;
    }

    formMessage.textContent = '';
    openModal(nameInput.value.trim(), selectedDate, selectedTime);
    bookingForm.reset();

    //Сброс выбранного дня и времени
    selectedDate = null;
    selectedTime = null;
    daySelector.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
    timeSelector.innerHTML = '';
  });

  //Окно успешной записи
  const modal = document.querySelector('#success-modal');

    /**
   * Назначение: открывает модальное окно успешной записи и заполняет его данными пользователя.
   * Параметры:
   *   name — имя пользователя (строка);
   *   date — выбранная дата 
   *   time — выбранное время 
   * Побочные эффекты: добавляет класс is-open к #success-modal, блокирует прокрутку body,
   * устанавливает фокус на кнопку закрытия.
   */
  function openModal(name, date, time) {
    document.querySelector('#modal-name').textContent = name;
    document.querySelector('#modal-date').textContent = date;
    document.querySelector('#modal-time').textContent = time;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.querySelector('#modal-close').focus();
  }

  /**
   * Назначение: закрывает модальное окно успешной записи и снимает блокировку прокрутки.
   * Побочные эффекты: удаляет класс is-open у #success-modal, восстанавливает overflow body.
   */
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  modal.querySelector('.modal__backdrop').addEventListener('click', closeModal);
  document.querySelector('#modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });


  //Анимация при скролле
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');

      entry.target.querySelectorAll('[data-count]').forEach(counter => {
        const target = +counter.dataset.count;
        let current = 0;
        const step = Math.ceil(target / 40);
        
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          counter.textContent = current;
        }, 30);
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .section--dark').forEach(el => observer.observe(el));


  //Умная шапка (скрытие при скролле и активный пункт) 
  const header = document.querySelector('#main-header');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }
    lastScrollY = currentScrollY;

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (currentScrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('is-active');
      }
    });
  });


  //Логика тарифов
  const pricingTabs = document.querySelectorAll('.pricing__tab');
  const priceValues = document.querySelectorAll('.price-card__value');
  const pricePerLesson = document.querySelectorAll('.price-card__per');

  const basePrices = [18000, 32000, 45000];
  const basePerLesson = [4500, 4000, 3750];

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pricingTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const months = parseInt(tab.dataset.months);
      
      let discount = 0;
      if (months === 6) discount = 0.1;
      if (months === 12) discount = 0.2;

      priceValues.forEach((el, index) => {
        const newPrice = basePrices[index] * months * (1 - discount);
        el.textContent = newPrice.toLocaleString('ru-RU') + ' ₽';
      });

      pricePerLesson.forEach((el, index) => {
        const newPer = basePerLesson[index] * (1 - discount);
        el.textContent = newPer.toLocaleString('ru-RU') + ' ₽ / занятие';
      });
    });
  });


  //Галерея и лайтбокс
  const galleryTrack = document.querySelector('#gallery-track');
  
  //Массив с путями к картинкам для галереи
  const galleryImages = [
    "./images/gallery-1.jpg",
    "./images/gallery-2.jpg",
    "./images/gallery-3.jpg", 
    "./images/gallery-4.jpg", 
    "./images/gallery-5.jpg"
  ];

  /**
   * Назначение: формирует разметку галереи (дважды повторяет список изображений
   * для эффекта бесконечной ленты) и вставляет её в #gallery-track.
   * При отсутствии пути к изображению выводит заглушку.
   * Параметры: не предусмотрены (использует внешний массив galleryImages).
   * Побочные эффекты: изменяет innerHTML элемента #gallery-track.
   */
  function createGalleryItems() {
    let html = '';
    for(let i = 0; i < 2; i++) {
      galleryImages.forEach((src, index) => {
        //Если путь пустой — заглушка. Если есть — картинка.
        const content = src 
          ? `<img src="${src}" alt="Фото зала ${index + 1}" loading="lazy">` 
          : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#222; color:#555; font-family:'Unbounded',sans-serif; font-size:14px;">Фото ${index + 1}</div>`;

        html += `
          <div class="gallery-item" data-index="${index}">
            ${content}
          </div>
        `;
      });
    }
    galleryTrack.innerHTML = html;
  }
  
  createGalleryItems();

  //Логика лайтбокса
  const lightbox = document.querySelector('#lightbox');
  const lightboxImg = document.querySelector('#lightbox-img');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxBackdrop = document.querySelector('.lightbox__backdrop');
  const btnPrev = document.querySelector('.lightbox__arrow--prev');
  const btnNext = document.querySelector('.lightbox__arrow--next');

  let currentImageIndex = 0;

  galleryTrack.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;

    currentImageIndex = parseInt(item.dataset.index);
    updateLightboxImage();
    
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  /**
   * Назначение: обновляет изображение в лайтбоксе в соответствии с текущим индексом.
   * При отсутствии файла подставляет изображение-заглушку.
   * Параметры: не предусмотрены (использует currentImageIndex и galleryImages).
   * Побочные эффекты: изменяет атрибут src у #lightbox-img.
   */
  function updateLightboxImage() {
    lightboxImg.src = galleryImages[currentImageIndex] || `https://via.placeholder.com/1200x800/222/555?text=Фото+${currentImageIndex + 1}`;
  }

  /**
   * Назначение: переключает лайтбокс на следующее изображение (по кругу).
   * Побочные эффекты: изменяет currentImageIndex и вызывает updateLightboxImage().
   */
  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }

  /**
   * Назначение: переключает лайтбокс на предыдущее изображение (по кругу).
   * Побочные эффекты: изменяет currentImageIndex и вызывает updateLightboxImage().
   */
  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  btnNext.addEventListener('click', showNextImage);
  btnPrev.addEventListener('click', showPrevImage);

  /**
   * Назначение: закрывает лайтбокс и снимает блокировку прокрутки страницы.
   * Побочные эффекты: удаляет класс is-open у #lightbox, восстанавливает overflow body.
   */
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });


  //FAQ - плавный аккордеон
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('is-open');
      });

      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });

  //Мобильное меню
  const burger = document.querySelector('#burger');
  const mainNav = document.querySelector('#main-nav');

  /**
   * Назначение: открывает или закрывает мобильное меню и синхронизирует
   * состояние кнопки-бургера (класс и aria-expanded).
   * Параметры:
   * open — логическое значение: true — открыть, false — закрыть.
   * Побочные эффекты: изменяет классы is-open у #main-nav и #burger,
   * устанавливает атрибут aria-expanded.
   */
  function setMenu(open) {
    mainNav.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  }

  burger.addEventListener('click', () => setMenu(!mainNav.classList.contains('is-open')));
  mainNav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.header')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('scroll', () => setMenu(false), { passive: true });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) setMenu(false); });
});