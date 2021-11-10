import { useState, useEffect } from "react";
import { FaPen, FaCamera, FaTrashAlt, FaImages, FaArrowAltCircleRight } from 'react-icons/fa';
import Webcam from "react-webcam";
import axios from 'axios';

import { AlertMessage } from "../components/AlertMessage";
import { EngineInfoLabel } from "../components/EngineInfoLabel";

export const WebCamPicture = () => {
    const noImage = "./no-image.png"
    const [imgSource, setImgSource] = useState(noImage);
    const [solutionColor, setSolutionColor] = useState('BLUE');
    const [recognizerColor, setRecognizerColor] = useState('NONE');
    const [processing, setProcessing] = useState(false);
    const [sampleImages, setSampleImages] = useState<string[]>([]);
    
    const [alert, setAlert] = useState("");
    
    const [imgWidth, imgHeight] = [480, 360]
    
    const imgStyle = {width: `${imgWidth}px`, height: `${imgHeight}px`}

    const base64Image = async (url: string) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = () => {
                const base64data = reader.result;   
                resolve(`${base64data}`);
            }
        });
    }

    useEffect(() => {
        const initSample  = ["./sudoku01.jpg", "./sudoku02.jpg"];
        Promise.all(initSample.map(base64Image)).then(img =>
            setSampleImages(sampleImages.concat(img))
        )
    }, []);

    const clean = () => {
        setImgSource(noImage)
    }

    const solve = async () => {
        try {
            setProcessing(true)
            if(imgSource !== noImage) {
                const res = await axios.post('/api/solve', { encodedImage: imgSource, solutionColor, recognizerColor })
                setImgSource(res.data)
            }
        } catch ({ response: {data, status} }) {
            setAlert(status === 500 ? data as string : "Something wrong happened!!")            
        } finally {
            setProcessing(false)
        }
    }

    const removeSample = (idx: number) => {
        const copy = [...sampleImages];
        copy.splice(idx, 1);
        setSampleImages(copy);
    }

    return (
        <div className="flex flex-1 h-full">

            <aside id="sidebar" className="bg-side-nav w-1/2 md:w-1/6 lg:w-1/6 border-r border-side-nav hidden md:block lg:block py-16" style={{ display: 'block' }}>

                <ul className="list-reset flex flex-col">
                    <li className=" w-full h-full py-3 px-2 border-b border-light-border bg-white flex relative">
                        <FaImages className="h-6 w-6"/>
                        <span className="ml-2">Pictures</span>

                        <button onClick={clean} className="inline-block px-1 mr-2 absolute right-0 shadow ripple hover:shadow-lg bg-gray-600 hover:bg-gray-800 rounded-full text-center text-white font-bold waves-effect">
                            <span >+</span>
                        </button>
                    </li>
                    {sampleImages.map((src, idx) => 
                        <li key={idx} className="my-1 border-2 relative">
                            <button onClick={() => removeSample(idx)} className="px-2 py-1 my-1 absolute right-0 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex">
                                <FaTrashAlt className="h-3 w-3"/>
                            </button>
                            <button onClick={() => setImgSource(src)} className="px-2 py-1 my-8 absolute right-0 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex">
                                <FaArrowAltCircleRight className="h-3 w-3"/>
                            </button>
                            <img src={src} alt="Dbl Click" className="w-full h-48" />
                        </li>
                    )
                    }
                    
                </ul>

            </aside>

            <main className="bg-white-300 flex-1 p-3 overflow-hidden py-16">

                <div className="flex flex-col">

                    { alert && <AlertMessage message={alert} setMessage={setAlert} /> }

                    <EngineInfoLabel/>

                    <div className="flex flex-wrap justify-center space-x-5 pt-4">
                        <img src={imgSource} className="object-scale-down" style={imgStyle} alt="webcam-capture"/>
                    </div>

                    <div className="flex flex-wrap justify-center py-5 space-x-5">
                    <select value={solutionColor} onChange={(e) => setSolutionColor(e.target.value)} className="px-4 py-3 my-5 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex" >
                            <option value="NONE" className="text-black bg-white">None</option>
                            <option value="BLUE" className="text-blue-500 bg-white">Blue</option>
                            <option value="GREEN" className="text-green-500 bg-white">Green</option>
                            <option value="RED" className="text-red-500 bg-white">Red</option>
                        </select>

                        <select value={recognizerColor} onChange={(e) => setRecognizerColor(e.target.value)} className="px-4 py-3 my-5 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex" >
                            <option value="NONE" className="text-black bg-white">None</option>
                            <option value="BLUE" className="text-blue-500 bg-white">Blue</option>
                            <option value="GREEN" className="text-green-500 bg-white">Green</option>
                            <option value="RED" className="text-red-500 bg-white">Red</option>
                        </select>

                        <button disabled={processing} onClick={solve} className="px-4 py-3 my-5 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex">
                            <FaPen className="h-6 w-6"/>
                            <span className="ml-2">Solve</span>
                        </button>

                        <button disabled={processing} onClick={clean} className="px-4 py-3 my-5 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex">
                            <FaTrashAlt className="h-6 w-6"/>
                            <span className="ml-2">Clean</span>
                        </button>
                        {processing && <div className="px-4 py-3 my-5 w-12 h-12 border-4 border-gray-600 rounded-full loader" />}

                    </div> 
                    
                </div>
            </main>
            
        </div>
    );
};