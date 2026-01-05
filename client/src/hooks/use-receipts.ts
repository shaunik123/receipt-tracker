import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useReceipts() {
  return useQuery({
    queryKey: [api.receipts.list.path],
    queryFn: async () => {
      const res = await fetch(api.receipts.list.path);
      if (!res.ok) throw new Error("Failed to fetch receipts");
      return api.receipts.list.responses[200].parse(await res.json());
    },
  });
}

export function useReceipt(id: number) {
  return useQuery({
    queryKey: [api.receipts.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.receipts.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch receipt");
      return api.receipts.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useUploadReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(api.receipts.upload.path, {
        method: api.receipts.upload.method,
        body: formData,
        // Content-Type is set automatically for FormData
      });
      if (!res.ok) throw new Error("Upload failed");
      return api.receipts.upload.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.receipts.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.insights.get.path] }); // Update insights too
    },
  });
}

export function useAnalyzeReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.receipts.analyze.path, { id });
      const res = await fetch(url, { method: api.receipts.analyze.method });
      if (!res.ok) throw new Error("Analysis failed");
      return api.receipts.analyze.responses[200].parse(await res.json());
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [api.receipts.get.path, id] });
      queryClient.invalidateQueries({ queryKey: [api.receipts.list.path] });
    },
  });
}
