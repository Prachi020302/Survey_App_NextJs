import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/Backend/utils/JwtToken";
import { updateUserProfile } from "@/Backend/services/UserService";
import { responseStatusCode } from "@/Backend/utils/responseHandler";
import connectDB from "@/Backend/config/dataBase";
import { User_Data } from "@/Backend/model/UserModel";

interface DecodedToken {
  userId?: string;
  email: string;
  role: string;
}

// GET /api/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get JWT token from cookies
    const token = request.cookies.get("Userdata")?.value;

    if (!token) {
      return NextResponse.json(
        {
          statusCode: responseStatusCode.unauthorized,
          message: "Authentication token required",
        },
        { status: responseStatusCode.unauthorized }
      );
    }

    // Verify token and get user data
    const decodedToken = verifyToken(token) as DecodedToken;
    if (!decodedToken) {
      return NextResponse.json(
        {
          statusCode: responseStatusCode.unauthorized,
          message: "Invalid authentication token",
        },
        { status: responseStatusCode.unauthorized }
      );
    }

    // Get user profile from database by email
    const { User_Data } = await import("@/Backend/model/UserModel");
    const user = await User_Data.findOne({ email: decodedToken.email });

    if (!user) {
      return NextResponse.json(
        {
          statusCode: responseStatusCode.notFound,
          message: "User not found",
        },
        { status: responseStatusCode.notFound }
      );
    }

    // Return user profile (excluding password)
    const userProfile = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(
      {
        statusCode: responseStatusCode.success,
        message: "Profile fetched successfully",
        data: userProfile,
      },
      { status: responseStatusCode.success }
    );
  } catch (error) {
    console.error("GET /api/profile - Error:", error);
    return NextResponse.json(
      {
        statusCode: responseStatusCode.internal,
        message: "Internal server error",
      },
      { status: responseStatusCode.internal }
    );
  }
}

// PUT /api/profile - Update current user profile
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Get JWT token from cookies
    const token = request.cookies.get("Userdata")?.value;

    if (!token) {
      return NextResponse.json(
        {
          statusCode: responseStatusCode.unauthorized,
          message: "Authentication token required",
        },
        { status: responseStatusCode.unauthorized }
      );
    }

    // Verify token and get user data
    const decodedToken = verifyToken(token) as DecodedToken;
    if (!decodedToken) {
      return NextResponse.json(
        {
          statusCode: responseStatusCode.unauthorized,
          message: "Invalid authentication token",
        },
        { status: responseStatusCode.unauthorized }
      );
    }

    // Parse request body
    const updateData = await request.json();

    // Validate required fields
    if (!updateData.firstName || !updateData.lastName || !updateData.email) {
      return NextResponse.json(
        {
          statusCode: responseStatusCode.unProcess,
          message: "First name, last name, and email are required",
        },
        { status: responseStatusCode.unProcess }
      );
    }

    // Get current user from database
    const currentUser = await User_Data.findOne({ email: decodedToken.email });

    if (!currentUser) {
      return NextResponse.json(
        {
          statusCode: responseStatusCode.notFound,
          message: "User not found",
        },
        { status: responseStatusCode.notFound }
      );
    }

    // Update user profile using the service
    const updatedUser = await updateUserProfile(currentUser._id.toString(), {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      email: updateData.email,
    });

    if (!updatedUser) {
      return NextResponse.json(
        {
          statusCode: responseStatusCode.internal,
          message: "Failed to update profile",
        },
        { status: responseStatusCode.internal }
      );
    }

    // Return updated profile (excluding password)
    const userProfile = {
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return NextResponse.json(
      {
        statusCode: responseStatusCode.success,
        message: "Profile updated successfully",
        data: userProfile,
      },
      { status: responseStatusCode.success }
    );
  } catch (error) {
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("email already exists")) {
        return NextResponse.json(
          {
            statusCode: responseStatusCode.unProcess,
            message: "Email already exists",
          },
          { status: responseStatusCode.unProcess }
        );
      }
      if (error.message.includes("validation")) {
        return NextResponse.json(
          {
            statusCode: responseStatusCode.unProcess,
            message: error.message,
          },
          { status: responseStatusCode.unProcess }
        );
      }
    }

    return NextResponse.json(
      {
        statusCode: responseStatusCode.internal,
        message: "Internal server error",
      },
      { status: responseStatusCode.internal }
    );
  }
}
