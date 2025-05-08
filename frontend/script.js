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
  



  async function generateImage() {
    const prompt = document.getElementById('promptInput').value.trim();
    const imageOutput = document.getElementById('imageOutput');
  
    if (!prompt) {
      alert('Please enter a description for the image.');
      return;
    }
  
    imageOutput.innerHTML = `
      <div class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    `;
  
    try {
      const res = await fetch('/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
  
      const data = await res.json();
      console.log(data);
  
      if (data.success && data.path) {
        imageOutput.innerHTML = `
          <img src="${data.path}" alt="Generated Image" class="rounded-xl shadow-lg max-w-full max-h-[60vh]"/>
        `;
      } else {
        imageOutput.innerHTML = `<p class="text-red-600 text-center">❌ ${data.error || 'No image returned.'}</p>`;
      }
    } catch (error) {
      console.error(error);
      imageOutput.innerHTML = `<p class="text-red-600 text-center">Failed to generate image. Try again later.</p>`;
    }
  }
  




  async function generateGhibli() {
    const prompt = document.getElementById('promptInput1').value.trim();
    const imageOutput = document.getElementById('imageOutput1');
  
    if (!prompt) {
      alert('Please enter a prompt to generate a Ghibli-style image.');
      return;
    }
  
    imageOutput.innerHTML = `
      <div class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    `;
  
    try {
      const res = await fetch('/generate-ghibli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
  
      const data = await res.json();
  
      if (data.image) {
        imageOutput.innerHTML = `
          <img src="${data.image}" alt="Ghibli Art" class="rounded-xl shadow-lg max-w-full max-h-[60vh]"/>
        `;
      } else {
        imageOutput.innerHTML = `<p class="text-red-600 text-center">No image returned. Try again.</p>`;
      }
    } catch (error) {
      console.error(error);
      imageOutput.innerHTML = `<p class="text-red-600 text-center">Failed to generate image. Try again later.</p>`;
    }
  }
  

  async function translateText() {
    const inputText = document.getElementById('inputText').value.trim();
    const translationsDiv = document.getElementById('translations');
  
    if (!inputText) {
      alert('Please enter text to translate.');
      return;
    }
  
    translationsDiv.innerHTML = `
      <div class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    `;
  
    try {
      const response = await fetch('/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
  
      const data = await response.json();
  
      if (data.translations) {
        translationsDiv.innerHTML = '';
        for (const [language, translation] of Object.entries(data.translations)) {
          const card = document.createElement('div');
          card.className = 'bg-white/70 rounded-xl p-4 shadow text-black';
          card.innerHTML = `<h4 class="text-xl font-bold">${language}</h4><p>${translation}</p>`;
          translationsDiv.appendChild(card);
        }
      } else {
        translationsDiv.innerHTML = '<p class="text-red-600 text-center">Translation failed.</p>';
      }
    } catch (error) {
      console.error('Error:', error);
      translationsDiv.innerHTML = '<p class="text-red-600 text-center">An error occurred during translation.</p>';
    }
  }
  