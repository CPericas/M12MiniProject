import React from "react";
import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUserState] = useState(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        }
    }, []);

    const setUser = (userData) => {
        if (userData) {
            sessionStorage.setItem("user", JSON.stringify(userData));
        } else {
            sessionStorage.removeItem("user");
        }
        setUserState(userData);
    };

    const logout = () => {
        sessionStorage.removeItem("user");
        setUserState(null);
    }

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;