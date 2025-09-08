import { Router } from "express";
import { additem, getitems, deleteitem, updateitem } from "../controllers/basicFunctions";
import { signin, signup } from "../controllers/authFunction";
import { authMiddleware } from "../middleware/authmiddleware";
import { addtocart , getcartitems } from "../controllers/cartFunction";
const router = Router();


router.post("/signup", signup);
router.post("/signin", signin);


router.post("/products",additem);
router.get("/products", getitems);
router.delete("/products/:id", deleteitem);
router.put("/products/:id",  updateitem);


router.post('/addcart', authMiddleware , addtocart );
router.get('/cartitems', authMiddleware , getcartitems)
export default router;
