import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import SinglePlayerGame from "./components/singleplayer/SinglePlayerGame";
import MultiplayerGame from "./components/multiplayer/MultiplayerGame";
import Stats from "./components/Stats";
import Leaderboard from "./components/Leaderboard";

function App() {
    return (
        <Router>
            <div className="app">
                <nav className="bg-gray-800 p-4">
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                        </li>
                        <li>
                            <Link to="/singleplayer" className="text-white hover:text-gray-300">Single Player</Link>
                        </li>
                        <li>
                            <Link to="/multiplayer" className="text-white hover:text-gray-300">Multiplayer</Link>
                        </li>
                        <li>
                            <Link to="/stats" className="text-white hover:text-gray-300">Stats</Link>
                        </li>
                        <li>
                            <Link to="/leaderboard" className="text-white hover:text-gray-300">Leaderboard</Link>
                        </li>
                    </ul>
                </nav>

                <main className="container mx-auto mt-8 p-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/singleplayer" element={<SinglePlayerGame />} />
                        <Route path="/multiplayer" element={<MultiplayerGame />} />
                        <Route path="/stats" element={<Stats />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Typing Game</h1>
            <p className="mb-4">Choose a game mode to start playing:</p>
            <div className="space-x-4">
                <Link to="/singleplayer" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Single Player
                </Link>
                <Link to="/multiplayer" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Multiplayer
                </Link>
            </div>
        </div>
    );
}

export default App;

