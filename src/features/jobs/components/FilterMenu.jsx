import { useEffect, useRef, useState } from "react";
import { IconFilter, IconChevronLeft, IconCheck } from "@/shared/components/icons";

const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest first" },
  { value: "createdAt", label: "Oldest first" },
  { value: "-salary", label: "Highest paying" },
  { value: "salary", label: "Lowest paying" },
];

const JOB_TYPES = ["full-time", "part-time", "internship", "contract"];

const FilterMenu = ({ filters, setFilters, setPage }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("main");
  const [tempFilters, setTempFilters] = useState(filters);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    setTempFilters(filters);
    setOpen((v) => !v);
    setView("main");
  };

  const handleSort = (value) => {
    setFilters((prev) => ({ ...prev, sort: value }));
    setPage(1);
    setOpen(false);
  };

  const handleJobType = (value) => {
    setTempFilters((prev) => {
      const exists = prev.jobType.includes(value);
      return {
        ...prev,
        jobType: exists
          ? prev.jobType.filter((t) => t !== value)
          : [...prev.jobType, value],
      };
    });
  };

  const handleApply = () => {
    setFilters((prev) => ({ ...prev, ...tempFilters }));
    setPage(1);
    setOpen(false);
  };

  const handleClear = () => {
    const cleared = { sort: "-createdAt", jobType: [] };
    setTempFilters(cleared);
    setFilters((prev) => ({ ...prev, ...cleared }));
    setPage(1);
  };

  return (
    <div className="filter-container" ref={containerRef}>
      <button
        type="button"
        className="btn btn--secondary"
        onClick={handleOpen}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <IconFilter />
        Sort &amp; Filter
      </button>

      {open && (
        <div className="filter-dropdown" role="menu">
          {view === "main" && (
            <>
              <div
                className="filter-dropdown__item"
                role="menuitem"
                tabIndex={0}
                onClick={() => setView("sort")}
                onKeyDown={(e) => e.key === "Enter" && setView("sort")}
              >
                Sort by
              </div>
              <div
                className="filter-dropdown__item"
                role="menuitem"
                tabIndex={0}
                onClick={() => setView("jobType")}
                onKeyDown={(e) => e.key === "Enter" && setView("jobType")}
              >
                Job type
              </div>
            </>
          )}

          {view === "sort" && (
            <>
              <button className="filter-dropdown__back" onClick={() => setView("main")}>
                <IconChevronLeft /> Back
              </button>
              {SORT_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className={`filter-dropdown__item${filters.sort === opt.value ? " active" : ""}`}
                  role="menuitemradio"
                  aria-checked={filters.sort === opt.value}
                  tabIndex={0}
                  onClick={() => handleSort(opt.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSort(opt.value)}
                >
                  {opt.label}
                  {filters.sort === opt.value && <IconCheck />}
                </div>
              ))}
            </>
          )}

          {view === "jobType" && (
            <>
              <button className="filter-dropdown__back" onClick={() => setView("main")}>
                <IconChevronLeft /> Back
              </button>

              {JOB_TYPES.map((type) => (
                <div
                  key={type}
                  className={`filter-dropdown__item${tempFilters.jobType.includes(type) ? " active" : ""}`}
                  role="menuitemcheckbox"
                  aria-checked={tempFilters.jobType.includes(type)}
                  tabIndex={0}
                  onClick={() => handleJobType(type)}
                  onKeyDown={(e) => e.key === "Enter" && handleJobType(type)}
                >
                  {type.replace("-", " ")}
                  {tempFilters.jobType.includes(type) && <IconCheck />}
                </div>
              ))}

              <div className="filter-dropdown__actions">
                <button className="btn btn--secondary btn--sm" onClick={handleClear}>
                  Clear
                </button>
                <button className="btn btn--primary btn--sm" onClick={handleApply}>
                  Apply
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterMenu;
