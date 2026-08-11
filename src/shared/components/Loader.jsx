const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
};

export default Loader;
