import qs from 'qs';
import './About.css'
import DGN from './imgs/DGN.png';
import RubberBand from 'react-reveal/RubberBand';

const About = ({ location }) => {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true //이 설정을 통해 문자열 맨 앞의 ?를 생성합니다.
    });
    const showDetail = query.detail === 'true'; //쿼리의 파싱 결과 값은 문자열입니다.
    return (
        <div className="Home">
            <header className="Home-header">
            <RubberBand>
            <img src={DGN} className="Home-logo" alt="logo" /> 
            
            <h1>소개</h1>
            <p>1조 DGN(Digital Game Nomad)의 온라인 지스타 박람회입니다!</p>
            </RubberBand>
            {showDetail && <p>detail 값을 true로 설정하셨군요!</p>}
            </header>
        </div>
    );
};

export default About;