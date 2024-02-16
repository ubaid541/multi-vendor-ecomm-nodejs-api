export const roles = {
  admin: "admin",
  seller: "seller",
  customer: "customer",
};

export const handleNoData = (res, data, message) => {
  if (Array.isArray(data) && data.length === 0) {
    res.status(200).json({ message, data });
    return true;
  } else if (data && Object.keys(data).length === 0) {
    res.status(200).json({ message, data });
    return true;
  } else if (!data) {
    res.status(200).json({ message, data });
  }
  return false;
};

export const isValidUserRole = (res, roles) => {
  if (!req.query.user_role || !roles[req.query.user_role]) {
    return false;
  }
  return true;
};
