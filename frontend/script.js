async function summarizeText() {
    const inputText = document.getElementById('textInput').value.trim();
    const summaryOutput = document.getElementById('summaryOutput');
  
    if (!inputText) {
      alert('Please enter some text to summarize!');
      return;
    }

    if (inputText.length > 1000) {
        alert("Please limit the input text to 1000 characters.");
        return;
      }
      
  
    // Show loading spinner
    summaryOutput.innerHTML = `
      <div class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    `;
  
    try {
      const res = await fetch('/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });
  
      const data = await res.json();
  
      if (data.summary) {
        summaryOutput.innerHTML = `
          <div class="bg-white/70 rounded-2xl shadow-lg p-8 space-y-6 text-black">
            <h3 class="text-3xl font-bold text-center">Summary Result</h3>
            <p class="text-lg leading-relaxed">${data.summary}</p>
          </div>
        `;
      } else {
        summaryOutput.innerHTML = `<p class="text-red-600 text-center">No summary returned. Please try again.</p>`;
      }
  
    } catch (error) {
      console.error(error);
      summaryOutput.innerHTML = `<p class="text-red-600 text-center">Failed to fetch summary. Try again later.</p>`;
    }
  }
  