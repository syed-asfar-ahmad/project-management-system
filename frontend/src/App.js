// src/App.js
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { SocketProvider } from "./context/SocketContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <SocketProvider>
        <AppRoutes />
      </SocketProvider>
      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;
