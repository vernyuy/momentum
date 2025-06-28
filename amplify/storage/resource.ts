import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'momentumStorage',
  access: (allow) => ({
    'pictures/*': [
      allow.authenticated.to(['read','write']),
      allow.guest.to(['read', 'write'])
      allow.publicApiKey.to(['read', 'write'])
    ],
  })
});