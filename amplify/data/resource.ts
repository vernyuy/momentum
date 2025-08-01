import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
const schema = a.schema({
  Timezone: a.model({
    name: a.string()
  }).authorization((allow) => [allow.publicApiKey()]),
  Hero: a.model({
    isActive: a.boolean(),
    imageUrl: a.string(),
  }).authorization((allow) => [allow.publicApiKey()]),

  RegisterButton: a.model({
    text: a.string(),
    url: a.string(),
    style: a.string(),
    size: a.string(),
  }).authorization((allow) => [allow.publicApiKey()]),
  Momentum: a.model({
    mainHeading: a.string(),
    subHeading: a.string(),
    description: a.string(),
  }).authorization((allow) => [allow.publicApiKey()]),
  CarouselImage: a.model({
    alt: a.string(),
    caption: a.string(),
    url: a.string(),
  }).authorization((allow) => [allow.publicApiKey()]),
  WhyAttend: a.model({
    title: a.string(),
    description: a.string(),
    icon: a.string(),
  }).authorization((allow) => [allow.publicApiKey()]),
  Speaker: a.model({
    name: a.string(),
    title: a.string(),
    bio: a.string(),
    fullBio: a.string(),
    image: a.string(),
    position: a.integer()
  }).authorization((allow) => [allow.publicApiKey()]),
    Agenda: a.model({
      day: a.string(),
      time: a.string(),
      timezone: a.string(),
      title: a.string(),
      type: a.string(),
      emoji: a.string(),
      speaker: a.string(),
    }).authorization((allow) => [allow.publicApiKey()]),
    AirTravel: a.model({
      title: a.string(),
      airportName: a.string(),
      airportDescription: a.string(),
      conferenceInfo: a.string(),
      tip: a.string()
    }).authorization((allow) => [allow.publicApiKey()]),
    GroundTransport: a.model({
      title: a.string(),
      rentalCars: a.string(),
      rideServices: a.string(),
      recommendation: a.string()
    }).authorization((allow) => [allow.publicApiKey()]),
    Notice: a.model({
      content: a.string(),
    }).authorization((allow) => [allow.publicApiKey()]),
    Hotel: a.model({
      name: a.string(),
      address: a.string(), 
      description: a.string(),
      phone: a.string(),
    }).authorization((allow) => [allow.publicApiKey()]),
  ResortImages: a.model({
      url: a.string(),
      alt: a.string(),
      caption: a.string(),
    }).authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
