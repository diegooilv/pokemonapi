import { getTypeByName as fetchTypeByName } from "../services/typeService.js";

export const handleGetTypeByName = (req, res) => {
  const { name } = req;
  const type = fetchTypeByName(name);
  if (!type) {
    return res.status(404).json({ error: "Type não encontrado" });
  }

  res.status(200).json(type);
};
