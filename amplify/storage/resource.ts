import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'momentumStorage',
  access: (allow) => ({
    'pictures/*': [
      allow.guest.to(['read', 'write'])
    ],
  })
});