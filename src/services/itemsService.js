import fs from "fs";
import path from "path";

const filePath = path.resolve("./json/items.json");

const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));

export const getAllItems = () => items;

export const getItemById = (id) => {
  const numericId = Number(id);
  return items.find((i) => i.id === numericId);
};

export const getItemByName = (name) => {
  if (!name) return null;
  const lowerName = name.toLowerCase().trim();

  return (
    items.find((item) => {
      if (!item.name) return false;

      return Object.values(item.name)
        .filter((n) => typeof n === "string")
        .some((n) => n.toLowerCase() === lowerName);
    }) || null
  );
};
