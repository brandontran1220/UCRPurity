import { useState } from "react";
import { MdContentCopy } from "react-icons/md";

const CopyLink = () => {
  const [copied, setCopied] = useState(false);
  const link = "https://ucr-purity.vercel.app/";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center md:pb-8">
      <p className="m-[20px] text-center text-xl font-medium">
        See what type of rice grain your friends are!
      </p>
      <button
        onClick={handleCopy}
        className="cursor-pointer rounded-2xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-blue-700"
      >
        <MdContentCopy className="mr-2 inline-block" />
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
};

export default CopyLink;
