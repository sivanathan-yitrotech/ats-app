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
  Mail,
  Phone,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
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
const generateCandidate = (status, index) => {
  const names = ["John Doe", "Alice Smith", "Bob Martin"];
  const titles = ["Software Engineer", "Data Scientist", "Backend Developer"];
  const companies = ["TechCorp", "DataWorks", "TechX"];
  const recruiters = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4",
    "https://i.pravatar.cc/150?img=5",
  ];
  const interviewers = [
    "https://i.pravatar.cc/150?img=6",
    "https://i.pravatar.cc/150?img=7",
    "https://i.pravatar.cc/150?img=8",
    "https://i.pravatar.cc/150?img=9",
    "https://i.pravatar.cc/150?img=10",
  ];

  // Create a new candidate object
  return {
    name: names[index % names.length],
    mobile: `91${Math.floor(Math.random() * 1000000000)}`,
    email: `${names[index % names.length]
      .toLowerCase()
      .replace(" ", ".")}${Math.floor(Math.random() * 100)}@gmail.com`,
    title: titles[index % titles.length],
    company: companies[index % companies.length],
    status: status,
    recruiters: [
      {
        [`recruiter ${(index % recruiters.length) + 1}`]:
          recruiters[index % recruiters.length],
      },
    ],
    interviewers: [
      {
        [`interviewer ${(index % interviewers.length) + 1}`]:
          interviewers[index % interviewers.length],
      },
    ],
  };
};

const candidatesStatus = {
  sourced: [],
  l1: [],
  l2: [],
  l3: [],
  offered: [],
  onboard: [],
  denied: [],
  rejected: [],
};

// Loop to generate more sample candidates for each status
const generateMoreCandidates = (statusTypes, numberOfCandidates) => {
  statusTypes.forEach((status) => {
    for (let i = 0; i < numberOfCandidates; i++) {
      candidatesStatus[status].push(generateCandidate(status, i));
    }
  });
};

// Call the function to generate 5 more candidates for each status type
generateMoreCandidates(Object.keys(candidatesStatus), 5);

console.log(candidatesStatus);

const AssignedPositions = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-bold text-[#475569]">Candidate Status</h1>
        <p className="text-sm text-[#475569] mt-2 text-center">
          Visually manage candidates through every hiring stage — with a clear,
          drag-and-drop flow.
        </p>
      </div>
      <CardSection data={candidatesStatus} />
      <PaginationSection />
    </div>
  );
};
const CardSection = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const sortBy = [
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "last_updated", label: "Last Updated" },
  ];

  return (
    <div className="my-10 p-4 bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between gap-6 mb-6">
        {["Client Name", "Job Postings", "Recruiter"].map((label, index) => (
          <div key={index} className="flex flex-col flex-1 gap-2">
            <Label className="text-gray-800 text-sm font-medium">{label}</Label>
            <Select name={label.toLowerCase().replace(" ", "")}>
              <SelectTrigger className="w-full bg-gray-100 border border-gray-300 rounded-md py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {/* Replace with dynamic data */}
                <SelectItem value="1">{label} - 1</SelectItem>
                <SelectItem value="2">{label} - 2</SelectItem>
                <SelectItem value="3">{label} - 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 pt-7">
          <Input
            type="text"
            placeholder="Search"
            className="w-full max-w-xs bg-gray-100 border border-gray-300 rounded-md py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          "sourced",
          "l1",
          "l2",
          "l3",
          "offered",
          "onboard",
          "denied",
          "rejected",
        ].map((status, index) => (
          <div className="flex flex-col gap-2 py-2 my-2" key={index}>
            <Badge className="bg-zinc-600 text-white font-semibold">
              {capitalizeFirstLetter(status)}
            </Badge>
            <div
              key={index}
              className={`p-3 mt-4 max-h-screen overflow-y-auto flex flex-col items-center gap-2 rounded-lg ${getStatusColor(
                status
              )}`}
            >
              <CandidateCard data={data[status]} type={status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    sourced: "bg-slate-100",
    l1: "bg-orange-100",
    l2: "bg-amber-100",
    l3: "bg-yellow-100",
    offered: "bg-lime-100",
    onboard: "bg-green-100",
    denied: "bg-pink-100",
    rejected: "bg-red-100",
  };
  return colors[status] || "bg-gray-100";
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const CandidateCard = ({ data, type }) => {
  return (
    <>
      {data.map((card, index) => (
        <div
          key={index}
          className="w-full my-2 bg-gray-100 p-4 rounded-lg shadow-lg border border-gray-200 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
        >
          <div className="mb-3">
            <h2 className="text-[13px] font-bold">{card.name}</h2>
            <h3 className="text-[12px] font-medium">{card.title}</h3>
            <p className="mt-1 text-[11px]">{card.company}</p>
            <div className="flex flex-col justify-between gap-1 mt-2">
              <div className="flex items-center text-[10px]">
                <i className="fas fa-envelope"></i>
                <p className="flex items-center gap-1">
                  <Mail size={12} />
                  {card.email}
                </p>
              </div>
              <div className="flex items-center text-[10px]">
                <i className="fas fa-phone-alt"></i>
                <p className="flex items-center gap-1">
                  <Phone size={12} /> {card.mobile}
                </p>
              </div>
            </div>
          </div>
          {type != "sourced" && (
            <div className="mt-3">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-[10px] font-semibold mb-1">Recruiters</p>
                  <div className="flex -space-x-2">
                    {card.recruiters.map((recruiter, recruiterIndex) => {
                      const recruiterImage = Object.values(recruiter)[0];
                      const recruiterName = Object.keys(recruiter)[0];
                      return (
                        <div key={recruiterIndex} className="relative group">
                          {/* <img
                          className="w-8 h-8 rounded-full border-2 border-white object-cover transition-transform duration-300 transform hover:scale-110"
                          src={recruiterImage}
                          alt={`Recruiter ${recruiterIndex + 1}`}
                        /> */}
                          <p className="text-[10px]">{recruiterName}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {["l1", "l2", "l3"].includes(type) && (
                  <div className="flex flex-col">
                    <p className="text-[10px] font-semibold mb-1">
                      Interviewers
                    </p>
                    <div className="flex -space-x-2">
                      {card.interviewers.map(
                        (interviewer, interviewerIndex) => {
                          const interviewerImage =
                            Object.values(interviewer)[0];
                          const interviewerName = Object.keys(interviewer)[0];
                          return (
                            <div
                              key={interviewerIndex}
                              className="relative group"
                            >
                              {/* <img
                          className="w-8 h-8 rounded-full border-2 border-white object-cover transition-transform duration-300 transform hover:scale-110"
                          src={interviewerImage}
                          alt={`Interviewer ${interviewerIndex + 1}`}
                        /> */}
                              <p className="text-[10px]">{interviewerName}</p>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
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
