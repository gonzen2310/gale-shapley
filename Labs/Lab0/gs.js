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
	4. Type and run > yarn install
	5. Run > node gs.js (If you need help running this program please email me at: greye003@plattsburgh.edu)
*/

// Import modules
const _ = require("lodash");
const readline = require('readline');
const Queue = require("./queue");
const { performance } = require('perf_hooks');

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
		return _.join(this.priorities.map(priority => priority.name), " ");
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
		// queue that stores all the free men
		this.queueFreeMen = new Queue();
	}

	/**
		@summary randomly sets the preferences for men and women using the Fisher-Yates shuffling algorithm
	 */
	setPreferences() {
		for (let man of this.menNames) {
			// Lodash shuffle method uses Fisher-Yates algorithm https://lodash.com/docs/4.17.15#shuffle
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

	/**
	 	* @param none
		* actual implementation of the gale-shapley algorithm
		*/
	galeShapley() {
		// initially all m ∈ Men and w ∈ Women are free
		// while there is a man m who is free and hasn’t proposed keep pairing
		while (!this.queueFreeMen.isEmpty()) {
			// choose a man from the queue
			let suitor = this.queueFreeMen.dequeue();
			// highest-ranked woman in suitor's preference list to whom suitor has not yet proposed
			let woman = suitor.priorities[suitor.currentIndex];
			console.log(`${suitor.name} proposes to ${woman.name}`);
			// if woman is free then (suitor, woman) become engaged
			if (!woman.isEngaged) {
				suitor.engageToPartner(woman);
				suitor.currentIndex++;
				console.log(`${suitor.name} engaged to ${woman.name}`);
			}
			// else woman is currently engaged to another man
			else {
				// if woman prefers new suitor over current partner
				// (suitor, woman) become engaged and former partner becomes free
				if (woman.prefersNewOverCurrent(woman.partner, suitor)) {
					let currentPartner = woman.partner;
					console.log(`${woman.name} dumped ${currentPartner.name}`);
					currentPartner.isEngaged = false;
					currentPartner.partner = null;
					this.queueFreeMen.enqueue(currentPartner);
					suitor.engageToPartner(woman);
					suitor.currentIndex++;
					console.log(`${suitor.name} engaged to ${woman.name}`);
				}
				// else woman rejects suitor and suitor remains free
				else {
					this.queueFreeMen.enqueue(suitor);
					suitor.currentIndex++;
					console.log(`${woman.name} rejected ${suitor.name}`);
				}
			}
		}
	}

	 /**
	 	* @param none
		* Runs an instance of the Gale-shapley algorithm
		*/
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
		for (let man of this.menNames)
			console.log(man.name + " - " + man.partner.name);
	}
}

// main function
function main() {
	// accept user input
	const input = readline.createInterface(process.stdin, process.stdout);
	// create a new instance of the GaleShapley class
	let gs = new GaleShapley();
	const t0 = performance.now();
	gs.run();
	const t1 = performance.now();
	console.log("\nElapsed time: " + (t1 - t0) + " milliseconds.");
	console.log("Stable matchup\n");

	input.setPrompt('Another trial? (y)es, (n)o ');

	input.prompt();
	// Keep rerunning program until user enter "no" or "n"
	input.on('line', (line) =>  {
			if (line === "no" || line === "n") {
					console.log("Thank you for playing, Goodbye!");
					input.close();
			}
			// create a new instance of the GaleShapley class
			let gs = new GaleShapley();
			const t0 = performance.now();
			gs.run();
			const t1 = performance.now();
			console.log("\nElapsed time: " + (t1 - t0) + " milliseconds.");
			console.log("Stable matchup\n");
			input.prompt();
	}).on('close', () => {
			process.exit(0);
	});
}

main();