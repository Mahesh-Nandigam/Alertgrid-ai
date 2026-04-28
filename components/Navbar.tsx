import Link from "next/link";
import { ShieldAlert, Bell, User, Menu } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">AlertGrid AI</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/incidents" className="hover:text-foreground transition-colors">
              Incidents
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Reports
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-4">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-background"></span>
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
              <User className="h-5 w-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
