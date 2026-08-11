import { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../api/adminApi";
import { AuthContext } from "@/features/auth/AuthContext";
import toast from "react-hot-toast";
import Loader from "@/shared/components/Loader";
import EmptyState from "@/shared/components/EmptyState";
import {
  JobTypePieChart,
  JobsTrendChart,
  ApplicantsPerJobChart,
} from "../components/charts/DashboardCharts";
import { IconBriefcase, IconUsers, IconInbox, IconPlus } from "@/shared/components/icons";

// Groups jobs by posting date (last 7 buckets) for the trend chart.
const buildTrendData = (jobs) => {
  const buckets = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.push({
      key: d.toDateString(),
      label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      count: 0,
    });
  }

  jobs.forEach((job) => {
    if (!job.createdAt) return;
    const key = new Date(job.createdAt).toDateString();
    const bucket = buckets.find((b) => b.key === key);
    if (bucket) bucket.count += 1;
  });

  return buckets;
};

// Groups jobs by jobType for the pie chart.
const buildTypeData = (jobs) => {
  const counts = {};
  jobs.forEach((job) => {
    const type = job.jobType || "unspecified";
    counts[type] = (counts[type] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name: name.replace("-", " "), value }));
};

// Top jobs by applicant count — only works if the job object exposes a count field.
const buildApplicantsData = (jobs) => {
  const withCounts = jobs
    .map((job) => ({
      label: job.title?.length > 22 ? `${job.title.slice(0, 20)}…` : job.title,
      count: job.applicantsCount ?? job.applicants?.length ?? null,
    }))
    .filter((j) => typeof j.count === "number");

  return withCounts.sort((a, b) => b.count - a.count).slice(0, 6);
};

const Dashboard = () => {
  const { token } = useContext(AuthContext);

  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.allSettled([
          adminApi.getDashboardStats(),
          adminApi.getMyJobs(),
        ]);

        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value.data.stats);
        } else {
          toast.error("Failed to load dashboard stats");
        }

        if (jobsRes.status === "fulfilled") {
          setJobs(jobsRes.value.data.jobs || []);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const trendData = useMemo(() => buildTrendData(jobs), [jobs]);
  const typeData = useMemo(() => buildTypeData(jobs), [jobs]);
  const applicantsData = useMemo(() => buildApplicantsData(jobs), [jobs]);

  if (loading) return <Loader label="Loading dashboard..." />;
  if (!stats) {
    return (
      <EmptyState
        icon={<IconInbox />}
        title="Couldn't load dashboard"
        description="Please refresh the page to try again."
      />
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Admin Dashboard</h1>
          <p className="page-header__subtitle">Overview of your job postings and applicants</p>
        </div>
        <Link to="/admin/jobs/create" className="btn btn--primary">
          <IconPlus /> Post a job
        </Link>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--indigo">
            <IconBriefcase />
          </div>
          <div>
            <div className="stat-card__label">Total Jobs</div>
            <div className="stat-card__value">{stats.totalJobs}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-card__icon stat-card__icon--green">
            <IconUsers />
          </div>
          <div>
            <div className="stat-card__label">Total Applicants</div>
            <div className="stat-card__value">{stats.totalApplicants}</div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="charts-grid">
        <div className="card chart-card">
          <h2 className="chart-card__title">Jobs posted (last 7 days)</h2>
          {trendData.some((d) => d.count > 0) ? (
            <JobsTrendChart data={trendData} />
          ) : (
            <p className="chart-empty">No jobs posted in the last 7 days.</p>
          )}
        </div>

        <div className="card chart-card">
          <h2 className="chart-card__title">Jobs by type</h2>
          {typeData.length > 0 ? (
            <JobTypePieChart data={typeData} />
          ) : (
            <p className="chart-empty">Post a job to see this breakdown.</p>
          )}
        </div>

        {applicantsData.length > 0 && (
          <div className="card chart-card chart-card--wide">
            <h2 className="chart-card__title">Top jobs by applicants</h2>
            <ApplicantsPerJobChart data={applicantsData} />
          </div>
        )}
      </div>

      <div className="card section-card">
        <h2 className="section-card__title">Recent jobs</h2>

        {stats.recentJobs.length === 0 ? (
          <EmptyState
            icon={<IconInbox />}
            title="No jobs posted yet"
            description="Create your first job listing to see it here."
          />
        ) : (
          stats.recentJobs.map((job) => (
            <div key={job._id} className="job-row">
              <div>
                <h4>{job.title}</h4>
                <p>{job.company}</p>
              </div>
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
