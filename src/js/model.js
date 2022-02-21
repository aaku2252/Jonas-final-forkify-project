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
  bookmark: [],
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
    if (state.bookmark.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.page = 1;
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

const setLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};

export const addBookmark = function (rec) {
  state.bookmark.push(rec);
  if (state.recipe.id === rec.id) state.recipe.bookmarked = true;
  setLocalStorage();
};

export function deleteBookmark(id) {
  const index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);

  if (state.recipe.id === id) state.recipe.bookmarked = false;
  setLocalStorage();
}
function init() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmark = JSON.parse(storage);
}
init();

// just for development phase to clear the local storage
function clearLocalStorage() {
  localStorage.clear('bookmarks');
}
// clearLocalStorage();
