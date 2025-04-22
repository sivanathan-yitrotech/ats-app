import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronsUpDown,
  Menu,
  Check,
  EllipsisVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const roles = ["manager", "recruiter"];
const users = Array(12)
  .fill(null)
  .map((_, i) => ({
    firstName: `User`,
    lastName: `Name ${i + 1}`,
    email: `user-${i + 1}@gmail.com`,
    phoneNumber: `98978989${i + 1}`,
    role: roles[Math.floor(Math.random() * roles.length)],
  }));

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
}

const Users = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="p-4">
      <CardSection
        data={users}
        setIsOpen={setIsOpen}
        setIsDeleteOpen={setIsDeleteOpen}
      />
      <PaginationSection />
      <AddUserDialog isOpen={isOpen} setIsOpen={setIsOpen} />
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
  data: User[];
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

  const editData = () => {
    setIsOpen(true);
  };

  const deleteData = () => {
    setIsDeleteOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto flex justify-between gap-4">
        <div className="flex items-center gap-7 mb-4 bg-[#F1F5F9] rounded-lg p-2 w-auto px-3">
          {["All Users", "Managers", "Recruiters"].map((label, idx) => (
            <div
              key={idx}
              className={`cursor-pointer flex items-center gap-2 ${
                active === String(idx) ? "toggle-active" : ""
              }`}
              onClick={() => setActive(String(idx))}
            >
              {idx === 0 && <Menu className="h-4 w-4" />}
              <p className="text-[#475569] text-sm">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 py-1 mb-4">
          <Input
            type="text"
            placeholder="Search"
            className="w-[200px] placeholder:text-[12px] px-4 py-5"
            onChange={(e) => console.log(e.target.value)}
          />
          <SortBy
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={setValue}
            sortBy={sortBy}
          />
          <Button
            variant="secondary"
            className="ml-4 cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 my-7">
        {data.map((user, index) => (
          <UsersCard
            key={index}
            user={user}
            editData={editData}
            deleteData={deleteData}
          />
        ))}
      </div>
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
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-auto justify-between"
      >
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
                value={item.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
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

const UsersCard = ({
  user,
  editData,
  deleteData,
}: {
  user: User;
  editData: () => void;
  deleteData: () => void;
}) => {
  return (
    <div className="transition-all transform duration-300 hover:scale-105 outfit-regular w-full rounded-2xl bg-gradient-to-r from-zinc-50 to-neutral-100 border border-gray-200 p-4 shadow-lg hover:shadow-2xl flex flex-col space-y-4 font-[Outfit]">
      <div className="flex justify-between items-center">
        <p className="text-[12px] font-semibold text-gray-900">
          {user.firstName} {user.lastName}
        </p>
        <div className="flex flex-row-reverse items-center gap-2 text-[13px] text-gray-600">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVertical className="h-5 w-5 text-gray-700 cursor-pointer hover:text-gray-600" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto bg-white rounded-md shadow-lg p-2">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-2">
                  <div
                    className="flex gap-2 cursor-pointer text-gray-700 hover:text-indigo-500 font-medium"
                    onClick={editData}
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </div>
                  <div
                    className="flex gap-2 cursor-pointer text-gray-700 hover:text-red-500 font-medium"
                    onClick={deleteData}
                  >
                    <Trash className="h-4 w-4" /> Delete
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
          <Badge
            className={`text-[10px] text-black px-2 py-1 rounded-full ${
              user.role === "manager" ? "bg-lime-200" : "bg-teal-200"
            }`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="flex justify-between text-gray-600">
        <div className="flex flex-col gap-2">
          <p className="text-[12px]">{user.email}</p>
          <p className="text-[12px]">{user.phoneNumber}</p>
        </div>
        {user.role === "recruiter" && (
          <div>
            <p className="text-[11px] text-gray-500 mb-1">Assigned Manager</p>
            <p className="text-xs text-gray-800">Manager - 1</p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-300 pt-2 mt-4">
        <p className="text-[10px] text-gray-500">Last updated: N/A</p>
      </div>
    </div>
  );
};

const AddUserDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className="max-w-[80vw] md:max-w-[60vw] overflow-hidden rounded-lg">
      <DialogHeader>
        <DialogTitle className="my-4 text-xl text-[#0044A3] font-bold text-center">
          Add a New User
        </DialogTitle>
      </DialogHeader>
      <div className="mt-4 flex flex-col gap-6">
        {/* First Name and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            name="firstName"
            placeholder="Enter the First Name"
          />
          <InputField
            label="Last Name"
            name="lastName"
            placeholder="Enter the Last Name"
          />
        </div>

        {/* Email and Phone Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Email"
            name="email"
            placeholder="Enter the Email"
            type="email"
          />
          <InputField
            label="Phone Number"
            name="phone_number"
            placeholder="Enter the Phone Number"
            type="number"
          />
        </div>

        {/* Password and Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Password"
            name="password"
            placeholder="Enter the Password"
            type="password"
          />
          <InputField
            label="Confirm Password"
            name="confirm_password"
            placeholder="Enter the Confirm Password"
            type="password"
          />
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4">
            <Label className="text-[#1E293B] w-[30%]">Role</Label>
            <div className="flex flex-col md:flex-row gap-6 items-start w-[70%]">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="manager"
                  name="role"
                  value="manager"
                  className="mr-2"
                />
                <Label htmlFor="manager" className="text-sm">
                  Manager
                </Label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="recruiter"
                  name="role"
                  value="recruiter"
                  className="mr-2"
                />
                <Label htmlFor="recruiter" className="text-sm">
                  Recruiter
                </Label>
              </div>
            </div>
          </div>
          {/* Empty div for the second column in the grid */}
          <div></div>
        </div>

        {/* Save and Cancel Buttons */}
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
      <div className="mt-1 flex flex-col gap-6">
        <p className="text-center text-sm text-[#333333]">
          This action cannot be undone.
        </p>

        {/* Confirmation Action Buttons */}
        <div className="flex justify-center gap-6 my-3">
          <Button
            onClick={() => {
              // Handle delete logic here
              setIsDeleteOpen(false);
            }}
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
  <div className="flex items-center gap-4">
    <Label className="text-[#1E293B] w-[30%]">{label}</Label>
    <Input
      name={name}
      type={type}
      placeholder={placeholder}
      maxLength={250}
      className="w-[70%] placeholder:text-[12px] px-4 py-5"
    />
  </div>
);

const PaginationSection = () => {
  return (
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
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default Users;
