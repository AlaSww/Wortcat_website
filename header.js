async function loadHeader() {
    try {
      const response = await fetch('header.html');
      const data = await response.text();
      document.getElementById('header').innerHTML = data;
  
      initStatsLogic(); 
    } catch (error) {
      console.error('Error loading header:', error);
    }
  }
  
  async function getStats() {
    try {
      const response = await fetch('http://localhost:8080/api/v1/stats', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
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
  
  async function initStatsLogic() {
    const statsButton = document.getElementById("stats-button");
    const statsBox = document.getElementById("stats-box");
    const streakValue = document.getElementById("streak-value");
    const bestStreakValue = document.getElementById("best-streak-value");
    const learntWords = document.getElementById("learnt-words");
  
    const stats = await getStats();
  
    streakValue.innerText = stats.streak ?? "0";
    bestStreakValue.innerText = stats.longestStreak ?? "0";
    learntWords.innerText = stats.leanrtWordsToday ?? "0";
  
    statsButton.addEventListener("click", () => {
      if (statsBox.style.display === "block") {
        statsBox.style.display = "none";
        return;
      }
  
      const rect = statsButton.getBoundingClientRect();
      statsBox.style.display = "block";
  
      requestAnimationFrame(() => {
        const boxWidth = statsBox.offsetWidth;
        statsBox.style.top = `${rect.bottom + window.scrollY + 5}px`; 
        statsBox.style.left = `${rect.left + rect.width / 2 + window.scrollX - boxWidth / 2}px`;
      });
    });
  
    document.addEventListener("click", (event) => {
      if (!statsBox.contains(event.target) && !statsButton.contains(event.target)) {
        statsBox.style.display = "none";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadHeader(); 
  });
  