import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  CheckCircle2,
  TrendingUp,
  Clock,
  LogIn,
  LogOut
} from "lucide-react";

interface HeaderProps {
  completedTasksCount: number;
  pendingTasksCount: number;
  completionRate: number;
  user: User | null;
}

const Header = ({ completedTasksCount, pendingTasksCount, completionRate, user }: HeaderProps) => {
  const router = useRouter();

  // Handle logout 
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    toast.loading("Logging out...", {
      id: "logout-process"
    });
    
    try {
      // Use Firebase signOut 
      await signOut(auth);
      
      toast.success("Successfully logged out!", {
        id: "logout-process"
      });
      
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      
      toast.error("Failed to logout. Please try again.", {
        id: "logout-process"
      });
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Task Manager
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-600">
              Generate, organize, and track your tasks efficiently
            </p>
          </div>

          {/* User Info, Badges and Auth Button */}
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
            {/* {user && (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 text-sm sm:text-base py-1"
              >
                {user.email?.split('@')[0] || 'User'}
              </Badge>
            )} */}
            
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 text-sm sm:text-base py-1"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {completedTasksCount} completed
            </Badge>

            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 text-sm sm:text-base py-1"
            >
              <Clock className="w-4 h-4 mr-1" />
              {pendingTasksCount} pending
            </Badge>

            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200 text-sm sm:text-base py-1"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              {completionRate}% complete
            </Badge>

            {user ? (
              <Button
                variant="outline"
                className="flex items-center cursor-pointer gap-2 border-red-200 text-red-700 hover:bg-red-50 text-sm sm:text-base"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 text-sm sm:text-base"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;