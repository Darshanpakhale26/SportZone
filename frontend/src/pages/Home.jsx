import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-background">
      <Container className="py-5">
        <Row className="align-items-center mb-5">
          <Col md={6}>
            <h1 className="display-3 fw-bold mb-3" style={{ textShadow: '0 0 10px rgba(0, 255, 136, 0.3)' }}>
              <span style={{ color: 'var(--accent-neon)' }}>PLAY</span> LIKE A PRO.<br />
              BOOK IN <span style={{ color: 'var(--accent-secondary)' }}>SECONDS</span>.
            </h1>
            <p className="lead text-secondary mb-4">
              Discover and book the best sports facilities near you. From badminton courts to football turfs, we have it all.
            </p>
            <Button as={Link} to="/venues" variant="primary" size="lg" className="px-5 py-3 rounded-pill shadow-lg">
              Find a Venue <i className="bi bi-arrow-right ms-2"></i>
            </Button>
          </Col>
          <Col md={6}>
            <div className="position-relative">
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100%', height: '100%', border: '2px solid var(--accent-neon)', borderRadius: '15px', zIndex: 0 }}></div>
              <img
                src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop"
                alt="Sports"
                className="img-fluid rounded-3 shadow-lg position-relative"
                style={{ zIndex: 1, filter: 'brightness(0.9) contrast(1.1)' }}
              />
            </div>
          </Col>
        </Row>

        <h2 className="mb-4 fw-bold text-center" style={{ letterSpacing: '2px' }}>FEATURED <span style={{ color: 'var(--accent-neon)' }}>SPORTS</span></h2>
        <Row>
          {[
            { name: 'Badminton', img: 'https://images.unsplash.com/photo-1721760886982-3c643f05813d?q=80&w=1170&auto=format&fit=crop' },
            { name: 'Football', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=500&q=80' },
            { name: 'Tennis', img: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=500&q=80' },
            { name: 'Cricket', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=500&q=80' }
          ].map((sport, idx) => (
            <Col md={3} key={idx} className="mb-4">
              <Link to={`/venues?sport=${sport.name}`} style={{ textDecoration: 'none' }}>
                <Card
                  className="h-100 text-center py-5 border-0 sport-card position-relative overflow-hidden"
                  style={{
                    backgroundImage: `url(${sport.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '200px'
                  }}
                >
                  {/* Dark Overlay for readability */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      transition: 'background-color 0.3s ease'
                    }}
                    className="card-overlay"
                  ></div>

                  <Card.Body className="position-relative d-flex align-items-center justify-content-center">
                    <h3 className="fw-bold mb-0 text-white text-uppercase" style={{ letterSpacing: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                      {sport.name}
                    </h3>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
