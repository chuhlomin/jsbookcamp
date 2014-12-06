console.clear();

require(['BookStore', 'AppController'], function (BookStore, AppController) {
    var bookStore = new BookStore();

    var form = document.getElementById('add_book');

    form.getElementsByTagName('input')[0].focus();

    form.addEventListener('submit', function (e) {
        var input = form.querySelector('input');
        var title = input.value.trim();

        var result = bookStore.add({
            name: title
        });

        e.preventDefault();

        if (result !== 0) {
            input.value = '';
            console.log(title, 'added');
        }

    });

    new AppController(document.getElementById('book_list'), bookStore);

    var book1 = {name: 'Pride and Prejudice'};
    var book2 = {name: 'A Tale of Two Cities' };
    var book3 = {name: 'Treasure Island'};
    var book4 = {name: 'Dracula'};

    bookStore.add(book1, book2, book3, book4);
});







