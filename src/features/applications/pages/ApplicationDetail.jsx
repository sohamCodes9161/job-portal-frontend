import { useContext } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { AuthContext } from "@/features/auth/AuthContext";
import MessageThread from "../components/MessageThread";
import { IconArrowLeft, IconMapPin } from "@/shared/components/icons";

const ApplicationDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Passed in from the Applications list — avoids a second network round trip
  // since that list already has the job populated on each application.
  const application = location.state?.application;

  return (
    <div className="application-detail-page">
      <Link to="/applications" className="breadcrumb-back">
        <IconArrowLeft /> Back to applications
      </Link>

      <div className="card application-detail-header">
        {application ? (
          <>
            <div>
              <h1 className="page-header__title" style={{ fontSize: 20 }}>
                {application.job?.title}
              </h1>
              <p className="application-detail-header__meta">
                {application.job?.company}
                {application.job?.location && (
                  <>
                    {" "}
                    · <IconMapPin width={14} height={14} style={{ display: "inline", verticalAlign: -2 }} />{" "}
                    {application.job.location}
                  </>
                )}
              </p>
            </div>
            <span className={`badge badge--${application.status}`}>{application.status}</span>
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

export default ApplicationDetail;
