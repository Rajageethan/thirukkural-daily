function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function updateKuralDisplay(data) {
    document.getElementById("number").textContent = data.Number;
    document.getElementById("line1").textContent = data.Line1;
    document.getElementById("line2").textContent = data.Line2;
    document.getElementById("translation").textContent = data.Translation;
    document.getElementById("couplet").textContent = data.couplet;
    document.getElementById("explanation").textContent = data.explanation;
    
    // Set transliterations
    document.getElementById("transliteration1").textContent = data.transliteration1;
    document.getElementById("transliteration2").textContent = data.transliteration2;
    
    document.getElementById("mv").textContent = data.mv;
    document.getElementById("sp").textContent = data.sp;
    document.getElementById("mk").textContent = data.mk;
    
    // Section (Paul) details
    document.getElementById("paul_name").textContent = data.paul_name;
    document.getElementById("paul_transliteration").textContent = data.paul_transliteration;
    document.getElementById("paul_translation").textContent = data.paul_translation;
    
    // Chapter (Adhikaram) details
    document.getElementById("adikaram_name").textContent = data.adikaram_name;
    document.getElementById("adikaram_transliteration").textContent = data.adikaram_transliteration;
    document.getElementById("adikaram_translation").textContent = data.adikaram_translation;
    
    // Part (Iyal) details
    document.getElementById("iyal_name").textContent = data.iyal_name;
    document.getElementById("iyal_transliteration").textContent = data.iyal_transliteration;
    document.getElementById("iyal_translation").textContent = data.iyal_translation;
}

function fetchAndDisplayKural() {
    const cachedData = localStorage.getItem('kuralData');
    const cachedDate = localStorage.getItem('kuralDate');
    
    const now = new Date();
    
    if (cachedData && cachedDate && isSameDay(now, new Date(cachedDate))) {
        // Use cached data if it's from the same day
        updateKuralDisplay(JSON.parse(cachedData));
    } else {
        // Fetch new data if cache is invalid or missing
        fetch("/kural-of-the-day")
            .then(res => res.json())
            .then(data => {
                // Cache the new data
                localStorage.setItem('kuralData', JSON.stringify(data));
                localStorage.setItem('kuralDate', now.toISOString());
                updateKuralDisplay(data);
            })
            .catch(err => {
                console.error("Error fetching Thirukkural:", err);
            });
    }
}

// Initial load
fetchAndDisplayKural();

// Theme switching functionality
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Initialize theme from localStorage or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
} else {
    root.setAttribute('data-theme', prefersDarkScheme.matches ? 'dark' : 'light');
}

// Update button text based on current theme
function updateToggleText() {
    const currentTheme = root.getAttribute('data-theme');
    themeToggle.textContent = `Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`;
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleText();
});

// Initial text update
updateToggleText();