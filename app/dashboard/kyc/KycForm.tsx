"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  FileCheck2,
  IdCard,
  ShieldCheck,
  Upload,
  UserRound,
  X,
} from "lucide-react";

type KycStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

type KycDocumentType =
  | "PASSPORT"
  | "NATIONAL_ID"
  | "DRIVERS_LICENSE";

type KycApplication = {
  id: string;
  status: KycStatus;
  currentStep: number;

  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  postalCode: string | null;
  phone: string | null;

  documentType: KycDocumentType | null;
  documentNumber: string | null;
  documentFrontId: string | null;
  documentBackId: string | null;
  selfieId: string | null;

  rejectionReason: string | null;
};

type KycFormProps = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  kyc: KycApplication | null;
};

const countries = [
  "UK",
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "South Africa",
  "Ghana",
  "Kenya",
  "Other",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function KycForm({
  user,
  kyc,
}: KycFormProps) {
  /*
   * ---------------------------------------------------------
   * STEP
   * ---------------------------------------------------------
   */

  const [step, setStep] = useState(
    kyc?.currentStep || 1,
  );

  /*
   * ---------------------------------------------------------
   * PERSONAL INFORMATION
   * ---------------------------------------------------------
   */

  const [firstName, setFirstName] = useState(
    kyc?.firstName || user.firstName,
  );

  const [lastName, setLastName] = useState(
    kyc?.lastName || user.lastName,
  );

  const [dateOfBirth, setDateOfBirth] = useState(() => {
    if (!kyc?.dateOfBirth) {
      return "";
    }

    return new Date(kyc.dateOfBirth)
      .toISOString()
      .split("T")[0];
  });

  const [country, setCountry] = useState(
    kyc?.country || "",
  );

  const [state, setState] = useState(
    kyc?.state || "",
  );

  const [city, setCity] = useState(
    kyc?.city || "",
  );

  const [address, setAddress] = useState(
    kyc?.address || "",
  );

  const [postalCode, setPostalCode] = useState(
    kyc?.postalCode || "",
  );

  const [phone, setPhone] = useState(
    kyc?.phone || "",
  );

  /*
   * ---------------------------------------------------------
   * COUNTRY DROPDOWN
   * ---------------------------------------------------------
   */

  const [countryOpen, setCountryOpen] = useState(false);

  /*
   * ---------------------------------------------------------
   * DOCUMENT INFORMATION
   * ---------------------------------------------------------
   */

  const [documentType, setDocumentType] =
    useState<KycDocumentType | "">(
      kyc?.documentType || "",
    );

  const [documentNumber, setDocumentNumber] =
    useState(kyc?.documentNumber || "");

  /*
   * ---------------------------------------------------------
   * DOCUMENT FILES
   * ---------------------------------------------------------
   */

  const [documentFront, setDocumentFront] =
    useState<File | null>(null);

  const [documentBack, setDocumentBack] =
    useState<File | null>(null);

  /*
   * ---------------------------------------------------------
   * LOADING STATES
   * ---------------------------------------------------------
   */

  const [frontUploading, setFrontUploading] =
    useState(false);

  const [backUploading, setBackUploading] =
    useState(false);

  const [loading, setLoading] = useState(false);

  /*
   * ---------------------------------------------------------
   * ERROR
   * ---------------------------------------------------------
   */

  const [error, setError] = useState("");

  /*
   * ---------------------------------------------------------
   * STATUS
   * ---------------------------------------------------------
   */

  const [submitted, setSubmitted] = useState(
    kyc?.status === "PENDING" ||
      kyc?.status === "APPROVED",
  );

  const [localStatus, setLocalStatus] =
    useState<KycStatus | null>(
      kyc?.status || null,
    );

  const [localRejectionReason, setLocalRejectionReason] =
    useState(kyc?.rejectionReason || "");

  const currentStatus =
    localStatus || kyc?.status || "NOT_STARTED";

  /*
   * ---------------------------------------------------------
   * FILE VALIDATION
   * ---------------------------------------------------------
   */

  function validateFile(file: File) {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError(
        "Only JPG, PNG, and WebP image files are allowed.",
      );

      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "The document must be smaller than 5 MB.",
      );

      return false;
    }

    return true;
  }

  /*
   * ---------------------------------------------------------
   * UPLOAD DOCUMENT
   * ---------------------------------------------------------
   */

  async function uploadDocument(
    file: File,
    field: "documentFront" | "documentBack",
  ) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("field", field);

    const response = await fetch("/api/kyc/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Unable to upload the document.",
      );
    }

    return data;
  }

  /*
   * ---------------------------------------------------------
   * SAVE STEP ONE
   * ---------------------------------------------------------
   */

  async function saveStepOne() {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/kyc/save-step-one",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            dateOfBirth,
            country,
            state,
            city,
            address,
            postalCode,
            phone,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to save your information.",
        );
      }

      setStep(2);
      setLocalStatus("IN_PROGRESS");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your information.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * SUBMIT STEP TWO
   * ---------------------------------------------------------
   */

  async function saveStepTwo(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!documentType) {
      setError("Please select a document type.");
      return;
    }

    if (!documentNumber.trim()) {
      setError("Please enter your document number.");
      return;
    }

    if (!documentFront) {
      setError(
        "Please upload the front of your identity document.",
      );
      return;
    }

    if (!documentBack) {
      setError(
        "Please upload the back of your identity document.",
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * FRONT DOCUMENT
       */

      setFrontUploading(true);

      await uploadDocument(
        documentFront,
        "documentFront",
      );

      setFrontUploading(false);

      /*
       * BACK DOCUMENT
       */

      setBackUploading(true);

      await uploadDocument(
        documentBack,
        "documentBack",
      );

      setBackUploading(false);

      /*
       * SUBMIT KYC
       */

      const response = await fetch(
        "/api/kyc/save-step-two",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentType,
            documentNumber,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to submit your KYC.",
        );
      }

      setLocalStatus("PENDING");
      setSubmitted(true);
    } catch (err) {
      setFrontUploading(false);
      setBackUploading(false);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your KYC.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * START AGAIN AFTER REJECTION
   * ---------------------------------------------------------
   */

  function startAgain() {
    setError("");
    setSubmitted(false);
    setStep(1);

    setDocumentFront(null);
    setDocumentBack(null);

    setLocalStatus("IN_PROGRESS");
    setLocalRejectionReason("");
  }

  /*
   * ---------------------------------------------------------
   * SUBMITTED / APPROVED SCREEN
   * ---------------------------------------------------------
   */

  if (
    submitted &&
    currentStatus !== "REJECTED"
  ) {
    const approved =
      currentStatus === "APPROVED";

    return (
      <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-[#0c1424] p-6 shadow-2xl shadow-black/20 sm:p-10">
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
              {/* ICON */}

              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full border ${
                  approved
                    ? "border-emerald-400/20 bg-emerald-500/10"
                    : "border-amber-400/20 bg-amber-500/10"
                }`}
              >
                {approved ? (
                  <Check className="h-10 w-10 text-emerald-400" />
                ) : (
                  <ShieldCheck className="h-10 w-10 text-amber-400" />
                )}
              </div>

              {/* TITLE */}

              <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
                {approved
                  ? "KYC Approved"
                  : "KYC Submitted"}
              </h1>

              {/* DESCRIPTION */}

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {approved
                  ? "Your identity verification has been approved."
                  : "Your KYC information has been submitted and is currently waiting for admin review."}
              </p>

              {/* STATUS */}

              <div className="mt-6 w-full rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Verification status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      approved
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {approved
                      ? "APPROVED"
                      : "PENDING"}
                  </span>
                </div>
              </div>

              {/* SECURITY */}

              <div className="mt-5 flex w-full items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                <p className="text-xs leading-5 text-slate-500">
                  Your KYC information is being handled
                  for identity verification and reviewed
                  by authorized personnel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN FORM
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Account Verification
              </p>

              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Identity Verification
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Complete the two steps below to submit
            your identity information for verification.
          </p>
        </div>

        {/* =================================================
            REJECTION NOTICE
        ================================================== */}

        {currentStatus === "REJECTED" && (
          <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
                <X className="h-4 w-4 text-rose-400" />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-rose-300">
                  KYC application rejected
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Your previous verification application
                  was not approved. Please review the
                  reason below and submit your information
                  again.
                </p>

                {localRejectionReason && (
                  <div className="mt-3 rounded-xl border border-white/5 bg-black/10 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Reason
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-300">
                      {localRejectionReason}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={startAgain}
                  className="mt-4 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/15"
                >
                  Start KYC Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            STEP INDICATOR
        ================================================== */}

        <div className="mb-6 rounded-2xl border border-white/10 bg-[#0c1424] p-4 sm:p-5">
          <div className="flex items-center">

            {/* STEP 1 */}

            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                  step >= 1
                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 text-slate-500"
                }`}
              >
                {step > 1 ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-bold">
                    1
                  </span>
                )}
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">
                  Personal Information
                </p>

                <p className="text-xs text-slate-500">
                  Basic details
                </p>
              </div>
            </div>

            {/* LINE */}

            <div className="mx-3 h-px flex-1 bg-white/10 sm:mx-5" />

            {/* STEP 2 */}

            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                  step >= 2
                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 text-slate-500"
                }`}
              >
                <span className="text-sm font-bold">
                  2
                </span>
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">
                  Identity Document
                </p>

                <p className="text-xs text-slate-500">
                  Verify identity
                </p>
              </div>
            </div>
          </div>

          {/* PROGRESS BAR */}

          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full rounded-full bg-emerald-400 transition-all duration-300 ${
                step === 1
                  ? "w-1/2"
                  : "w-full"
              }`}
            />
          </div>

          {/* MOBILE STEP */}

          <div className="mt-3 flex justify-between sm:hidden">
            <span className="text-xs text-slate-500">
              Step {step} of 2
            </span>

            <span className="text-xs font-medium text-emerald-400">
              {step === 1
                ? "Personal Information"
                : "Identity Document"}
            </span>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
            <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />

            <p className="text-sm leading-5 text-rose-300">
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            STEP 1
        ================================================== */}

        {step === 1 && (
          <form
            onSubmit={(event) => {
              event.preventDefault();

              setError("");

              if (!firstName.trim()) {
                setError(
                  "Please enter your first name.",
                );
                return;
              }

              if (!lastName.trim()) {
                setError(
                  "Please enter your last name.",
                );
                return;
              }

              if (!dateOfBirth) {
                setError(
                  "Please enter your date of birth.",
                );
                return;
              }

              if (!country) {
                setError(
                  "Please select your country.",
                );
                return;
              }

              if (!state.trim()) {
                setError(
                  "Please enter your state or province.",
                );
                return;
              }

              if (!city.trim()) {
                setError(
                  "Please enter your city.",
                );
                return;
              }

              if (!address.trim()) {
                setError(
                  "Please enter your residential address.",
                );
                return;
              }

              if (!phone.trim()) {
                setError(
                  "Please enter your phone number.",
                );
                return;
              }

              saveStepOne();
            }}
            className="rounded-3xl border border-white/10 bg-[#0c1424] p-5 shadow-2xl shadow-black/10 sm:p-8"
          >

            {/* TITLE */}

            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <UserRound className="h-5 w-5 text-emerald-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Personal Information
                </h2>

                <p className="text-xs text-slate-500">
                  Enter your information exactly as it
                  appears on your identity document.
                </p>
              </div>
            </div>

            {/* FORM */}

            <div className="grid gap-5 sm:grid-cols-2">

              {/* FIRST NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  First Name
                </label>

                <input
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(event.target.value)
                  }
                  placeholder="Enter your first name"
                  autoComplete="given-name"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/10"
                />
              </div>

              {/* LAST NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Last Name
                </label>

                <input
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(event.target.value)
                  }
                  placeholder="Enter your last name"
                  autoComplete="family-name"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/10"
                />
              </div>

              {/* DATE OF BIRTH */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Date of Birth
                </label>

                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) =>
                    setDateOfBirth(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/10"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+1 800 000 0000"
                  autoComplete="tel"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/10"
                />
              </div>

              {/* =================================================
                  CUSTOM COUNTRY DROPDOWN
              ================================================== */}

              <div className="relative">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Country
                </label>

                {/* BUTTON */}

                <button
                  type="button"
                  onClick={() => {
                    setCountryOpen(
                      (previous) => !previous,
                    );
                    setError("");
                  }}
                  className={`flex h-12 w-full items-center justify-between rounded-xl border px-4 text-left text-sm outline-none transition ${
                    countryOpen
                      ? "border-emerald-400/50 bg-[#111b2d] ring-1 ring-emerald-400/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <span
                    className={
                      country
                        ? "text-white"
                        : "text-slate-500"
                    }
                  >
                    {country || "Select country"}
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      countryOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {/* DROPDOWN */}

                {countryOpen && (
                  <div className="absolute left-0 right-0 z-[100] mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#111b2d] shadow-2xl shadow-black/50">
                    <div className="max-h-64 overflow-y-auto p-1.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

                      {countries.map((item) => {
                        const selected =
                          country === item;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setCountry(item);
                              setCountryOpen(false);
                              setError("");
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm transition ${
                              selected
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span>
                              {item}
                            </span>

                            {selected && (
                              <Check className="h-4 w-4 text-emerald-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* STATE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  State / Province
                </label>

                <input
                  type="text"
                  value={state}
                  onChange={(event) =>
                    setState(event.target.value)
                  }
                  placeholder="Enter your state"
                  autoComplete="address-level1"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/10"
                />
              </div>

              {/* CITY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  City
                </label>

                <input
                  type="text"
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value)
                  }
                  placeholder="Enter your city"
                  autoComplete="address-level2"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/10"
                />
              </div>

              {/* POSTAL CODE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Postal / ZIP Code
                </label>

                <input
                  type="text"
                  value={postalCode}
                  onChange={(event) =>
                    setPostalCode(event.target.value)
                  }
                  placeholder="Postal code"
                  autoComplete="postal-code"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/10"
                />
              </div>

              {/* ADDRESS */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Residential Address
                </label>

                <textarea
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="Enter your full residential address"
                  autoComplete="street-address"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/10"
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs text-slate-500">
                Account email
              </p>

              <p className="mt-1 break-all text-sm text-slate-300">
                {user.email}
              </p>
            </div>

            {/* CONTINUE */}

            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#03100b] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {loading
                  ? "Saving..."
                  : "Continue"}

                {!loading && (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        )}

        {/* =================================================
            STEP 2
        ================================================== */}

        {step === 2 && (
          <form
            onSubmit={saveStepTwo}
            className="rounded-3xl border border-white/10 bg-[#0c1424] p-5 shadow-2xl shadow-black/10 sm:p-8"
          >

            {/* TITLE */}

            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <IdCard className="h-5 w-5 text-emerald-400" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Identity Document
                </h2>

                <p className="text-xs text-slate-500">
                  Provide the details and images of your
                  identity document.
                </p>
              </div>
            </div>

            {/* DOCUMENT TYPE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Document Type
              </label>

              <select
                value={documentType}
                onChange={(event) => {
                  setError("");

                  setDocumentType(
                    event.target.value as
                      | KycDocumentType
                      | "",
                  );
                }}
                className="h-12 w-full rounded-xl border border-white/10 bg-[#111b2d] px-4 text-sm text-white outline-none transition focus:border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/10"
              >
                <option value="">
                  Select document
                </option>

                <option value="PASSPORT">
                  International Passport
                </option>

                <option value="NATIONAL_ID">
                  National ID
                </option>

                <option value="DRIVERS_LICENSE">
                  Driver&apos;s License
                </option>
              </select>
            </div>

            {/* DOCUMENT NUMBER */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Document Number
              </label>

              <input
                type="text"
                value={documentNumber}
                onChange={(event) => {
                  setError("");
                  setDocumentNumber(
                    event.target.value,
                  );
                }}
                placeholder="Enter your document number"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/10"
              />
            </div>

            {/* DOCUMENT UPLOADS */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              {/* FRONT */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Front of document
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Upload a clear image of the front.
                    </p>
                  </div>

                  {documentFront && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>
                  )}
                </div>

                <label
                  className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition ${
                    documentFront
                      ? "border-emerald-400/20 bg-emerald-500/[0.03]"
                      : "border-white/10 bg-[#080d19] hover:border-emerald-400/30 hover:bg-emerald-500/[0.03]"
                  }`}
                >
                  <Upload
                    className={`h-8 w-8 ${
                      documentFront
                        ? "text-emerald-400"
                        : "text-slate-600"
                    }`}
                  />

                  <span className="mt-3 max-w-full truncate text-sm font-medium text-slate-300">
                    {documentFront
                      ? documentFront.name
                      : "Choose front document"}
                  </span>

                  <span className="mt-1 text-xs text-slate-600">
                    JPG, PNG or WebP · Max 5 MB
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={
                      loading ||
                      frontUploading
                    }
                    onChange={(event) => {
                      const file =
                        event.target.files?.[0];

                      if (!file) {
                        return;
                      }

                      setError("");

                      if (!validateFile(file)) {
                        event.target.value = "";
                        return;
                      }

                      setDocumentFront(file);
                    }}
                  />
                </label>

                {documentFront && (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-3 py-2">
                    <FileCheck2 className="h-4 w-4 shrink-0 text-emerald-400" />

                    <span className="min-w-0 flex-1 truncate text-xs text-emerald-300">
                      Document selected
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setDocumentFront(null)
                      }
                      disabled={loading}
                      className="shrink-0 text-xs text-slate-500 transition hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {frontUploading && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />

                    <p className="text-xs text-emerald-400">
                      Uploading front document...
                    </p>
                  </div>
                )}
              </div>

              {/* BACK */}

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Back of document
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Upload a clear image of the back.
                    </p>
                  </div>

                  {documentBack && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="h-4 w-4 text-emerald-400" />
                    </div>
                  )}
                </div>

                <label
                  className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition ${
                    documentBack
                      ? "border-emerald-400/20 bg-emerald-500/[0.03]"
                      : "border-white/10 bg-[#080d19] hover:border-emerald-400/30 hover:bg-emerald-500/[0.03]"
                  }`}
                >
                  <Upload
                    className={`h-8 w-8 ${
                      documentBack
                        ? "text-emerald-400"
                        : "text-slate-600"
                    }`}
                  />

                  <span className="mt-3 max-w-full truncate text-sm font-medium text-slate-300">
                    {documentBack
                      ? documentBack.name
                      : "Choose back document"}
                  </span>

                  <span className="mt-1 text-xs text-slate-600">
                    JPG, PNG or WebP · Max 5 MB
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={
                      loading ||
                      backUploading
                    }
                    onChange={(event) => {
                      const file =
                        event.target.files?.[0];

                      if (!file) {
                        return;
                      }

                      setError("");

                      if (!validateFile(file)) {
                        event.target.value = "";
                        return;
                      }

                      setDocumentBack(file);
                    }}
                  />
                </label>

                {documentBack && (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-3 py-2">
                    <FileCheck2 className="h-4 w-4 shrink-0 text-emerald-400" />

                    <span className="min-w-0 flex-1 truncate text-xs text-emerald-300">
                      Document selected
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setDocumentBack(null)
                      }
                      disabled={loading}
                      className="shrink-0 text-xs text-slate-500 transition hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {backUploading && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />

                    <p className="text-xs text-emerald-400">
                      Uploading back document...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SECURITY */}

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.03] p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

              <div>
                <p className="text-xs font-medium text-emerald-300">
                  Document security
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Make sure your document is clear,
                  readable, and belongs to you. Your
                  submitted documents should only be
                  accessible to authorized personnel
                  reviewing your KYC application.
                </p>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

              {/* BACK */}

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep(1);
                }}
                disabled={
                  loading ||
                  frontUploading ||
                  backUploading
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />

                Back
              </button>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  loading ||
                  frontUploading ||
                  backUploading
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#03100b] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {frontUploading
                  ? "Uploading front..."
                  : backUploading
                    ? "Uploading back..."
                    : loading
                      ? "Submitting..."
                      : "Submit KYC"}

                {!loading &&
                  !frontUploading &&
                  !backUploading && (
                    <ArrowRight className="h-4 w-4" />
                  )}
              </button>
            </div>
          </form>
        )}

        {/* =================================================
            SECURITY FOOTER
        ================================================== */}

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

          <p className="text-xs leading-5 text-slate-500">
            Identity verification helps protect your
            account and supports secure access to platform
            services. Only submit documents that belong to
            you.
          </p>
        </div>
      </div>
    </main>
  );
}