//* For checking , 
//! DELETE THE FOLDER AFTER CHEKING 

import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/options"


export default async function Server() {

  const session = await getServerSession(authOptions)

  return (
    <div>
      {JSON.stringify(session)}
    </div>
  )
}