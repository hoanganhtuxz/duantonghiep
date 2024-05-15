import express from "express";
import { authorieRoles, isAutheticated } from "../middieware/auth";
import { getAllProduct, uploadProduct ,deleteProductById, editProduct, getStatisticProduct} from "../controller/warehouse.controller";


export const warehouseRouter = express.Router()

warehouseRouter.post(
    "/products",
    isAutheticated,
    authorieRoles("admin", "management",),
    uploadProduct
  );
  
  warehouseRouter.put(
    "/products/:id",
    isAutheticated,
    authorieRoles("admin", "management"),
    editProduct
  );
  
  warehouseRouter.get(
    "/products/:id",
    isAutheticated,
    authorieRoles("admin", "management", "user"),
  );
  
  warehouseRouter.get(
    "/products",
    isAutheticated,
    authorieRoles("admin", "management", "user"),
    getAllProduct
  );
  
  warehouseRouter.get(
    "/statistic-products",
    isAutheticated,
    authorieRoles("admin", "management", "user"),
    getStatisticProduct
  );

  warehouseRouter.delete(
    "/products/:id",
    isAutheticated,
    authorieRoles("admin", "management"),
    deleteProductById
  );
  

export default warehouseRouter;