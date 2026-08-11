import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { adminApi } from "../api/adminApi";
import { jobsApi } from "@/features/jobs/api/jobsApi";
import toast from "react-hot-toast";
import Loader from "@/shared/components/Loader";
import JobForm from "../components/JobForm";
import { IconArrowLeft } from "@/shared/components/icons";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    jobType: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchJob = async () => {
    try {
      const res = await jobsApi.getById(id);
      const job = res.data.job;

      setForm({
        title: job.title || "",
        description: job.description || "",
        company: job.company || "",
        location: job.location || "",
        salary: job.salary || "",
        jobType: job.jobType || "",
      });
    } catch (err) {
      toast.error("Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Job title is required";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.company.trim()) next.company = "Company is required";
    if (!form.location.trim()) next.location = "Location is required";
    if (!form.jobType) next.jobType = "Select a job type";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await adminApi.updateJob(id, form);

      toast.success("Job updated");
      navigate("/admin/jobs");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading job..." />;

  return (
    <div className="form-container">
      <Link to="/admin/jobs" className="breadcrumb-back">
        <IconArrowLeft /> Back to manage jobs
      </Link>

      <div className="page-header">
        <div>
          <h1 className="page-header__title">Edit job</h1>
          <p className="page-header__subtitle">Update the listing details below</p>
        </div>
      </div>

      <JobForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Save changes"
        errors={errors}
      />
    </div>
  );
};

export default EditJob;
