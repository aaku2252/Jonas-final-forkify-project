import { async } from 'regenerator-runtime';
import { API_URL, ITEM_PER_PAGE, KEY } from './config.js';
import { getJson, sendJson } from './helpers.js';

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

function createRecipeObject(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceurl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}
export const loadRecipe = async function (id) {
  try {
    let { recipe } = await getJson(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(recipe);
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
    let { recipes } = await getJson(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
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

export const uploadData = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(item => item[0].startsWith('ingredient') && item[1] !== '')
      .map(entry => {
        const ingArr = entry[1].split(',').map(item => item.trim(' '));
        if (ingArr.length !== 3)
          throw new Error('Please input the correct format for the recipe!🙄');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      image_url: newRecipe.imageUrl,
      cooking_time: newRecipe.cookingTime,
      source_url: newRecipe.sourceUrl,
      publisher: newRecipe.publisher,
      image_url: newRecipe.image,
      servings: newRecipe.servings,
      ingredients,
    };

    const data = await sendJson(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data.recipe);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// just for development phase to clear the local storage
function clearLocalStorage() {
  localStorage.clear('bookmarks');
}
// clearLocalStorage();
