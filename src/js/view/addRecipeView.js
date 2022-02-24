import icons from 'url:../../img/icons.svg';

class AddRecipeView {
  #errorMsg = 'Please input the correct format for the recipe!🙄';
  #successMsg = 'Your Recipe has been submitted successfully! Enjoy the meal👌';
  #parentElement = document.querySelector('.upload');
  #window = document.querySelector('.add-recipe-window');
  #overlay = document.querySelector('.overlay');
  #btnOpen = document.querySelector('.nav__btn--add-recipe');
  #btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    this.#showAddRecipe();
    this.#closeAddRecipe();
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
  #clear() {
    this.#parentElement.innerHTML = '';
  }

  toggleHidden() {
    this.#window.classList.toggle('hidden');
    this.#overlay.classList.toggle('hidden');
  }

  #showAddRecipe() {
    this.#btnOpen.addEventListener('click', this.toggleHidden.bind(this));
  }
  #closeAddRecipe() {
    this.#btnClose.addEventListener('click', this.toggleHidden.bind(this));
    this.#overlay.addEventListener('click', this.toggleHidden.bind(this));
  }

  userRecipeData(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      //new Form creates the key value pair of a form
      const dataArray = [...new FormData(this)];
      // fromEntries creates an Object from any iterable
      const data = Object.fromEntries(dataArray);

      handler(data);
    });
  }

  #generateMarkup() {}
}
export default new AddRecipeView();
