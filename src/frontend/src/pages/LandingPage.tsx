import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border/60">
        <span className="font-display text-xl font-extrabold tracking-tight text-forest">
          INCORP.
        </span>
        <div className="flex items-center gap-6">
          <Link
            to="/admin"
            className="text-xs font-semibold tracking-widest-plus uppercase text-muted-foreground hover:text-forest transition-colors"
          >
            Admin
          </Link>
          <Link
            to="/incorporate"
            className="inline-flex items-center gap-2 bg-forest text-primary-foreground px-5 py-2.5 text-xs font-bold tracking-widest-plus uppercase hover:bg-forest-light transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 grid grid-cols-1 min-h-[calc(100vh-73px)]">
        {/* Content */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-32 py-16 lg:py-24 max-w-4xl mx-auto items-center text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <span className="text-xs font-bold tracking-widest-plus uppercase text-muted-foreground">
              Company Registration
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.92] font-extrabold text-forest mb-8"
          >
            Incorporate
            <br />
            <span className="text-lime italic">Your Business</span>
            <br />
            In Minutes
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg max-w-md leading-relaxed mb-10"
          >
            Digital bureaucracy made beautiful. Register your company with
            precision and speed. Nepali efficiency meets modern technology.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            <Link
              to="/incorporate"
              className="inline-flex items-center gap-3 bg-forest text-primary-foreground px-8 py-4 text-sm font-bold tracking-widest-plus uppercase hover:bg-forest-light transition-all group"
            >
              Start Incorporation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            {[
              { icon: Zap, label: "Fast Registration" },
              { icon: Shield, label: "Legally Compliant" },
              { icon: Building2, label: "Full Ownership" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground border border-border px-3 py-2"
              >
                <Icon className="w-3.5 h-3.5 text-lime-dark" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column removed */}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 px-8 py-5 flex items-center justify-between">
        <span className="font-display text-sm font-bold text-forest">
          INCORP.
        </span>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}.
        </p>
      </footer>
    </div>
  );
}
