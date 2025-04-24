import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check, Mail, Phone, Edit2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
const generateCandidate = (status: string, index: number) => {
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

type Candidate = {
  name: string;
  mobile: string;
  email: string;
  title: string;
  company: string;
  status: string;
  recruiters: { [key: string]: string }[];
  interviewers: { [key: string]: string }[];
};

const candidatesStatus: Record<string, Candidate[]> = {
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
const generateMoreCandidates = (
  statusTypes: (keyof typeof candidatesStatus)[],
  numberOfCandidates: number
) => {
  statusTypes.forEach((status) => {
    for (let i = 0; i < numberOfCandidates; i++) {
      candidatesStatus[status].push(generateCandidate(status, i));
    }
  });
};

// Call the function to generate 5 more candidates for each status type
generateMoreCandidates(Object.keys(candidatesStatus), 5);

const AssignedPositions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-bold text-[#475569]">Candidate Status</h1>
        <p className="text-sm text-[#475569] mt-2 text-center">
          Visually manage candidates through every hiring stage — with a clear,
          drag-and-drop flow.
        </p>
      </div>
      <CardSection
        data={candidatesStatus}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <UpdateStatusDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      <PaginationSection />
    </div>
  );
};

const CardSection = ({
  data,
  isOpen,
  setIsOpen,
}: {
  data: Record<string, Candidate[]>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {["Client Name", "Job Postings", "Recruiter"].map((label, index) => (
          <div key={index} className="flex flex-col flex-1 gap-2">
            <Label className="text-gray-800 text-sm font-medium">{label}</Label>
            <Select name={label.toLowerCase().replace(" ", "")}>
              <SelectTrigger className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 sm:pt-0">
          <Input
            type="text"
            placeholder="Search"
            className="w-full mt-7 max-w-xs border border-gray-300 rounded-md py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                status as
                  | "sourced"
                  | "l1"
                  | "l2"
                  | "l3"
                  | "offered"
                  | "onboard"
                  | "denied"
                  | "rejected"
              )}`}
            >
              <CandidateCard
                data={data[status]}
                type={status}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const colors = {
  sourced: "bg-[#EFF6FF]",
  l1: "bg-[#F5F3FF]",
  l2: "bg-[#ECFDF5]",
  l3: "bg-[#FEF3C7]",
  offered: "bg-[#E0F2FE]",
  onboard: "bg-[#DCFCE7]",
  denied: "bg-[#FEE2E2]",
  rejected: "bg-red-50",
};

const getStatusColor = (status: keyof typeof colors) => {
  const colors = {
    sourced: "bg-[#EFF6FF]",
    l1: "bg-[#F5F3FF]",
    l2: "bg-[#ECFDF5]",
    l3: "bg-[#FEF3C7]",
    offered: "bg-[#E0F2FE]",
    onboard: "bg-[#DCFCE7]",
    denied: "bg-[#FEE2E2]",
    rejected: "bg-red-50",
  };
  return colors[status] || "bg-gray-100";
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const CandidateCard = ({
  data,
  type,
  isOpen,
  setIsOpen,
}: {
  data: Candidate[];
  type: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      {data.map((card, index) => (
        <div
          key={index}
          className="w-full my-2 bg-white p-4 rounded-lg shadow-lg border border-gray-200 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
        >
          <div className="mb-3">
            <div className="flex items-center justify-between relative">
              <h2 className="text-[13px] font-bold">{card.name}</h2>
              <Edit2
                onClick={() => setIsOpen(true)}
                size={12}
                className="absolute right-2 top-2 text-gray-500 hover:text-blue-500 cursor-pointer"
              />
              {isOpen && <span></span>}
            </div>

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

const UpdateStatusDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [status, setStatus] = useState("0");
  const [isFeeded, setIsFeeded] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const handleSubmit = ({ isFeeded }: { isFeeded: boolean }) => {
    console.log(isFeeded);
    setIsFeeded(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          style={
            ["2", "3", "4"].includes(status)
              ? {
                  maxWidth: "80%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  padding: "2rem",
                }
              : {}
          }
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#0044A3] text-center mb-6">
              Update Candidate Status
            </DialogTitle>

            <div
              className={`${
                ["2", "3", "4"].includes(status)
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-8"
                  : ""
              }`}
            >
              <div className="flex flex-col gap-4 justify-between">
                <div className="flex justify-between items-center gap-4">
                  <Label className="w-[30%] text-[#1E293B] font-medium">
                    Candidate Name
                  </Label>
                  <span className="w-[70%] text-[#4B5563] text-sm">
                    Albort Brade
                  </span>
                </div>

                {/* Email/Mobile */}
                <div className="flex items-center gap-4">
                  <Label className="w-[30%] text-[#1E293B] font-medium">
                    Email / Mobile
                  </Label>
                  <span className="w-[70%] text-[#4B5563] text-sm">
                    albort.brade@gmail.com / 878687885
                  </span>
                </div>

                {/* Job Posting */}
                <div className="flex items-center gap-4">
                  <Label className="w-[30%] text-[#1E293B] font-medium">
                    Job Posting
                  </Label>
                  <span className="w-[70%] text-[#4B5563] text-sm">
                    Fullstack Developer
                  </span>
                </div>

                {/* Current Status */}
                <div className="flex items-center gap-4">
                  <Label className="w-[30%] text-[#1E293B] font-medium">
                    Current Status
                  </Label>
                  <span className="w-[70%] text-[#4B5563] text-sm">
                    <Badge className="bg-[#0044A3] text-white font-semibold">
                      Sourced
                    </Badge>
                  </span>
                </div>

                {/* Status Selection */}
                <div className="flex items-center gap-4">
                  <Label className="w-[30%] text-[#1E293B] font-medium">
                    Status
                  </Label>
                  <Select
                    name="status"
                    onValueChange={(value) => {
                      setStatus(value), setIsFeeded(false);
                    }}
                  >
                    <SelectTrigger className="w-[70%] px-4 py-2 border rounded-md">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Sourced</SelectItem>
                      <SelectItem value="2">L1</SelectItem>
                      <SelectItem value="3">L2</SelectItem>
                      <SelectItem value="4">L3</SelectItem>
                      <SelectItem value="5">Offered</SelectItem>
                      <SelectItem value="6">Denied</SelectItem>
                      <SelectItem value="7">Onboard</SelectItem>
                      <SelectItem value="8">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {status == "5" && (
                  <div className="flex items-center gap-4">
                    <Label className="w-[30%] text-[#1E293B] font-medium">
                      Offered Date
                    </Label>
                    <Input
                      type="date"
                      placeholder="Select Date"
                      className="w-[70%] px-4 py-2 border rounded-md"
                    />
                  </div>
                )}

                {status == "7" && (
                  <div className="flex items-center gap-4">
                    <Label className="w-[30%] text-[#1E293B] font-medium">
                      Onboard Date
                    </Label>
                    <Input
                      type="date"
                      placeholder="Select Date"
                      className="w-[70%] px-4 py-2 border rounded-md"
                    />
                  </div>
                )}
              </div>
              {(status == "2" || (["3", "4"].includes(status) && isFeeded)) && (
                <div className="space-y-6">
                  <h2 className="text-lg text-[#0044A3] font-semibold text-center mb-4">
                    Schedule Interview
                  </h2>
                  <div className="space-y-4">
                    {/* Interview Date */}
                    <div className="flex items-center gap-4">
                      <Label className="w-[30%] text-[#1E293B] font-medium">
                        Interview Date
                      </Label>
                      <Input
                        type="date"
                        placeholder="Select Date"
                        className="w-[70%] px-4 py-2 border rounded-md"
                      />
                    </div>

                    {/* Interview Time */}
                    <div className="flex items-center gap-4">
                      <Label className="w-[30%] text-[#1E293B] font-medium">
                        Interview Time
                      </Label>
                      <Input
                        type="time"
                        placeholder="Select Time"
                        className="w-[70%] px-4 py-2 border rounded-md"
                      />
                    </div>

                    {/* Interviewer Email */}
                    <div className="flex items-center gap-4">
                      <Label className="w-[30%] text-[#1E293B] font-medium">
                        Interviewer
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter Interviewer Email"
                        className="w-[70%] px-4 py-2 border rounded-md"
                      />
                    </div>

                    {/* Interview Mode */}
                    <div className="flex items-center gap-4">
                      <Label className="w-[30%] text-[#1E293B] font-medium">
                        Mode
                      </Label>
                      <Select name="mode">
                        <SelectTrigger className="w-[70%] px-4 py-2 border rounded-md">
                          <SelectValue placeholder="Select Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Online</SelectItem>
                          <SelectItem value="2">Inperson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              {["3", "4"].includes(status) && !isFeeded && (
                <div className="space-y-6">
                  <h2 className="text-lg text-[#0044A3] font-semibold text-center mb-4">
                    Submit Feedback {isFeeded}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label className="w-[30%] text-[#1E293B] font-medium">
                        Communication Skill
                      </Label>
                      <Rating />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="w-[30%] text-[#1E293B] font-medium">
                        Technical Skill
                      </Label>
                      <Rating />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="w-[30%] text-[#1E293B] font-medium">
                        Overall Ratings
                      </Label>
                      <Rating />
                    </div>
                    <div className="flex items-center gap-4">
                      <Label className="w-[30%] text-[#1E293B] font-medium">
                        Remarks
                      </Label>
                      <Textarea
                        className="w-[70%]"
                        name="remarks"
                        placeholder="Enter your remarks"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <Button
                className="bg-[#0044A3] text-white px-6 py-3 rounded-md hover:bg-blue-950"
                onClick={() => {
                  if (status === "7") {
                    setIsOpen(false);
                    setIsInvoiceOpen(true); // Open the invoice when status is "7"
                  }
                  handleSubmit({ isFeeded }); // Then, submit the form with the current feeded state
                }}
              >
                {["3", "4"].includes(status) && !isFeeded
                  ? "Submit Feedback"
                  : status === "7"
                  ? "Update & Generate Invoice"
                  : "Update"}
              </Button>

              <Button
                onClick={() => setIsOpen(false)}
                className="bg-white text-[#64748B] px-6 py-3 rounded-md border border-[#64748B] hover:bg-neutral-100"
              >
                Cancel
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <InvoiceDialog
        isInvoiceOpen={isInvoiceOpen}
        setIsInvoiceOpen={setIsInvoiceOpen}
      />
    </>
  );
};

const InvoiceDialog = ({
  isInvoiceOpen,
  setIsInvoiceOpen,
}: {
  isInvoiceOpen: boolean;
  setIsInvoiceOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
    <DialogContent className="rounded-lg">
      <DialogHeader>
        <DialogTitle className="my-1 text-lg text-[#0044A3] text-center">
          Generate New Invoice
        </DialogTitle>
      </DialogHeader>
      <div className="flex justify-between items-center gap-4">
        <Label className="w-[30%] text-[#1E293B] font-medium">
          Candidate Name
        </Label>
        <span className="w-[70%] text-[#4B5563] text-sm">Albort Brade</span>
      </div>

      {/* Email/Mobile */}
      <div className="flex items-center gap-4">
        <Label className="w-[30%] text-[#1E293B] font-medium">
          Email / Mobile
        </Label>
        <span className="w-[70%] text-[#4B5563] text-sm">
          albort.brade@gmail.com / 878687885
        </span>
      </div>

      {/* Job Posting */}
      <div className="flex items-center gap-4">
        <Label className="w-[30%] text-[#1E293B] font-medium">
          Job Posting
        </Label>
        <span className="w-[70%] text-[#4B5563] text-sm">
          Fullstack Developer
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Label className="w-[30%] text-[#1E293B] font-medium">Onboard On</Label>
        <span className="w-[70%] text-[#4B5563] text-sm">20-04-2025</span>
      </div>
      <div className="flex items-center gap-4">
        <Label className="w-[30%] text-[#1E293B] font-medium">
          Recruited By
        </Label>
        <span className="w-[70%] text-[#4B5563] text-sm">Sivanathan T</span>
      </div>
      <div className="flex items-center gap-4">
        <Label className="w-[30%] text-[#1E293B] font-medium">
          Assigned By
        </Label>
        <span className="w-[70%] text-[#4B5563] text-sm">Janani</span>
      </div>
      <div className="flex items-center gap-4">
        <Label className="w-[30%] text-[#1E293B] font-medium">
          Invoice Amount
        </Label>
        <span className="w-[70%] text-[#4B5563] text-sm">$1200</span>
      </div>
      <div className="flex justify-center gap-6 my-3">
        <Button
          className="bg-[#0044A3] text-white px-6 py-3 rounded-md hover:bg-blue-950"
          onClick={() => setIsInvoiceOpen(false)}
        >
          Generate Invoice
        </Button>
        <Button
          onClick={() => setIsInvoiceOpen(false)}
          className="bg-white text-[#64748B] px-6 py-3 rounded-md border border-[#64748B] hover:bg-neutral-100"
        >
          Cancel
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

const Rating = () => {
  // Initial rating state is set to 0
  const [rating, setRating] = useState(0);

  // Handle click on star to update rating
  const handleRating = (index: number) => {
    setRating(index + 1); // Set rating to the clicked star's index + 1
  };

  // Generate the star icons
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span
        key={i}
        onClick={() => handleRating(i)}
        style={{
          cursor: "pointer",
          color: i < rating ? "gold" : "gray",
          fontSize: "30px",
        }}
      >
        ★
      </span>
    );
  }

  return (
    <div>
      <div>{stars}</div>
    </div>
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
    <PopoverTrigger asChild className="mt-7">
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
