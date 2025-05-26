import { board } from "@/data/Board";
import BoardCard from "@/components/board/boardCard";

const Board = () => {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-10 py-10">
      <div className="flex gap-20">
        {board.slice(0, 3).map(({ name, linkedin, image }, index) => (
          <BoardCard
            key={index}
            name={name}
            image={image}
            linkedin={linkedin}
          />
        ))}
      </div>
      <div className="flex gap-20">
        {board.slice(3, 5).map(({ name, linkedin, image }, index) => (
          <BoardCard
            key={index}
            name={name}
            image={image}
            linkedin={linkedin}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
