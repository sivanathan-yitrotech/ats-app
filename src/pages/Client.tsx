import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PaginationSection from "@/components/ui/page";
import NoData from "@/components/ui/nodata";
import SortBy from "@/components/ui/sortby";
import InputField from "@/components/ui/inputfield";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Plus, Menu, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";

const tableHeaderClass = "text-[#0044A3] font-semibold text-sm py-3 px-6";
const cellClass = "text-sm font-medium text-gray-700 py-3 px-6";

interface Client {
  id: string;
  clientName: string;
  companyName: string;
  contactNumber: string;
  email: string;
}

const Client = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("0");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const limit = 20;
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [errors, setErrors] = useState<
    Partial<Omit<typeof formData, "profile"> & { profile: string | null }>
  >({});

  const loadClients = () => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "clients-list",
          page: page,
          limit: limit,
          filterby: filterBy,
          sortby: sortBy,
          searchby: search,
        },
      })
      .then((response) => {
        setClients(response.data.data);
        setTotal(75);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    loadClients();
  }, [filterBy, sortBy, search, page]);

  const [formData, setFormData] = useState({
    id: "",
    clientName: "",
    clientCompany: "",
    contactNumber: "",
    contactEmail: "",
  });

  const [deleteId, setDeleteId] = useState("0");

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
        setFilterBy={setFilterBy}
        setSortBy={setSortBy}
        setSearch={setSearch}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        setDeleteId={setDeleteId}
      />
      <PaginationSection
        total={total}
        limit={limit}
        page={page}
        setPage={setPage}
      />
      <AddClientDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        loadClients={loadClients}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
      />
      <DeleteDialog
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        deleteId={deleteId}
        loadClients={loadClients}
      />
      <Toaster />
    </div>
  );
};

const CardSection = ({
  data,
  setIsOpen,
  setIsDeleteOpen,
  setFilterBy,
  setSortBy,
  setSearch,
  setFormData,
  setErrors,
  setDeleteId,
}: {
  data: Client[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterBy: React.Dispatch<React.SetStateAction<string>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setErrors: React.Dispatch<React.SetStateAction<object>>;
  setDeleteId: React.Dispatch<React.SetStateAction<string>>;
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
            { label: "All Clients", value: 50, color: "bg-blue-400" },
            { label: "Active", value: 40, color: "bg-green-400" },
            { label: "Inactive", value: 10, color: "bg-red-400" },
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
          <Button
            variant="secondary"
            className="ml-4 cursor-pointer"
            onClick={() => {
              setIsOpen(true), setFormData({}), setErrors({});
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        </div>
      </div>
      {data.length > 0 ? (
        <ClientTable
          data={data}
          setIsOpen={setIsOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          setDeleteId={setDeleteId}
          setFormData={setFormData}
        />
      ) : (
        <NoData />
      )}
    </>
  );
};

const ClientTable = ({
  data,
  setIsOpen,
  setIsDeleteOpen,
  setDeleteId,
  setFormData,
}: {
  data: Client[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteId: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) => {
  const editData = ({ id }: { id: string }) => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "edit-client",
          id: id,
        },
      })
      .then((response) => {
        const data = response.data.data;
        console.log(data);
        setFormData({
          id: data.id,
          clientName: data.clientName,
          clientCompany: data.companyName,
          contactNumber: data.contactNumber,
          contactEmail: data.email,
        });
        setIsOpen(true);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const deleteData = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };
  return (
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
              <TableCell className={cellClass}>
                {client.contactNumber}
              </TableCell>
              <TableCell className={cellClass}>{client.email}</TableCell>
              <TableCell className={cellClass}>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    size="icon"
                    onClick={() => editData(client.id)}
                  >
                    <Pencil className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                  </Button>
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    size="icon"
                    onClick={() => deleteData(client.id)}
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
};

const AddClientDialog = ({
  isOpen,
  setIsOpen,
  loadClients,
  formData,
  setFormData,
  errors,
  setErrors,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadClients: () => void;
  formData: any; // Assuming formData type is defined
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: any; // Assuming errors type is defined
  setErrors: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.clientName) newErrors.clientName = "Client name is required";
    if (!formData.clientCompany)
      newErrors.clientCompany = "Client company is required";
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10,15}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Invalid contact number";
    }
    if (!formData.contactEmail) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      data.append("type", "add-client");

      await axios
        .post("http://127.0.0.1:8000/post-data", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setFormData({
              clientName: "",
              clientCompany: "",
              contactNumber: "",
              contactEmail: "",
            });
            setErrors({});
            setIsOpen(false);
            toast.success(
              `Client ${formData.id ? "updated" : "added"} successfully`
            );
            loadClients(); // Reload clients if necessary
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[80vw] md:max-w-[60vw] overflow-hidden rounded-lg">
        <DialogHeader>
          <DialogTitle className="my-4 text-xl text-[#0044A3] font-bold text-center">
            Add Client
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-6">
          <InputField
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            error={errors.clientName}
            max="250"
            placeholder="Enter the Client Name"
          />
          <InputField
            label="Client Company"
            name="clientCompany"
            value={formData.clientCompany}
            onChange={handleChange}
            error={errors.clientCompany}
            max="250"
            placeholder="Enter the Client Company"
          />
          <InputField
            label="Contact Number"
            name="contactNumber"
            type="number"
            value={formData.contactNumber}
            onChange={handleChange}
            error={errors.contactNumber}
            max="20"
            placeholder="Enter the Contact Number"
          />
          <InputField
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            error={errors.contactEmail}
            max="250"
            placeholder="Enter the Contact Email"
          />
          <div className="flex justify-center gap-6 my-6">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#0044A3] rounded-[3px] hover:bg-blue-950"
            >
              {submitting ? "Saving..." : "Save"}
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
};

const DeleteDialog = ({
  isDeleteOpen,
  setIsDeleteOpen,
  deleteId,
  loadClients,
}: {
  isDeleteOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteId: string;
  loadClients: () => void;
}) => {
  const deleteData = () => {
    axios
      .post(`http://127.0.0.1:8000/post-data`, {
        type: "delete-client",
        id: deleteId,
      })
      .then((response) => {
        const data = response.data.data;
        setIsDeleteOpen(false);
        toast.success("Client deleted successfully");
        loadClients();
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
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
              onClick={deleteData}
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
};
export default Client;
