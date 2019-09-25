const _ = require("lodash");
const readline = require("readline");
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

	setPreferences() {
		for (let man of this.menNames) {
			// Lodash shuffle method uses Fisher-Yates algorithm https://lodash.com/docs/4.17.15#shuffle
			let preferences = _.shuffle(this.womenNames);
			man.priorities = preferences;
			this.stackFreeMen.push(man);
		}
		for (let woman of this.womenNames) {
			let preferences = _.shuffle(this.menNames);
			woman.priorities = preferences;
		}
	}

	galeShapley() {
		this.stackFreeMen.reverseStack();
		// initially all m ∈ Men and w ∈ Women are free
		// while there is a man m who is free and hasn’t proposed keep pairing
		while (!this.stackFreeMen.isEmpty()) {
			// choose a man from the queue
			let suitor = this.stackFreeMen.pop();
			// highest-ranked woman in suitor's preference list to whom suitor has not yet proposed
			let woman = suitor.priorities[suitor.currentIndex];
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
					currentPartner.isEngaged = false;
					currentPartner.partner = null;
					this.stackFreeMen.push(currentPartner);
					suitor.engageToPartner(woman);
					suitor.currentIndex++;
				}
				// else woman rejects suitor and suitor remains free
				else {
					this.stackFreeMen.push(suitor);
					suitor.currentIndex++;
				}
			}
		}
	}
}

function main() {
	const arg = process.argv.slice(2);
	if (arg.length === 1 && !Number.isNaN(arg[0])) {
		let gs = new GaleShapley(Number(arg[0]));
		const t0 = performance.now();
		gs.setPreferences();
		gs.galeShapley();
		const t1 = performance.now();
		console.log(`${arg[0]} ${t1 - t0}`);
	} else {
		console.log("Invalid Command line argument");
	}
}

main();
