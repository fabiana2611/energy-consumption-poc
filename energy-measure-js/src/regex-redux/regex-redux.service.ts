import { Injectable } from '@nestjs/common';

const fs = require('fs');
const path = require("path");

/* The Computer Language Benchmarks Game
   http://benchmarksgame.alioth.debian.org/

   by Josh Goldfoot, adapted from the node.js version
   compile with tsc --lib es7 regexredux.ts
*/
@Injectable()
export class RegexReduxService {

    private q: RegExp[] = [/agggtaaa|tttaccct/ig, /[cgt]gggtaaa|tttaccc[acg]/ig,
        /a[act]ggtaaa|tttacc[agt]t/ig, /ag[act]gtaaa|tttac[agt]ct/ig,
        /agg[act]taaa|ttta[agt]cct/ig, /aggg[acg]aaa|ttt[cgt]ccct/ig,
        /agggt[cgt]aa|tt[acg]accct/ig, /agggta[cgt]a|t[acg]taccct/ig,
        /agggtaa[cgt]|[acg]ttaccct/ig];

    async run() {

        const filePath = path.join(process.cwd(), "/src/regex-redux/data/regexredux-input5000000.txt");
        let i = fs.readFileSync(filePath, "ascii");
        let ilen = i.length;
        i = i.replace(/^>.*\n|\n/mg, "");
        let clen = i.length;

        let iubReplaceLen: Promise<number> = new Promise<number>(resolve => {
            let iub: string[] = ["-", "|", "<2>", "<3>", "<4>"];
            let iubR: RegExp[] = [/\|[^|][^|]*\|/g, /<[^>]*>/g, /a[NSt]|BY/g,
                /aND|caN|Ha[DS]|WaS/g, /tHa[Nt]/g];
            let seq = i + "";
            while (iub.length)
                seq = seq.replace(iubR.pop(), iub.pop())
            resolve(seq.length);
        });



        let promises: Promise<string>[] = this.q.map(r => new Promise<string>(resolve => {
            let m: RegExpMatchArray = i.match(r);
            resolve(r.source + " " + (m ? m.length : 0));
        }));

        await this.displayOutput(promises, ilen, clen, iubReplaceLen);

    }

    private async displayOutput(promises: Promise<string>[], ilen: number,
                                 clen: number, iubReplaceLen: Promise<number>): Promise<void> {
        for (let count = 0; count < 9; count++)
            console.log(await promises[count]);

        console.log();
        console.log(ilen);
        console.log(clen);
        console.log(await iubReplaceLen);
    }
}
