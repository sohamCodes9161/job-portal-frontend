const JOB_TYPES = ["full-time", "part-time", "internship", "contract"];

const JobForm = ({ form, onChange, onSubmit, submitting, submitLabel, errors = {} }) => {
  return (
    <form className="card job-form" onSubmit={onSubmit} noValidate>
      <div className="form-field">
        <label className="form-label" htmlFor="title">Job title</label>
        <input
          id="title"
          className={`input${errors.title ? " input--error" : ""}`}
          name="title"
          placeholder="e.g. Frontend Engineer"
          value={form.title}
          onChange={onChange}
        />
        {errors.title && <span className="form-error-text">{errors.title}</span>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          className={`textarea${errors.description ? " textarea--error" : ""}`}
          name="description"
          placeholder="Describe the role, responsibilities, and requirements..."
          value={form.description}
          onChange={onChange}
        />
        {errors.description && <span className="form-error-text">{errors.description}</span>}
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label" htmlFor="company">Company</label>
          <input
            id="company"
            className={`input${errors.company ? " input--error" : ""}`}
            name="company"
            placeholder="e.g. Acme Inc."
            value={form.company}
            onChange={onChange}
          />
          {errors.company && <span className="form-error-text">{errors.company}</span>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="location">Location</label>
          <input
            id="location"
            className={`input${errors.location ? " input--error" : ""}`}
            name="location"
            placeholder="e.g. Bengaluru, India"
            value={form.location}
            onChange={onChange}
          />
          {errors.location && <span className="form-error-text">{errors.location}</span>}
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label" htmlFor="salary">
            Salary <span className="optional">(optional)</span>
          </label>
          <input
            id="salary"
            className="input"
            name="salary"
            placeholder="e.g. 800000"
            value={form.salary}
            onChange={onChange}
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="jobType">Job type</label>
          <select
            id="jobType"
            className={`select${errors.jobType ? " input--error" : ""}`}
            name="jobType"
            value={form.jobType}
            onChange={onChange}
          >
            <option value="">Select a type</option>
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace("-", " ")}
              </option>
            ))}
          </select>
          {errors.jobType && <span className="form-error-text">{errors.jobType}</span>}
        </div>
      </div>

      <div className="job-form__actions">
        <button type="submit" className="btn btn--primary btn--lg" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
