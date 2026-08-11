const JobDetailsSkeleton = () => {
  return (
    <div className="job-detail-page" aria-hidden="true">
      <div className="card job-detail-card">
        <div className="job-detail__header">
          <div className="skeleton-block" style={{ width: 56, height: 56, borderRadius: 10 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton-title" style={{ width: "60%" }} />
            <div className="skeleton-text short" />
          </div>
        </div>

        <div className="job-detail__stats">
          {[...Array(3)].map((_, i) => (
            <div className="skeleton-block" key={i} style={{ height: 56, borderRadius: 10 }} />
          ))}
        </div>

        <div className="job-section">
          <div className="skeleton-title small" />
          <div className="skeleton-text" />
          <div className="skeleton-text" />
          <div className="skeleton-text short" />
        </div>

        <div className="skeleton-button" />
      </div>
    </div>
  );
};

export default JobDetailsSkeleton;
