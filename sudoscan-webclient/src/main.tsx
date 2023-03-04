import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { About } from './pages/About'
import { PictureUploader } from './pages/PictureUploader'
import { WebCamStream } from './pages/WebCamStream'
import './index.css'

import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/picture",
        element: <PictureUploader/>,
      },
      {
        path: "/stream",
        element: <WebCamStream/>,
      },
      {
        path: "/about",
        element: <About/>,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
