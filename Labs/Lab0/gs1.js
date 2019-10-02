/**
Program Name: gs1.py
Created by: Gonzalo Eladio Reyes
Date: 9/15/2019
PURPOSE: Implement the Gale-Shapley algorithm for N suitors
INPUT(S): Number of suitor / -v for debugging purposes
OUTPUT(S):
 	1. Execution Time
 Run Program:
 	1. Install node and npm on your computer (https://nodejs.org/en/download/)
    2. Install yarn (https://yarnpkg.com/lang/en/docs/install/#debian-stable)
 	3. Navigate to ~/CSC321/Labs/Lab0/
	4. Type and run > yarn install
	5. Run > node gs1.js [1000] [-v]
	(If you need help running this program please email me at: greye003@plattsburgh.edu)
*/

const _ = require("lodash");
const Stack = require("./stack");
const { performance } = require("perf_hooks");
const Participant = require("./participants");

class GaleShapley {
	constructor(participants) {
		this.menNames = new Array(participants);
		this.womenNames = new Array(participants);
		for (let i = 0; i < this.menNames.length; i++) {
			this.menNames[i] = new Participant.Man(i);
		}
		for (let i = 0; i < this.womenNames.length; i++) {
			this.womenNames[i] = new Participant.Woman(i);
		}
		// queue that stores all the free men
		this.stackFreeMen = new Stack();
	}

	setPreferences(verbose = false) {
		for (let man of this.menNames) {
			// Lodash shuffle method uses Fisher-Yates algorithm
			// https://lodash.com/docs/4.17.15#shuffle
			let preferences = _.shuffle(this.womenNames);
			man.priorities = preferences;
			this.stackFreeMen.push(man);
			if (verbose) console.log(`${man.name} :`, man.getPriorities());
		}
		for (let woman of this.womenNames) {
			let preferences = _.shuffle(this.menNames);
			woman.priorities = preferences;
			if (verbose) console.log(`${woman.name} :`, woman.getPriorities());
		}
	}

	galeShapley(verbose = false) {
		this.stackFreeMen.reverseStack();
		// initially all m ∈ Men and w ∈ Women are free
		// while there is a man m who is free and hasn’t proposed keep pairing
		while (!this.stackFreeMen.isEmpty()) {
			// choose a man from the queue
			let suitor = this.stackFreeMen.pop();
			// highest-ranked woman in suitor's preference list to whom suitor
			// has not yet proposed
			let woman = suitor.priorities[suitor.currentIndex];
			if (verbose) console.log(`${suitor.name} proposes to ${woman.name}`);

			// if woman is free then (suitor, woman) become engaged
			if (!woman.isEngaged) {
				suitor.engageToPartner(woman);
				suitor.currentIndex++;
			}
			// else woman is currently engaged to another man
			else {
				// if woman prefers new suitor over current partner
				// (suitor, woman) become engaged and former partner becomes free
				if (woman.prefersNewOverCurrent(woman.partner, suitor)) {
					let currentPartner = woman.partner;
					if (verbose)
						console.log(`${woman.name} dumped ${currentPartner.name}`);
					currentPartner.isEngaged = false;
					currentPartner.partner = null;
					this.stackFreeMen.push(currentPartner);
					suitor.engageToPartner(woman);
					suitor.currentIndex++;
					if (verbose) console.log(`${suitor.name} engaged to ${woman.name}`);
				}
				// else woman rejects suitor and suitor remains free
				else {
					this.stackFreeMen.push(suitor);
					suitor.currentIndex++;
					if (verbose) console.log(`${woman.name} rejected ${suitor.name}`);
				}
			}
		}
	}

	runVerbose() {
		// print list of participants
		console.log("Participants:");
		console.log(_.join(this.menNames.map(man => man.name), " "));
		console.log(_.join(this.womenNames.map(woman => woman.name), " "));
		// print randomly generated preferences
		console.log("\nPreferences:");
		this.setPreferences(true);
		// execute Gale Shapley algorithm
		console.log("\nStatus:");
		this.galeShapley(true);
		// print stable pairs
		console.log("\nPairing:");
		for (let man of this.menNames)
			console.log(man.name + " - " + man.partner.name);
	}
}

function main() {
	// Accept command line arguments
	const arg = process.argv.slice(2);
	if (arg.length === 1 && !Number.isNaN(arg[0])) {
		let gs = new GaleShapley(Number(arg[0]));
		const t0 = performance.now();
		gs.setPreferences();
		gs.galeShapley();
		const t1 = performance.now();
		console.log(`${arg[0]} ${((t1 - t0) / 1000).toFixed(5)}`);
	} else if (arg.length === 2 && !Number.isNaN(arg[0]) && arg[1] == "-v") {
		let gs = new GaleShapley(Number(arg[0]));
		gs.runVerbose();
	} else {
		console.log("Invalid Command line argument");
	}
}

main();
