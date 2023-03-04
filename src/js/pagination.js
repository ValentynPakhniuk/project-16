import throttle from 'lodash.throttle';

// Функціонал:
// - може перебирати сторінки як за допомогою кнопок "Next", "Prew", так і прямим натисканням
//   на номер сторінки
// - слідкує на шириною робочої області і автоматично перебудовується під ширину екрану
// - надає події, по яким можна відсідковувати натискання на пагінаторі і повертає тип події і
//   сформований номер сторінки
// - кількість сторінок можна задавати як за допомогою вказання кількості сторінок або загальну
//   кількість елементів, що повертає сервер
// - можна задати активний номер сторінки (якщо необхідно використати попепедньо збережений номер з
//   локального сховища)
//
// Порядк дій по роботу з класом
// 1. Ініцілізація
// const pagination = new Pagination([screenSizeRefreshRate = 300], [clickPageRefreshRate = 1000]);
// screenSizeRefreshRate - швидкість реагування на змінення розміру стірнки
// clickPageRefreshRate - інтервал через який можна буде повторно натиснути на кнопку пагінації
//
// 2. Події
// клас ініціює 3 події:
// 'next-page-number' - натискання на кнопку Next
// 'prew-page-number' - натискання на кнопку Prew
// 'select-page-number' - натискання на номер сторінки
//    Використання:
//      pagination.addEventListener('next-page-number', callBackFunction);
//      pagination.addEventListener('prew-page-number', callBackFunction);
//      pagination.addEventListener('select-page-number', callBackFunction);
//    на всі події можна повішати одну і туж саму функцію
//    callBackFunction (e) => {}
//    e - це об'єкт, який містить назву події і номер поточної сторінки, яку обрали на пагінаторі
//    приклади:
//      {name: 'select-page-number', page: 2}
//      {name: 'next-page-number', page: 3}
//      {name: 'prew-page-number', page: 4}
//
// 3. Методи класу:
//
// setItemsPerPage(value = 8) - встановити кількість елементів на сторінці
// setTotalItems(value)       - встановити загальну кількість елементів, які повертає сервер
// setTotalPages(value)       - встановити загальну кількість сторінок, які повертає сервер
// setCurrentPage(value = 1)  - встановити поточнку сторінку (можна вставновити початкову
//                              сторінку якщо вона буде вичитуватися з локального сховища)
// Для того, щоб пагінатор включився достатньо використати setTotalItems або setTotalPages
// Якщо задати кількість елементів або сторінок так що вийде всього одна сторінка, або менше,
// то пагінатор буде приховано.
//
// 4. Приклад роботи:
//
// import Pagination from './js/pagination';
// const pagination = new Pagination();
// pagination.addEventListener('next-page-number', callback);
// pagination.addEventListener('prew-page-number', callback);
// pagination.addEventListener('select-page-number', callback);
// pagination.setItemsPerPage(10);
//
// function callback(e) {
//   console.log(e);
// }
//
// pagination.setTotalItems(100);
//
//  Буде відображено пагінатор на 10 сторінок, так як задано кількість елментів на сторінці = 10.
//

export default class Pagination {
  #basePaginationClass = 'pagination__list';
  #baseClassUnVisibleElement = 'pagination--none';
  #baseClaseDisabledElement = 'pagination__item--disabled';
  #baseClassActiveElement = 'pagination__item--active';

