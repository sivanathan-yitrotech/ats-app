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
import { TagsInput } from "@/components/ui/taginput";
import { getUserToken } from "../../utils/common";
import Config from "@/config.json";
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
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

type Candidate = {
  id: string; // Added id property
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
  const [editId, setEditId] = useState("");

  const [formData, setFormData] = useState<{
    id: string; // Added id property
    offeredDate?: string;
    onboardDate?: string;
    interviewDate?: string;
    interviewTime?: string;
    interviewers?: string[];
    mode?: string;
    remarks?: string;
    communication?: number;
    technical?: number;
    overall?: number;
    isFeeded?: boolean;
  }>({
    id: "",
    offeredDate: "",
    onboardDate: "",
    interviewDate: "",
    interviewTime: "",
    interviewers: [],
    mode: "",
    remarks: "",
    communication: 0,
    technical: 0,
    overall: 0,
    isFeeded: false,
  });

  const getOptions = () => {
    axios
    .get(`${Config.api_endpoint}fetch_data/positions/list`, {
      headers: {
        Authorization: `Bearer ${getUserToken()}`,
      },
    })
      .then((response) => {
        if (response.data) {
          setOptions(response.data);
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
      .get(`${Config.api_endpoint}fetch_data/candidates/status-overview`, {
        headers: {
          Authorization: `Bearer ${getUserToken()}`,
        },
        params: {
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
          setTotal(0); // Assuming the total count is returned in the response
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const [status, setStatus] = useState("0");
  const [getData, setData] = useState([]);
  useEffect(() => {
    getOptions();
  }, []);
  useEffect(() => {
    loadCandidates();
  }, [filterClient, filterJob, filterRecruiter, sortBy, search, page]);

  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-bold text-[#475569]">Position Status</h1>
        <p className="text-sm text-[#475569] mt-2 text-center">
          Easily manage candidates at every stage of the hiring process with a
          clear, drag-and-drop workflow.
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
        setStatus={setStatus}
        setEditId={setEditId}
        status={status}
        setData={setData}
        formData={formData}
        setFormData={setFormData}
      />
      <UpdateStatusDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        loadCandidates={loadCandidates}
        editId={editId}
        setStatus={setStatus}
        getData={getData}
        status={status}
        formData={formData}
        setFormData={setFormData}
      />
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
  setEditId,
  setStatus,
  setData,
  formData,
  setFormData,
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
  setEditId: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setData: any;
  status: string;
  formData: any;
  setFormData: any;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

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
                setEditId={setEditId}
                setStatus={setStatus}
                setData={setData}
                formData={formData}
                setFormData={setFormData}
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
  setData,
  setStatus,
  setEditId,
  formData,
  setFormData,
}: {
  data: Candidate[];
  type: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setData: any;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setEditId: React.Dispatch<React.SetStateAction<string>>;
  formData: any;
  setFormData: any;
}) => {
  console.log(setEditId);
  console.log(formData);
  const editData = (id: string) => {
    axios
      .get("http://127.0.0.1:8000/get-data", {
        params: { type: "edit-status-data", id: id },
      })
      .then((response) => {
        const resData = response.data.data;
        setFormData({
          offeredDate: resData.offeredDate,
          onboardDate: resData.onboardDate,
          interviewDate: resData.interviewDate,
          interviewTime: resData.interviewTime,
          interviewers: resData.interviewers,
          mode: resData.mode,
          remarks: resData.remarks,
          communication: resData.communication,
          technical: resData.technical,
          overall: resData.overall,
          isFeeded: resData.isFeeded,
        });
        setData(resData);
        setStatus(resData.status);
        setIsOpen(true);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

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
                  onClick={() => {
                    editData(card.id);
                  }}
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
interface UpdateStatusDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadCandidates: () => void;
  editId: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  getData: any;
  status: string;
  formData: {
    id: string;
    offeredDate?: string;
    onboardDate?: string;
    interviewDate?: string;
    interviewTime?: string;
    interviewers?: string[];
    mode?: string;
    remarks?: string;
    communication?: number;
    technical?: number;
    overall?: number;
    isFeeded?: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const UpdateStatusDialog: React.FC<UpdateStatusDialogProps> = ({
  isOpen,
  setIsOpen,
  loadCandidates,
  editId,
  setStatus,
  getData,
  status,
  formData,
  setFormData,
}) => {
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (status === "offered" && !formData.offeredDate) {
      newErrors.offeredDate = "Offered Date is required.";
    }
    if (status === "onboard" && !formData.onboardDate) {
      newErrors.onboardDate = "Onboard Date is required.";
    }
    if (
      (status === "l1" ||
        (["l2", "l3"].includes(status) && formData.isFeeded)) &&
      (!formData.interviewDate ||
        !formData.interviewTime ||
        !formData.interviewers ||
        !formData.mode)
    ) {
      if (!formData.interviewDate)
        newErrors.interviewDate = "Interview Date is required.";
      if (!formData.interviewTime)
        newErrors.interviewTime = "Interview Time is required.";
      if (!formData.interviewers)
        newErrors.interviewers = "Interviewer is required.";
      if (!formData.mode) newErrors.mode = "Mode is required.";
    }

    if (["l2", "l3"].includes(status) && !formData.isFeeded) {
      if (!formData.remarks) newErrors.remarks = "Remarks are required.";
      if (!formData.communication)
        newErrors.communication = "Rate communication.";
      if (!formData.technical) newErrors.technical = "Rate technical skill.";
      if (!formData.overall) newErrors.overall = "Rate overall performance.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [invoiceData, setInvoiceData] = useState({
    id: "",
    candidateName: "",
    email: "",
    mobileNumber: "",
    jobPosting: "",
    onboardDate: "",
    recruiters: [],
    assignedBy: "",
    invoiceCurrency: "",
    invoiceAmount: "",
  });

  const getInvoiceDetails = (id: string) => {
    axios
      .get("http://127.0.0.1:8000/get-data", {
        params: { type: "get-invoice-details", id: id },
      })
      .then((response) => {
        const resData = response.data.data;
        setInvoiceData({
          id: resData.id,
          candidateName: resData.candidateName,
          email: resData.email,
          mobileNumber: resData.mobileNumber,
          jobPosting: resData.jobPosting,
          onboardDate: resData.onboardDate,
          recruiters: resData.recruiters,
          assignedBy: resData.assignedBy,
          invoiceCurrency: resData.invoiceCurrency,
          invoiceAmount: resData.invoiceAmount,
        });
        setIsOpen(false);
        setIsInvoiceOpen(true);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, String(value));
        }
      });

      if (["l2", "l3"].includes(status) && !formData.isFeeded) {
        data.append("communication", String(formData.communication));
        data.append("technical", String(formData.technical));
        data.append("overall", String(formData.overall));
      }

      data.append("status", status);
      data.append("type", "update-candidate-status");
      data.append("id", editId);

      const response = await axios.post(
        "http://127.0.0.1:8000/post-data",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setFormData({
          id: "",
          offeredDate: "",
          onboardDate: "",
          interviewDate: "",
          interviewTime: "",
          interviewers: "",
          mode: "",
          remarks: "",
          communication: 0,
          technical: 0,
          overall: 0,
          isFeeded: false,
        });

        if (!formData.isFeeded && ["l2", "l3"].includes(status)) {
          if (status != "onboard") {
            toast.success("Feedback submitted successfully");
            setFormData((prev: any) => ({ ...prev, isFeeded: true }));
          }
        } else if (
          status === "l1" ||
          (["l2", "l3"].includes(status) && formData.isFeeded)
        ) {
          if (status != "onboard") {
            toast.success("Interview scheduled successfully");
            setIsOpen(false);
          }
        } else {
          if (status != "onboard") {
            toast.success("Status updated successfully");
            setIsOpen(false);
          }
        }
        if (status === "onboard") {
          getInvoiceDetails(formData.id);
        } else {
          loadCandidates();
        }
      }
    } catch (error) {
      console.error("API submission error:", error);
      toast.error("Failed to update candidate status.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          style={
            ["l1", "l2", "l3"].includes(status)
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
                ["l1", "l2", "l3"].includes(status)
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-8"
                  : ""
              }`}
            >
              <div className="flex flex-col gap-4 justify-between">
                {/* Candidate Name */}
                <div className="flex justify-between items-center gap-4">
                  <Label className="w-[30%] text-[#1E293B] font-medium">
                    Candidate Name
                  </Label>
                  <span className="w-[70%] text-[#4B5563] text-sm">
                    {getData.candidateName || "N/A"}
                  </span>
                </div>

                {/* Email/Mobile */}
                <div className="flex items-center gap-4">
                  <Label className="w-[30%] text-[#1E293B] font-medium">
                    Email / Mobile
                  </Label>
                  <span className="w-[70%] text-[#4B5563] text-sm">
                    {getData.email} / {getData.mobileNumber}
                  </span>
                </div>

                {/* Job Posting */}
                <div className="flex items-center gap-4">
                  <Label className="w-[30%] text-[#1E293B] font-medium">
                    Job Posting
                  </Label>
                  <span className="w-[70%] text-[#4B5563] text-sm">
                    {getData.jobPosting}
                  </span>
                </div>

                {/* Current Status */}
                <div className="flex items-center gap-4">
                  <Label className="w-[30%] text-[#1E293B] font-medium">
                    Current Status
                  </Label>
                  <span className="w-[70%] text-[#4B5563] text-sm">
                    <Badge className="bg-[#0044A3] text-white font-semibold">
                      {ucFirst(getData.jobPosting)}
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
                    value={status}
                    onValueChange={(value) => {
                      setStatus(value), setFormData({ isFeeded: false });
                    }}
                  >
                    <SelectTrigger className="w-[70%] px-4 py-2 border rounded-md">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sourced">Sourced</SelectItem>
                      <SelectItem value="l1">L1</SelectItem>
                      <SelectItem value="l2">L2</SelectItem>
                      <SelectItem value="l3">L3</SelectItem>
                      <SelectItem value="offered">Offered</SelectItem>
                      <SelectItem value="onboard">Onboard</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Offered Date */}
                {status === "offered" && (
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-4">
                      <Label className="w-[30%]">Offered Date</Label>
                      <Input
                        name="offeredDate"
                        type="date"
                        value={formData.offeredDate}
                        onChange={handleInputChange}
                        className="w-[70%] px-4 py-2 border rounded-md"
                      />
                    </div>
                    {errors.offeredDate && (
                      <span className="text-red-500 text-[12px] mt-1 ml-[33%]">
                        {errors.offeredDate}
                      </span>
                    )}
                  </div>
                )}

                {/* Onboard Date */}
                {status === "onboard" && (
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-4">
                      <Label className="w-[30%]">Onboard Date</Label>
                      <Input
                        name="onboardDate"
                        type="date"
                        value={formData.onboardDate}
                        onChange={handleInputChange}
                        className="w-[70%] px-4 py-2 border rounded-md"
                      />
                    </div>
                    {errors.onboardDate && (
                      <span className="text-red-500 text-[12px] mt-1 ml-[33%]">
                        {errors.onboardDate}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Interview Scheduling */}
              {(status === "l1" ||
                (["l2", "l3"].includes(status) && formData.isFeeded)) && (
                <div className="space-y-6">
                  <h2 className="text-lg text-[#0044A3] font-semibold text-center mb-4">
                    Schedule Interview
                  </h2>
                  <div className="space-y-4">
                    {/* Interview Date */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4">
                        <Label className="w-[30%]">Interview Date</Label>
                        <Input
                          name="interviewDate"
                          type="date"
                          value={formData.interviewDate}
                          onChange={handleInputChange}
                          className="w-[70%] px-4 py-2 border rounded-md"
                        />
                      </div>
                      {errors.interviewDate && (
                        <span className="text-red-500 text-[12px] mt-1 ml-[33%]">
                          {errors.interviewDate}
                        </span>
                      )}
                    </div>

                    {/* Interview Time */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4">
                        <Label className="w-[30%]">Interview Time</Label>
                        <Input
                          name="interviewTime"
                          type="time"
                          value={formData.interviewTime}
                          onChange={handleInputChange}
                          className="w-[70%] px-4 py-2 border rounded-md"
                        />
                      </div>
                      {errors.interviewTime && (
                        <span className="text-red-500 text-[12px] mt-1 ml-[33%]">
                          {errors.interviewTime}
                        </span>
                      )}
                    </div>

                    {/* Interviewer */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4">
                        <Label className="w-[30%]">Interviewer</Label>
                        <div className="w-[70%]">
                          <TagsInput
                            value={formData.interviewers}
                            onChange={(tags) =>
                              setFormData((prev: typeof formData) => ({
                                ...prev,
                                interviewers: tags,
                              }))
                            }
                            placeholder="Enter Interviewers"
                          />
                        </div>
                      </div>
                      {errors.interviewers && (
                        <span className="text-red-500 text-[12px] mt-1 ml-[33%]">
                          {errors.interviewers}
                        </span>
                      )}
                    </div>

                    {/* Interview Mode */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4">
                        <Label className="w-[30%]">Mode</Label>
                        <Select
                          name="mode"
                          value={formData.mode}
                          onValueChange={(val) =>
                            setFormData((prev: typeof formData) => ({
                              ...prev,
                              mode: val,
                            }))
                          }
                        >
                          <SelectTrigger className="w-[70%] px-4 py-2 border rounded-md">
                            <SelectValue placeholder="Select Mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Online</SelectItem>
                            <SelectItem value="2">Inperson</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.mode && (
                        <span className="text-red-500 text-[12px] mt-1 ml-[33%]">
                          {errors.mode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Submission */}
              {["l2", "l3"].includes(status) && !formData.isFeeded && (
                <div className="space-y-6">
                  <h2 className="text-lg text-[#0044A3] font-semibold text-center mb-4">
                    Submit Feedback
                  </h2>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4">
                        <Label className="w-[30%]">Communication Skill</Label>
                        <Rating
                          value={formData.communication ?? 0}
                          onChange={(value) =>
                            setFormData((prev: typeof formData) => ({
                              ...prev,
                              communication: value,
                            }))
                          }
                        />
                      </div>
                      {errors.communication && (
                        <span className="text-red-500 text-[12px] mt-1 ml-[33%]">
                          {errors.communication}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4">
                        <Label className="w-[30%]">Technical Skill</Label>
                        <Rating
                          value={formData.technical ?? 0}
                          onChange={(value) =>
                            setFormData((prev: typeof formData) => ({
                              ...prev,
                              technical: value,
                            }))
                          }
                        />
                      </div>
                      {errors.technical && (
                        <span className="text-red-500 text-[12px] mt-1 ml-[33%]">
                          {errors.technical}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4">
                        <Label className="w-[30%]">Overall Ratings</Label>
                        <Rating
                          value={formData.overall ?? 0}
                          onChange={(value) =>
                            setFormData((prev: typeof formData) => ({
                              ...prev,
                              overall: value,
                            }))
                          }
                        />
                      </div>
                      {errors.overall && (
                        <span className="text-red-500 text-[12px] mt-1 ml-[33%]">
                          {errors.overall}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-4">
                        <Label className="w-[30%]">Remarks</Label>
                        <Textarea
                          name="remarks"
                          value={formData.remarks}
                          onChange={handleInputChange}
                          className="w-[70%]"
                          placeholder="Enter your remarks"
                        />
                      </div>
                      {errors.remarks && (
                        <span className="text-red-500 text-[12px] mt-1 ml-[33%]">
                          {errors.remarks}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <Button
                disabled={submitting}
                className="bg-[#0044A3] text-white px-6 py-3 rounded-md hover:bg-blue-950"
                onClick={handleSubmit}
              >
                {submitting
                  ? ["l2", "l3"].includes(status) && formData.isFeeded
                    ? "Submitting..."
                    : status === "onboard"
                    ? "Generating..."
                    : "Updating..."
                  : ["l2", "l3"].includes(status) && !formData.isFeeded
                  ? "Submit Feedback"
                  : status === "onboard"
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

      {/* Invoice Dialog */}
      <InvoiceDialog
        isInvoiceOpen={isInvoiceOpen}
        setIsInvoiceOpen={setIsInvoiceOpen}
        invoiceData={invoiceData}
        loadCandidates={loadCandidates}
      />
    </>
  );
};

const InvoiceDialog = ({
  isInvoiceOpen,
  setIsInvoiceOpen,
  invoiceData,
  loadCandidates,
}: {
  isInvoiceOpen: boolean;
  setIsInvoiceOpen: React.Dispatch<React.SetStateAction<boolean>>;
  invoiceData: any;
  loadCandidates: () => void;
}) => {
  const generateInvoice = async (id: string) => {
    try {
      const data = new FormData();
      data.append("type", "generate-invoice");
      data.append("id", id);

      const response = await axios.post(
        "http://127.0.0.1:8000/post-data",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setIsInvoiceOpen(false);
        toast.success("Invoice Generated successfully");
        loadCandidates();
      }
    } catch (error) {
      console.error("API submission error:", error);
      toast.error("Failed to update candidate status.");
    }
  };

  return (
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
          <span className="w-[70%] text-[#4B5563] text-sm">
            {invoiceData.candidateName}
          </span>
        </div>

        {/* Email/Mobile */}
        <div className="flex items-center gap-4">
          <Label className="w-[30%] text-[#1E293B] font-medium">
            Email / Mobile
          </Label>
          <span className="w-[70%] text-[#4B5563] text-sm">
            {invoiceData.email} / {invoiceData.mobileNumber}
          </span>
        </div>

        {/* Job Posting */}
        <div className="flex items-center gap-4">
          <Label className="w-[30%] text-[#1E293B] font-medium">
            Job Posting
          </Label>
          <span className="w-[70%] text-[#4B5563] text-sm">
            {invoiceData.jobPosting}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Label className="w-[30%] text-[#1E293B] font-medium">
            Onboard On
          </Label>
          <span className="w-[70%] text-[#4B5563] text-sm">
            {invoiceData.onboardDate}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Label className="w-[30%] text-[#1E293B] font-medium">
            Recruited By
          </Label>
          <div className="w-[70%]">
            <div className="flex gap-1">
              {invoiceData.recruiters.map((rec: string, ind: number) => (
                <span
                  key={ind}
                  className="bg-blue-300 text-[#4B5563] text-[12px] px-2 py-1 rounded-xl"
                >
                  {rec}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Label className="w-[30%] text-[#1E293B] font-medium">
            Assigned By
          </Label>
          <span className="w-[70%] text-[#4B5563] text-sm">
            {invoiceData.assignedBy}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Label className="w-[30%] text-[#1E293B] font-medium">
            Invoice Amount
          </Label>
          <span className="w-[70%] text-[#4B5563] text-sm">
            {invoiceData.invoiceCurrency}
            {invoiceData.invoiceAmount}
          </span>
        </div>
        <div className="flex justify-center gap-6 my-3">
          <Button
            className="bg-[#0044A3] text-white px-6 py-3 rounded-md hover:bg-blue-950"
            onClick={() => generateInvoice(invoiceData.id)}
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
};

const Rating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  // Generate the star icons
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span
        key={i}
        onClick={() => onChange(i + 1)} // Call onChange with the new rating
        style={{
          cursor: "pointer",
          color: i < value ? "gold" : "gray",
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
