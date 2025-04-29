import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FilePlus, Pencil, Trash2, FileMinus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Location from "@/components/ui/location";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaginationSection from "@/components/ui/page";
import NoData from "@/components/ui/nodata";
import SortBy from "@/components/ui/sortby";
import InputField from "@/components/ui/inputfield";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const tableHeaderClass = "text-[#0044A3] font-semibold text-sm py-3 px-6";
const cellClass = "text-sm font-medium text-gray-700 py-3 px-6";

interface Candidate {
  candidateName: string;
  contactNumber: string;
  email: string;
  jobRole: string;
  is_assigned: string;
}

interface Postings {
  id: string;
  title: string;
}

interface AssignData {
  id: string;
  candidateName: string;
  email: string;
  mobileNumber: string;
  postings: Postings[];
}

const Candidates = () => {
  const [clients, setClients] = useState<Candidate[]>([]);
  const [assignData, setAssignData] = useState<AssignData>({
    id: "",
    candidateName: "",
    email: "",
    mobileNumber: "",
    postings: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const limit = 20;
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [errors, setErrors] = useState<
    Partial<Omit<typeof formData, "profile"> & { profile: string | null }>
  >({});

  const loadCandidates = () => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "candidates-list",
          page: page,
          limit: limit,
          sortby: sortBy,
          searchby: search,
        },
      })
      .then((response) => {
        setClients(response.data.data);
        setTotal(75);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    loadCandidates();
  }, [sortBy, search, page]);

  interface FormData {
    id?: string;
    candidateName: string;
    contactNumber: string;
    email: string;
    jobRole: string;
    years: string;
    months: string;
    country: string;
    city: string;
    joiningDate: string;
    ctc: string;
    skills: string;
    resume: File | null;
  }

  const [formData, setFormData] = useState<FormData>({
    id: "",
    candidateName: "",
    jobRole: "",
    email: "",
    contactNumber: "",
    years: "",
    months: "",
    country: "",
    city: "",
    joiningDate: "",
    ctc: "",
    skills: "",
    resume: null,
  });

  const [deleteId, setDeleteId] = useState("0");

  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-bold text-[#475569]">
          Candidate Management
        </h1>
        <p className="text-sm text-[#475569] mt-2 text-center">
          Easily track, organize, and collaborate with candidates throughout the
          hiring process.
        </p>
      </div>
      <CardSection
        data={clients}
        setIsOpen={setIsOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        setSortBy={setSortBy}
        setSearch={setSearch}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        setDeleteId={setDeleteId}
        setAssignOpen={setAssignOpen}
        setAssignData={setAssignData}
        loadCandidates={loadCandidates}
      />
      <PaginationSection
        total={total}
        limit={limit}
        page={page}
        setPage={setPage}
      />
      <AddCandidateDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        loadCandidates={loadCandidates}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
      />
      <AssignDialog
        assignOpen={assignOpen}
        setAssignOpen={setAssignOpen}
        assignData={assignData}
        setAssignData={setAssignData}
        loadCandidates={loadCandidates}
      />
      <DeleteDialog
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        deleteId={deleteId}
        loadCandidates={loadCandidates}
      />
      <Toaster />
    </div>
  );
};

