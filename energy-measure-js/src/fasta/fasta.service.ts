import { Injectable } from '@nestjs/common';
import {AC, ENCODING, Freq, HS, IA, IC, IM, LINE_LEN, NEW_LINE, Out} from "./fasta.model";

/*
 * Ref: https://github.com/greensoftwarelab/Energy-Languages/tree/master/TypeScript/fasta
 * The Computer Language Benchmarks Game: http://benchmarksgame.alioth.debian.org/
 */

@Injectable()
export class FastaService {

    private last: number;
    private out:Out;

    constructor() {
        this.last = 42;
        this.out = new Out();
    }

    private alu = 'GGCCGGGCGCGGTGGCTCACGCCTGTAATCCCAGCACTTTG'
        + 'GGAGGCCGAGGCGGGCGGATCACCTGAGGTCAGGAGTTCGA'
        + 'GACCAGCCTGGCCAACATGGTGAAACCCCGTCTCTACTAAA'
        + 'AATACAAAAATTAGCCGGGCGTGGTGGCGCGCGCCTGTAAT'
        + 'CCCAGCTACTCGGGAGGCTGAGGCAGGAGAATCGCTTGAAC'
        + 'CCGGGAGGCGGAGGTTGCAGTGAGCCGAGATCGCGCCACTG'
        + 'CACTCCAGCCTGGGCGACAGAGCGAGACTCCGTCTCAAAAA';

    run(value: number): void {
        let n = value ? value : 512; //process.argv[2] ? parseInt(process.argv[2]) : 512;

        this.make_cumulative(AC);
        this.make_cumulative(HS);

        this.repeat(this.alu, '>ONE Homo sapiens alu', n * 2);
        this.randomize(AC, '>TWO IUB ambiguity codes', n * 3);
        this.randomize(HS, '>THREE Homo sapiens frequency', n * 5);
        this.out.flush(true);
    }

    private random(): number {
        this.last = (this.last * IA + IC) % IM;
        return this.last / IM;
    }

    private repeat(alu: string, title: string, n : number): void {
        let len = alu.length, pos = 0;
        // var buffer = new Buffer(alu + alu.substr(0, LINE_LEN), "ascii");
        let buffer = Buffer.from(alu + alu.substr(0, LINE_LEN), "ascii")
        this.out.buf.write(title, this.out.ct, title.length, ENCODING);
        this.out.ct += title.length;
        this.out.buf[this.out.ct++] = NEW_LINE;
        while (n) {
            let bytes = n > LINE_LEN ? LINE_LEN : n;
            this.out.flush(false);
            for (let i = 0; i < bytes; ++i) {
                this.out.buf[this.out.ct++] = buffer[pos + i];
            }
            this.out.buf[this.out.ct++] = NEW_LINE;
            pos += bytes;
            if (pos > len) {
                pos -= len;
            }
            n -= bytes;
        }
    }

    private make_cumulative(ac: Freq[]): void {
        var p = 0;
        for (var i = 0; i < ac.length; ++i) {
            p += ac[i].p;
            ac[i].c = p;
            ac[i].sc = ac[i].s.charCodeAt(0);
        }
    }

    private randomize(ac: Freq[], title: string, n: number): void {
        let len = this.alu.length, pos = 0;
        this.out.buf.write(title, this.out.ct, title.length, ENCODING);
        this.out.ct += title.length;
        this.out.buf[this.out.ct++] = NEW_LINE;
        while (n) {
            let bytes = n > LINE_LEN ? LINE_LEN : n;
            this.out.flush(false);
            for (let i = 0; i < bytes; ++i) {
                let r = this.random();
                let j;
                for (j = 0; j < ac.length; ++j) {
                    if (r < ac[j].c) {
                        this.out.buf[this.out.ct++] = ac[j].sc;
                        break;
                    }
                }
                if (j === ac.length) {
                    this.out.buf[this.out.ct++] = ac[ac.length - 1].sc;
                }
            }
            this.out.buf[this.out.ct++] = NEW_LINE;
            pos += bytes;
            if (pos > len) pos -= len;
            n -= bytes;
        }
    }
}
