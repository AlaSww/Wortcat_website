const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

function getCards(){
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
getCards().then(cardsMap => {
    cardsMap.forEach(card => {
      //addCardToBody(card);
      console.log(card);
    });
  });

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
    return data;
  } catch (error) {
    alert(error.message);
    console.error('Error:', error);
    return {};
  }
}
getInfo().then (deckInfo=>{
  const deckName=document.getElementById("deck-name");
  const deckNameForTitle=document.getElementById("big-deck-name");
  const description=document.getElementById("description");
  deckName.innerText= deckInfo.title;
  deckNameForTitle.innerText= deckInfo.title;
  description.innerText=deckInfo.description;
})