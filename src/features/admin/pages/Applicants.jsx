import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { adminApi } from "../api/adminApi";
import { toast } from "react-hot-toast";
import Loader from "@/shared/components/Loader";
import EmptyState from "@/shared/components/EmptyState";
import Avatar from "@/shared/components/Avatar";
import {
  IconArrowLeft,
  IconFileText,
  IconInbox,
  IconCheck,
  IconX,
} from "@/shared/components/icons";

const Applicants = () => {
  const { id } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = async () => {
    try {
      const res = await adminApi.getApplicants(id);
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
      await adminApi.updateApplicationStatus(applicationId, status);

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
              <div className="application-card__info application-card__info--with-avatar">
                <Avatar user={app.user} size={40} />
                <div>
                  <h3>{app.user?.name}</h3>
                  <p>{app.user?.email}</p>
                </div>
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
