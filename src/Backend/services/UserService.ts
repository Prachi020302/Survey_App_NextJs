import { User_Data } from "../model/UserModel";
import translations from "../utils/translate";

const getUserService = async () => {
  const userList = await User_Data.find();
  return { userList, count: userList.length };
};

const getUserByIdService = async (id: string) => {
  const user = await User_Data.findOne({ id });
  if (!user) {
    throw new Error(translations.userNotFound);
  }
  return user;
};

// Get user by MongoDB _id (for JWT user identification)
const getUserById = async (id: string) => {
  try {
    const user = await User_Data.findById(id);
    return user;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    return null;
  }
};

// Update user profile
const updateUserProfile = async (
  userId: string, 
  updateData: { firstName: string; lastName: string; email: string }
) => {
  try {
    // Check if email is already taken by another user
    const existingUser = await User_Data.findOne({ 
      email: updateData.email, 
      _id: { $ne: userId } 
    });
    
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Validate input data
    if (!updateData.firstName || updateData.firstName.length < 3) {
      throw new Error("First name must be at least 3 characters");
    }
    if (!updateData.lastName || updateData.lastName.length < 3) {
      throw new Error("Last name must be at least 3 characters");
    }
    if (!updateData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)) {
      throw new Error("Please enter a valid email");
    }

    // Update user
    const updatedUser = await User_Data.findByIdAndUpdate(
      userId,
      {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email,
        updatedAt: new Date(),
      },
      { new: true } // Return updated document
    );

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

const getCurrentUserService = async (token?: string) => {
  if (!token) {
    return null;
  }

  try {
    // Import verifyToken function
    const { verifyToken } = await import("../utils/JwtToken");
    
    // Verify and decode the JWT token
    const decoded = verifyToken(token) as { email: string; role: string };
    
    // Find the user in the database by email
    const user = await User_Data.findOne({ email: decoded.email });
    
    if (!user) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error("Error in getCurrentUserService:", error);
    return null;
  }
};

export { 
  getUserService, 
  getUserByIdService, 
  getCurrentUserService,
  getUserById,
  updateUserProfile
};
