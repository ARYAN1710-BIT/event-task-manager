
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsResponse, tasksResponse] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/tasks"),
        ]);

        setStats(statsResponse.data);
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error("Dashboard loading failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (!stats) return <div className="dashboard-loading">Unable to load dashboard.</div>;

  const completion = stats.completion_percentage || 0;

  const statCards = [
    { title: "Total Events", value: stats.total_events, icon: "📅", color: "blue" },
    { title: "Total Tasks", value: stats.total_tasks, icon: "📋", color: "purple" },
    { title: "Pending Tasks", value: stats.pending_tasks, icon: "⏳", color: "orange" },
    { title: "In Progress", value: stats.in_progress_tasks, icon: "🚀", color: "cyan" },
    { title: "Completed Tasks", value: stats.completed_tasks, icon: "✅", color: "green" },
    { title: "High Priority", value: stats.high_priority_tasks, icon: "🔥", color: "red" },
  ];

  return (
    <main className="dashboard-page">

      <div className="dashboard-heading">
        <div>
          <span className="dashboard-eyebrow">OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your productivity summary.</p>
        </div>

        <Link to="/tasks" className="dashboard-primary-btn">
          + New Task
        </Link>
      </div>

      {/* Statistics */}
      <section className="dashboard-stats">
        {statCards.map((item) => (
          <div className="dashboard-stat" key={item.title}>
            <div className={`dashboard-stat-icon ${item.color}`}>
              {item.icon}
            </div>

            <div>
              <p>{item.title}</p>
              <h2>{item.value ?? 0}</h2>
            </div>
          </div>
        ))}
      </section>

      {/* Main Dashboard Content */}
      <section className="dashboard-content-grid">

        {/* Productivity */}
        <div className="dashboard-panel productivity-panel">
          <div className="panel-heading">
            <div>
              <h2>Productivity Overview</h2>
              <p>Your task completion progress</p>
            </div>
            <span className="panel-icon">📈</span>
          </div>

          <div className="completion-number">{completion}%</div>

          <div className="dashboard-progress-track">
            <div
              className="dashboard-progress-fill"
              style={{ width: `${Math.min(completion, 100)}%` }}
            />
          </div>

          <div className="progress-caption">
            <span>{stats.completed_tasks || 0} completed</span>
            <span>{stats.total_tasks || 0} total tasks</span>
          </div>

          <div className="productivity-message">
            {completion === 100 && stats.total_tasks > 0
              ? "🎉 All tasks completed!"
              : "Keep going! Every task completed is progress."}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Jump directly to what you need</p>
            </div>
            <span className="panel-icon">⚡</span>
          </div>

          <div className="dashboard-actions">
            <Link to="/events" className="dashboard-action">
              <span className="action-icon purple">📅</span>
              <span>
                <strong>Manage Events</strong>
                <small>Create and organize events</small>
              </span>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/tasks" className="dashboard-action">
              <span className="action-icon blue">📝</span>
              <span>
                <strong>Manage Tasks</strong>
                <small>Track your daily work</small>
              </span>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/profile" className="dashboard-action">
              <span className="action-icon orange">👤</span>
              <span>
                <strong>My Profile</strong>
                <small>View account information</small>
              </span>
              <span className="action-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Tasks */}
      <section className="dashboard-panel recent-tasks-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent Tasks</h2>
            <p>Your latest tasks at a glance</p>
          </div>
          <Link to="/tasks" className="view-all-link">View All →</Link>
        </div>

        {tasks.length === 0 ? (
          <div className="dashboard-empty">
            <span>📝</span>
            <p>No tasks yet. Create your first task!</p>
            <Link to="/tasks">Get Started →</Link>
          </div>
        ) : (
          <div className="recent-task-list">
            {tasks.slice(0, 5).map((task) => (
              <div className="recent-task-item" key={task.id}>
                <div className="recent-task-title">
                  <span className="task-dot" />
                  <strong>{task.title}</strong>
                </div>

                <span className={`recent-task-status ${task.status}`}>
                  {task.status?.replace("_", " ")}
                </span>

                <span className={`recent-task-priority ${task.priority}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}

export default Dashboard;
