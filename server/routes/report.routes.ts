import { getReportController } from "../controller/report.controller";
import { authorieRoles, isAutheticated } from "./../middieware/auth";
import express from "express";

export const reportRoute = express.Router();

reportRoute.get(
  "/report",
  isAutheticated,
  authorieRoles("admin", "management"),
  getReportController
);

export default reportRoute;
