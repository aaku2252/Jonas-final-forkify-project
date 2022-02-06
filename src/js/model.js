import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { getJson } from './helpers';
export const state = {
  recipe: {},
};

export const loadRecipe = async function (id = '5ed6604591c37cdc054bc8f8') {
  try {
    let recipe = await getJson(`${API_URL}${id}`);

    state.recipe = {
      recipe: recipe.id,
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
