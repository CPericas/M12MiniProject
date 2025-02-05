import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Button, ListGroup, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const fetchOrderDetails = async (orderId) => {
    const response = await fetch(`https://fakestoreapi.com/carts/${orderId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch order details.");
    }
    return await response.json();
};

const OrderDetails = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderDetails(id)
            .then(setOrder)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [id]);

    const memoizedOrder = useMemo(() => order, [order]);

    const changeLanguage = useCallback((lng) => {
        i18n.changeLanguage(lng);
    }, [i18n]);

    if (loading) return <Alert variant="info" aria-live="polite">{t("orderDetails.loading")}</Alert>;
    if (error) return <Alert variant="danger">{t("orderDetails.error")}</Alert>;
    if (!memoizedOrder) return <Alert variant="warning">{t("orderDetails.notFound")}</Alert>;

    return (
        <div>
            <div className="language-switcher">
                <Button variant="outline-primary" onClick={() => changeLanguage("en")}>English</Button>
                <Button variant="outline-secondary" onClick={() => changeLanguage("es")} className="ms-2">Español</Button>
            </div>

            <h2>{t("orderDetails.title")}</h2>
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>{t("orderDetails.orderId")}: {memoizedOrder.id}</Card.Title>
                    <Card.Text>{t("orderDetails.date")}: {new Date(memoizedOrder.date).toLocaleDateString()}</Card.Text>
                    <h5>{t("orderDetails.products")}</h5>
                    <ListGroup>
                        {memoizedOrder.products.map((product) => (
                            <ListGroup.Item key={product.productId}>
                                {t("orderDetails.productId")}: {product.productId} - {t("orderDetails.quantity")}: {product.quantity}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
            <Link to="/cart">
                <Button variant="secondary">{t("orderDetails.backToCart")}</Button>
            </Link>
        </div>
    );
};

export default OrderDetails;
