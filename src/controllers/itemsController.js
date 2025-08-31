import {
  getAllItems as fetchAllItems,
  getItemById as fetchItemById,
  getItemByName as fetchItemByName,
} from "../services/itemService.js";

export const handleGetItemById = (req, res) => {
  const { id } = req;
  const items = fetchItemById(id);
  if (!items) {
    return res.status(404).json({ error: "Item não encontrado!" });
  }

  res.status(200).json(items);
};

export const handleGetItemByName = (req, res) => {
  const { name } = req;
  const item = fetchItemByName(name);

  if (!item) {
    return res.status(404).json({ error: "Item não encontrado!" });
  }

  res.status(200).json(item);
};

export const handleGetAllItems = (req, res) => {
  const { page = 1 } = req.query;
  const limit = 10;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + Number(limit);

  const allItems = fetchAllItems();

  const paginatedItems = allItems.slice(startIndex, endIndex);

  res.status(200).json(paginatedItems);
};
