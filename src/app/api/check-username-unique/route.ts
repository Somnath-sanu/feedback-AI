import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // console.log(req.nextUrl);

    const { searchParams } = req.nextUrl;
    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with zod
    // console.log(UsernameQuerySchema.safeParse(queryParam)); //! DELETE THIS LINE

    const { data, success, error } = UsernameQuerySchema.safeParse(queryParam);

    if (!success) {
      const usernameErrors = error.format().username?._errors || [];
      // console.log("usernameErrors :", usernameErrors);
      //? Array of strings

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(" , ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }
    //? The join() method returns an array as a string.The join() method does not change the original array.Any separator can be specified. The default is comma (,).

    const { username } = data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}

/**
 * 400 -> Bad request
 * 401 -> Unauthorized
 * 402-> payment required
 * 403-> Forbidden (server is refusing to respont to it)
 * 404 -> not found
 * 405 -> Method not allowed (may be the method is GET and you are using POST ...)
 */
