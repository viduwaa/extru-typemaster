import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import SinglePlayerGame from "./components/singleplayer/SinglePlayerGame";
import MultiplayerGame from "./components/multiplayer/MultiplayerGame";
import Stats from "./components/Stats";
import Leaderboard from "./components/Leaderboard";
import GlowingLogo from "./utils/GlowingLogo";
import typeMasterLogo from "./assets/logos/TypeMasterLogo.webp";
import extruLogo from "./assets/logos/extru_logo.png";
import LeaderboardPublic from "./components/LeaderboardPublic";


function App() {
  return (
    <Router>
      <div className="app">
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4 items-center">
            <li>
              <Link to="/" className="text-white hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/singleplayer"
                className="text-white hover:text-gray-300"
              >
                Single Player
              </Link>
            </li>
            <li>
              <Link
                to="/multiplayer"
                className="text-white hover:text-gray-300"
              >
                Multiplayer
              </Link>
            </li>
            {/* <li>
              <Link to="/stats" className="text-white hover:text-gray-300">
                Stats
              </Link>
            </li> */}
            <li>
              <Link
                to="/leaderboard-public"
                className="text-white hover:text-gray-300"
              >
                Public-Leaderboard
              </Link>
            </li>
            <li>
              <Link
                to="/leaderboard"
                className="text-white hover:text-gray-300"
              >
                Extru-Leaderboard
              </Link>
            </li>
          
            <li className="!ml-auto">
              <img src={extruLogo} alt="" className="h-12 w-auto max-w-full"/>
            </li>
          </ul>
        </nav>

        <main className="container mx-auto mt-2 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/singleplayer" element={<SinglePlayerGame />} />
            <Route path="/multiplayer" element={<MultiplayerGame />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/leaderboard-public" element={<LeaderboardPublic />} />
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
      <div className="flex h-60 w-full items-center justify-center">
      <GlowingLogo src={typeMasterLogo} alt="logo" />
      </div>
      <h1 className="mb-4 text-4xl font-bold">Extru TypeMaster 2025</h1>
      <p className="mb-4">Choose a game mode to start playing:</p>
      <div className="space-x-4">
        <Link
          to="/singleplayer"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Single Player
        </Link>
        <Link
          to="/multiplayer"
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
        >
          Multiplayer
        </Link>
      </div>
    </div>
  );
}

export default App;
