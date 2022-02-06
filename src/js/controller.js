//original app url - https://forkify-v2.netlify.app/#5ed6604591c37cdc054bcd09

import * as model from './model.js';
import recipeView from './view/recipeView.js';

//polyfilling async await and other functions

import 'core-js/stable';
import 'regenerator-runtime/runtime';

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

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    // if (!id) return;
    recipeView.loadingSpinner();

    //  1) loading recipe
    await model.loadRecipe();

    //rendering the recipe in the container
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
  }
};
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);

//* rendering the recipe result
//     results.insertAdjacentHTML(
//       'afterbegin',
//       `<li class="preview">
//             <a      class = "preview__link preview__link--active" href = "#23456">
//             <figure class = "preview__fig">
//             <img    src   = "${recipe.image}" alt                      = "Test" />
//               </figure>
//               <div class = "preview__data">
//               <h4  class = "preview__title">${recipe.title}</h4>
//               <p   class = "preview__publisher">${recipe.publisher}</p>
//               <div class = "preview__user-generated">
//                   <svg>
//                     <use href = "${icons}#icon-user"></use>
//                   </svg>
//                 </div>
//               </div>
//             </a>
//           </li>`
//     );
//     pagination_btn.innerHTML = ` <button class="btn--inline pagination__btn--prev">
//             <svg class = "search__icon">
//             <use href  = "${icons}#icon-arrow-left" alt = "1"></use>
//             </svg>
//             <span>Page 1</span>
//           </button>
//           <button class = "btn--inline pagination__btn--next">
//             <span>Page 3</span>
//             <svg class = "search__icon">
//             <use href  = "${icons}#icon-arrow-right"></use>
//             </svg>
//           </button>`;
