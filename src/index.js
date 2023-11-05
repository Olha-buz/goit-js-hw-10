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
let slimSelect;

fetchBreeds()  
    .then(breeds => {
        slimSelect = new SlimSelect({
            select: selector,
            settings: {
                placeholderText: 'Find breed...',
            }
        })
        selector.innerHTML = createOptionsList(breeds);
    })
    .catch((error) => {
        Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!', {
            timeout: 3000,
            position: "center-center"})
    })
    .finally(_ => {
        loader.style.display = 'none';
        // selector.style.display = 'flex'; 
    });


function createOptionsList(breeds) {
    const result = breeds
        .map(breed => `<option value="${breed.id}">${breed.name}</option>`);
    result.unshift(`<option data-placeholder="true"></option>`);
    return result.join('');
}

selector.addEventListener('change', onSelectBreed);

function onSelectBreed(evt) {
    loader.style.display = 'initial';
    // selector.style.display = 'none';
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
                timeout: 3000,
                position: "center-center"});
        })
        .finally(_ => {
            loader.style.display = 'none';
            selector.style.display = 'flex';
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
