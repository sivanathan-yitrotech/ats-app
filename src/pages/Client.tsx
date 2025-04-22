import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronsUpDown,
  Menu,
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
const clients = Array(10)
  .fill(null)
  .map((_, i) => ({
    clientName: `Client ${i + 1}`,
    companyName: `Company ${i + 1}`,
    contactNumber: `123-456-789${i}`,
    email: `client${i + 1}@example.com`,
  }));

interface Client {
  clientName: string;
  companyName: string;
  contactNumber: string;
  email: string;
}

const Client = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-bold text-[#475569]">Client Management</h1>
        <p className="text-sm text-[#475569] mt-2 text-center">
          Track, manage, and collaborate with your hiring partners seamlessly.
        </p>
      </div>
      <CardSection
        data={clients}
        setIsOpen={setIsOpen}
        setIsDeleteOpen={setIsDeleteOpen}
      />
      <PaginationSection />
      <AddClientDialog isOpen={isOpen} setIsOpen={setIsOpen} />
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
  data: Client[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
            { label: "All Clients", value: 50, color: "bg-blue-400" },
            { label: "Active", value: 40, color: "bg-green-400" },
            { label: "Inactive", value: 10, color: "bg-red-400" },
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
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </div>
      </div>

      <ClientTable
        data={data}
        setIsOpen={setIsOpen}
        setIsDeleteOpen={setIsDeleteOpen}
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
}: {
  data: Client[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <div className="overflow-x-auto rounded-lg my-3">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={tableHeaderClass}>Client Name</TableHead>
          <TableHead className={tableHeaderClass}>Company Name</TableHead>
          <TableHead className={tableHeaderClass}>Contact Number</TableHead>
          <TableHead className={tableHeaderClass}>Email</TableHead>
          <TableHead className={tableHeaderClass}>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((client, i) => (
          <TableRow key={i}>
            <TableCell className={cellClass}>{client.clientName}</TableCell>
            <TableCell className={cellClass}>{client.companyName}</TableCell>
            <TableCell className={cellClass}>{client.contactNumber}</TableCell>
            <TableCell className={cellClass}>{client.email}</TableCell>
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
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const AddClientDialog = ({
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
          Add Client
        </DialogTitle>
        <div className="flex flex-col gap-4">
          <InputField
            label="Client Name"
            name="clientName"
            placeholder="Enter the Client Name"
          />
          <InputField
            label="Client Company"
            name="clientCompany"
            placeholder="Enter the Client Company"
          />
          <InputField
            label="Contact Number"
            name="contactNumber"
            placeholder="Enter the Contact Number"
            type="number"
          />
          <InputField
            label="Contact Email"
            name="contactEmail"
            placeholder="Enter the Contact Email"
            type="email"
          />
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

export default Client;
