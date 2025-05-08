import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, List, LayoutGrid, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import PaginationSection from "@/components/ui/page";
import NoData from "@/components/ui/nodata";
import SortBy from "@/components/ui/sortby";
import { getUserData, getUserToken, ucFirst } from "../../utils/common";
import Config from "@/config.json";

const tableHeaderClass = "text-[#0044A3] font-semibold text-sm py-3 px-6";
const cellClass = "text-sm font-medium text-gray-700 py-3 px-6";

interface jobPost {
  clientName: string;
  companyName: string;
  jobTitle: string;
  positions: string;
  experience: string;
  jobType: string;
  location: string;
  status: string;
  assigned_by: string;
  description: string;
}

const AssignedPositions = () => {
  const [jobPostings, setJobPostings] = useState<jobPost[]>([]);
  const [filterBy, setFilterBy] = useState("0");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const limit = 20;
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const loadJobPostings = () => {
    axios
      .get(
        `${Config.api_endpoint}fetch_data/assigned-positions/list/${
          getUserData().id
        }`,
        {
          headers: {
            Authorization: `Bearer ${getUserToken()}`,
          },
          params: {
            page: page,
            limit: limit,
            filterby: filterBy,
            sortby: sortBy,
            searchby: search,
          },
        }
      )
      .then((response) => {
        setJobPostings(response.data.data);
        setTotal(75);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    loadJobPostings();
  }, [filterBy, sortBy, search, page]);

  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-bold text-[#475569]">Assigned Positions</h1>
        <p className="text-sm text-[#475569] mt-2 text-center">
          View, track, and stay on top of every role assigned to you — all in
          one place.
        </p>
      </div>
      <CardSection
        data={jobPostings}
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
  data: jobPost[];
  setFilterBy: React.Dispatch<React.SetStateAction<string>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [active, setActive] = useState("0");
  const [listType, setListType] = useState("list");

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
            { label: "All Jobs", value: 50, color: "bg-blue-400" },
            { label: "Open", value: 40, color: "bg-green-400" },
            { label: "Closed", value: 10, color: "bg-red-400" },
            { label: "Hold", value: 10, color: "bg-orange-400" },
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
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            className={`cursor-pointer ${listType == "list" && "list-active"}`}
            onClick={() => setListType("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            className={`cursor-pointer ${listType == "grid" && "list-active"}`}
            onClick={() => setListType("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {data.length > 0 ? (
        listType === "list" ? (
          <ClientTable data={data} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 cursor-pointer gap-4 pt-3 pb-10">
            <JobCardSection data={data} />
          </div>
        )
      ) : (
        <NoData />
      )}
    </>
  );
};

const ClientTable = ({ data }: { data: jobPost[] }) => (
  <div className="overflow-x-auto rounded-lg my-3">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={tableHeaderClass}>Client Name</TableHead>
          <TableHead className={tableHeaderClass}>Job Title</TableHead>
          <TableHead className={tableHeaderClass}>Positions</TableHead>
          <TableHead className={tableHeaderClass}>Experience</TableHead>
          <TableHead className={tableHeaderClass}>Job Type</TableHead>
          <TableHead className={tableHeaderClass}>Location</TableHead>
          <TableHead className={tableHeaderClass}>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((jopPost, i) => (
          <TableRow key={i}>
            <TableCell className={cellClass}>{jopPost.clientName}</TableCell>
            <TableCell className={cellClass}>{jopPost.jobTitle}</TableCell>
            <TableCell className={cellClass}>{jopPost.positions}</TableCell>
            <TableCell className={cellClass}>{jopPost.experience}</TableCell>
            <TableCell className={cellClass}>
              {ucFirst(jopPost.jobType)}
            </TableCell>
            <TableCell className={cellClass}>{jopPost.location}</TableCell>
            <TableCell className={cellClass}>
              <Badge
                className={
                  jopPost.status === "open"
                    ? "bg-green-400"
                    : jopPost.status === "closed"
                    ? "bg-red-400"
                    : "bg-orange-400"
                }
              >
                {ucFirst(jopPost.status)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const JobCardSection = ({ data }: { data: jobPost[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const handleHover = (index: number | null) => setHoveredIndex(index);
  const handleClick = (index: number) => {
    // Toggle clicked state
    setClickedIndex((prevClickedIndex) =>
      prevClickedIndex === index ? null : index
    );
  };

  return (
    <>
      {data.map((card, index) => {
        const isHovered = hoveredIndex === index;
        const isClicked = clickedIndex === index;

        return (
          <div
            key={index}
            className={`bg-white p-4 rounded-2xl shadow-md border border-gray-200 max-w-md w-full transition-transform transform ${
              isHovered ? "scale-105 shadow-xl" : ""
            }`}
            onMouseEnter={() => handleHover(index)}
            onMouseLeave={() => handleHover(null)}
            onClick={() => handleClick(index)}
          >
            <div className="flex justify-between items-start mb-2">
              <span
                className={`text-[10px] font-semibold px-3 py-1 rounded-md ${
                  card.status === "open"
                    ? "bg-green-100 text-green-600"
                    : card.status === "closed"
                    ? "bg-red-100 text-red-600"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {ucFirst(card.status)}
              </span>
              <span
                className={`${
                  card.status === "open"
                    ? "bg-green-100 text-green-600"
                    : card.status === "closed"
                    ? "bg-red-100 text-red-600"
                    : "bg-orange-100 text-orange-600"
                } text-xs font-[500] px-3 py-1 rounded-md`}
              >
                {card.experience}
              </span>
            </div>

            <div className="mb-1">
              <h2 className="mt-4 text-[15px] font-bold text-[#1E293B]">
                {card.jobTitle}
              </h2>
              <p className="mt-1 text-[12px] text-[#1E293B]">
                {card.companyName}
              </p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 my-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="text-[11px]">{card.location}</span>
              </div>
              <span className="text-[11px] font-medium">
                {ucFirst(card.jobType)}
              </span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Assigned By</p>
                <div className="flex -space-x-2">
                  <p className="text-gray-500 text-[10px]">
                    {card.assigned_by}
                  </p>
                </div>
              </div>
            </div>

            {isClicked && (
              <div className="mt-4 p-2 bg-gray-100 rounded-xl text-xs text-gray-700">
                <p>{card.description}</p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default AssignedPositions;
