
import { useEffect, useState } from "react";
import api from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    event_date: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (err) {
      setError("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      await api.post("/events", form);

      setForm({
        title: "",
        description: "",
        event_date: "",
      });

      fetchEvents();
    } catch (err) {
      setFormError(
        err.response?.data?.detail || "Unable to create event."
      );
    }
  };

  const startEdit = (event) => {
    setEditingId(event.id);

    setEditForm({
      title: event.title,
      description: event.description || "",
      event_date: event.event_date || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/events/${id}`, editForm);
      setEditingId(null);
      fetchEvents();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to update event."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to delete event."
      );
    }
  };

  return (
    <>
      

      <main className="page-container">
        <div className="page-header">
          <h1>My Events</h1>
          <p>Create and manage your events in one place.</p>
        </div>

        {/* Create Event */}
        <div className="form-container">
          <h2>Create New Event</h2>

          {formError && (
            <div className="error-message">{formError}</div>
          )}

          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Event Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your event"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Event Date</label>
              <input
                type="date"
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit">
              + Create Event
            </button>
          </form>
        </div>

        {/* Event List */}
        <div className="page-header">
          <h2>Your Events ({events.length})</h2>
        </div>

        {loading && <p>Loading events...</p>}
        {error && <div className="error-message">{error}</div>}

        {!loading && events.length === 0 && (
          <div className="card empty-state">
            <div className="empty-icon">📅</div>
            <h3>No events yet</h3>
            <p>Create your first event using the form above.</p>
          </div>
        )}

        <div className="list-grid">
          {events.map((event) => (
            <div className="list-item event-card" key={event.id}>
              {editingId === event.id ? (
                <>
                  <h3>Edit Event</h3>

                  <div className="form-group">
                    <label>Title</label>
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      name="event_date"
                      value={editForm.event_date}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleUpdate(event.id)}
                    >
                      Save Changes
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="event-card-header">
                    <span className="event-icon">📅</span>
                    <span className="event-date">
                      {event.event_date}
                    </span>
                  </div>

                  <h3>{event.title}</h3>

                  <p>
                    {event.description || "No description provided."}
                  </p>

                  <div className="actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => startEdit(event)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Events;
