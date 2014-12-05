define([], function () {
    function EventEmitter() {
        this._listeners = {};
    }

    var _p = EventEmitter.prototype;

    _p.addEventListener = _p.on = function (type, listener) {
        if (typeof listener !== 'function') {
            throw 'Listener must be a function';
        }

        if (!this._listeners[type]) {
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
    };

    _p.emit = function (type, event) {
        if (!this._listeners[type]) {
            return;
        }

        for (var i = 0; i < this._listeners[type].length; i++) {
            this._listeners[type][i].call(this, event);
        }
    };

    return EventEmitter;
});


