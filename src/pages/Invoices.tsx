import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Pencil, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ucFirst } from "../../utils/common";
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
import PaginationSection from "@/components/ui/page";
import NoData from "@/components/ui/nodata";
import SortBy from "@/components/ui/sortby";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const tableHeaderClass = "text-[#0044A3] font-semibold text-sm py-3 px-6";
const cellClass = "text-sm font-medium text-gray-700 py-3 px-6";

interface InvoiceData {
  id: string;
  clientName: string;
  candidateName: string;
  jobTitle: string;
  invoiceAmount: string;
  status: string;
  issued_date: string;
  invoice_date: string;
}

const Invoices = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [filterBy, setFilterBy] = useState("0");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const limit = 20;
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const loadInvoices = () => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "invoices-list",
          page,
          limit,
          filterby: filterBy,
          sortby: sortBy,
          searchby: search,
        },
      })
      .then((response) => {
        setInvoices(response.data.data);
        setTotal(55);
      })
      .catch((error) => {
        console.error("API Error:", error.response?.data || error.message);
      });
  };

  useEffect(() => {
    loadInvoices();
  }, [filterBy, sortBy, search, page]);

  const [formData, setFormData] = useState<InvoiceData>({
    id: "",
    clientName: "",
    candidateName: "",
    jobTitle: "",
    invoiceAmount: "",
    status: "",
    issued_date: "",
    invoice_date: "",
  });

  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-lg font-bold text-[#475569]">Manage Invoices</h1>
        <p className="text-sm text-[#475569] mt-2 text-center">
          Simplify billing and stay on top of client payments — all from one
          place.
        </p>
      </div>
      <CardSection
        data={invoices}
        setFilterBy={setFilterBy}
        setSortBy={setSortBy}
        setSearch={setSearch}
        setIsOpen={setIsOpen}
        setFormData={setFormData}
      />
      <PaginationSection
        total={total}
        limit={limit}
        page={page}
        setPage={setPage}
      />
      <UpdateStatusDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        formData={formData}
        setFormData={setFormData}
        loadInvoices={loadInvoices}
      />
      <Toaster />
    </div>
  );
};

const CardSection = ({
  data,
  setFilterBy,
  setSortBy,
  setSearch,
  setIsOpen,
  setFormData,
}: {
  data: InvoiceData[];
  setFilterBy: React.Dispatch<React.SetStateAction<string>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [active, setActive] = useState("0");

  const sortOptions = [
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "last_updated", label: "Last Updated" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (val: string) => {
    setValue(val);
    setSortBy(val);
  };

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
              onClick={() => {
                setActive(String(idx));
                setFilterBy(String(idx));
              }}
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
            onChange={handleSearch}
          />
          <SortBy
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={(val) => handleSortChange(val as string)}
            sortBy={sortOptions}
          />
        </div>
      </div>

      {data.length > 0 ? (
        <InvoiceTable
          data={data}
          setIsOpen={setIsOpen}
          setFormData={setFormData}
        />
      ) : (
        <NoData />
      )}
    </>
  );
};

const InvoiceTable = ({
  data,
  setIsOpen,
  setFormData,
}: {
  data: InvoiceData[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
}) => {
  const editData = ({ id }: { id: string }) => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "invoice-data",
          id: id,
        },
      })
      .then((response) => {
        const data = response.data.data;
        console.log(data);
        setFormData({
          id: data.id,
          clientName: data.clientName,
          candidateName: data.candidateName,
          jobTitle: data.jobTitle,
          invoiceAmount: data.invoiceAmount,
          status: data.status,
          issued_date: data.issued_date,
          invoice_date: "",
        });
        setIsOpen(true);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
    <div className="overflow-x-auto rounded-lg my-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={tableHeaderClass}>Client Name</TableHead>
            <TableHead className={tableHeaderClass}>Candidate Name</TableHead>
            <TableHead className={tableHeaderClass}>Job Title</TableHead>
            <TableHead className={tableHeaderClass}>Invoice Amount</TableHead>
            <TableHead className={tableHeaderClass}>Status</TableHead>
            <TableHead className={tableHeaderClass}>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((client, i) => (
            <TableRow key={i}>
              <TableCell className={cellClass}>{client.clientName}</TableCell>
              <TableCell className={cellClass}>
                {client.candidateName}
              </TableCell>
              <TableCell className={cellClass}>{client.jobTitle}</TableCell>
              <TableCell className={cellClass}>
                {client.invoiceAmount}
              </TableCell>
              <TableCell className={cellClass}>
                <Badge
                  className={
                    client.status == "completed"
                      ? "bg-green-400"
                      : "bg-yellow-400"
                  }
                >
                  {ucFirst(client.status)}
                </Badge>
              </TableCell>

              <TableCell className={cellClass}>
                <div className="flex items-center space-x-3 text-gray-600">
                  {client.status == "pending" && (
                    <Button
                      variant="secondary"
                      className="cursor-pointer"
                      size="icon"
                      onClick={() => editData({ id: client.id })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {client.status == "completed" && (
                    <Button
                      variant="secondary"
                      className="cursor-pointer"
                      size="icon"
                    >
                      <a
                        target="_blank"
                        href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const UpdateStatusDialog = ({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  loadInvoices,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: InvoiceData;
  setFormData: React.Dispatch<React.SetStateAction<InvoiceData>>;
  loadInvoices: () => void;
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.invoice_date) {
      newErrors.invoice_date = "Invoice date is required";
    }
    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateInvoice = async ({ id }: { id: string }) => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/post-data", {
        type: "update-invoice",
        id: id,
      });

      if (response.status === 200) {
        setFormData({
          id: "",
          clientName: "",
          candidateName: "",
          jobTitle: "",
          invoiceAmount: "",
          status: "",
          issued_date: "",
          invoice_date: "",
        });
        setErrors({});
        setIsOpen(false);
        toast.success(`Invoice updated successfully`);
        loadInvoices();
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="my-4 text-xl text-[#0044A3] font-bold text-center">
            Update Invoice
          </DialogTitle>

          <div className="mt-4 space-y-6">
            {[
              { label: "Client Name", value: formData.clientName },
              { label: "Job Title", value: formData.jobTitle },
              { label: "Candidate Name", value: formData.candidateName },
              { label: "Invoice Amount", value: formData.invoiceAmount },
            ].map(({ label, value }) => (
              <div className="flex justify-start" key={label}>
                <Label className="text-[#1E293B] w-[50%] font-medium">
                  {label}
                </Label>
                <Label className="text-[#0044A3] w-[50%]">{value}</Label>
              </div>
            ))}

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full">
              <Label className="text-[#1E293B] font-medium w-full md:w-1/2">
                Invoice Date
              </Label>
              <div className="w-full md:w-1/2 flex flex-col gap-1">
                <Input
                  type="date"
                  value={formData.invoice_date}
                  name="invoice_date"
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                />
                {errors.invoice_date && (
                  <p className="text-red-500 text-sm">{errors.invoice_date}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Label className="text-[#1E293B] font-medium">Status</Label>
              <Select
                name="status"
                defaultValue={formData.status}
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
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
            <Button
              className="bg-[#0044A3] rounded-[3px] hover:bg-blue-950"
              onClick={() => updateInvoice({ id: formData.id })}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Update"}
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
};

export default Invoices;
