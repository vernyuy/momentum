import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'momentumStorage',
  access: (allow) => ({
    'public/*': [
      allow.guest.to(['read', 'write', 'delete']),
    ],
    'pictures/*': [
      allow.guest.to(['read', 'write', 'delete']),
    ],
  })
});