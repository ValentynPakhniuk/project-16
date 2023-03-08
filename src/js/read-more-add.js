import {
    STORAGE_KEY_READ,
    VISUALLY_HIDDEN_CLASS,
    
    ADD_READ_BTN,
    REMOTE_READ_BTN,
    ADD_FAVORITE_BTN,
    LIST_CARD_SELECTOR,
  } from './constants';
  
  const FAVORITE_PAGE_PATH = '/read.html';
  
  const newsList = document.querySelector(LIST_CARD_SELECTOR);
  newsList.addEventListener('click', saveReadNews);
  //newsList.addEventListener('click', removeFavorite);
  let idFrom=[]; 
  function saveReadNews(e) {
    //e.preventDefault();
    if (e.target.classList.contains(ADD_READ_BTN)) {





      const elementBlockPhoto2 = e.target.parentElement;

      const elementCard = elementBlockPhoto2.parentElement;
      const elementBlockPhoto = elementCard.children[0]
      //console.log(elementCard)
      console.log(elementBlockPhoto)
  
      const readObj = {};
      readObj.imgUrl = elementBlockPhoto.children[0].src;
      
      readObj.category = elementBlockPhoto.children[1].innerText;
      readObj.title = elementCard.children[1].innerText;
      readObj.text = elementCard.children[2].innerText;
      readObj.date = elementCard.children[3].children[0].innerText;
      readObj.readMoreLink = elementCard.children[3].children[1].href;
      readObj.id = elementCard.id;
                   
                            

                                   
                        

      const savedApiData2 =
        JSON.parse(localStorage.getItem(STORAGE_KEY_READ)) || [];
      savedApiData2.push(readObj);
  
      localStorage.setItem(STORAGE_KEY_READ, JSON.stringify(savedApiData2));
                        
            // }  }         
  
    
    }

  }
  const parsedNews = JSON.parse(localStorage.getItem(STORAGE_KEY_READ)) || [];

  parsedNews.forEach(element => {
    console.log(element.id,"ele")
    idFrom.push(element.id);
  });
  console.log(idFrom, "ele2")


//console.log(idFrom)

//   function removeFavorite(e) {
//     if (e.target.classList.contains(REMOTE_FAVORITE_BTN)) {
//       const currentLi = e.target.parentElement.parentElement;
//       const currentId = currentLi.id;
  
//       const savedData =
//         JSON.parse(localStorage.getItem(STORAGE_KEY_FAVORITE)) || [];
  
//       const newSavedData = savedData.filter(item => item.id !== currentId);
  
//       localStorage.setItem(STORAGE_KEY_FAVORITE, JSON.stringify(newSavedData));
  
//       turnOffFavorite(currentLi);
  
//       visibleNoData();
//     }
//   }
  
//   function turnOffFavorite(elem) {
//     if (window.location.pathname.includes(FAVORITE_PAGE_PATH)) {
//       elem.remove();
//     } else {
//       elem
//         .querySelector(`.${REMOTE_FAVORITE_BTN}`)
//         .classList.add(VISUALLY_HIDDEN_CLASS);
//       elem
//         .querySelector(`.${ADD_FAVORITE_BTN}`)
//         .classList.remove(VISUALLY_HIDDEN_CLASS);
//     }
//   }
  
//   function visibleNoData() {
//     if (window.location.pathname.includes(READ_PAGE_PATH)) {
//       const savedData =
//         JSON.parse(localStorage.getItem(STORAGE_KEY_FAVORITE)) || [];
//       const noDataBlock = document.querySelector('.no-data .error');
//       const containerCardList = document.querySelector('.container.list__cards');
//       if (savedData.length == 0) {
//         noDataBlock.querySelector('.title-error').innerHTML =
//           'We haven’t found <br> favorite news';
//         noDataBlock.classList.remove(VISUALLY_HIDDEN_CLASS);
//         containerCardList.classList.add(VISUALLY_HIDDEN_CLASS);
//       } else {
//         noDataBlock.classList.add(VISUALLY_HIDDEN_CLASS);
//         containerCardList.classList.remove(VISUALLY_HIDDEN_CLASS);
//       }
//     }
//   }
  
//    visibleNoData();
  