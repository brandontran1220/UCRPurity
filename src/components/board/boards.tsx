import { board } from "@/data/Board";
import BoardCard from "@/components/board/boardCard";

const Board = () => {
  return (
    <div className="flex min-h-full flex-col items-center justify-center md:gap-10 md:py-10">
      <div className="grid grid-cols-2 md:hidden md:gap-20">
        {board.slice(0, 4).map(({ name, linkedin, image }, index) => (
          <BoardCard
            key={index}
            name={name}
            image={image}
            linkedin={linkedin}
          />
        ))}
      </div>
      <div className="flex flex-col md:hidden md:gap-20">
        {board.slice(4, 5).map(({ name, linkedin, image }, index) => (
          <BoardCard
            key={index}
            name={name}
            image={image}
            linkedin={linkedin}
          />
        ))}
      </div>
      <div className="hidden md:flex md:gap-20">
        {board.slice(0, 3).map(({ name, linkedin, image }, index) => (
          <BoardCard
            key={index}
            name={name}
            image={image}
            linkedin={linkedin}
          />
        ))}
      </div>
      <div className="hidden md:flex md:gap-20">
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
