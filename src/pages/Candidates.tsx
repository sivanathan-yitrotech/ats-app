import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronsUpDown,
  FilePlus,
  FileMinus,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { TagsInput } from "react-tag-input-component";

// Sample clients data
const jobRoles = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "Marketing Specialist",
  "Business Analyst",
  "HR Manager",
  "Sales Representative",
  "Project Manager",
  "Content Writer",
];

const clients = Array(10)
  .fill(null)
  .map((_, i) => ({
    candidateName: `Client ${i + 1}`,
    contactNumber: `123-456-789${String(i).padStart(2, "0")}`,
    email: `client${i + 1}@example.com`,
    jobRole: jobRoles[i],
  }));

interface Client {
  candidateName: string;
  contactNumber: string;
  email: string;
  jobRole: string;
}

const Candidates = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [skills, setSkills] = useState([]);

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
        setAssignOpen={setAssignOpen}
      />
      <PaginationSection />
      <AddCandidateDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSkills={setSkills}
      />
      <AssignDialog assignOpen={assignOpen} setAssignOpen={setAssignOpen} />
      <DeleteDialog
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
      />
    </div>
  );
};

const CardSection = ({
  data,
  setIsOpen,
  setIsDeleteOpen,
  setAssignOpen,
}: {
  data: Client[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAssignOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [active, setActive] = useState("0");

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
        <div className=""></div>
        <div className="flex items-center gap-4 py-1 mb-4">
          <Input
            type="text"
            placeholder="Search"
            className="w-[200px] placeholder:text-[12px] px-4 py-5"
            onChange={(e) => console.log(e.target.value)} // Placeholder for search logic
          />
          <SortBy
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={setValue}
            sortBy={sortBy}
          />
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Candidate
          </Button>
        </div>
      </div>

      <ClientTable
        data={data}
        setIsOpen={setIsOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        setAssignOpen={setAssignOpen}
      />
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

const ClientTable = ({
  data,
  setIsOpen,
  setIsDeleteOpen,
  setAssignOpen,
}: {
  data: Client[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAssignOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
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
        {data.map((client, i) => (
          <TableRow key={i}>
            <TableCell className={cellClass}>{client.candidateName}</TableCell>
            <TableCell className={cellClass}>{client.contactNumber}</TableCell>
            <TableCell className={cellClass}>{client.email}</TableCell>
            <TableCell className={cellClass}>{client.jobRole}</TableCell>
            <TableCell className={cellClass}>
              <div className="flex items-center space-x-3">
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  size="icon"
                  onClick={() => setIsOpen(true)}
                >
                  <Pencil className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                </Button>
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  size="icon"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 className="h-5 w-5 cursor-pointer hover:text-red-500" />
                </Button>
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  size="icon"
                  onClick={() => setAssignOpen(true)}
                >
                  <FilePlus className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const AddCandidateDialog = ({
  isOpen,
  setIsOpen,
  setSkills,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
}) => (
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
            name="clientName"
            placeholder="Enter the Candidate Name"
          />
          <InputField
            label="Job Role"
            name="jobRole"
            placeholder="Enter the job role"
          />
          <InputField
            label="Email ID"
            name="email"
            placeholder="Enter the Email ID"
          />
          <InputField
            label="Mobile Number"
            name="mobileNumber"
            placeholder="Enter the Mobile Number"
          />
          <div className="flex items-center gap-4">
            <Label className="text-[#1E293B] w-[30%]">Experience</Label>
            <Select name="years">
              <SelectTrigger className="w-[34%] placeholder:text-[13px] px-4 py-5">
                <SelectValue placeholder="Select Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
              </SelectContent>
            </Select>
            <Select name="months">
              <SelectTrigger className="w-[34%] placeholder:text-[13px] px-4 py-5">
                <SelectValue placeholder="Select Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-[#1E293B] w-[30%]">Location</Label>
            <Select name="Country">
              <SelectTrigger className="w-[34%] placeholder:text-[13px] px-4 py-5">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">India</SelectItem>
                <SelectItem value="2">America</SelectItem>
                <SelectItem value="3">Canada</SelectItem>
              </SelectContent>
            </Select>
            <Select name="months">
              <SelectTrigger className="w-[34%] placeholder:text-[13px] px-4 py-5">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">New Delhi</SelectItem>
                <SelectItem value="2">Mumbai</SelectItem>
                <SelectItem value="3">New York City</SelectItem>
                <SelectItem value="4">Los Angeles</SelectItem>
                <SelectItem value="5">Toronto</SelectItem>
                <SelectItem value="6">Vancouver</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-[#1E293B] w-[30%]">Joining Date</Label>
            <Input
              name="joiningDate"
              type="date"
              className="w-[70%] placeholder:text-[12px] px-4 py-5"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-[#1E293B] w-[30%]">Expected CTC/Year</Label>
            <Select name="Country" defaultValue="1">
              <SelectTrigger className="w-[15%] placeholder:text-[13px] px-4 py-5">
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
              className="w-[55%] placeholder:text-[12px] px-4 py-5"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-[#1E293B] w-[30%]">Skills</Label>
            <Input
              name="skills"
              type="text"
              placeholder="Enter the Skills"
              className="w-[70%] placeholder:text-[12px] px-4 py-5"
              onChange={(e) => setSkills(e.target.value.split(","))} // Placeholder for skills logic
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-[#1E293B] w-[30%]">Resume</Label>
            <Input
              name="resume"
              type="file"
              placeholder="Upload Resume"
              className="w-[70%] placeholder:text-[12px]"
            />
          </div>
        </div>

        <div className="flex justify-center gap-6 my-6">
          <Button className="bg-[#0044A3] rounded-[3px] hover:bg-blue-950">
            Save
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

const AssignDialog = ({
  assignOpen,
  setAssignOpen,
}: {
  assignOpen: boolean;
  setAssignOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
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
            <span className="w-[70%] text-[#4B5563] text-sm">Albort Brade</span>
          </div>

          {/* Email/Mobile */}
          <div className="flex items-center gap-4">
            <Label className="w-[30%] text-[#1E293B] font-medium">
              Email/Mobile
            </Label>
            <span className="w-[70%] text-[#4B5563] text-sm">
              albort.brade@gmail.com / 878687885
            </span>
          </div>

          {/* Job Postings */}
          <div className="flex items-center gap-4">
            <Label className="w-[40%] text-[#1E293B] font-medium">
              Job Postings
            </Label>
            <Select name="months" className="w-[60%]">
              <SelectTrigger className="w-full px-4 py-2 rounded-md border border-[#CBD5E1] focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select Job Posting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">PHP Developer</SelectItem>
                <SelectItem value="2">React Developer</SelectItem>
                <SelectItem value="3">Python Developer</SelectItem>
                <SelectItem value="4">Fullstack Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center gap-6 my-6">
          <Button className="bg-[#0044A3] rounded-[3px] hover:bg-blue-950" onClick={() => setAssignOpen(false)}>
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

const DeleteDialog = ({
  isDeleteOpen,
  setIsDeleteOpen,
}: {
  isDeleteOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
    <DialogContent className="rounded-lg">
      <DialogHeader>
        <DialogTitle className="my-1 text-lg text-[#0044A3] text-center">
          Are You Sure You Want to Delete?
        </DialogTitle>
      </DialogHeader>
      <div className="flex justify-center gap-6 my-3">
        <Button
          onClick={() => setIsDeleteOpen(false)}
          className="bg-red-600 text-white rounded-[3px] hover:bg-red-800"
        >
          Delete
        </Button>
        <Button
          onClick={() => setIsDeleteOpen(false)}
          className="bg-white border border-[#64748B] text-[#64748B] hover:bg-neutral-300"
        >
          Cancel
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

const InputField = ({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) => (
  <div className="flex gap-4">
    <Label className="text-[#1E293B] w-[30%]">{label}</Label>
    <Input
      name={name}
      type={type}
      placeholder={placeholder}
      className="w-[70%] placeholder:text-[12px] px-4 py-5"
    />
  </div>
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

export default Candidates;
