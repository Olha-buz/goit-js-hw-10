
const api_key = "live_p7zUIxqa8v3qnurBHrZ1ANwRnBboO6IGTWLD74FTZoHaaTVwDZ38Hdiy901iTchg";
const url = `https://api.thecatapi.com/v1`;

export function fetchBreeds() {
    return fetch(`${url}/breeds?api_key=${api_key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        });   
};

export function fetchCatByBreed(breedId) {
    return fetch(`${url}/images/search?breed_ids=${breedId}&api_key=${api_key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        });
};