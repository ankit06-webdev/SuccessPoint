import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "../../features/auth/authSlice"
import api from "@/services/api"
import { cn } from "@/lib/utils"
import { Loader2, BookOpen, Mail, Lock, EyeOff, ArrowRight } from "lucide-react"

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await api.post("/auth/login", { email, password })
      const data = response.data.user
      
      dispatch(login(data))

      const roleRoutes = {
        student: "/student-dashboard",
        teacher: "/teacher-dashboard",
        admin: "/admin-dashboard"
      }

      const targetRoute = roleRoutes[data?.role] || "/"
      navigate(targetRoute, { replace: true })
            
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center relative font-['Inter',sans-serif] text-[#1b1b24] md:pt-10 pt-5", className)} {...props}>

      <div className="relative z-10 w-full max-w-[360px] md:max-w-[460px] px-4 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-[#3525cd] rounded-[0.25rem] flex items-center justify-center shadow-[0px_1px_3px_rgba(0,0,0,0.1)] mb-6">
            <BookOpen className="text-[#ffffff] h-6 w-6" />
          </div>
          <h1 className="text-[36px] font-bold tracking-[-0.02em] leading-[40px] text-[#1b1b24] mb-2">
            Welcome back
          </h1>
          <p className="text-[16px] text-[#464555]">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-[#ffffff] border border-[#c7c4d8] rounded-[.9rem] shadow-[0px_1px_3px_rgba(0,0,0,0.1)] overflow-hidden relative">
          {/* Top Accent Border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[#3525cd]"></div>

          <div className="p-8 md:p-10 md:pb-2 rounded-2xl">
            <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
              
              {/* Error Message Display */}
              {error && (
                <div className="p-3 text-[14px] font-medium text-[#ba1a1a] bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-[0.25rem]">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[12px] font-medium leading-[16px] text-[#1b1b24] hover:text-[#3525cd]">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[#777587]" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@school.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#ffffff] border border-[#c7c4d8] rounded-[0.25rem] text-[14px] focus:outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] transition-colors placeholder:text-[#777587] hover:border-[#3525cd]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-[12px] font-medium leading-[16px] text-[#1b1b24] hover:text-[#3525cd]">
                    Password
                  </label>
                  <a href="#" className="text-[12px] font-medium text-[#3525cd] hover:text-[#3323cc] hover:underline transition-colors">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#777587]" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#ffffff] border border-[#c7c4d8] rounded-[0.25rem] text-[14px] focus:outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] transition-colors placeholder:text-[#777587] tracking-widest hover:border-[#3525cd]"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#777587] hover:text-[#3525cd] transition-colors">
                    <EyeOff className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Remember Device */}
              <div className="flex items-center pt-5 pb-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded-[0.25rem] border-[#c7c4d8] text-[#3525cd] focus:ring-[#3525cd]"
                />
                <label htmlFor="remember" className="ml-2.5 block text-[14px] text-[#464555]">
                  Remember this device
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-[0.25rem] text-[14px] font-medium text-[#ffffff] bg-[#3525cd] hover:bg-[#302f39] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3525cd] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-12 mb-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3525cd]"></div>
              </div>
              <div className="relative flex justify-center text-[12px] ">
                <span className="px-4 bg-[#ffffff] text-[#3525cd] font-medium uppercase tracking-wider text-[10px]">
                  Success Point
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-[14px] text-[#464555] font-medium">
          Don't have an account?{" "}
          <a href="#" className="font-semibold text-[#3525cd] hover:text-[#3323cc] hover:underline transition-colors">
            Request access
          </a>
        </p>
      </div>
    </div>
  )
}