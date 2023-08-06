import Answer from "./Answer";
import font from './font.js';

function Questions({ userKey, userGrade, questionData, answerData }) {

    return (
        <ul className="service-list">
            {questionData === null ? null :
                questionData.map(data => (
                    <details key={data.questionsKey} className="service-qna">
                        <summary className="service-qustion" style={data.questionsResult ? { color: "green" } : null}>
                            {data.questions_title}
                            {userGrade === 1 ? "- 작성자(" : null}
                            {userGrade === 1 ? font(data.userKey.user_id) : null}
                            {userGrade === 1 ? ")" : null}
                        </summary>
                        <li style={data.questionsResult ? { backgroundColor: "rgb(79, 201, 113)" } : null} className="service-answer">
                            <h5>질문 내용</h5>
                            {data.questions_text}
                        </li>

                        {data.questionsResult === false && userGrade === 1 ?
                            <Answer userKey={userKey} questionsKey={data.questionsKey} />
                            :
                            answerData === null ? null :
                                data.questionsResult === true ?
                                    answerData.map(answer => (
                                        Number(answer.questionsKey) === data.questionsKey ?
                                            <li key={answer.answerKey} className="service-answer">
                                                <h5>운영자</h5>
                                                <p>{answer.answer_text}</p>
                                            </li>
                                            :
                                            null
                                    ))
                                    :
                                    <li className="service-answer">
                                        <h1>답변 검토 중입니다.</h1>
                                    </li>
                        }
                    </details>
                ))
            }
        </ul>
    )
}
export default Questions;
