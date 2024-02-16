export const handleNoData = (res, data, message) => {
  if (data.length === 0) {
    res.status(200).json({ message, data });
    return true;
  }
  return false;
};
