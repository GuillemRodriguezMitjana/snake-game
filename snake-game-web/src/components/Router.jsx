import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./Navbar";
import GameBoard from "./GameBoard";
import GameBoard2P from "./GameBoard2P";
import TopScores from "./TopScores";
import NotFound from "./NotFound";

const Router = () => {
    return(
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<GameBoard />} />
                <Route path="/snake1" element={<GameBoard2P player="1" />} />
                <Route path="/snake2" element={<GameBoard2P player="2" />} />
                <Route path="/score" element={<TopScores />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;