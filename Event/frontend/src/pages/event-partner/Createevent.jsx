import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import "../../styles/create-event.css";
import { useNavigate } from "react-router-dom";

const Createevent = () => {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [eventType, setEventType] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [price, setPrice] = useState("Free");
  const [contactInfo, setContactInfo] = useState("");
  const [tags, setTags] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const eventTypes = [
    "Meetup",
    "Conference",
    "Workshop",
    "Seminar",
    "Webinar",
    "Networking",
    "Exhibition",
    "Other",
  ];

  useEffect(() => {
    if (!imageFile) {
      setImageURL("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImageURL(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setImageFile(null);
      setFileError("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setFileError("Please select a valid image file.");
      return;
    }
    setFileError("");
    setImageFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setFileError("Please drop a valid image file.");
      return;
    }
    setFileError("");
    setImageFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("eventName", eventName);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("place", place);
    formData.append("eventType", eventType);
    formData.append("organizer", organizer);
    formData.append("image", imageFile);
    formData.append("registrationLink", registrationLink);
    formData.append("price", price);
    formData.append("contactInfo", contactInfo);

    // Convert comma-separated tags to array
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    formData.append("tags", JSON.stringify(tagsArray));

    try {
      const response = await axios.post(
        "http://localhost:3000/api/event",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  const isDisabled = useMemo(
    () =>
      !eventName.trim() ||
      !date ||
      !time ||
      !place.trim() ||
      !eventType ||
      !organizer.trim() ||
      !imageFile,
    [eventName, date, time, place, eventType, organizer, imageFile]
  );

  return (
    <div className="create-event-page">
      <div className="create-event-card">
        <header className="create-event-header">
          <h1 className="create-event-title">Create Event</h1>
          <p className="create-event-subtitle">
            Fill in the details to create your event.
          </p>
        </header>

        <form className="create-event-form" onSubmit={onSubmit}>
          {/* Event Image Upload */}
          <div className="field-group">
            <label htmlFor="eventImage">Event Banner Image *</label>
            <input
              id="eventImage"
              ref={fileInputRef}
              className="file-input-hidden"
              type="file"
              accept="image/*"
              onChange={onFileChange}
            />

            <div
              className="file-dropzone"
              role="button"
              tabIndex={0}
              onClick={openFileDialog}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFileDialog();
                }
              }}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <div className="file-dropzone-inner">
                <svg
                  className="file-icon"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                    fill="currentColor"
                  />
                </svg>
                <div className="file-dropzone-text">
                  <strong>Tap to upload</strong> or drag and drop
                </div>
                <div className="file-hint">PNG, JPG, JPEG • Up to 10MB</div>
              </div>
            </div>

            {fileError && (
              <p className="error-text" role="alert">
                {fileError}
              </p>
            )}

            {imageFile && (
              <div className="file-chip" aria-live="polite">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2z" />
                </svg>
                <span className="file-chip-name">{imageFile.name}</span>
                <span className="file-chip-size">
                  {(imageFile.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <div className="file-chip-actions">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={openFileDialog}
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    className="btn-ghost danger"
                    onClick={() => {
                      setImageFile(null);
                      setFileError("");
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {imageURL && (
            <div className="video-preview">
              <img
                className="video-preview-el"
                src={imageURL}
                alt="Event preview"
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            </div>
          )}

          {/* Event Name */}
          <div className="field-group">
            <label htmlFor="eventName">Event Name *</label>
            <input
              id="eventName"
              type="text"
              placeholder="e.g., Tech Meetup 2025"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="field-group">
            <label htmlFor="eventDesc">Description</label>
            <textarea
              id="eventDesc"
              rows={4}
              placeholder="Describe your event, what attendees can expect..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Date and Time Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="field-group">
              <label htmlFor="eventDate">Date *</label>
              <input
                id="eventDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="eventTime">Time *</label>
              <input
                id="eventTime"
                type="text"
                placeholder="e.g., 10:00 AM - 4:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Place */}
          <div className="field-group">
            <label htmlFor="eventPlace">Venue/Place *</label>
            <input
              id="eventPlace"
              type="text"
              placeholder="e.g., Innovation Hub, Downtown"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
            />
          </div>

          {/* Event Type and Organizer Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="field-group">
              <label htmlFor="eventType">Event Type *</label>
              <select
                id="eventType"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              >
                <option value="">Select type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="eventOrganizer">Organizer *</label>
              <input
                id="eventOrganizer"
                type="text"
                placeholder="e.g., Tech Community"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Registration Link */}
          <div className="field-group">
            <label htmlFor="registrationLink">Registration Link</label>
            <input
              id="registrationLink"
              type="url"
              placeholder="https://example.com/register"
              value={registrationLink}
              onChange={(e) => setRegistrationLink(e.target.value)}
            />
          </div>

          {/* Price and Contact Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="field-group">
              <label htmlFor="eventPrice">Price</label>
              <input
                id="eventPrice"
                type="text"
                placeholder="e.g., Free or $50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label htmlFor="contactInfo">Contact Info</label>
              <input
                id="contactInfo"
                type="text"
                placeholder="e.g., info@example.com"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="field-group">
            <label htmlFor="eventTags">Tags</label>
            <input
              id="eventTags"
              type="text"
              placeholder="Separate tags with commas: Technology, Networking, Workshop"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <small style={{ color: "#666", fontSize: "0.875rem" }}>
              Separate multiple tags with commas
            </small>
          </div>

          <div className="form-actions">
            <button className="btn-primary" type="submit" disabled={isDisabled}>
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Createevent;
