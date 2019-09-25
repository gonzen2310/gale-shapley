const join = require("lodash/join");
const indexOf = require("lodash/indexOf");

class Person {
	constructor(name) {
		this._name = name;
		this._priorities = [];
		this._isEngaged = false;
		this._partner = null;
	}

  // return person name
	get name() { return this._name;	}

  // return whether a person is engaged or no
	get isEngaged() { return this._isEngaged;	}

  // return person partnet
	get partner() { return this._partner; }

  // return person list of preferences
	get priorities() { return this._priorities; }

  // set engagements status
	set isEngaged(status) { this._isEngaged = status; }

  // set partner for person
	set partner(partner) { this._partner = partner; }

  // set priorities for person
	set priorities(priorities) { this._priorities = priorities; }

	// returns a stringified version of the list of priorities for this person
	getPriorities() {
		return join(this.priorities.map(priority => priority.name), " ");
	}
}

class Man extends Person {
  constructor(name) {
    super(name);
    this._currentIndex = 0;
  }

    get currentIndex() {
        return this._currentIndex;
    }

    set currentIndex(index) {
        this._currentIndex = index;
    }

	/**
		@param { Woman } partner
		@summary enganges this man with a women (partner)
	 */
	engageToPartner(partner) {
		this.isEngaged = true;
		partner.isEngaged = true;
		this.partner = partner;
		partner.partner = this;
	}
}

class Woman extends Person {
	constructor(name) {
    super(name);
  }

	/**
		@param { Man } currentSuitor
		@param { Man } newSuitor
		@returns { boolean } true if the new suitor has higher priority than the current partnet else rturns false
	 */
	prefersNewOverCurrent(currentSuitor, newSuitor) {
		// Check if women prefers new suitor over current partner
		if (
			indexOf(this.priorities, currentSuitor) >
			indexOf(this.priorities, newSuitor)
		) {
			return true;
		}
		return false;
	}
}

module.exports = { Man, Woman };