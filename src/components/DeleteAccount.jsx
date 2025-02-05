import { useState, useCallback } from "react";
import { Container, Row, Col, Button, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function DeleteAccount() {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleDelete = useCallback(async () => {
        const storedUser = JSON.parse(sessionStorage.getItem("userData"));

        if (!storedUser || !storedUser.id) {
            setError(t("deleteAccount.noUser"));
            return;
        }

        try {
            const response = await fetch(`https://fakestoreapi.com/users/${storedUser.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(t("deleteAccount.deleteError"));
            }

            sessionStorage.removeItem("userData");
            setSuccessMessage(t("deleteAccount.success"));
            setError(null);

            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setError(error.message);
        }
    }, [navigate, t]);

    return (
        <Container className="vh-100 d-flex justify-content-center align-items-center">
            <Row>
                <Col md={5}>
                    <h2>{t("deleteAccount.title")}</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    <Button variant="danger" onClick={() => setShowModal(true)} className="w-100">
                        {t("deleteAccount.button")}
                    </Button>

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>{t("deleteAccount.confirmTitle")}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {t("deleteAccount.confirmMessage")}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                {t("deleteAccount.cancel")}
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                {t("deleteAccount.delete")}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
}

export default DeleteAccount;

