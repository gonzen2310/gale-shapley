/**
Program Name: gs.py
Created by: Gonzalo Eladio Reyes
Date: 9/15/2019
PURPOSE: Implement the Gale-Shapley algorithm for 10 suitors
INPUT(S): Ask to re-run program (yes/no)
OUTPUT(S):
 	1. Name of all participants
 	2. Preferences of all participants
 	3: Gale-Shapley procedure
 	4. Execution Time
	5. Ask to rerun program
Run Program:
 	1. Install node and npm on your computer
  2. Install yarn
 	3. Navigate to ~/CSC321/Labs/Lab0/
	4. Execute > yarn install
	5. Run > node gs.js
*/

const _ = require("lodash");
const Queue = require("./queue");

class Person {
	constructor(name) {
		this._name = name;
		this._priorities = [];
		this._isEngaged = false;
		this._partner = null;
	}

	get name() { return this._name;	}

	get isEngaged() { return this._isEngaged;	}

	get partner() { return this._partner; }

	get priorities() { return this._priorities; }

	set isEngaged(status) { this._isEngaged = status; }

	set partner(partner) { this._partner = partner; }

	set priorities(priorities) { this._priorities = priorities; }

	getPriorities() {
		return _.join(this.priorities.map(priority => priority.name), " ");
	}
}

class Man extends Person {
  constructor(name) {
    super(name);
  }

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

	prefersNewOverCurrent(currentSuitor, newSuitor) {
		// Check if women prefers new suitor over current partner
		if (
			_.indexOf(this.priorities, currentSuitor) >
			_.indexOf(this.priorities, newSuitor)
		) {
			return true;
		}
		return false;
	}
}

class GaleShapley {
	constructor() {
		// these are all the participants in the matching algorithm
		this.menNames = [
			new Man("Abe"),
			new Man("Bob"),
			new Man("Col"),
			new Man("Dan"),
			new Man("Ed"),
			new Man("Fred"),
			new Man("Gav"),
			new Man("Hal"),
			new Man("Ian"),
			new Man("Jon")
		];

		this.womenNames = [
			new Woman("Abi"),
			new Woman("Bea"),
			new Woman("Cath"),
			new Woman("Dee"),
			new Woman("Eve"),
			new Woman("Fay"),
			new Woman("Gay"),
			new Woman("Hope"),
			new Woman("Ivy"),
			new Woman("Jan")
		];

		this.queueFreeMen = new Queue();
	}

	setPreferences() {
		for (let man of this.menNames) {
			// Lodar shuffle method uses Fisher-Yates algorithms https://lodash.com/docs/4.17.15#shuffle
			let preferences = _.shuffle(this.womenNames);
			man.priorities = preferences;
			this.queueFreeMen.enqueue(man);
			console.log(man.name, "\t:", man.getPriorities());
		}
		for (let woman of this.womenNames) {
			let preferences = _.shuffle(this.menNames);
			woman.priorities = preferences;
			console.log(woman.name, "\t:", woman.getPriorities());
		}
	}

	galeShapley() {
		while (!this.queueFreeMen.isEmpty()) {
			let suitor = this.queueFreeMen.dequeue();
			for (let woman of suitor.priorities) {
                console.log(`${suitor.name} proposes to ${woman.name}`);
				if (!woman.isEngaged) {
					console.log(`${suitor.name} engaged to ${woman.name}`);
					suitor.engageToPartner(woman);
					break;
				} else if (
					woman.isEngaged &&
					woman.prefersNewOverCurrent(woman.partner, suitor)
				) {
					let currentPartner = woman.partner;
					console.log(`${woman.name} dumped ${currentPartner.name}`);
					currentPartner.isEngaged = false;
					currentPartner.partner = null;
					this.queueFreeMen.enqueue(currentPartner);
					suitor.engageToPartner(woman);
					console.log(`${suitor.name} engaged to ${woman.name}`);
					break;
				} else {
					console.log(`${woman.name} rejected ${suitor.name}`);
				}
			}
		}
	}

	run() {
		// print list of participants
		console.log("Participants:");
		console.log(_.join(this.menNames.map(man => man.name), " "));
		console.log(_.join(this.womenNames.map(woman => woman.name), " "));
		// print randomly generated preferences
		console.log("\nPreferences:");
		this.setPreferences();
        // execute Gale Shapley algorithm
        console.log("\nStatus:");
		this.galeShapley();
        // print stable pairs
        console.log("\nPairing:");
		for (let man of this.menNames) {
			console.log(man.name + " - " + man.partner.name);
		}
	}
}


let gs = new GaleShapley();
gs.run();
console.log("\nStable mathcup");
