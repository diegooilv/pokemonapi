import fs from "fs";
import path from "path";

const filePath = path.resolve("./json/moves.json");

const moves = JSON.parse(fs.readFileSync(filePath, "utf-8"));

export const getMoveById = (id) => {
  const numericId = Number(id);
  return moves.find((m) => m.id === numericId);
};

export const getMoveByName = (name) => {
  if (!name) return null;
  const lowerName = name.toLowerCase().trim();

  return (
    moves.find((move) => {
      return [move.cname, move.ename, move.jname]
        .filter((v) => typeof v === "string")
        .some((m) => m.toLowerCase() === lowerName);
    }) || null
  );
};
