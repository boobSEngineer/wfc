import React, {useState} from "react";
import {MyBitmap} from "./MyBitmap";

const GenerateBase = () => {
    let [sizeImg, setSizeImg] = useState<{ width: number, height: number }>({width: 100, height: 100});
    let [bitmapImg, setBitmapImg] = useState<Uint8ClampedArray>();

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');

    const bmp = new MyBitmap(sizeImg.width, sizeImg.height);
    const bmp_fixed = new MyBitmap(5, 5);
    //const bmp_many = new MyBitmap(sizeImg.width * 100, 10);


    let miniSquaresArray: {data: MyBitmap}[] = [];

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

            //console.log(bmp)

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

            let size_square = 5;
            let square_width = bmp.width - bmp_fixed.width + 1;
            let square_height = bmp.height - bmp_fixed.height + 1;
            let counter = 0;

            for (let h = 0; h < square_height; h++) {
                for (let w = 0; w < square_width; w++) {

                    let mini_bitmaps = new MyBitmap(bmp_fixed.width, bmp_fixed.height);
                    for (let i = 0; i < bmp_fixed.height; i++) {
                        for (let j = 0; j < bmp_fixed.width; j++) {
                            let array_color = bmp.getPixel(w + j, h + i);
                            //bmp_many.setPixel(j + counter, i, array_color);
                            mini_bitmaps.setPixel(j,i,array_color);
                        }
                    }
                    miniSquaresArray.push({
                        data: mini_bitmaps,
                    })
                    counter = counter + size_square + 1;
                    //f = [];
                }
            }

            // // bmp org -> bmp max
            // for (let j = 0; j < bmp_max.height; j++) {
            //     for (let i = 0; i < bmp_max.width; i++) {
            //         bmp_max.pixel[i][j] = bmp.pixel[Math.floor(i / 2)][Math.floor(j / 2)];
            //     }
            // }
        }
    }


    createImg()

    return (
        <div style={{backgroundColor: 'black', width: '100vw', height: '100vh'}}>

            <input type="file" onChange={(e) => {
                let fileList = e.target.files;
                if (fileList != null && fileList[0] != null) {
                    //encodeImgFileAsUrl(fileList[0]);
                    imgToCanvasAsBitmap(fileList[0]);
                }
            }}/>
            {/*<div>*/}
            {/*    <img src={`${bmp_mini.dataURL()}`}/>*/}
            {/*</div>*/}
            <div>
                <div>
                    <img alt='org img' src={`${bmp.asBase64()}`} style={{imageRendering: 'pixelated'}}/>
                </div>

                {miniSquaresArray.map(c => {
                    return <img alt='mini squares bitmap' src={`${c.data.asBase64()}`} style={{imageRendering: 'pixelated'}}/>
                })}

                {/*<img src={`${bmp_many.asBase64()}`} style={{imageRendering: 'pixelated'}}/>*/}
            </div>
        </div>
    )
}

export {GenerateBase};
