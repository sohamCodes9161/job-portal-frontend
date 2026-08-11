const ApplicationSkeleton = () => {
  return (
    <div className="application-card" aria-hidden="true">
      <div style={{ flex: 1 }}>
        <div className="skeleton-title small" />
        <div className="skeleton-text short" />
      </div>
      <div className="skeleton-button" style={{ marginTop: 0, width: 90 }} />
    </div>
  );
};

export default ApplicationSkeleton;
