import { useState } from "react";
import {
  Search,
  Award,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  BookOpen,
  User,
} from "lucide-react";

function CertificateVerify() {
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Available";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const id = certificateId.trim();

    if (!id) {
      setError("Please enter a certificate ID.");
      setCertificate(null);
      return;
    }

    setLoading(true);
    setError("");
    setCertificate(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/certificate/${encodeURIComponent(id)}`
      );

      const data = await response.json();

      if (response.ok && data.success && data.certificate) {
        const certificateData = data.certificate;

        setCertificate({
          studentName:
            certificateData.studentName ||
            certificateData.student_name ||
            certificateData.name ||
            "Student",

          courseName:
            certificateData.courseName ||
            certificateData.course_name ||
            "Course",

          certificateId:
            certificateData.certificateId ||
            certificateData.certificate_id ||
            id,

          completionDate:
            certificateData.completionDate ||
            certificateData.completion_date ||
            null,
        });
      } else {
        setError(
          data.message || "Certificate could not be verified."
        );
      }
    } catch (error) {
      console.error("Certificate verification error:", error);

      setError(
        "Unable to connect to the certificate verification service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================================
          HERO
      ================================= */}

      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <ShieldCheck size={34} />
          </div>

          <h1 className="text-3xl font-bold md:text-5xl">
            Certificate Verification
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Verify the authenticity of a CodeNinja Academy
            certificate using its unique certificate ID.
          </p>

        </div>
      </section>

      {/* ================================
          MAIN
      ================================= */}

      <main className="mx-auto max-w-4xl px-6 py-12">

        {/* ================================
            SEARCH CARD
        ================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-slate-900">
              Verify a Certificate
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter the certificate ID printed on the certificate.
            </p>

          </div>

          <form
            onSubmit={handleVerify}
            className="flex flex-col gap-3 sm:flex-row"
          >

            <div className="relative flex-1">

              <Award
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={certificateId}
                onChange={(e) =>
                  setCertificateId(e.target.value)
                }
                placeholder="Enter certificate ID"
                className="w-full rounded-xl border border-slate-300 py-3.5 pl-11 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search size={18} />

              {loading
                ? "Verifying..."
                : "Verify Certificate"}
            </button>

          </form>

          {/* ================================
              ERROR
          ================================= */}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

              <XCircle
                size={21}
                className="mt-0.5 shrink-0"
              />

              <div>

                <p className="font-semibold">
                  Verification Failed
                </p>

                <p className="mt-1 text-sm">
                  {error}
                </p>

              </div>

            </div>
          )}

        </div>

        {/* ================================
            VERIFIED CERTIFICATE
        ================================= */}

        {certificate && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm">

            {/* Verification Header */}

            <div className="border-b border-green-200 bg-green-50 p-6">

              <div className="flex items-center gap-3">

                <div className="rounded-full bg-green-100 p-3 text-green-600">
                  <CheckCircle2 size={28} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-green-900">
                    Certificate Verified
                  </h2>

                  <p className="mt-1 text-sm text-green-700">
                    This certificate is valid in the CodeNinja
                    Academy system.
                  </p>

                </div>

              </div>

            </div>

            {/* Certificate Details */}

            <div className="p-6 md:p-8">

              {/* Certificate Heading */}

              <div className="mb-8 text-center">

                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Award size={42} />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Certificate of Completion
                </h3>

                <p className="mt-2 text-slate-500">
                  CodeNinja Academy
                </p>

              </div>

              {/* Details Grid */}

              <div className="grid gap-4 sm:grid-cols-2">

                {/* ================================
                    STUDENT
                ================================= */}

                <div className="rounded-xl bg-slate-50 p-5">

                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <User size={17} />
                    Student
                  </div>

                  <p className="text-lg font-bold capitalize text-slate-900">
                    {certificate.studentName}
                  </p>

                </div>

                {/* ================================
                    COURSE
                ================================= */}

                <div className="rounded-xl bg-slate-50 p-5">

                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <BookOpen size={17} />
                    Course
                  </div>

                  <p className="text-lg font-bold text-slate-900">
                    {certificate.courseName}
                  </p>

                </div>

                {/* ================================
                    CERTIFICATE ID
                ================================= */}

                <div className="rounded-xl bg-slate-50 p-5">

                  <p className="mb-2 text-sm font-medium text-slate-500">
                    Certificate ID
                  </p>

                  <p className="break-all font-mono text-sm font-semibold text-slate-900">
                    {certificate.certificateId}
                  </p>

                </div>

                {/* ================================
                    COMPLETION DATE
                ================================= */}

                <div className="rounded-xl bg-slate-50 p-5">

                  <p className="mb-2 text-sm font-medium text-slate-500">
                    Completion Date
                  </p>

                  <p className="text-lg font-bold text-slate-900">
                    {formatDate(certificate.completionDate)}
                  </p>

                </div>

              </div>

              {/* ================================
                  OFFICIAL VERIFICATION
              ================================= */}

              <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">

                <div className="flex items-start gap-3">

                  <ShieldCheck
                    size={22}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <div>

                    <p className="font-semibold text-blue-900">
                      Official Verification
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-800">
                      This certificate has been verified against
                      the CodeNinja Academy learning records.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================================
            INFORMATION
        ================================= */}

        {!certificate && !error && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h3 className="font-bold text-slate-900">
              How certificate verification works
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex gap-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  1
                </div>

                <div>

                  <p className="font-semibold text-slate-900">
                    Find the certificate ID
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Locate the unique certificate ID shown on
                    your CodeNinja certificate.
                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  2
                </div>

                <div>

                  <p className="font-semibold text-slate-900">
                    Enter the ID
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the ID in the verification field above.
                  </p>

                </div>

              </div>

              <div className="flex gap-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  3
                </div>

                <div>

                  <p className="font-semibold text-slate-900">
                    Verify the certificate
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    CodeNinja Academy checks the certificate
                    against its learning records.
                  </p>

                </div>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default CertificateVerify;