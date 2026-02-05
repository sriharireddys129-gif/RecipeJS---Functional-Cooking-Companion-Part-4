
(() => {
  // -------------------- STATE --------------------
  const recipes = [
    { id: 1, title: "Idli", ingredients: ["rice", "urad dal"], veg: true, description: "Soft steamed cakes" },
    { id: 2, title: "Dosa", ingredients: ["rice", "dal"], veg: true, description: "Crispy dosa" },
    { id: 3, title: "Chicken Curry", ingredients: ["chicken", "spices"], veg: false, description: "Spicy curry" }
  ];

  let activeFilter = "all";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];

  // -------------------- DOM --------------------
  const recipeContainer = document.querySelector("#recipe-container");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const searchInput = document.querySelector("#search-input");
  const clearSearchBtn = document.querySelector("#clear-search");
  const recipeCounter = document.querySelector("#recipe-counter");

  let debounceTimer;

  // -------------------- HELPERS --------------------
  const saveFavorites = () => {
    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
  };

  const toggleFavorite = (id) => {
    favorites = favorites.includes(id)
      ? favorites.filter(fid => fid !== id)
      : [...favorites, id];
    saveFavorites();
    updateDisplay();
  };

  const createCard = (recipe) => {
    const card = document.createElement("div");
    card.className = "card";

    const favClass = favorites.includes(recipe.id) ? "favorite active" : "favorite";

    card.innerHTML = `
      <span class="${favClass}" data-id="${recipe.id}">❤️</span>
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <small>${recipe.ingredients.join(", ")}</small>
    `;

    return card;
  };

  const applySearch = (data) => {
    if (!searchQuery) return data;
    const q = searchQuery.toLowerCase();
    return data.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.toLowerCase().includes(q)) ||
      r.description.toLowerCase().includes(q)
    );
  };

  const applyFilter = (data) => {
    if (activeFilter === "veg") return data.filter(r => r.veg);
    if (activeFilter === "favorites") return data.filter(r => favorites.includes(r.id));
    return data;
  };

  const updateCounter = (count, total) => {
    recipeCounter.textContent = `Showing ${count} of ${total} recipes`;
  };

  const render = (data) => {
    recipeContainer.innerHTML = "";
    data.forEach(r => recipeContainer.appendChild(createCard(r)));
    updateCounter(data.length, recipes.length);
  };

  const updateDisplay = () => {
    let data = applySearch(recipes);
    data = applyFilter(data);
    render(data);
  };

  // -------------------- EVENTS --------------------
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      updateDisplay();
    });
  });

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value.trim();
      clearSearchBtn.hidden = !searchQuery;
      updateDisplay();
    }, 300);
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.hidden = true;
    updateDisplay();
  });

  recipeContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("favorite")) {
      toggleFavorite(Number(e.target.dataset.id));
    }
  });

  // -------------------- INIT --------------------
  updateDisplay();
})();
