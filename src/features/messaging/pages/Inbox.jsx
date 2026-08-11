import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { conversationsApi } from "../api/conversationsApi";
import EmptyState from "@/shared/components/EmptyState";
import Loader from "@/shared/components/Loader";
import Avatar from "@/shared/components/Avatar";
import { IconInbox, IconAlertCircle } from "@/shared/components/icons";

/**
 * variant: "candidate" | "recruiter"
 * Controls the base route, empty-state copy, and which side of the
 * conversation is shown as the row's main heading.
 */
const Inbox = ({ variant = "candidate" }) => {
  const isRecruiter = variant === "recruiter";
  const basePath = isRecruiter ? "/admin/messages" : "/messages";

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const res = await conversationsApi.getMine();
        setConversations(res.data.conversations || []);
      } catch {
        setError("Couldn't load your messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader label="Loading messages..." />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Messages</h1>
          <p className="page-header__subtitle">
            {isRecruiter
              ? "Conversations with candidates across your job postings"
              : "Conversations with recruiters about jobs you're interested in"}
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert--error mb-4">
          <IconAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {conversations.length === 0 ? (
        <EmptyState
          icon={<IconInbox />}
          title="No conversations yet"
          description={
            isRecruiter
              ? "Messages from candidates about your job postings will show up here."
              : "Tap the message icon on a job's page to start a conversation with the recruiter."
          }
        />
      ) : (
        <div className="inbox-list">
          {conversations.map((c) => {
            const heading = isRecruiter ? c.candidate?.name : c.job?.title;
            const subheading = isRecruiter ? c.job?.title : c.job?.company;
            const avatarUser = isRecruiter ? c.candidate : c.recruiter;

            return (
              <Link key={c._id} to={`${basePath}/${c._id}`} className="inbox-item">
                <Avatar user={avatarUser} size={44} linkToProfile={false} />
                <div className="inbox-item__body">
                  <div className="inbox-item__top">
                    <h3>{heading}</h3>
                    <span className="inbox-item__time">
                      {new Date(c.lastMessageAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="inbox-item__preview">
                    {c.lastMessagePreview || "No messages yet — say hi!"}
                  </p>
                  <p className="inbox-item__sub">{subheading}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inbox;
