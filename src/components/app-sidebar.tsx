import * as React from "react";
import { SquareTerminal, Bot, BookOpen, Settings2 } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import logo from "@/assets/logo.png";

// Sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  menus: [
    { name: "Design Engineering", url: "#", icon: SquareTerminal },
    { name: "Sales & Marketing", url: "#", icon: Bot },
    { name: "Travel", url: "#", icon: BookOpen },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center h-16 px-4">
          <img
            src={logo}
            className="w-24 h-auto sm:w-28 md:w-32 lg:w-36 xl:w-40"
            alt="YITRO Logo"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.menus} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
