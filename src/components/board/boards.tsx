import {board} from "@/data/Board";
import BoardCard from "@/components/board/boardCard"

const Board = () => {
    return (
        <div className="flex flex-col items-center gap-10 justify-center">
            <div className="flex gap-20">
                {board.slice(0, 3).map(({name, position, image}, index) => (
                    <BoardCard
                        key={index}
                        position={position}
                        name={name}
                        image={image}
                    />
                ))}
            </div>
            <div className="flex gap-20">
                {board.slice(3, 5).map(({name, position, image}, index) => (
                    <BoardCard
                        key={index}
                        position={position}
                        name={name}
                        image={image}
                    />
                ))}
            </div>
        </div>
    );
};

export default Board;