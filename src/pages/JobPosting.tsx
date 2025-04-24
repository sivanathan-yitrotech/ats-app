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
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
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
const buttonClass =
  "bg-[#0044A3] rounded-[3px] cursor-pointer hover:bg-blue-950";
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
    description: `Description for Job Title ${i + 1}`,
    recruiters: [`Recruiter ${i + 1}A`, `Recruiter ${i + 1}B`],
    remote: `${jobTypes[Math.floor(Math.random() * jobTypes.length)]}`,
    title: `Title ${i + 1}`,
    company: `Company ${i + 1}`,
  }));

interface jobPost {
  clientName: string;
  jobTitle: string;
  positions: string;
  experience: string;
  jobType: string;
  location: string;
  status: string;
  description: string; // Added description property
  recruiters: string[]; // Added recruiters property
  remote: string; // Added remote property
  title: string; // Added title property
  company: string; // Added title property
}

const JobPosting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
      />
      <PaginationSection />
      <AddJobPostingDialog isOpen={isOpen} setIsOpen={setIsOpen} />
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
}: {
  data: jobPost[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [active, setActive] = useState("0");
  const [listType, setListType] = useState("list");

  const cardData = [
    {
      id: 1,
      clientName: "Client 1",
      jobTitle: "UX Designer",
      positions: "5",
      jobType: "Remote",
      status: "OPEN",
      experience: "Preferred Exp: 2 – 4 years",
      title: "UX Designer",
      company: "For ITG Communications",
      location: "Tennessee",
      remote: "Remote",
      recruiters: ["https://i.pravatar.cc/300", "https://i.pravatar.cc/301"],
      ctc: "10%",
      description:
        "We are looking for a passionate UX Designer to work on enhancing the user experience of our flagship products. You will collaborate closely with product teams to create user-centered designs and conduct usability testing.",
    },
    {
      id: 2,
      clientName: "Client 2",
      jobTitle: "Frontend Developer",
      positions: "3",
      jobType: "Hybrid",
      status: "CLOSED",
      experience: "Preferred Exp: 5 – 7 years",
      title: "Frontend Developer",
      company: "For XYZ Technologies",
      location: "California",
      remote: "Hybrid",
      recruiters: ["https://i.pravatar.cc/300", "https://i.pravatar.cc/301"],
      ctc: "15%",
      description:
        "XYZ Technologies is seeking a skilled Frontend Developer to join our team. The ideal candidate will have expertise in JavaScript frameworks and a strong understanding of responsive web design to build and maintain high-performance web applications.",
    },
    {
      id: 3,
      clientName: "Client 3",
      jobTitle: "Product Manager",
      positions: "2",
      jobType: "Remote",
      status: "OPEN",
      experience: "Preferred Exp: 3 – 5 years",
      title: "Product Manager",
      company: "For ABC Solutions",
      location: "New York",
      remote: "Remote",
      recruiters: ["https://i.pravatar.cc/302", "https://i.pravatar.cc/303"],
      ctc: "12%",
      description:
        "As a Product Manager at ABC Solutions, you will drive the product roadmap and collaborate with cross-functional teams to ensure successful product launches. Strong communication and project management skills are essential.",
    },
    {
      id: 4,
      clientName: "Client 4",
      jobTitle: "Graphic Designer",
      positions: "4",
      jobType: "In-office",
      status: "OPEN",
      experience: "Preferred Exp: 1 – 3 years",
      title: "Graphic Designer",
      company: "For Creative Agency",
      location: "Texas",
      remote: "In-office",
      recruiters: ["https://i.pravatar.cc/304", "https://i.pravatar.cc/305"],
      ctc: "8%",
      description:
        "Creative Agency is hiring a Graphic Designer to work on a variety of branding, digital, and print design projects. You will collaborate with the creative team to develop visually compelling materials that meet client goals.",
    },
    {
      id: 5,
      clientName: "Client 5",
      jobTitle: "Backend Developer",
      positions: "6",
      jobType: "Remote",
      status: "OPEN",
      experience: "Preferred Exp: 2 – 4 years",
      title: "Backend Developer",
      company: "For Tech Corp",
      location: "Florida",
      remote: "Remote",
      recruiters: ["https://i.pravatar.cc/306", "https://i.pravatar.cc/307"],
      ctc: "20%",
      description:
        "Tech Corp is looking for a Backend Developer to design and implement server-side logic, database systems, and APIs. You'll play a key role in optimizing the performance of our backend infrastructure.",
    },
    {
      id: 6,
      clientName: "Client 6",
      jobTitle: "Data Scientist",
      positions: "3",
      jobType: "Hybrid",
      status: "CLOSED",
      experience: "Preferred Exp: 4 – 6 years",
      title: "Data Scientist",
      company: "For DataLabs",
      location: "Illinois",
      remote: "Hybrid",
      recruiters: ["https://i.pravatar.cc/308", "https://i.pravatar.cc/309"],
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
      {listType == "list" ? (
        <ClientTable
          data={data}
          setIsOpen={setIsOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 cursor-pointer gap-4 pt-3 pb-10">
          <JobCardSection
            data={cardData}
            setIsOpen={setIsOpen}
            setIsDeleteOpen={setIsDeleteOpen}
          />
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

const ClientTable = ({
  data,
  setIsOpen,
  setIsDeleteOpen,
}: {
  data: jobPost[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
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

            <TableCell className={cellClass}>
              <div className="flex items-center space-x-3 text-gray-600">
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  size="icon"
                  onClick={() => setIsOpen(true)}
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
                  onClick={() => setIsDeleteOpen(true)}
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

const AddJobPostingDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [range, setRange] = useState<[number, number]>([0, 5]); // The initial "from" and "to" values

  const handleSliderChange = (newRange: [number, number]) => {
    setRange(newRange); // Update the range when the slider changes
    console.log("Slider range:", newRange); // Log the new range values
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
              placeholder="Enter the Job Title"
            />

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">
                Prefered Experience
              </Label>
              <div className="w-[70%] flex justify-between items-center gap-2">
                <Slider
                  className="w-[70%]"
                  defaultValue={[3, 6]} // Default range values
                  min={0} // Minimum value of the slider
                  max={30} // Maximum value of the slider
                  value={range} // Set the current range
                  onValueChange={handleSliderChange} // Update the range when changed
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
              <Select name="clientName">
                <SelectTrigger className="w-[70%] placeholder:text-[13px] px-4 py-5">
                  <SelectValue placeholder="Select Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Client - 1</SelectItem>
                  <SelectItem value="2">Client - 2</SelectItem>
                  <SelectItem value="3">Client - 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">CTC/Year</Label>
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
              <Label className="text-[#1E293B] w-[30%]">Commission Type</Label>
              <Select name="commissionType">
                <SelectTrigger className="w-[70%] placeholder:text-[13px] px-4 py-5">
                  <SelectValue placeholder="Select Commission Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Commission Value</Label>
              <Input
                name="commissionValue"
                placeholder="Enter Commission Value"
                className="w-[70%] placeholder:text-[13px] px-4 py-5"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Status</Label>
              <Select name="status">
                <SelectTrigger className="w-[70%] placeholder:text-[13px] px-4 py-5">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="On-Hold">On-Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Work Mode</Label>
              <Select name="workMode">
                <SelectTrigger className="w-[70%] placeholder:text-[13px] px-4 py-5">
                  <SelectValue placeholder="Select Work Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On-Site">On-Site</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Assign Recruiter</Label>
              <Select name="assignRecruiter">
                <SelectTrigger className="w-[70%] placeholder:text-[13px] px-4 py-5">
                  <SelectValue placeholder="Select Recruiter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recruiter-1">Recruiter 1</SelectItem>
                  <SelectItem value="recruiter-2">Recruiter 2</SelectItem>
                  <SelectItem value="recruiter-3">Recruiter 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Position Count</Label>
              <Input
                type="number"
                name="positionCount"
                placeholder="Enter the Position Count"
                className="w-[70%] placeholder:text-[13px] px-4 py-5"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Open Date</Label>
              <Input
                name="openDate"
                type="date"
                className="w-[70%] placeholder:text-[13px] px-4 py-5"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Closing Date</Label>
              <Input
                name="closingDate"
                type="date"
                className="w-[70%] placeholder:text-[13px] px-4 py-5"
              />
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-4 col-span-2">
              <Label className="text-[#1E293B] w-[16.5%]">Description</Label>
              <Input
                name="description"
                placeholder="Enter the Description"
                className="w-full placeholder:text-[13px] px-4 py-5"
              />
            </div>

            {/* Row 3 */}
            <div className="flex items-center gap-4 col-span-2">
              <Label className="text-[#1E293B] w-[16.5%]">
                Job Description
              </Label>
              <Input
                type="file"
                name="descriptionFile"
                placeholder="Upload the Job Description"
                className="w-full placeholder:text-[13px]"
              />
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex justify-center gap-6 my-7">
              <Button className={buttonClass}>Save</Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-white rounded-[3px] cursor-pointer hover:bg-neutral-300 border border-[#64748B] text-[#64748B]"
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
      className="w-[70%] placeholder:text-[13px] px-4 py-5"
    />
  </div>
);

const JobCardSection = ({
  data,
  setIsOpen,
  setIsDeleteOpen,
}: {
  data: jobPost[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
                  card.status === "OPEN"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {card.status}
              </span>
              <span
                className={`${
                  card.status === "OPEN"
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-red-100 text-red-600"
                } text-xs font-[500] px-3 py-1 rounded-md`}
              >
                {card.experience}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <EllipsisVertical className="h-5 w-5 text-gray-700 cursor-pointer hover:text-gray-600" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-auto bg-white rounded-md shadow-lg p-2">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-2">
                      <div
                        className="flex gap-2 cursor-pointer text-gray-700 hover:text-indigo-500 font-medium"
                        onClick={() => setIsOpen(true)}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </div>
                      <div
                        className="flex gap-2 cursor-pointer text-gray-700 hover:text-red-500 font-medium"
                        onClick={() => setIsDeleteOpen(true)}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
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
                <p className="text-xs text-gray-500 mb-1">
                  Assigned Recruiters
                </p>
                <div className="flex -space-x-2">
                  {card.recruiters.map((recruiter, recruiterIndex) => (
                    <div
                      key={recruiterIndex}
                      className="relative group"
                      onMouseEnter={() => handleHover(recruiterIndex)}
                      onMouseLeave={() => handleHover(null)}
                    >
                      <img
                        className="w-8 h-8 rounded-full border-2 border-white"
                        src={recruiter}
                        alt={`Recruiter ${recruiterIndex + 1}`}
                      />
                      {isHovered && (
                        <div className="absolute bottom-0 left-0 w-full bg-black text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Recruiter {recruiterIndex + 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* <div
                className={`${
                  card.status === "OPEN"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-red-100 text-red-700"
                } text-[11px] font-semibold px-2 py-1 rounded-xl`}
              >
                CTC : {card.ctc}
              </div> */}
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

export default JobPosting;
