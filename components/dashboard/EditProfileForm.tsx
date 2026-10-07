
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Camera,
  UserRound,
  Mail,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
} from "lucide-react";

type EditProfileFormProps = {
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
};

type UpdatedUser = {
  firstName: string;
  lastName: string;
  name?: string | null;
  email: string;
  image: string | null;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function EditProfileForm({
  firstName: initialFirstName,
  lastName: initialLastName,
  email,
  image,
}: EditProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [currentImage, setCurrentImage] = useState<string | null>(image);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setSuccessMessage("");
    setErrorMessage("");

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMessage("Your profile picture must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  function cancelImageSelection() {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (
      trimmedFirstName.length < 2 ||
      trimmedFirstName.length > 60 ||
      trimmedLastName.length < 2 ||
      trimmedLastName.length > 60
    ) {
      setErrorMessage(
        "First and last names must be between 2 and 60 characters.",
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("firstName", trimmedFirstName);
      formData.append("lastName", trimmedLastName);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await fetch(
        "/api/customer/settings/profile",
        {
          method: "PATCH",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to update your profile.",
        );
      }

      const updatedUser = result.user as UpdatedUser | undefined;

      if (updatedUser) {
        setFirstName(updatedUser.firstName);
        setLastName(updatedUser.lastName);
        setCurrentImage(updatedUser.image ?? null);
      } else {
        setFirstName(trimmedFirstName);
        setLastName(trimmedLastName);
      }

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccessMessage(
        result.message || "Profile updated successfully.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const displayedImage = previewUrl || currentImage;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile picture */}
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800">
            {displayedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayedImage}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={42} className="text-slate-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white">
              Profile picture
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Choose a JPG, PNG, or WebP image. Maximum file size: 5 MB.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
              id="profile-image"
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label
                htmlFor="profile-image"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                <Camera size={18} />
                Choose picture
              </label>

              {selectedFile && (
                <button
                  type="button"
                  onClick={cancelImageSelection}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <X size={16} />
                  Cancel selection
                </button>
              )}
            </div>

            {selectedFile && (
              <p className="mt-3 break-all text-xs text-emerald-400">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Personal details */}
      <section>
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-white">
            Personal details
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Update the name associated with your account.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              minLength={2}
              maxLength={60}
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              minLength={2}
              maxLength={60}
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              readOnly
              aria-readonly="true"
              className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 pl-11 text-sm text-slate-400 outline-none"
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Your email address cannot be changed from this form.
          </p>
        </div>
      </section>

      {/* Status messages */}
      {successMessage && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
        >
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
        >
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">
          Your changes will be saved to your account.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Saving changes...
            </>
          ) : (
            <>
              <Upload size={17} />
              Save changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
