import { useDeleteCompany, useGetCompanies } from "@/hooks/useQueries";
import type { CompanyWithShareholders } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Loader2,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(_idOrDate: string) {
  // IDs are sequential string digits - use current date as a proxy since backend doesn't store dates
  // We'll just show "registered" relative to now for demo purposes
  // In real app, backend would return a timestamp
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const isDraft = status === "draft";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-widest-plus uppercase ${isDraft ? "bg-muted text-muted-foreground" : "bg-lime/20 text-forest"
        }`}
    >
      {isDraft ? "Draft" : "Complete"}
    </span>
  );
}

function CompanyCard({
  data,
  onDelete,
}: {
  data: CompanyWithShareholders;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { company, shareholders } = data;

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete "${company.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    onDelete(company.id);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3 }}
      className="bg-card shadow-card hover:shadow-card-hover transition-shadow duration-200 flex flex-col"
    >
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-extrabold text-lg text-foreground truncate leading-tight">
              {company.name}
            </h3>
            <div className="mt-1.5">
              <StatusBadge status={String(company.status)} />
            </div>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            aria-label={`Delete ${company.name}`}
            className="shrink-0 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm">
            <DollarSign className="w-3.5 h-3.5 text-lime-dark shrink-0" />
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Capital
            </span>
            <span className="ml-auto font-semibold text-foreground text-sm">
              {formatCurrency(company.totalCapital)}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm">
            <Users className="w-3.5 h-3.5 text-lime-dark shrink-0" />
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Shareholders
            </span>
            <span className="ml-auto font-semibold text-foreground text-sm">
              {Number(company.numShareholders)}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-sm">
            <Calendar className="w-3.5 h-3.5 text-lime-dark shrink-0" />
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Registered
            </span>
            <span className="ml-auto font-semibold text-foreground text-sm">
              {formatDate(company.id)}
            </span>
          </div>
        </div>
      </div>

      {/* Expand shareholders */}
      {shareholders.length > 0 && (
        <>
          <div className="border-t border-border" />
          <button
            type="button"
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center justify-between px-6 py-3.5 text-xs font-bold tracking-widest-plus uppercase text-muted-foreground hover:text-forest transition-colors w-full text-left"
          >
            <span>Shareholders</span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5 space-y-2.5">
                  {shareholders.map((sh, i) => (
                    <div key={sh.id} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-tight">
                          {sh.firstName} {sh.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sh.nationality}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {shareholders.length === 0 && (
        <div className="px-6 pb-5 border-t border-border pt-3.5">
          <p className="text-xs text-muted-foreground italic">
            No shareholders recorded yet.
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function AdminPage() {
  const { data: companies, isLoading, isError, refetch } = useGetCompanies();
  const deleteCompany = useDeleteCompany();

  async function handleDelete(id: string) {
    try {
      await deleteCompany.mutateAsync(id);
      toast.success("Company deleted.");
    } catch {
      toast.error("Failed to delete company.");
      refetch();
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-forest text-primary-foreground">
        <div className="flex items-center justify-between px-8 py-6">
          <Link
            to="/"
            className="font-display text-xl font-extrabold tracking-tight hover:opacity-80 transition-opacity"
          >
            INCORP.
          </Link>
          <Link
            to="/"
            className="text-xs font-semibold tracking-widest-plus uppercase opacity-70 hover:opacity-100 transition-opacity"
          >
            Home
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 md:px-8 py-10 max-w-7xl mx-auto w-full">
        {/* Title + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl md:text-4xl font-extrabold text-forest mb-1"
            >
              Admin Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-muted-foreground text-sm"
            >
              Manage all incorporated companies and their shareholders.
            </motion.p>
          </div>
          <Link
            to="/incorporate"
            className="inline-flex items-center gap-2 bg-forest text-primary-foreground px-5 py-3 text-xs font-bold tracking-widest-plus uppercase hover:bg-forest-light transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            New Company
          </Link>
        </div>

        {/* Stats bar */}
        {companies && companies.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              {
                icon: Building2,
                label: "Total Companies",
                value: companies.length,
              },
              {
                icon: Building2,
                label: "Incorporated",
                value: companies.filter((c) => c.company.status === "complete")
                  .length,
              },
              {
                icon: Users,
                label: "Total Shareholders",
                value: companies.reduce(
                  (sum, c) => sum + c.shareholders.length,
                  0,
                ),
              },
              {
                icon: DollarSign,
                label: "Total Capital",
                value: formatCurrency(
                  companies.reduce((sum, c) => sum + c.company.totalCapital, 0),
                ),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="bg-card shadow-card px-5 py-4 flex items-center gap-3"
              >
                <Icon className="w-4 h-4 text-lime-dark shrink-0" />
                <div>
                  <p className="text-[10px] font-bold tracking-widest-plus uppercase text-muted-foreground">
                    {label}
                  </p>
                  <p className="font-display font-extrabold text-forest text-lg leading-tight">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Company grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">Loading companies...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-24">
            <p className="text-destructive text-sm mb-3">
              Failed to load companies.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-xs font-bold tracking-widest-plus uppercase text-forest hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : !companies || companies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 border border-dashed border-border"
          >
            <Building2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="font-display text-lg font-bold text-muted-foreground mb-2">
              No companies yet
            </p>
            <p className="text-sm text-muted-foreground/70 mb-6">
              Start by incorporating your first company.
            </p>
            <Link
              to="/incorporate"
              className="inline-flex items-center gap-2 bg-forest text-primary-foreground px-6 py-3 text-xs font-bold tracking-widest-plus uppercase hover:bg-forest-light transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Incorporate Now
            </Link>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence>
              {companies.map((c) => (
                <CompanyCard
                  key={c.company.id}
                  data={c}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 px-8 py-5 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}.
        </p>
      </footer>
    </div>
  );
}
