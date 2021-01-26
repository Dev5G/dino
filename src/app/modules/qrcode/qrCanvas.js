import React from 'react'

export class QrCanvas extends React.PureComponent {
  render() {
    return (
        <div style={{ textAlign: "left", }}>
            <style>
                {`@media print { @page { size: landscape; } }`}
            </style>
            <canvas
                //id="canvas"
                ref={this.props.canvasRef}
                width={453.6}
                height={194.5}
                style={{
                    border: '2px solid #000',
                    
                    }}
            ></canvas>
            {/*QRcodeAsBase64('A00001')*/}
        </div>
    );
  }
}