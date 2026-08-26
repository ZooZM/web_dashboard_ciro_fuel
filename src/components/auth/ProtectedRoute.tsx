import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('يرجى تسجيل الدخول أولاً')
      navigate('/login', { replace: true })
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      toast.error('ليس لديك الصلاحية للوصول إلى هذه الصفحة')
      navigate('/', { replace: true })
      return
    }
  }, [isAuthenticated, user, navigate, allowedRoles])

  if (!isAuthenticated) {
    return null
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
