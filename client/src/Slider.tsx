import { ChangeEvent, MouseEvent, useState, useEffect } from "react";
import reactLogo from './assets/react.svg'
interface SliderProps {
    current: string;
  }
function Slider({current} : SliderProps) {
    const [offset, setOffset] = useState({[current]: {horizontal: 0, vertical: 0}});
    const [width, setWidth] = useState({[current]: 1})
    const [height, setHeight] = useState({[current]: 1})
    const [file, setFile] = useState(reactLogo);
    const [scale, setScale] = useState({[current]:{horizontal: 0, vertical: 0}})
    const [name, setName] = useState(current)

    useEffect( () => {
        if(!scale[current]) {
            setOffset({...offset, [current]: {horizontal: 0, vertical: 0}})
            setScale({...scale, [current]: {horizontal: 0, vertical: 0}})
            setWidth({...width, [current]: 1})
            setHeight({...height, [current]: 1})
        }
        setName(current)
    }, [current])


    const handleHor = (event: ChangeEvent<HTMLInputElement>) => {
        setOffset({...offset, [name]: {horizontal: Number(event.target.value), vertical: offset[name].vertical || 0}})
    }

    const handleVer = (event: ChangeEvent<HTMLInputElement>) => {
        setOffset({...offset, [name]: {horizontal: offset[name].horizontal || 0, vertical: Number(event.target.value)}})
    }

    const handleWidth = (event: ChangeEvent<HTMLInputElement>) => {
        setWidth({...width, [name]: Number(event.target.value)})
    }
    const handleHeight = (event: ChangeEvent<HTMLInputElement>) => {
        setHeight({...height, [name]: Number(event.target.value)})
    }

    const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
        setFile(URL.createObjectURL(event.target.files![0]));
    }

    const handleVerScale = (event: ChangeEvent<HTMLInputElement>) => {
        setScale({...scale, [name]: {horizontal: scale[name].horizontal || 0, vertical:Number(event.target.value)}});
    }

    const handleHorScale = (event: ChangeEvent<HTMLInputElement>) => {
        scale[name] = {horizontal: Number(event.target.value), vertical:scale[name].vertical || 0}
        setScale({...scale, [name]: {horizontal: Number(event.target.value), vertical:scale[name].vertical || 0}});
    }

    const handleExport = (_event: MouseEvent<HTMLButtonElement>) => {
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
        for(let grid of Object.keys(width)) {
            for (var i = 1; i < width[name]+1; i++) {
                for(var j =1; j < height[grid]+1; j++) {
                    let y = Math.floor(((j*((500+scale[grid].horizontal)/(height[grid]+1))+offset[grid].vertical-(scale[grid].horizontal/2))/500)*imageData.height)
                    let x = Math.floor(((i*((500+scale[grid].vertical)/(width[grid]+1))+offset[grid].horizontal-(scale[grid].vertical/2))/500)*imageData.width)
                    let index = ((y*imageData.width)+x)*4
                    colors.push([pixels[index],pixels[index+1],pixels[index+2],pixels[index+3]])
                    console.log(`x: ${x}, y: ${y}, ${[pixels[index],pixels[index+1],pixels[index+2],pixels[index+3]]}`)
                }

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
        }

        const element = document.createElement("a");
        const newFile = new Blob([fileText], {type: 'text/plain'});
        element.href = URL.createObjectURL(newFile);
        element.download = "palette.fap";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const renderLines = () => {
        
        let indents = [];
        for(let grid of Object.keys(width)) {
            const stroke = grid === name ? "white" : "darkslategray"
            for (var i = 1; i < width[grid]+1; i++) {
                for(var j =1; j < height[grid]+1; j++) {
                    indents.push((<line x1="0" y1={j*((500+scale[grid].horizontal)/(height[grid]+1))+offset[grid].vertical-(scale[grid].horizontal/2)} x2={500} y2={j*((500+scale[grid].horizontal)/(height[grid]+1))+offset[grid].vertical-(scale[grid].horizontal/2)} stroke={stroke}/>))
                }
                indents.push((<line x1={i*((500+scale[grid].vertical)/(width[grid]+1))+offset[grid].horizontal-(scale[grid].vertical/2)} y1="0" x2={i*((500+scale[grid].vertical)/(width[grid]+1))+offset[grid].horizontal-(scale[grid].vertical/2)} y2={500} stroke={stroke}/>))
            }
        }
        for (var i = 1; i < width[name]+1; i++) {
            for(var j =1; j < height[name]+1; j++) {
                indents.push((<line x1="0" y1={j*((500+scale[name].horizontal)/(height[name]+1))+offset[name].vertical-(scale[name].horizontal/2)} x2={500} y2={j*((500+scale[name].horizontal)/(height[name]+1))+offset[name].vertical-(scale[name].horizontal/2)} stroke="white"/>))
            }
            indents.push((<line x1={i*((500+scale[name].vertical)/(width[name]+1))+offset[name].horizontal-(scale[name].vertical/2)} y1="0" x2={i*((500+scale[name].vertical)/(width[name]+1))+offset[name].horizontal-(scale[name].vertical/2)} y2={500} stroke="white"/>))
        }
        return indents;
    }
    
    return (<div className="display-horizontally">
        
        <svg width="500" height="500">
            <image href={file} width="100%" height="100%" preserveAspectRatio="none"/>
            {
                renderLines()
            }
            
        </svg>
        <div className="display-vertically stretch">
            <h5>Vertical Scale</h5>
            <div className="display-horizontally">
                <input type="range" min="-150" max="30" value={scale[name].horizontal} className="slider" id="horScale" onChange={handleHorScale}/>
                <input type="number" min="-150" max="30" value={scale[name].horizontal} id="horScaleNum" onChange={handleHorScale}/>
            </div>
            <h5>Horizontal Scale</h5>
            <div className="display-horizontally">
                <input type="range" min="-150" max="30" value={scale[name].vertical} className="slider" id="verScale" onChange={handleVerScale}/>
                <input type="number" min="-150" max="30" value={scale[name].vertical} id="verScaleNum" onChange={handleVerScale}/>
            </div>
            <h5>Vertical Offset</h5>
            <div className="display-horizontally">
                <input type="range" min="-50" max="50" value={offset[name].vertical} className="slider" id="vertical" onChange={handleVer}/>
                <input type="number" min="-50" max="50" value={offset[name].vertical} id="verticalNum" onChange={handleVer}/>
            </div>
            <h5>Horizontal Offset</h5>
            <div className="display-horizontally">
                <input type="range" min="-50" max="50" value={offset[name].horizontal} className="slider" id="horizontal" onChange={handleHor}/>
                <input type="number" min="-50" max="50" value={offset[name].horizontal} id="horizontalNum" onChange={handleHor}/>
            </div>
            <h5>Number of Rows</h5>
            <input type="number" min="1" max="100" value={height[name]} className="gridsize" id="gridwidth" placeholder="Grid Width" onChange={handleHeight}/>
            <h5>Number of Columns</h5>
            <input type="number" min="1" max="100" value={width[name]} className="gridsize" id="gridheight" placeholder="Grid Height" onChange={handleWidth}/>
            <h5>Upload Image:</h5>
            <input type="file" onChange={handleUpload} />
        </div>
        <div>
            <button onClick={handleExport}>Export</button>
        </div>
    </div>)
}


export default Slider