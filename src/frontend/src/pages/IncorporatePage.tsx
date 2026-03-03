import {
  useCreateCompany,
  useGetCompany,
  useUpdateShareholders,
} from "@/hooks/useQueries";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DRAFT_KEY = "incorporationDraftId";

interface CompanyFormData {
  name: string;
  numShareholders: string;
  totalCapital: string;
}

interface ShareholderFormData {
  firstName: string;
  lastName: string;
  nationality: string;
}

interface CompanyFormErrors {
  name?: string;
  numShareholders?: string;
  totalCapital?: string;
}

interface ShareholderFormErrors {
  firstName?: string;
  lastName?: string;
  nationality?: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="text-destructive text-xs mt-1.5 font-medium"
    >
      {message}
    </motion.p>
  );
}

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div
          className={`w-7 h-7 flex items-center justify-center text-xs font-bold border-2 ${step >= 1
            ? "bg-forest border-forest text-primary-foreground"
            : "border-border text-muted-foreground"
            }`}
        >
          1
        </div>
        <span
          className={`text-xs font-bold tracking-widest-plus uppercase ${step === 1 ? "text-forest" : "text-muted-foreground"
            }`}
        >
          Company Info
        </span>
      </div>

      <div className="flex-1 h-px bg-border" />

      <div className="flex items-center gap-3">
        <div
          className={`w-7 h-7 flex items-center justify-center text-xs font-bold border-2 ${step >= 2
            ? "bg-forest border-forest text-primary-foreground"
            : "border-border text-muted-foreground"
            }`}
        >
          2
        </div>
        <span
          className={`text-xs font-bold tracking-widest-plus uppercase ${step === 2 ? "text-forest" : "text-muted-foreground"
            }`}
        >
          Shareholders
        </span>
      </div>

      <div className="ml-6 text-xs font-semibold text-muted-foreground tracking-wide">
        Step {step} of 2
      </div>
    </div>
  );
}

