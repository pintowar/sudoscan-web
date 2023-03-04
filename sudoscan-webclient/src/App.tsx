import { NavMenu } from './components/NavMenu'
import { Outlet, useLocation } from "react-router-dom";
import { PictureUploader } from './pages/PictureUploader';


function App() {
  const { pathname } = useLocation();

  return (
    <div className="h-screen bg-gray-300 font-sans leading-normal tracking-normal">
      <NavMenu />
      {pathname === "/" ? <PictureUploader />: <Outlet />}
    </div>  
  );
}

export default App;
