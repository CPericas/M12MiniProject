import { useCallback, useContext, useMemo } from "react";
import UserContext from "../context/UserContext";
import { Button, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import ProductCatalog from "./ProductCatalog";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const cartCount = useSelector((state) => state.cart.totalItems);

    const fullName = useMemo(() => {
        return user ? `${user.name.firstname} ${user.name.lastname}` : "Guest";
    }, [user]);

    const handleLogout = useCallback(() => {
        logout();
        navigate("/");
    }, [logout, navigate]);

    return (
        <Container className="mt-5">
            <h1>Welcome to the API Store!</h1>
            <Button variant="primary" className="mt-3" onClick={() => navigate("/update-profile")}>
                Update Profile
            </Button>
            <Button variant="danger" className="mt-3" onClick={() => navigate("/delete-account")}>
                Delete Account
            </Button>
            <p>Your cart has {cartCount} item(s).</p>
            <ProductCatalog />
            <Button variant="primary" className="mt-3" onClick={() => navigate("/cart")}>Cart</Button>
            <Button variant="secondary" className="mt-3" onClick={handleLogout}>Logout</Button>
        </Container>
    );
}

export default HomePage;

