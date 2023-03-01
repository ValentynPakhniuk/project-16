const refs = {
    pagination: document.querySelector('#pagination'),
    cardList: document.querySelector('.list-card'),
    fatherEl: document.querySelector('.error-content')
}


function checkContent(lengthList) {
    const { pagination, cardList } = refs;

    if (lengthList > 0) {

        return
    }
    console.log('I here')

    pagination.style.display = 'none';
    cardList.style.display = 'none';
    marckupError();

}

checkContent(1)

function marckupError() {
    //     refs.fatherEl.innerHTML = `
    //     <p class="title-error">We haven’t found news from this category</p>

    //   <div class="img-p">
    //     <picture>
    //       <source
    //         srcset="
    //         ${}
    //           ./images/desktop-not-found.png    1x,
    //           ./images/desktop-not-found@2x.png 2x
    //         "
    //         media="(min-width: 1280px)"
    //       />
    //       <source
    //         srcset="
    //           ./images/tablet-not-found.png    1x,
    //           ./images/tablet-not-found@2x.png 2x
    //         "
    //         media="(min-width: 768px)"
    //       />
    //       <source
    //         srcset="
    //           ./images/mobile-not-found.png    1x,
    //           ./images/mobile-not-found@2x.png 2x
    //         "
    //         media="(max-width: 767px)"
    //       />

    //       <img src="./images/desktop-not-found.png" alt="page not found" />
    //     </picture>
    //     `
}



console.log(refs.pagination)