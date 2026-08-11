import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jobsApi } from "../api/jobsApi";
import { conversationsApi } from "@/features/messaging/api/conversationsApi";
import { AuthContext } from "@/features/auth/AuthContext";
import toast from "react-hot-toast";
import JobDetailsSkeleton from "../components/JobDetailsSkeleton";
import Avatar from "@/shared/components/Avatar";
import {
  IconArrowLeft,
  IconMapPin,
  IconRupee,
  IconClock,
  IconCalendar,
  IconAlertCircle,
  IconCheckCircle,
  IconMessageSquare,
} from "@/shared/components/icons";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const fetchJob = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await jobsApi.getById(id);
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
      await jobsApi.apply(id);

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

  const handleMessageRecruiter = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setMessaging(true);
      const res = await conversationsApi.getOrCreate(id);
      navigate(`/messages/${res.data.conversation._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't start the conversation");
    } finally {
      setMessaging(false);
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
          <div style={{ flex: 1 }}>
            <h1 className="job-detail__title">{job.title}</h1>
            <p className="job-detail__company-row">
              {job.company} • <IconMapPin width={15} height={15} /> {job.location}
            </p>
            {job.createdBy?.name && (
              <div className="job-detail__poster">
                <Avatar user={job.createdBy} size={24} />
                <Link to={`/users/${job.createdBy._id}`} className="job-detail__poster-name">
                  Posted by {job.createdBy.name}
                </Link>
              </div>
            )}
          </div>

          {(!user || user.role !== "admin") && (
            <button
              type="button"
              className="btn btn--secondary btn--icon"
              onClick={handleMessageRecruiter}
              disabled={messaging}
              aria-label="Message the recruiter about this job"
              title="Message the recruiter"
            >
              <IconMessageSquare />
            </button>
          )}
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
