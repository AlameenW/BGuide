document.addEventListener("DOMContentLoaded", function () {
  getGuides();
  handleRouting(); // Handle current URL on page load

  // Handle browser back/forward buttons
  window.addEventListener("popstate", handleRouting);
});

// Handle routing based on current URL
const handleRouting = () => {
  const path = window.location.pathname;
  console.log("Current path:", path);

  if (path === "/") {
    showHomepage();
  } else if (path.startsWith("/guide/")) {
    const id = parseInt(path.split("/")[2]);
    if (id && !isNaN(id)) {
      showGuidePage(id);
    } else {
      show404(); // Invalid guide ID
    }
  } else {
    show404(); // Any other invalid route
  }
};

// Add this 404 handler function
const show404 = () => {
  document.getElementById("homepage").style.display = "none";
  document.getElementById("guide-page").style.display = "none";

  // Create or update 404 page
  let notFoundPage = document.getElementById("not-found-page");
  if (!notFoundPage) {
    notFoundPage = document.createElement("div");
    notFoundPage.id = "not-found-page";
    document.getElementById("app").appendChild(notFoundPage);
  }

  notFoundPage.style.display = "block";
  notFoundPage.innerHTML = `
    <div class="error-page" style="
      text-align: center; 
      padding: 4rem 2rem;
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    ">
      <h1 style="font-size: 6rem; margin: 0; color: #646cff;">404</h1>
      <h2 style="font-size: 2rem; margin: 1rem 0; color: rgba(255,255,255,0.8);">Page Not Found</h2>
      <p style="font-size: 1.2rem; margin-bottom: 2rem; color: rgba(255,255,255,0.6);">
        The page you're looking for doesn't exist.
      </p>
      <button onclick="navigateToHome()" class="back-btn">← Go Home</button>
    </div>
  `;

  document.title = "404 - Business Guide";
};

const getGuides = async () => {
  try {
    const response = await fetch("http://localhost:3001/guides");
    const guides = await response.json();
    displayGuides(guides);
  } catch (error) {
    document.getElementById("guides-container").innerHTML =
      "<p>Error loading guides. Make sure your backend is running!</p>";
    console.error("Error:", error);
  }
};

const displayGuides = (guides) => {
  const container = document.getElementById("guides-container");
  let html = '<div class="cards-grid">'; // Add container for grid layout

  for (let i = 0; i < guides.length; i++) {
    const guide = guides[i];
    html += `
      <div class="guide-card" 
           style="
             background-image: url('${guide.image}'); 
             background-size: cover; 
             background-position: center;
             height: 250px; 
             border-radius: 8px; 
             cursor: pointer; 
             position: relative;
             margin: 20px 0;
           "
           onclick="navigateToGuide(${guide.id})">  <!-- Make clickable -->
        
        <div class="card-overlay" style="
          position: absolute; 
          bottom: 0; 
          left: 0; 
          right: 0; 
          background: linear-gradient(transparent, rgba(0,0,0,0.8)); 
          color: white; 
          padding: 20px;
          border-radius: 0 0 8px 8px;
        ">
          <h3>${guide.title}</h3>
          <div style="margin-top: 10px;">
            <strong>Category:</strong> ${guide.category}<br>
            <strong>By:</strong> ${guide.submittedBy}
          </div>
        </div>
      </div>
    `;
  }

  html += "</div>";
  container.innerHTML = html;
};
// Show homepage
const showHomepage = () => {
  document.getElementById("homepage").style.display = "block";
  document.getElementById("guide-page").style.display = "none";

  // Hide 404 page if it exists
  const notFoundPage = document.getElementById("not-found-page");
  if (notFoundPage) {
    notFoundPage.style.display = "none";
  }

  document.title = "Business Guide";
};

const navigateToGuide = (id) => {
  console.log(`Navigating to guide ${id}`);

  const url = `/guide/${id}`;
  history.pushState({ page: "guide", id: id }, "", url);

  showGuidePage(id);
};

// Navigate back to homepage
const navigateToHome = () => {
  console.log("Navigating to home"); // Debug log

  // Change URL back to home
  history.pushState({ page: "home" }, "", "/");

  // Show homepage
  showHomepage();
};
// Update showGuidePage to hide 404 page
const showGuidePage = async (id) => {
  document.getElementById("homepage").style.display = "none";
  document.getElementById("guide-page").style.display = "block";

  // Hide 404 page if it exists
  const notFoundPage = document.getElementById("not-found-page");
  if (notFoundPage) {
    notFoundPage.style.display = "none";
  }

  console.log(`Loading guide ${id}`);

  try {
    const response = await fetch(`http://localhost:3001/guides/${id}`);

    if (response.ok) {
      const guide = await response.json();
      displayGuideDetails(guide);
      document.title = `${guide.title} - Business Guide`;
    } else {
      document.getElementById("guide-details").innerHTML = `
        <div style="text-align: center; padding: 40px;">
          <h1>Guide Not Found</h1>
          <p>The guide you're looking for doesn't exist.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error fetching guide:", error);
    document.getElementById("guide-details").innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <h1>Error</h1>
        <p>Failed to load guide. Make sure your backend is running!</p>
      </div>
    `;
  }
};

// Display full guide details on individual page
const displayGuideDetails = (guide) => {
  const container = document.getElementById("guide-details");

  container.innerHTML = `
    <article style="
      max-width: 800px; 
      margin: 20px auto; 
      background: white; 
      border-radius: 8px; 
      overflow: hidden; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    ">
      <img src="${guide.image}" alt="${guide.title}" style="
        width: 100%; 
        height: 300px; 
        object-fit: cover;
      ">
      
      <div style="padding: 30px;">
        <h1 style="color: #2c3e50; margin-bottom: 15px; font-size: 2rem;">
          ${guide.title}
        </h1>
        
        <div style="display: flex; gap: 15px; margin-bottom: 20px; align-items: center;">
          <span style="
            background: #3498db; 
            color: white; 
            padding: 5px 15px; 
            border-radius: 20px; 
            font-size: 0.9rem;
          ">${guide.category}</span>
          
          <span style="color: #7f8c8d; font-style: italic;">
            By: ${guide.submittedBy}
          </span>
        </div>
        
        <div style="font-size: 1.1rem; line-height: 1.8; color: #333;">
          <p>${guide.text}</p>
        </div>
      </div>
    </article>
  `;
};
