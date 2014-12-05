define([], function () {
    function AppController(rootElement, bookStore) {
        this._rootElement = rootElement;
        this._bookStore = bookStore;

        var self = this;
        bookStore.on('book_added', function (book) {
            var el = document.createElement('li');
            el.setAttribute('data-id', book.id);
            el.setAttribute('class', 'book');

            var template = document.getElementById('book_template').innerHTML;

            el.innerHTML = template.replace('{{name}}', book.name);

            self._rootElement.appendChild(el);

            el.querySelector('.remove').addEventListener('click', function (e) {
                var bookId = parseInt(this.parentNode.getAttribute('data-id'));
                var book = bookStore.getBook(bookId);
                var result = bookStore.remove(book);

                if (result.length > 0) {
                    console.log(book.name, 'removed');
                }
            });
        });

        bookStore.on('book_removed', function (book) {
            self._rootElement.querySelector('li[data-id="' + book.id + '"]').remove();
        });
    }

    return AppController;
});

