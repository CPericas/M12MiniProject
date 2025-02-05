import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import UpdateProfile from "./components/UpdateProfile";
import DeleteAccount from "./components/DeleteAccount";
import ShoppingCart from "./components/ShoppingCart";
import OrderDetails from "./components/OrderDetails";
import { UserProvider } from "./context/UserContext";
import { useTranslation } from "react-i18next"; 
import i18n from "./i18n";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/update-profile" element={<UpdateProfile />} />
      <Route path="/delete-account" element={<DeleteAccount />} />
      <Route path="/cart" element={<ShoppingCart />} />
      <Route path="/order/:id" element={<OrderDetails />} />
    </Routes>
  );
}

export default App;
