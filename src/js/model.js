import { async } from 'regenerator-runtime';
export const state = {
  recipe: {},
};

export const loadRecipe = async function (id = '5ed6604591c37cdc054bc8f7') {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );

    const data = await res.json();
    if (!res.ok) throw new Error(`Error is :${data.message} ${data.status}`);

    let { recipe } = data.data;
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
    console.log(err);
  }
};
