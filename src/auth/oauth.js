import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import UserModel from "../services/users/schema.js";
import { JWTAuthenticate } from "./tools.js";

const googleCloudStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}/users/googleRedirect`,
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      // This callback is executed when Google gives us a successful response
      // We are receiving also some informations about the user from Google (profile, email)

      console.log("GOOGLE PROFILE: ", profile);

      // 1. Check if the user is already in our db
      const user = await UserModel.findOne({ googleId: profile.id });

      if (user) {
        // 2. If the user is already there --> create some tokens for him/her
        const tokens = await JWTAuthenticate(user);
        // 4. passportNext()
        passportNext(null, { tokens });
      } else {
        // 3. If it is not --> add user to db and then create some tokens for him/her

        const newUser = new UserModel({
          firstName: profile.name.givenName,
          surName: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });

        const savedUser = await newUser.save();

        const tokens = await JWTAuthenticate(savedUser);

        // 4. passportNext()
        passportNext(null, { tokens });
      }
    } catch (error) {
      passportNext(error);
    }
  }
);

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data);
});
export default googleCloudStrategy;
