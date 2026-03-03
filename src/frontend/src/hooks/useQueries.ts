import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Shareholder {
  id: string;
  nationality: string;
  lastName: string;
  companyId: string;
  firstName: string;
}

export interface ShareholderInput {
  nationality: string;
  lastName: string;
  firstName: string;
}

export interface Company {
  id: string;
  status: "complete" | "draft";
  name: string;
  totalCapital: number;
  numShareholders: string;
}

export interface CompanyWithShareholders {
  company: Company;
  shareholders: Array<Shareholder>;
}

export function useGetCompanies() {
  return useQuery<CompanyWithShareholders[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await fetch("/api/companies");
      if (!res.ok) throw new Error("Failed to fetch companies");
      return res.json();
    },
  });
}

export function useGetCompany(id: string | null) {
  return useQuery<CompanyWithShareholders | null>({
    queryKey: ["company", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/companies/${id}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch company");
      }
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      numShareholders,
      totalCapital,
    }: {
      name: string;
      numShareholders: string;
      totalCapital: number;
    }) => {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, numShareholders, totalCapital }),
      });
      if (!res.ok) throw new Error("Failed to create company");
      const data = await res.json();
      return data.id; // Returns string ID
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useUpdateShareholders() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      companyId,
      shareholders,
    }: {
      companyId: string;
      shareholders: ShareholderInput[];
    }) => {
      const res = await fetch(`/api/companies/${companyId}/shareholders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareholders }),
      });
      if (!res.ok) throw new Error("Failed to update shareholders");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete company");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
