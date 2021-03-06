import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class RecipeView {
  #parentElement = document.querySelector('.recipe');
  #errorMsg = 'Could not find the dish, Please try another Recipe!';
  #successMsg = '';

  #data;
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log('error in recipeView');
      return this.renderError();
    }

    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  //algorithm for updating the recipe data without re rendering the whole recipe
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0)) {
    //   console.log('error in recipeView');
    //   return this.renderError();
    // }

    this.#data = data;
    const newMarkup = this.#generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDom.querySelectorAll('*'));
    const curElement = Array.from(this.#parentElement.querySelectorAll('*'));

    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
  #clear() {
    this.#parentElement.innerHTML = '';
  }

  loadingSpinner() {
    this.#clear();
    this.#parentElement.insertAdjacentHTML(
      'afterbegin',
      ` <div class="spinner">
          <svg>
            <use href = "${icons}#icon-loader"></use>
          </svg>
        </div>`
    );
  }

  renderError(err = this.#errorMsg) {
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${err}</p>
          </div> `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMsg(msg = this.#successMsg) {
    const markup = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${msg}</p>
          </div> `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  updateServingsBtn(handler) {
    this.#parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const newServing = +btn.dataset.serving;
      if (newServing > 0) handler(newServing);
    });
  }
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }
  addBookmarkHandler(handler) {
    this.#parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }
  #generateMarkup() {
    return `<figure class = "recipe__fig">
      <img    src   = "${this.#data.image}" alt = "${
      this.#data.title
    }" class = "recipe__img" />
      <h1 class = "recipe__title">
            <span>${this.#data.title}</span>
          </h1>
        </figure>

        <div class = "recipe__details">
        <div class = "recipe__info">
        <svg class = "recipe__info-icon">
        <use href  = "${icons}#icon-clock"></use>
            </svg>
            <span class = "recipe__info-data recipe__info-data--minutes">${
              this.#data.cookingTime
            }</span>
            <span class = "recipe__info-text">minutes</span>
          </div>
          <div class = "recipe__info">
          <svg class = "recipe__info-icon">
          <use href  = "${icons}#icon-users"></use>
            </svg>
            <span class = "recipe__info-data recipe__info-data--people">${
              this.#data.servings
            }</span>
            <span class = "recipe__info-text">servings</span>

            <div    class = "recipe__info-buttons">
            <button data-serving = "${
              this.#data.servings - 1
            }"  class = "btn--tiny btn--update-servings">
                <svg>
                  <use  href = "${icons}#icon-minus-circle"></use>
                </svg>
            </button>
              <button data-serving = "${
                this.#data.servings + 1
              }"  class = "btn--tiny btn--update-servings">
                <svg>
                  <use href = "${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="recipe__user-generated  ${
            this.#data.key ? '' : 'hidden'
          }">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          
          <button class = "btn--round btn--bookmark">
          <svg    class = "">
          <use    href  = "${icons}#${
      this.#data.bookmarked === true ? 'icon-bookmark-fill' : 'icon-bookmark'
    }"></use>
            </svg>
          </button>
        </div>

        <div class = "recipe__ingredients">
        <h2  class = "heading--2">Recipe ingredients</h2>
        <ul  class = "recipe__ingredient-list">

        
      ${this.#data.ingredients.map(this.#generateMarkupIngredients).join('')}
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
        </div>`;
  }

  #generateMarkupIngredients(rec) {
    return `<li class="recipe__ingredient">
           <svg class = "recipe__icon">
           <use href  = "${icons}#icon-check"></use>
           </svg>
           <div  class = "recipe__quantity">${
             rec.quantity ? new Fraction(rec.quantity).toString() : ''
           }</div>
           <div  class = "recipe__description">
           <span class = "recipe__unit">${rec.unit || ''}</span>
             ${rec.description}
           </div>
         </li>`;
  }
}
export default new RecipeView();
