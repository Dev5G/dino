import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { QrWithInfo } from './qrWithInfo';

export const QrCodePrinter = props => {
    const qrRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => qrRef.current,
    });
    return (
        <div>
            <QrWithInfo ref={qrRef} />
            <button onClick={handlePrint}>Print this out!</button>
        </div>
    )
}