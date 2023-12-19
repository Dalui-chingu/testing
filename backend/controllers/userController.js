import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});



export { getAuthorizedBaseStations };
const createSubscription = asyncHandler(async (req, res) => {
  const {
    mountPoint,
    duration,
    correctionType,
    region,
    dataFormat,
    dataRate,
    username,
    password,
    subscriptionName,
  } = req.body;

  // Get the authenticated user from req.user._id
  const user = await User.findById(req.user._id);

  if (user) {
    // Create a new subscription object
    const newSubscription = {
      username: username,
      passsword:password,
      basemountpoint: mountPoint,
      delay: dataRate,
      description: subscriptionName,
      baseStationdata: [{
        mountpoint: 0,
        gpst: 0,
        height: 0,
        q: 0,
        ns: 0,
        sdn: 0,
        sde: 0,
        sdu: 0,
        sdne: 0,
        sdeu: 0,
        sdun: 0,
        age: 0,
        ratio: 0,
        latitude: 0, // Fill in with actual latitude
        longitude: 0,
        timestamp:0,
        // Fill in with actual longitude
      }],
      // Include other subscription details as needed
      // ...
    };

    // Add the new subscription to the user's subscriptions array
    user.subscriptions.push(newSubscription);

    // Save the updated user data with the new subscription
    
    try {
      const updatedUser = await user.save();
      res.status(201).json({ message: 'Subscription created successfully' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error creating subscription: ' + error.message });
    }
    await user.save();
    res.status(201).json({ message: 'Subscription created successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// @desc    Get all user details including subscriptions
// @route   GET /api/users/all-details
// @access  Private
const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('subscriptions.baseStationdata');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      subscriptions: user.subscriptions,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateBaseStationData = async (req, res) => {
  const { userId, subscriptionId } = req.params;
  const { receivedData } = req.body;

  console.log(receivedData);

  try {
    // Retrieve user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the subscription by subscriptionId
    const subscription = user.subscriptions.id(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Update baseStationData for the subscription
    const updatedBaseStationData = receivedData.map(data => {
      // Ensure that the required fields are present
      const updatedData = {
        q: data.q || "", // Set a default value or handle this case as needed
        
        mountpoint: data.mountpoint || "",
        height:data.height||"",
        ns:data.ns||"",
        sdn:data.sdn||"",
        sde:data.sde||"",
        // Include other required fields similarly
        // ...
        ...data, // Include other fields from data
      };
      return updatedData;
    });
    
    subscription.baseStationdata.push(...updatedBaseStationData);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Base station data updated successfully', user });
  } catch (error) {
    console.error('Error updating base station data:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  createSubscription ,
  getUserDetails,
  updateBaseStationData, // Add this export for the new route
};
