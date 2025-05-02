import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Menu as MenuIcon,
  Pencil,
  Trash2,
  List,
  LayoutGrid,
  MapPin,
  EllipsisVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import ReactSelect from "react-select";
import { Slider } from "@/components/ui/slider";
import { Menu } from "@headlessui/react";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import InputField from "@/components/ui/inputfield";
import Location from "@/components/ui/location";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import PaginationSection from "@/components/ui/page";
import NoData from "@/components/ui/nodata";
import SortBy from "@/components/ui/sortby";
import { ucFirst } from "../../utils/common";

const tableHeaderClass = "text-[#0044A3] font-semibold text-sm py-3 px-6";
const cellClass = "text-sm font-medium text-gray-700 py-3 px-6";

interface jobPost {
  clientName: string;
  jobTitle: string;
  positions: string;
  experience: string;
  jobType: string;
  location: string;
  status: string;
  description: string;
  recruiters: string[];
  remote: string;
  title: string;
  company: string;
}

const JobPosting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [jobPostings, setJobPostings] = useState<jobPost[]>([]);
  const [filterBy, setFilterBy] = useState("0");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const limit = 20;
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [options, setOptions] = useState<{
    clients: { id: string; name: string }[];
    recruiters: { value: string; label: string }[];
  }>({
    clients: [],
    recruiters: [],
  });

  const getOptions = () => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "jobposting-options",
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

  const loadJobPostings = () => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "job-postings",
          page: page,
          limit: limit,
          filterby: filterBy,
          sortby: sortBy,
          searchby: search,
        },
      })
      .then((response) => {
        setJobPostings(response.data.data);
        setTotal(75);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    getOptions();
  }, []);

  useEffect(() => {
    loadJobPostings();
  }, [filterBy, sortBy, search, page]);

  const [deleteId, setDeleteId] = useState("0");

  const [formData, setFormData] = useState<any>({
    id: "",
    jobTitle: "",
    clientName: "",
    currency: "1",
    ctc: "",
    country: "",
    city: "",
    commissionType: "",
    commissionValue: "",
    status: "",
    workMode: "",
    assignRecruiter: [],
    positionCount: "",
    openDate: "",
    closingDate: "",
    description: "",
    descriptionFile: null,
  });

  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-bold text-[#475569]">Job Postings</h1>
        <p className="text-sm text-[#475569] mt-2 text-center">
          Create, update, and organize job openings — all in one control center.
        </p>
      </div>
      <CardSection
        data={jobPostings}
        setIsOpen={setIsOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        setFilterBy={setFilterBy}
        setSortBy={setSortBy}
        setSearch={setSearch}
        setDeleteId={setDeleteId}
        setFormData={setFormData}
        formData={formData}
      />
      <PaginationSection
        total={total}
        limit={limit}
        page={page}
        setPage={setPage}
      />
      <AddJobPostingDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        loadJobPostings={loadJobPostings}
        setFormData={setFormData}
        formData={formData}
        options={options}
      />
      <DeleteDialog
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        deleteId={deleteId}
        loadJobPostings={loadJobPostings}
      />
      <Toaster />
    </div>
  );
};

const CardSection = ({
  data,
  setIsOpen,
  setIsDeleteOpen,
  setFilterBy,
  setSortBy,
  setSearch,
  setDeleteId,
  setFormData,
  formData,
}: {
  data: jobPost[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterBy: React.Dispatch<React.SetStateAction<string>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setDeleteId: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: React.Dispatch<React.SetStateAction<any>>;
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

  const editData = ({ id }: { id: string }) => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "edit-job",
          id: id,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setFormData({
          id: data.id,
          jobTitle: data.jobTitle,
          clientName: data.clientName,
          currency: data.currency,
          ctc: data.ctc,
          country: data.country,
          city: data.city,
          commissionType: data.commissionType,
          commissionValue: data.commissionValue,
          status: data.status,
          workMode: data.workMode,
          assignRecruiter: data.assignRecruiter,
          positionCount: data.positionCount,
          openDate: data.openDate,
          closingDate: data.closingDate,
          description: data.description,
          descriptionFile: data.descriptionFile,
        });
        setIsOpen(true);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const deleteData = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
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
              {idx === 0 && <MenuIcon className="h-4 w-4" />}
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
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Job Posting
          </Button>
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
          <ClientTable
            data={data}
            setIsOpen={setIsOpen}
            setIsDeleteOpen={setIsDeleteOpen}
            setDeleteId={setDeleteId}
            setFormData={setFormData}
            formData={formData}
            editData={editData}
            deleteData={deleteData}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 cursor-pointer gap-4 pt-3 pb-10">
            <JobCardSection
              data={data}
              setIsOpen={setIsOpen}
              setIsDeleteOpen={setIsDeleteOpen}
              setDeleteId={setDeleteId}
              setFormData={setFormData}
              formData={formData}
              editData={editData}
              deleteData={deleteData}
            />
          </div>
        )
      ) : (
        <NoData />
      )}
    </>
  );
};

