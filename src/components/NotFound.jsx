import { Link } from "react-router-dom";

// Estils
import "./NotFound.css";

const notFound = () => {
    return(
        <div className="not-found">
            <h2>Page Not Found!</h2>
            <div className="button-container">
                <Link to="/" className="not-found-button">1 Player</Link>
                <div>
                    <Link to="/snake1" className="not-found-button">2P - Snake 1</Link>
                    <Link to="/snake2" className="not-found-button">2P - Snake 2</Link>
                </div>
            </div>
        </div>
    );
}

export default notFound;