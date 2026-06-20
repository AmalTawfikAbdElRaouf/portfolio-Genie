import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center">
      <h1 className="display-1 fw-bold text-purple mb-0">404</h1>
      <h3 className="text-white mb-3">Page Not Found</h3>
      <p className="text-muted-custom mb-4">The page you are looking for doesn't exist or has been moved.</p>
      <Button onClick={() => navigate("/")} className="btn-purple px-5">Back to Home</Button>
    </Container>
  );
};

export default NotFound;
