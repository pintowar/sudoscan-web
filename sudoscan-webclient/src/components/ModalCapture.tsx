import Webcam from "react-webcam";
import Dropzone from "react-dropzone";
import { FaCamera, FaTimes } from 'react-icons/fa';
import { useRef, useState } from "react";
import { fileToBase64Image } from "../utils/images";

enum Tab {
    DnD, WebCam
}

interface ModalCaptureProps {
    show: boolean;
    onCapture: (src: string) => void;
    onClose: () => void;
}

export const ModalCapture = (props: ModalCaptureProps) => {
    const [tab, setTab] = useState(Tab.DnD);
    const webcamRef = useRef<Webcam>(null);
    const [imgWidth, imgHeight] = [480, 360];
    const videoConstraints = {
        width: imgWidth,
        height: imgHeight,
        facingMode: "environment"
    };

    const captureClose = () => {
        const screenshot = webcamRef.current?.getScreenshot() || ""
        props.onCapture(screenshot)
        props.onClose()
    }

    const onDrop = (files: File[]) => {
        if(files.length === 1) {
            fileToBase64Image(files[0]).then(data => {
                props.onCapture(data);
                props.onClose();
            })
        }
    }

    return (
        <div id="modal-example-regular" 
            className={`overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center ${props.show ? '' : 'hidden'}`}>
            <div className="w-auto my-6 mx-auto max-w-3xl">
                
                <div className="border-0 rounded-lg shadow-lg w-full bg-white outline-none focus:outline-none">
                
                    <div className="flex justify-between p-5">
                        <h3 className="text-3xl font-semibold">Add Image</h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-gray-300 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={props.onClose}
                        >
                            <span className="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">
                                <FaTimes />
                            </span>
                        </button>
                    </div>
                    
                    <div>
                        <ul className="list-reset flex border-b">
                            <li className={tab === Tab.DnD ? "-mb-px mr-1" : "mr-1"}>
                                <button className={`bg-white inline-block py-2 px-4 hover:text-gray-500 focus:outline-none
                                    ${tab === Tab.DnD ? "border-l border-t border-r rounded-t font-semibold" : "hover:text-blue-darker"}`}
                                    onClick={() => setTab(Tab.DnD)}
                                >DnD</button>
                            </li>
                            <li className={tab === Tab.WebCam ? "-mb-px mr-1" : "mr-1"}>
                                <button className={`bg-white inline-block py-2 px-4 hover:text-gray-500 focus:outline-none
                                    ${tab === Tab.WebCam ? "border-l border-t border-r rounded-t font-semibold" : "hover:text-blue-darker"}`}
                                    onClick={() => setTab(Tab.WebCam)}
                                >WebCam</button>
                            </li>
                            
                        </ul>
                        <div className="flex flex-col justify-center items-center mx-auto h-auto">
                            {tab === Tab.DnD && 
                                <Dropzone onDrop={onDrop} multiple={false} accept={"image/*"} >
                                    {({getRootProps, getInputProps}) => (
                                    <div {...getRootProps()} className="p-40">
                                        <input {...getInputProps()} />
                                        <p className="border-2 border-dashed p-8">Drag 'n' drop some files here, or click to select files</p>
                                    </div>
                                    )}
                                </Dropzone>
                            }
                            {tab === Tab.WebCam && 
                                <>
                                    <Webcam audio={false} ref={webcamRef} videoConstraints={videoConstraints}/>
                                    <button onClick={captureClose} className="px-4 py-3 my-5 bg-gray-600 hover:bg-gray-800 rounded-full text-white font-bold flex">
                                        <FaCamera className="h-6 w-6"/>
                                        <span className="ml-2">Capture</span>
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};