function Step1Form() {
  const navigate = useNavigate();
  const createCompany = useCreateCompany();

  const [form, setForm] = useState<CompanyFormData>({
    name: "",
    numShareholders: "",
    totalCapital: "",
  });
  const [errors, setErrors] = useState<CompanyFormErrors>({});
  const [restoringDraft, setRestoringDraft] = useState(false);

  // Check for draft on mount and redirect to shareholders if exists
  const savedId = localStorage.getItem(DRAFT_KEY);
  const draftId = savedId ? savedId : null;
  const { data: draftCompany } = useGetCompany(draftId);

  useEffect(() => {
    if (draftCompany?.company) {
      const c = draftCompany.company;
      setForm({
        name: c.name,
        numShareholders: c.numShareholders.toString(),
        totalCapital: c.totalCapital.toString(),
      });
      setRestoringDraft(true);
    }
  }, [draftCompany]);

  function validate(): boolean {
    const newErrors: CompanyFormErrors = {};
    if (!form.name.trim()) newErrors.name = "Company name is required.";
    const ns = Number(form.numShareholders);
    if (
      !form.numShareholders ||
      Number.isNaN(ns) ||
      ns < 1 ||
      ns > 100 ||
      !Number.isInteger(ns)
    ) {
      newErrors.numShareholders = "Enter a whole number between 1 and 100.";
    }
    const tc = Number(form.totalCapital);
    if (!form.totalCapital || Number.isNaN(tc) || tc <= 0) {
      newErrors.totalCapital = "Total capital must be greater than 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before proceeding.");
      return;
    }

    try {
      const id = await createCompany.mutateAsync({
        name: form.name.trim(),
        numShareholders: form.numShareholders,
        totalCapital: Number(form.totalCapital),
      });
      localStorage.setItem(DRAFT_KEY, id);
      navigate({ to: "/incorporate/shareholders" });
    } catch {
      toast.error("Failed to save company. Please try again.");
    }
  }

  function continueExisting() {
    navigate({ to: "/incorporate/shareholders" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
    >
      {restoringDraft && (
        <div className="mb-6 flex items-center justify-between bg-lime/10 border border-lime-dark/30 px-5 py-3.5">
          <p className="text-sm font-medium text-forest">
            Draft restored from a previous session.
          </p>
          <button
            type="button"
            onClick={continueExisting}
            className="text-xs font-bold tracking-widest-plus uppercase text-forest hover:underline ml-4 whitespace-nowrap"
          >
            Continue →
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Company Name */}
        <div>
          <label htmlFor="company-name" className="label-field block mb-2">
            Company Name
          </label>
          <input
            id="company-name"
            type="text"
            value={form.name}
            onChange={(e) => {
              setForm((p) => ({ ...p, name: e.target.value }));
              if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
            }}
            placeholder="Acme Corporation Ltd."
            className="w-full border border-input bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
          />
          <AnimatePresence>
            <FieldError message={errors.name} />
          </AnimatePresence>
        </div>

        {/* Number of Shareholders */}
        <div>
          <label htmlFor="num-shareholders" className="label-field block mb-2">
            Number of Shareholders
          </label>
          <input
            id="num-shareholders"
            type="number"
            min={1}
            max={100}
            value={form.numShareholders}
            onChange={(e) => {
              setForm((p) => ({ ...p, numShareholders: e.target.value }));
              if (errors.numShareholders)
                setErrors((p) => ({ ...p, numShareholders: undefined }));
            }}
            placeholder="e.g. 3"
            className="w-full border border-input bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
          />
          <AnimatePresence>
            <FieldError message={errors.numShareholders} />
          </AnimatePresence>
        </div>

        {/* Total Capital */}
        <div>
          <label htmlFor="total-capital" className="label-field block mb-2">
            Total Capital Invested (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
              $
            </span>
            <input
              id="total-capital"
              type="number"
              min={0.01}
              step="0.01"
              value={form.totalCapital}
              onChange={(e) => {
                setForm((p) => ({ ...p, totalCapital: e.target.value }));
                if (errors.totalCapital)
                  setErrors((p) => ({ ...p, totalCapital: undefined }));
              }}
              placeholder="100,000.00"
              className="w-full border border-input bg-white pl-8 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
            />
          </div>
          <AnimatePresence>
            <FieldError message={errors.totalCapital} />
          </AnimatePresence>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={createCompany.isPending}
            className="inline-flex items-center gap-3 bg-forest text-primary-foreground px-8 py-4 text-xs font-bold tracking-widest-plus uppercase hover:bg-forest-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {createCompany.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            {createCompany.isPending ? "Saving..." : "Next Step"}
            {!createCompany.isPending && (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function Step2Form() {
  const navigate = useNavigate();
  const updateShareholders = useUpdateShareholders();

  const savedId = localStorage.getItem(DRAFT_KEY);
  const companyId = savedId ? savedId : null;

  // If no draft, redirect to step 1
  useEffect(() => {
    if (!savedId) {
      navigate({ to: "/incorporate" });
    }
  }, [savedId, navigate]);

  const { data: draftCompany } = useGetCompany(companyId);
  const numShareholders = draftCompany?.company
    ? Number(draftCompany.company.numShareholders)
    : 0;

  const [shareholders, setShareholders] = useState<ShareholderFormData[]>([]);
  const [errors, setErrors] = useState<ShareholderFormErrors[]>([]);

  // Initialize shareholder forms when draft loaded
  useEffect(() => {
    if (numShareholders > 0) {
      // Pre-fill from existing if any
      const existing = draftCompany?.shareholders ?? [];
      const initial: ShareholderFormData[] = Array.from(
        { length: numShareholders },
        (_, i) => ({
          firstName: existing[i]?.firstName ?? "",
          lastName: existing[i]?.lastName ?? "",
          nationality: existing[i]?.nationality ?? "",
        }),
      );
      setShareholders(initial);
      setErrors(Array.from({ length: numShareholders }, () => ({})));
    }
  }, [numShareholders, draftCompany]);

  function updateShareholder(
    index: number,
    field: keyof ShareholderFormData,
    value: string,
  ) {
    setShareholders((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setErrors((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: undefined };
      return updated;
    });
  }

  function validate(): boolean {
    const newErrors: ShareholderFormErrors[] = shareholders.map((sh) => {
      const e: ShareholderFormErrors = {};
      if (!sh.firstName.trim()) e.firstName = "First name is required.";
      if (!sh.lastName.trim()) e.lastName = "Last name is required.";
      if (!sh.nationality.trim()) e.nationality = "Nationality is required.";
      return e;
    });
    setErrors(newErrors);
    return newErrors.every((e) => Object.keys(e).length === 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before proceeding.");
      return;
    }
    if (!companyId) return;

    try {
      await updateShareholders.mutateAsync({
        companyId,
        shareholders: shareholders.map((sh) => ({
          firstName: sh.firstName.trim(),
          lastName: sh.lastName.trim(),
          nationality: sh.nationality.trim(),
        })),
      });
      localStorage.removeItem(DRAFT_KEY);
      navigate({ to: "/admin" });
      toast.success("Company incorporated successfully!");
    } catch {
      toast.error("Failed to save shareholders. Please try again.");
    }
  }

  if (!companyId || shareholders.length === 0) {
    return (
      <div className="flex items-center gap-3 py-8 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading draft...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
    >
      {draftCompany?.company && (
        <div className="mb-6 px-5 py-3.5 bg-muted/50 border border-border text-sm text-muted-foreground">
          Filing for{" "}
          <span className="font-semibold text-foreground">
            {draftCompany.company.name}
          </span>
          {" · "}
          {Number(draftCompany.company.numShareholders)} shareholder
          {Number(draftCompany.company.numShareholders) !== 1 ? "s" : ""} ·{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(draftCompany.company.totalCapital)}{" "}
          capital
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {shareholders.map((sh, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: shareholder order is stable and index-bound
          <div key={i} className="border border-border p-6 bg-white relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-forest text-primary-foreground flex items-center justify-center text-xs font-bold">
                {i + 1}
              </div>
              <h3 className="font-display text-sm font-bold tracking-widest-plus uppercase text-forest">
                Shareholder #{i + 1}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* First Name */}
              <div>
                <label
                  htmlFor={`sh-${i}-first`}
                  className="label-field block mb-2"
                >
                  First Name
                </label>
                <input
                  id={`sh-${i}-first`}
                  type="text"
                  value={sh.firstName}
                  onChange={(e) =>
                    updateShareholder(i, "firstName", e.target.value)
                  }
                  placeholder="Jane"
                  className="w-full border border-input bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
                <AnimatePresence>
                  <FieldError message={errors[i]?.firstName} />
                </AnimatePresence>
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor={`sh-${i}-last`}
                  className="label-field block mb-2"
                >
                  Last Name
                </label>
                <input
                  id={`sh-${i}-last`}
                  type="text"
                  value={sh.lastName}
                  onChange={(e) =>
                    updateShareholder(i, "lastName", e.target.value)
                  }
                  placeholder="Smith"
                  className="w-full border border-input bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
                <AnimatePresence>
                  <FieldError message={errors[i]?.lastName} />
                </AnimatePresence>
              </div>

              {/* Nationality */}
              <div>
                <label
                  htmlFor={`sh-${i}-nationality`}
                  className="label-field block mb-2"
                >
                  Nationality
                </label>
                <input
                  id={`sh-${i}-nationality`}
                  type="text"
                  value={sh.nationality}
                  onChange={(e) =>
                    updateShareholder(i, "nationality", e.target.value)
                  }
                  placeholder="Nepali"
                  className="w-full border border-input bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
                <AnimatePresence>
                  <FieldError message={errors[i]?.nationality} />
                </AnimatePresence>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/incorporate" })}
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest-plus uppercase text-muted-foreground hover:text-forest transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <button
            type="submit"
            disabled={updateShareholders.isPending}
            className="inline-flex items-center gap-3 bg-forest text-primary-foreground px-8 py-4 text-xs font-bold tracking-widest-plus uppercase hover:bg-forest-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {updateShareholders.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            {updateShareholders.isPending ? "Submitting..." : "Submit"}
            {!updateShareholders.isPending && (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

interface IncorporatePageProps {
  step?: 1 | 2;
}

export default function IncorporatePage({ step = 1 }: IncorporatePageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border/60">
        <Link
          to="/"
          className="font-display text-xl font-extrabold tracking-tight text-forest hover:opacity-80 transition-opacity"
        >
          INCORP.
        </Link>
        <Link
          to="/admin"
          className="text-xs font-semibold tracking-widest-plus uppercase text-muted-foreground hover:text-forest transition-colors"
        >
          Admin
        </Link>
      </nav>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <StepIndicator step={step} />

          {/* Card */}
          <div className="bg-card shadow-card p-8 md:p-10">
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-forest mb-2">
                {step === 1 ? "Company Information" : "Shareholder Details"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {step === 1
                  ? "Enter the basic details of your company to begin incorporation."
                  : "Provide information for each shareholder of the company."}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <Step1Form key="step1" />
              ) : (
                <Step2Form key="step2" />
              )}
            </AnimatePresence>
          </div>
        </div>
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
