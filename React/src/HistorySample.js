import { Component } from 'react';
import DGN from './imgs/DGN.png';
import Tada from 'react-reveal/Tada';
import Flip from 'react-reveal/Flip';


class HistorySample extends Component {
    // 뒤로가기
    handleGoBack = () => {
        this.props.history.goBack();
    };

    //홈으로 이동
    handleGoHome = () => {
        this.props.history.push('/');
    };

    componentDidMount() {
        //이것을 설정하고 나면 페이지에 변화가 생기려고 할 때마다 정말 나갈 것인지를 질문함
        this.unblock = this.props.history.block('정말 떠나실 건가요?');
    }

    componentWillUnmount() {
        //컴포넌트가 언마운트되면 질문을 멈춤
        if (this.unblock) {
            this.unblock();
        }
    }

    render() {
        return (
            <div className='Home'>
                <header className="Home-header">
                    <Tada>
                <img src={DGN} className="Home-logo" alt="logo" />  
                </Tada>
                <br />
                <Flip top cascade>
                <h3><button onClick={this.handleGoBack}>뒤로</button></h3>
                <h3><button onClick={this.handleGoHome}>홈으로</button></h3>
                </Flip>
                </header>
            </div>
        );
    }
}

export default HistorySample;