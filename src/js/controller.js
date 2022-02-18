//original app url - https://forkify-v2.netlify.app/#5ed6604591c37cdc054bcd09
// https://forkify-api.herokuapp.com/v2

import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultView from './view/resultView.js';
import paginationView from './view/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.loadingSpinner();

    resultView.update(model.loadItemPerPage());
    //  1) loading recipe
    await model.loadRecipe(id);

    //rendering the recipe in the container

    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) resultView.renderError();
    resultView.loadingSpinner();

    await model.loadSearchResults(query);
    resultView.render(model.loadItemPerPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

function controlPagination(page) {
  resultView.render(model.loadItemPerPage(page));
  paginationView.render(model.state.search);
}
function controlServings(newServing) {
  model.servingUpdate(newServing);

  recipeView.update(model.state.recipe);
}

function init() {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerRender(controlPagination);
  recipeView.updateServingsBtn(controlServings);
}
init();
