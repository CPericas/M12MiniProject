import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../features/cart/cartSlice";
import { Row, Col, Card, Button, Spinner, Alert, Form } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";

const fetchProducts = async () => {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    return await response.json();
};

const fetchCategories = async () => {
    const response = await fetch("https://fakestoreapi.com/products/categories");
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }
    return await response.json();
};

const ProductCatalog = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("default");
    const [selectedCategory, setSelectedCategory] = useState("");

    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleAddToCart = useCallback((product) => {
        dispatch(
            addItem({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
            })
        );
    }, [dispatch]);

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];

        return products
            .filter(
                (product) =>
                    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.price.toString().includes(searchQuery)
            )
            .filter((product) =>
                selectedCategory ? product.category === selectedCategory : true
            )
            .sort((a, b) => {
                if (sortOrder === "price_asc") return a.price - b.price;
                if (sortOrder === "price_desc") return b.price - a.price;
                if (sortOrder === "name_asc") return a.title.localeCompare(b.title);
                if (sortOrder === "name_desc") return b.title.localeCompare(a.title);
                return 0;
            });
    }, [products, searchQuery, sortOrder, selectedCategory]);

    if (isLoading)
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">{t("loading")}</span>
            </Spinner>
        );

    if (error) return <Alert variant="danger">{error.message}</Alert>;

    return (
        <div>
            <div className="language-switcher mb-3">
                <Button variant="outline-primary" onClick={() => changeLanguage("en")}>
                    English
                </Button>
                <Button variant="outline-secondary" onClick={() => changeLanguage("es")} className="ms-2">
                    Español
                </Button>
            </div>

            <h2>{t("productCatalog.title")}</h2>

            <Form.Control
                type="text"
                placeholder={t("productCatalog.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="my-3">
                <option value="default">{t("productCatalog.sortBy")}</option>
                <option value="price_asc">{t("productCatalog.sortPriceAsc")}</option>
                <option value="price_desc">{t("productCatalog.sortPriceDesc")}</option>
                <option value="name_asc">{t("productCatalog.sortNameAsc")}</option>
                <option value="name_desc">{t("productCatalog.sortNameDesc")}</option>
            </Form.Select>

            <div>
                {categories &&
                    categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "primary" : "secondary"}
                            className="me-2"
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
            </div>

            <Row xs={1} md={4} className="g-4 mt-3">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Col key={product.id}>
                            <Card style={{ width: "18rem" }}>
                                <div style={{ padding: "10px" }}>
                                    <Card.Img
                                        variant="top"
                                        src={product.image}
                                        alt={product.title}
                                        style={{ height: "250px", objectFit: "contain" }}
                                    />
                                </div>
                                <Card.Body>
                                    <Card.Title>{product.title}</Card.Title>
                                    <Card.Text>
                                        {t("productCatalog.price")}: ${product.price}
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => handleAddToCart(product)}>
                                        {t("productCatalog.addToCart")}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>{t("productCatalog.noProducts")}</p>
                )}
            </Row>
        </div>
    );
};

export default ProductCatalog;
