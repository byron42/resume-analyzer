import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState, useRef } from "react";
import { usePuterStore } from "~/lib/puter";

interface ResumeCardProps {
  resume: Resume;
  onDelete: () => void;
}

const ResumeCard = ({ resume, onDelete }: ResumeCardProps) => {
  const { id, companyName, jobTitle, feedback, imagePath } = resume;
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // NEW: refs for focus trap
  const cancelRef = useRef<HTMLButtonElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      setResumeUrl(URL.createObjectURL(blob));
    };

    loadResume();
  }, [imagePath]);

  // NEW: ESC key + focus trap + return focus
  useEffect(() => {
    if (!showConfirm) return;

    // Focus the cancel button first
    cancelRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC closes modal
      if (e.key === "Escape") {
        setShowConfirm(false);
        deleteButtonRef.current?.focus();
      }

      // Focus trap
      const focusable = [cancelRef.current, deleteRef.current];
      const index = focusable.indexOf(document.activeElement as any);

      if (e.key === "Tab") {
        e.preventDefault();

        if (e.shiftKey) {
          const prev = (index - 1 + focusable.length) % focusable.length;
          focusable[prev]?.focus();
        } else {
          const next = (index + 1) % focusable.length;
          focusable[next]?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showConfirm]);

  return (
    <>
      {/* Centered Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => {
            setShowConfirm(false);
            deleteButtonRef.current?.focus();
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm animate-in fade-in duration-200 relative"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <p className="text-lg font-semibold mb-4 text-center">
              Delete this resume?
            </p>
            <h2 className="!text-neutral-700 font-semibold break-words text-center pb-8">
                  "{companyName}"
            </h2>

            <div className="flex justify-center gap-3">
              <button
                ref={cancelRef}
                onClick={() => {
                  setShowConfirm(false);
                  deleteButtonRef.current?.focus();
                }}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>

              <button
                ref={deleteRef}
                onClick={() => {
                  setShowConfirm(false);
                  onDelete();
                }}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Card */}
      <div className="resume-card animate-in fade-in duration-1000 relative rounded-xl">
        {/* Delete button */}
        <button
          ref={deleteButtonRef}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowConfirm(true);
          }}
          className="
            absolute top-0 right-0 z-20
            px-2 py-1
            bg-gray-100 text-gray-400
            hover:bg-gray-300 hover:text-gray-900
            rounded-tr-xl rounded-bl-md
            shadow-sm
        "
        >
          ✕
        </button>

        {/* Original Card Content */}
        <Link to={`/resume/${id}`} className="block">
          <div className="resume-card-header">
            <div className="flex flex-col gap-0 max-sm:gap-0 max-sm:justify-center">
              {companyName && (
                <h2 className="!text-neutral-700 font-semibold break-words">
                  {companyName}
                </h2>
              )}
              {jobTitle && (
                <h3 className="text-lg break-words text-gray-500">
                  {jobTitle}
                </h3>
              )}
              {!companyName && !jobTitle && (
                <h2 className="!text-black font-bold">Resume</h2>
              )}
            </div>

            <div className="flex-shrink-0 max-sm:scale-80 lg:mr-2">
              <ScoreCircle score={feedback.overallScore} />
            </div>
          </div>

          {resumeUrl && (
            <div className="gradient-border animate-in fade-in duration-1000">
              <img
                src={resumeUrl}
                alt="resume"
                className="w-full h-[385px] max-sm:h-[325px] object-cover object-top"
              />
            </div>
          )}
        </Link>
      </div>
    </>
  );
};

export default ResumeCard;
