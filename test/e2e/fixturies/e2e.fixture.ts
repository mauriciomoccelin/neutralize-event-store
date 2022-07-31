import { faker } from '@faker-js/faker';

export const genereteTenant = () => ({
  description: faker.lorem.sentence(),
  email: faker.internet.email(),
  secret: faker.internet.password(),
})

export const genereteEvent = (tenantId: String) => ({
  tenantId: tenantId,
  type: faker.lorem.slug(),
  dateTime: faker.date.recent(1),
  aggregateId: faker.lorem.slug(),
  data: {
    color: faker.color.human(),
    animal: faker.animal.dog()
  },
  metadata: [
    {
      key: faker.lorem.slug(),
      value: faker.lorem.words(),
    }
  ]
})