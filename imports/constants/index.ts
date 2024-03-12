import { Meteor } from "meteor/meteor";
interface Secret {
  oauth: {
    googleMapsApiKey: string;
    imgBBApiKey: string;
  };
  public: {
    oauth: {
      googleMapsApiKey: string;
      imgBBApiKey: string;
    };
  };
}
export const SECRETS = Meteor.settings as unknown as Secret;
export const MINIMUM_PASSWORD_LENGTH = 8;
export const MINIMUM_USERNAME_LENGTH = 8;

export enum Color {
  WHITE = "#FFFFFF",
  BLACK = "#000000",
  MUTCD_GREEN = "#006B54",
  MUTCD_YELLOW = "#FFCC00",
  DARK_ORANGE = "#F09000",
  ORANGE = "orange",
}

export const humanReadableTravelMode: Record<google.maps.TravelMode, string> = {
  DRIVING: "Driving",
  BICYCLING: "Bicycling",
  TRANSIT: "Transit",
  WALKING: "Walking",
};

export enum MUTCDFont {
  CLEARVIEW = "Clearview 4W",
  HWYGOTHIC = "Highway Gothic Wide",
}
