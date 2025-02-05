import { useCallback, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Login() {
    const { t } = useTranslation(); // Hook for translations
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleUsernameChange = useCallback((e) => setUsername(e.target.value), []);
    const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
    
        if (!username.trim() || !password.trim()) {
            setError(t("login.error"));
            return;
        }
    
        try {
            const response = await axios.post("https://fakestoreapi.com/auth/login", {
                username: username.trim(),
                password: password.trim(),
            });
    
            const { token } = response.data;
    
            if (token) {
                sessionStorage.setItem("authToken", token);
                localStorage.setItem("userData", JSON.stringify({ username }));
                navigate("/home");
            } else {
                setError(t("login.invalid"));
            }
        } catch (error) {
            setError(error.response ? error.response.data.message : t("login.failed"));
        }
    }, [username, password, navigate, t]);

    return (
        <Container className="vh-100 d-flex justify-content-center align-items-center">
            <Row>
                <Col md={5}>
                    <h2>{t("login.title")}</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="usernameInput" className="mb-3">
                            <Form.Label>{t("login.username")}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={t("login.usernamePlaceholder")}
                                value={username}
                                onChange={handleUsernameChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="passwordInput" className="mb-3">
                            <Form.Label>{t("login.password")}</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder={t("login.passwordPlaceholder")}
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            {t("login.submit")}
                        </Button>
                    </Form>
                    <p className="mt-3">
                        {t("login.noAccount")} <Link to="/register">{t("login.register")}</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
