import icons from 'url:../../img/icons.svg';

class ResultView {
  #parentElement = document.querySelector('.results');
  #errorMsg =
    'There is no result for your query, Please enter a valid recipe name.';
  #successMsg = '';
  #data;
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
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
  update(data) {
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
  #generateMarkup() {
    return this.#data.map(this.#generateMarkupPreview).join('');
  }
  #generateMarkupPreview(data) {
    const id = window.location.hash.slice(1);

    return `<li class="preview">
             <a      class = "preview__link ${
               data.id === id ? 'preview__link--active' : ''
             } " href = "#${data.id}">
             <figure class = "preview__fig">
             <img    src   = "${data.image}" alt   = ${data.title} />
               </figure>
               <div class = "preview__data">
               <h4  class = "preview__title">${data.title}</h4>
               <p   class = "preview__publisher">${data.publisher}</p>
                  <div class="preview__user-generated  ${
                    data.key ? '' : 'hidden'
                  }">
                    <svg>
                       <use href="${icons}#icon-user"></use>
                    </svg>
                  </div>
               </div>
             </a>
           </li>`;
  }
}
export default new ResultView();
