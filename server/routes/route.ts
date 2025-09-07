import { Router } from "express";
import { additem, getitems, deleteitem, updateitem } from "../controllers/basicFunctions";
import { signin, signup } from "../controllers/authFunction";
import { authMiddleware } from "../middleware/authmiddleware";
import { addtocart , getcartitems } from "../controllers/cartFunction";
const router = Router();


router.post("/signup", signup);
router.post("/signin", signin);


router.post("/products", authMiddleware, additem);
router.get("/products", authMiddleware, getitems);
router.delete("/products/:id", authMiddleware, deleteitem);
router.put("/products/:id", authMiddleware, updateitem);


router.post('/addcart', authMiddleware , addtocart );
router.get('/carditems', authMiddleware , getcartitems)
export default router;
