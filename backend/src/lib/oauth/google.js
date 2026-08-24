// import { Google } from "arctic";

// export const google = new Google(
//   process.env.GOOGLE_CLIENT_ID, 
//   process.env.GOOGLE_CLIENT_SECRET, 
//   process.env.GOOGLE_URL,
// );

import { OAuth2Client } from "google-auth-library"

export const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_URL
)