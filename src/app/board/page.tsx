import Boards from "@/components/board/boards";
import BoardTitle from "@/components/board/boardTitle";
import BoardDescript from "@/components/board/boardDescript";

const Board = () => {
  return (
    <div>
      <BoardTitle />
      <Boards />
      <BoardDescript />
    </div>
  );
};

export default Board;
