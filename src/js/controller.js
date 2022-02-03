//> original app url - https://forkify-v2.netlify.app/#5ed6604591c37cdc054bcd09
import icons from 'url:../img/icons.svg';
//* polyfilling async await and other functions
import 'core-js/stable';
import 'regenerator-runtime/runtime';
console.log(icons);

const recipeContainer = document.querySelector('.recipe');
const results = document.querySelector('.results');
const pagination_btn = document.querySelector('.pagination');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
// API for forkify app
// https://forkify-api.herokuapp.com/v2

const loadingSpinner = function (el) {
  el.innerHTML = '';
  el.insertAdjacentHTML(
    'afterbegin',
    ` <div class="spinner">
          <svg>
            <use href = "${icons}#icon-loader"></use>
          </svg>
        </div>`
  );
};

const showRecipe = async function () {
  try {
    loadingSpinner(recipeContainer);
    //* loading recipe
    const res = await fetch(
      'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    );
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${data.status}`);

    let { recipe } = data.data;
    recipe = {
      recipe: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceurl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);
    //* rendering the recipe result
    results.innerHTML = `<li class="preview">
            <a      class = "preview__link preview__link--active" href = "#23456">
            <figure class = "preview__fig">
            <img    src   = "${recipe.image}" alt                      = "Test" />
              </figure>
              <div class = "preview__data">
              <h4  class = "preview__title">${recipe.title}</h4>
              <p   class = "preview__publisher">${recipe.publisher}</p>
              <div class = "preview__user-generated">
                  <svg>
                    <use href = "${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
          </li>`;
    pagination_btn.innerHTML = ` <button class="btn--inline pagination__btn--prev">
            <svg class = "search__icon">
            <use href  = "${icons}#icon-arrow-left" alt = "1"></use>
            </svg>
            <span>Page 1</span>
          </button>
          <button class = "btn--inline pagination__btn--next">
            <span>Page 3</span>
            <svg class = "search__icon">
            <use href  = "${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;

    //*rendering the recipe in the container
    recipeContainer.innerHTML = '';
    recipeContainer.insertAdjacentHTML(
      'afterbegin',
      `
      <figure class = "recipe__fig">
      <img    src   = "${recipe.image}" alt = "${
        recipe.title
      }" class = "recipe__img" />
      <h1     class = "recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class = "recipe__details">
        <div class = "recipe__info">
        <svg class = "recipe__info-icon">
        <use href  = "${icons}#icon-clock"></use>
            </svg>
            <span class = "recipe__info-data recipe__info-data--minutes">${
              recipe.cookingTime
            }</span>
            <span class = "recipe__info-text">minutes</span>
          </div>
          <div class = "recipe__info">
          <svg class = "recipe__info-icon">
          <use href  = "${icons}#icon-users"></use>
            </svg>
            <span class = "recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class = "recipe__info-text">servings</span>

            <div    class = "recipe__info-buttons">
            <button class = "btn--tiny btn--increase-servings">
                <svg>
                  <use href = "${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class = "btn--tiny btn--increase-servings">
                <svg>
                  <use href = "${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class = "recipe__user-generated">
            <svg>
              <use href = "${icons}#icon-user"></use>
            </svg>
          </div>
          <button class = "btn--round">
          <svg    class = "">
          <use    href  = "${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class = "recipe__ingredients">
        <h2  class = "heading--2">Recipe ingredients</h2>
        <ul  class = "recipe__ingredient-list">

        
      ${recipe.ingredients
        .map(rec => {
          return `<li class="recipe__ingredient">
           <svg class = "recipe__icon">
           <use href  = "${icons}#icon-check"></use>
           </svg>
           <div  class = "recipe__quantity">${rec.quantity || ''}</div>
           <div  class = "recipe__description">
           <span class = "recipe__unit">${rec.unit || ''}</span>
             ${rec.description}
           </div>
         </li>`;
        })
        .join('')}
          </ul>
        </div>

        <div class = "recipe__directions">
        <h2  class = "heading--2">How to cook it</h2>
        <p   class = "recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class = "recipe__publisher">The Pioneer Woman</span>. Please check out
            directions at their website.
          </p>
          <a
            class  = "btn--small recipe__btn"
            href   = "http://thepioneerwoman.com/cooking/pasta-with-tomato-cream-sauce/"
            target = "_blank"
          >
            <span>Directions</span>
            <svg class = "search__icon">
            <use href  = "${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`
    );
  } catch (err) {
    console.log(err);
  }
};
showRecipe();
