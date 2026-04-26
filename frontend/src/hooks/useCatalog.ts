import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { catalogApi, adminCatalogApi } from "@/lib/api";
import { toast } from "sonner";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => catalogApi.categories().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => catalogApi.tags().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProducts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => catalogApi.products(params).then((r) => r.data),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => catalogApi.product(slug).then((r) => r.data),
  });
}

// Fetches products from the same category, excluding the current one
export function useRelatedProducts(categorySlug: string | undefined, excludeSlug: string) {
  return useQuery({
    queryKey: ["related-products", categorySlug, excludeSlug],
    queryFn: () =>
      catalogApi
        .products({ category: categorySlug!, ordering: "-created_at" })
        .then((r) => r.data.filter((p) => p.slug !== excludeSlug).slice(0, 8)),
    enabled: !!categorySlug,
    staleTime: 2 * 60 * 1000,
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useAdminProducts(search?: string) {
  return useQuery({
    queryKey: ["admin-products", search ?? ""],
    queryFn: () => adminCatalogApi.products(search ? { search } : {}).then((r) => r.data),
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminCatalogApi.categories().then((r) => r.data),
  });
}

export function useAdminTags() {
  return useQuery({
    queryKey: ["admin-tags"],
    queryFn: () => adminCatalogApi.tags().then((r) => r.data),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminCatalogApi.createProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); toast.success("Product created"); },
    onError: () => toast.error("Creation failed"),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => adminCatalogApi.updateProduct(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); toast.success("Product updated"); },
    onError: () => toast.error("Update failed"),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminCatalogApi.deleteProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); toast.success("Product deleted"); },
    onError: () => toast.error("Deletion failed"),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminCatalogApi.createCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("Category created"); },
    onError: () => toast.error("Creation failed"),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof adminCatalogApi.updateCategory>[1] }) =>
      adminCatalogApi.updateCategory(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("Category updated"); },
    onError: () => toast.error("Update failed"),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminCatalogApi.deleteCategory,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("Category deleted"); },
    onError: () => toast.error("Deletion failed — category may have products"),
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminCatalogApi.createTag,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-tags"] }); toast.success("Tag created"); },
    onError: () => toast.error("Creation failed"),
  });
}

export function useUpdateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof adminCatalogApi.updateTag>[1] }) =>
      adminCatalogApi.updateTag(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-tags"] }); toast.success("Tag updated"); },
    onError: () => toast.error("Update failed"),
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminCatalogApi.deleteTag,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-tags"] }); toast.success("Tag deleted"); },
    onError: () => toast.error("Deletion failed — tag may be in use"),
  });
}

// ── Homepage ──────────────────────────────────────────────────────────────────

export function useHomepageSections() {
  return useQuery({
    queryKey: ["homepage-sections"],
    queryFn: () => catalogApi.homepageSections().then((r) => r.data),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminHomepageSections() {
  return useQuery({
    queryKey: ["admin-homepage-sections"],
    queryFn: () => adminCatalogApi.homepageSections().then((r) => r.data),
  });
}

export function useCreateHomepageSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminCatalogApi.createHomepageSection,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-homepage-sections"] });
      qc.invalidateQueries({ queryKey: ["homepage-sections"] });
      toast.success("Section created");
    },
    onError: () => toast.error("Creation failed"),
  });
}

export function useUpdateHomepageSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      adminCatalogApi.updateHomepageSection(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-homepage-sections"] });
      qc.invalidateQueries({ queryKey: ["homepage-sections"] });
      toast.success("Section updated");
    },
    onError: () => toast.error("Update failed"),
  });
}

export function useDeleteHomepageSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminCatalogApi.deleteHomepageSection,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-homepage-sections"] });
      qc.invalidateQueries({ queryKey: ["homepage-sections"] });
      toast.success("Section deleted");
    },
    onError: () => toast.error("Deletion failed"),
  });
}
