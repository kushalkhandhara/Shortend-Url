import express from 'express';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { createLink, getLinkDetails, getUserLinks } from '../controllers/linkController.js';


const router = express.Router();

// Protect the link creation route with authentication middleware
router.post('/create', authenticateUser, createLink);

// Route to handle redirection to the original URL
// router.get('/:linkId',redirectToOriginalUrl);

// Route to get all links for a user
router.get('/user/:userId/links', authenticateUser, getUserLinks);

// Get Link By User ID and Link ID
router.get('/user/:userId/link/:linkId', authenticateUser, getLinkDetails);

export default router;