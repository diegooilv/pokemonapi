import fs from "fs";
import path from "path";

const filePath = path.resolve("./json/types.json");

const types = JSON.parse(fs.readFileSync(filePath, "utf-8"));

export const getTypeByName = (name) => {
  if (!name) return null;
  const lowerName = name.toLowerCase().trim();

  return (
    types.find((type) => {
      return [type.chinese, type.english, type.japanese]
        .filter((v) => typeof v === "string")
        .some((m) => m.toLowerCase() === lowerName);
    }) || null
  );
};
