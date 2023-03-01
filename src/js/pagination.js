import debounce from 'lodash.debounce';

// задати debounce по замовчуванню і можливість його вказувати при створені класу

export default class Pagination {
  #refs = {
    prew: undefined,
    prewMore: undefined,
    next: undefined,
    nextMore: undefined,
    pages: undefined,
  };

  #classElements = {
    PREW: 'prew',
    PAGE: 'pagination__page',
    NEXT: 'next',
  };

  #typesEvents = {
    NEXT: 'next',
    PREW: 'prew',
    PAGE: 'page',
  };
  #events = [];
  #currentPage = 1;
  #totalItems = 1;
  #itemsPerPage = 8;
  #totalPages = 1;
  #parentClass = '.pagination__list';
  #isAddEventListener = false;

  constructor() {
    this.#refs.prewMore = document.querySelector('.pagination__prew--more');
    this.#refs.nextMore = document.querySelector('.pagination__next--more');
    this.#refs.prew = document.querySelector('.pagination__prew');
    this.#refs.next = document.querySelector('.pagination__next');
    this.#refs.pages = document.querySelectorAll('.pagination__page');
    this.setCurrentPage(1);
  }

  setItemsPerPage(value) {
    this.#currentPage = 1;
    this.#itemsPerPage = this.#checkValueItems(value);
    this.#calculateTotalPages();
    this.createPaginator();
  }

  setTotalItems(value) {
    this.#currentPage = 1;
    this.#totalItems = this.#checkValueItems(value);
    this.#calculateTotalPages();
    this.createPaginator();
    this.#visiblePages();
  }

  setTotalPages(value) {
    this.#currentPage = 1;
    this.#totalPages = this.#checkValueItems(value);
    this.createPaginator();
    this.#visiblePages();
  }

  setCurrentPage(value) {
    this.#currentPage = this.#checkPageNumber(value);

    console.log('setCurrentPage');

    this.#generateElement();
  }

  addEventListener(eventName, callBackFunction) {
    console.log('add event ' + eventName);

    const obj = {};
    console.log(obj);
    obj[eventName] = callBackFunction;
    console.log(obj);
    this.#events.push(obj);

    console.log(this.#events);
  }

  createPaginator() {
    // створити сам пагінатор
    this.#setClickEvents();

    this.#generateElement();
  }

  #generateElement() {
    this.#visiblePrewMore();
    this.#visibleNextMore();
    this.#disablePrewAndNext();
    this.#setPagesNumbers();
    this.#setActiveItem();
  }

  #disablePrewAndNext() {
    this.#refs.next.classList.remove('pagination__item--disabled');
    this.#refs.prew.classList.remove('pagination__item--disabled');
    switch (this.#currentPage) {
      case 1:
        this.#refs.prew.classList.add('pagination__item--disabled');
        break;
      case this.#totalPages:
        this.#refs.next.classList.add('pagination__item--disabled');
        break;
    }

    if (this.#currentPage < 1) {
    }
  }

  #setPagesNumbers() {
    console.log(this.#currentPage);

    this.#refs.pages.forEach(elem => {
      if (+elem.dataset.value == 5) {
        elem.innerText = this.#totalPages;
      } else {
        elem.innerText = elem.dataset.value;
      }
    });

    if (this.#currentPage > 3 && this.#currentPage <= this.#totalPages - 2) {
      this.#refs.pages.forEach(elem => {
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
      this.#currentPage !== this.#totalPages
    ) {
      this.#refs.pages.forEach(elem => {
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

    if (this.#currentPage == this.#totalPages) {
      this.#refs.pages.forEach(elem => {
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

  #visiblePrewMore() {
    if (this.#currentPage < 4) {
      this.#refs.prewMore.classList.add('pagination--none');
    } else {
      this.#refs.prewMore.classList.remove('pagination--none');
    }
  }

  #visibleNextMore() {
    if (this.#currentPage > this.#totalPages - 3 || this.#totalPages <= 5) {
      this.#refs.nextMore.classList.add('pagination--none');
    } else {
      this.#refs.nextMore.classList.remove('pagination--none');
    }
  }

  #visiblePages() {
    this.#refs.pages.forEach(elem => {
      if (elem.dataset.value <= this.#totalPages) {
        elem.classList.remove('pagination--none');
      } else {
        elem.classList.add('pagination--none');
      }
    });
  }

  #setClickEvents() {
    if (!this.#isAddEventListener) {
      const ref = document.querySelector(this.#parentClass);
      ref.addEventListener('click', this.#onClick.bind(this));
      this.#isAddEventListener = true;
    }
  }

  #onClick(e) {
    let eventName = '';
    let newPage = 0;

    console.log(e.target.classList + ' ' + e.currentTarget.classList);

    if (e.target.classList.contains(this.#classElements.PREW)) {
      if (this.#currentPage == 1) {
        return;
      }
      newPage = this.#currentPage - 1;
      eventName = this.#typesEvents.PREW;
    } else if (e.target.classList.contains(this.#classElements.PAGE)) {
      newPage = +e.target.innerText;
      eventName = this.#typesEvents.PAGE;
    } else if (e.target.classList.contains(this.#classElements.NEXT)) {
      if (this.#currentPage == this.#totalPages) {
        return;
      }
      newPage = this.#currentPage + 1;
      eventName = this.#typesEvents.NEXT;
    } else {
      console.log('exit');
      return;
    }
    this.setCurrentPage(newPage);
    this.#callEvent(eventName);
  }

  #setActiveItem() {
    this.#refs.pages.forEach(elem => {
      if (+elem.innerText == this.#currentPage) {
        elem.classList.add('pagination__item--active');
      } else {
        elem.classList.remove('pagination__item--active');
      }
    });
  }

  #callEvent(eventName) {
    console.log('event ' + eventName);

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

  #calculateTotalPages() {
    this.#totalPages = Math.ceil(this.#totalItems / this.#itemsPerPage);
  }
}
