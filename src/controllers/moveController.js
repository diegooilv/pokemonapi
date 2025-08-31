import {
  getMoveById as fetchMoveById,
  getMoveByName as fetchMoveByName,
} from "../services/moveService.js";

export const handleGetMoveById = (req, res) => {
  const { id } = req;
  const item = fetchMoveById(id);

  if (!item) {
    return res.status(404).json({ error: "Move não encontrado!" });
  }

  res.status(200).json(item);
};

export const handleGetMoveByName = (req, res) => {
  const { name } = req;
  const item = fetchMoveByName(name);

  if (!item) {
    return res.status(404).json({ error: "Move não encontrado!" });
  }

  res.status(200).json(item);
};
