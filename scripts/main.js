function handleResponse(res) {
  return res.json();
}

function ajax() {
  const apiUrl = "https://jsonplaceholder.typicode.com";

  const promise = fetch(`${apiUrl}/albums`);

  promise.then(handleResponse).then((albums) => {
    const userPromises = [];
    for (const album of albums) {
      const uPr = fetch(`${apiUrl}/users/${album.userId}`)
        .then(handleResponse)
        .then((user) => {
          album.user = user.username;
        });

      userPromises.push(uPr);
    }

    Promise.all(userPromises).then(() => buildAlbumHtml(albums));
  });

  function buildAlbumHtml(albums) {
    const fragment = document.createDocumentFragment();
    for (const album of albums) {
      const albumElem = document.createElement("dl");
      const titleElem = document.createElement("dt");
      const authorElem = document.createElement("dd");

      titleElem.innerText = album.title;
      // authorElem.innerText = album.userId;

      authorElem.innerText = "-" + album.user;
      albumElem.appendChild(titleElem);
      albumElem.appendChild(authorElem);

      fragment.appendChild(albumElem);
    }

    document.getElementById("albums").appendChild(fragment);
  }
}

ajax();

function weather() {
  fetch(
    "http://api.openweathermap.org/data/2.5/weather?q=Galati&units=metric&appid=cbf24ef0d0428af6ca69c8320756cbf5"
  )
    .then(handleResponse)
    .then((data) => {
      const maxTemp = document.querySelector(".max-temp");
      maxTemp.innerText = Math.ceil(data.main["temp_max"]);

      const minTemp = document.querySelector(".min-temp");
      minTemp.innerText = Math.ceil(data.main["temp_min"]);

      const currentTemp = document.querySelector(".current-temp");
      currentTemp.innerText = Math.ceil(data.main["temp"]);

      const feelsLike = document.querySelector(".feels-like");
      feelsLike.innerText = Math.ceil(data.main["feels_like"]);

      const city = document.querySelector(".city");
      city.innerText = data["name"];

      const statusIcon = document.querySelector(".iconClass");
      const iconFromApi = data.weather[0].icon;
      const icon = `http://openweathermap.org/img/wn/${iconFromApi}@2x.png`;
      statusIcon.innerHTML = `<img src="${icon}">`;
    });
}

weather();
