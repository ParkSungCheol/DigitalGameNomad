import { Route, Link, Switch } from 'react-router-dom';
import DGNw1 from './imgs/DGNw1.png';
import './Home.css';
import Character from './Character';
import Zoom from 'react-reveal/Zoom'
import Slide from 'react-reveal/Slide'

const Home = () => {
    return (
        <div className="Home">
            
            <header className="Home-header">
                <video className="videoss" autoPlay muted loop>
                    <source  
                        src='/videos/Network.mp4' 
                        type='video/mp4' 
                    />
                </video>

                    <Zoom>                     
                        <img src={DGNw1} className="Home-logo" alt="logo"  />                
                    </Zoom>



                    <Slide top>
                        <Link className="Home-link"to="/Character">Click to Play</Link>
                    </Slide>    


            </header>

                <Switch>
                    <Route path="/Character" component={Character} />
                </Switch>

        </div>
        
    );
};
    

export default Home;