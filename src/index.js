import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchRef: document.querySelector('#search-box'),
  countryListRef: document.querySelector('.country-list'),
  countryInfoRef: document.querySelector('.country-info'),
};

refs.searchRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const value = e.target.value.trim();

  clearMarkup();

  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (data.length > 1) {
        renderCountryList(data);
        return;
      }

      renderCountryInfo(data);
      return;
    })
    .catch(err => {
      clearMarkup();
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountryList(data) {
  console.log(data);

  data.forEach(country => {
    refs.countryListRef.insertAdjacentHTML(
      'beforeend',
      `<li class="country-item">
        <img src="${country.flags.svg}" class="country-flag"></img>
        <h2>${country.name.official}</h2>
      </li>`
    );
  });
}

function renderCountryInfo(data) {
  console.log(data);

  data.forEach(country => {
    refs.countryInfoRef.insertAdjacentHTML(
      'beforeend',
      `<img src="${country.flags.svg}" class="country-flag"></img>
      <h2>${country.name.official}</h2>
      <p><span>Capital: </span>${country.capital}</p>
      <p><span>Population: </span>${country.population}</p>
      <p><span>Languages: </span>${Object.values(country.languages).join(
        ', '
      )}</p>
      `
    );
  });
}

function clearMarkup() {
  refs.countryInfoRef.innerHTML = '';
  refs.countryListRef.innerHTML = '';
}
