import { Attr } from "../../models/index.js";
import {
  handleNoData,
  isValidUserRole,
  roles,
} from "../../utils/checkFunctions.js";

const attrController = {
  async getAttr(req, res, next) {
    let attribute;
    try {
      if (!isValidUserRole(req, roles)) {
        return res
          .status(403)
          .json({ message: "Invalid user role.", error: 403 });
      }
      if (req.query.user_role === "admin") {
        attribute = await Attr.find(null, null, {
          sort: { createdAt: -1 },
        }).populate("seller_id");
      } else if (req.query.user_role === "seller") {
        attribute = await Attr.find({ seller_id: req.query.user_id }, null, {
          sort: { createdAt: -1 },
        });
      }

      if (handleNoData(res, attribute, "No Data Found.")) {
        return;
      }
      res.status(200).json({
        data: attribute,
        message: "Attributes retrieved successfully.",
      });
    } catch (error) {
      next(error);
    }
  },
  async getSingleAttr(req, res, next) {
    try {
      const single_attr = await Attr.findOne({ _id: req.params.id });

      if (handleNoData(res, single_attr, "No data found for this id.")) {
        return;
      }

      res.status(200).json(single_attr);
    } catch (error) {
      next(error);
    }
  },
  async addAttr(req, res, next) {
    const { attr_name } = req.body;
    if (!req.query.user_id) {
      return res
        .status(403)
        .send({ message: "user_id is required.", error: 403 });
    }
    if (!attr_name) {
      return res
        .status(403)
        .send({ message: "Attriute name is required.", error: 403 });
    }
    try {
      const exists = await Attr.exists({ attr_name: req.body.attr_name });

      if (exists) {
        return res.status(409).send("Attribute name already exists.");
      }
    } catch (error) {
      next(error);
    }

    const newAttr = new Attr({
      ...req.body,
      seller_id: req.query.user_id,
    });

    try {
      await newAttr.save();
      res.status(200).json(["New Attribute Added", newAttr]);
    } catch (error) {
      next(error);
    }
  },
  async deleteAttr(req, res, next) {
    try {
      const deleteAttr = await Attr.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Attribute Deleted." });
    } catch (error) {
      next(error);
    }
  },
  async updateAttr(req, res, next) {
    const { attr_name, attr_id } = req.body;
    if (!attr_name) {
      return res
        .status(403)
        .send({ messge: "Attribute name and id is required.", error: 403 });
    }
    try {
      const exists = await Attr.exists({
        $and: [{ attr_name: attr_name }, { _id: { $ne: attr_id } }],
      });

      if (exists) {
        return res.status(409).send("Attribute name already exists.");
      }
    } catch (error) {
      next(error);
    }

    try {
      // const updateAttr = await Attr.updateOne(
      //   { _id: req.query.attr_id },
      //   { $set: req.body }
      // );

      const updateAttr = await Attr.findByIdAndUpdate(attr_id, req.body, {
        new: true,
      });

      if (!updateAttr) {
        return res
          .status(404)
          .json({ message: "Attribute not found.", error: 404 });
      }

      res.status(200).json({ message: "Attribute Updated.", data: updateAttr });
    } catch (error) {
      next(error);
    }
  },
};

export default attrController;
