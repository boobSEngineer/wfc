import React, {useState} from "react";
import {Bitmap} from "../utilites/library/bitmap";

const GenerateBase = () => {
   // let [sizeImg, setSizeImg] = useState<{ width: number, height: number }>({width: 100, height: 100});
    let [urlImg, setUrlImg] = useState<string | ArrayBuffer>('');

    //let bmp = new Bitmap(sizeImg.width, sizeImg.height);

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');

    let encodeImgFileAsUrl = (element: File) => {
        let reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result !== null) {
                setUrlImg(reader.result)
            }
        }
        reader.readAsDataURL(element);
    }

    let imgToCanvasAsBitmap = (element: File) => {
        createImageBitmap(element).then(bitmap => {
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            if (ctx !== null) {
                ctx.drawImage(bitmap, 0, 0);
                console.log(ctx.getImageData(0, 0, bitmap.width, bitmap.height));
            }
            return bitmap
        });
    }

    console.log(urlImg)

    // let createImg = () => {
    //     for (let y = 0; y < sizeImg.height; y++) {
    //         for (let x = 0; x < sizeImg.width; x++) {
    //             if ((y + x) % 2 == 0) {
    //                 bmp.pixel[x][y] = [1, 0, 0, 1];
    //
    //             }
    //         }
    //     }
    // }


    // createImg()

    return (
        <>
            {/*<img src={`${bmp.dataURL()}`}/>*/}
            <input type="file" onChange={(e) => {
                let fileList = e.target.files;
                if (fileList != null && fileList[0] != null) {
                    encodeImgFileAsUrl(fileList[0]);
                    imgToCanvasAsBitmap(fileList[0]);
                }
            }}/>
            <div style={{margin: "20px 10px"}}>
                {urlImg && <img src={`${urlImg}`} width="400px" height="400px"/>}
            </div>
        </>
    )
}

export {GenerateBase};
