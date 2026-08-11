import { useEffect, useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconUsers,
  IconInbox,
  IconAlertCircle,
} from "../../components/icons";

const AdminJobs = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs/my-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.log(err.response);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = async (id) => {
    try {
      setDeleting(true);
      await API.delete(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs((prev) => prev.filter((job) => job._id !== id));
      toast.success("Job deleted successfully");
    } catch (err) {
      console.log(err.response);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
      setSelectedJob(null);
    }
  };

  if (loading) return <Loader label="Loading jobs..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Manage Jobs</h1>
          <p className="page-header__subtitle">Edit, remove, or review applicants for your listings</p>
        </div>
        <Link to="/admin/jobs/create" className="btn btn--primary">
          <IconPlus /> Post a job
        </Link>
      </div>

      {error && (
        <div className="alert alert--error mb-4">
          <IconAlertCircle />
          <span>{error}</span>
        </div>
      )}

      <div className="applications-list">
        {jobs.length === 0 ? (
          <EmptyState
            icon={<IconInbox />}
            title="No jobs yet"
            description="Create your first job listing to start receiving applicants."
            action={
              <Link to="/admin/jobs/create" className="btn btn--primary btn--sm">
                Post a job
              </Link>
            }
          />
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="admin-job-card">
              <div className="admin-job-card__top">
                <div>
                  <h3 className="admin-job-card__title">{job.title}</h3>
                  <div className="admin-job-card__meta">
                    <span>{job.company}</span>
                    <span>{job.location}</span>
                    {job.salary && <span>₹{job.salary}</span>}
                  </div>
                </div>
                {job.jobType && (
                  <span className="badge badge--neutral">{job.jobType.replace("-", " ")}</span>
                )}
              </div>

              <div className="admin-job-card__footer">
                <span className="text-muted" style={{ fontSize: 12.5 }}>
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>

                <div className="admin-job-card__actions">
                  <button
                    className="btn btn--secondary btn--sm"
                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                  >
                    <IconUsers width={15} height={15} /> Applicants
                  </button>

                  <button
                    className="btn btn--secondary btn--sm"
                    onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                  >
                    <IconEdit /> Edit
                  </button>

                  <button
                    className="btn btn--danger-ghost btn--sm"
                    onClick={() => setSelectedJob(job)}
                  >
                    <IconTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedJob && (
        <div className="modal-overlay" onClick={() => !deleting && setSelectedJob(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modal__icon">
              <IconTrash />
            </div>
            <h3>Delete this job?</h3>
            <p>
              Are you sure you want to delete <strong>{selectedJob.title}</strong>? This
              action can't be undone and will remove all associated applications.
            </p>

            <div className="modal-actions">
              <button
                className="btn btn--secondary"
                onClick={() => setSelectedJob(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn--danger"
                onClick={() => handleDelete(selectedJob._id)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
