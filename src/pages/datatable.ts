import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const roles = ["admin", "manager", "recruiter"];

const tableHeaderClass = "text-[#0044A3] font-semibold text-sm py-3 px-6";
const cellClass = "text-sm font-medium text-gray-700 py-3 px-6";
const buttonClass =
  "bg-[#0044A3] rounded-[3px] cursor-pointer hover:bg-blue-950";

const Users = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [cache, setCache] = useState<{ [key: number]: any[] }>({});
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (pageNumber: number) => {
    if (cache[pageNumber]) return; // Don't fetch again if page already loaded
    setLoading(true);
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${pageNumber}`);
      const userData = response.data.data.map((user: any) => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
        role: roles[Math.floor(Math.random() * roles.length)],
      }));
      setCache(prev => ({ ...prev, [pageNumber]: userData }));
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const users = cache[page] || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#0044A3]">User List</h2>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="border-t-1 border-gray-200">
              <TableHead className={tableHeaderClass}>First Name</TableHead>
              <TableHead className={tableHeaderClass}>Last Name</TableHead>
              <TableHead className={tableHeaderClass}>Email ID</TableHead>
              <TableHead className={tableHeaderClass}>Phone Number</TableHead>
              <TableHead className={tableHeaderClass}>Role</TableHead>
              <TableHead className={tableHeaderClass}>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="border-t-1 border-gray-200">
                  <TableCell className={cellClass}>{user.firstName}</TableCell>
                  <TableCell className={cellClass}>{user.lastName}</TableCell>
                  <TableCell className={cellClass}>{user.email}</TableCell>
                  <TableCell className={cellClass}>{user.phoneNumber}</TableCell>
                  <TableCell className={cellClass}>{user.role}</TableCell>
                  <TableCell className={cellClass}>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Pencil className="h-5 w-5 cursor-pointer hover:text-blue-500 transition-colors" />
                      <Trash2 className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(page - 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(page + 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Users;
