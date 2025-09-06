import { Router } from "express";
import { additem, getitems, deleteitem, updateitem } from "../controllers/basicFunctions.ts";
import { authmiddleware } from "../middleware/authmiddleware.ts";
const router = Router();

router.post("/addItem", authmiddleware, additem);
router.get("/getItems", authmiddleware, getitems);
router.delete("/deleteItem/:id", authmiddleware, deleteitem);
router.put("/updateItem/:id", authmiddleware, updateitem);

export default router;