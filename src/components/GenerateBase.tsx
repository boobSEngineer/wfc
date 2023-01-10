import React, {useState} from "react";
import {Bitmap} from "../utilites/library/bitmap";

const GenerateBase = () => {
    let [sizeImg, setSizeImg] = useState<{ width: number, height: number }>({width: 100, height: 100});
    let [urlImg, setUrlImg] = useState<string | ArrayBuffer>('');
    let [bitmapImg, setBitmapImg] = useState<Uint8ClampedArray>();

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');

    let bmp = new Bitmap(sizeImg.width, sizeImg.height);

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
    //console.log(bitmapImg);

    let createImg = () => {
        if (bitmapImg !== undefined) {
            let canal = 0;
            let r = [];
            for (let y = 0; y < sizeImg.height; y++) {
                for (let x = 0; x < sizeImg.width; x++) {
                    for (let c = 0; c < 4; c ++) {
                        let indexBitmapImg = 4 * (y * sizeImg.width + x) + c;
                        r.push(bitmapImg[indexBitmapImg]/255);
                    }
                    bmp.pixel[x][y] = r;
                    r = [];
                }
            }
            console.log(bmp)

        }



    }


    createImg()

    return (
        <>

            <input type="file" onChange={(e) => {
                let fileList = e.target.files;
                if (fileList != null && fileList[0] != null) {
                    //encodeImgFileAsUrl(fileList[0]);
                    imgToCanvasAsBitmap(fileList[0]);
                }
            }}/>
            <img src={`${bmp.dataURL()}`}/>
            {/*<div style={{margin: "20px 10px"}}>*/}
            {/*    {urlImg && <img src={`${urlImg}`} width="400px" height="400px"/>}*/}
            {/*</div>*/}
        </>
    )
}

export {GenerateBase};
