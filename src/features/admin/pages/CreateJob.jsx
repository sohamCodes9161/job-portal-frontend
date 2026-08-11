import { useState } from "react";
import { adminApi } from "../api/adminApi";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import JobForm from "../components/JobForm";
import { IconArrowLeft } from "@/shared/components/icons";

const CreateJob = () => {
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
  const [submitting, setSubmitting] = useState(false);

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
      await adminApi.createJob(form);

      toast.success("Job created successfully!");
      navigate("/admin/jobs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <Link to="/admin/jobs" className="breadcrumb-back">
        <IconArrowLeft /> Back to manage jobs
      </Link>

      <div className="page-header">
        <div>
          <h1 className="page-header__title">Post a new job</h1>
          <p className="page-header__subtitle">Fill in the details below to publish a listing</p>
        </div>
      </div>

      <JobForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Publish job"
        errors={errors}
      />
    </div>
  );
};

export default CreateJob;
