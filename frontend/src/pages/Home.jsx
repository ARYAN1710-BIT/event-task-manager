
import { Link } from "react-router-dom";

function Home() {
  const isLoggedIn = !!localStorage.getItem("access_token");

  return (
    <div className="landing-page">
      {/* Landing Navbar */}
      <nav className="landing-navbar">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✦</span> EventFlow
        </Link>

        <div className="landing-nav-links">
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn btn-primary">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="landing-login">
                Login
              </Link>

              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">
            ✨ YOUR PERSONAL PRODUCTIVITY PLATFORM
          </span>

          <h1>
            Plan your events.
            <br />
            <span>Manage your tasks.</span>
            <br />
            Achieve more.
          </h1>

          <p>
            Organize your events, manage tasks, track deadlines,
            and stay productive — all in one simple workspace.
          </p>

          <div className="hero-actions">
            <Link to={isLoggedIn ? "/dashboard" : "/register"} className="btn btn-primary">
              {isLoggedIn ? "Open Dashboard →" : "Get Started →"}
            </Link>

            {!isLoggedIn && (
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            )}
          </div>

          <div className="hero-trust">
            ✓ Easy to use &nbsp; ✓ Organized workflow &nbsp; ✓ Track progress
          </div>
        </div>

        {/* Preview */}
        <div className="hero-preview">
          <div className="preview-window">
            <div className="preview-topbar">
              <div className="preview-dots">
                <span />
                <span />
                <span />
              </div>
              <span>EventFlow Dashboard</span>
            </div>

            <div className="preview-content">
              <h3>Overview</h3>

              <div className="preview-stats">
                <div>
                  <span>Events</span>
                  <strong>08</strong>
                </div>
                <div>
                  <span>Tasks</span>
                  <strong>24</strong>
                </div>
                <div>
                  <span>Completed</span>
                  <strong>16</strong>
                </div>
              </div>

              <h4>Recent Tasks</h4>

              <div className="preview-task">
                <span className="preview-check">✓</span>
                <span>Prepare presentation</span>
                <span className="preview-badge done">Done</span>
              </div>

              <div className="preview-task">
                <span className="preview-check">○</span>
                <span>Submit project report</span>
                <span className="preview-badge pending">Pending</span>
              </div>

              <div className="preview-task">
                <span className="preview-check">○</span>
                <span>Team meeting</span>
                <span className="preview-badge progress">In progress</span>
              </div>

              <div className="preview-progress">
                <div className="preview-progress-header">
                  <span>Weekly Progress</span>
                  <strong>68%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: "68%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="landing-section-heading">
          <span>FEATURES</span>
          <h2>Everything you need to stay organized</h2>
          <p>Simple tools that help you focus on what matters.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon purple">📅</div>
            <h3>Event Management</h3>
            <p>Create, organize, and manage all your events in one place.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">📋</div>
            <h3>Task Management</h3>
            <p>Break your work into tasks and manage them efficiently.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon orange">🎯</div>
            <h3>Priority Tracking</h3>
            <p>Identify high-priority tasks and focus on important work.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon green">📊</div>
            <h3>Progress Dashboard</h3>
            <p>Monitor your progress and completion statistics.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-how">
        <div className="landing-section-heading">
          <span>HOW IT WORKS</span>
          <h2>Get organized in three simple steps</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">01</span>
            <h3>Create an account</h3>
            <p>Sign up and get your own personal workspace.</p>
          </div>

          <div className="step-card">
            <span className="step-number">02</span>
            <h3>Create your events</h3>
            <p>Organize projects, meetings, and activities.</p>
          </div>

          <div className="step-card">
            <span className="step-number">03</span>
            <h3>Manage your tasks</h3>
            <p>Track deadlines, priorities, and progress.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Ready to get organized?</h2>
        <p>Start managing your events and tasks today.</p>
        <Link to={isLoggedIn ? "/dashboard" : "/register"} className="btn btn-primary">
          {isLoggedIn ? "Go to Dashboard →" : "Create Free Account →"}
        </Link>
      </section>

      <footer className="landing-footer">
        <span>✦ EventFlow</span>
        <p>Organize better. Accomplish more.</p>
      </footer>
    </div>
  );
}

export default Home;
