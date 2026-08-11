import { useContext, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { adminApi } from "../api/adminApi";
import { AuthContext } from "@/features/auth/AuthContext";
import { toast } from "react-hot-toast";
import MessageThread from "@/features/applications/components/MessageThread";
import {
  IconArrowLeft,
  IconFileText,
  IconCheck,
  IconX,
} from "@/shared/components/icons";

const AdminApplicationDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Passed in from the Applicants list so we don't need a dedicated
  // "get single application" endpoint just for this header.
  const [application, setApplication] = useState(location.state?.application || null);
  const jobId = location.state?.jobId;
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      await adminApi.updateApplicationStatus(id, status);
      setApplication((prev) => (prev ? { ...prev, status } : prev));
      toast.success(`Application ${status}`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="application-detail-page">
      <Link to={jobId ? `/admin/jobs/${jobId}/applicants` : "/admin/jobs"} className="breadcrumb-back">
        <IconArrowLeft /> Back to applicants
      </Link>

      <div className="card application-detail-header">
        {application ? (
          <>
            <div>
              <h1 className="page-header__title" style={{ fontSize: 20 }}>
                {application.user?.name}
              </h1>
              <p className="application-detail-header__meta">{application.user?.email}</p>
            </div>

            <div className="application-detail-header__actions">
              <span className={`badge badge--${application.status}`}>{application.status}</span>

              {application.user?.resume?.url && (
                <a
                  href={`https://docs.google.com/gview?url=${application.user.resume.url}&embedded=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary btn--sm"
                >
                  <IconFileText width={15} height={15} /> Resume
                </a>
              )}

              {application.status === "pending" && (
                <>
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={() => updateStatus("accepted")}
                    disabled={updating}
                  >
                    <IconCheck /> Accept
                  </button>
                  <button
                    className="btn btn--danger-ghost btn--sm"
                    onClick={() => updateStatus("rejected")}
                    disabled={updating}
                  >
                    <IconX /> Reject
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <h1 className="page-header__title" style={{ fontSize: 20 }}>Conversation</h1>
        )}
      </div>

      <div className="card message-thread-card">
        <MessageThread applicationId={id} currentUserId={user?.id} />
      </div>
    </div>
  );
};

export default AdminApplicationDetail;
