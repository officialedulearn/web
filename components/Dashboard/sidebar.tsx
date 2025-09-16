import { 
  Home, 
  MessageCircle, 
  BookOpen, 
  Gift, 
  Trophy, 
  User 
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Logo from "@/../public/assets/icons/edulearn.png"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/dashboard/chat",
    icon: MessageCircle,
  },
  {
    title: "Quizzes",
    url: "/dashboard/quizzes",
    icon: BookOpen,
  },
  {
    title: "Rewards",
    url: "/dashboard/rewards",
    icon: Gift,
  },
  {
    title: "Leaderboard",
    url: "/dashboard/leaderboard",
    icon: Trophy,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="w-[256px]">
      <SidebarContent>
        <SidebarGroup className="mt-[24px]">
          <SidebarGroupLabel>
            <Image src={Logo} alt="EduLearn Logo" width={120} height={24} />
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-12">
            <SidebarMenu className="space-y-[18px]">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

