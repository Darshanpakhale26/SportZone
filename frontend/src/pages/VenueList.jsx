import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedSport = searchParams.get('sport');

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('/api/venues');
        setVenues(response.data);
      } catch (err) {
        console.error(err);
        // Mock fallback deleted for brevity/cleanliness
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Filter venues based on selected sport
  const filteredVenues = selectedSport 
    ? venues.filter(venue => 
        venue.courts && venue.courts.some(court => 
            court.sportType && court.sportType.toLowerCase() === selectedSport.toLowerCase()
        )
      )
    : venues;

  if (loading) return <div className="text-center mt-5 text-secondary">Loading Venues...</div>;

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-center" style={{ letterSpacing: '1px' }}>
        {selectedSport ? (
            <span>VENUES FOR <span style={{ color: 'var(--accent-neon)' }}>{selectedSport.toUpperCase()}</span></span>
        ) : (
            <span>EXPLORE <span style={{ color: 'var(--accent-neon)' }}>VENUES</span></span>
        )}
      </h2>
      
      {selectedSport && (
          <div className="text-center mb-5">
              <Button as={Link} to="/venues" variant="outline-light" size="sm">Show All Venues</Button>
          </div>
      )}

      {filteredVenues.length === 0 && (
          <div className="text-center text-secondary py-5">
              <h4>No venues found for {selectedSport}</h4>
              <Button as={Link} to="/venues" variant="primary" className="mt-3">View All Venues</Button>
          </div>
      )}

      <Row>
        {filteredVenues.map(venue => (
          <Col md={4} key={venue.id} className="mb-4">
            <Card className="h-100 overflow-hidden bg-dark border-secondary shadow-sm">
              <div className="position-relative">
                <Card.Img 
                    variant="top" 
                    src={venue.imageUrl || (venue.name.toLowerCase().includes('badminton') ? "https://images.unsplash.com/photo-1627627256672-0279553f1915?q=80&w=1456&auto=format&fit=crop" : "https://images.unsplash.com/photo-1574629810360-7efbbe195118?q=80&w=1000&auto=format&fit=crop")}
                    onError={(e) => { 
                        console.log("Image failed for:", venue.name, venue.imageUrl);
                        e.target.onerror = null; 
                        e.target.src = "https://images.unsplash.com/photo-1574629810360-7efbbe195118?q=80&w=1000&auto=format&fit=crop"; 
                    }}
                    style={{ height: '220px', objectFit: 'cover', filter: 'brightness(0.95)' }} 
                />
                <div className="position-absolute top-0 end-0 m-2 badge bg-primary text-white border border-light">
                    PREMIUM
                </div>
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold fs-4 mb-1" style={{ color: 'var(--accent-neon)' }}>{venue.name}</Card.Title>
                <Card.Text className="text-secondary mb-3 small"><i className="bi bi-geo-alt me-1"></i>{venue.location}</Card.Text>
                
                {/* Show available sports as badges */}
                <div className="mb-3">
                    {venue.courts && [...new Set(venue.courts.map(c => c.sportType))].map(sport => (
                        <Badge key={sport} bg="secondary" className="me-1">{sport}</Badge>
                    ))}
                </div>
                
                <div className="mb-3 text-secondary small d-flex align-items-center">
                    <i className="bi bi-clock me-2 text-warning"></i>
                    <span>{venue.openTime || '06:00'} - {venue.closeTime || '23:00'}</span>
                </div>

                <Card.Text className="text-secondary mb-4 flex-grow-1" style={{ opacity: 0.9 }}>{venue.description}</Card.Text>
                <Button 
                    as={Link} 
                    to={`/venues/${venue.id}`} 
                    variant="outline-primary" 
                    className="w-100 mt-auto fw-bold"
                    style={{ borderRadius: '5px', textTransform: 'uppercase' }}
                >
                    View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default VenueList;
