import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Edit2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import PaginationSection from "@/components/ui/page";
import NoData from "@/components/ui/nodata";
import SortBy from "@/components/ui/sortby";
import { ucFirst } from "../../utils/common";
import InputField from "@/components/ui/inputfield";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

type Candidate = {
  name: string;
  mobile: string;
  email: string;
  title: string;
  company: string;
  status: string;
  recruiters: string[];
  interviewers: string[];
};

const CandidateStatus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [options, setOptions] = useState<{
    clients: { id: string; name: string }[];
    jobs: { id: string; name: string }[];
    recruiters: { id: string; name: string }[];
  }>({
    clients: [],
    jobs: [],
    recruiters: [],
  });
  const [filterClient, setFilterClient] = useState("");
  const [filterJob, setFilterJob] = useState("");
  const [filterRecruiter, setFilterRecruiter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const limit = 20;
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const getOptions = () => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "candidate-status-options",
        },
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setOptions(response.data.data);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const loadCandidates = () => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "candidate-status-list",
          page: page,
          limit: limit,
          filterClient: filterClient,
          filterJob: filterJob,
          filterRecruiter: filterRecruiter,
          sortby: sortBy,
          searchby: search,
        },
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setCandidates(response.data.data);
          setTotal(75); // Assuming the total count is returned in the response
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    getOptions();
  }, []);
  useEffect(() => {
    loadCandidates();
  }, [filterClient, filterJob, filterRecruiter, sortBy, search, page]);

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
        data={candidates}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSortBy={setSortBy}
        setSearch={setSearch}
        setFilterClient={setFilterClient}
        setFilterJob={setFilterJob}
        setFilterRecruiter={setFilterRecruiter}
        options={options}
      />
      <UpdateStatusDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      <PaginationSection
        total={total}
        limit={limit}
        page={page}
        setPage={setPage}
      />
      <Toaster />
    </div>
  );
};

const CardSection = ({
  data,
  isOpen,
  setIsOpen,
  setSortBy,
  setSearch,
  setFilterClient,
  setFilterJob,
  setFilterRecruiter,
  options,
}: {
  data: any;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setFilterClient: React.Dispatch<React.SetStateAction<string>>;
  setFilterJob: React.Dispatch<React.SetStateAction<string>>;
  setFilterRecruiter: React.Dispatch<React.SetStateAction<string>>;
  options: {
    clients: { id: string; name: string }[];
    jobs: { id: string; name: string }[];
    recruiters: { id: string; name: string }[];
  };
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
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
    <div className="my-5 p-4 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-col flex-1 gap-2">
          <Label className="text-gray-800 text-sm font-medium">
            Client Name
          </Label>
          <Select
            name="client"
            onValueChange={(value) => setFilterClient(value)}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="Select Client Name" />
            </SelectTrigger>
            <SelectContent>
              {options.clients.map(
                (data: { id: string; name: string }, index: number) => (
                  <SelectItem key={index} value={data.id}>
                    {data.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col flex-1 gap-2">
          <Label className="text-gray-800 text-sm font-medium">
            Job Postings
          </Label>
          <Select
            name="jobPostings"
            onValueChange={(value) => setFilterJob(value)}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="Select Job Postings" />
            </SelectTrigger>
            <SelectContent>
              {options.jobs.map(
                (data: { id: string; name: string }, index: number) => (
                  <SelectItem key={index} value={data.id}>
                    {data.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col flex-1 gap-2">
          <Label className="text-gray-800 text-sm font-medium">Recruiter</Label>
          <Select
            name="recruiter"
            onValueChange={(value) => setFilterRecruiter(value)}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="Select Recruiter" />
            </SelectTrigger>
            <SelectContent>
              {options.recruiters.map(
                (data: { id: string; name: string }, index: number) => (
                  <SelectItem key={index} value={data.id}>
                    {data.name}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4 pt-11 mb-4">
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
              {ucFirst(status)}
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
      {data?.length > 0 ? (
        data.map((card, index) => (
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
                  <Mail size={12} className="mr-1" />
                  {card.email}
                </div>
                <div className="flex items-center text-[10px]">
                  <Phone size={12} className="mr-1" />
                  {card.mobile}
                </div>
              </div>
            </div>

            {type !== "sourced" && (
              <div className="mt-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-semibold mb-1">Recruiters</p>
                    <div className="flex flex-col gap-1">
                      {card.recruiters.map((recruiter, recruiterIndex) => (
                        <p key={recruiterIndex} className="text-[10px]">
                          {recruiter}
                        </p>
                      ))}
                    </div>
                  </div>

                  {["l1", "l2", "l3"].includes(type) && (
                    <div className="flex flex-col">
                      <p className="text-[10px] font-semibold mb-1">
                        Interviewers
                      </p>
                      <div className="flex flex-col gap-1">
                        {card.interviewers.map(
                          (interviewer, interviewerIndex) => (
                            <p key={interviewerIndex} className="text-[10px]">
                              {interviewer}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <NoData />
      )}
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

export default CandidateStatus;
