import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  createSubscription,
  getUserDetails,
  updateBaseStationData,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
// Add a new route to handle subscription creation
router.post('/subscribe', protect, createSubscription);
router.get('/all-details', protect, getUserDetails);
router.put('/update-base-station-data/:userId/:subscriptionId',protect, updateBaseStationData);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
