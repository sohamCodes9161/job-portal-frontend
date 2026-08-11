const JobCardSkeleton = () => {
  return (
    <div className="job-card" aria-hidden="true">
      <div className="job-card__top">
        <div className="skeleton-block" style={{ width: 42, height: 42, borderRadius: 8 }} />
      </div>
      <div className="skeleton-title" />
      <div className="skeleton-text short" />
      <div className="skeleton-text" style={{ width: "80%" }} />
      <div className="skeleton-button" />
    </div>
  );
};

export default JobCardSkeleton;
