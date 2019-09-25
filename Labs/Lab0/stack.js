const reverse = require("lodash/reverse");

// Custom Stack data structure
class Stack {
	constructor() {
		this.items = [];
	}

	push(element) {
		this.items.push(element);
	}

	pop() {
    if (this.isEmpty()) return "Stack is empty";
    return this.items.pop();
    }

    peek() {
        if (this.isEmpty()) return "Stack is empty";
        return this.items[this.items.length - 1];
    }

	isEmpty() {
		return this.items.length === 0;
	}

    reverseStack() {
        this.items = reverse(this.items);
    }
}

module.exports = Stack;
