import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PaginationSection from "@/components/ui/page";
import NoData from "@/components/ui/nodata";
import SortBy from "@/components/ui/sortby";
import axios from "axios";

interface JobCardData {
  id: number;
  status: string;
  stage: string;
  name: string;
  jobPosting: string;
  company: string;
  mode: string;
  interviewers: string[];
  interview_date: string; // Added property
}

const Interviews = () => {
  const [interviews, setInterviews] = useState<JobCardData[]>([]);
  const [filterBy, setFilterBy] = useState("0");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const limit = 20;
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const loadInterviews = () => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "interviews-list",
          page,
          limit,
          filterby: filterBy,
          sortby: sortBy,
          searchby: search,
        },
      })
      .then((response) => {
        setInterviews(response.data.data);
        setTotal(55);
      })
      .catch((error) => {
        console.error("API Error:", error.response?.data || error.message);
      });
  };

  useEffect(() => {
    loadInterviews();
  }, [filterBy, sortBy, search, page]);

  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-bold text-[#475569]">Manage Interviews</h1>
        <p className="text-sm text-[#475569] mt-2 text-center">
          Schedule, track, and manage all your candidate interviews — seamlessly
          from one place.
        </p>
      </div>
      <CardSection
        data={interviews}
        setFilterBy={setFilterBy}
        setSortBy={setSortBy}
        setSearch={setSearch}
      />
      <PaginationSection
        total={total}
        limit={limit}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

const CardSection = ({
  data,
  setFilterBy,
  setSortBy,
  setSearch,
}: {
  data: JobCardData[];
  setFilterBy: React.Dispatch<React.SetStateAction<string>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [active, setActive] = useState("0");

  const sortOptions = [
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "last_updated", label: "Last Updated" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (val: string) => {
    setValue(val);
    setSortBy(val);
  };

  return (
    <>
      <div className="overflow-x-auto flex justify-between gap-4">
        <div className="flex items-center gap-7 mb-4 bg-[#F1F5F9] rounded-lg p-2">
          {[
            { label: "All Jobs", value: 60, color: "bg-blue-400" },
            { label: "Scheduled", value: 40, color: "bg-yellow-400" },
            { label: "Inprogress", value: 10, color: "bg-green-400" },
            { label: "Cancelled", value: 10, color: "bg-red-400" },
          ].map(({ label, value, color }, idx) => (
            <div
              key={idx}
              className={`cursor-pointer flex items-center gap-2 ${
                active === String(idx) ? "toggle-active" : ""
              }`}
              onClick={() => {
                setActive(String(idx));
                setFilterBy(String(idx));
              }}
            >
              {idx === 0 && <Menu className="h-4 w-4" />}
              <p className="text-[#475569] text-sm flex items-center gap-1">
                {label}
                <Badge className={`${color} rounded-full`}>{value}</Badge>
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 py-1 mb-4">
          <Input
            type="text"
            placeholder="Search"
            className="w-[200px] placeholder:text-[12px] px-4 py-5"
            onChange={handleSearch}
          />
          <SortBy
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={(val) => handleSortChange(val as string)}
            sortBy={sortOptions}
          />
        </div>
      </div>

      {data.length === 0 ? (
        <NoData />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 cursor-pointer gap-4 pt-3 pb-10">
          <JobCardSection data={data} />
        </div>
      )}
    </>
  );
};

const JobCardSection = ({ data }: { data: JobCardData[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleHover = (index: number | null) => setHoveredIndex(index);

  return (
    <>
      {data.map((card, index) => {
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={card.id}
            className={`bg-white p-4 rounded-2xl shadow-md border border-gray-200 max-w-md w-full transition-transform transform ${
              isHovered ? "scale-105 shadow-xl" : ""
            }`}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={() => handleHover(null)}
          >
            <div className="flex justify-between items-center mb-2">
              <span
                className={`text-[10px] font-semibold px-3 py-1 rounded-md ${
                  card.status === "Scheduled"
                    ? "bg-yellow-100 text-yellow-600"
                    : card.status === "Inprogress"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {card.status}
              </span>
              <div className="flex flex-col gap-1">
                <span
                  className={`${
                    card.stage === "L1"
                      ? "bg-blue-50 text-blue-600"
                      : card.stage === "L2"
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-violet-100 text-violet-600"
                  } text-xs font-[500] px-3 py-1 rounded-md`}
                >
                  {card.stage}
                </span>
                <span className="text-[10px] font-medium">{card.mode}</span>
              </div>
            </div>

            <div className="mb-1">
              <h2 className="my-1 text-[13px] font-bold text-[#1E293B]">
                {card.name}
              </h2>
              <h2 className="my-1 text-[12px] text-[#1E293B]">
                {card.jobPosting}
              </h2>
              <p className="mt-1 text-[11px] text-[#1E293B]">{card.company}</p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between gap-2">
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 mb-1">Interviewers</p>
                  <div className="flex flex-col ml-1">
                    {card.interviewers.map((recruiter, recruiterIndex) => (
                      <p className="text-[10px] text-gray-500">
                        {recruiterIndex + 1}. {recruiter}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 mb-1">Interview On</p>
                  <p className="text-[10px] text-gray-500">
                    {card.interview_date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Interviews;
