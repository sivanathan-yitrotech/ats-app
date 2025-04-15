import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Constants for styling
const tableHeaderClass = "text-[#0044A3] font-semibold text-sm py-3 px-6";
const cellClass = "text-sm font-medium text-gray-700 py-3 px-6";
const buttonClass =
  "bg-[#0044A3] rounded-[3px] cursor-pointer hover:bg-blue-950";
const jobTypes = ["On-Site", "Hybrid", "Remote"];
const jobPostings = Array(10)
  .fill(null)
  .map((_, i) => ({
    clientName: `Client ${i + 1}`,
    jobTitle: `Job Title ${i + 1}`,
    positions: `${Math.ceil(Math.random() * 50)}`,
    experience: `${Math.ceil(Math.random() * 10)}`,
    jobType: `${jobTypes[Math.floor(Math.random() * jobTypes.length)]}`,
    location: `Location ${i + 1}`,
    status: "Active",
  }));

const Invoices = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <HeaderSection setIsOpen={setIsOpen} />
      <TableSection data={jobPostings} />
      <AddJobTitleDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

const HeaderSection = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
    <div className="flex items-center gap-6">
      <FilterSelect />
      <SearchBar />
    </div>
    <Button onClick={() => setIsOpen(true)} className={buttonClass}>
      <Plus className="h-5 w-5" />
      <span className="text-md font-semibold">Add Job Title</span>
    </Button>
  </div>
);

const FilterSelect = () => (
  <div className="flex items-center gap-2">
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter By" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light" className="text-sm text-gray-500">
          Job Title - ASC
        </SelectItem>
        <SelectItem value="dark" className="text-sm text-gray-500">
          Job Title - DESC
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
);

const SearchBar = () => (
  <div className="relative w-full md:w-60 max-w-lg">
    <Input
      placeholder="Search"
      className="pl-10 pr-4 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-gray-500 placeholder:text-[12px]"
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
  </div>
);

const TableSection = ({ data }: { data: Array<any> }) => (
  <div className="overflow-x-auto rounded-lg">
    <Table>
      <TableHeader>
        <TableRow className="border-t-1 border-gray-200">
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
        {data.map((client, i) => (
          <TableRow key={i} className="border-t-1 border-gray-200">
            <TableCell className={cellClass}>{client.clientName}</TableCell>
            <TableCell className={cellClass}>{client.jobTitle}</TableCell>
            <TableCell className={cellClass}>{client.positions}</TableCell>
            <TableCell className={cellClass}>{client.experience}</TableCell>
            <TableCell className={cellClass}>{client.jobType}</TableCell>
            <TableCell className={cellClass}>{client.location}</TableCell>
            <TableCell className={cellClass}>
              <Badge className="bg-green-500">{client.status}</Badge>
            </TableCell>
            <TableCell className={cellClass}>
              <div className="flex items-center space-x-3 text-gray-600">
                <Pencil
                  className="h-5 w-5 cursor-pointer hover:text-blue-500 transition-colors"
                  aria-label="Edit Job Posting"
                />
                <Trash2
                  className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors"
                  aria-label="Delete Job Posting"
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const AddJobTitleDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
    <DialogContent
      style={{ maxWidth: "80%", maxHeight: "90vh", overflowY: "auto" }}
    >
      <DialogHeader>
        <DialogTitle className="my-4 text-xl text-[#0044A3] font-bold text-center">
          Add Job Posting
        </DialogTitle>
        <DialogDescription>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5">
            {/* Row 1 */}
            <div className="flex items-center gap-4">
              <Label className="text-[#0044A3] w-[50%]">Job Title</Label>
              <Select name="jobTitle">
                <SelectTrigger className="w-full placeholder:text-[12px] px-4 py-5">
                  <SelectValue
                    placeholder="Select Job Title"
                    className="text-[12px] px-4 py-5"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="software-architect"
                    className="text-[12px] p-2"
                  >
                    Software Architect
                  </SelectItem>
                  <SelectItem
                    value="software-engineer"
                    className="text-[12px] p-2"
                  >
                    Software Engineer
                  </SelectItem>
                  <SelectItem
                    value="system-designer"
                    className="text-[12px] p-2"
                  >
                    System Designer
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#0044A3] w-[50%]">Position Count</Label>
              <Input
                name="positionCount"
                placeholder="Enter the Position Count"
                className="w-full placeholder:text-[12px] px-4 py-5"
              />
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-4 col-span-2">
              <Label className="text-[#0044A3] w-[18%]">Description</Label>
              <Input
                name="description"
                placeholder="Enter the Description"
                className="w-full placeholder:text-[12px] px-4 py-5"
              />
            </div>

            {/* Row 3 */}
            <div className="flex items-center gap-4 col-span-2">
              <Label className="text-[#0044A3] w-[18%]">Job Description</Label>
              <Input
                type="file"
                name="descriptionFile"
                placeholder="Upload the Job Description"
                className="w-full placeholder:text-[12px]"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#0044A3] w-[50%]">Required Skills</Label>
              <Input
                name="skills"
                placeholder="Enter the Required Skills"
                className="w-full placeholder:text-[12px] px-4 py-5"
              />
            </div>

            {/* Row 4 */}
            <div className="flex items-center gap-4">
              <Label className="text-[#0044A3] w-[50%]">Job Type</Label>
              <Select name="jobType">
                <SelectTrigger className="w-full placeholder:text-[12px] px-4 py-5">
                  <SelectValue placeholder="Select Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On-Site">On-Site</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#0044A3] w-[50%]">Experience</Label>
              <Input
                name="experience"
                placeholder="Enter the Experience"
                className="w-full placeholder:text-[12px] px-4 py-5"
              />
            </div>

            {/* Row 5 */}
            <div className="flex items-center gap-4">
              <Label className="text-[#0044A3] w-[50%]">Job Location</Label>
              <Input
                name="jobLocation"
                placeholder="Enter the Job Location"
                className="w-full placeholder:text-[12px] px-4 py-5"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#0044A3] w-[50%]">
                Expected Joining Date
              </Label>
              <Input
                type="date"
                name="joiningDate"
                className="w-full placeholder:text-[12px] px-4 py-5"
              />
            </div>

            {/* Row 6 */}
            <div className="flex items-center gap-4">
              <Label className="text-[#0044A3] w-[50%]">Assign Recruiter</Label>
              <Select name="assignRecruiter">
                <SelectTrigger className="w-full placeholder:text-[12px] px-4 py-5">
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
              <Label className="text-[#0044A3] w-[50%]">CTC</Label>
              <Input
                name="ctc"
                placeholder="Enter the CTC"
                className="w-full placeholder:text-[12px] px-4 py-5"
              />
            </div>

            {/* Row 7 */}
            <div className="flex items-center gap-4">
              <Label className="text-[#0044A3] w-[50%]">Commission Type</Label>
              <Select name="commissionType">
                <SelectTrigger className="w-full placeholder:text-[12px] px-4 py-5">
                  <SelectValue placeholder="Select Commission Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-[#0044A3] w-[50%]">Commission Value</Label>
              <Input
                name="commissionValue"
                placeholder="Enter Commission Value"
                className="w-full placeholder:text-[12px] px-4 py-5"
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
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);

const InputField = ({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder: string;
}) => (
  <div className="flex flex-row justify-between">
    <Label className="text-[#0044A3] w-[50%]">{label}</Label>
    <Input
      name={name}
      type="text"
      placeholder={placeholder}
      maxLength={250}
      className="w-[70%] placeholder:text-[12px] px-4 py-5"
    />
  </div>
);

export default Invoices;
