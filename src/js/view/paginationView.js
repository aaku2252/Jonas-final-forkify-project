import icons from 'url:../../img/icons.svg';

class PaginationView {
  #parentElement = document.querySelector('.pagination');
  #data;
  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#parentElement.innerHTML = '';
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  #generateMarkup() {
    const curPage = this.#data.page;
    const numPages = Math.ceil(
      this.#data.results.length / this.#data.itemPerPage
    );
    //first page and  other page
    if (curPage === 1 && numPages > 1) {
      return `<button data-goto = "${
        curPage + 1
      }" class = "btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class = "search__icon">
                <use href  = "${icons}#icon-arrow-right"></use>
                </svg>
              </button>`;
    }
    // last page
    if (curPage === numPages && numPages > 1) {
      return `<button data-goto = "${
        curPage - 1
      }" class="btn--inline pagination__btn--prev"> 
                <svg class = "search__icon"> 
                <use href  = "${icons}#icon-arrow-left"></use> 
                </svg> 
                <span>Page ${curPage - 1}</span> 
              </button>`;
    }
    //other page
    if (curPage < numPages) {
      return ` <button data-goto = "${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class = "search__icon">
            <use href  = "${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          <button data-goto = "${
            curPage + 1
          }" class = "btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class = "search__icon">
            <use href  = "${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    //first page and no other page
    return '';
  }
  #clear() {
    this.#parentElement.innerHTML̥ = '';
  }
  addHandlerRender(handler) {
    this.#parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = parseInt(btn.dataset.goto);
      handler(goToPage);
    });
  }
}
export default new PaginationView();
