const apiKeyForWeather = '5259742ae25be266ed1f941918962295';

const formRegistration = document.querySelector('#form-id-registration');
const btnSubmitLogin = document.getElementById('form-id-login');

// clear Inputs

function clearInputs() {
  const inputName = document.getElementById('reg-name-id');
  const inputEmail = document.getElementById('reg-email-id');
  const inputPassword = document.getElementById('reg-password-id');
  inputName.value = '';
  inputEmail.value = '';
  inputPassword.value = '';
}

// Auth block

if (formRegistration) {
  formRegistration.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputName = document.getElementById('reg-name-id');
    const inputEmail = document.getElementById('reg-email-id');
    const inputPassword = document.getElementById('reg-password-id');
    const inputAge = document.getElementById('reg-age-id');

    const user = {
      name: inputName.value,
      email: inputEmail.value,
      password: inputPassword.value,
      age: inputAge.value,
    };

    const response = await fetch('/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(user),
    });
    clearInputs();

    const answer = await response.json();
    if (answer.answer === 'sorry, name has existed yet') {
      window.location.href = 'http://localhost:3000/start';
    } else {
      window.location.href = 'http://localhost:3000/main';
    }
  });
}

if (btnSubmitLogin) {
  btnSubmitLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputName = document.getElementById('id-login-name');
    const inputPassword = document.getElementById('id-login-password');

    const user = {
      name: inputName.value,
      password: inputPassword.value,
    };
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(user),
    });

    const answer = await response.json();
    if (answer.answer === 'no') {
      window.location.href = 'http://localhost:3000/start';
    } else {
      window.location.href = 'http://localhost:3000/main';

    }
  });
}

// news API

const apiKey = '572e97d6cbdb4550932b203f915811fe';
const apiURL = 'https://news-api-v2.herokuapp.com';
let choice = 'ru';
let category = 'science';
let searchNewsValue = '';
const formApp = document.getElementById('app-form');
const select = document.querySelector('.select-country');
const searchNews = document.querySelector('#search-id');
const blockOfnews = document.querySelector('.news-container');
const choiceCategories = document.querySelector('.choice-categories');
const btn = document.querySelector('#btn-search');

if (btn) {
  btn.addEventListener('click', (event) => {
    if (event && searchNews.value === '') {
      event.preventDefault();
    } else if (event) {
      searchNewsValue = searchNews.value;
      event.preventDefault();
      blockOfnews.innerHTML = '';
      formApp.reset();
      getKeyWordPost();
    }
  });
}
if (select) {
  select.addEventListener('change', function (event) {
    if (event) {
      choice = this.value;// смена страны
      blockOfnews.innerHTML = '';
      getPost();
    }
  });
}

if (choiceCategories) {
  choiceCategories.addEventListener('change', function (event) {
    if (event) {
      searchNewsValue = '';
      category = this.value;
      blockOfnews.innerHTML = '';
      getPost();
    }
  });
}

// weather

