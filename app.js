  
const RecipeApp = (() => {
  console.log("RecipeApp initializing...");

  // ---------------- DATA ----------------
  const recipes = [
    {
      id: 1,
      title: "Veg Dosa",
      ingredients: ["Rice", "Urad dal", "Salt", "Oil"],
      steps: [
        "Soak rice and dal",
        {
          text: "Prepare batter",
          substeps: [
            "Grind soaked rice",
            "Grind soaked dal",
            {
              text: "Ferment batter",
              substeps: ["Leave overnight", "Check bubbles"]
            }
          ]
        },
        "Cook dosa on tawa"
      ]
    },
    {
      id: 2,
      title: "Tea",
      ingredients: ["Water", "Tea leaves", "Milk", "Sugar"],
      steps: [
        "Boil water",
        "Add tea leaves",
        "Add milk and sugar",
        "Serve hot"
      ]
    }
  ];

  // ---------------- DOM ----------------
  const recipeContainer = document.querySelector("#recipe-container");

  // ---------------- HELPERS ----------------
  const renderSteps = (steps, level = 0) => {
    const ul = document.createElement("ul");

    steps.forEach(step => {
      const li = document.createElement("li");

      if (typeof step === "string") {
        li.textContent = step;
      } else {
        li.textContent = step.text;
        li.classList.add("substep");
        li.appendChild(renderSteps(step.substeps, level + 1));
      }

      ul.appendChild(li);
    });

    return ul;
  };

  const createStepsHTML = (steps) => {
    const container = document.createElement("div");
    container.className = "steps";
    container.appendChild(renderSteps(steps));
    return container;
  };

  const createRecipeCard = (recipe) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <button class="toggle-btn" data-id="${recipe.id}" data-toggle="steps">Show Steps</button>
      <button class="toggle-btn" data-id="${recipe.id}" data-toggle="ingredients">Show Ingredients</button>

      <div class="steps-container" data-id="${recipe.id}"></div>
      <div class="ingredients-container" data-id="${recipe.id}">
        <ul>
          ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
        </ul>
      </div>
    `;

    const stepsContainer = card.querySelector(".steps-container");
    stepsContainer.appendChild(createStepsHTML(recipe.steps));

    return card;
  };

  const renderRecipes = () => {
    recipeContainer.innerHTML = "";
    recipes.forEach(r => recipeContainer.appendChild(createRecipeCard(r)));
  };

  const handleToggleClick = (e) => {
    if (!e.target.classList.contains("toggle-btn")) return;

    const recipeId = e.target.dataset.id;
    const toggleType = e.target.dataset.toggle;

    const container = document.querySelector(
      `.${toggleType}-container[data-id="${recipeId}"]`
    );

    container.classList.toggle("visible");
    e.target.textContent = container.classList.contains("visible")
      ? `Hide ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}`
      : `Show ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}`;
  };

  // ---------------- EVENTS ----------------
  const setupEventListeners = () => {
    recipeContainer.addEventListener("click", handleToggleClick);
    console.log("Event listeners attached!");
  };

  // ---------------- INIT ----------------
  const init = () => {
    renderRecipes();
    setupEventListeners();
    console.log("RecipeApp ready!");
  };

  return { init };
})();

RecipeApp.init();
