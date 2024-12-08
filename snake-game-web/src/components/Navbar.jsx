// Estils
import "./Navbar.css"

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Snake Game</h1>
            <ul>
                <li><a href="/">1P</a></li>
                <li><a href="/snake1">2P<span className="separator"> - </span>Player 1</a></li>
                <li><a href="/snake2">2P<span className="separator"> - </span>Player 2</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;