class MyBitmap {
    readonly width: number;
    readonly height: number;
    private readonly _data: number[];

    //
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this._data = [];

        for(let i = 0; i < width * height * 4; i++) {
            this._data.push(0)
        }
    };

    getPixel (x: number, y: number) : [number, number, number, number] {
        let indexBitmapImg = 4 * (y * this.width + x);
        return [this._data[indexBitmapImg], this._data[indexBitmapImg + 1], this._data[indexBitmapImg + 2], this._data[indexBitmapImg + 3]];
    };

    setPixel (x: number, y: number, canal: [number, number, number, number]) {
        let indexBitmapImg = 4 * (y * this.width + x);
        this._data[indexBitmapImg] = canal[0];
        this._data[indexBitmapImg + 1] = canal[1];
        this._data[indexBitmapImg + 2] = canal[2];
        this._data[indexBitmapImg + 3] = canal[3];
    };

    asBase64() : string {
        function sample(v: number) {
            return ~~(Math.max(0, Math.min(1, v)) * 255);
        }

        function gamma(v: number) {
            return sample(Math.pow(v, .45455));
        }

        const row = (y : number) => {
            let data = "\0";
            for (let x = 0; x < this.width; x++) {
                let r = this.getPixel(x, y);
                data += String.fromCharCode(gamma(r[0]), gamma(r[1]),
                    gamma(r[2]), sample(r[3]));
            }
            return data;
        }

        const rows = () => {
            let data = "";
            for (let y = 0; y < this.height; y++)
                data += row(y);
            return data;
        }

        const adler = (data: string) => {
            let s1 = 1, s2 = 0;
            for (let i = 0; i < data.length; i++) {
                s1 = (s1 + data.charCodeAt(i)) % 65521;
                s2 = (s2 + s1) % 65521;
            }
            return s2 << 16 | s1;
        }

        const hton = (i: number) => {
            return String.fromCharCode(i>>>24, i>>>16 & 255, i>>>8 & 255, i & 255);
        }

        const deflate = (data: string) => {
            let compressed = "\x78\x01";
            let i = 0;
            do {
                let block = data.slice(i, i + 65535);
                let len = block.length;
                compressed += String.fromCharCode(
                    // @ts-ignore
                    ((i += block.length) === data.length) << 0,
                    len & 255, len>>>8, ~len & 255, (~len>>>8) & 255);
                compressed += block;
            } while (i < data.length);
            return compressed + hton(adler(data));
        }

        const crc32 = (data: string) => {
            let c = ~0;
            for (let i = 0; i < data.length; i++)
                for (let b = data.charCodeAt(i) | 0x100; b !== 1; b >>>= 1)
                    c = (c >>> 1) ^ ((c ^ b) & 1 ? 0xedb88320 : 0);
            return ~c;
        }

        const chunk = (type: string, data: string) => {
            return hton(data.length) + type + data + hton(crc32(type + data));
        }

        const base64 = (data: string) => {
            let enc = "";
            for (let i = 5, n = data.length * 8 + 5; i < n; i += 6)
                enc +=
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
                    (data.charCodeAt(~~(i/8)-1) << 8 | data.charCodeAt(~~(i/8))) >>
                    7 - i%8 & 63];
            for (; enc.length % 4; enc += "=");
            return enc;
        }

        let png = "\x89PNG\r\n\x1a\n" +
            chunk("IHDR", hton(this.width) + hton(this.height) + "\x08\x06\0\0\0") +
            chunk("IDAT", deflate(rows())) +
            chunk("IEND", "");

        return "data:image/png;base64," + base64(png);
    }
}

export {MyBitmap};
