import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User; //? Assertion
  console.log(user);
  

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  console.log("userId || get-messages-route" , userId);
  
  try {
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    console.log("User-aggregate-get-messages" , userMessages);

    console.log(userMessages);
    
    

    if (!userMessages || userMessages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No messages yet",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: userMessages[0].messages,
      },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error getting messages",error);
    return Response.json(
      {
        success: false,
        message: "Unexpected error occered while getting messages",
      },
      { status: 500 }
    );
    
  }
}
