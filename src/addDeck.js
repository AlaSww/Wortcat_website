const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

async function createCard(front,back){
    return fetch('http://localhost:8080/api/v1/decks/'+id+'/cards', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
            front: front,
            back: back,
      })
    })
    .then(async response => {
      if (!response.ok) {
        throw new Error(data.error || 'failed');
      }
      const data = await response.json();
      return data; 
    })
    .catch(error => {
      alert(error.message);
      console.error('Error:', error);
      return null;
    });
  }
//setting up  path---------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
const deckLink=document.getElementById('return-to-deck');
const saveButton=document.getElementById('save-button');
const deckName=document.createElement('h4');
const returnArrow=document.getElementById('return-deck-arrow');
saveButton.addEventListener('click',async()=>{
    const frontValue=document.getElementById("card-front").value;
    const backValue=document.getElementById("card-back").value;
    response=createCard(frontValue,backValue);
    if(response!=null){
        window.location.reload();
    }
    else{
        alert("unnable to save this card");
    }
})
returnArrow.href="deck.html?id="+id;
deckName.innerText="sdfa";
deckLink.href="deck.html?id="+id;
deckLink.prepend(deckName);
})
//------------------------------------------------------------------------------------