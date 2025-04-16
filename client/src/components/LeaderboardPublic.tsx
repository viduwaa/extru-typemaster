import type React from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  Rocket,
  GraduationCap,
  Briefcase,
  TrendingUp,
  PersonStanding 
} from "lucide-react";
import { useLeaderboard } from "../helpers/useLeaderboardPublic";
import { useLoader } from "../utils/LoaderContext";
import qr from "../assets/qr.jpg";

const LeaderboardPublic: React.FC = () => {
  const { players, averageWPM, loading,totalPlayers, error } = useLeaderboard();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading, showLoader, hideLoader]);


  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-400" />;
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 2:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return <Rocket className="h-8 w-8 text-blue-400" />;
    }
  };

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex gap-6">
        <div className="flex-1 overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="space-y-2 border-b border-gray-200 p-6 text-center">
            <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              TypeMaster Leaderboard - Public
            </h1>
            <p className="text-gray-600">Top performers</p>
          </div>
          <div className="p-6">
            <AnimatePresence>
              {players.map((player, index) => (
                <motion.div
                  key={player.unique_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } group relative mb-2 overflow-hidden rounded-xl transition-shadow hover:shadow-md`}
                >
                  {/* Position Indicator */}
                  <div className="flex w-12 items-center justify-center">
                    {getPositionIcon(index)}
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex flex-1 items-center gap-3">
                    <img
                      src={player.avatar || "/placeholder.svg"}
                      alt={player.name}
                      className="h-12 w-12 rounded-full border-2 border-purple-200"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {player.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                        {player.university && (
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {player.university}
                          </div>
                        )}
                        {player.role && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {player.role}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <motion.div
                      className="text-center"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <div className="text-2xl font-bold text-purple-600">
                        {player.wpm}
                      </div>
                      <div className="text-xs text-gray-500">WPM</div>
                    </motion.div>
                    <motion.div
                      className="text-center"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <div className="min-w-[110px] text-2xl font-bold text-green-600">
                        {player.accuracy}%
                      </div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </motion.div>
                  </div>

                  {/* Progress bar */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${player.accuracy}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Average WPM Card */}
        <div className="flex flex-col gap-3">
          <div className="w-64 self-start rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-center">
              <TrendingUp className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
              Average WPM
            </h2>
            <motion.div
              className="text-center text-4xl font-bold text-purple-600"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {averageWPM}
            </motion.div>
            <p className="mt-2 text-center text-sm text-gray-600">
              Across all participants
            </p>
          </div>
          <div className="w-64 self-start rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-center">
              <PersonStanding className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
              Total Extru Participants
            </h2>
            <motion.div
              className="text-center text-4xl font-bold text-purple-600"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {totalPlayers}
            </motion.div>
          </div>

          <div className="w-64 self-start rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
              Review Us
            </h2>
            <motion.div
              className="text-center text-4xl font-bold text-purple-600"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <img src={qr} alt="" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPublic;
