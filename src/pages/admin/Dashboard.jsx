import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import { IconBriefcase, IconUsers, IconInbox, IconPlus } from "../../components/icons";

const Dashboard = () => {
  const { token } = useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get("/jobs/dashboard-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.stats);
    } catch (err) {
      console.log(err.response);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) return <Loader label="Loading dashboard..." />;
  if (!stats) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Admin Dashboard</h1>
          <p className="page-header__subtitle">Overview of your job postings and applicants</p>
        </div>
        <Link to="/admin/jobs/create" className="btn btn--primary">
          <IconPlus /> Post a job
        </Link>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--indigo">
            <IconBriefcase />
          </div>
          <div>
            <div className="stat-card__label">Total Jobs</div>
            <div className="stat-card__value">{stats.totalJobs}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--green">
            <IconUsers />
          </div>
          <div>
            <div className="stat-card__label">Total Applicants</div>
            <div className="stat-card__value">{stats.totalApplicants}</div>
          </div>
        </div>
      </div>

      <div className="card section-card">
        <h2 className="section-card__title">Recent jobs</h2>

        {stats.recentJobs.length === 0 ? (
          <EmptyState
            icon={<IconInbox />}
            title="No jobs posted yet"
            description="Create your first job listing to see it here."
          />
        ) : (
          stats.recentJobs.map((job) => (
            <div key={job._id} className="job-row">
              <div>
                <h4>{job.title}</h4>
                <p>{job.company}</p>
              </div>
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
