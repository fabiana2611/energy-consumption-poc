import { Injectable } from '@nestjs/common';
import {createInterface} from "readline";
import {RefNum} from "./k-nucleotide.model";

const fs = require('fs');
const path = require("path");

/*
 * Ref: https://github.com/greensoftwarelab/Energy-Languages/tree/master/TypeScript/k-nucleotide
 * The Computer Language Benchmarks Game
 * -   http://benchmarksgame.alioth.debian.org/
*/
@Injectable()
export class KNucleotideService {

    async run() {

        const filePath = path.join(process.cwd(), "/src/k-nucleotide/data/knucleotide-input25000000.txt");
        let sequence = "";

        createInterface({input: fs.createReadStream(filePath)})
            .on('line', line => {
                if (line[0] !== '>') {
                    sequence += line.toUpperCase();
                }

            }).on('close', () => {
            this.sort(sequence, 1);
            this.sort(sequence, 2);
            this.find(sequence, 'GGT');
            this.find(sequence, 'GGTA');
            this.find(sequence, 'GGTATT');
            this.find(sequence, 'GGTATTTTAATT');
            this.find(sequence, 'GGTATTTTAATTTATAGT');
        });
    }

    private frequency(sequence: string, length: number): Map<string, RefNum> {
        let freq = new Map<string, RefNum>();
        let n = sequence.length - length + 1;
        let sub = "";
        let m: RefNum;
        for (let i = 0; i < n; i++) {
            sub = sequence.substr(i, length);
            m = freq.get(sub);
            if (m === undefined) {
                freq.set(sub, new RefNum(1));
            } else {
                m.num += 1;
            }
        }
        return freq;
    }

    private sort(sequence: string, length: number): void {
        let freq = this.frequency(sequence, length);
        let keys = new Array<string>();
        for (let k of freq.keys())
            keys.push(k);
        keys.sort((a, b) => (freq.get(b).num - freq.get(a).num));
        let n = sequence.length - length + 1;
        keys.forEach(key => {
            let count = (freq.get(key).num * 100 / n).toFixed(3);
            console.log(key + " " + count);
        });
        console.log("");
    }

    private find(haystack: string, needle: string): void {
        let freq = this.frequency(haystack, needle.length);
        let m = freq.get(needle);
        let num = m ? m.num : 0;
        console.log(num + "\t" + needle);
    }

}
