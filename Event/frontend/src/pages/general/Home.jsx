import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/event-home.css";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    checkAuth();
    fetchEvents();
  }, []);

  const checkAuth = async () => {
    try {
      // Try to get current user/partner info
      const response = await axios.get("http://localhost:3000/api/auth/me", {
        withCredentials: true,
      });
      if (response.data) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
    }
  };

  const fetchEvents = () => {
    axios
      .get("http://localhost:3000/api/event", { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        setEvents(response.data.eventItems);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  async function participateEvent(item) {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/event/participate",
        { eventId: item._id },
        { withCredentials: true }
      );
      if (response.data.participate) {
        console.log("Joined event");
        setEvents((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? {
                  ...v,
                  participantCount: (v.participantCount || 0) + 1,
                  isParticipating: true,
                }
              : v
          )
        );
      } else {
        console.log("Left event");
        setEvents((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? {
                  ...v,
                  participantCount: (v.participantCount || 0) - 1,
                  isParticipating: false,
                }
              : v
          )
        );
      }
    } catch (error) {
      console.error("Error participating in event:", error);
    }
  }

  async function saveEvent(item) {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/event/save",
        { eventId: item._id },
        { withCredentials: true }
      );
      if (response.data.save) {
        setEvents((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? { ...v, savesCount: v.savesCount + 1, isSaved: true }
              : v
          )
        );
      } else {
        setEvents((prev) =>
          prev.map((v) =>
            v._id === item._id
              ? { ...v, savesCount: v.savesCount - 1, isSaved: false }
              : v
          )
        );
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  }

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === "upcoming") return eventDate >= today;
    if (filter === "past") return eventDate < today;
    return true;
  });

  return (
    <div className="event-home">
      {/* Navigation Bar */}
      <nav className="event-navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h1>EventHub</h1>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link active">
              Events
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/saved" className="nav-link">
                  My Events
                </Link>
                <Link to="/create-event" className="nav-link">
                  Create Event
                </Link>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="nav-link-btn"
                >
                  Login
                </button>
                <Link to="/register" className="nav-link-btn primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div
          className="auth-modal-overlay"
          onClick={() => setShowAuthModal(false)}
        >
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowAuthModal(false)}
            >
              ×
            </button>
            <h2 className="modal-title">Choose Account Type</h2>
            <p className="modal-subtitle">How would you like to continue?</p>

            <div className="auth-options">
              <div className="auth-option-card">
                <div className="option-icon">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3>User</h3>
                <p>Browse and participate in events</p>
                <div className="option-buttons">
                  <Link to="/user/login" className="option-btn">
                    Login
                  </Link>
                  <Link to="/user/register" className="option-btn outline">
                    Register
                  </Link>
                </div>
              </div>

              <div className="auth-option-card">
                <div className="option-icon partner">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <h3>Event Partner</h3>
                <p>Create and manage your events</p>
                <div className="option-buttons">
                  <Link to="/event-partner/login" className="option-btn">
                    Login
                  </Link>
                  <Link
                    to="/event-partner/register"
                    className="option-btn outline"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Amazing Events</h1>
          <p className="hero-subtitle">
            Connect, learn, and grow with events happening around you
          </p>
          {isAuthenticated ? (
            <Link to="/create-event" className="hero-cta">
              Create Your Event
            </Link>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="hero-cta">
              Get Started
            </button>
          )}
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Events
            </button>
            <button
              className={`filter-btn ${filter === "upcoming" ? "active" : ""}`}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`filter-btn ${filter === "past" ? "active" : ""}`}
              onClick={() => setFilter("past")}
            >
              Past Events
            </button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="events-section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="empty-state">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h3>No events found</h3>
              <p>Be the first to create an event!</p>
              {isAuthenticated ? (
                <Link to="/create-event" className="btn-primary">
                  Create Event
                </Link>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-primary"
                >
                  Get Started
                </button>
              )}
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <div key={event._id} className="event-card">
                  <div className="event-image">
                    <img src={event.image} alt={event.eventName} />
                    {event.tags && event.tags.length > 0 && (
                      <div className="event-tags">
                        {event.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="event-content">
                    <div className="event-header">
                      <h3 className="event-title">{event.eventName}</h3>
                      <span className="event-type">{event.eventType}</span>
                    </div>

                    <p className="event-description">
                      {event.description?.substring(0, 100)}
                      {event.description?.length > 100 ? "..." : ""}
                    </p>

                    <div className="event-details">
                      <div className="detail-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="detail-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{event.time}</span>
                      </div>

                      <div className="detail-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{event.place}</span>
                      </div>
                    </div>

                    <div className="event-footer">
                      <div className="event-meta">
                        <span className="organizer">by {event.organizer}</span>
                        <span className="price">{event.price}</span>
                      </div>

                      <div className="event-actions">
                        <button
                          className={`action-btn ${
                            event.isSaved ? "active" : ""
                          }`}
                          onClick={() => saveEvent(event)}
                          title="Save event"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={event.isSaved ? "currentColor" : "none"}
                            stroke="currentColor"
                          >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                          </svg>
                          <span>{event.savesCount || 0}</span>
                        </button>

                        <button
                          className={`participate-btn ${
                            event.isParticipating ? "active" : ""
                          }`}
                          onClick={() => participateEvent(event)}
                        >
                          {event.isParticipating
                            ? "Registered"
                            : "Register Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
