import Image from "next/image";
import { StaticImageData } from "next/image";

interface BoardProps {
    position: string;
    name: string;
    image: StaticImageData;
}

const BoardCard = ({ position, name, image } : BoardProps ) => {
    return (
        <div className="flex flex-col font-inter text-center">
            <div className="mb-2 text-purity-black-100">
                {position}
            </div>
            <div className="relative flex h-60 w-60">
                <Image 
                    src = {image}
                    alt = "boardmember"
                    width = {80}
                    height = {80}
                    className="h-full w-full object-cover rounded-2xl"
                />
            </div>
            <div className="mt-2 text-xl font-semibold text-purity-blue-100">
                {name}
            </div>
        </div>
    );
};

export default BoardCard