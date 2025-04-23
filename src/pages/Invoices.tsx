import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronsUpDown,
  Menu,
  Check,
  Pencil,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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

// Sample clients data
const invoices = Array(10)
  .fill(null)
  .map((_, i) => ({
    clientName: `Client ${i + 1}`,
    candidateName: `Client ${i + 1}`,
    jobTitle: `Job Title ${i + 1}`,
    invoiceAmount: `$${(Math.random() * 10000).toFixed(2)}`,
    recruiter: `Recruiter ${i + 1}`,
    dateIssued: `2023-09-${i + 1}`,
    status: i % 2 === 0 ? "Completed" : "Pending",
  }));

interface Client {
  clientName: string;
  candidateName: string;
  jobTitle: string;
  invoiceAmount: string;
  recruiter: string;
  status: string;
  dateIssued: string;
}

const Invoices = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-bold text-[#475569]">Manage Invoices</h1>
        <p className="text-sm text-[#475569] mt-2 text-center">
          Simplify billing and stay on top of client payments — all from one
          place.
        </p>
      </div>
      <CardSection data={invoices} setIsOpen={setIsOpen} />
      <PaginationSection />
      <UpdateStatusDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

const CardSection = ({
  data,
  setIsOpen,
}: {
  data: Client[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
        <div className="flex items-center gap-7 mb-4 bg-[#F1F5F9] rounded-lg p-2">
          {[
            { label: "All Invoices", value: 50, color: "bg-blue-400" },
            { label: "Pending", value: 40, color: "bg-yellow-400" },
            { label: "Completed", value: 10, color: "bg-green-400" },
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
        </div>
      </div>

      <ClientTable data={data} setIsOpen={setIsOpen} />
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
}: {
  data: Client[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <div className="overflow-x-auto rounded-lg my-3">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={tableHeaderClass}>Client Name</TableHead>
          <TableHead className={tableHeaderClass}>Candidate Name</TableHead>
          <TableHead className={tableHeaderClass}>Job Title</TableHead>
          <TableHead className={tableHeaderClass}>Invoice Amount</TableHead>
          {/* <TableHead className={tableHeaderClass}>Recruiter</TableHead> */}
          <TableHead className={tableHeaderClass}>Status</TableHead>
          <TableHead className={tableHeaderClass}>Date Issued</TableHead>
          <TableHead className={tableHeaderClass}>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((client, i) => (
          <TableRow key={i}>
            <TableCell className={cellClass}>{client.clientName}</TableCell>
            <TableCell className={cellClass}>{client.candidateName}</TableCell>
            <TableCell className={cellClass}>{client.jobTitle}</TableCell>
            <TableCell className={cellClass}>{client.invoiceAmount}</TableCell>
            {/* <TableCell className={cellClass}>{client.recruiter}</TableCell> */}
            <TableCell className={cellClass}>
              <Badge
                className={
                  client.status == "Completed"
                    ? "bg-green-400"
                    : "bg-yellow-400"
                }
              >
                {client.status}
              </Badge>
            </TableCell>
            <TableCell className={cellClass}>{client.dateIssued}</TableCell>

            <TableCell className={cellClass}>
              <div className="flex items-center space-x-3 text-gray-600">
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  size="icon"
                  onClick={() => setIsOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  size="icon"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const UpdateStatusDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="my-4 text-xl text-[#0044A3] font-bold text-center">
          Update Invoice
        </DialogTitle>
        
        <div className="mt-4 space-y-6">
          {[
            { label: "Client Name", value: "YITRO Global" },
            { label: "Job Posting", value: "UI/UX Designer" },
            { label: "Candidate Name", value: "Sivanathan T" },
            { label: "Invoice Amount", value: "$3500" },
          ].map(({ label, value }) => (
            <div className="flex justify-start" key={label}>
              <Label className="text-[#1E293B] w-[50%] font-medium">{label}</Label>
              <Label className="text-[#0044A3] w-[50%]">{value}</Label>
            </div>
          ))}
          
          <div className="flex justify-between">
            <Label className="text-[#1E293B] font-medium">Invoice Date</Label>
            <Input type="date" name="invoiceDate" className="border border-gray-300 rounded-md p-2 w-full max-w-[50%]" />
          </div>
          
          <div className="flex justify-between">
            <Label className="text-[#1E293B] font-medium">Status</Label>
            <Select name="status" defaultValue="pending">
              <SelectTrigger className="border border-gray-300 w-[50%] rounded-md p-2">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
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

export default Invoices;
