import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// NUDGES
export function useNudges() {
  return useQuery({
    queryKey: [api.nudges.list.path],
    queryFn: async () => {
      const res = await fetch(api.nudges.list.path);
      if (!res.ok) throw new Error("Failed to fetch nudges");
      return api.nudges.list.responses[200].parse(await res.json());
    },
  });
}

export function useMarkNudgeRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.nudges.markRead.path, { id });
      const res = await fetch(url, { method: api.nudges.markRead.method });
      if (!res.ok) throw new Error("Failed to mark read");
      return api.nudges.markRead.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.nudges.list.path] });
    },
  });
}

// INSIGHTS
export function useInsights() {
  return useQuery({
    queryKey: [api.insights.get.path],
    queryFn: async () => {
      const res = await fetch(api.insights.get.path);
      if (!res.ok) throw new Error("Failed to fetch insights");
      return api.insights.get.responses[200].parse(await res.json());
    },
  });
}
