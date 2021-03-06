define([], function () {
    function AppController(rootElement, bookStore) {
        this._rootElement = rootElement;

        var self = this;

        function addNotice(notice) {
            if (this.getElementsByClassName('notice').length > 0) {
                noticeNode = this.getElementsByClassName('notice')[0];
                noticeNode.innerHTML = notice;
                return;
            }
            noticeNode = document.createElement('span');
            noticeNode.classList.add('notice');
            noticeNode.innerHTML = notice;
            this.appendChild(noticeNode);
        }

        function deleteNotice() {
            if (this.getElementsByClassName('notice').length > 0) {
                this.getElementsByClassName('notice')[0].remove();
            }
        }

        function disableEditMode() {
            var actions = this.getElementsByClassName('actions')[0];
            actions.getElementsByClassName('save')[0].classList.add('hide');
            actions.getElementsByClassName('cancel')[0].classList.add('hide');
            actions.getElementsByClassName('remove')[0].classList.remove('hide');
            actions.getElementsByClassName('edit')[0].classList.remove('hide');

            this.getElementsByClassName('name')[0].classList.remove('hide');
            this.getElementsByTagName('input')[0].remove();
            this.classList.remove('editing');
        }

        function enableEditMode() {
            var actions = this.getElementsByClassName('actions')[0];
            actions.getElementsByClassName('remove')[0].classList.add('hide');
            actions.getElementsByClassName('edit')[0].classList.add('hide');
            actions.getElementsByClassName('cancel')[0].classList.remove('hide');
            actions.getElementsByClassName('save')[0].classList.remove('hide');

            this.getElementsByClassName('name')[0].classList.add('hide');

            var input = document.createElement('input');
            input.value = this.getElementsByClassName('name')[0].innerHTML;

            input.addEventListener('keydown', function(e) {
                if (e.keyCode === 13) {
                    eventSave.call(this.parentNode);
                }
            }, false);

            this.appendChild(input);
            this.classList.add('editing');
            input.focus();
        }

        function eventSave() {
            var bookId = parseInt(this.getAttribute('data-id')); // very bad
            var input = this.getElementsByTagName('input')[0];
            var newName = input.value;

            var result = bookStore.update(bookId, newName);

            if (result === '') {
                deleteNotice.call(this);
                disableEditMode.call(this);
            } else {
                addNotice.call(this, result);
                input.focus();
            }
        }

        bookStore.on('book_added', function (book) {
            var el = document.createElement('li');
            el.setAttribute('data-id', book.id);
            el.setAttribute('class', 'book');

            var template = document.getElementById('book_template').innerHTML;

            el.innerHTML = template.replace('{{name}}', book.name);

            var firstElement = self._rootElement.getElementsByTagName('li')[0];
            self._rootElement.insertBefore(el, firstElement);

            el.querySelector('.remove').addEventListener('click', function () {
                var bookId = parseInt(this.parentNode.parentNode.getAttribute('data-id')); // very bad
                var book = bookStore.getBook(bookId);
                var result = bookStore.remove(book);

                if (result.length > 0) {
                    console.log(book.name, 'removed');
                }
            });

            el.querySelector('.save').addEventListener('click', function() {
                eventSave.call(this.parentNode.parentNode);

            });

            el.querySelector('.edit').addEventListener('click', function () {
                enableEditMode.call(this.parentNode.parentNode);
            });

            el.querySelector('.cancel').addEventListener('click', function () {
                var li = this.parentNode.parentNode;
                deleteNotice.call(li);
                disableEditMode.call(li);
            });
        });

        bookStore.on('book_updated', function (book) {
            self._rootElement.querySelector('li[data-id="' + book.id + '"] span.name').innerHTML = book.name;

        });

        bookStore.on('book_removed', function (book) {
            self._rootElement.querySelector('li[data-id="' + book.id + '"]').remove();
        });
    }

    return AppController;
});

