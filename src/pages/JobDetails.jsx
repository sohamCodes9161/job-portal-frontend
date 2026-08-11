import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import JobDetailsSkeleton from "../components/JobDetailsSkeleton";
import {
  IconArrowLeft,
  IconMapPin,
  IconRupee,
  IconClock,
  IconCalendar,
  IconAlertCircle,
  IconCheckCircle,
} from "../components/icons";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const fetchJob = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await API.get(`/jobs/${id}`);
      setJob(res.data.job || res.data);
    } catch (err) {
      console.log(err);
      setError("We couldn't load this job. It may have been removed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setApplying(true);
      await API.post(
        `/jobs/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplied(true);
      setMessageType("success");
      setMessage("Application submitted successfully!");
    } catch (err) {
      console.log(err);
      setMessageType("error");
      setMessage(err.response?.data?.message || "Application failed. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <JobDetailsSkeleton />;

  if (error) {
    return (
      <div className="job-detail-page">
        <div className="alert alert--error">
          <IconAlertCircle />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="job-detail-page">
      <Link to="/" className="breadcrumb-back">
        <IconArrowLeft /> Back to jobs
      </Link>

      <div className="card job-detail-card">
        <div className="job-detail__header">
          <div className="job-detail__logo" aria-hidden="true">
            {job.company?.[0]?.toUpperCase() || "J"}
          </div>
          <div>
            <h1 className="job-detail__title">{job.title}</h1>
            <p className="job-detail__company-row">
              {job.company} • <IconMapPin width={15} height={15} /> {job.location}
            </p>
          </div>
        </div>

        <div className="job-detail__stats">
          <div className="job-detail__stat">
            <IconRupee />
            <div>
              <div className="job-detail__stat-label">Salary</div>
              <div className="job-detail__stat-value">
                {job.salary ? `₹${job.salary}` : "Not disclosed"}
              </div>
            </div>
          </div>

          <div className="job-detail__stat">
            <IconClock />
            <div>
              <div className="job-detail__stat-label">Job type</div>
              <div className="job-detail__stat-value">{job.jobType || "—"}</div>
            </div>
          </div>

          <div className="job-detail__stat">
            <IconCalendar />
            <div>
              <div className="job-detail__stat-label">Posted</div>
              <div className="job-detail__stat-value">
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="job-section">
          <h2>Job description</h2>
          <p>{job.description}</p>
        </div>

        {message && (
          <div className={`alert alert--${messageType} mb-4`}>
            {messageType === "success" ? <IconCheckCircle /> : <IconAlertCircle />}
            <span>{message}</span>
          </div>
        )}

        <div className="job-detail__apply-bar">
          <button
            className="btn btn--primary btn--lg"
            onClick={handleApply}
            disabled={applied || applying}
          >
            {applying ? "Submitting..." : applied ? "Already applied" : "Apply now"}
          </button>
          {!user && <span className="text-muted">You'll need to log in first.</span>}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
