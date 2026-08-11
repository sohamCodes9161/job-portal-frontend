import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { conversationsApi } from "../api/conversationsApi";
import { AuthContext } from "@/features/auth/AuthContext";
import MessageThread from "../components/MessageThread";
import Avatar from "@/shared/components/Avatar";
import { IconArrowLeft, IconMapPin } from "@/shared/components/icons";

const ThreadPage = ({ variant = "candidate" }) => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const isRecruiter = variant === "recruiter";
  const basePath = isRecruiter ? "/admin/messages" : "/messages";

  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await conversationsApi.getById(id);
        setConversation(res.data.conversation);
      } catch {
        // Header just falls back to a generic title — the thread itself
        // still works fine since it only needs the conversation id.
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="application-detail-page">
      <Link to={basePath} className="breadcrumb-back">
        <IconArrowLeft /> Back to messages
      </Link>

      <div className="card application-detail-header">
        {loading ? (
          <div className="skeleton-title" style={{ width: "50%" }} />
        ) : conversation ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar user={isRecruiter ? conversation.candidate : conversation.recruiter} size={44} />
            <div>
              <h1 className="page-header__title" style={{ fontSize: 20 }}>
                {isRecruiter ? conversation.candidate?.name : conversation.job?.title}
              </h1>
              <p className="application-detail-header__meta">
                {isRecruiter ? (
                  conversation.candidate?.email
                ) : (
                  <>
                    {conversation.job?.company}
                    {conversation.job?.location && (
                      <>
                        {" "}
                        · <IconMapPin width={14} height={14} style={{ display: "inline", verticalAlign: -2 }} />{" "}
                        {conversation.job.location}
                      </>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        ) : (
          <h1 className="page-header__title" style={{ fontSize: 20 }}>Conversation</h1>
        )}
      </div>

      <div className="card message-thread-card">
        <MessageThread conversationId={id} currentUserId={user?.id} />
      </div>
    </div>
  );
};

export default ThreadPage;
