import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal, Award, Rocket, GraduationCap, Briefcase } from 'lucide-react'
import { useLeaderboard } from '../helpers/useLeaderboard'
import { useLoader } from '../utils/LoaderContext'

const Leaderboard: React.FC = () => {
  const { players, loading, error } = useLeaderboard()
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
          if (loading) {
              showLoader();
          } else {
              hideLoader();
          }
      }, [showLoader, hideLoader]);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="w-8 h-8 text-yellow-400" />
      case 1:
        return <Medal className="w-8 h-8 text-gray-400" />
      case 2:
        return <Award className="w-8 h-8 text-amber-600" />
      default:
        return <Rocket className="w-8 h-8 text-blue-400" />
    }
  }

  if (error) return <div className="text-center p-8 text-red-500">{error}</div>

  return (
    
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="text-center p-6 space-y-2 border-b border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              TypeMaster Leaderboard
            </h1>
            <p className="text-gray-600">Top performers in Extru 2025</p>
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
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } rounded-xl mb-2 relative overflow-hidden group hover:shadow-md transition-shadow`}
                >
                  {/* Position Indicator */}
                  <div className="flex items-center justify-center w-12">
                    {getPositionIcon(index)}
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={player.avatar || "/placeholder.svg"}
                      alt={player.name}
                      className="w-12 h-12 rounded-full border-2 border-purple-200"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{player.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                        {player.university && (
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            {player.university}
                          </div>
                        )}
                        {player.role && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
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
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <div className="text-2xl font-bold text-purple-600">{player.wpm}</div>
                      <div className="text-xs text-gray-500">WPM</div>
                    </motion.div>
                    <motion.div 
                      className="text-center"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <div className="text-2xl font-bold text-green-600">
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
      </div>
    
  )
}

export default Leaderboard