const CardSection = ({
  data,
  setIsOpen,
  setIsDeleteOpen,
  setSortBy,
  setSearch,
  setFormData,
  setErrors,
  setDeleteId,
  setAssignOpen,
  setAssignData,
  loadCandidates,
}: {
  data: Candidate[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setErrors: React.Dispatch<React.SetStateAction<object>>;
  setDeleteId: React.Dispatch<React.SetStateAction<string>>;
  setAssignOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAssignData: React.Dispatch<React.SetStateAction<AssignData>>;
  loadCandidates: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");

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
        <div className=""></div>
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
            variant="secondary"
            className="ml-4 cursor-pointer"
            onClick={() => {
              setIsOpen(true), setFormData({}), setErrors({});
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Candidate
          </Button>
        </div>
      </div>

      {data.length > 0 ? (
        <CandidateTable
          data={data}
          setIsOpen={setIsOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          setDeleteId={setDeleteId}
          setFormData={setFormData}
          setAssignOpen={setAssignOpen}
          setAssignData={setAssignData}
          loadCandidates={loadCandidates}
        />
      ) : (
        <NoData />
      )}
    </>
  );
};

const CandidateTable = ({
  data,
  setIsOpen,
  setIsDeleteOpen,
  setDeleteId,
  setFormData,
  setAssignOpen,
  setAssignData,
  loadCandidates,
}: {
  data: Candidate[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteId: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setAssignOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAssignData: React.Dispatch<React.SetStateAction<AssignData>>;
  loadCandidates: () => void;
}) => {
  const editData = ({ id }: { id: string }) => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "edit-candidate",
          id: id,
        },
      })
      .then((response) => {
        const data = response.data.data;
        console.log(data);
        setFormData({
          id: data.id,
          candidateName: data.candidateName,
          jobRole: data.jobRole,
          email: data.email,
          mobileNumber: data.contactNumber,
          years: data.exp_years,
          months: data.exp_months,
          country: data.loc_country,
          city: data.loc_city,
          joiningDate: data.joinDate,
          ctc_symble: data.exp_ctc_symble,
          ctc: data.exp_ctc_value,
          skills: data.skills,
          resume: null,
        });
        setIsOpen(true);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const assignPosting = ({ id }: { id: string }) => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "get-assign-details",
          id: id,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setAssignData({
          id: data.id,
          candidateName: data.candidateName,
          email: data.email,
          mobileNumber: data.mobileNumber,
          postings: data.postings,
        });
        setAssignOpen(true);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const unAssignPosting = ({ id }: { id: string }) => {
    axios
      .post(`http://127.0.0.1:8000/post-data`, {
        type: "un-assign",
        id: id,
      })
      .then((response) => {
        toast.success("Position un-assigned successfully");
        loadCandidates();
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
    <div className="overflow-x-auto rounded-lg my-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={tableHeaderClass}>Candidate Name</TableHead>
            <TableHead className={tableHeaderClass}>Contact Number</TableHead>
            <TableHead className={tableHeaderClass}>Email</TableHead>
            <TableHead className={tableHeaderClass}>Job Role</TableHead>
            <TableHead className={tableHeaderClass}>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((candidate, i) => (
            <TableRow key={i}>
              <TableCell className={cellClass}>
                {candidate.candidateName}
              </TableCell>
              <TableCell className={cellClass}>
                {candidate.contactNumber}
              </TableCell>
              <TableCell className={cellClass}>{candidate.email}</TableCell>
              <TableCell className={cellClass}>{candidate.jobRole}</TableCell>
              <TableCell className={cellClass}>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    size="icon"
                    onClick={() => editData(candidate.id)}
                  >
                    <Pencil className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                  </Button>
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    size="icon"
                    onClick={() => deleteData(candidate.id)}
                  >
                    <Trash2 className="h-5 w-5 cursor-pointer hover:text-red-500" />
                  </Button>
                  {!candidate.is_assigned ? (
                    <Button
                      variant="secondary"
                      className="cursor-pointer"
                      size="icon"
                      onClick={() => assignPosting(candidate.id)}
                    >
                      <FilePlus className="h-5 w-5 cursor-pointer text-blue-500 hover:text-blue-500" />
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      className="cursor-pointer"
                      size="icon"
                      onClick={() => unAssignPosting(candidate.id)}
                    >
                      <FileMinus className="h-5 w-5 cursor-pointer text-red-500 hover:text-blue-500" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const AddCandidateDialog = ({
  isOpen,
  setIsOpen,
  loadCandidates,
  formData,
  setFormData,
  errors,
  setErrors,
}: AddCandidateDialogProps) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Handle country change
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
  };

  // Handle city change
  const handleCityChange = (city) => {
    setSelectedCity(city);
  };
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: CandidateErrors = {};

    const isEmpty = (value: any) => !value || value.toString().trim() === "";

    if (isEmpty(formData.candidateName))
      newErrors.candidateName = "Candidate name is required";
    if (isEmpty(formData.jobRole)) newErrors.jobRole = "Job role is required";
    if (isEmpty(formData.email)) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (isEmpty(formData.mobileNumber))
      newErrors.mobileNumber = "Mobile number is required";
    else if (!/^\d{10,15}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Invalid mobile number";

    if (isEmpty(formData.years))
      newErrors.years = "Experience (years) is required";
    if (isEmpty(formData.months))
      newErrors.months = "Experience (months) is required";
    if (isEmpty(formData.country)) newErrors.country = "Country is required";
    if (isEmpty(formData.city)) newErrors.city = "City is required";
    if (isEmpty(formData.joiningDate))
      newErrors.joiningDate = "Joining date is required";
    if (isEmpty(formData.ctc)) newErrors.ctc = "Expected CTC is required";
    if (isEmpty(formData.skills)) newErrors.skills = "Skills are required";
    if (!formData.resume && !formData.id)
      newErrors.resume = "Resume file is required";

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
      setFormData((prev) => ({ ...prev, [name]: files?.[0] ?? null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });
      payload.append("type", "add-candidate");

      const res = await axios.post("http://127.0.0.1:8000/post-data", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success(
          `Candidate ${formData.id ? "updated" : "added"} successfully`
        );
        setFormData({
          candidateName: "",
          jobRole: "",
          email: "",
          mobileNumber: "",
          years: "",
          months: "",
          country: "",
          city: "",
          joiningDate: "",
          ctc: "",
          skills: "",
          resume: null,
          ctc_symble: "1",
        });
        setErrors({});
        setIsOpen(false);
        loadCandidates();
      }
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Failed to add candidate.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        style={{ maxWidth: "80%", maxHeight: "90vh", overflowY: "auto" }}
      >
        <DialogHeader>
          <DialogTitle className="my-4 text-xl text-[#0044A3] font-bold text-center">
            Add Candidate
          </DialogTitle>

          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5">
            <InputField
              label="Candidate Name"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleChange}
              error={errors.candidateName}
              placeholder="Enter the Candidate Name"
            />
            <InputField
              label="Job Role"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              error={errors.jobRole}
              placeholder="Enter the Job Role"
            />
            <InputField
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter the Email"
            />
            <InputField
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              error={errors.mobileNumber}
              placeholder="Enter the Mobile Number"
            />

            {/* Experience */}
            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Experience</Label>
              <div className="w-[34%] flex flex-col gap-0.5">
                <Select
                  value={formData.years}
                  onValueChange={(val) =>
                    handleChange({
                      target: { name: "years", value: val },
                    } as any)
                  }
                >
                  <SelectTrigger className="placeholder:text-[13px] px-4 py-5 w-[100%]">
                    <SelectValue placeholder="Select Years" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(30)].map((_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.years && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.years}
                  </p>
                )}
              </div>
              <div className="w-[34%] flex flex-col gap-0.5">
                <Select
                  value={formData.months}
                  onValueChange={(val) =>
                    handleChange({
                      target: { name: "months", value: val },
                    } as any)
                  }
                >
                  <SelectTrigger className="placeholder:text-[13px] px-4 py-5 w-[100%]">
                    <SelectValue placeholder="Select Months" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.months && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.months}
                  </p>
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
                  setFormData((prev: FormData) => ({ ...prev, country }))
                }
                onCityChange={(city: string) =>
                  setFormData((prev: FormData) => ({ ...prev, city }))
                }
              />
            </div>

            {/* Joining Date */}
            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Joining Date</Label>
              <div className="w-[70%] flex flex-col gap-0.5">
                <Input
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="w-full placeholder:text-[12px] px-4 py-5"
                />
                {errors.joiningDate && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.joiningDate}
                  </p>
                )}
              </div>
            </div>

            {/* CTC */}
            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">
                Expected CTC/Year
              </Label>
              <Select
                value={formData.ctc_symble}
                defaultValue="$"
                onValueChange={(val) =>
                  handleChange({
                    target: { name: "ctc_symble", value: val },
                  } as any)
                }
              >
                <SelectTrigger className="w-[15%] placeholder:text-[13px] px-4 py-5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="₹">₹</SelectItem>
                  <SelectItem value="$">$</SelectItem>
                </SelectContent>
              </Select>
              <div className="w-[55%] flex flex-col gap-0.5">
                <Input
                  name="ctc"
                  type="number"
                  value={formData.ctc}
                  onChange={handleChange}
                  placeholder="Enter the Expected CTC"
                  className="w-full placeholder:text-[12px] px-4 py-5"
                />
                {errors.ctc && (
                  <p className="text-red-500 text-xs mt-1 ml-2">{errors.ctc}</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Skills</Label>
              <div className="w-[70%] flex flex-col gap-0.5">
                <Input
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Enter the Skills"
                  className="w-full placeholder:text-[12px] px-4 py-5"
                />
                {errors.skills && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.skills}
                  </p>
                )}
              </div>
            </div>

            {/* Resume */}
            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Resume</Label>
              <div className="w-[70%] flex flex-col gap-0.5">
                <Input
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                  className="placeholder:text-[12px]"
                />
                {errors.resume && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.resume}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-6 my-6">
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
const AssignDialog = ({
  assignOpen,
  setAssignOpen,
  assignData,
  setAssignData,
  loadCandidates,
}: {
  assignOpen: boolean;
  setAssignOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assignData: AssignData;
  setAssignData: React.Dispatch<React.SetStateAction<AssignData>>;
  loadCandidates: () => void;
}) => {
  const [postings, setPostings] = useState("");
  const [postingsError, setPostingsError] = useState("");

  const saveAssign = ({ id }: { id: string }) => {
    if (!postings) {
      setPostingsError("Select Job Posting");
      return;
    }

    axios
      .post(`http://127.0.0.1:8000/post-data`, {
        type: "save-assign",
        id: id,
        postings: postings,
      })
      .then((response) => {
        console.log(response);
        toast.success("Position assigned successfully");
        loadCandidates();
        setAssignData({
          id: "",
          candidateName: "",
          email: "",
          mobileNumber: "",
          postings: [],
        });
        setAssignOpen(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
    <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="my-4 text-xl text-[#0044A3] font-bold text-center">
            Assign a Job Posting
          </DialogTitle>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Label className="w-[30%] text-[#1E293B] font-medium">
                Candidate Name
              </Label>
              <span className="w-[70%] text-[#4B5563] text-sm">
                {assignData.candidateName}
              </span>
            </div>

            {/* Email/Mobile */}
            <div className="flex items-center gap-4">
              <Label className="w-[30%] text-[#1E293B] font-medium">
                Email / Mobile
              </Label>
              <span className="w-[70%] text-[#4B5563] text-sm">
                {assignData.email} / {assignData.mobileNumber}
              </span>
            </div>

            {/* Job Postings */}
            <div className="flex items-center gap-4">
              <Label className="w-[30%] text-[#1E293B] font-medium">
                Job Postings
              </Label>
              <div className="flex flex-col w-[70%]">
                <Select
                  onValueChange={(val) => {
                    setPostings(val);
                    setPostingsError("");
                  }}
                >
                  <SelectTrigger className="w-full px-4 py-2 rounded-md border border-[#CBD5E1] focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Select Job Posting" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignData.postings && assignData.postings.length > 0 ? (
                      assignData.postings.map((data) => (
                        <SelectItem key={data.id} value={data.id}>
                          {data.title}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm p-2">
                        No postings available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {postingsError && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {postingsError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 my-6">
            <Button
              className="bg-[#0044A3] rounded-[3px] hover:bg-blue-950"
              onClick={() => saveAssign({ id: assignData.id })}
            >
              Save
            </Button>
            <Button
              onClick={() => setAssignOpen(false)}
              className="bg-white rounded-[3px] hover:bg-neutral-300 border border-[#64748B] text-[#64748B]"
            >
              Cancel
            </Button>
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
  loadCandidates,
}: {
  isDeleteOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteId: string;
  loadCandidates: () => void;
}) => {
  const deleteData = () => {
    axios
      .post(`http://127.0.0.1:8000/post-data`, {
        type: "delete-candidate",
        id: deleteId,
      })
      .then((response) => {
        const data = response.data.data;
        setIsDeleteOpen(false);
        toast.success("Candidate deleted successfully");
        loadCandidates();
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

export default Candidates;
