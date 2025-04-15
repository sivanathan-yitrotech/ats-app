import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Receipt, Search } from "lucide-react";
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
    department: `Department ${i + 1}`,
    closedDate: "11-11-2023", // Random past date
    assignedRecruiter: `Recruiter ${i + 1}`,
    status: `Pending`,
    commissionValue: `$${(Math.random() * 10000).toFixed(2)}`, // Fix commission formatting
  }));

const ClosedPositions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <HeaderSection setIsOpen={setIsOpen} />
      <TableSection data={jobPostings} />
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
          <TableHead className={tableHeaderClass}>Job Title</TableHead>
          <TableHead className={tableHeaderClass}>Client Name</TableHead>
          <TableHead className={tableHeaderClass}>Department</TableHead>
          <TableHead className={tableHeaderClass}>Closed Date</TableHead>
          <TableHead className={tableHeaderClass}>Assigned Recruiter</TableHead>
          <TableHead className={tableHeaderClass}>Comission Value</TableHead>
          <TableHead className={tableHeaderClass}>Status</TableHead>
          <TableHead className={tableHeaderClass}>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((client, i) => (
          <TableRow key={i} className="border-t-1 border-gray-200">
            <TableCell className={cellClass}>{client.jobTitle}</TableCell>
            <TableCell className={cellClass}>{client.clientName}</TableCell>
            <TableCell className={cellClass}>{client.department}</TableCell>
            <TableCell className={cellClass}>{client.closedDate}</TableCell>
            <TableCell className={cellClass}>
              {client.assignedRecruiter}
            </TableCell>
            <TableCell className={cellClass}>
              {client.commissionValue}
            </TableCell>
            <TableCell className={cellClass}>{client.status}</TableCell>
            <TableCell className={cellClass}>
              <div className="flex items-center space-x-3 text-gray-600">
                <Receipt
                  className="h-5 w-5 cursor-pointer hover:text-violet-400 transition-colors"
                  aria-label="Generate Invoice"
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default ClosedPositions;
