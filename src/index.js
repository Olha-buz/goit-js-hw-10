import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

Notiflix.Notify.init({
width: '300px',
    position: 'right-top'
});

const selector = document.querySelector('.breed-select');
const divInfoCat = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');

error.style.display = 'none';
loader.style.display = 'none';

fetchBreeds()
    .then(breeds => {
        selector.innerHTML = createOptionsList(breeds);
        selector.insertAdjacentElement('afterbegin', `<option data-placeholder="true"></option>`);
    })
    .then(()=> new SlimSelect({
            select: selector,
            settings: {
                alwaysOpen: false,
                showSearch: true,
                placeholder: true,
                placeholderText: 'breed',
                searchPlaceholder: 'Find breed...'
            }
        }))
    .catch((error) => {
        Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!', {
            timeout: 5000,
            position: "center-center"})
    })
    .finally(_ => loader.style.display = 'none');


function createOptionsList(breeds) {
    return breeds
        .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
        .join('\n');
}

selector.addEventListener('change', onSelectBreed);

function onSelectBreed(evt) {
    // Notiflix.Notify.info('Loading data, please wait...', { timeout: 1000, });
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
            Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!', {
                timeout: 5000,
                position: "center-center"});
        })
        .finally(_ => {
            loader.style.display = 'none';

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
