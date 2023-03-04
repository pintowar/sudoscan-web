import { useState, useEffect } from "react";
import { urlToBase64Image } from "../utils/images";
import { FaBug, FaPen, FaPlus, FaTrashAlt, FaImages, FaArrowAltCircleRight } from 'react-icons/fa';
import axios from 'axios';

import { ModalCapture } from "../components/ModalCapture";
import { AlertMessage } from "../components/AlertMessage";
import { EngineInfoLabel } from "../components/EngineInfoLabel";

export const PictureUploader = () => {
    const noImage = "./no-image.png"
    const [imgSource, setImgSource] = useState(noImage);
    const [solutionColor, setSolutionColor] = useState('BLUE');
    const [recognizerColor, setRecognizerColor] = useState('NONE');
    const [debug, setDebug] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [sampleImages, setSampleImages] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    
    const [alert, setAlert] = useState("");
    
    const [imgWidth, imgHeight] = [480, 360]
    
    const [imgStyle, setImgStyle] = useState({width: `${imgWidth}px`, height: `${imgHeight}px`})

    useEffect(() => {
        const init = async () => {
            const initSample  = ["./sudoku01.jpg", "./sudoku02.jpg"];
            const imgs = await Promise.all(initSample.map(urlToBase64Image))
            setSampleImages(imgs);
        };
        init();
    }, []);

    const clean = () => {
        setImgSource(noImage)
    }

    const solve = async () => {
        try {
            setProcessing(true)
            if(imgSource && imgSource !== noImage) {
                const res = await axios.post('/api/solve', { encodedImage: imgSource, solutionColor, recognizerColor, debug })
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

    const grapImage = (src: string) => {
        setSampleImages(sampleImages.concat(src));
    }

    const switchDebug = () => {
        const scale = debug ? 1.0 : 1.5
        setImgStyle({width: `${scale * imgWidth}px`, height: `${scale * imgHeight}px`})
        setDebug(!debug)
    }

    return (
        <div className="flex flex-1 h-full">

            <aside id="sidebar" className="bg-side-nav w-1/2 md:w-1/6 lg:w-1/6 border-r border-side-nav hidden md:block lg:block py-16 overflow-y-auto" style={{ display: 'block' }}>

                <div className="w-full py-3 px-2 border-b border-light-border bg-white flex relative">
                    <FaImages className="h-6 w-6"/>
                    <span className="ml-2">Pictures</span>

                    <button onClick={() => setShowModal(true)} className="inline-block p-1 mr-2 absolute right-0 shadow ripple hover:shadow-lg bg-gray-600 hover:bg-gray-800 rounded-full text-center text-white font-bold waves-effect">
                        <FaPlus />
                    </button>
                </div>

                <ul className="list-reset flex flex-col">
                    {sampleImages.map((src, idx) => 
                        <li key={idx} className="my-1 border-2 relative">
                            <button onClick={() => removeSample(idx)} className="px-2 py-1 my-1 absolute right-0 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex">
                                <FaTrashAlt className="h-3 w-3"/>
                            </button>
                            <button onClick={() => setImgSource(src)} className="px-2 py-1 my-8 absolute right-0 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex">
                                <FaArrowAltCircleRight className="h-3 w-3"/>
                            </button>
                            <img src={src} alt="Solvable" className="w-full h-48" />
                        </li>
                    )
                    }
                    
                </ul>

            </aside>

            <main className="bg-white-300 flex-1 p-3 overflow-hidden py-16">

                <div className="flex flex-col">

                    { alert && <AlertMessage message={alert} setMessage={setAlert} /> }

                    <ModalCapture show={showModal} onCapture={grapImage} onClose={() => setShowModal(!showModal)}/>

                    <EngineInfoLabel/>

                    <div className="flex flex-wrap justify-center space-x-5 pt-4">
                        <img src={imgSource} className="object-scale-down" style={imgStyle} alt="webcam-capture"/>
                    </div>

                    <div className="flex flex-wrap justify-center py-5 space-x-5">
                        <div className="flex flex-col">
                            <label htmlFor="solutionColor">Solution</label>
                            <select id="solutionColor" value={solutionColor} onChange={(e) => setSolutionColor(e.target.value)} className="px-4 py-3 my-5 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex" >
                                <option value="NONE" className="text-black bg-white">None</option>
                                <option value="BLUE" className="text-blue-500 bg-white">Blue</option>
                                <option value="GREEN" className="text-green-500 bg-white">Green</option>
                                <option value="RED" className="text-red-500 bg-white">Red</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="recognizerColor">Recognizer</label>
                            <select id="recognizerColor" value={recognizerColor} onChange={(e) => setRecognizerColor(e.target.value)} className="px-4 py-3 my-5 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex" >
                                <option value="NONE" className="text-black bg-white">None</option>
                                <option value="BLUE" className="text-blue-500 bg-white">Blue</option>
                                <option value="GREEN" className="text-green-500 bg-white">Green</option>
                                <option value="RED" className="text-red-500 bg-white">Red</option>
                            </select>
                        </div>

                        <div className="flex flex-col-reverse">
                            <button disabled={processing} onClick={switchDebug} className={`px-4 py-3 my-5 ${debug ? "bg-gray-900" : "bg-gray-600"} hover:bg-gray-800 rounded-full text-white font-bold flex`}>
                                <FaBug className="h-5 w-5"/>
                                <span className="ml-2">Debug</span>
                            </button>
                        </div>

                        <div className="flex flex-col-reverse">
                            <button disabled={processing} onClick={solve} className="px-4 py-3 my-5 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex">
                                <FaPen className="h-5 w-5"/>
                                <span className="ml-2">Solve</span>
                            </button>
                        </div>

                        <div className="flex flex-col-reverse">
                            <button disabled={processing} onClick={clean} className="px-4 py-3 my-5 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex">
                                <FaTrashAlt className="h-5 w-5"/>
                                <span className="ml-2">Clean</span>
                            </button>
                        </div>

                        <div className="flex flex-col-reverse">
                            {processing && <div className="px-4 py-3 my-5 w-12 h-12 border-4 border-gray-600 rounded-full loader" />}
                        </div>

                    </div> 
                    
                </div>
            </main>
            
        </div>
    );
};