'use strict';

let PUBLIC_MEMBERS = [];
let ALL_MEMBERS = []

let select = document.querySelector('select');

// Save data in Local Storage
function saveDataLocalStorage() {
  localStorage.setItem('adalab_Members', JSON.stringify(ALL_MEMBERS));
};

// There are no data in Local Storage
function checkDataLocalStorage() {
  let membersSaved = localStorage.getItem('adalab_Members');

  if (membersSaved === null || typeof(membersSaved) === 'undefined') {
    getPublicMember();
  }
  else {
    ALL_MEMBERS = JSON.parse(membersSaved);
    paintSelectValues();
  }
};

// Call API
function getPublicMember () {
  fetch('https://api.github.com/orgs/Adalab/public_members?per_page=68')
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      PUBLIC_MEMBERS = response;
      getMembersInfo();
    })
};

// Get members info and save in Local Storage
function getMembersInfo() {
  for (let i = 0; i < PUBLIC_MEMBERS.length; i++) {
    fetch('https://api.github.com/users/'+ PUBLIC_MEMBERS[i].login)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        ALL_MEMBERS.push(json);
        saveDataLocalStorage();
      })
  }
}

// print select value
function paintSelectValues() {
  let select = document.getElementById("select");

  for (let i = 0; i < ALL_MEMBERS.length; i++) {
    let option = document.createElement("option");

    option.value = i;
    option.innerHTML = ALL_MEMBERS[i].name || ALL_MEMBERS[i].login;
    select.appendChild(option);

    select.addEventListener('change', showAdalaberCard)
  }
}

//show Adalaber
function showAdalaberCard() {
  let showAdalaber = this.options[select.selectedIndex];
  let i = showAdalaber.value;
  let adalaberCard = '';

  if(showAdalaber){
    document.querySelector('.card__section').style.display = 'block';
    adalaberCard =
      `<img class="" src="${ALL_MEMBERS[i].avatar_url} alt=${ALL_MEMBERS[i].login}">
      <div>
        <span>@${ALL_MEMBERS[i].login}</span>
        <h2>${ALL_MEMBERS[i].name}</h2>
        <p><i class="fas fa-map-marker-alt"></i>${ALL_MEMBERS[i].location ? ALL_MEMBERS[i].location : '--' }</p>
      </div>
      <div>
        <div>
          <p>${ALL_MEMBERS[i].public_repos} </p>
          <p>Repositories</p>
        </div>
        <div>
          <p>${ALL_MEMBERS[i].followers} </p>
          <p>Followers</p>
        </div>
        <div>
          <p>${ALL_MEMBERS[i].following} </p>
          <p>Following</p>
        </div>
      </div>
    <div>
      <p>Miembro desde ${new Date(ALL_MEMBERS[i].created_at).getFullYear()}</p>
    </div>`;
  }
  else {
    document.querySelector('.card__section').style.display = 'none';
  }
  document.querySelector('.card__section').innerHTML = adalaberCard;
}

// call functions and events
select.addEventListener('change', showAdalaberCard)
checkDataLocalStorage();
