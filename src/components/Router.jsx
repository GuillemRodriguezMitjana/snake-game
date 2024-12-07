import { BrowserRouter, Route, Routes } from "react-router-dom";
import GameBoard from "./GameBoard";
import GameBoard2P from "./GameBoard2P";
import NotFound from "./NotFound"

const Router = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GameBoard />} />
                <Route path="/snake1" element={<GameBoard2P player="1" />} />
                <Route path="/snake2" element={<GameBoard2P player="2" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;