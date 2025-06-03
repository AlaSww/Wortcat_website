const urlParams = new URLSearchParams(window.location.search);
const deckId = urlParams.get('id');
document.addEventListener('DOMContentLoaded',()=>{
  const returnToDeck=document.getElementById('return-to-deck');
  returnToDeck.href='deck.html?id='+deckId;
})

function updateProgressBar(currentIndex, total) {
  const percent = ((currentIndex + 1) / total) * 100;
  document.getElementById('progress-bar').style.width = percent + '%';
}

getCards().then(cardsMap => {
    const cards = Array.from(cardsMap.values());
    let currentIndex = 0;
    console.log(cards);
    function showCurrentCard() {
        if (currentIndex >= cards.length) {
            window.location.href='deck.html?id='+deckId;
        }
        updateProgressBar(currentIndex-1, cards.length); 
        document.getElementById('current-number').textContent = currentIndex + 1;
        document.getElementById('total-number').textContent = cards.length;
        
        const currentCard = cards[currentIndex];
        console.log(currentCard.id);
        document.querySelector('.flashcard-prompt').innerHTML = currentCard.front;
        document.querySelector('.flashcard-answer').innerHTML = currentCard.back;
        
        const reveal = document.getElementById('reveal-button');
        const newReveal = reveal.cloneNode(true);
        reveal.parentNode.replaceChild(newReveal, reveal);
        
        newReveal.addEventListener('click', () => {
            showFlashcardAnswer();
            

            const setupButton = (buttonId, rating) => {
                const button = document.getElementById(buttonId);
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                newButton.addEventListener('click', () => {
                    reviewCard(currentCard.id, rating);
                    hideFlashcardAnswer();
                    currentIndex++;
                    showCurrentCard(); 
                });
            };
            
            setupButton("easy", 3);
            setupButton("good", 2);
            setupButton("hard", 1);
            setupButton("again", 0);
        });
    }
    
    showCurrentCard();
});
function hideFlashcardAnswer(){
  document.querySelector('.flashcard-answer').style.display = 'none';
    document.querySelector('.flashcard-buttons').style.display = 'none';
    document.querySelector('.flashcard-reveal-btn').style.display = 'block';
}
function showFlashcardAnswer() {
    document.querySelector('.flashcard-answer').style.display = 'block';
    document.querySelector('.flashcard-buttons').style.display = 'flex';
    document.querySelector('.flashcard-reveal-btn').style.display = 'none';
}
async function reviewCard(cardId,quality){
    return fetch('http://localhost:8080/api/v1/decks/'+deckId+'/cards/review/'+cardId, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
            quality:quality
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
function shuffleMap(originalMap) {
    const entries = Array.from(originalMap.entries());
  
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
      return new Map(entries);
  }
async function getCards(){
    return fetch('http://localhost:8080/api/v1/decks/'+deckId+'/cards',{
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
        return shuffleMap(new Map(Object.entries(data))); 
      })
      .catch(error => {
        alert(error.message);
        console.error('Error:', error);
        return new Map();
      });
}