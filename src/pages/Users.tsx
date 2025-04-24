import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PaginationSection from "@/components/ui/page";
import NoData from "@/components/ui/nodata";
import SortBy from "@/components/ui/sortby";
import InputField from "@/components/ui/inputfield";
import axios from "axios";
import {
  Plus,
  Menu as MenuIcon,
  EllipsisVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSection,
} from "@headlessui/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
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

  const loadUsers = () => {
    axios
      .get(`http://127.0.0.1:8000/get-data`, {
        params: {
          type: "users-list",
          page: "page",
          limit: limit,
          filterby: filterBy,
          sortby: sortBy,
          searchby: search,
        },
      })
      .then((response) => {
        setUsers(response.data.data);
        setTotal(75);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    loadUsers();
  }, [filterBy, sortBy, search, page]);

  return (
    <div className="p-4">
      <CardSection
        data={users}
        setIsOpen={setIsOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        setFilterBy={setFilterBy}
        setSortBy={setSortBy}
        setSearch={setSearch}
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
      />
      <DeleteDialog
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
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
}: {
  data: User[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterBy: React.Dispatch<React.SetStateAction<string>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
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
            setValue={handleSortChange}
            sortBy={sortOptions}
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

      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 my-7">
          {data.map((user, index) => (
            <UsersCard
              key={index}
              user={user}
              editData={() => setIsOpen(true)}
              deleteData={() => setIsDeleteOpen(true)}
            />
          ))}
        </div>
      ) : (
        <NoData />
      )}
    </>
  );
};

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
          <ActionSection id={"1"} editData={editData} deleteData={deleteData} />
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

const ActionSection = ({
  editData,
  deleteData,
}: {
  editData: () => void;
  deleteData: () => void;
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="cursor-pointer inline-flex items-center justify-center rounded-md p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-1">
          <EllipsisVertical className="h-4 w-4" />
        </Menu.Button>
      </div>

      <Menu.Items className="absolute right-0 z-20 mt-1 w-32 origin-top-right rounded-md bg-white shadow-md ring-1 ring-black/10 focus:outline-none text-xs">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={editData}
                className={`flex items-center gap-1.5 w-full px-3 py-1.5 transition-colors rounded-sm ${
                  active ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-50"
                }`}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={deleteData}
                className={`flex items-center gap-1.5 w-full px-3 py-1.5 transition-colors rounded-sm ${
                  active ? "bg-red-50 text-red-600" : "hover:bg-gray-50"
                }`}
              >
                <Trash className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};

const AddUserDialog = ({
  isOpen,
  setIsOpen,
  loadUsers,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadUsers: () => void;
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    role: "",
    profile: null as File | null,
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};

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
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please confirm your password";
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }
    if (!formData.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "file" && e.target.files) {
      const file = e.target.files[0];

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          profile: "Only JPG/PNG files allowed",
        }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profile: "File must be under 2MB" }));
        return;
      }

      setFormData((prev) => ({ ...prev, profile: file }));
      return;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
  };

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

      // Add any extra info outside formData
      data.append("type", "add-user");

      await axios
        .post("http://127.0.0.1:8000/post-data", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status == 200) {
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              phone_number: "",
              password: "",
              confirm_password: "",
              role: "",
              profile: null,
            });
            setErrors({});
            setIsOpen(false);
            toast.success("User added successfully");
            loadUsers();
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
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
        setErrors(formattedErrors);
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
            Add a New User
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

            <div className="flex items-center gap-4">
              <Label className="text-[#1E293B] w-[30%]">Profile</Label>
              <Input
                name="profile"
                type="file"
                onChange={handleChange}
                className="w-[70%]"
              />
              {errors.profile && (
                <p className="text-red-500 text-xs mt-1">{errors.profile}</p>
              )}
            </div>
          </div>

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

export default Users;
