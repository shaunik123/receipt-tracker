import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type AuthRegisterInput } from "@shared/routes";
import { useLocation } from "wouter";

export function useUser() {
  return useQuery({
    queryKey: [api.auth.user.path],
    queryFn: async () => {
      const res = await fetch(api.auth.user.path);
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.user.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (credentials: AuthRegisterInput) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid username or password");
        throw new Error("Login failed");
      }
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.auth.user.path] });
      setLocation("/");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (credentials: AuthRegisterInput) => {
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return api.auth.register.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Typically auto-login or redirect to login. Assuming auto-login via session.
      queryClient.invalidateQueries({ queryKey: [api.auth.user.path] });
      setLocation("/");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.logout.path, {
        method: api.auth.logout.method,
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.user.path], null);
      setLocation("/auth");
    },
  });
}
