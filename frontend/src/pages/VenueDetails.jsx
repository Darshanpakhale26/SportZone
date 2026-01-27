import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Badge, Nav, Alert, Carousel } from 'react-bootstrap';
import axios from 'axios';
const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking State
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [bookingError, setBookingError] = useState('');
  const [venueBookings, setVenueBookings] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await axios.get(`/api/venues/${id}`);
        setVenue(res.data);

        // Set default sport if courts exist
        if (res.data.courts && res.data.courts.length > 0) {
          const sports = [...new Set(res.data.courts.map(c => c.sportType))];
          setSelectedSport(sports[0]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load venue details.');
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  // Update booked slots when court or date changes
  useEffect(() => {
      // Don't run if no court is selected
      if (!selectedCourt) {
          setBookedSlots([]);
          return;
      }

      const fetchCourtBookings = async () => {
        try {
            console.log(`Fetching bookings for Court ID: ${selectedCourt.id}`);
            const res = await axios.get(`/api/bookings/court/${selectedCourt.id}`);
            const bookings = res.data;
            
            if (!selectedDate) return;

             // 3. String-based date comparison (Safest for ISO strings)
            const relevantBookings = bookings.filter(b => {
                if (b.status === 'CANCELLED') return false;
                const bookingDateStr = b.startTime.split('T')[0];
                return bookingDateStr === selectedDate;
            });

            console.log(`Debug: Court has ${bookings.length} total bookings. Found ${relevantBookings.length} matching date.`);
            
            const slots = [];
            relevantBookings.forEach(b => {
                const start = new Date(b.startTime).getHours();
                const end = new Date(b.endTime).getHours();
                for (let i = start; i < end; i++) {
                    slots.push(i);
                }
            });
            setBookedSlots(slots);

        } catch (err) {
            console.error("Failed to fetch court bookings:", err);
        }
      };

      fetchCourtBookings();

  }, [selectedCourt, selectedDate]);

  const handleBook = async () => {
    setBookingError('');
    if (!selectedCourt || !selectedDate || !startTime || !endTime) {
      setBookingError('Please select all booking details.');
      return;
    }

    // Validation: Check for overlaps with booked slots
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    for (let i = startHour; i < endHour; i++) {
        if (bookedSlots.includes(i)) {
            setBookingError('Selected time slot overlaps with an existing booking.');
            return;
        }
    }

    // Validation: Future Time
    const startDateTime = new Date(`${selectedDate}T${startTime}:00`);
    const now = new Date();
    if (startDateTime < now) {
      setBookingError('Booking start time must be in the future.');
      return;
    }

    // Validation: 1-hour blocks
    const startMinutes = parseInt(startTime.split(':')[1]);
    const endMinutes = parseInt(endTime.split(':')[1]);
    if (startMinutes !== 0 || endMinutes !== 0) {
      setBookingError('Booking must start and end on the hour (e.g., 10:00, 11:00).');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Calculate duration for price (simplified)
      const duration = endHour - startHour;
      const amount = duration * selectedCourt.pricePerHour;

      // Format date and time to ISO LocalDateTime string (YYYY-MM-DDTHH:mm:ss)
      const formattedStartTime = `${selectedDate}T${startTime}:00`;
      const formattedEndTime = `${selectedDate}T${endTime}:00`;

      const bookingData = {
        userId: user.id,
        courtId: selectedCourt.id,
        venueId: venue.id,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        amount: amount,
        status: 'CONFIRMED'
      };

      await axios.post('/api/bookings', bookingData);
      alert('Booking Confirmed!');
      navigate('/my-bookings');
    } catch (err) {
      console.error("Booking Error:", err);
      const msg = err.response?.data?.message || err.response?.data || 'Booking failed. Please try again.';
      setBookingError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <Alert variant="danger" className="m-5">{error}</Alert>;
  if (!venue) return <Alert variant="warning" className="m-5">Venue not found.</Alert>;

  // Filter courts by sport
  const availableSports = [...new Set((venue.courts || []).map(c => c.sportType))];
  const filteredCourts = (venue.courts || []).filter(c => c.sportType === selectedSport);

  return (
    <Container className="py-5">
      <Row>
        {/* Left Side: Venue Info */}
        <Col lg={7} className="mb-4">
          <div className="position-relative mb-4">
            {venue && (
                <Carousel interval={2000} indicators={true} className="rounded shadow-sm overflow-hidden" fade>
                    {((venue.images && venue.images.length > 0) 
                        ? venue.images.map(img => img.imageUrl) 
                        : [venue.imageUrl || "https://via.placeholder.com/800x400?text=SportZone"]
                    ).map((img, idx) => (
                        <Carousel.Item key={idx}>
                            <img
                              src={img}
                              alt={`${venue.name} slide ${idx}`}
                              className="d-block w-100"
                              style={{ height: '400px', objectFit: 'cover' }}
                              onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/800x400?text=SportZone"; }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            )}
          </div>

          <h1 className="fw-bold" style={{ color: 'var(--text-primary)' }}>{venue.name}</h1>
          <p className="text-secondary fs-5"><i className="bi bi-geo-alt-fill me-2"></i>{venue.location}</p>
          <p className="fs-6" style={{ color: 'var(--text-primary)' }}>
              <i className="bi bi-clock-history me-2 text-warning"></i>
              <span className="fw-bold">Open Today:</span> {venue.openTime || '06:00'} - {venue.closeTime || '23:00'}
          </p>

          <div className="mt-4">
            <h4 className="fw-bold mb-3">About this Venue</h4>
            <p className="text-secondary" style={{ lineHeight: '1.8' }}>
              {venue.description}
            </p>
          </div>

          <div className="mt-4">
            <h4 className="fw-bold mb-3">Amenities</h4>
            <div className="d-flex flex-wrap gap-2">
              {['Parking', 'Changing Room', 'Drinking Water', 'Floodlights', 'Equipment Rental'].map((item, idx) => (
                <Badge key={idx} bg="secondary" className="border p-2 fw-normal">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </Col>

        {/* Right Side: Booking Card */}
        <Col lg={5}>
          <Card className="border-0 shadow-lg sticky-top bg-dark card-body-theme" style={{ top: '100px', borderRadius: '15px', zIndex: 1, backgroundColor: 'var(--bg-card)' }}>
            <Card.Body className="p-4">
              <h3 className="fw-bold mb-4">Book a Slot</h3>

              {bookingError && <Alert variant="danger">{bookingError}</Alert>}

              {/* Sport Selection Tabs */}
              <Nav variant="pills" className="mb-4 justify-content-center p-1" style={{ background: 'transparent' }}>
                {availableSports.map(sport => (
                  <Nav.Item key={sport}>
                    <Nav.Link
                      active={selectedSport === sport}
                      onClick={() => { setSelectedSport(sport); setSelectedCourt(null); }}
                      className={selectedSport === sport ? '' : 'text-secondary'}
                      style={{ 
                          color: selectedSport === sport ? 'var(--text-primary)' : '', 
                          borderRadius: '10px', 
                          minWidth: '100px', 
                          textAlign: 'center',
                          backgroundColor: 'transparent',
                          border: selectedSport === sport ? '1px solid #0dcaf0' : '1px solid transparent',
                          boxShadow: selectedSport === sport ? '0 0 15px rgba(13, 202, 240, 0.5)' : 'none',
                          transition: 'all 0.3s ease',
                          fontWeight: selectedSport === sport ? 'bold' : 'normal'
                      }}
                    >
                      {sport}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              <Form>
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold small text-secondary">DATE</Form.Label>
                      <Form.Control
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold small text-secondary">SELECT COURT</Form.Label>
                  <div className="d-flex flex-column gap-2">
                    {filteredCourts.map(court => (
                      <div
                        key={court.id}
                        className={`p-3 border rounded d-flex justify-content-between align-items-center cursor-pointer ${selectedCourt?.id === court.id ? 'border-primary' : ''}`}
                        onClick={() => setSelectedCourt(court)}
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          backgroundColor: selectedCourt?.id === court.id ? 'rgba(13, 110, 253, 0.2)' : 'var(--input-bg)',
                          borderColor: selectedCourt?.id === court.id ? 'var(--accent-neon)' : 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <div>
                          <div className="fw-bold">{court.name}</div>
                          <small className="text-secondary">{court.sportType}</small>
                        </div>
                        <div className="text-primary fw-bold">₹{court.pricePerHour}/hr</div>
                      </div>
                    ))}
                  </div>
                </Form.Group>

                <Row className="mb-4">
                  <Col>
                    <Form.Group>
                      <Form.Label className="fw-bold small text-secondary text-uppercase mb-3">Select Time Slot</Form.Label>
                      
                      {!selectedDate || !selectedCourt ? (
                        <Alert variant="secondary" className="text-center small py-3 opacity-75">
                           Please select a Date and Court to view availability.
                        </Alert>
                      ) : (
                        <>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fw-bold fs-5" style={{ color: 'var(--text-primary)' }}>
                                {startTime && endTime ? `${startTime} - ${endTime}` : 'Select a Slot'}
                            </span>
                            {startTime && endTime && (
                                <Badge bg="info" className="text-dark">
                                    {(parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0]))} Hour Session
                                </Badge>
                            )}
                          </div>

                          <div className="mb-4">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                                {(() => {
                                    // Default to 24 hours (00:00 - 24:00) if not set
                                    const open = venue.openTime ? parseInt(venue.openTime.split(':')[0]) : 0;
                                    const close = venue.closeTime ? parseInt(venue.closeTime.split(':')[0]) : 24;
                                    const totalHours = close - open;

                                    return [...Array(totalHours)].map((_, idx) => {
                                    const hour = idx + open; 
                                    const isBooked = bookedSlots.includes(hour);
                                    
                                    const startH = startTime ? parseInt(startTime.split(':')[0]) : null;
                                    const endH = endTime ? parseInt(endTime.split(':')[0]) : null;
                                    const isSelected = startH !== null && endH !== null && hour >= startH && hour < endH;

                                    return (
                                        <div 
                                            key={hour}
                                            onClick={() => {
                                                if (isBooked) return;

                                                const currentStart = startTime ? parseInt(startTime.split(':')[0]) : null;
                                                // Check for toggle off (Deselect logic)
                                                // If I click the specific hour that is currently the ONLY selected hour, toggle it off.
                                                if (currentStart === hour && parseInt(endTime.split(':')[0]) === hour + 1) {
                                                    setStartTime('');
                                                    setEndTime('');
                                                    return;
                                                }

                                                if (currentStart === null) {
                                                    // No selection? Start new one
                                                    setStartTime(`${hour.toString().padStart(2, '0')}:00`);
                                                    setEndTime(`${(hour + 1).toString().padStart(2, '0')}:00`);
                                                    return;
                                                }

                                                // Logic: 
                                                // 1. If clicking strictly after current Start, try to extend
                                                // 2. If blocked in between, reset.
                                                // 3. If clicking before or same, reset.
                                                
                                                if (hour > currentStart) {
                                                    let blocked = false;
                                                    for (let h = currentStart; h < hour; h++) {
                                                        if (bookedSlots.includes(h)) blocked = true;
                                                    }
                                                    
                                                    if (!blocked) {
                                                        // Extend range
                                                        setEndTime(`${(hour + 1).toString().padStart(2, '0')}:00`);
                                                    } else {
                                                        // Reset to new start because we can't bridge
                                                        setStartTime(`${hour.toString().padStart(2, '0')}:00`);
                                                        setEndTime(`${(hour + 1).toString().padStart(2, '0')}:00`);
                                                    }
                                                } else {
                                                    // Reset (clicking before or same)
                                                    setStartTime(`${hour.toString().padStart(2, '0')}:00`);
                                                    setEndTime(`${(hour + 1).toString().padStart(2, '0')}:00`);
                                                }
                                            }}
                                            className={`d-flex flex-column align-items-center justify-content-center position-relative time-slot ${isSelected ? 'selected' : ''}`}
                                            style={{ 
                                                width: '100%', 
                                                height: '45px', 
                                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                borderRadius: '8px',
                                                background: isBooked 
                                                    ? 'rgba(255, 0, 0, 0.1)' 
                                                    : isSelected 
                                                        ? 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)' 
                                                        : 'var(--input-bg)',
                                                border: isBooked 
                                                    ? '1px solid rgba(255, 77, 77, 0.3)' 
                                                    : isSelected 
                                                        ? 'none' 
                                                        : '1px solid var(--border-color)',
                                                boxShadow: isSelected 
                                                    ? '0 4px 15px rgba(13, 202, 240, 0.4)' 
                                                    : 'none',
                                                transform: isSelected ? 'translateY(-2px)' : 'none',
                                                opacity: isBooked ? 0.6 : 1
                                            }}
                                            title={isBooked ? 'Booked' : `${hour}:00 - ${hour+1}:00`}
                                        >
                                            <span style={{ 
                                                fontSize: '0.75rem', 
                                                fontWeight: isSelected ? '800' : '600',
                                                color: isBooked ? '#ff6b6b' : isSelected ? '#fff' : 'var(--text-primary)'
                                            }}>
                                                {hour}:00 - {hour+1}:00
                                            </span>
                                            {isBooked && <i className="bi bi-x-circle-fill text-danger position-absolute" style={{fontSize: '0.7rem', bottom: '5px', opacity: 0.8}}></i>}
                                            {isSelected && <i className="bi bi-check-circle-fill text-white position-absolute" style={{fontSize: '0.7rem', bottom: '5px', opacity: 0.8}}></i>}
                                        </div>
                                    );
                                    });
                                })()}
                            </div>
                            <div className="d-flex justify-content-center gap-4 mt-4 small text-secondary">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle" style={{width:12, height:12, background:'var(--input-bg)', border:'1px solid var(--border-color)'}}></div>
                                    Available
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle" style={{width:12, height:12, background:'linear-gradient(135deg, #0d6efd, #0dcaf0)'}}></div>
                                    Selected
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle" style={{width:12, height:12, background:'rgba(255,0,0,0.2)', border:'1px solid rgba(255,0,0,0.3)'}}></div>
                                    Booked
                                </div>
                            </div>
                          </div>
                      </>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {selectedCourt && startTime && endTime && (
                  <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded" style={{ background: 'var(--input-bg)', border: '1px solid var(--accent-neon)' }}>
                    <span className="text-secondary">Total Amount</span>
                    <span className="h4 mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
                      ₹{(parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0])) * selectedCourt.pricePerHour}
                    </span>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 fw-bold py-3"
                  onClick={handleBook}
                  style={{ borderRadius: '10px' }}
                  disabled={!startTime || !endTime}
                >
                  Confirm Booking
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VenueDetails;