async function getWheather() {
  const blockForWeather = document.querySelector('.weatherBlog');
  async function getCity() {
    try {
      const response = await fetch('http://ip-api.com/json');
      const data = await response.text();
      const dataParse = JSON.parse(data);
      const locationCity = dataParse.regionName;
      const locationCityText = document.createElement('h4');
      locationCityText.textContent = locationCity;
      blockForWeather.appendChild(locationCityText);
      return locationCity;
    } catch (err) {
      console.log(err);
    }
  }

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ await getCity()}&units=metric&appid=${apiKeyForWeather}&lang=ru`);
  const data = await response.text();
  const objWheather = JSON.parse(data);
  const temperature = parseInt(objWheather.main.temp, 10);
  const clouds = objWheather.weather[0].description;
  const wind = objWheather.wind.speed;
  const weatherBlog = document.querySelector('.weatherBlog');
  if (weatherBlog) {
    const weatherText = document.createElement('p');
    weatherText.innerHTML = `<p>Температура: ${temperature} С,</p>
    <p>Скорость ветра: ${wind} м/с,</p>
    <p>${clouds}</p> `;
    if (clouds !== 'пасмурно') {
      weatherBlog.classList.toggle('weatherBlogSun');
    }
    weatherBlog.appendChild(weatherText);
  }
}
getWheather();

// current rates

async function getCourse() {
  const usd = await fetch('https://www.sberbank.ru/portalserver/proxy/?pipe=shortCachePipe&url=http%3A%2F%2Flocalhost%2Frates-web%2FrateService%2Frate%2Fcurrent%3FregionId%3D77%26rateCategory%3Dbase%26currencyCode%3D840');
  const dataUSD = await usd.text();
  const afterParse = JSON.parse(dataUSD);
  const responseGBP = await fetch('https://www.sberbank.ru/portalserver/proxy/?pipe=shortCachePipe&url=http%3A%2F%2Flocalhost%2Frates-web%2FrateService%2Frate%2Fcurrent%3FregionId%3D77%26rateCategory%3Dbase%26currencyCode%3D826');
  const dataGBP = await responseGBP.text();
  const afterParse2 = JSON.parse(dataGBP);
  const eur = await fetch('https://www.sberbank.ru/portalserver/proxy/?pipe=shortCachePipe&url=http%3A%2F%2Flocalhost%2Frates-web%2FrateService%2Frate%2Fcurrent%3FregionId%3D77%26rateCategory%3Dbase%26currencyCode%3D978');
  const dataEUR = await eur.text();
  const afterParse3 = JSON.parse(dataEUR);
  const formCont = document.querySelector('.wrap');
  if (formCont) {
    const moneyDiv = document.querySelector('.moneyDiv');
    const labelCourse = document.createElement('h5');
    labelCourse.textContent = 'Exchange Rates';
    moneyDiv.appendChild(labelCourse);
    const buyValueUSD = afterParse.base['840']['1000'].buyValue;
    const sellValueUSD = afterParse.base['840']['1000'].sellValue;
    const buyValueGBP = afterParse2.base['826']['0'].buyValue;
    const sellValueGBP = afterParse2.base['826']['0'].sellValue;
    const buyValueEUR = afterParse3.base['978']['0'].buyValue;
    const sellValueEUR = afterParse3.base['978']['0'].sellValue;
    const buyValueUSDElement = document.createElement('p');
    buyValueUSDElement.textContent = `USD: ${buyValueUSD} - ${sellValueUSD}`;
    moneyDiv.appendChild(buyValueUSDElement);
    const buyValueEURElement = document.createElement('p');
    buyValueEURElement.textContent = `EUR: ${buyValueEUR} - ${sellValueEUR}`;
    moneyDiv.appendChild(buyValueEURElement);
    const buyValueGBPElement = document.createElement('p');
    buyValueGBPElement.textContent = `GBP: ${buyValueGBP} - ${sellValueGBP}`;
    moneyDiv.appendChild(buyValueGBPElement);
  }
}
getCourse();

async function getDefaultNews() {
  const response = await fetch(`${apiURL}/top-headlines?country=${choice}&category=${category}&apiKey=${apiKey}`);
  const data = await response.text();
  const res = JSON.parse(data);
  try {
    if (res.status === 'ok') {
      res.articles.forEach((el) => {
        if (el) {
          renderNews(el);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}
getDefaultNews();

async function getPost() {
  const response = await fetch(`${apiURL}/top-headlines?country=${choice}&category=${category}&apiKey=${apiKey}`);
  const data = await response.text();
  const res = JSON.parse(data);
  try {
    if (res.status === 'ok') {
      res.articles.forEach((el) => {
        renderNews(el);
      });
    }
  }
  catch (error) {
    console.log(error);
  }
}

function renderNews(news) {
  const cardOfNews = document.createElement('div');
  const titleOfNews = document.createElement('h5');
  const articlesOfNews = document.createElement('p');
  articlesOfNews.classList.add('card-text')
  const imgOfNews = document.createElement('img');
  if (blockOfnews) {
    blockOfnews.appendChild(cardOfNews);
  }
  cardOfNews.appendChild(titleOfNews);
  cardOfNews.appendChild(articlesOfNews);
  articlesOfNews.textContent = news.description;
  titleOfNews.textContent = news.title;
  if (news.urlToImage) {
    imgOfNews.setAttribute('src', `${news.urlToImage}`);
  }
  imgOfNews.setAttribute('max-width', '500px');
  imgOfNews.classList.add('card-img-top');
  cardOfNews.appendChild(imgOfNews);
  cardOfNews.classList.add('card');
}

async function getKeyWordPost() {
  if (searchNewsValue === 'porno') {
    window.location.href = 'https://www.malyshariki.ru/';
  }
  const response = await fetch(`${apiURL}/everything?q=${searchNewsValue}&apiKey=${apiKey}`);
  const data = await response.text();
  const res = JSON.parse(data);
  console.log(res);
  if (res.status === 'ok') {
    res.articles.forEach((el) => {
      renderNews(el);
    });
  }
}
