import express from "express";
import createAdBlock from "../controllers/create-adblock.js";
import getAdBlocks from "../controllers/get-adblocks.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/all",getAdBlocks)

router.post("/create", upload.single("imageURL"), createAdBlock)

const adRoutes = router
export default adRoutes;