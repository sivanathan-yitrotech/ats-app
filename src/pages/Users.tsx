import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PaginationSection from "@/components/ui/page";
import NoData from "@/components/ui/nodata";
import SortBy from "@/components/ui/sortby";
import InputField from "@/components/ui/inputfield";
import { getUserToken, ucFirst } from "../../utils/common";
import Config from "@/config.json";
import axios from "axios";
import { Plus, Menu as MenuIcon, Pencil, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tableHeaderClass = "text-[#0044A3] font-semibold text-sm py-3 px-6";
const cellClass = "text-sm font-medium text-gray-700 py-3 px-6";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  last_updated: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("0");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const limit = 20;
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<Array<{ id: string; name: string }>>(
    []
  );

  const loadOptions = () => {
    axios
      .get(`${Config.api_endpoint}fetch_data/fetch/client_list`, {
        headers: {
          Authorization: `Bearer ${getUserToken()}`,
        },
      })
      .then((response) => {
        setOptions(response.data.managers);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const loadUsers = () => {
    axios
      .get(`${Config.api_endpoint}user/readall`, {
        headers: {
          Authorization: `Bearer ${getUserToken()}`,
        },
        params: {
          page: page,
          limit: limit,
          filterby: filterBy,
          sortby: sortBy,
          searchby: search,
        },
      })
      .then((response) => {
        setUsers(response.data.data.list);
        setTotal(response.data.data.total);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    loadUsers();
  }, [filterBy, sortBy, search, page]);

  interface UserFormData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone_number: string;
    password: string;
    confirm_password: string;
    role: string;
    manager: string;
    last_updated: string;
  }

  const [formData, setFormData] = useState<UserFormData>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    role: "",
    manager: "",
    last_updated: "",
  });

  const [deleteId, setDeleteId] = useState("0");

  return (
    <div className="p-4">
      <CardSection
        data={users}
        setIsOpen={setIsOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        setFilterBy={setFilterBy}
        setSortBy={setSortBy}
        setSearch={setSearch}
        setFormData={setFormData}
        setErrors={setErrors}
        setDeleteId={setDeleteId}
      />
      <PaginationSection
        total={total}
        limit={limit}
        page={page}
        setPage={setPage}
      />
      <AddUserDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        loadUsers={loadUsers}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        options={options as { id: string; name: string }[]}
      />
      <DeleteDialog
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        deleteId={deleteId}
        loadUsers={loadUsers}
      />
      <Toaster />
    </div>
  );
};

interface UserFormData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  role: string;
  manager: string;
  last_updated: string;
}

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
  data: User[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterBy: React.Dispatch<React.SetStateAction<string>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
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
        <div className="flex items-center gap-7 mb-4 bg-[#F1F5F9] rounded-lg p-2 w-auto px-3">
          {["All Users", "Managers", "Recruiters"].map((label, idx) => (
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
              {idx === 0 && <MenuIcon className="h-4 w-4" />}
              <p className="text-[#475569] text-sm">{label}</p>
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
              setIsOpen(true),
                setFormData({
                  id: "",
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone_number: "",
                  password: "",
                  confirm_password: "",
                  role: "",
                  manager: "",
                  last_updated: "",
                }),
                setErrors({});
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      {data.length > 0 ? (
        <UsersTable
          user={data}
          setIsOpen={setIsOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          setFormData={setFormData}
          setDeleteId={setDeleteId}
        />
      ) : (
        <NoData />
      )}
    </>
  );
};

const UsersTable = ({
  user,
  setIsOpen,
  setIsDeleteOpen,
  setFormData,
  setDeleteId,
}: {
  user: User[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  setDeleteId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const editData = (userId: string) => {
    axios
      .get(`${Config.api_endpoint}user/read`, {
        headers: {
          Authorization: `${userId}`,
          // id: userId,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setFormData({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone_number: data.phoneNumber,
          password: "",
          confirm_password: "",
          manager: "",
          role: data.role,
          last_updated: data.last_updated,
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
            <TableHead className={tableHeaderClass}>Full Name</TableHead>
            <TableHead className={tableHeaderClass}>Role</TableHead>
            <TableHead className={tableHeaderClass}>Email</TableHead>
            <TableHead className={tableHeaderClass}>Mobile Number</TableHead>
            <TableHead className={tableHeaderClass}>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user.map((userData, i) => (
            <TableRow key={i}>
              <TableCell className={cellClass}>
                {userData.firstName} {userData.lastName}
              </TableCell>
              <TableCell className={cellClass}>
                <Badge
                  className={`text-[10px] text-black px-2 py-1 rounded-full ${
                    userData.role === "manager" ? "bg-lime-200" : "bg-teal-200"
                  }`}
                >
                  {ucFirst(userData.role)}
                </Badge>
              </TableCell>
              <TableCell className={cellClass}>{userData.email}</TableCell>
              <TableCell className={cellClass}>
                {userData.phoneNumber}
              </TableCell>
              <TableCell className={cellClass}>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    size="icon"
                    onClick={() => editData(userData.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    className="cursor-pointer"
                    size="icon"
                    onClick={() => deleteData(userData.id)}
                  >
                    <Trash className="h-4 w-4" />
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

interface DialogData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone_number: string;
  role: string;
  last_updated: string;
  password: string;
  confirm_password: string;
  manager: string;
}

const AddUserDialog = ({
  isOpen,
  setIsOpen,
  loadUsers,
  formData,
  setFormData,
  errors,
  setErrors,
  options,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadUsers: () => void;
  formData: DialogData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  options: { id: string; name: string }[];
}) => {
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Invalid phone number";
    }
    if (!formData.password && !formData.id) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6 && formData.password) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirm_password && !formData.id) {
      newErrors.confirm_password = "Please confirm your password";
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.manager && formData.role == "recruiter")
      newErrors.manager = "Manager is required";
    setErrors({
      ...newErrors,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
  };
  const [formError, setFormError] = useState("");
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const data = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          data.append(key, value as any);
        }
      });

      // Determine the API method and endpoint based on the id
      const method = formData.id ? "put" : "post";
      const endpoint = formData.id
        ? `${Config.api_endpoint}user/update`
        : `${Config.api_endpoint}user/create`;

      await axios[method](endpoint, data, {
        headers: {
          Authorization: `${formData.id}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            setFormData({
              id: "",
              firstName: "",
              lastName: "",
              email: "",
              phone_number: "",
              password: "",
              confirm_password: "",
              role: "",
              manager: "",
              last_updated: "",
            });
            setErrors({});
            setIsOpen(false);
            toast.success(
              `User  ${formData.id ? "updated" : "added"} successfully`
            );
            loadUsers();
          }
        })
        .catch((error) => {
          setFormError(error.message);
        });
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const formattedErrors: Partial<typeof formData> = {};
        for (const [key, value] of Object.entries(backendErrors)) {
          formattedErrors[key as keyof typeof formData] = Array.isArray(value)
            ? value[0]
            : value;
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[80vw] md:max-w-[60vw] overflow-hidden rounded-lg">
        <DialogHeader>
          <DialogTitle className="my-4 text-xl text-[#0044A3] font-bold text-center">
            {formData.id ? "Update a User" : "Add a New User"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              max="250"
              placeholder="Enter the First Name"
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              max="250"
              placeholder="Enter the Last Name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              max="250"
              placeholder="Enter the Email"
              type="email"
            />
            <InputField
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              error={errors.phone_number}
              max="20"
              placeholder="Enter the Phone Number"
              type="number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              max="250"
              placeholder="Enter the Password"
            />
            <InputField
              label="Confirm Password"
              name="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleChange}
              error={errors.confirm_password}
              max="250"
              placeholder="Enter the Confirm Password"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Role</Label>
              <div className="w-[70%] flex flex-col gap-2">
                <div className="flex gap-4">
                  {["manager", "recruiter"].map((role) => (
                    <label key={role} className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{role}</span>
                    </label>
                  ))}
                </div>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.role}
                  </p>
                )}
              </div>
            </div>
            {formData.role == "recruiter" && (
              <div className="flex items-center gap-4">
                <Label className="text-[#1E293B] w-[30%]">Manager</Label>
                <div className="w-[70%] flex flex-col gap-2">
                  <Select
                    name="cliemanagerntName"
                    onValueChange={(val) =>
                      handleChange({
                        target: { name: "manager", value: val },
                      } as any)
                    }
                    defaultValue=""
                    value={formData.manager}
                  >
                    <SelectTrigger className="w-full placeholder:text-[13px] px-4 py-5">
                      <SelectValue placeholder="Select Manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map(
                        (data: { id: string; name: string }, index: number) => (
                          <SelectItem key={index} value={data.id}>
                            {data.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  {errors.manager && (
                    <p className="text-red-500 text-xs mt-1 ml-2">
                      {errors.manager}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-6 my-3">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#0044A3] rounded-[3px] hover:bg-blue-950"
            >
              {submitting
                ? formData.id
                  ? "Updating..."
                  : "Saving..."
                : formData.id
                ? "Update"
                : "Save"}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-white rounded-[3px] hover:bg-neutral-300 border border-[#64748B] text-[#64748B]"
            >
              Cancel
            </Button>
          </div>
          {formError && (
            <div className="flex justify-center items-center">
              <p className="text-red-500 text-xs">{formError}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DeleteDialog = ({
  isDeleteOpen,
  setIsDeleteOpen,
  deleteId,
  loadUsers,
}: {
  isDeleteOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteId: string;
  loadUsers: () => void;
}) => {
  const deleteData = () => {
    axios
      .delete(`${Config.api_endpoint}user/delete/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${getUserToken()}`,
        },
      })
      .then((response) => {
        console.log(response);
        setIsDeleteOpen(false);
        toast.success("User  deleted successfully");
        loadUsers();
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

export default Users;
