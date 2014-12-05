require(['BookStore', 'AppController'], function (BookStore, AppController) {
    var bookStore = new BookStore();

    var form = document.getElementById('add_book');

    form.addEventListener('submit', function (e) {
        var input = form.querySelector('input');
        var title = input.value.trim();
        input.value = '';

        var result = bookStore.add({
            name: title
        });

        e.preventDefault();

        if (result !== 0) {
            console.log(title, 'added');
        }
    });

    new AppController(document.getElementById('book_list'), bookStore);

});







