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
const candidates = Array(10)
  .fill(null)
  .map((_, i) => ({
    candidateName: `Candidate ${i + 1}`,
    jobPosition: `Job Position ${i + 1}`,
    status: `Completed`,
    interviewStage: `L1`,
    phone_number: `987652313${i + 1 * Math.ceil(Math.random() * 5)}`,
    email: `candidate- ${i + 1}@gmail.com`,
  }));

const CandidatesStatus = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <HeaderSection setIsOpen={setIsOpen} />
      <TableSection data={candidates} />
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
          Candidate Name - ASC
        </SelectItem>
        <SelectItem value="dark" className="text-sm text-gray-500">
          Candidate Name - DESC
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
          <TableHead className={tableHeaderClass}>Candidate Name</TableHead>
          <TableHead className={tableHeaderClass}>Job Position</TableHead>
          <TableHead className={tableHeaderClass}>Status</TableHead>
          <TableHead className={tableHeaderClass}>Interview Stage</TableHead>
          <TableHead className={tableHeaderClass}>Phone Number</TableHead>
          <TableHead className={tableHeaderClass}>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((cand, i) => (
          <TableRow key={i} className="border-t-1 border-gray-200">
            <TableCell className={cellClass}>{cand.candidateName}</TableCell>
            <TableCell className={cellClass}>{cand.jobPosition}</TableCell>
            <TableCell className={cellClass}>
              <Badge className="bg-green-500">{cand.status}</Badge>
            </TableCell>
            <TableCell className={cellClass}>{cand.interviewStage}</TableCell>
            <TableCell className={cellClass}>{cand.phone_number}</TableCell>
            <TableCell className={cellClass}>{cand.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
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

export default CandidatesStatus;