  #tabletWidth = 768;
  #screenWidthType = {
    mobile: false,
    tablet: false,
  };

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

  #screenSizeRefreshRate = 300;
  #clickPageRefreshRate = 1000;

  #itemsPerPage = 8;
  #currentPage = 1;
  #totalItems = 1;
  #totalPages = 1;

  constructor(screenSizeRefreshRate = 300, clickPageRefreshRate = 1000) {
    this.#screenSizeRefreshRate = screenSizeRefreshRate;
    this.#clickPageRefreshRate = clickPageRefreshRate;

    this.#setBaseReferens();

    this.#isVisiblePagination(false);

    this.#setClickEvents();
    this.#setResizeWindowEvent();
  }

  setItemsPerPage(value = 8) {
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
          elem.classList.remove(this.#baseClassUnVisibleElement);
        } else {
          elem.classList.add(this.#baseClassUnVisibleElement);
        }
      }
    });
  }

  #setActiveItem() {
    this.#refs.btnsPages.forEach(elem => {
      if (+elem.innerText == this.#currentPage) {
        elem.classList.add(this.#baseClassActiveElement);
      } else {
        elem.classList.remove(this.#baseClassActiveElement);
      }
    });
  }

  #isVisiblePagination(value) {
    if (value && this.#totalPages > 1) {
      this.#refs.pagination.classList.remove(this.#baseClassUnVisibleElement);
    } else {
      this.#refs.pagination.classList.add(this.#baseClassUnVisibleElement);
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
    this.#refs.pagination.addEventListener(
      'click',
      throttle(this.#onClick.bind(this), this.#clickPageRefreshRate, {
        trailing: false,
      })
    );
  }

  #setResizeWindowEvent() {
    this.#setInitValeyScreenWidthType();

    window.addEventListener(
      'resize',
      throttle(
        this.#callbackResizeWindow.bind(this),
        this.#screenSizeRefreshRate
      )
    );
  }

  #setInitValeyScreenWidthType() {
    this.#setWindowsScreenType(window.screen.availWidth);
  }

  #callbackResizeWindow(e) {
    const oldScreenWidthType = this.#screenWidthType.mobile;

    this.#setWindowsScreenType(window.screen.availWidth);

    if (oldScreenWidthType !== this.#screenWidthType.mobile) {
      this.#visiblePaginationItems();
    }
  }

  #setWindowsScreenType(width) {
    if (width < this.#tabletWidth) {
      this.#screenWidthType.mobile = true;
      this.#screenWidthType.tablet = false;
    } else {
      this.#screenWidthType.mobile = false;
      this.#screenWidthType.tablet = true;
    }
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
    if (this.#screenWidthType.mobile) {
      if (this.#currentPage < 3 || this.#totalPages <= 3) {
        this.#refs.btnPointsLeft.classList.add(this.#baseClassUnVisibleElement);
      } else {
        this.#refs.btnPointsLeft.classList.remove(
          this.#baseClassUnVisibleElement
        );
      }
    } else {
      if (this.#currentPage < 4 || this.#totalPages <= 5) {
        this.#refs.btnPointsLeft.classList.add(this.#baseClassUnVisibleElement);
      } else {
        this.#refs.btnPointsLeft.classList.remove(
          this.#baseClassUnVisibleElement
        );
      }
    }
  }

  #visibleBtnPointsRigth() {
    if (this.#screenWidthType.mobile) {
      if (this.#currentPage > this.#totalPages - 2 || this.#totalPages <= 3) {
        this.#refs.btnPointsRight.classList.add(
          this.#baseClassUnVisibleElement
        );
      } else {
        this.#refs.btnPointsRight.classList.remove(
          this.#baseClassUnVisibleElement
        );
      }
    } else {
      if (this.#currentPage > this.#totalPages - 3 || this.#totalPages <= 5) {
        this.#refs.btnPointsRight.classList.add(
          this.#baseClassUnVisibleElement
        );
      } else {
        this.#refs.btnPointsRight.classList.remove(
          this.#baseClassUnVisibleElement
        );
      }
    }
  }

  #disableBtnPrew() {
    if (this.#currentPage == 1) {
      this.#refs.btnPrew.classList.add(this.#baseClaseDisabledElement);
    } else {
      this.#refs.btnPrew.classList.remove(this.#baseClaseDisabledElement);
    }
  }

  #disableBtnNext() {
    if (this.#currentPage == this.#totalPages) {
      this.#refs.btnNext.classList.add(this.#baseClaseDisabledElement);
    } else {
      this.#refs.btnNext.classList.remove(this.#baseClaseDisabledElement);
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
    this.#setPagesNumbersFirstPass();

    if (this.#screenWidthType.mobile) {
      this.#setPagesNumbersForMobile();
    } else {
      this.#setPagesNumbersForTablet();
    }
  }

  #setPagesNumbersForMobile() {
    if (this.#setPagesNumbersWhenCurrentPageInCenterAndLeftPartListForMobile())
      return;

    if (this.#setPagesNUmbersWhetCurrentPageInRightPartForMobile()) return;

    this.#setPagesNumbersLastPassForMobile();
  }

  #setPagesNumbersForTablet() {
    if (this.#setPagesNumbersWhenCurrentPageInCenterAndLeftPartListForTablet())
      return;

    if (this.#setPagesNUmbersWhetCurrentPageInRightPartFortablet()) return;

    this.#setPagesNumbersLastPassForTablet();
  }

  #setPagesNumbersFirstPass() {
    // стартове заповнення номерів сторінок з 1-ї до 4-ї, і встановлення останьої сторінки на 5-й елемент
    // "1" "2" "3" "4" "..." "10"
    this.#refs.btnsPages.forEach(elem => {
      if (+elem.dataset.value == 5) {
        elem.innerText = this.#totalPages;
      } else {
        elem.innerText = elem.dataset.value;
      }
    });
  }

  #setPagesNumbersWhenCurrentPageInCenterAndLeftPartListForMobile() {
    // "1" "..." "3" "4" "5" "..." "10"
    if (this.#currentPage > 2 && this.#currentPage <= this.#totalPages - 1) {
      this.#refs.btnsPages.forEach(elem => {
        if (+elem.dataset.value == 2) {
          elem.innerText = this.#currentPage;
        }
      });
      return true;
    }
    return false;
  }

  #setPagesNUmbersWhetCurrentPageInRightPartForMobile() {
    if (
      this.#currentPage > this.#totalPages - 2 &&
      this.#currentPage !== this.#totalPages &&
      this.#totalPages > 5
    ) {
      this.#refs.btnsPages.forEach(elem => {
        if (+elem.dataset.value == 2) {
          elem.innerText = this.#currentPage;
        }
      });
      return true;
    }
    return false;
  }

  #setPagesNumbersLastPassForMobile() {
    // заповнення номерів сторінок якщо курсор знаходитьсяв на останьому елементы
    // "1" "..." "7" "8" "9" "10"
    if (this.#currentPage == this.#totalPages && this.#totalPages > 2) {
      this.#refs.btnsPages.forEach(elem => {
        if (+elem.dataset.value == 2) {
          elem.innerText = this.#currentPage - 1;
        }
      });
    }
  }

  #setPagesNumbersWhenCurrentPageInCenterAndLeftPartListForTablet() {
    // "1" "..." "3" "4" "5" "..." "10"
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
      return true;
    }
    return false;
  }

  #setPagesNUmbersWhetCurrentPageInRightPartFortablet() {
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
      return true;
    }
    return false;
  }

  #setPagesNumbersLastPassForTablet() {
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
    }
  }
}
