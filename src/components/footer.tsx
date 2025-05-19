const footer = () => {
  return (
    <div className="bg-purity-blue-200 flex w-full items-end justify-between text-black">
      <div className="container mx-auto w-full text-black">
        <div className="grid items-center justify-center md:grid-cols-3">
          <div className="flex flex-col pt-1">
            <p className="font-inter text-xl font-semibold">Built By</p>
            <p className="font-inter ps-15 text-2xl font-extrabold">
              Purified Rice
            </p>
            <div className="flex items-center gap-4">
              <img
                src="/happyRice.svg"
                alt="Happy Rice"
                className="h-25 w-25"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center underline">
              <p className="font-inter mb-1 pr-2 text-xl font-black">
                Follow us on
              </p>
              <span className="rounded-sm border-3 [&>svg]:h-5 [&>svg]:w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 448 512"
                >
                  <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                </svg>
              </span>
            </div>

            <p className="font-inter mt-1">
              <p>
                <a
                  href="https://www.linkedin.com/in/aaron-huynh-2930b4253/"
                  className="hover:underline"
                >
                  Aaron's LinkedIn
                </a>
              </p>
              <p>
                <a href="" className="hover:underline">
                  Brandon's LinkedIn
                </a>
              </p>
              <p>
                <a href="" className="hover:underline">
                  Tony's LinkedIn
                </a>
              </p>
              <p>
                <a href="" className="hover:underline">
                  Dillon's LinkedIn
                </a>
              </p>
              <p>
                <a href="" className="hover:underline">
                  Zach's LinkedIn
                </a>
              </p>
            </p>
          </div>
          <div className="ml-auto pt-25 text-right">
            <p className="font-inter text-xl font-semibold">
              Created in May 2025
            </p>
            <p className="font-inter text-xl font-semibold">
              @ University of California-Riverside
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default footer;
