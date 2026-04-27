import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siteConfigApi } from "@/lib/api";
import { toast } from "sonner";

export function useSiteConfig() {
  return useQuery({
    queryKey: ["site-config"],
    queryFn: () => siteConfigApi.get().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminSiteConfig() {
  return useQuery({
    queryKey: ["admin-site-config"],
    queryFn: () => siteConfigApi.adminGet().then((r) => r.data),
  });
}

export function useUpdateSiteConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: siteConfigApi.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-config"] });
      qc.invalidateQueries({ queryKey: ["admin-site-config"] });
      toast.success("Settings saved");
    },
    onError: () => toast.error("Failed to save settings"),
  });
}

export function useDeleteLogo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: siteConfigApi.deleteLogo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-config"] });
      qc.invalidateQueries({ queryKey: ["admin-site-config"] });
      toast.success("Logo removed");
    },
    onError: () => toast.error("Failed to remove logo"),
  });
}

export function useAdminSocialLinks() {
  return useQuery({
    queryKey: ["admin-social-links"],
    queryFn: () => siteConfigApi.socialLinks().then((r) => r.data),
  });
}

export function useCreateSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: siteConfigApi.createSocialLink,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-social-links"] }); qc.invalidateQueries({ queryKey: ["site-config"] }); toast.success("Social link added"); },
    onError: () => toast.error("Failed to add social link"),
  });
}

export function useUpdateSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => siteConfigApi.updateSocialLink(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-social-links"] }); qc.invalidateQueries({ queryKey: ["site-config"] }); toast.success("Social link updated"); },
    onError: () => toast.error("Failed to update social link"),
  });
}

export function useDeleteSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: siteConfigApi.deleteSocialLink,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-social-links"] }); qc.invalidateQueries({ queryKey: ["site-config"] }); toast.success("Social link deleted"); },
    onError: () => toast.error("Failed to delete social link"),
  });
}
