import { Addon } from "../../models/index.js";
import { roles } from "../../utils/checkFunctions.js";
// import { handleNoData } from "../../utils/noData.js";
import { handleNoData } from "../../utils/checkFunctions.js";

const addonContoller = {
  async getAddons(req, res, next) {
    let addons;
    try {
      if (!req.query.user_role || !roles[req.query.user_role]) {
        return res
          .status(403)
          .json({ message: "Invalid user role.", error: 403 });
      }
      if (req.query.user_role === "admin") {
        addons = await Addon.find(null, null, {
          sort: { createdAt: -1 },
        }).populate("seller_id");

        console.log("addons list:: ", addons);
      } else if (req.query.user_role === "seller") {
        addons = await Addon.find({ seller_id: req.query.user_id }, null, {
          sort: { createdAt: -1 },
        });
        console.log("addons list:: ", addons);
      }

      if (handleNoData(res, addons, "No Data Found.")) {
        return;
      }
      res.status(200).json(addons);
    } catch (error) {
      next(error);
    }
  },
  async getSingleAddon(req, res, next) {
    console.log("id ", req.params.id);
    try {
      const single_addon = await Addon.findOne({ _id: req.params.id });
      console.log("single addon ", single_addon);

      if (handleNoData(res, single_addon, "No data found for this id.")) {
        return;
      }

      res.status(200).json(single_addon);
    } catch (error) {
      next(error);
    }
  },
  async addAddon(req, res, next) {
    const { addon_name, addon_price } = req.body;
    if (!addon_name || !addon_price) {
      return res
        .status(403)
        .send({ message: "Addon name and price are required.", error: 403 });
    }
    try {
      const exists = await Addon.exists({ addon_name: req.body.addon_name });

      if (exists) {
        return res.status(409).send("Addon name already exists.");
      }
    } catch (error) {
      next(error);
    }

    const newAddon = new Addon({
      ...req.body,
      seller_id: req.query.user_id,
    });

    try {
      await newAddon.save();
      res.status(200).json(["New Addon Added", newAddon]);
    } catch (error) {
      next(error);
    }
  },
  async deleteAddon(req, res, next) {
    const { id } = req.params;
    if (!id) {
      return res
        .status(403)
        .json({ message: "Addon id is required.", error: 403 });
    }
    try {
      const deleteAddon = await Addon.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Addon Deleted." });
    } catch (error) {
      next(error);
    }
  },
  async updateAddon(req, res, next) {
    const { addon_name, addon_id } = req.body;

    if (!addon_name || !addon_id) {
      return res
        .status(409)
        .send({ messge: "Addon name and addon id are required.", error: 403 });
    }

    try {
      const exists = await Addon.exists({
        $and: [{ addon_name: addon_name }, { _id: { $ne: addon_id } }],
      });

      if (exists) {
        return res
          .status(409)
          .send({ message: "Addon name already exists.", error: 409 });
      }
    } catch (error) {
      next(error);
    }

    try {
      //   const updateAddon = await Addon.updateOne(
      //     { _id: req.query.addon_id },
      //     { $set: req.body }
      //   );

      const updatedAddon = await Addon.findByIdAndUpdate(addon_id, req.body, {
        new: true,
      });
      console.log("updated addon::: ", updatedAddon);
      if (!updatedAddon) {
        return res
          .status(404)
          .json({ message: "Addon not found.", error: 404 });
      }
      res.status(200).json({ message: "Addon Updated.", data: updatedAddon });
      res.status(200).json({ message: "Addon Updated.", data: updateAddon });
    } catch (error) {
      next(error);
    }
  },
};

export default addonContoller;
