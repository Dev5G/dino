import React, { useRef, useState, useEffect } from "react"
import { QRcodeAsBase64 } from './qrCode'
//import { useReactToPrint } from 'react-to-print';
import { QrCanvas } from "./qrCanvas";


export const QrWithInfo = props => {
    const canvasRef = useRef()
    const data = {
        set1: {
            tag: 'A10091',
            weight: 18.9,
            pureWeight: 16.67,
            stone: 1.2,
            dim: 0.9,
            karat: 21,
            totalWeight: 20.1
        }
    }
    const qrRef = useRef()
    //const handlePrint = useReactToPrint({
    //    content: () => qrRef.current,
    //});
    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d')
            if (ctx) {
                ctx.font = ' 1em Verdana';
                
                ctx.rotate(-0.5 * Math.PI);
                //Set 1
                ctx.fillText(`${data.set1.tag} (${data.set1.karat})`, -130, 20);
                ctx.fillText('N.W ' + data.set1.weight, -130, 33);
                ctx.fillText('P.W ' + data.set1.pureWeight, -130, 47);
                ctx.fillText('T.W ' + data.set1.totalWeight, -130, 60);
                ctx.fillText('Stw' + data.set1.totalWeight, -130, 73);
                ctx.fillText('Dim' + data.set1.totalWeight, -130, 87);
                ctx.fillText('Qty' + data.set1.totalWeight, -130, 100);
                let image = new Image()
                //image.onload = () => {
                //  ctx.drawImage(image, -120, 33)
                //}
                //image.src = QRcodeAsBase64('A00001')
                ctx.restore();
                ctx.save();
                ctx.rotate(1 * Math.PI);
                ctx.fillText(`${data.set1.tag} (${data.set1.karat})`, 20, -315);
                ctx.restore();
                ctx.save();
            }
        }
    }, [data])

    return (
        <>
            <QrCanvas ref={qrRef}
                canvasRef={canvasRef}
                style={{
                siz: '2px solid #000',
                marginTop: 10,
            }}/>
            {/*<button onClick={handlePrint}>Print this out!</button>*/}
        </>
    )
}
