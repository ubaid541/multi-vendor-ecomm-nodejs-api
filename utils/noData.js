export const handleNoData = (res, data, message) => {
  if (Array.isArray(data) && data.length === 0) {
    res.status(200).json({ message, data });
    return true;
  } else if (!Array.isArray(data) && Object.keys(data).length === 0) {
    res.status(200).json({ message, data });
    return true;
  }
  return false;
};
