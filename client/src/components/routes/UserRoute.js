import { Navigate } from "react-router-dom";

function UserRoute(props) {
    if (localStorage.getItem("token")) {
        return props.children;
    } else {
        return <Navigate to="/login" />;
    }
}

export default UserRoute;