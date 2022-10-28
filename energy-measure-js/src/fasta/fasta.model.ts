export const IM = 139968;
export const IA = 3877;
export const IC = 29573;
export const LINE_LEN = 60;
export const NEW_LINE = 10;
export const ENCODING = 'binary';

export type Freq = { s: string; p: number; c: number; sc: number };

export const AC = [
    { s: 'a', p: 0.27, c: 0, sc: 0 },
    { s: 'c', p: 0.12, c: 0, sc: 0 },
    { s: 'g', p: 0.12, c: 0, sc: 0 },
    { s: 't', p: 0.27, c: 0, sc: 0 },
    { s: 'B', p: 0.02, c: 0, sc: 0 },
    { s: 'D', p: 0.02, c: 0, sc: 0 },
    { s: 'H', p: 0.02, c: 0, sc: 0 },
    { s: 'K', p: 0.02, c: 0, sc: 0 },
    { s: 'M', p: 0.02, c: 0, sc: 0 },
    { s: 'N', p: 0.02, c: 0, sc: 0 },
    { s: 'R', p: 0.02, c: 0, sc: 0 },
    { s: 'S', p: 0.02, c: 0, sc: 0 },
    { s: 'V', p: 0.02, c: 0, sc: 0 },
    { s: 'W', p: 0.02, c: 0, sc: 0 },
    { s: 'Y', p: 0.02, c: 0, sc: 0 }
];

export const HS = [
    { s: 'a', p: 0.3029549426680, c: 0, sc: 0 },
    { s: 'c', p: 0.1979883004921, c: 0, sc: 0 },
    { s: 'g', p: 0.1975473066391, c: 0, sc: 0 },
    { s: 't', p: 0.3015094502008, c: 0, sc: 0 }
];

export class Out {
    out_buffer_size: number;
    limit: number;
    buf: Buffer;
    ct: number;
    constructor() {
        this.out_buffer_size = 256 * 1024;
        this.limit = this.out_buffer_size - 2 * LINE_LEN - 1;
        // this.buf = new Buffer(this.out_buffer_size);
        this.buf = Buffer.alloc(this.out_buffer_size);
        this.ct = 0;
    }
    flush(force: boolean) {
        if (this.ct > this.limit || force) {
            process.stdout.write(this.buf.toString(ENCODING, 0, this.ct));
            this.ct = 0;
        }
    }
}
