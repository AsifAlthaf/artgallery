import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';

// Firebase imports
import { getRedirectResult, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase-config';

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  name: z.string().min(6, { message: "Name must be at least 6 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const googleSyncHandled = useRef(false);
  const authRequestConfig = { timeout: 15000 };

  const syncGoogleUser = async (firebaseUser) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const { data } = await axios.post(
      `${API_URL}/auth/google`,
      {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        googleId: firebaseUser.uid,
        imageUrl: firebaseUser.photoURL,
      },
      { timeout: 15000 }
    );

    login(data, data.token);
    toast.success('Google Sign In successful!');
    navigate('/');
  };

  const promptGoogleLink = (firebaseUser) => {
    if (!firebaseUser || googleSyncHandled.current) {
      return;
    }

    googleSyncHandled.current = true;
    setLoading(false);
    setPendingGoogleUser(firebaseUser);
  };

  const continueGoogleLink = async () => {
    if (!pendingGoogleUser) return;

    try {
      setLoading(true);
      await syncGoogleUser(pendingGoogleUser);
      setPendingGoogleUser(null);
    } catch (error) {
      console.error('Google account link failed:', error);
      toast.error(error.response?.data?.message || error.message || 'Google Sign In failed!');
      googleSyncHandled.current = false;
    } finally {
      setLoading(false);
    }
  };

  const cancelGoogleLink = async () => {
    setPendingGoogleUser(null);
    googleSyncHandled.current = false;
    try {
      await signOut(auth);
    } catch {
      // Ignore sign-out errors from Firebase session cleanup.
    }
  };

  useEffect(() => {
    const completeRedirectLogin = async () => {
      try {
        const result = await getRedirectResult(auth);
        const firebaseUser = result?.user || auth.currentUser;

        if (firebaseUser && !googleSyncHandled.current) {
          promptGoogleLink(firebaseUser);
        }
      } catch (error) {
        console.error('Google redirect sign in error:', error);
        toast.error(error.response?.data?.message || error.message || 'Google Sign In failed!');
      } finally {
        setLoading(false);
      }
    };

    completeRedirectLogin();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && !googleSyncHandled.current && !pendingGoogleUser) {
        promptGoogleLink(firebaseUser);
      }
    });

    return () => unsubscribe();
  }, [pendingGoogleUser]);

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Register form
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (values) => {
    setLoading(true);
    try {
      if (isAdminLogin) {
        // Secure Internal Admin Bypass Check
        if (values.email === import.meta.env.VITE_ADMIN_EMAIL && values.password === import.meta.env.VITE_ADMIN_PASSWORD) {
           const adminUser = {
              _id: 'admin_master_1',
              name: 'ArtBloom System Admin',
              email: import.meta.env.VITE_ADMIN_EMAIL,
              role: 'admin',
              isAdmin: true,
              username: 'sysadmin'
           };
           login(adminUser, import.meta.env.VITE_ADMIN_TOKEN);
           toast.success("Administrator Access Granted.");
           navigate('/profile'); // Renders internal dashboard logic
           return;
        } else {
           throw new Error("Only Admins and developers can access this page");
        }
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const { data } = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: values.email,
          password: values.password
        },
        authRequestConfig
      );
      
      // Update your auth context with user data and token
      login(data, data.token);
      toast.success("Login successful!");
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      if (error.code === 'ECONNABORTED') {
        toast.error('Server is taking too long to respond. Try again in a few seconds.');
      } else {
        toast.error(error.response?.data?.message || error.message || "Login failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (values) => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const { data } = await axios.post(
        `${API_URL}/auth/register`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
          username: values.email.split('@')[0]
        },
        authRequestConfig
      );
      
      login(data, data.token);
      toast.success("Account created successfully!");
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      if (error.code === 'ECONNABORTED') {
        toast.error('Server is taking too long to respond. Try again in a few seconds.');
      } else {
        toast.error(error.response?.data?.message || "Registration failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Google Sign In error:', error);
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        toast.error("Sign in was cancelled");
      } else {
        toast.error(error.response?.data?.message || error.message || "Google Sign In failed!");
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-artbloom-cream">
      <Dialog open={Boolean(pendingGoogleUser)} onOpenChange={(open) => {
        if (!open && pendingGoogleUser) {
          cancelGoogleLink();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair text-2xl">Link Google account?</DialogTitle>
            <DialogDescription>
              The Google account below will be linked to your ArtBloom profile only if the email matches your existing ArtBloom email.
              If this is the wrong Google account, cancel and choose the correct one.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-orange-50 border border-orange-100 p-4 text-sm text-gray-700 space-y-1">
            <p><span className="font-semibold">Google email:</span> {pendingGoogleUser?.email || 'Unknown'}</p>
            <p><span className="font-semibold">Display name:</span> {pendingGoogleUser?.displayName || 'Unknown'}</p>
            <p className="text-xs text-gray-500 pt-1">
              Continue only if this is the same email you use for your ArtBloom account.
            </p>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={cancelGoogleLink} disabled={loading}>
              Cancel
            </Button>
            <Button type="button" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={continueGoogleLink} disabled={loading}>
              {loading ? 'Linking...' : 'Continue and Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-md mx-auto px-4">
          <Card className="glass-card">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-playfair text-center text-artbloom-charcoal">
                {isLogin ? "Welcome back" : "Create an account"}
              </CardTitle>
              <CardDescription className="text-center text-artbloom-charcoal/80">
                {isLogin 
                  ? "Enter your credentials to sign in to your account" 
                  : "Fill in your details to create a new account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Social Sign In */}
              <div className="space-y-3">
                <Button 
                  onClick={handleGoogleSignIn}
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 font-bold text-gray-700 hover:bg-gray-50 border-gray-200 shadow-sm"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {loading ? "Signing in..." : "Sign in with Google"}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {isLogin ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-artbloom-charcoal font-semibold">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" type="email" className="bg-white border-gray-300 text-artbloom-charcoal placeholder:text-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-artbloom-charcoal font-semibold">Password</FormLabel>
                          <FormControl>
                            <Input placeholder="********" type="password" className="bg-white border-gray-300 text-artbloom-charcoal placeholder:text-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <FormField
                          control={loginForm.control}
                          name="rememberMe"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-semibold leading-none text-artbloom-charcoal peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Remember me
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <Link to="#" className="text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline">
                          Forgot password?
                        </Link>
                      </div>

                      {/* Admin Toggle */}
                      <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md border border-gray-100">
                        <Checkbox 
                            id="admin-mode"
                            checked={isAdminLogin}
                            onCheckedChange={setIsAdminLogin}
                        />
                        <label htmlFor="admin-mode" className="text-sm font-bold text-red-600 cursor-pointer select-none">
                            Administrator Sign-In
                        </label>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-artbloom-charcoal font-semibold">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="bg-white border-gray-300 text-artbloom-charcoal placeholder:text-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-artbloom-charcoal font-semibold">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" type="email" className="bg-white border-gray-300 text-artbloom-charcoal placeholder:text-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-artbloom-charcoal font-semibold">Password</FormLabel>
                          <FormControl>
                            <Input placeholder="********" type="password" className="bg-white border-gray-300 text-artbloom-charcoal placeholder:text-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-artbloom-charcoal font-semibold">Confirm Password</FormLabel>
                          <FormControl>
                            <Input placeholder="********" type="password" className="bg-white border-gray-300 text-artbloom-charcoal placeholder:text-gray-400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md"
                      disabled={loading}
                    >
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="justify-center pt-2 pb-6">
              <Button 
                variant="link" 
                className="text-orange-600 font-bold hover:text-orange-700"
                onClick={() => setIsLogin(!isLogin)}
                disabled={loading}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      </div>
  );
};

export default Login;