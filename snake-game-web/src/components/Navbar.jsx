// Estils
import "./Navbar.css"

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Snake Game</h1>
            <ul>
                <li><a href="/">1P</a></li>
                <li><a href="/snake1">2P-Player1</a></li>
                <li><a href="/snake2">2P-Player2</a></li>
                <li><a href="/score"><i className="fa-solid fa-trophy nav-trophy"></i> Top</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;