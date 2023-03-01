import debounce from 'lodash.debounce';

// задати debounce по замовчуванню і можливість його вказувати при створені класу

// відслідкувати для 2, 3, 4, 5 сторінок
// поставити відступи зверху і знизу для пагінатора
// перевірити якщо задається не кількість елементів, а кількість сторінок
// зробити адаптивну верстку

export default class Pagination {
  #basePaginationClass = 'pagination__list';

  #refs = {
    pagination: undefined,
    btnPrew: undefined,
    btnPointsLeft: undefined,
    btnNext: undefined,
    btnPointsRight: undefined,
    btnsPages: undefined,
  };

  #classElements = {
    PREW: 'prew',
    PAGE: 'pagination__page',
    NEXT: 'next',
  };

  #typesEvents = {
    NEXT: 'next-page-number',
    PREW: 'prew-page-number',
    PAGE: 'select-page-number',
  };

  #events = [];

  #itemsPerPage = 8;
  #currentPage = 1;
  #totalItems = 1;
  #totalPages = 1;

  constructor() {
    this.#setBaseReferens();

    this.#isVisiblePagination(false);

    this.#setClickEvents();
  }

  setItemsPerPage(value) {
    this.#itemsPerPage = this.#checkValueItems(value);
    this.#calculateTotalPages();

    this.setCurrentPage();
  }

  setTotalItems(value) {
    this.#totalItems = this.#checkValueItems(value);
    this.#calculateTotalPages();

    this.setCurrentPage();
  }

  setTotalPages(value) {
    this.#totalPages = this.#checkValueItems(value);
    this.#calculateTotalItems();

    this.setCurrentPage();
  }

  addEventListener(eventName, callBackFunction) {
    const obj = {};
    obj[eventName] = callBackFunction;
    this.#events.push(obj);
  }

  setCurrentPage(value = 1) {
    this.#currentPage = this.#checkPageNumber(value);

    this.#visiblePaginationItems();
  }

  // ------------------------
  // section private function
  // ------------------------

  // об'єднати #visiblePages() і #setActiveItem() або і не треба
  #visiblePages() {
    this.#refs.btnsPages.forEach(elem => {
      if (+elem.dataset.value > 1 && +elem.dataset.value < 5) {
        if (+elem.dataset.value < this.#totalPages) {
          elem.classList.remove('pagination--none');
        } else {
          elem.classList.add('pagination--none');
        }
      }
    });
  }

  #setActiveItem() {
    this.#refs.btnsPages.forEach(elem => {
      if (+elem.innerText == this.#currentPage) {
        elem.classList.add('pagination__item--active');
      } else {
        elem.classList.remove('pagination__item--active');
      }
    });
  }

  #isVisiblePagination(value) {
    if (value && this.#totalPages > 1) {
      this.#refs.pagination.classList.remove('pagination--none');
    } else {
      this.#refs.pagination.classList.add('pagination--none');
    }
  }

  #setBaseReferens() {
    this.#refs.pagination = document.querySelector(
      '.' + this.#basePaginationClass
    );
    this.#refs.btnPointsLeft = document.querySelector(
      '.pagination__prew--more'
    );
    this.#refs.btnPointsRight = document.querySelector(
      '.pagination__next--more'
    );
    this.#refs.btnPrew = document.querySelector('.pagination__prew');
    this.#refs.btnNext = document.querySelector('.pagination__next');
    this.#refs.btnsPages = document.querySelectorAll('.pagination__page');
  }

  #calculateTotalPages() {
    this.#totalPages = Math.ceil(this.#totalItems / this.#itemsPerPage);
  }

  #calculateTotalItems() {
    this.#totalItems = this.#itemsPerPage * this.#totalPages;
  }

  #setClickEvents() {
    this.#refs.pagination.addEventListener('click', this.#onClick.bind(this));
  }

  #onClick(e) {
    if (e.target.classList.contains(this.#classElements.PREW)) {
      if (this.#currentPage == 1) {
        return;
      }
      this.#callEventByOnClick(this.#currentPage - 1, this.#typesEvents.PREW);
      return;
    }

    if (e.target.classList.contains(this.#classElements.PAGE)) {
      this.#callEventByOnClick(+e.target.innerText, this.#typesEvents.PAGE);
      return;
    }

    if (e.target.classList.contains(this.#classElements.NEXT)) {
      if (this.#currentPage == this.#totalPages) {
        return;
      }
      this.#callEventByOnClick(this.#currentPage + 1, this.#typesEvents.NEXT);
      return;
    }
  }

  #callEventByOnClick(newPage, eventName) {
    this.setCurrentPage(newPage);
    this.#callEvent(eventName);
  }

  #callEvent(eventName) {
    this.#events.forEach(elem => {
      if (elem[eventName]) {
        const callBack = elem[eventName];
        const e = {};
        e.name = eventName;
        e['page'] = this.#currentPage;
        callBack(e);
      }
    });
  }

  #visibleBtnPointsLeft() {
    if (this.#currentPage < 4 || this.#totalPages <= 5) {
      this.#refs.btnPointsLeft.classList.add('pagination--none');
    } else {
      this.#refs.btnPointsLeft.classList.remove('pagination--none');
    }
  }

  #visibleBtnPointsRigth() {
    if (this.#currentPage > this.#totalPages - 3 || this.#totalPages <= 5) {
      this.#refs.btnPointsRight.classList.add('pagination--none');
    } else {
      this.#refs.btnPointsRight.classList.remove('pagination--none');
    }
  }

  #disableBtnPrew() {
    if (this.#currentPage == 1) {
      this.#refs.btnPrew.classList.add('pagination__item--disabled');
    } else {
      this.#refs.btnPrew.classList.remove('pagination__item--disabled');
    }
  }

  #disableBtnNext() {
    if (this.#currentPage == this.#totalPages) {
      this.#refs.btnNext.classList.add('pagination__item--disabled');
    } else {
      this.#refs.btnNext.classList.remove('pagination__item--disabled');
    }
  }

  #checkValueItems(value) {
    if (value > 0) {
      return value;
    }
    return 1;
  }

  #checkPageNumber(value) {
    if (value < 1) {
      return 1;
    } else if (value > this.#totalPages) {
      return this.#totalPages;
    } else {
      return value;
    }
  }

  #visiblePaginationItems() {
    this.#visibleBtnPointsLeft();
    this.#visibleBtnPointsRigth();

    this.#disableBtnPrew();
    this.#disableBtnNext();

    this.#setPagesNumbers();
    this.#visiblePages();

    this.#setActiveItem();
    this.#isVisiblePagination(true);
  }

  #setPagesNumbers() {
    // стартове заповнення номерів сторінок з 1-ї до 4-ї, і встановлення останьої сторінки на 5-й елемент
    // "1" "2" "3" "4" "..." "10"
    this.#refs.btnsPages.forEach(elem => {
      if (+elem.dataset.value == 5) {
        elem.innerText = this.#totalPages;
      } else {
        elem.innerText = elem.dataset.value;
      }
    });

    // заповнення номерів сторінок якщо курсор знаходиться всередині списку
    // "1" "..." "х-1" "х" "х+1" "..." "10"
    if (this.#currentPage > 3 && this.#currentPage <= this.#totalPages - 2) {
      this.#refs.btnsPages.forEach(elem => {
        switch (+elem.dataset.value) {
          case 2:
            elem.innerText = this.#currentPage - 1;
            break;
          case 3:
            elem.innerText = this.#currentPage;
            break;
          case 4:
            elem.innerText = this.#currentPage + 1;
            break;
        }
      });
      return;
    }

    if (
      this.#currentPage > this.#totalPages - 2 &&
      this.#currentPage !== this.#totalPages &&
      this.#totalPages > 5
    ) {
      this.#refs.btnsPages.forEach(elem => {
        switch (+elem.dataset.value) {
          case 2:
            elem.innerText = this.#currentPage - 2;
            break;
          case 3:
            elem.innerText = this.#currentPage - 1;
            break;
          case 4:
            elem.innerText = this.#currentPage;
            break;
        }
      });
      return;
    }

    // заповнення номерів сторінок якщо курсор знаходитьсяв на останьому елементы
    // "1" "..." "7" "8" "9" "10"
    if (this.#currentPage == this.#totalPages && this.#totalPages > 4) {
      this.#refs.btnsPages.forEach(elem => {
        switch (+elem.dataset.value) {
          case 2:
            elem.innerText = this.#currentPage - 3;
            break;
          case 3:
            elem.innerText = this.#currentPage - 2;
            break;
          case 4:
            elem.innerText = this.#currentPage - 1;
            break;
        }
      });
      return;
    }
  }
}
