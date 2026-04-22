import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import JobCardSkeleton from "../components/JobCardSkeleton";
import FilterMenu from "../components/FilterMenu";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 start false
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    sort: "-createdAt",
    jobType: [],
  });

  // 🔥 fetch jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const { sort, jobType } = filters;

      let url = `/jobs?search=${search}&page=${page}&limit=5&sort=${sort}`;

      if (jobType.length > 0) {
        url += `&jobType=${jobType.join(",")}`;
      }

      const res = await API.get(url);

      setJobs(res.data.jobs || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log(err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 debounce (smooth typing experience)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchJobs();
    }, 400); // wait for user to stop typing

    return () => clearTimeout(delay);
  }, [page, search, filters.sort, filters.jobType.join(",")]);

  return (
    <div className="jobs-container">

      {/* 🔝 Filter */}
      <div className="jobs-topbar">
        <FilterMenu
          filters={filters}
          setFilters={setFilters}
          setPage={setPage}
        />
      </div>

      {/* 🔹 Header */}
      <div className="jobs-header">
        <h2>Find Your Dream Job</h2>
        <p>Browse latest opportunities</p>
      </div>

      {/* 🔍 Search */}
      <div className="jobs-search">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <button onClick={fetchJobs}>Search</button>
      </div>

      {/* ❗ Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🔥 Active Filters */}
      <div className="active-filters">
        {filters.jobType.map((type) => (
          <span key={type} className="filter-chip">
            {type}
            <button
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  jobType: prev.jobType.filter((t) => t !== type),
                }));
                setPage(1);
              }}
            >
              ✖
            </button>
          </span>
        ))}

        {filters.jobType.length > 0 && (
          <button
            className="clear-btn"
            onClick={() => {
              setFilters({
                sort: "-createdAt",
                jobType: [],
              });
              setPage(1);
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* 📄 Jobs */}
      <div className="jobs-grid">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <JobCardSkeleton key={i} />
          ))
        ) : jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>

              <Link to={`/jobs/${job._id}`}>
                <button>View Details</button>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* 📄 Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Jobs;
