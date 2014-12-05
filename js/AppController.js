define([], function () {
    function AppController(rootElement, bookStore) {
        this._rootElement = rootElement;
        this._bookStore = bookStore;

        var self = this;
        bookStore.on('book_added', function (book) {
            var el = document.createElement('li');
            el.setAttribute('data-id', book.id);

            var template = document.getElementById('book_template').innerHTML;

            el.innerHTML = template.replace('{{name}}', book.name);

            self._rootElement.appendChild(el);

            console.log(el.getElementsByTagName('button'));

            /*

                .addEventListener('click', function (e) {

                console.log(e.parent.id);

                // bookStore.remove();

                e.preventDefault();
                console.log(title, 'removed');
            });*/
        });

        bookStore.on('book_removed', function (book) {
            document.getElementById('book_' + book.id).remove();
        });
    }

    return AppController;
});

