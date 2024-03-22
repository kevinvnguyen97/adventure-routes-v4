import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { isValidEmail } from "/imports/utils";

export interface AdventureRoute {
  _id?: string;
  userId: string;
  pictureUrl?: string;
  name: string;
  priceCategory?: number;
  activities?: string[];
  description?: string;
  route: {
    origin: string;
    waypoints?: string[];
    destination: string;
  };
}

export interface Comment {
  _id?: string;
  userId: string;
  adventureRouteId: string;
  dateTime: Date;
  comment: string;
  commentIdReplyFrom?: string;
  imageAttachmentUrl?: string;
  placeOfInterest?: google.maps.Place;
}

export const AdventureRoutesCollection = new Mongo.Collection<AdventureRoute>(
  "adventureRoutes"
);
export const CommentsCollection = new Mongo.Collection<Comment>("comments");

Meteor.methods({
  upsertAdventureRoute: async (adventureRoute: AdventureRoute) => {
    const { _id, ...adventureRouteFields } = adventureRoute;
    await AdventureRoutesCollection.upsertAsync(
      { _id },
      { $set: adventureRouteFields }
    );
  },
  deleteAdventureRoute: async (adventureRouteId: string) => {
    await AdventureRoutesCollection.removeAsync({ _id: adventureRouteId });
  },
  changeUsername: (newUsername: string) => {
    const userId = Meteor.userId();
    if (!!userId) {
      Accounts.setUsername(userId, newUsername);
    }
  },
  changeEmail: (newEmail: string) => {
    const user = Meteor.user();
    const { emails = [], _id: userId } = user || {};

    if (!isValidEmail(newEmail)) {
      throw new Meteor.Error("invalid-input", "Email must be valid");
    }

    if (emails.length > 0 && !!userId && Meteor.isServer) {
      Accounts.removeEmail(userId, emails[0].address);
      Accounts.addEmail(userId, newEmail);
    }
  },
  changeProfilePicture: async (newProfilePictureUrl: string) => {
    const userId = Meteor.userId();
    if (!!userId) {
      await Meteor.users.updateAsync(
        { _id: userId },
        { $set: { "profile.profilePictureUrl": newProfilePictureUrl } }
      );
    }
  },
  changeFullName: async (args: { firstName: string; lastName: string }) => {
    const { firstName, lastName } = args;
    const userId = Meteor.userId();
    if (!!userId) {
      await Meteor.users.updateAsync(
        { _id: userId },
        {
          $set: {
            "profile.firstName": firstName,
            "profile.lastName": lastName,
          },
        }
      );
    }
  },
  changePhoneNumber: async (newPhoneNumber: string) => {
    const userId = Meteor.userId();
    if (!!userId) {
      if (!isValidPhoneNumber(newPhoneNumber, "US") || !newPhoneNumber) {
        throw new Meteor.Error("invalid-input", "Phone number is invalid");
      }
      await Meteor.users.updateAsync(
        { _id: userId },
        {
          $set: {
            "profile.phoneNumber": parsePhoneNumber(
              newPhoneNumber,
              "US"
            ).formatNational(),
          },
        }
      );
    }
  },
  upsertComment: async (comment: Comment) => {
    const { _id, ...commentFields } = comment;
    await CommentsCollection.upsertAsync({ _id }, { $set: commentFields });
  },
  deleteComment: async (commentId: string) => {
    await CommentsCollection.removeAsync({ _id: commentId });
  },
});
