const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');


///create card button--------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const createCard = document.getElementById("create-card");
  const learn=document.getElementById("study-button");
  learn.addEventListener('click',()=>window.location.href='learn.html?id='+id);
  createCard.href = 'addCard.html?id=' + id;
});
//-------------------------------------------------------------


/// cards managenment------------------------------------------------------------------------------------------
function getCards(searchValue){
  if(searchValue.length==0 || searchValue==null){
    console.log(searchValue);
    return fetch('http://localhost:8080/api/v1/decks/'+id+'/cards',{
      method:'GET',
      mode: 'cors',
      credentials: 'include',
      headers:{
          'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
  })
  .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'failed');
      }
      return new Map(Object.entries(data)); 
    })
    .catch(error => {
      alert(error.message);
      console.error('Error:', error);
      return new Map();
    });
  }
  else{
    return fetch('http://localhost:8080/api/v1/decks/'+id+'/cards/search/'+searchValue,{
      method:'GET',
      mode: 'cors',
      credentials: 'include',
      headers:{
          'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
  })
  .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'failed');
      }
      return new Map(Object.entries(data)); 
    })
    .catch(error => {
      alert(error.message);
      console.error('Error:', error);
      return new Map();
    });
  }
}
function createOptions(triggerButton) {
  const optionsDiv = document.createElement('div');
  optionsDiv.className = 'options-container';

  const buttonLabels = ['Edit', 'Copy', 'Move', 'Freeze', 'Remove'];

  buttonLabels.forEach(label => {
    const button = document.createElement('button');
    button.className = 'option';
    button.textContent = label;
    if (label === "Remove") {
      button.style.color = "red";
    }
    const rect = triggerButton.getBoundingClientRect();
    optionsDiv.style.display = "block";
  
    requestAnimationFrame(() => {
      const boxWidth = optionsDiv.offsetWidth;
      optionsDiv.style.top = `${rect.bottom + window.scrollY + 5}px`; 
      optionsDiv.style.left = `${rect.left + rect.width / 2 + window.scrollX - boxWidth / 2}px`;
    });
    optionsDiv.appendChild(button);
  });


  triggerButton.parentElement.appendChild(optionsDiv); 


  const clickOutsideHandler = (event) => {
    if (!optionsDiv.contains(event.target) && event.target !== triggerButton) {
      optionsDiv.remove();
      document.removeEventListener('click', clickOutsideHandler);
    }
  };


  setTimeout(() => {
    document.addEventListener('click', clickOutsideHandler);
  }, 0);
}

async function addCardToBody(card) {
  const cardsContainer = document.getElementById("cards-container");

  const cardElement = document.createElement('div');
  cardElement.className = "card";

  const cardFront = document.createElement('h4');
  const cardBack = document.createElement('h5');
  const optionsButton = document.createElement('button');
  optionsButton.className = "options-button";

  const optionsIcon = document.createElement('i');
  optionsIcon.className = "fa-solid fa-ellipsis-vertical";
  optionsButton.appendChild(optionsIcon);

  const cardDetails = document.createElement('div');
  cardDetails.classList.add('card-details-container');

  cardFront.innerText = await card.front;
  cardBack.innerText = await card.back;

  cardDetails.appendChild(cardFront);
  cardDetails.appendChild(cardBack);
  cardElement.appendChild(cardDetails);
  cardElement.appendChild(optionsButton);
  cardsContainer.appendChild(cardElement);

  optionsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log("Options button clicked");
    
    const existing = cardElement.querySelector('.options-container');
    if (existing) {
      existing.remove();
      return;
    }

    createOptions(optionsButton);
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");


  getCards("").then(cardsMap => {
    cardsMap.forEach(card => {
      addCardToBody(card);
    });
  });


  searchInput.addEventListener("input", async function (e) {
    const searchValue = e.target.value;

    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = ""; 

    const cardsMap = await getCards(searchValue);
    cardsMap.forEach(card => {
      addCardToBody(card);
    });
  });
});

//-------------------------------------------------------------------------------------------------------------------------

//GETTING THE DECK INFO
async function getInfo(){
  try {
    const response = await fetch('http://localhost:8080/api/v1/decks/'+id, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'failed');
    console.log(data)
    return data;
  } catch (error) {
    alert(error.message);
    console.error('Error:', error);
    return {};
  }
}
async function getMastredCards(){
  try {
    const response = await fetch('http://localhost:8080/api/v1/decks/'+id+'/cards/mastred', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'failed');
    return new Map(Object.entries(data));
  } catch (error) {
    alert(error.message);
    console.error('Error:', error);
    return new Map();
  }
}
async function getCardsForToday(){
  try {
    const response = await fetch('http://localhost:8080/api/v1/decks/'+id+'/cards/due', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'failed');
    return new Map(Object.entries(data));
  } catch (error) {
    alert(error.message);
    console.error('Error:', error);
    return new Map();
  }
}
getInfo().then (deckInfo=>{
  const deckName=document.getElementById("deck-name");
  const deckNameForTitle=document.getElementById("big-deck-name");
  const description=document.getElementById("description");
  const cardsForToday=document.getElementById("cards-for-today");
  const notStudiedCards=document.getElementById("not-studied");
  const learningCards=document.getElementById("learning");
  const masteredCards=document.getElementById("mastered");
  getCardsForToday().then(cards=>{
    cardsForToday.innerText=cards.size;
  })

  notStudied=0;
  mastered=0;
  learning=0;
  for(cardNbr in deckInfo.cards){
    card=(deckInfo.cards[cardNbr])
    if(card.repititions<10){
      if(card.repititions==0){
        notStudied++;
      }
      else{
        learning++;
      }
    }
    else{mastered++}
  }
  const icon1 = document.createElement('i');
  const icon2 = document.createElement('i');
  const icon3 = document.createElement('i');

  masteredCards.innerText=" "+mastered;
  icon1.className = 'fa-solid fa-graduation-cap';
  icon1.style.color = 'rgb(0, 132, 255)';
  masteredCards.prepend(icon1);


  learningCards.innerText=" "+learning;
  icon2.className = 'fa-solid fa-clock-rotate-left';
  icon2.style.color = ' rgb(0, 219, 0)';
  learningCards.prepend(icon2);


  notStudiedCards.innerText=" "+notStudied;
  icon3.className = 'fa-solid fa-notes-medical';
  icon3.style.color = 'grey';
  notStudiedCards.prepend(icon3);



  deckName.innerText= deckInfo.title;
  deckNameForTitle.innerText= deckInfo.title;
  description.innerText=deckInfo.description;
})