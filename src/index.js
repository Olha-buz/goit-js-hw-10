import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

Notiflix.Notify.init({
width: '300px',
position: 'right-top',
});

const selector = document.querySelector('.breed-select');
const divInfoCat = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

loader.style.display = 'none';
divInfoCat.style.display = 'none';
error.style.display = 'none';
selector.style.display = 'none';

let slim;


fetchBreeds()
    .then(breeds => {
        // Notiflix.Notify.info('Loading data, please wait...');
        selector.innerHTML = createOptionsList(breeds);
        slim = selector.slim.open();
    })
    .catch((error) => {
        Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!')
    })
    .finally(_ => loader.style.display = 'none');


function createOptionsList(breeds) {
    return breeds
        .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
        .join('\n');
}

selector.addEventListener('change', onSelectBreed);

function onSelectBreed(evt) {
    Notiflix.Notify.info('Loading data, please wait...');
    slim = selector.slim.close;
    loader.style.display = 'initial';
    divInfoCat.style.display = 'none';
    const breedId = evt.currentTarget.value;
    fetchCatByBreed(breedId)
        .then(data => {
            divInfoCat.style.display = 'flex';
            divInfoCat.innerHTML = createInfoCat(data);
        })
        .catch(error => {
            divInfoCat.style.display = 'none';
            console.log(error);
            error.style.display = 'initial';
            Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
        })
        .finally(_ => {
            loader.style.display = 'none';
            slim = selector.slim.open();
        })
} 

function createInfoCat(data) {
    const { url, breeds } = data[0];
    const { name, description, temperament } = breeds[0];
    return `<img src=${url} alt=${name} width="360">
            <div>
               <h1>${name}</h1>
               <p>${description}</p>
               <p><span>Temperament:</span>${temperament}</p>
            </div>`;
}
