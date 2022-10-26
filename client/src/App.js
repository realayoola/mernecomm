import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PublicRoute from "./components/routes/PublicRoute";
import Home from "./pages/Home";
import UserRoute from "./components/routes/UserRoute";
import History from "./pages/user/History";
import { Navigate } from "react-router-dom";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <p>Hello</p>
      <Routes>
        <Route path="/"
          element={<Home/>}/>
        <Route path="/login"
          element={
          <PublicRoute>
            <Login />
          </PublicRoute>}
        />
        <Route path="/register"
          element={
          <PublicRoute>
            <Register/>
          </PublicRoute>}
        />
        <Route path="/user/history"
          element={<UserRoute>
            <History />
          </UserRoute>}
        />
        <Route path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
