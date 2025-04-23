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

const tableHeaderClass = "text-[#0044A3] font-semibold text-sm py-3 px-6";
const cellClass = "text-sm font-medium text-gray-700 py-3 px-6";
const jobTypes = ["On-Site", "Hybrid", "Remote"];
const status = ["Open", "Close", "Hold"];
const jobPostings = Array(10)
  .fill(null)
  .map((_, i) => ({
    clientName: `Client ${i + 1}`,
    jobTitle: `Job Title ${i + 1}`,
    positions: `${Math.ceil(Math.random() * 50)}`,
    experience: `${Math.ceil(Math.random() * 10)}`,
    jobType: `${jobTypes[Math.floor(Math.random() * jobTypes.length)]}`,
    location: `Location ${i + 1}`,
    status: `${status[Math.floor(Math.random() * status.length)]}`,
  }));

interface jobPost {
  clientName: string;
  jobTitle: string;
  positions: string;
  experience: string;
  jobType: string;
  location: string;
  status: string;
}

const AssignedPositions = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-bold text-[#475569]">Assigned Positions</h1>
        <p className="text-sm text-[#475569] mt-2 text-center">
          View, track, and stay on top of every role assigned to you — all in
          one place.
        </p>
      </div>
      <CardSection data={jobPostings} />
      <PaginationSection />
    </div>
  );
};

const CardSection = ({ data }: { data: jobPost[] }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [active, setActive] = useState("0");
  const [listType, setListType] = useState("list");

  const cardData = [
    {
      id: 1,
      status: "OPEN",
      experience: "Preferred Exp: 2 – 4 years",
      title: "UX Designer",
      company: "For ITG Communications",
      location: "Tennessee",
      remote: "Remote",
      assigned_by: ["https://i.pravatar.cc/300"],
      ctc: "10%",
      description:
        "We are looking for a passionate UX Designer to work on enhancing the user experience of our flagship products. You will collaborate closely with product teams to create user-centered designs and conduct usability testing.",
    },
    {
      id: 2,
      status: "CLOSED",
      experience: "Preferred Exp: 5 – 7 years",
      title: "Frontend Developer",
      company: "For XYZ Technologies",
      location: "California",
      remote: "Hybrid",
      assigned_by: ["https://i.pravatar.cc/300"],
      ctc: "15%",
      description:
        "XYZ Technologies is seeking a skilled Frontend Developer to join our team. The ideal candidate will have expertise in JavaScript frameworks and a strong understanding of responsive web design to build and maintain high-performance web applications.",
    },
    {
      id: 3,
      status: "OPEN",
      experience: "Preferred Exp: 3 – 5 years",
      title: "Product Manager",
      company: "For ABC Solutions",
      location: "New York",
      remote: "Remote",
      assigned_by: ["https://i.pravatar.cc/302"],
      ctc: "12%",
      description:
        "As a Product Manager at ABC Solutions, you will drive the product roadmap and collaborate with cross-functional teams to ensure successful product launches. Strong communication and project management skills are essential.",
    },
    {
      id: 4,
      status: "OPEN",
      experience: "Preferred Exp: 1 – 3 years",
      title: "Graphic Designer",
      company: "For Creative Agency",
      location: "Texas",
      remote: "In-office",
      assigned_by: ["https://i.pravatar.cc/304"],
      ctc: "8%",
      description:
        "Creative Agency is hiring a Graphic Designer to work on a variety of branding, digital, and print design projects. You will collaborate with the creative team to develop visually compelling materials that meet client goals.",
    },
    {
      id: 5,
      status: "OPEN",
      experience: "Preferred Exp: 2 – 4 years",
      title: "Backend Developer",
      company: "For Tech Corp",
      location: "Florida",
      remote: "Remote",
      assigned_by: ["https://i.pravatar.cc/306"],
      ctc: "20%",
      description:
        "Tech Corp is looking for a Backend Developer to design and implement server-side logic, database systems, and APIs. You'll play a key role in optimizing the performance of our backend infrastructure.",
    },
    {
      id: 6,
      status: "CLOSED",
      experience: "Preferred Exp: 4 – 6 years",
      title: "Data Scientist",
      company: "For DataLabs",
      location: "Illinois",
      remote: "Hybrid",
      assigned_by: ["https://i.pravatar.cc/308"],
      ctc: "18%",
      description:
        "DataLabs is seeking a Data Scientist to analyze complex datasets and provide actionable insights. You’ll work closely with product and engineering teams to create predictive models and improve business outcomes.",
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
      {listType == "list" ? (
        <ClientTable data={data} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 cursor-pointer gap-4 pt-3 pb-10">
          <JobCardSection data={cardData} />
        </div>
      )}
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
            <TableCell className={cellClass}>{jopPost.jobType}</TableCell>
            <TableCell className={cellClass}>{jopPost.location}</TableCell>
            <TableCell className={cellClass}>
              <Badge
                className={
                  jopPost.status === "Open"
                    ? "bg-green-400"
                    : jopPost.status === "Close"
                    ? "bg-red-400"
                    : "bg-orange-400"
                }
              >
                {jopPost.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const JobCardSection = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleHover = (index) => setHoveredIndex(index);
  const handleClick = (index) => {
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
                  card.status === "OPEN"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {card.status}
              </span>
              <span
                className={`${
                  card.status === "OPEN"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-100 text-red-600"
                } text-xs font-[500] px-3 py-1 rounded-md`}
              >
                {card.experience}
              </span>
            </div>

            <div className="mb-1">
              <h2 className="mt-4 text-[15px] font-bold text-[#1E293B]">
                {card.title}
              </h2>
              <p className="mt-1 text-[12px] text-[#1E293B]">{card.company}</p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 my-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{card.location}</span>
              </div>
              <span className="text-[12px] font-medium">{card.remote}</span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Assigned By</p>
                <div className="flex -space-x-2">
                  {card.assigned_by.map((recruiter, recruiterIndex) => (
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

export default AssignedPositions;
