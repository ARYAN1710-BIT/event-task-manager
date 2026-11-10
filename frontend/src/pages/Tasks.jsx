
import { useEffect, useState } from "react";
import api from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const initialForm = {
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    deadline: "",
    event_id: "",
  };

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [taskResponse, eventResponse] = await Promise.all([
        api.get("/tasks"),
        api.get("/events"),
      ]);

      setTasks(taskResponse.data);
      setEvents(eventResponse.data);
    } catch (err) {
      setError("Unable to load tasks or events.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const payload = {
        ...form,
        event_id: Number(form.event_id),
        deadline: form.deadline || null,
      };

      await api.post("/tasks", payload);
      setForm(initialForm);
      fetchData();
    } catch (err) {
      setFormError(
        err.response?.data?.detail || "Unable to create task."
      );
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      deadline: task.deadline || "",
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
      await api.put(`/tasks/${id}`, {
        ...editForm,
        deadline: editForm.deadline || null,
      });

      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to update task."
      );
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status,
        priority: task.priority,
        deadline: task.deadline || null,
      });

      fetchData();
    } catch (err) {
      setError("Unable to update task status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);
      fetchData();
    } catch (err) {
      setError("Unable to delete task.");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      !statusFilter || task.status === statusFilter;

    const matchesPriority =
      !priorityFilter || task.priority === priorityFilter;

    const matchesEvent =
      !eventFilter || String(task.event_id) === eventFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesEvent
    );
  });

  const getEventTitle = (eventId) => {
    return events.find((event) => event.id === eventId)?.title || "Event";
  };

  return (
    <>

      <main className="page-container">
        <div className="page-header">
          <h1>My Tasks</h1>
          <p>Organize your work and track your progress.</p>
        </div>

        {/* Create Task */}
        <div className="form-container">
          <h2>Create New Task</h2>

          {formError && (
            <div className="error-message">{formError}</div>
          )}

          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Task Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Task description"
                rows="3"
              />
            </div>

            <div className="task-form-grid">
              <div className="form-group">
                <label>Event</label>
                <select
                  name="event_id"
                  value={form.event_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="btn btn-primary" type="submit">
              + Create Task
            </button>
          </form>
        </div>

        {/* Search and Filters */}
        <div className="task-filter-panel">
          <input
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
          >
            <option value="">All Events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>

          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setPriorityFilter("");
              setEventFilter("");
            }}
          >
            Clear
          </button>
        </div>

        {/* Task List */}
        <div className="page-header task-list-header">
          <h2>Tasks ({filteredTasks.length})</h2>
        </div>

        {loading && <p>Loading tasks...</p>}
        {error && <div className="error-message">{error}</div>}

        {!loading && filteredTasks.length === 0 && (
          <div className="card empty-state">
            <div className="empty-icon">📋</div>
            <h3>No tasks found</h3>
            <p>Create a task or change your filters.</p>
          </div>
        )}

        <div className="list-grid">
          {filteredTasks.map((task) => (
            <div className="list-item task-card" key={task.id}>
              {editingId === task.id ? (
                <>
                  <h3>Edit Task</h3>

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
                    <label>Status</label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={editForm.priority}
                      onChange={handleEditChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Deadline</label>
                    <input
                      type="date"
                      name="deadline"
                      value={editForm.deadline}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleUpdate(task.id)}
                    >
                      Save
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
                  <div className="task-badges">
                    <span className={`badge-status status-${task.status}`}>
                      {task.status.replace("_", " ")}
                    </span>

                    <span className={`badge-priority priority-${task.priority}`}>
                      {task.priority} priority
                    </span>
                  </div>

                  <h3>{task.title}</h3>

                  <p>
                    {task.description || "No description provided."}
                  </p>

                  <div className="task-meta">
                    <span>📅 {getEventTitle(task.event_id)}</span>
                    <span>⏰ {task.deadline || "No deadline"}</span>
                  </div>

                  <div className="form-group quick-status">
                    <label>Change Status</label>
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => startEdit(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(task.id)}
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

export default Tasks;
