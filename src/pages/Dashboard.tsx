import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Pencil, Trash2 } from "lucide-react";
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
import React from "react";

const Dashboard = () => {
  // Sample data for the table
  const clients = Array(10)
    .fill(null)
    .map((_, i) => ({
      clientName: `Client ${i + 1}`,
      companyName: `Company ${i + 1}`,
      contactNumber: `123-456-789${i}`,
      email: `client${i + 1}@example.com`,
    }));

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
        <div className="flex items-center gap-6">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-[180px] md:w-[180px]">
                <SelectValue placeholder="Filter By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light" className="text-sm text-gray-500">
                  Client Name - ASC
                </SelectItem>
                <SelectItem value="dark" className="text-sm text-gray-500">
                  Client Name - DESC
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-60 max-w-lg">
            <Input
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-gray-500 placeholder:text-[12px]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>

        {/* Add Clients Button */}
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-[#0044A3] rounded-[3px] cursor-pointer hover:bg-blue-950"
        >
          <Plus className="h-5 w-5" />
          <span className="text-md font-semibold">Add Client</span>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-t-1 border-gray-200">
              <TableHead className="text-[#0044A3] font-semibold text-sm py-3 px-6">
                Client Name
              </TableHead>
              <TableHead className="text-[#0044A3] font-semibold text-sm py-3 px-6">
                Company Name
              </TableHead>
              <TableHead className="text-[#0044A3] font-semibold text-sm py-3 px-6">
                Contact Number
              </TableHead>
              <TableHead className="text-[#0044A3] font-semibold text-sm py-3 px-6">
                Email
              </TableHead>
              <TableHead className="text-[#0044A3] font-semibold text-sm py-3 px-6">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {clients.map((client, i) => (
              <TableRow
                key={client.clientName}
                className="border-t-1 border-gray-200"
              >
                <TableCell className="text-sm font-medium text-gray-700 py-3 px-6">
                  {client.clientName}
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-700 py-3 px-6">
                  {client.companyName}
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-700 py-3 px-6">
                  {client.contactNumber}
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-700 py-3 px-6">
                  {client.email}
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-700 py-3 px-6">
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
                    <Label className="text-[#0044A3] w-[30%]">
                      Client Name
                    </Label>
                    <Input
                      name="clientName"
                      type="text"
                      placeholder="Enter the Client Name"
                      maxLength={250}
                      className="w-[70%] placeholder:text-[12px] px-4 py-5"
                    />
                  </div>
                  <div className="flex flex-row justify-between">
                    <Label className="text-[#0044A3] w-[30%]">
                      Client Company
                    </Label>
                    <Input
                      name="clientCompany"
                      type="text"
                      maxLength={250}
                      placeholder="Enter the Client Company"
                      className="w-[70%] placeholder:text-[12px] px-4 py-5"
                    />
                  </div>
                  <div className="flex flex-row justify-between">
                    <Label className="text-[#0044A3] w-[30%]">
                      Contact Number
                    </Label>
                    <Input
                      name="contactNumber"
                      type="number"
                      maxLength={16}
                      placeholder="Enter the Contact Number"
                      className="w-[70%] placeholder:text-[12px] px-4 py-5"
                    />
                  </div>
                  <div className="flex flex-row justify-between">
                    <Label className="text-[#0044A3] w-[30%]">
                      Contact Email
                    </Label>
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
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
