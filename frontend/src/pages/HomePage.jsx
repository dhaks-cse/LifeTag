import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  QrCode,
  ShieldCheck,
  HeartPulse,
  Users,
  Wifi,
  UserPlus,
  Tag,
  Smartphone,
  Cpu,
  Radio,
  Lightbulb,
  Volume2,
  CircleDot,
  ArrowRight,
  Menu,
  X,
  Mail,
  CheckCircle2,
} from "lucide-react";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Hardware", href: "#hardware" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Privacy-first by design" },
  { icon: Wifi, label: "Works without signal" },
  { icon: Smartphone, label: "No app required" },
];

const featureItems = [
  {
    icon: Zap,
    title: "Instant Tap Access",
    description:
      "A single tap of an NFC-enabled phone against your LifeTag opens your emergency profile in under a second, with no app installation required.",
  },
  {
    icon: QrCode,
    title: "QR Code Backup",
    description:
      "Every LifeTag includes a printed QR code, so your information stays reachable even on phones without NFC support.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-First Design",
    description:
      "You choose exactly what responders can see. Sensitive details stay private while critical medical facts remain visible.",
  },
  {
    icon: HeartPulse,
    title: "Critical Medical Data",
    description:
      "Blood type, allergies, medications, and conditions are displayed clearly, formatted for fast decisions under pressure.",
  },
  {
    icon: Users,
    title: "Emergency Contacts",
    description:
      "Responders can reach your listed emergency contacts immediately, without searching through a locked phone.",
  },
  {
    icon: Wifi,
    title: "Works Without Signal",
    description:
      "Your profile loads from a lightweight cached page, keeping critical information available even in low-connectivity areas.",
  },
];

const stepItems = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Enter your medical details, allergies, medications, and emergency contacts through our secure dashboard.",
  },
  {
    icon: Tag,
    title: "Receive Your LifeTag",
    description:
      "We program your NTAG216 NFC tag and generate a matching QR code linked directly to your profile.",
  },
  {
    icon: HeartPulse,
    title: "Wear or Carry It",
    description:
      "Attach your LifeTag to a wristband, keychain, or card so it stays within reach in an emergency.",
  },
  {
    icon: Smartphone,
    title: "Responders Scan Instantly",
    description:
      "Any NFC-enabled phone or QR scanner pulls up your emergency profile immediately, with no app required.",
  },
];

const hardwareItems = [
  {
    icon: Cpu,
    title: "ESP32 DevKit",
    description:
      "Powers the demo reader station, coordinating tag reads and triggering feedback signals in real time.",
  },
  {
    icon: Radio,
    title: "NTAG216 NFC Tags",
    description:
      "High-capacity, passive NFC tags store the encoded link to each patient's emergency profile.",
  },
  {
    icon: Lightbulb,
    title: "Status LEDs",
    description:
      "Green and red indicators confirm a successful or failed tag read at a glance.",
  },
  {
    icon: Volume2,
    title: "Buzzer",
    description:
      "An audible tone confirms the moment a profile has been retrieved, even without looking at a screen.",
  },
  {
    icon: CircleDot,
    title: "Push Button",
    description:
      "Lets our team reset the demo station between simulated emergency scans during live demonstrations.",
  },
];

function NavAnchor({ href, label, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
    >
      {label}
    </a>
  );
}

function TrustBadge({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
      <Icon className="h-4 w-4 text-blue-600" />
      <span>{label}</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      variants={fadeUpVariant}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </motion.div>
  );
}

function StepCard({ icon: Icon, title, description, stepNumber }) {
  return (
    <motion.div variants={fadeUpVariant} className="relative rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-sm font-semibold text-blue-600">Step {stepNumber}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </motion.div>
  );
}

function HardwareCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      variants={fadeUpVariant}
      className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>
    </motion.div>
  );
}

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <HeartPulse className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">LifeTag</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavAnchor key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              to="/create"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Create Your LifeTag
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavAnchor key={link.href} href={link.href} label={link.label} onClick={closeMenu} />
              ))}
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="text-sm font-medium text-slate-600 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link
                to="/create"
                onClick={closeMenu}
                className="rounded-full bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Create Your LifeTag
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>
        <section id="hero" className="overflow-hidden px-6 pb-20 pt-16 lg:px-8 lg:pt-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <motion.div initial="hidden" animate="visible" variants={staggerContainerVariant}>
              <motion.span
                variants={fadeUpVariant}
                className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
              >
                Emergency Medical Identity Platform
              </motion.span>

              <motion.h1
                variants={fadeUpVariant}
                className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
              >
                When Every Second Counts, LifeTag Speaks For You
              </motion.h1>

              <motion.p variants={fadeUpVariant} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                LifeTag gives first responders instant access to your critical medical
                information with a single tap of an NFC tag or scan of a QR code. No app,
                no login, no delay.
              </motion.p>

              <motion.div variants={fadeUpVariant} className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/create"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  Create Your LifeTag
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-600"
                >
                  See How It Works
                </a>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                {trustBadges.map((badge) => (
                  <TrustBadge key={badge.label} icon={badge.icon} label={badge.label} />
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute h-72 w-72 rounded-full bg-blue-50 sm:h-96 sm:w-96" />
              <motion.div
                animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-56 w-56 rounded-full border-2 border-blue-300 sm:h-72 sm:w-72"
              />

              <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Emergency Profile
                  </span>
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
                    <HeartPulse className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-900">Blood Type: O Negative</p>
                    <p className="text-sm text-slate-500">Allergies: Penicillin, Peanuts</p>
                  </div>
                </div>
                <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    Emergency contact reachable in one tap
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    Current medications listed
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="bg-slate-50 px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainerVariant}
              className="mx-auto max-w-2xl text-center"
            >
              <motion.h2 variants={fadeUpVariant} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Built for the Moments That Matter Most
              </motion.h2>
              <motion.p variants={fadeUpVariant} className="mt-4 text-lg text-slate-600">
                Every feature is designed around a single goal: getting accurate medical
                information to responders faster.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainerVariant}
              className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {featureItems.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainerVariant}
              className="mx-auto max-w-2xl text-center"
            >
              <motion.h2 variants={fadeUpVariant} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                From Sign-Up to Scan in Minutes
              </motion.h2>
              <motion.p variants={fadeUpVariant} className="mt-4 text-lg text-slate-600">
                Setting up a LifeTag takes less time than filling out a hospital intake form.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainerVariant}
              className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {stepItems.map((step, index) => (
                <StepCard
                  key={step.title}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  stepNumber={index + 1}
                />
              ))}
            </motion.div>
          </div>
        </section>

        <section id="hardware" className="bg-slate-50 px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainerVariant}
              >
                <motion.h2 variants={fadeUpVariant} className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  The Hardware Behind LifeTag
                </motion.h2>
                <motion.p variants={fadeUpVariant} className="mt-4 text-lg text-slate-600">
                  Our working prototype demonstrates how LifeTag performs under real
                  emergency conditions, from tag to notification.
                </motion.p>
                <motion.p variants={fadeUpVariant} className="mt-4 text-base leading-relaxed text-slate-600">
                  The demo station pairs an ESP32 microcontroller with an NFC reader to
                  detect when a LifeTag is presented. A successful read triggers a green
                  LED and a short buzzer tone, confirming that the patient's emergency
                  profile has been retrieved. A push button lets our team reset the
                  station between demonstrations.
                </motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainerVariant}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {hardwareItems.map((item) => (
                  <HardwareCard
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section id="cta" className="px-6 py-20 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={staggerContainerVariant}
            className="mx-auto max-w-5xl rounded-3xl bg-blue-600 px-8 py-14 text-center sm:px-16"
          >
            <motion.h2 variants={fadeUpVariant} className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your Medical Story, Ready in an Emergency
            </motion.h2>
            <motion.p variants={fadeUpVariant} className="mx-auto mt-4 max-w-2xl text-lg text-blue-50">
              Set up your LifeTag in under five minutes. Because when paramedics arrive,
              there is no time to explain.
            </motion.p>
            <motion.div variants={fadeUpVariant} className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/create"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
              >
                Create Your LifeTag Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/profile/demo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-300 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-500"
              >
                View Live Demo
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <HeartPulse className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">LifeTag</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Emergency medical identity for the moments when seconds decide outcomes.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Product</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href="#features" className="text-sm text-slate-500 hover:text-blue-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-sm text-slate-500 hover:text-blue-600">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#hardware" className="text-sm text-slate-500 hover:text-blue-600">
                    Hardware
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Get Started</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link to="/create" className="text-sm text-slate-500 hover:text-blue-600">
                    Create a Profile
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-sm text-slate-500 hover:text-blue-600">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/profile/demo" className="text-sm text-slate-500 hover:text-blue-600">
                    Live Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Contact</h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:support@lifetag.app" className="hover:text-blue-600">
                    support@lifetag.app
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">© 2026 LifeTag. Built for a healthcare innovation hackathon.</p>
            <p className="text-sm text-slate-400">
              LifeTag is a prototype and does not replace professional medical judgment or emergency services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
