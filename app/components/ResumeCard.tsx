import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      setResumeUrl(URL.createObjectURL(blob));
    };

    loadResume();
  }, [imagePath]);

  return (
    <div className="resume-card animate-in fade-in duration-1000 relative rounded-xl">
      {/* Delete button */}
      <button
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

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm 
                    rounded-inherit pointer-events-auto flex items-center justify-center"
          style={{ borderRadius: "inherit" }}
        >
          <div
            className="bg-white shadow-lg p-5 w-64 text-center"
            style={{ borderRadius: "inherit" }}
          >
            <p className="font-semibold mb-4">Delete this resume?</p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowConfirm(false);
                  onDelete();
                }}
                className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Original Card Content (unchanged) */}
      <Link to={`/resume/${id}`} className="block">
        <div className="resume-card-header">
          <div className="flex flex-col gap-0 max-sm:gap-0 max-sm:justify-center">
            {companyName && (
              <h2 className="!text-neutral-700 font-semibold break-words">
                {companyName}
              </h2>
            )}
            {jobTitle && (
              <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
            )}
            {!companyName && !jobTitle && (
              <h2 className="!text-black font-bold">Resume</h2>
            )}
          </div>

          {/* <div className="flex-shrink-0 mr-2"> */}
          <div className="flex-shrink-0 max-sm:scale-80 max-sm:2 lg:mr-2">
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
  );
};

export default ResumeCard;
