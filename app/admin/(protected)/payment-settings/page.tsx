"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  Building2,
  CheckCircle2,
  Edit3,
  Loader2,
  Plus,
  QrCode,
  Save,
  Trash2,
  X,
} from "lucide-react";

type CryptoAddress = {
  id: string;
  name: string | null;
  network: string;
  address: string;
  qrCodeUrl: string | null;
  instructions: string | null;
  enabled: boolean;
  createdAt: string;
};

type BankSettings = {
  id: string;
  enabled: boolean;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankRoutingNumber: string | null;
  bankSwiftCode: string | null;
  bankIban: string | null;
  depositInstructions: string | null;
};

const emptyCrypto = {
  name: "",
  network: "",
  address: "",
  qrCodeUrl: "",
  instructions: "",
  enabled: true,
};

const emptyBank = {
  enabled: true,
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankRoutingNumber: "",
  bankSwiftCode: "",
  bankIban: "",
  depositInstructions: "",
};

export default function PaymentSettingsPage() {
  const [cryptoAddresses, setCryptoAddresses] =
    useState<CryptoAddress[]>([]);

  const [bank, setBank] =
    useState<BankSettings | null>(null);

  const [cryptoForm, setCryptoForm] =
    useState(emptyCrypto);

  const [bankForm, setBankForm] =
    useState(emptyBank);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [cryptoLoading, setCryptoLoading] =
    useState(true);

  const [bankLoading, setBankLoading] =
    useState(true);

  const [cryptoSaving, setCryptoSaving] =
    useState(false);

  const [bankSaving, setBankSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // QR CODE UPLOAD STATES
  const [qrFile, setQrFile] =
    useState<File | null>(null);

  const [qrPreview, setQrPreview] =
    useState<string | null>(null);

  const [qrUploading, setQrUploading] =
    useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setCryptoLoading(true);
      setBankLoading(true);
      setError("");

      const [
        cryptoResponse,
        bankResponse,
      ] = await Promise.all([
        fetch(
          "/api/admin/payment-settings/crypto",
          {
            cache: "no-store",
          }
        ),

        fetch(
          "/api/admin/payment-settings/bank",
          {
            cache: "no-store",
          }
        ),
      ]);

      const cryptoData =
        await cryptoResponse.json();

      const bankData =
        await bankResponse.json();

      if (!cryptoResponse.ok) {
        throw new Error(
          cryptoData?.error ||
            "Unable to load crypto settings."
        );
      }

      if (!bankResponse.ok) {
        throw new Error(
          bankData?.error ||
            "Unable to load bank settings."
        );
      }

      setCryptoAddresses(
        Array.isArray(cryptoData)
          ? cryptoData
          : []
      );

      setBank(
        bankData || null
      );

      if (bankData) {
        setBankForm({
          enabled: bankData.enabled,
          bankName:
            bankData.bankName || "",
          bankAccountName:
            bankData.bankAccountName || "",
          bankAccountNumber:
            bankData.bankAccountNumber || "",
          bankRoutingNumber:
            bankData.bankRoutingNumber || "",
          bankSwiftCode:
            bankData.bankSwiftCode || "",
          bankIban:
            bankData.bankIban || "",
          depositInstructions:
            bankData.depositInstructions ||
            "",
        });
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load payment settings."
      );
    } finally {
      setCryptoLoading(false);
      setBankLoading(false);
    }
  }

  // --------------------------------------------------
  // UPLOAD QR CODE
  // --------------------------------------------------

  async function uploadQrCode(
    file: File
  ): Promise<string> {
    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    const response = await fetch(
      "/api/admin/payment-settings/crypto/upload-qr",
      {
        method: "POST",
        body: formData,
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Unable to upload QR code."
      );
    }

    if (!data?.url) {
      throw new Error(
        "QR code upload did not return an image URL."
      );
    }

    return data.url;
  }

  // --------------------------------------------------
  // SELECT QR IMAGE
  // --------------------------------------------------

  function handleQrFileChange(
    file: File | undefined
  ) {
    if (!file) {
      return;
    }

    setError("");

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only PNG, JPG, JPEG, and WEBP images are allowed."
      );

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "QR code image must be smaller than 5MB."
      );

      return;
    }

    // Revoke previous preview URL
    if (qrPreview) {
      URL.revokeObjectURL(qrPreview);
    }

    const preview =
      URL.createObjectURL(file);

    setQrFile(file);
    setQrPreview(preview);
  }

  // --------------------------------------------------
  // CRYPTO SUBMIT
  // --------------------------------------------------

  async function handleCryptoSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setCryptoSaving(true);
    setError("");
    setMessage("");

    try {
      let qrCodeUrl =
        cryptoForm.qrCodeUrl.trim() ||
        null;

      // Upload a new QR image if selected
      if (qrFile) {
        setQrUploading(true);

        qrCodeUrl =
          await uploadQrCode(
            qrFile
          );
      }

      const payload = {
        ...(editingId
          ? { id: editingId }
          : {}),

        name:
          cryptoForm.name.trim(),

        network:
          cryptoForm.network.trim(),

        address:
          cryptoForm.address.trim(),

        qrCodeUrl,

        instructions:
          cryptoForm.instructions.trim() ||
          null,

        enabled:
          cryptoForm.enabled,
      };

      const response =
        await fetch(
          "/api/admin/payment-settings/crypto",
          {
            method:
              editingId
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to save crypto address."
        );
      }

      setMessage(
        editingId
          ? "Crypto address updated successfully."
          : "Crypto address added successfully."
      );

      setCryptoForm(
        emptyCrypto
      );

      setEditingId(null);

      setQrFile(null);

      if (qrPreview) {
        URL.revokeObjectURL(
          qrPreview
        );
      }

      setQrPreview(null);

      await loadSettings();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save crypto address."
      );
    } finally {
      setQrUploading(false);
      setCryptoSaving(false);
    }
  }

  // --------------------------------------------------
  // BANK SUBMIT
  // --------------------------------------------------

  async function handleBankSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setBankSaving(true);
    setError("");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/payment-settings/bank",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              bankForm
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to save bank settings."
        );
      }

      setMessage(
        "Bank payment settings saved successfully."
      );

      setBank(
        data.bank
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save bank settings."
      );
    } finally {
      setBankSaving(false);
    }
  }

  // --------------------------------------------------
  // EDIT CRYPTO
  // --------------------------------------------------

  function editCrypto(
    address: CryptoAddress
  ) {
    setEditingId(
      address.id
    );

    setCryptoForm({
      name:
        address.name || "",

      network:
        address.network,

      address:
        address.address,

      qrCodeUrl:
        address.qrCodeUrl || "",

      instructions:
        address.instructions || "",

      enabled:
        address.enabled,
    });

    setQrFile(null);

    if (qrPreview) {
      URL.revokeObjectURL(
        qrPreview
      );
    }

    setQrPreview(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // --------------------------------------------------
  // CANCEL EDIT
  // --------------------------------------------------

  function cancelCryptoEdit() {
    setEditingId(null);

    setCryptoForm(
      emptyCrypto
    );

    setQrFile(null);

    if (qrPreview) {
      URL.revokeObjectURL(
        qrPreview
      );
    }

    setQrPreview(null);

    setError("");
  }

  // --------------------------------------------------
  // DELETE CRYPTO
  // --------------------------------------------------

  async function deleteCrypto(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this crypto address?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response =
        await fetch(
          "/api/admin/payment-settings/crypto",
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to delete crypto address."
        );
      }

      setMessage(
        "Crypto address deleted successfully."
      );

      if (
        editingId === id
      ) {
        cancelCryptoEdit();
      }

      await loadSettings();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete crypto address."
      );
    }
  }

  // --------------------------------------------------
  // TOGGLE CRYPTO
  // --------------------------------------------------

  async function toggleCrypto(
    address: CryptoAddress
  ) {
    try {
      setError("");
      setMessage("");

      const response =
        await fetch(
          "/api/admin/payment-settings/crypto",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: address.id,
              enabled:
                !address.enabled,
            }),
          }
        );

      if (!response.ok) {
        const data =
          await response.json();

        throw new Error(
          data?.error ||
            "Unable to update status."
        );
      }

      setMessage(
        address.enabled
          ? "Crypto address disabled."
          : "Crypto address enabled."
      );

      await loadSettings();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update crypto status."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm text-cyan-400">
            Admin Settings
          </p>

          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Payment Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Manage cryptocurrency deposit
            addresses and the single bank
            account displayed to customers.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-2">

          {/* ==================================================
              CRYPTO FORM
          ================================================== */}

          <section className="rounded-2xl border border-white/10 bg-[#101621] p-5 sm:p-6">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                  <QrCode className="h-5 w-5 text-violet-400" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    {editingId
                      ? "Edit Crypto Address"
                      : "Add Crypto Address"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Add multiple networks and
                    wallet addresses.
                  </p>
                </div>

              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={
                    cancelCryptoEdit
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                  aria-label="Cancel edit"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

            </div>

            {cryptoLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
              </div>
            ) : (
              <form
                onSubmit={
                  handleCryptoSubmit
                }
                className="mt-6 space-y-4"
              >

                {/* NAME */}
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Name
                  </label>

                  <input
                    value={
                      cryptoForm.name
                    }
                    onChange={(e) =>
                      setCryptoForm({
                        ...cryptoForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="USDT TRC20"
                    className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                {/* NETWORK */}
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Network
                  </label>

                  <input
                    value={
                      cryptoForm.network
                    }
                    onChange={(e) =>
                      setCryptoForm({
                        ...cryptoForm,
                        network:
                          e.target.value,
                      })
                    }
                    placeholder="TRC20"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                {/* WALLET ADDRESS */}
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Wallet Address
                  </label>

                  <textarea
                    value={
                      cryptoForm.address
                    }
                    onChange={(e) =>
                      setCryptoForm({
                        ...cryptoForm,
                        address:
                          e.target.value,
                      })
                    }
                    rows={3}
                    required
                    placeholder="Enter wallet address"
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                {/* ==================================================
                    QR CODE IMAGE UPLOAD
                ================================================== */}

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    QR Code Image
                  </label>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      handleQrFileChange(
                        e.target.files?.[0]
                      );

                      // Allow selecting the same file again
                      e.target.value = "";
                    }}
                    className="block w-full cursor-pointer rounded-xl border border-white/10 bg-[#080d19] p-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-violet-400"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    PNG, JPG, JPEG or WEBP.
                    Maximum file size: 5MB.
                  </p>

                  {/* QR PREVIEW */}
                  {(qrPreview ||
                    cryptoForm.qrCodeUrl) && (
                    <div className="mt-4">

                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                          {qrPreview
                            ? "New QR code preview"
                            : "Current QR code"}
                        </p>

                        {qrFile && (
                          <button
                            type="button"
                            onClick={() => {
                              setQrFile(
                                null
                              );

                              if (
                                qrPreview
                              ) {
                                URL.revokeObjectURL(
                                  qrPreview
                                );
                              }

                              setQrPreview(
                                null
                              );
                            }}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="flex h-52 w-52 items-center justify-center rounded-xl border border-white/10 bg-white p-3">

                        <img
                          src={
                            qrPreview ||
                            cryptoForm.qrCodeUrl
                          }
                          alt="Crypto QR code preview"
                          className="h-full w-full object-contain"
                        />

                      </div>

                      {qrFile && (
                        <p className="mt-2 break-all text-xs text-slate-500">
                          Selected:{" "}
                          {qrFile.name}
                        </p>
                      )}

                    </div>
                  )}
                </div>

                {/* INSTRUCTIONS */}
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Instructions
                  </label>

                  <textarea
                    value={
                      cryptoForm.instructions
                    }
                    onChange={(e) =>
                      setCryptoForm({
                        ...cryptoForm,
                        instructions:
                          e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Optional instructions for customers"
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm outline-none focus:border-violet-400"
                  />
                </div>

                {/* ENABLED */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#080d19] p-4">
                  <input
                    type="checkbox"
                    checked={
                      cryptoForm.enabled
                    }
                    onChange={(e) =>
                      setCryptoForm({
                        ...cryptoForm,
                        enabled:
                          e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm text-slate-300">
                    Show this address to
                    customers
                  </span>
                </label>

                {/* SAVE */}
                <button
                  type="submit"
                  disabled={
                    cryptoSaving ||
                    qrUploading
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cryptoSaving ||
                  qrUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingId ? (
                    <Save className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}

                  {qrUploading
                    ? "Uploading QR Code..."
                    : editingId
                      ? "Update Crypto Address"
                      : "Add Crypto Address"}
                </button>

              </form>
            )}

          </section>

          {/* ==================================================
              BANK FORM
          ================================================== */}

          <section className="rounded-2xl border border-white/10 bg-[#101621] p-5 sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                <Building2 className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Bank Account
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Only one bank account is
                  displayed to customers.
                </p>
              </div>

            </div>

            {bankLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
              </div>
            ) : (
              <form
                onSubmit={
                  handleBankSubmit
                }
                className="mt-6 space-y-4"
              >

                {/* ENABLED */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#080d19] p-4">
                  <input
                    type="checkbox"
                    checked={
                      bankForm.enabled
                    }
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        enabled:
                          e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm text-slate-300">
                    Show bank details to
                    customers
                  </span>
                </label>

                <Input
                  label="Bank Name"
                  value={
                    bankForm.bankName
                  }
                  onChange={(value) =>
                    setBankForm({
                      ...bankForm,
                      bankName: value,
                    })
                  }
                  required
                />

                <Input
                  label="Account Name"
                  value={
                    bankForm.bankAccountName
                  }
                  onChange={(value) =>
                    setBankForm({
                      ...bankForm,
                      bankAccountName:
                        value,
                    })
                  }
                  required
                />

                <Input
                  label="Account Number"
                  value={
                    bankForm.bankAccountNumber
                  }
                  onChange={(value) =>
                    setBankForm({
                      ...bankForm,
                      bankAccountNumber:
                        value,
                    })
                  }
                  required
                />

                <Input
                  label="Routing Number"
                  value={
                    bankForm.bankRoutingNumber
                  }
                  onChange={(value) =>
                    setBankForm({
                      ...bankForm,
                      bankRoutingNumber:
                        value,
                    })
                  }
                />

                <Input
                  label="SWIFT / BIC"
                  value={
                    bankForm.bankSwiftCode
                  }
                  onChange={(value) =>
                    setBankForm({
                      ...bankForm,
                      bankSwiftCode:
                        value,
                    })
                  }
                />

                <Input
                  label="IBAN"
                  value={
                    bankForm.bankIban
                  }
                  onChange={(value) =>
                    setBankForm({
                      ...bankForm,
                      bankIban: value,
                    })
                  }
                />

                {/* BANK INSTRUCTIONS */}
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Deposit Instructions
                  </label>

                  <textarea
                    value={
                      bankForm.depositInstructions
                    }
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        depositInstructions:
                          e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="Enter bank deposit instructions"
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm outline-none focus:border-blue-400"
                  />
                </div>

                {/* SAVE BANK */}
                <button
                  type="submit"
                  disabled={bankSaving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bankSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  Save Bank Details
                </button>

              </form>
            )}

          </section>

        </div>

        {/* ==================================================
            EXISTING CRYPTO ADDRESSES
        ================================================== */}

        <section className="mt-6 rounded-2xl border border-white/10 bg-[#101621] p-5 sm:p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-semibold">
                Crypto Deposit Addresses
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {cryptoAddresses.length}{" "}
                address
                {cryptoAddresses.length === 1
                  ? ""
                  : "es"}{" "}
                configured.
              </p>
            </div>

          </div>

          {cryptoLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
            </div>
          ) : cryptoAddresses.length ===
            0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-white/10 p-8 text-center">

              <QrCode className="mx-auto h-8 w-8 text-slate-600" />

              <p className="mt-3 text-sm text-slate-500">
                No crypto deposit addresses
                have been added.
              </p>

            </div>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">

              {cryptoAddresses.map(
                (address) => (
                  <div
                    key={address.id}
                    className="rounded-xl border border-white/10 bg-[#080d19] p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <h3 className="font-semibold text-white">
                          {address.name ||
                            address.network}
                        </h3>

                        <p className="mt-1 text-xs text-violet-400">
                          {address.network}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          address.enabled
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-500/10 text-slate-500"
                        }`}
                      >
                        {address.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </span>

                    </div>

                    {/* QR CODE */}
                    {address.qrCodeUrl ? (
                      <div className="mt-4 flex justify-center rounded-xl bg-white p-4">

                        <img
                          src={
                            address.qrCodeUrl
                          }
                          alt={`${address.network} QR code`}
                          className="h-36 w-36 object-contain"
                        />

                      </div>
                    ) : (
                      <div className="mt-4 flex h-44 items-center justify-center rounded-xl border border-dashed border-white/10">

                        <div className="text-center">

                          <QrCode className="mx-auto h-8 w-8 text-slate-600" />

                          <p className="mt-2 text-xs text-slate-500">
                            No QR code uploaded
                          </p>

                        </div>

                      </div>
                    )}

                    {/* ADDRESS */}
                    <div className="mt-4 break-all rounded-xl border border-white/10 bg-[#101621] p-3 text-xs text-slate-400">
                      {address.address}
                    </div>

                    {/* INSTRUCTIONS */}
                    {address.instructions && (
                      <div className="mt-3 rounded-xl border border-white/10 bg-[#101621] p-3 text-xs leading-5 text-slate-400">
                        {address.instructions}
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="mt-4 flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          editCrypto(
                            address
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white hover:bg-white/10"
                      >
                        <Edit3 className="h-3.5 w-3.5" />

                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleCrypto(
                            address
                          )
                        }
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10"
                      >
                        {address.enabled
                          ? "Disable"
                          : "Enable"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteCrypto(
                            address.id
                          )
                        }
                        className="flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-red-400 hover:bg-red-500/10"
                        aria-label="Delete crypto address"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

// ======================================================
// REUSABLE INPUT
// ======================================================

function Input({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  required?: boolean;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm text-slate-300">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        required={required}
        className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm outline-none focus:border-blue-400"
      />

    </div>
  );
}