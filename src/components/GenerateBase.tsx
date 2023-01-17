import React, {useState} from "react";
import {MyBitmap} from "./MyBitmap";
import {Simulate} from "react-dom/test-utils";
import wheel = Simulate.wheel;


let minArray = (a:  {[k : string] : boolean}, b: number[][]): number => {
    let k = -1;
    let s = 0;
    for (let i in a) {
        if (k === -1) {
            k = parseInt(i);
        }
        if (b[k].length > b[parseInt(i)].length) {
            k = parseInt(i);
        }
        s++;
    }
    return k
}

let intersectArray = (array1 : number[], array2: number[]): number[] => {
    let g = [];
    let j = 0;
    let i = 0;
    while (i < array1.length && j < array2.length) {
        if (array1[i] > array2[j]) {
            j++;
        }
        if (array1[i] < array2[j]) {
            i++;
        }
        if (array1[i] - array2 [j] === 0) {
            g.push(array1[i]);
            i++;
            j++;
        }
    }

    return g;
}

function getRandomId(length: number) {
    return Math.floor(Math.random() * length);
}

const GenerateBase = () => {

    let size_square = 5;

    let [sizeImg, setSizeImg] = useState<{ width: number, height: number }>({width: 100, height: 100});
    let [bitmapImg, setBitmapImg] = useState<Uint8ClampedArray>();

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');

    const bmp_generate = new MyBitmap(30, 30);
    const bmp = new MyBitmap(sizeImg.width, sizeImg.height);
    const bmp_fixed = new MyBitmap(size_square, size_square);
    //const bmp_many = new MyBitmap(sizeImg.width * 100, 10);


    let miniSquaresArray: { data: MyBitmap, id: number, samePixel: number[][] }[] = [];
    let preGenerateArray: number[][] = []

    //let bmp = new Bitmap(sizeImg.width, sizeImg.height);
    // let bmp_mini = new Bitmap(sizeImg.width / 2, sizeImg.height / 2);
    // let bmp_max = new Bitmap(sizeImg.width * 2, sizeImg.height * 2);
    // let bmp_fixed = new Bitmap(5, 5);
    // let bmp_many = new Bitmap(sizeImg.width * 100, sizeImg.height * 5);

    // let encodeImgFileAsUrl = (element: File) => {
    //     let reader = new FileReader();
    //     reader.onloadend = () => {
    //         if (reader.result !== null) {
    //             setUrlImg(reader.result)
    //         }
    //     }
    //     reader.readAsDataURL(element);
    // }

    let imgToCanvasAsBitmap = (element: File) => {

        createImageBitmap(element).then(bitmap => {
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            setSizeImg({width: bitmap.width, height: bitmap.height});
            if (ctx !== null) {
                ctx.drawImage(bitmap, 0, 0);
                let data = ctx.getImageData(0, 0, bitmap.width, bitmap.height).data;
                setBitmapImg(data);
            }
            return bitmap
        });

    }

    let createImg = () => {
        if (bitmapImg !== undefined) {
            let array_color: [number, number, number, number] = [0, 0, 0, 0];
            for (let y = 0; y < bmp.height; y++) {
                for (let x = 0; x < bmp.width; x++) {
                    let indexBitmapImg = 4 * (y * bmp.width + x);
                    array_color[0] = bitmapImg[indexBitmapImg] / 255
                    array_color[1] = bitmapImg[indexBitmapImg + 1] / 255
                    array_color[2] = bitmapImg[indexBitmapImg + 2] / 255
                    array_color[3] = bitmapImg[indexBitmapImg + 3] / 255
                    bmp.setPixel(x, y, array_color);
                }
            }

            // negative this img
            // for (let j = 0; j < bmp.height; j++) {
            //     for (let i = 0; i < bmp.width; i++) {
            //         for (let c = 0; c < 3; c++) {
            //             bmp.pixel[i][j][c] = 1 - bmp.pixel[i][j][c]
            //         }
            //     }
            // }
            // // bmp org -> bmp mini
            // for (let j = 0; j < bmp_mini.height; j++) {
            //     for (let i = 0; i < bmp_mini.width; i++) {
            //         bmp_mini.pixel[i][j] = bmp.pixel[i * 2][j * 2];
            //     }
            // }

            //org bmp -> many mini bmp
            let squares_width = bmp.width - bmp_fixed.width + 1;
            let squares_height = bmp.height - bmp_fixed.height + 1;
            let counter = 0;
            let sizeMatrixSamePixel = ((bmp_fixed.width - 1) + bmp_fixed.width) * ((bmp_fixed.height - 1) + bmp_fixed.height);
            for (let h = 0; h < squares_height; h++) {
                for (let w = 0; w < squares_width; w++) {

                    let mini_bitmaps = new MyBitmap(bmp_fixed.width, bmp_fixed.height);
                    for (let i = 0; i < bmp_fixed.height; i++) {
                        for (let j = 0; j < bmp_fixed.width; j++) {
                            let array_color = bmp.getPixel(w + j, h + i);
                            //bmp_many.setPixel(j + counter, i, array_color);
                            mini_bitmaps.setPixel(j, i, array_color);
                        }
                    }
                    let samePixel: number[][] = [];
                    for (let k = 0; k < sizeMatrixSamePixel; k++) {
                        samePixel.push([]);
                    }
                    miniSquaresArray.push({
                        id: miniSquaresArray.length,
                        data: mini_bitmaps,
                        samePixel: samePixel

                    });
                    counter = counter + size_square + 1;
                }
            }

            //console.log(miniSquaresArray)

            // // bmp org -> bmp max
            // for (let j = 0; j < bmp_max.height; j++) {
            //     for (let i = 0; i < bmp_max.width; i++) {
            //         bmp_max.pixel[i][j] = bmp.pixel[Math.floor(i / 2)][Math.floor(j / 2)];
            //     }
            // }
        }

    }


    const findSameCouplePixel = () => {
        let current_pixel: [number, number, number, number] = [0, 0, 0, 0];
        let current_track_pixel: [number, number, number, number] = [0, 0, 0, 0];
        let comparing_pixel: [number, number, number, number] = [0, 0, 0, 0];
        let comparing_track_pixel: [number, number, number, number] = [0, 0, 0, 0];
        let same_pixel = false;

        miniSquaresArray.forEach(current => {  // current square (move 2)
            miniSquaresArray.forEach(comparing => { // comparing square (stop 1)

                current_pixel = current.data.getPixel(0, 0);

                for (let y = -comparing.data.height + 1; y < comparing.data.height; y++) {
                    for (let x = -comparing.data.width + 1; x < comparing.data.width; x++) {
                        comparing_pixel = comparing.data.getPixel(x, y);
                        same_pixel = true;
                        for (let j = 0; j < current.data.height; j++) {
                            for (let i = 0; i < current.data.width; i++) {
                                current_track_pixel = current.data.getPixel(i, j);

                                if (!comparing.data.inBounds(i + x, j + y)) {
                                    continue
                                }

                                comparing_track_pixel = comparing.data.getPixel(i + x, j + y);

                                if (current_track_pixel[0] !== comparing_track_pixel[0] || current_track_pixel[1] !== comparing_track_pixel[1] || current_track_pixel[2] !== comparing_track_pixel[2]) {
                                    same_pixel = false;
                                    break
                                }
                            }
                        }

                        if (same_pixel) {
                            let indexSamePixel = ((y + comparing.data.height - 1) * (comparing.data.width * 2 - 1)) + (x + comparing.data.width - 1);
                            comparing.samePixel[indexSamePixel].push(current.id);

                        }
                        same_pixel = false;
                    }
                }

            })
        })
    }

    const preGenerateImage = () => {
        if (miniSquaresArray.length > 0) {
            for (let i = 0; i < bmp_generate.width * bmp_generate.height; i++) {
                preGenerateArray[i] = [];
                miniSquaresArray.forEach(c => {
                    preGenerateArray[i].push(c.id)
                })
            }
            let candidates: {[k : string] : boolean} = {};
            let reserved: {[k : string] : boolean} = {};
            let first_random_x = getRandomId(bmp_generate.width);
            let first_random_y = getRandomId(bmp_generate.height);

            candidates[`${first_random_y * bmp_generate.width + first_random_x}`] = true;

            while (true) {
                let next_index = minArray(candidates, preGenerateArray);
                if (next_index === -1) break;
                let random_x = next_index % bmp_generate.width;
                let random_y = Math.floor(next_index / bmp_generate.width);
                console.log({random_x, random_y})

                reserved[`${next_index}`] = true;
                delete candidates[`${next_index}`];


                let square_ids = preGenerateArray[random_y * bmp_generate.width + random_x];
                if (square_ids.length !== 0) {
                    let random_square_id = square_ids[getRandomId(square_ids.length)];
                    let square = miniSquaresArray[random_square_id];

                    preGenerateArray[random_y * bmp_generate.width + random_x] = [random_square_id];
                    for (let y = -bmp_fixed.height + 1; y < bmp_fixed.height; y++) {
                        for (let x = -bmp_fixed.width + 1; x < bmp_fixed.width; x++) {
                            if (random_x + x < 0 || random_x + x >= bmp_generate.width || random_y + y < 0 || random_y + y >= bmp_generate.height) continue;
                            let indexPG = (y + random_y) * bmp_generate.width + (x + random_x);
                            let indexSP = ((y + bmp_fixed.height - 1) * (bmp_fixed.width * 2 - 1)) + (x + bmp_fixed.width - 1);
                            if (!reserved[`${indexPG}`]) {
                                let intersect_array = intersectArray(square.samePixel[indexSP], preGenerateArray[indexPG]);
                                preGenerateArray[indexPG] = intersect_array;
                                candidates[`${indexPG}`] = true;
                            }
                        }
                    }
                }

            }
        }
        //console.log(preGenerateArray);
    }

    const generateImage = () => {
        if (preGenerateArray.length > 0) {
            for (let h = 0; h < bmp_generate.height; h++) {
                for (let w = 0; w < bmp_generate.width; w++) {
                    bmp_generate.setPixel(w, h, [0, 0, 0, 1]);
                }
            }
            for (let h = 0; h < bmp_generate.height; h++) {
                for (let w = 0; w < bmp_generate.width; w++) {
                    let indexG = h * bmp_generate.width + w;

                    if (preGenerateArray[indexG].length == 0) continue;

                    let square = miniSquaresArray[preGenerateArray[indexG][0]];

                    for (let y = 0; y < square.data.height; y++) {
                        for (let x = 0; x < square.data.width; x++) {
                            let color_array = square.data.getPixel(x, y);
                            if (!bmp_generate.inBounds(w + x, h + y)) continue;
                            bmp_generate.setPixel(w + x, h + y, color_array);

                        }
                    }

                }
            }
        }

    }


    createImg();
    findSameCouplePixel();
    preGenerateImage();
    generateImage();

    return (
        <div style={{backgroundColor: 'black', width: '100vw', height: '100vh'}}>

            <input type="file" onChange={(e) => {
                let fileList = e.target.files;
                if (fileList != null && fileList[0] != null) {
                    //encodeImgFileAsUrl(fileList[0]);
                    imgToCanvasAsBitmap(fileList[0]);
                }
            }}/>
            <div>
                <div>
                    <img alt='org img' src={`${bmp.asBase64()}`} style={{imageRendering: 'pixelated'}}/>
                </div>

                {miniSquaresArray.map(c => {
                    return <img alt='mini squares bitmap' key={c.id} src={`${c.data.asBase64()}`}
                                style={{imageRendering: 'pixelated',  border: '1px solid black'}}/>
                })}
                <div>
                    <img alt='org img' src={`${bmp_generate.asBase64()}`}
                         style={{imageRendering: 'pixelated', border: '1px solid gray'}}/>
                </div>
            </div>
        </div>
    )
}

export {GenerateBase};
