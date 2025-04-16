import WPMGraph from "../utils/WPMGraph"
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SERVER_URI, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

const Stats = () => {
  return (
    <WPMGraph socket={socket}/>
  )
}

export default Stats