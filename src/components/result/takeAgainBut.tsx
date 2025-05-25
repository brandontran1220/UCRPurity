import Link from 'next/link';

const TakeAgainBut = () => {
    return (
        <div className="my-10 flex justify-center py-">
            <Link
                href="/"
                className="rounded-2xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
                Take Again!
            </Link>
        </div>
    );
}

export default TakeAgainBut;