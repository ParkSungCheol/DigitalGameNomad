import StarRating from "./StarRating";
import { useState, useEffect, useRef } from "react"
import './Rating.css';

export default function Rating({ gameName, game1, game2, game3, game4, game5, game6 }) {

    const [gameList, setGameList] = useState([]);


    useEffect(() => {
        setGameList([game1, game2, game3, game4, game5, game6]);
    }, [gameName, game1, game2, game3, game4, game5, game6]);


    return (
        <>
            {gameName == null ? null :
                gameName.map((name, index) => (
                    <li key={index}>
                        <div>
                            {`${name}`}
                        </div>
                        <div className="board-starrating-master">
                            {gameList.length === 0 ? null : <StarRating average={Number(gameList[index][0] / 2)} />}
                        </div>
                        <div id="menu">
                            <div>
                                <span>{` (${gameList[index][0]}/10.0)  `}</span>
                                <p className="arrow_box">{`참여 ${gameList[index][1]}건`}</p>
                            </div>
                        </div>
                        
                    </li>
                ))
            }
        </>
    )

}
