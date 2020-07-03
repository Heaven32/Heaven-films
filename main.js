const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = 'f2a1e6032c70a333bbaf1df6208d360f';

// menu
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('modal__link');

//preloader
const loading = document.createElement('div');
loading.className = 'loading';

//server
const DBService = class {
    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        }
    }

    getTestData = () => {
        return this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('card.json');
    }
}

const renderCard = response => {

    tvShowsList.textContent = '';

    response.results.forEach(item => {

        const { 
            backdrop_path: backdrop, 
            name: title, 
            poster_path: poster, 
            vote_average: vote 
        } = item;

        const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropImg = backdrop ? IMG_URL + backdrop : '';
        const voteEl = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.className = 'tv-shows__item';
        card.innerHTML = `
            <a href="#" class="tv-card">
                ${voteEl}
                <img class="tv-card__img"
                    src="${posterImg}"
                    data-backdrop="${backdropImg}"
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;

        loading.remove();
        tvShowsList.append(card);
    });
};

{
    tvShows.append(loading);
    new DBService().getTestData().then(renderCard);
}

// open/closed menu

hamburger.addEventListener('click', event => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});

leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }
});

// open modal window

tvShowsList.addEventListener('click', event => {
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {

        new DBService().getTestCard()   
            .then(data => {
                console.log(data);
                tvCardImg.src = IMG_URL + data.poster_path;
                modalTitle.textContent = data.name;
                //genresList.innerHTML = data.genres.reduce((acc, item) =>`${acc} <li>${item.name}</li>`, '');
                rating
                description
                modalLink 
            })

        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }
});

// closed modal window

modal.addEventListener('click', event => {
    const cross = event.target.closest('.cross');
    const modalX = event.target.classList.contains('modal');

    if (cross || modalX) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});

// change card

const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');

    if (card) {
        const img = card.querySelector('.tv-card__img');
        const changeImg = img.dataset.backdrop;
        
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        }

        // another
        // if (changeImg) {
        //     img.dataset.backdrop = img.src;
        //     img.src = changeImg;
        // }
    }
};

tvShowsList.addEventListener("mouseover", changeImage);
tvShowsList.addEventListener("mouseout", changeImage);


