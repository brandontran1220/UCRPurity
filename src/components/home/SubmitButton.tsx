"use client";

interface SubmitButtonProps {
  onClick?: () => void;
}

const SubmitButton = ({ onClick }: SubmitButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="my-10 flex justify-center py-6">
      <button
        onClick={handleClick}
        className="rounded-2xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-blue-700"
      >
        Submit & View Results
      </button>
    </div>
  );
};

export default SubmitButton;
