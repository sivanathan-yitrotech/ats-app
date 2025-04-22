import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, EllipsisVertical, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Constants for styling
const buttonClass =
  "bg-[#0044A3] rounded-[3px] cursor-pointer hover:bg-violet-950";

const jobTitles = Array(10)
  .fill(null)
  .map((_, i) => ({
    jobTitle: `Job Title ${i + 1}`,
    department: `Department ${i + 1}`,
    createdAt: `${Date.now()}`,
    status: "Active",
  }));

const JobTitle = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <HeaderSection setIsOpen={setIsOpen} />
      <CardSection data={jobTitles} />
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
      className="pl-10 pr-4 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-sm text-gray-500 placeholder:text-[12px]"
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
  </div>
);

const CardSection = ({ data }: { data: Array<any> }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-x-auto rounded-lg">
    {data.map((client, i) => (
      <Card key={i} client={client} />
    ))}
  </div>
);

const Card = ({ client }: { client: any }) => (
  <div className="rounded-xl border shadow-sm p-6 w-full max-w-md bg-white flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <Badge
        variant="outline"
        className="bg-violet-100 text-violet-700 rounded-lg px-4 py-1 text-[10px] font-bold"
      >
        OPEN
      </Badge>
      <div className="flex items-center gap-2">
        <Switch defaultChecked className="data-[state=checked]:bg-green-500 cursor-pointer" />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
              <EllipsisVertical size={16} className="cursor-pointer" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-700 hover:bg-gray-100">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <h2 className="text-[14px] font-semibold text-gray-900">{client.jobTitle}</h2>
      <p className="my-0 text-[11px] text-gray-600">{client.department}</p>
      <p className="my-0 text-[11px] text-gray-600">
        Created on {new Date(parseInt(client.createdAt)).toLocaleDateString()}
      </p>
    </div>
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
          Add Job Title
        </DialogTitle>
        <DialogDescription>
          <div className="mt-4 flex flex-col gap-4">
            <InputField
              label="Job Title"
              name="jobTitle"
              placeholder="Enter the Job Title"
            />
            <InputField
              label="Department"
              name="department"
              placeholder="Enter the Department"
            />
            <div className="flex flex-row justify-between">
              <Label className="text-[#0044A3] w-[30%]">Status</Label>
              <div className="w-[70%]">
                <Switch />
              </div>
            </div>
            <div className="flex flex-row gap-6 justify-center my-7">
              <Button className={buttonClass}>Save</Button>
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-white rounded-[3px] cursor-pointer hover:bg-neutral-300 border-1 border-[#64748B] text-[#64748B]"
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

export default JobTitle;
