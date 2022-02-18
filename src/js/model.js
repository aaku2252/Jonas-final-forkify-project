import { async } from 'regenerator-runtime';
import { API_URL, ITEM_PER_PAGE } from './config.js';
import { getJson } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    itemPerPage: ITEM_PER_PAGE,
    page: 1,
  },
};

export const loadRecipe = async function (id) {
  try {
    let { recipe } = await getJson(`${API_URL}${id}`);
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceurl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    let { recipes } = await getJson(`${API_URL}?search=${query}`);
    state.search.results = recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    throw err;
  }
};
export const loadItemPerPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.itemPerPage;
  const end = page * state.search.itemPerPage;
  return state.search.results.slice(start, end);
};

export const servingUpdate = function (servings) {
  state.recipe.ingredients.forEach(rec => {
    rec.quantity = (rec.quantity / state.recipe.servings) * servings;
  });
  state.recipe.servings = servings;
};
