import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronsUpDown,
  Menu,
  Check,
  Pencil,
  Trash2,
  List,
  LayoutGrid,
  MapPin,
  EllipsisVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

const Interviews = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-bold text-[#475569]">Manage Interviews</h1>
        <p className="text-sm text-[#475569] mt-2 text-center">
          Schedule, track, and manage all your candidate interviews — seamlessly
          from one place.
        </p>
      </div>
      <CardSection />
      <PaginationSection />
    </div>
  );
};

const CardSection = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [active, setActive] = useState("0");

  const cardData = [
    {
      id: 1,
      status: "Scheduled",
      stage: "L1",
      name: "Albert Smith",
      jobPosting: "UX Designer",
      company: "For ITG Communications",
      mode: "Online",
      interviewers: ["https://i.pravatar.cc/300"],
    },
    {
      id: 2,
      status: "Inprogress",
      stage: "L2",
      name: "Jessica Johnson",
      jobPosting: "Product Manager",
      company: "Tech Innovators",
      mode: "In-person",
      interviewers: ["https://i.pravatar.cc/301"],
    },
    {
      id: 3,
      status: "Scheduled",
      stage: "L1",
      name: "Michael Davis",
      jobPosting: "Front-end Developer",
      company: "Web Solutions LLC",
      mode: "Online",
      interviewers: ["https://i.pravatar.cc/302"],
    },
    {
      id: 4,
      status: "Cancelled",
      stage: "L2",
      name: "Samantha Brown",
      jobPosting: "Data Scientist",
      company: "AI Innovations",
      mode: "In-person",
      interviewers: ["https://i.pravatar.cc/303"],
    },
    {
      id: 5,
      status: "Scheduled",
      stage: "L1",
      name: "David Williams",
      jobPosting: "Marketing Specialist",
      company: "Global Reach Corp",
      mode: "Online",
      interviewers: ["https://i.pravatar.cc/304"],
    },
    {
      id: 6,
      status: "Inprogress",
      stage: "L3",
      name: "Emily Garcia",
      jobPosting: "HR Coordinator",
      company: "People Solutions",
      mode: "In-person",
      interviewers: ["https://i.pravatar.cc/305"],
    },
    {
      id: 7,
      status: "Scheduled",
      stage: "L1",
      name: "Christopher Lee",
      jobPosting: "Software Engineer",
      company: "NextGen Technologies",
      mode: "Online",
      interviewers: ["https://i.pravatar.cc/306"],
    },
    {
      id: 8,
      status: "Cancelled",
      stage: "L2",
      name: "Sophia Martinez",
      jobPosting: "Graphic Designer",
      company: "Creative Works Studio",
      mode: "In-person",
      interviewers: ["https://i.pravatar.cc/307"],
    },
    {
      id: 9,
      status: "Inprogress",
      stage: "L3",
      name: "James Wilson",
      jobPosting: "Project Manager",
      company: "Innovative Solutions",
      mode: "Online",
      interviewers: ["https://i.pravatar.cc/308"],
    },
    {
      id: 10,
      status: "Scheduled",
      stage: "L1",
      name: "Olivia Taylor",
      jobPosting: "Marketing Manager",
      company: "Brand Builders Inc.",
      mode: "In-person",
      interviewers: ["https://i.pravatar.cc/309"],
    },
    {
      id: 11,
      status: "Inprogress",
      stage: "L2",
      name: "Ethan Moore",
      jobPosting: "Software Developer",
      company: "Tech Horizon",
      mode: "Online",
      interviewers: ["https://i.pravatar.cc/310"],
    },
    {
      id: 12,
      status: "Cancelled",
      stage: "L3",
      name: "Mia Anderson",
      jobPosting: "Customer Support Specialist",
      company: "SupportPlus",
      mode: "In-person",
      interviewers: ["https://i.pravatar.cc/311"],
    },
    {
      id: 13,
      status: "Scheduled",
      stage: "L1",
      name: "Lucas Thomas",
      jobPosting: "Backend Developer",
      company: "CodeStream Solutions",
      mode: "Online",
      interviewers: ["https://i.pravatar.cc/312"],
    },
    {
      id: 14,
      status: "Inprogress",
      stage: "L3",
      name: "Amelia Jackson",
      jobPosting: "Sales Executive",
      company: "TechPulse",
      mode: "In-person",
      interviewers: ["https://i.pravatar.cc/313"],
    },
    {
      id: 15,
      status: "Scheduled",
      stage: "L2",
      name: "Benjamin White",
      jobPosting: "UX Researcher",
      company: "Insight Labs",
      mode: "Online",
      interviewers: ["https://i.pravatar.cc/314"],
    },
  ];

  const sortBy = [
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "last_updated", label: "Last Updated" },
  ];

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
              onClick={() => setActive(String(idx))}
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
            className="w-[200px] placeholder:text-[13px] px-4 py-5"
            onChange={(e) => console.log(e.target.value)} // Placeholder for search logic
          />
          <SortBy
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={setValue}
            sortBy={sortBy}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 cursor-pointer gap-4 pt-3 pb-10">
        <JobCardSection data={cardData} />
      </div>
    </>
  );
};

const SortBy = ({
  open,
  setOpen,
  value,
  setValue,
  sortBy,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  sortBy: { value: string; label: string }[];
}) => (
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button variant="outline" className="w-auto justify-between">
        {value ? sortBy.find((item) => item.value === value)?.label : "Sort By"}
        <ChevronsUpDown className="opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Command>
        <CommandList>
          <CommandGroup>
            {sortBy.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={() =>
                  setValue(item.value === value ? "" : item.value)
                }
              >
                {item.label}
                <Check
                  className={`ml-auto ${
                    value === item.value ? "opacity-100" : "opacity-0"
                  }`}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
);

const JobCardSection = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleHover = (index) => setHoveredIndex(index);
  const handleClick = (index) => setClickedIndex(index);

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
            onClick={() => handleClick(index)}
          >
            <div className="flex justify-between items-start mb-2">
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
                  <div className="flex -space-x-2">
                    {card.interviewers.map((recruiter, recruiterIndex) => (
                      <div
                        key={recruiterIndex}
                        className="relative group"
                        onMouseEnter={() => handleHover(recruiterIndex)}
                        onMouseLeave={() => handleHover(null)}
                      >
                        <img
                          className="w-8 h-8 rounded-full border-2 border-white"
                          src={recruiter}
                          alt={`Manager ${recruiterIndex + 1}`}
                        />
                        {isHovered && (
                          <div className="absolute bottom-0 left-0 w-full bg-black text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Manager {recruiterIndex + 1}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <span className="text-[12px]">{card.mode}</span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

const PaginationSection = () => (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="#" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">1</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#" isActive>
          2
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">3</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href="#" />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
);

export default Interviews;