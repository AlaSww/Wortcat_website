  function getDecks() {
    return fetch('http://localhost:8080/api/v1/decks', {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
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

  function addDeckToBody(deck){
    const newA=document.createElement('a');
    const newDiv=document.createElement('div');
    const newH2=document.createElement('h2');
    const newH4=document.createElement('h4');
    newA.href='deck.html?id='+ deck["id"];
    newA.className="deck-card";
    newDiv.className="deck-div";
    newH2.innerText=deck['title'];
    newH2.className="deck-title";
    newH4.innerText='number of cards: '+deck['nbrOfCards'] ;
    newH4.className="decks-nbr";
    newDiv.appendChild(newH2);
    newDiv.appendChild(newH4);
    newA.appendChild(newDiv);
    const arrow= document.createElement('i');
    arrow.className="fa-solid fa-arrow-right";
    newA.appendChild(arrow);
    document.getElementById('decks-container').appendChild(newA);
  }
//CREATE DECK
async function createDeck(title,description){
  return fetch('http://localhost:8080/api/v1/decks', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
          title: title,
          description: description
    })
  })
  .then(async response => {
    if (!response.ok) {
      throw new Error(data.error || 'failed');
    }
    const data = await response.json();
    return data.id; 
  })
  .catch(error => {
    alert(error.message);
    console.error('Error:', error);
    return null;
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const createButton = document.getElementById("create-button");
  const cancelButton = document.getElementById("cancel-deck");
  const modalDeckContainer = document.getElementById("deck-modal");

  createButton.addEventListener('click', () => {
    modalDeckContainer.classList.add('show');
    const submitButton = document.getElementById("submit-deck");
    submitButton.addEventListener('click', async () => {
      let title = document.getElementById('deck-title').value;
      let description = document.getElementById('deck-description').value;
    
      try {
        const id = await createDeck(title, description);
    
        if (id != null) {
          window.location = "deck.html?id=" + id;
        } else {
          alert("There was an error");
          console.log('createDeck returned null');
        }
      } catch (error) {
        alert("There was an error");
        console.error("createDeck failed:", error);
      }
    });
    
  });

  cancelButton.addEventListener('click', () => {
    modalDeckContainer.classList.remove('show');
  });
});

getDecks().then(decksMap => {
  decksMap.forEach(deck => {
    console.log(deck);
    addDeckToBody(deck);
  });
});