import express from 'express';
import { redirectToOriginalUrl } from '../controllers/clickController.js';


const router = express.Router();


// Redirect to page link
router.get("/:shortName",redirectToOriginalUrl)


export default router;