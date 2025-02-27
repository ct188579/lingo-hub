import { Atom } from 'lucide-react'
import { BookOpen, NotebookText, NotebookPen, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Daily Reading",
    url: "/",
    icon: BookOpen,
  },
  {
    title: "Vocabulary Book",
    url: "/vocabulary",
    icon: NotebookText,
  },
  {
    title: "Awesome Sentence",
    url: "/sentence",
    icon: NotebookPen,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Atom color="#2664a6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight">LingoHub</h1>
            <p className="text-xs text-muted-foreground">Learn. Practice. Master.</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="container mx-auto text-center">
          <p className="text-sm">
          <span>© 2025 陈涛. All Rights Reserved. </span><br/>
          <a href="https://icp.gov.moe/?keyword=20255918" target="_blank">萌ICP备20255918号</a>
          </p>
        </div>
        
      </SidebarFooter>
    </Sidebar>
  )
}
