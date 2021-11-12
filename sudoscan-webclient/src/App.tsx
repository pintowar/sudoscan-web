import { About } from './pages/About'
import { PictureUploader } from './pages/PictureUploader'
import { WebCamStream } from './pages/WebCamStream'
import { NavMenu } from './components/NavMenu'
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom"

function App() {
  return (
    <Router>
      <div className="h-screen bg-gray-300 font-sans leading-normal tracking-normal">
        <NavMenu />
        <Switch>
            <Route exact path="/">
              <PictureUploader/>
            </Route>
            <Route path="/picture">
              <PictureUploader/>
            </Route>
            <Route path="/stream">
              <WebCamStream/>
            </Route>
            <Route path="/about">
              <About/>
            </Route>
          </Switch>  
      </div>  
    </Router>
  );
}

export default App;
