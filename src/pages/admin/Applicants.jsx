import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import {
  IconArrowLeft,
  IconFileText,
  IconInbox,
  IconCheck,
  IconX,
} from "../../components/icons";

const Applicants = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = async () => {
    try {
      const res = await API.get(`/jobs/${id}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplicants(res.data.applications || []);
    } catch (err) {
      console.log(err.response);
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);
      await API.put(
        `/jobs/${applicationId}/update`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplicants((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status } : app))
      );
      toast.success(`Application ${status}`);
    } catch (err) {
      console.log(err.response);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader label="Loading applicants..." />;

  return (
    <div>
      <Link to="/admin/jobs" className="breadcrumb-back">
        <IconArrowLeft /> Back to manage jobs
      </Link>

      <div className="page-header">
        <div>
          <h1 className="page-header__title">Applicants</h1>
          <p className="page-header__subtitle">
            {applicants.length} applicant{applicants.length !== 1 && "s"} for this job
          </p>
        </div>
      </div>

      <div className="applications-list">
        {applicants.length === 0 ? (
          <EmptyState
            icon={<IconInbox />}
            title="No applicants yet"
            description="Check back later once candidates start applying."
          />
        ) : (
          applicants.map((app) => (
            <div key={app._id} className="application-card">
              <div className="application-card__info">
                <h3>{app.user?.name}</h3>
                <p>{app.user?.email}</p>
              </div>

              <div className="application-card__meta">
                <span className={`badge badge--${app.status}`}>{app.status}</span>

                {app.user?.resume?.url && (
                  <a
                    href={`https://docs.google.com/gview?url=${app.user.resume.url}&embedded=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--secondary btn--sm"
                  >
                    <IconFileText width={15} height={15} /> Resume
                  </a>
                )}

                {app.status === "pending" && (
                  <>
                    <button
                      className="btn btn--primary btn--sm"
                      onClick={() => updateStatus(app._id, "accepted")}
                      disabled={updatingId === app._id}
                    >
                      <IconCheck /> Accept
                    </button>
                    <button
                      className="btn btn--danger-ghost btn--sm"
                      onClick={() => updateStatus(app._id, "rejected")}
                      disabled={updatingId === app._id}
                    >
                      <IconX /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Applicants;
