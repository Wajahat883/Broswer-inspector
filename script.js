window.onload = function () {
    // Function to inspect the JavaScript object entered in the textarea
    function inspectObject() {
      const objectInput = document.getElementById("jsobject").value;
      try {
        const parsedObject = JSON.parse(objectInput); // Parsing JSON input
        let html = "<h3>Live Object Inspector</h3>";
        html += "<pre>" + JSON.stringify(parsedObject, null, 2) + "</pre>"; // Prettified object
        document.getElementById("objectDisplay").innerHTML = html;
      } catch (e) {
        document.getElementById("objectDisplay").innerHTML = "<p style='color:red;'>Invalid object! Please enter a valid JSON.</p>";
      }
    }
  
    // Bind the inspectObject function to the correct button
    document.getElementById("inspectBtn").onclick = inspectObject;}
  
    // Show content based on the selected tab
    function showContent(tab) {
      const content = document.getElementById("content");
      if (tab === 'cookies') {
        displayCookies();
      } else if (tab === 'localstorage') {
        displayStorage('local');
      } else if (tab === 'sessionstorage') {
        displayStorage('session');
      } else if (tab === 'chat') {
        content.innerHTML = '<h3>AI-Chat:</h3><p>Ask me anything about your browser storage!</p>';
      }
    }
  
    // Get cookies as an object
    function getCookiesAsObject() {
      const cookies = document.cookie.split('; ');
      const cookieObj = {};
      cookies.forEach(cookie => {
        const [key, value] = cookie.split('=');
        if (key) cookieObj[key] = value;
      });
      return cookieObj;
    }
  
    // Display cookies in a table format
    function displayCookies() {
      const cookies = getCookiesAsObject();
      let html = "<h3>Stored Cookies</h3><table><tr><th>Name</th><th>Value</th><th>Action</th></tr>";
      for (let key in cookies) {
        html += `<tr>
          <td>${key}</td>
          <td>${cookies[key]}</td>
          <td><button onclick="deleteCookie('${key}')">Delete</button></td>
        </tr>`;
      }
      html += "</table>";
      document.getElementById("content").innerHTML = html;
    }
  
    // Set a cookie
    function setCookie() {
      const name = document.getElementById("cookieName").value;
      const value = document.getElementById("cookieValue").value;
      const expires = new Date();
      expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
      displayCookies();
    }
  
    // Delete a cookie
    function deleteCookie(name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      displayCookies();
    }
  
    // Set storage (local or session)
    function setStorage() {
      const key = document.getElementById("storageKey").value;
      const value = document.getElementById("storageValue").value;
      const type = document.getElementById("storageType").value;
      if (type === "local") {
        localStorage.setItem(key, value);
      } else {
        sessionStorage.setItem(key, value);
      }
      displayStorage(type);
    }
  
    // Display storage (local or session)
    function displayStorage(type) {
      const storage = type === 'local' ? localStorage : sessionStorage;
      let html = `<h3>${type === 'local' ? 'LocalStorage' : 'SessionStorage'} Data</h3>`;
      html += "<table><tr><th>Key</th><th>Value</th><th>Action</th></tr>";
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        const value = storage.getItem(key);
        html += `<tr>
          <td>${key}</td>
          <td>${value}</td>
          <td><button onclick="removeStorage('${type}', '${key}')">Delete</button></td>
        </tr>`;
      }
      html += "</table>";
      document.getElementById("storageDisplay").innerHTML = html;
    }
  
    // Remove storage (local or session)
    function removeStorage(type, key) {
      if (type === "local") {
        localStorage.removeItem(key);
      } else {
        sessionStorage.removeItem(key);
      }
      displayStorage(type);
    }
  
    // Theme toggle with LocalStorage
    function toggleTheme() {
      const currentTheme = document.body.classList.contains("dark") ? "light" : "dark";
      document.body.classList.remove("dark", "light");
      document.body.classList.add(currentTheme);
      localStorage.setItem("theme", currentTheme);
    }
  
    // Apply saved theme on load
    window.addEventListener("DOMContentLoaded", () => {
      const savedTheme = localStorage.getItem("theme") || "light";
      document.body.classList.add(savedTheme);
  
      // Restore form input
      const savedForm = sessionStorage.getItem("formData");
      if (savedForm) {
        document.getElementById("formInput").value = savedForm;
      }
    });
  
    // SessionStorage for form
    document.getElementById("formInput").addEventListener("input", (e) => {
      sessionStorage.setItem("formData", e.target.value);
    });
  
    document.getElementById("tempForm").addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Form submitted!");
      sessionStorage.removeItem("formData");
      document.getElementById("formInput").value = "";
    });
function displayMemory(){
    let html = "<h4><u>window global variables:</u></h4><ul>"
    for(let key in window){
        if(window.hasOwnProperty(key)){
            if(typeof window[key]!=="function"&&typeof window[key]!=="object"){
               html+=`<li><b>${key}</b>:${window[key]}</li>`; 
            }
        }
    }
    html+="</ul>"
    html+="<h4><u>Cookies:</ul></h4><pre>"+document.cookie+"</pre>";
    html+="<h4><u>Local storage:</u></h4><ul>"
    for(let i=0; i<localStorage.length;i++){
        let key =localStorage.key(i)
        let value=localStorage.getItem(key)
        html+=`<li><b>${key}</b>:${value}</li>`
    }
    html+="</ul>";
    html+="<h4><u>Session Storage:</u></h4><ul>"
    for(let i=0; i<sessionStorage.length; i++){
        let key = sessionStorage.key(i);
        let value = sessionStorage.getItem(key)
        html+=`<li><b>${key}</b>:${value}</li>`
    }
    html+="</ul>";
    document.getElementById("memoryDisplay").innerHTML=html;
}
  console.log(displayMemory())
  

  async function askAi() {
    const prompt = document.getElementById("userPrompt").value;
    const chatBox = document.getElementById("chatDisplay");
  
    chatBox.innerHTML += `<div><b>You:</b> ${prompt}</div>`;
  
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-3B", {
        method: "POST",
        headers: {
          "Authorization": "xxxxxxxxxxxxxxxxx",  
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data); 
  
      const aiReply = data[0]?.generated_text || "Sorry, no reply!";
      chatBox.innerHTML += `<div><b>AI:</b> ${aiReply}</div>`;
      document.getElementById("userPrompt").value = "";
  
    } catch (error) {
      chatBox.innerHTML += `<div><b>AI Error:</b> ${error.message}</div>`;
      console.error("API Error:", error);
    }
  }
  