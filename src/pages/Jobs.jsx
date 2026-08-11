import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import JobCardSkeleton from "../components/JobCardSkeleton";
import FilterMenu from "../components/FilterMenu";
import EmptyState from "../components/EmptyState";
import {
  IconSearch,
  IconMapPin,
  IconClock,
  IconRupee,
  IconChevronLeft,
  IconChevronRight,
  IconArrowRight,
  IconInbox,
  IconAlertCircle,
  IconX,
} from "../components/icons";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    sort: "-createdAt",
    jobType: [],
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const { sort, jobType } = filters;
      let url = `/jobs?search=${search}&page=${page}&limit=6&sort=${sort}`;

      if (jobType.length > 0) {
        url += `&jobType=${jobType.join(",")}`;
      }

      const res = await API.get(url);

      setJobs(res.data.jobs || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log(err);
      setError("We couldn't load jobs right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, filters.sort, filters.jobType.join(",")]);

  // Debounce search input -> search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const removeJobType = (type) => {
    setFilters((prev) => ({
      ...prev,
      jobType: prev.jobType.filter((t) => t !== type),
    }));
    setPage(1);
  };

  return (
    <div className="jobs-page">
      <div className="jobs-hero">
        <h1>Find your next opportunity</h1>
        <p>Browse the latest roles from companies actively hiring right now.</p>
      </div>

      <div className="jobs-toolbar">
        <div className="search-box">
          <IconSearch />
          <input
            type="text"
            placeholder="Search by title, company, or keyword..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search jobs"
          />
        </div>

        <FilterMenu filters={filters} setFilters={setFilters} setPage={setPage} />
      </div>

      {filters.jobType.length > 0 && (
        <div className="active-filters">
          {filters.jobType.map((type) => (
            <span key={type} className="chip">
              {type.replace("-", " ")}
              <button onClick={() => removeJobType(type)} aria-label={`Remove ${type} filter`}>
                <IconX />
              </button>
            </span>
          ))}
          <button
            className="clear-btn"
            onClick={() => {
              setFilters({ sort: "-createdAt", jobType: [] });
              setPage(1);
            }}
          >
            Clear all
          </button>
        </div>
      )}

      {error && (
        <div className="alert alert--error mb-4">
          <IconAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <p className="results-meta">
          Showing page {page} of {totalPages}
        </p>
      )}

      <div className="jobs-grid">
        {loading ? (
          [...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={<IconInbox />}
            title="No jobs found"
            description="Try adjusting your search or clearing filters to see more results."
          />
        ) : (
          jobs.map((job) => (
            <Link to={`/jobs/${job._id}`} key={job._id} className="job-card">
              <div className="job-card__top">
                <div className="job-card__logo" aria-hidden="true">
                  {job.company?.[0]?.toUpperCase() || "J"}
                </div>
                {job.jobType && (
                  <span className="badge badge--neutral">{job.jobType.replace("-", " ")}</span>
                )}
              </div>

              <h3 className="job-card__title">{job.title}</h3>
              <p className="job-card__company">{job.company}</p>

              <div className="job-card__meta">
                {job.location && (
                  <span>
                    <IconMapPin width={14} height={14} /> {job.location}
                  </span>
                )}
                {job.createdAt && (
                  <span>
                    <IconClock width={14} height={14} />{" "}
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="job-card__footer">
                <span className="job-card__salary">
                  {job.salary ? (
                    <>
                      <IconRupee width={14} height={14} style={{ display: "inline", verticalAlign: -2 }} />
                      {job.salary}
                    </>
                  ) : (
                    "Not disclosed"
                  )}
                </span>
                <span className="job-card__cta">
                  View details <IconArrowRight />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {!loading && jobs.length > 0 && totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn--secondary btn--sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <IconChevronLeft /> Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            className="btn btn--secondary btn--sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <IconChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
