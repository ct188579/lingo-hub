import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: 'LingoHub-An AI app for learning American English',
  description: 'LingoHub-An app for learning American English daddy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <main className="flex flex-col min-h-screen w-full">
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
