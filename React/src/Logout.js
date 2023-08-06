import { useDispatch } from "react-redux";

function Logout() {

    const dispatch = useDispatch();

    const logout = () => {

        dispatch( { type: "logout" } );
        setTimeout( () => {
            window.location.replace("http://localhost/");
        }, 500);
    }

    return (
        <li 
            onClick={logout}
        >
            로그아웃
        </li>
    )
}

export default Logout;