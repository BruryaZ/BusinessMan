import { JSX, useContext } from "react";
import { globalContext } from "../context/GlobalContext";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const { isAdmin } = useContext(globalContext);

    if (isAdmin === false) {

        return (
            <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>
                <h2>אין לך הרשאה לצפות בדף זה</h2>
            </div>
        );
    }

    return children;
};

export default AdminRoute;