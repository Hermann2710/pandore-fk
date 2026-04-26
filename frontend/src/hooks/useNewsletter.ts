import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { newsletterApi } from "@/lib/api";
import { toast } from "sonner";

export function useCheckSubscription(email: string) {
  return useQuery({
    queryKey: ["newsletter-check", email],
    queryFn: () => newsletterApi.check(email).then((r) => r.data.subscribed),
    enabled: !!email,
    staleTime: 0,
  });
}

export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: newsletterApi.subscribe,
    onSuccess: (_, email) => {
      qc.invalidateQueries({ queryKey: ["newsletter-check", email] });
      toast.success("Successfully subscribed to the newsletter! 🎉");
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? "Subscription failed"),
  });
}

export function useUnsubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: newsletterApi.unsubscribe,
    onSuccess: (_, email) => {
      qc.invalidateQueries({ queryKey: ["newsletter-check", email] });
      toast.success("You have been unsubscribed.");
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? "Failed to unsubscribe"),
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useAdminSubscribers() {
  return useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: () => newsletterApi.adminSubscribers().then((r) => r.data),
  });
}

export function useAdminNewsletters() {
  return useQuery({
    queryKey: ["admin-newsletters"],
    queryFn: () => newsletterApi.adminNewsletters().then((r) => r.data),
  });
}

export function useCreateNewsletter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: newsletterApi.createNewsletter,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-newsletters"] }); toast.success("Newsletter saved as draft"); },
    onError: () => toast.error("Failed to save newsletter"),
  });
}

export function useUpdateNewsletter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { subject: string; content: string } }) =>
      newsletterApi.updateNewsletter(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-newsletters"] }); toast.success("Newsletter updated"); },
    onError: () => toast.error("Failed to update newsletter"),
  });
}

export function useDeleteNewsletter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: newsletterApi.deleteNewsletter,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-newsletters"] }); toast.success("Newsletter deleted"); },
    onError: () => toast.error("Failed to delete newsletter"),
  });
}

export function useSendNewsletter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: newsletterApi.sendNewsletter,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["admin-newsletters"] });
      toast.success(res.data.detail, { icon: "📧" });
    },
    onError: (err: any) => toast.error(err?.response?.data?.detail ?? "Failed to send newsletter"),
  });
}
