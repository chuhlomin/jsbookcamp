define(['EventEmitter'], function (EventEmitter) {
    "use strict";

    function BookStore() {
        EventEmitter.call(this);
        this._items = [];
        this._last_id = 0;
    }

    var _p = BookStore.prototype = Object.create(EventEmitter.prototype, {
        constructor: {
            value: BookStore,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    _p._isValidBookObject = function (book) {
        if (book === null) {
            return false;
        }

        if (typeof book !== 'object') {
            return false;
        }

        return book.name !== undefined;
    };

    _p._getBookIndexByName = function (name, partial) {
        if (typeof name !== 'string') {
            return false;
        }

        for (var i = 0; i < this._items.length; i++) {

            if (partial && this._items[i].name.toUpperCase().lastIndexOf(name.toUpperCase()) > -1) {
                return ++i;
            }

            if (!partial && this._items[i].name.toUpperCase() === name.toUpperCase()) {
                return ++i;
            }
        }

        return false;
    };

    _p._getBookIndexById = function (id) {

        if (typeof id !== 'number') {
            return false;
        }

        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i].id === id) {
                return ++i; // trick for 0
            }
        }

        return false;
    };

    _p._getBookIndexByObject = function (book) {
        if (typeof book !== 'object') {
            return false;
        }

        return this._getBookIndexByName(book.name)
    };

    _p.add = function () {
        var result = [];
        var book_index;
        var book;

        for (var i = 0; i < arguments.length; i++) {

            book = arguments[i];

            if (Array.isArray(book)) {
                var result_temp;
                var book_temp;
                for (var j = 0; j < book.length; j++) {
                    result_temp = this.add(book[j]);

                    if (!Array.isArray(result_temp)) {
                        continue;
                    }

                    if (result_temp.length !== 1) {
                        continue;
                    }

                    book_temp = result_temp[0]
                    if (this._isValidBookObject(book_temp)) {
                        result.push(book_temp);
                    }
                }
                continue;
            }

            if (!this._isValidBookObject(book)) {
                continue;
            }

            book_index = this._getBookIndexByObject(book);

            if (book_index !== false) {
                continue;
            }

            this._last_id++;
            book.id = this._last_id;

            this._items.push(book);
            this.emit('book_added', book);

            result.push(book);
        }

        if (result.length == 0) {
            return 0;
        }

        return result;
    };

    _p.addAsync = function (book, cb) {
        var self = this;

        setTimeout(function () {
            self.add(book);
            cb(null, book);
        }, 3000);
    };

    _p.remove = function () {
        var result = [];
        var book;
        var book_index;

        for (var i = 0; i < arguments.length; i++) {

            book = arguments[i];

            book_index =
                this._getBookIndexById(book) ||
                this._getBookIndexByObject(book);

            if (book_index === false) {
                continue;
            }

            book_index--;
            result.push(this._items[book_index]);
            this._items.splice(book_index, 1);
            this.emit('book_removed', book);
        }

        return result;
    };

    _p.find = function () {
        var result = [];
        var book_index;

        for (var i = 0; i < arguments.length; i++) {

            book_index =
                this._getBookIndexById(arguments[i]) ||
                this._getBookIndexByName(arguments[i], true);

            if (book_index === false) {
                continue;
            }

            book_index--;
            result.push(this._items[book_index]);

        }

        return result;
    };

    _p.all = function () {
        return this._items.slice(0);
    };

    _p._print_element = function (element) {
        console.log(JSON.stringify(element));
    };

    _p.print = function () {
        var i;

        if (arguments.length == 0) {
            for (i = 0; i < this._items.length; i++) {
                this._print_element(this._items[i]);
            }
            return;
        }

        var book;
        for (i = 0; i < arguments.length; i++) {
            book = arguments[i];

            if (this._isValidBookObject(book)) {
                this._print_element(book);
            }

            if (Array.isArray(book)) {
                for (var j = 0; j < book.length; j++) {
                    this._print_element(book[j]);
                }
            }
        }
    };

    return BookStore;
});

