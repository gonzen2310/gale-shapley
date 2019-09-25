const _ = require("lodash");
const readline = require('readline');
const Stack = require("./stack");
const { performance } = require('perf_hooks');

const {Man, Woman} = require("./gs");


function main() {
    const arg = process.argv.slice(2);
    if (arg.length === 1)  {

    } else {
        console.log("Invalid Command line argument");
    }

}








class GaleShapley {
    constructor() {
        this.menNames = new Array(Number(arg[0]));
        this.womenNames = new Array(Number(arg[0]));
        for(let i = 0; i < this.menNames.length; i++) {
            this.menNames[i] = new Man(i);
        }
        for(let i = 0; i < this.womenNames.length; i++) {
            this.womenNames[i] = new Woman(i);
        }
        // queue that stores all the free men
        this.queueFreeMen = new Queue();
    }

    setPreferences() {
        for (let man of this.menNames) {
            // Lodash shuffle method uses Fisher-Yates algorithm https://lodash.com/docs/4.17.15#shuffle
            let preferences = _.shuffle(this.womenNames);
            man.priorities = preferences;
            this.queueFreeMen.enqueue(man);
        }
        for (let woman of this.womenNames) {
            let preferences = _.shuffle(this.menNames);
            woman.priorities = preferences;
        }
    }

    galeShapley() {
        // initially all m ∈ Men and w ∈ Women are free
        // while there is a man m who is free and hasn’t proposed keep pairing
        while (!this.queueFreeMen.isEmpty()) {
            // choose a man from the queue
            let suitor = this.queueFreeMen.dequeue();
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
                    this.queueFreeMen.enqueue(currentPartner);
                    suitor.engageToPartner(woman);
                    suitor.currentIndex++;
                }
                // else woman rejects suitor and suitor remains free
                else {
                    this.queueFreeMen.enqueue(suitor);
                    suitor.currentIndex++;
                }
            }
        }
    }
}

    let test = new GaleShapley();
    const t0 = performance.now();
    // console.log("Participants:");
    // console.log(_.join(test.menNames.map(man => man.name), " "));
    // console.log(_.join(test.womenNames.map(woman => woman.name), " "));
    // print randomly generated preferences
    test.setPreferences();
    test.galeShapley();
    const t1 = performance.now();
    console.log(arg[0], "\nElapsed time: " + (t1 - t0) + " milliseconds.");

