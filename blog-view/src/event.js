export {Event, EventHandler};

class Event {
    constructor(name)  {
        this.subscriptions = [];
        this.name = name;
    }
    subscribe(callBack) {
        this.subscriptions.push(callBack)
    }

    broadcast(message) {
        this.subscriptions.forEach(function(element) {
            element(message);
        });
    }
}

class EventHandler {
    constructor() {
        this.events = {};
    }

    addEvent(event) {
        this.events[event.name] = event;
    }

    subscribe(name, callBack) {
        this.events[name].subscribe(callBack);
    }

    emit(name, message) {
        this.events[name].broadcast(message);
    }
}