import { faker } from '@faker-js/faker';

export const genereteTenant = () => ({
  description: faker.lorem.sentence(),
  email: faker.internet.email(),
  secret: faker.internet.password(),
})