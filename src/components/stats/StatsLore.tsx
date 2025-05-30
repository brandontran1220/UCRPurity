const riceLore = [
  {
    label: "Pure Rice",
    description:
      "You’ve never jaywalked across Big Springs Road. You’ve actually used your R’Card for more than just dining hall swipes and haven't touched UCR Confessions since Week 1. Your favorite hangout is Orbach — by choice.",
    image: "/happyRice.svg",
  },
  {
    label: "Silly Rice",
    description:
      "You’ve rollerbladed through campus at midnight and used Dining Dollars to try and bribe your way into friendship. You once got lost in Rivera and stayed for the vibes. Memes are your main form of campus engagement.",
    image: "/sillyRice.svg",
  },
  {
    label: "Average Rice",
    description:
      "You go to the HUB because it’s convenient, not because you want to. You’ve pulled one all-nighter in Orbach and swiped into the SRC exactly once. You kinda like UCR... until you try to register for classes.",
    image: "/neutralRice.svg",
  },
  {
    label: "Dirty Rice",
    description:
      "You’ve pulled up to at least two sketchy basement kickbacks, hopped the Glen Mor fence, and still stumbled into your 8 a.m. half-conscious. You know every UCR urban legend — and honestly, you might be one yourself.",
    image: "/dirtyRice.svg",
  },
];

export default function StatsLore() {
  return (
    <div className="w-full max-w-2xl px-4 pt-4">
      {riceLore.map(({ label, description, image }, idx) => (
        <details
          key={idx}
          className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-md"
        >
          <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold">
            <div className="flex items-center gap-3">
              <img src={image} alt={`${label} icon`} className="h-8 w-8" />
              {label}
            </div>
            {/* dropdown arrow */}
            <span className="text-gray-500 transition-transform group-open:rotate-180">
              ▼
            </span>
          </summary>
          <p className="mt-2 text-gray-700">{description}</p>
        </details>
      ))}
    </div>
  );
}
