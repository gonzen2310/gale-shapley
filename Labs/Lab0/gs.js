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

	engageToPartner(partner) {
		this.isEngaged = true;
		partner.isEngaged = true;
		this.partner = partner;
		partner.partner = this;
	}

	get name() {
		return this._name;
	}

	get priorities() {
		return this._priorities;
	}

	get isEngaged() {
		return this._isEngaged;
	}

	get partner() {
		return this._partner;
	}

	set isEngaged(status) {
		this._isEngaged = status;
	}

	set partner(partner) {
		this._partner = partner;
	}

	set priorities(priorities) {
		this._priorities = priorities;
	}

	getPriorities() {
		return _.join(this.priorities.map(priority => priority.name), " ");
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
			new Person("Abe"),
			new Person("Bob"),
			new Person("Col"),
			new Person("Dan"),
			new Person("Ed"),
			new Person("Fred"),
			new Person("Gav"),
			new Person("Hal"),
			new Person("Ian"),
			new Person("Jon")
		];

		this.womenNames = [
			new Person("Abi"),
			new Person("Bea"),
			new Person("Cath"),
			new Person("Dee"),
			new Person("Eve"),
			new Person("Fay"),
			new Person("Gay"),
			new Person("Hope"),
			new Person("Ivy"),
			new Person("Jan")
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
					this.queueFreeMen.enqueue(suitor);
					break;
				}
			}
			/*
			Choose such a man m
			w = 1st woman on m's list to whom m has not yet proposed
			if (w is free)
				assign m and w to be engaged
			else if (w prefers m to her fiancé m')
				assign m and w to be engaged, and m' to be free
			else
				w rejects m
			*/
		}
	}

	run() {
		// print list of participants
		console.log("Participants:");

		console.log(_.join(this.menNames.map(man => man.name), " "));
		console.log(_.join(this.womenNames.map(woman => woman.name), " "));
		console.log();
		// print randomly generated preferences
		console.log("Preferences:");
		this.setPreferences();
		this.galeShapley();

		for (let man of this.menNames) {
			console.log(man.name + " - " + man.partner.name);
		}
	}
}

let gs = new GaleShapley();
gs.run();
