import React, {useState} from "react";
import {Bitmap} from "../utilites/library/bitmap";

const GenerateBase = () => {
    let [sizeImg, setSizeImg] = useState<{ width: number, height: number }>({width: 100, height: 100});
    let [urlImg, setUrlImg] = useState<string | ArrayBuffer>('');
    let [bitmapImg, setBitmapImg] = useState<Uint8ClampedArray>();

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');

    let bmp = new Bitmap(sizeImg.width, sizeImg.height);
    let bmp_mini = new Bitmap(sizeImg.width / 2, sizeImg.height / 2);
    let bmp_max = new Bitmap(sizeImg.width * 2, sizeImg.height * 2);

    let bmp_fixed = new Bitmap(5, 5);
    let bmp_many = new Bitmap(sizeImg.width * 100, sizeImg.height * 5);

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
            let array_color = [];
            for (let y = 0; y < bmp.height; y++) {
                for (let x = 0; x < bmp.width; x++) {
                    for (let c = 0; c < 4; c++) {
                        let indexBitmapImg = 4 * (y * sizeImg.width + x) + c;
                        array_color.push(bitmapImg[indexBitmapImg] / 255);
                    }
                    bmp.pixel[x][y] = array_color;
                    array_color = [];
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

            // org bmp -> many mini bmp
            let miniSquaresArray: {}[] = [];
            let f: number[][][] = [];
            let size_square = 5;
            let square_width = bmp.width - bmp_fixed.width + 1;
            let square_height = bmp.height - bmp_fixed.height + 1;
            let counter = 0;
            for (let h = 0; h < square_height; h++) {
                for (let w = 0; w < square_width; w++) {

                    for (let i = 0; i < bmp_fixed.height; i++) {
                        f[i]=[];
                        for (let j = 0; j < bmp_fixed.width; j++) {
                            bmp_many.pixel[i + counter][j] = bmp.pixel[w + i][h + j];

                            f[i][j] = bmp.pixel[w + i][h + j];

                        }
                    }
                    miniSquaresArray.push({
                        data: [...f],
                    })
                    counter = counter + size_square + 1;
                    f = [];
                }
            }
            console.log(miniSquaresArray)

            // // bmp org -> bmp max
            // for (let j = 0; j < bmp_max.height; j++) {
            //     for (let i = 0; i < bmp_max.width; i++) {
            //         bmp_max.pixel[i][j] = bmp.pixel[Math.floor(i / 2)][Math.floor(j / 2)];
            //     }
            // }

            //console.log(bmp_mini)
            // console.log(bmp)
            // console.log(bmp_fixed)
        }
    }


    createImg()

    return (
        <div style={{backgroundColor: 'black'}}>

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
                <img src={`${bmp.dataURL()}`} style={{imageRendering: 'pixelated'}}/>
            </div>
            <div>
                <img src={`${bmp_many.dataURL()}`} style={{imageRendering: 'pixelated'}}/>
            </div>
            {/*<div>*/}
            {/*    <img src={`${bmp_max.dataURL()}`}/>*/}
            {/*</div>*/}
            {/*<div style={{margin: "20px 10px"}}>*/}
            {/*    {urlImg && <img src={`${urlImg}`} width="400px" height="400px"/>}*/}
            {/*</div>*/}
        </div>
    )
}

export {GenerateBase};
