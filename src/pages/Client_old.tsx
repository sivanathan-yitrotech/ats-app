import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

const clients = Array(10)
  .fill(null)
  .map((_, i) => ({
    clientName: `Client ${i + 1}`,
    companyName: `Company ${i + 1}`,
    contactNumber: `123-456-789${i}`,
    email: `client${i + 1}@example.com`,
  }));

const Client = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <HeaderSection setIsOpen={setIsOpen} />
      <TableSection data={clients} />
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
      <span className="text-md font-semibold">Add Client</span>
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
          <TableHead className={tableHeaderClass}>Company Name</TableHead>
          <TableHead className={tableHeaderClass}>Contact Number</TableHead>
          <TableHead className={tableHeaderClass}>Email</TableHead>
          <TableHead className={tableHeaderClass}>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((client, i) => (
          <TableRow key={i} className="border-t-1 border-gray-200">
            <TableCell className={cellClass}>{client.clientName}</TableCell>
            <TableCell className={cellClass}>{client.companyName}</TableCell>
            <TableCell className={cellClass}>{client.contactNumber}</TableCell>
            <TableCell className={cellClass}>{client.email}</TableCell>
            <TableCell className={cellClass}>
              <div className="flex items-center space-x-3 text-gray-600">
                <Pencil
                  className="h-5 w-5 cursor-pointer hover:text-blue-500 transition-colors"
                  aria-label="Edit Client"
                />
                <Trash2
                  className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors"
                  aria-label="Delete Client"
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="my-4 text-xl text-[#0044A3] font-bold text-center">
          <h1>Add Client</h1>
        </DialogTitle>
        <DialogDescription>
          <div className="mt-4 flex flex-col gap-4">
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-row justify-between">
                <Label className="text-[#0044A3] w-[30%]">Client Name</Label>
                <Input
                  name="clientName"
                  type="text"
                  placeholder="Enter the Client Name"
                  maxLength={250}
                  className="w-[70%] placeholder:text-[12px] px-4 py-5"
                />
              </div>
              <div className="flex flex-row justify-between">
                <Label className="text-[#0044A3] w-[30%]">Client Company</Label>
                <Input
                  name="clientCompany"
                  type="text"
                  maxLength={250}
                  placeholder="Enter the Client Company"
                  className="w-[70%] placeholder:text-[12px] px-4 py-5"
                />
              </div>
              <div className="flex flex-row justify-between">
                <Label className="text-[#0044A3] w-[30%]">Contact Number</Label>
                <Input
                  name="contactNumber"
                  type="number"
                  maxLength={16}
                  placeholder="Enter the Contact Number"
                  className="w-[70%] placeholder:text-[12px] px-4 py-5"
                />
              </div>
              <div className="flex flex-row justify-between">
                <Label className="text-[#0044A3] w-[30%]">Contact Email</Label>
                <Input
                  name="contactEmail"
                  type="email"
                  maxLength={250}
                  placeholder="Enter the Contact Email"
                  className="w-[70%] placeholder:text-[12px] px-4 py-5"
                />
              </div>
              <div className="flex flex-row gap-6 justify-center my-7">
                <Button className="bg-[#0044A3] rounded-[3px] cursor-pointer hover:bg-blue-950">
                  Save
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-white rounded-[3px] cursor-pointer hover:bg-neutral-300 border-1 border-[#64748B] text-[#64748B]"
                >
                  Cancel
                </Button>
              </div>
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
    <Label className="text-[#0044A3] w-[30%]">{label}</Label>
    <Input
      name={name}
      type="text"
      placeholder={placeholder}
      maxLength={250}
      className="w-[70%] placeholder:text-[12px] px-4 py-5"
    />
  </div>
);

export default Client;
