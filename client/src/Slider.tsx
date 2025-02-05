import { ChangeEvent, MouseEvent, ReactNode, SyntheticEvent, useState } from "react";
import reactLogo from './assets/react.svg'
import React from "react";

function Slider() {
    const [offset, setOffset] = useState({horizontal: 0, vertical: 0});
    const [width, setWidth] = useState(1)
    const [height, setHeight] = useState(1)
    const [file, setFile] = useState(reactLogo);
    const [scale, setScale] = useState(0)


    const handleHor = (event: ChangeEvent<HTMLInputElement>) => {
        setOffset({horizontal: Number(event.target.value), vertical: offset.vertical})
    }

    const handleVer = (event: ChangeEvent<HTMLInputElement>) => {
        setOffset({horizontal: offset.horizontal, vertical: Number(event.target.value)})
    }

    const handleWidth = (event: ChangeEvent<HTMLInputElement>) => {
        setWidth(Number(event.target.value))
    }
    const handleHeight = (event: ChangeEvent<HTMLInputElement>) => {
        setHeight(Number(event.target.value))
    }

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        setFile(URL.createObjectURL(event.target.files![0]));
    }

    const handleScale = (event: ChangeEvent<HTMLInputElement>) => {
        setScale(Number(event.target.value));
    }

    const handleExport = (event: MouseEvent<HTMLButtonElement>) => {
        const image = new Image();
        image.src = file;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Now you have the pixel data in the 'pixels' array
        // Each pixel is represented by 4 consecutive values in the array:
        // [red, green, blue, alpha]
        let colors: number[][] = []
        for (var i = 1; i < width+1; i++) {
            for(var j =1; j < height+1; j++) {
                let y = Math.floor(((j*((300+scale)/(height+1))+offset.vertical-(scale/2))/300)*imageData.height)
                let x = Math.floor(((i*((300+scale)/(width+1))+offset.horizontal-(scale/2))/300)*imageData.width)
                let index = ((y*imageData.width)+x)*4
                colors.push([pixels[index],pixels[index+1],pixels[index+2],pixels[index+3]])
                console.log(`x: ${x}, y: ${y}, ${[pixels[index],pixels[index+1],pixels[index+2],pixels[index+3]]}`)
            }

        }
        let fileText = ''
        for(let index = 0; index < colors.length; index++) {
            let color = colors[index]
            let r = color[0]
            let g = color[1]
            let b = color[2]
            fileText += `[${index}]\n`
            fileText += `name=NONAME\n`
            fileText += `r=@Variant(\\0\\0\\0\\x86\\x${r.toString(16)})\n`
            fileText += `g=@Variant(\\0\\0\\0\\x86\\x${g.toString(16)})\n`
            fileText += `b=@Variant(\\0\\0\\0\\x86\\x${b.toString(16)})\n\n`
            console.log()
        }

        const element = document.createElement("a");
        const newFile = new Blob([fileText], {type: 'text/plain'});
        element.href = URL.createObjectURL(newFile);
        element.download = "test.fap";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const renderLines = () => {
        let indents = [];
            for (var i = 1; i < width+1; i++) {
                for(var j =1; j < height+1; j++) {
                    indents.push((<line x1="0" y1={j*((300+scale)/(height+1))+offset.vertical-(scale/2)} x2={300} y2={j*((300+scale)/(height+1))+offset.vertical-(scale/2)} stroke="white"/>))
                }
                indents.push((<line x1={i*((300+scale)/(width+1))+offset.horizontal-(scale/2)} y1="0" x2={i*((300+scale)/(width+1))+offset.horizontal-(scale/2)} y2={300} stroke="white"/>))
            }
        return indents;
    }
    
    return (<div className="display-horizontally">
        
        <svg width="300" height="300">
            <image href={file} width="100%" height="100%" preserveAspectRatio="none"/>
            {
                renderLines()
            }
            
        </svg>
        <div className="display-vertically stretch">
            <h5>Scale</h5>
            <input type="range" min="-150" max="30" value={scale} className="slider" id="scale" onChange={handleScale}/>
            <h5>Vertical Offset</h5>
            <input type="range" min="-50" max="50" value={offset.vertical} className="slider" id="vertical" onChange={handleVer}/>
            <h5>Horizontal Offset</h5>
            <input type="range" min="-50" max="50" value={offset.horizontal} className="slider" id="horizontal" onChange={handleHor}/>
            <h5>Number of Rows</h5>
            <input type="number" min="1" max="100" value={width} className="gridsize" id="gridwidth" placeholder="Grid Width" onChange={handleWidth}/>
            <h5>Number of Columns</h5>
            <input type="number" min="1" max="100" value={height} className="gridsize" id="gridheight" placeholder="Grid Height" onChange={handleHeight}/>
            <h5>Upload Image:</h5>
            <input type="file" onChange={handleUpload} />
        </div>
        <div>
            <button onClick={handleExport}>Export</button>
        </div>
    </div>)
}


export default Slider