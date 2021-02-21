import React from 'react'
import QRCode from 'react-qr-code'

export const QRcodeAsBase64 = (code, level = 'Q') => {
    const svg = (
        <QRCode
            level={level}
            value={code}
        />
    )
    // td styles for table to print tag
    //{
    //    transform: rotate(-90deg);
    //    background: transparent;
    //    position: absolute;
    //    border: 0px;
    //    margin - left: -18px;
    //}
    return svg
    if (svg) {
        const serializer = new XMLSerializer()
        const svgStr = serializer.serializeToString(svg)
        const base64 = `data:image/svg+xml;base64,${window.btoa(svgStr)}`
        return base64
    }
}