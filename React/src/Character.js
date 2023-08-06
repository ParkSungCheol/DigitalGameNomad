import man from './imgs/man.png';
import woman from './imgs/woman.png';
import CharacterBack from './imgs/CharacterBack.png';
import "./Character.css";
import React from 'react';
import Flip from 'react-reveal/Flip';
import Tada from 'react-reveal/Tada';

class Character extends React.Component {
    render() {
    return (
        <div className='character'>
              <img src={CharacterBack} className="CharacterBack" alt="CharacterBack" />
            <div className='character-choice'>
            
                <div className='character-choices'><Tada>캐릭터 선택</Tada></div>
               
            </div>
            <div className='character-master'>
            <div className='characterinfotext1'>컴퓨터 사양에 따라 30초~1분 정도의 로딩시간이 소요됩니다.</div>

            <div className='character-main'>    
            
                <div className='character-nav'>
                    <div className='character-choice-nav-master'>
                        <div className='character-choice-nav'>AJ</div> 
                        <div className='character-choice-nav'>Stefani</div>
                    </div>

                    <a target="_blank" rel="noopener noreferrer" href="http://localhost:5500/?image=1">
                        <div className='character-man-nav'>                       
                            <Flip left>
                                <img src={man} className="character-man" alt="characters" />
                            </Flip>                 
                        </div>  
                    </a>
                
                    <a target="_blank" rel="noopener noreferrer" href="http://localhost:5500/?image=2">
                        <div className='character-man-nav'>
                            <Flip right>
                                <img src={woman} className="character-woman" alt="characters"  />
                            </Flip>
                        </div>  
                    </a>
                </div>

                <div className='characterinfotext2'>※모바일 환경에서는 지원하지 않습니다.</div>
            </div>
            </div>
        </div>
    )
}
}



export default Character;