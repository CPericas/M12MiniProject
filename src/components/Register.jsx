import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Register = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language");
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
        }
    }, [i18n]);

    const handleNameChange = useCallback((e) => setName(e.target.value), []);
    const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
    const handleUsernameChange = useCallback((e) => setUsername(e.target.value), []);
    const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);

    const formattedName = useMemo(() => {
        const [firstname, lastname] = name.trim().split(" ");
        return { firstname: firstname || "", lastname: lastname || "" };
    }, [name]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("language", lng);
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !username.trim() || !password.trim()) {
            setError(t("register.errorFields"));
            return;
        }

        try {
            const response = await fetch("https://fakestoreapi.com/users", {
                method: "POST",
                body: JSON.stringify({
                    email: email.trim(),
                    username: username.trim(),
                    password: password.trim(),
                    name: formattedName,
                    phone: "1-570-236-7033",
                    address: {
                        city: "kilcoole",
                        street: "7835 new road",
                        number: 3,
                        zipcode: "12926-3874",
                        geolocation: {
                            lat: "-37.3159",
                            long: "81.1496",
                        },
                    },
                }),
                headers: { "Content-Type": "application/json" },
            });

            const jsonResponse = await response.json();

            if (response.ok) {
                sessionStorage.setItem("registeredUser", JSON.stringify({ username, email }));
                navigate("/login");
            } else {
                setError(jsonResponse.message || t("register.errorGeneric"));
            }
        } catch (error) {
            setError(t("register.errorNetwork"));
        }
    }, [name, email, username, password, formattedName, navigate, t]);

    return (
        <div>
            <h2>{t("register.title")}</h2>
            {error && <div>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder={t("register.name")}
                    value={name}
                    onChange={handleNameChange}
                    required
                />
                <input
                    type="email"
                    placeholder={t("register.email")}
                    value={email}
                    onChange={handleEmailChange}
                    required
                />
                <input
                    type="text"
                    placeholder={t("register.username")}
                    value={username}
                    onChange={handleUsernameChange}
                    required
                />
                <input
                    type="password"
                    placeholder={t("register.password")}
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
                <button type="submit">{t("register.submit")}</button>
            </form>

            <div>
                <button onClick={() => changeLanguage("en")}>English</button>
                <button onClick={() => changeLanguage("es")}>Español</button>
            </div>
        </div>
    );
};

export default Register;
