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
 	1. Install node and npm on your computer (https://nodejs.org/en/download/)
    2. Install yarn (https://yarnpkg.com/lang/en/docs/install/#debian-stable)
 	3. Navigate to ~/CSC321/Labs/Lab0/
	4. Type and run > yarn install
	5. Run > node gs.js (If you need help running this program please email me at: greye003@plattsburgh.edu)
*/

// Import modules
const _ = require("lodash");
const readline = require("readline");
const Stack = require("./stack");
const { performance } = require("perf_hooks");
const Participant = require("./participants");

class GaleShapley {
	constructor() {
		// these are all the participants in the matching algorithm
		this.menNames = [
			new Participant.Man("Abe"),
			new Participant.Man("Bob"),
			new Participant.Man("Col"),
			new Participant.Man("Dan"),
			new Participant.Man("Ed"),
			new Participant.Man("Fred"),
			new Participant.Man("Gav"),
			new Participant.Man("Hal"),
			new Participant.Man("Ian"),
			new Participant.Man("Jon")
		];

		this.womenNames = [
			new Participant.Woman("Abi"),
			new Participant.Woman("Bea"),
			new Participant.Woman("Cath"),
			new Participant.Woman("Dee"),
			new Participant.Woman("Eve"),
			new Participant.Woman("Fay"),
			new Participant.Woman("Gay"),
			new Participant.Woman("Hope"),
			new Participant.Woman("Ivy"),
			new Participant.Woman("Jan")
		];
		// queue that stores all the free men
		this.stackFreeMen = new Stack();
	}

	/**
		@summary randomly sets the preferences for men and women using the Fisher-Yates shuffling algorithm
	 */
	setPreferences() {
		for (let man of this.menNames) {
			// Lodash shuffle method uses Fisher-Yates algorithm https://lodash.com/docs/4.17.15#shuffle
			let preferences = _.shuffle(this.womenNames);
			man.priorities = preferences;
			this.stackFreeMen.push(man);
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
		this.stackFreeMen.reverseStack();
		// initially all m ∈ Men and w ∈ Women are free
		// while there is a man m who is free and hasn’t proposed keep pairing
		while (!this.stackFreeMen.isEmpty()) {
			// choose a man from the queue
			let suitor = this.stackFreeMen.pop();
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
					this.stackFreeMen.push(currentPartner);
					suitor.engageToPartner(woman);
					suitor.currentIndex++;
					console.log(`${suitor.name} engaged to ${woman.name}`);
				}
				// else woman rejects suitor and suitor remains free
				else {
					this.stackFreeMen.push(suitor);
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

	input.setPrompt("Another trial? (y)es, (n)o ");

	input.prompt();
	// Keep rerunning program until user enter "no" or "n"
	input
		.on("line", line => {
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
		})
		.on("close", () => {
			process.exit(0);
		});
}

main();