const ClientTable = ({
  data,
  setIsOpen,
  setIsDeleteOpen,
  setDeleteId,
  setFormData,
  editData,
  deleteData,
}: {
  data: jobPost[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteId: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  editData: () => void;
  deleteData: () => void;
}) => {
  return (
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
            <TableHead className={tableHeaderClass}>Action</TableHead>
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

              <TableCell className={cellClass}>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    size="icon"
                    onClick={() => editData({ id: jopPost.id })}
                  >
                    <Pencil
                      className="h-5 w-5 cursor-pointer hover:text-blue-500 transition-colors"
                      aria-label="Edit Job Posting"
                    />
                  </Button>
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    size="icon"
                    onClick={() => deleteData(jopPost.id)}
                  >
                    <Trash2
                      className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors"
                      aria-label="Delete Job Posting"
                    />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const AddJobPostingDialog = ({
  isOpen,
  setIsOpen,
  loadJobPostings,
  setFormData,
  formData,
  options,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadJobPostings: () => void;
  setFormData: React.Dispatch<React.SetStateAction<jobPost>>;
  formData: any;
  options: {
    clients: { id: string; name: string }[];
    recruiters: { value: string; label: string }[];
  };
}) => {
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [range, setRange] = useState<[number, number]>([3, 6]);

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.jobTitle) newErrors.jobTitle = "Job title is required";
    if (!formData.clientName) newErrors.clientName = "Client name is required";
    if (!formData.ctc) newErrors.ctc = "CTC is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.commissionType)
      newErrors.commissionType = "Commission type is required";
    if (!formData.commissionValue)
      newErrors.commissionValue = "Commission value is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.workMode) newErrors.workMode = "Work mode is required";
    if (!formData.assignRecruiter.length)
      newErrors.assignRecruiter = "Recruiter assignment is required";
    if (!formData.positionCount)
      newErrors.positionCount = "Position count is required";
    if (!formData.openDate) newErrors.openDate = "Open date is required";
    if (!formData.closingDate)
      newErrors.closingDate = "Closing date is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.descriptionFile && !formData.id)
      newErrors.descriptionFile = "Job description file is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev: any) => ({
        ...prev,
        [name]: files?.[0] || null,
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSliderChange = (newRange: [number, number]) => {
    setRange(newRange);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            data.append(key, JSON.stringify(value));
          } else {
            data.append(key, value);
          }
        }
      });
      data.append("experienceMin", range[0].toString());
      data.append("experienceMax", range[1].toString());
      data.append("type", "add-job-posting");

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
          jobTitle: "",
          clientName: "",
          currency: "1",
          ctc: "",
          country: "",
          city: "",
          commissionType: "fixed",
          commissionValue: "",
          status: "open",
          workMode: "onsite",
          assignRecruiter: [],
          positionCount: "",
          openDate: "",
          closingDate: "",
          description: "",
          descriptionFile: null,
        });
        setRange([3, 6]);
        setErrors({});
        setIsOpen(false);
        toast.success(
          `Job posting ${formData.id ? "updated" : "added"} successfully`
        );
        loadJobPostings();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecruiterChange = (selectedOptions: any) => {
    setFormData((prev: any) => ({
      ...prev,
      assignRecruiter: selectedOptions
        ? selectedOptions.map((opt: any) => opt.value)
        : [],
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent
        style={{ maxWidth: "80%", maxHeight: "90vh", overflowY: "auto" }}
      >
        <DialogHeader>
          <DialogTitle className="my-4 text-xl text-[#0044A3] font-bold text-center">
            Add Job Posting
          </DialogTitle>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5">
            {/* Row 1 */}
            <InputField
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              error={errors.jobTitle}
              max="250"
              placeholder="Enter the Job Title"
            />

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">
                Prefered Experience
              </Label>
              <div className="w-[70%] flex justify-between items-center gap-2">
                <Slider
                  className="w-[70%]"
                  defaultValue={[0, 6]}
                  min={0}
                  max={30}
                  value={range}
                  onValueChange={handleSliderChange}
                />
                <p className="w-[30%] text-sm ">
                  <Badge className="bg-blue-400 rounded-full px-2 py-1 text-white font-bold">
                    {range[0]} - {range[1]} Years
                  </Badge>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Client Name</Label>
              <div className="flex flex-col gap-1 w-[70%]">
                <Select
                  name="clientName"
                  onValueChange={(val) =>
                    handleChange({
                      target: { name: "clientName", value: val },
                    } as any)
                  }
                  defaultValue=""
                  value={formData.clientName}
                >
                  <SelectTrigger className="w-full placeholder:text-[13px] px-4 py-5">
                    <SelectValue placeholder="Select Client" />
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
                {errors.clientName && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.clientName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">CTC/Year</Label>
              <div className="flex flex-col gap-1 w-[70%]">
                <div className="flex justify-between gap-1">
                  <Select
                    name="currency"
                    onValueChange={(val) =>
                      handleChange({
                        target: { name: "currency", value: val },
                      } as any)
                    }
                    defaultValue=""
                    value={formData.currency}
                  >
                    <SelectTrigger className="w-[30%] placeholder:text-[13px] px-4 py-5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">$</SelectItem>
                      <SelectItem value="2">₹</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    name="ctc"
                    type="number"
                    placeholder="Enter the Expected CTC"
                    value={formData.ctc}
                    onChange={handleChange}
                    className="w-[70%] placeholder:text-[12px] px-4 py-5"
                  />
                </div>
                {errors.ctc && (
                  <p className="text-red-500 text-xs mt-1 ml-2">{errors.ctc}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Location</Label>
              <Location
                className="w-[70%]"
                initialCountry={formData.country}
                initialCity={formData.city}
                onCountryChange={(country: string) =>
                  setFormData((prev: jobPost) => ({ ...prev, country }))
                }
                onCityChange={(city: string) =>
                  setFormData((prev: jobPost) => ({ ...prev, city }))
                }
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Commission Type</Label>
              <div className="w-[70%] flex flex-col gap-1">
                <Select
                  defaultValue=""
                  name="commissionType"
                  value={formData.commissionType}
                  onValueChange={(val) =>
                    handleSelectChange("commissionType", val)
                  }
                >
                  <SelectTrigger className="w-full placeholder:text-[13px] px-4 py-5">
                    <SelectValue placeholder="Select Commission Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
                {errors.commissionType && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.commissionType}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="w-[30%] ">Commission Value</Label>
              <div className="w-[70%] flex flex-col gap-1">
                <Input
                  name="commissionValue"
                  type="number"
                  value={formData.commissionValue}
                  onChange={handleChange}
                  placeholder="Enter the Commission Value"
                />
                {errors.commissionValue && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.commissionValue}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Status</Label>
              <div className="w-[70%] flex flex-col gap-1">
                <Select
                  name="status"
                  defaultValue=""
                  value={formData.status}
                  onValueChange={(val) => handleSelectChange("status", val)}
                >
                  <SelectTrigger className="w-full placeholder:text-[13px] px-4 py-5">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="hold">On-Hold</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.status}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Work Mode</Label>
              <div className="w-[70%] flex flex-col gap-1">
                <Select
                  name="workMode"
                  defaultValue=""
                  value={formData.workMode}
                  onValueChange={(val) => handleSelectChange("workMode", val)}
                >
                  <SelectTrigger className="w-full placeholder:text-[13px] px-4 py-5">
                    <SelectValue placeholder="Select Work Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onsite">On-Site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
                {errors.workMode && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.workMode}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Assign Recruiter</Label>
              <div className="w-[70%] flex flex-col gap-1">
                <ReactSelect
                  onChange={handleRecruiterChange}
                  name="assignRecruiter"
                  className="w-full text-sm"
                  isMulti
                  options={options.recruiters}
                  value={options.recruiters.filter((opt) =>
                    formData.assignRecruiter.includes(opt.value)
                  )}
                />
                {errors.assignRecruiter && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.assignRecruiter}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Position Count</Label>
              <div className="w-[70%] flex flex-col gap-1">
                <Input
                  type="number"
                  value={formData.positionCount}
                  onChange={handleChange}
                  name="positionCount"
                  placeholder="Enter the Position Count"
                  className=" placeholder:text-[13px] px-4 py-5"
                />
                {errors.positionCount && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.positionCount}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Open Date</Label>
              <div className="w-[70%] flex flex-col gap-1">
                <Input
                  name="openDate"
                  type="date"
                  value={formData.openDate}
                  onChange={handleChange}
                  className="placeholder:text-[13px] px-4 py-5"
                />
                {errors.openDate && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.openDate}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Closing Date</Label>
              <div className="w-[70%] flex flex-col gap-1">
                <Input
                  name="closingDate"
                  type="date"
                  value={formData.closingDate}
                  onChange={handleChange}
                  className="placeholder:text-[13px] px-4 py-5"
                />
                {errors.closingDate && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.closingDate}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-4 col-span-2">
              <Label className="text-[#1E293B] w-[14%]">Description</Label>
              <div className="w-[86%] flex flex-col gap-1">
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter the Description"
                  className="w-full placeholder:text-[13px] px-4 py-5"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex items-center gap-4 col-span-2">
              <Label className="text-[#1E293B] w-[14%]">Upload JD</Label>
              <div className="w-[86%] flex flex-col gap-1">
                <Input
                  type="file"
                  name="descriptionFile"
                  onChange={handleChange}
                  placeholder="Upload the Job Description"
                  className="w-full placeholder:text-[13px]"
                />
                {errors.descriptionFile && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.descriptionFile}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-center gap-6 my-7">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#0044A3] rounded-[3px] hover:bg-blue-950"
              >
                {submitting ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-white rounded-[3px] hover:bg-neutral-300 border border-[#64748B] text-[#64748B]"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const DeleteDialog = ({
  isDeleteOpen,
  setIsDeleteOpen,
  deleteId,
  loadJobPostings,
}: {
  isDeleteOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteId: string;
  loadJobPostings: () => void;
}) => {
  const deleteData = () => {
    axios
      .post(`http://127.0.0.1:8000/post-data`, {
        type: "delete-job",
        id: deleteId,
      })
      .then((response) => {
        const data = response.data.data;
        setIsDeleteOpen(false);
        toast.success("Job posting deleted successfully");
        loadJobPostings();
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle className="my-1 text-lg text-[#0044A3] text-center">
            Are You Sure You Want to Delete?
          </DialogTitle>
        </DialogHeader>
        <div className="mt-1 flex flex-col gap-6">
          <p className="text-center text-sm text-[#333333]">
            This action cannot be undone.
          </p>

          {/* Confirmation Action Buttons */}
          <div className="flex justify-center gap-6 my-3">
            <Button
              onClick={deleteData}
              className="bg-red-600 text-white rounded-[3px] hover:bg-red-800"
            >
              Delete
            </Button>
            <Button
              onClick={() => setIsDeleteOpen(false)}
              className="bg-white rounded-[3px] hover:bg-neutral-300 border border-[#64748B] text-[#64748B]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const JobCardSection = ({
  data,
  setIsOpen,
  setIsDeleteOpen,
  editData,
  deleteData,
}: {
  data: jobPost[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editData: () => void;
  deleteData: () => void;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const handleHover = (index: number | null) => setHoveredIndex(index);
  const handleClick = (index: number) => setClickedIndex(index);

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
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="cursor-pointer inline-flex items-center justify-center rounded-md p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1">
                    <EllipsisVertical className="h-4 w-4" />
                  </Menu.Button>
                </div>

                <Menu.Items className="absolute right-0 z-20 mt-1 w-32 origin-top-right rounded-md bg-white shadow-md ring-1 ring-black/10 focus:outline-none text-xs">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => editData({ id: card.id })}
                          className={`flex items-center gap-1.5 w-full px-3 py-1.5 transition-colors rounded-sm ${
                            active
                              ? "bg-indigo-50 text-indigo-600"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => deleteData(card.id)}
                          className={`flex items-center gap-1.5 w-full px-3 py-1.5 transition-colors rounded-sm ${
                            active
                              ? "bg-red-50 text-red-600"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
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
                <span>{card.location}</span>
              </div>
              <span className="text-[12px] font-medium">
                {ucFirst(card.jobType)}
              </span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Assigned Recruiters
                </p>
                <div className="flex -space-x-2">
                  <div className="flex justify-between gap-1">
                    {card.recruiters.map((recruiter, recruiterIndex) => (
                      <p
                        key={recruiterIndex}
                        className="text-indigo-500 px-2 py-0.5 rounded-2xl text-[10px] bg-indigo-100"
                      >
                        {recruiterIndex + 1}. {recruiter}
                      </p>
                    ))}
                  </div>
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

export default JobPosting;
