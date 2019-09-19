const join = require("lodash/join");

class Queue {
	constructor() {
		this.items = [];
	}

	enqueue(element) {
		// adding element to the queue
		this.items.push(element);
	}

	dequeue() {
		if (this.isEmpty()) return "Queue is empty";
		return this.items.shift();
	}

	peek() {
		if (this.isEmpty()) return "No elements in Queue";
		return this.items[0];
	}

	isEmpty() {
		return this.items.length === 0;
	}
}

module.exports = Queue;
