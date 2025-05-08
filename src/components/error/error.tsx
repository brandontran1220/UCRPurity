"use client";

const Error = () => {
  return (
    <div className="font-inter flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-20 text-5xl font-bold">404 Page</h1>
      <div className="flex items-center gap-25">
        <img src="/sadRice.svg" alt="sad Rice" className="w-m" />
        <div className="flex flex-col">
          <p className="text-center text-3xl font-medium">
            Oops! Something went wrong! <br /> We apologize!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;
