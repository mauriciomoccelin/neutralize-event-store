import requestBrocker from './requests'
import integrationBrocker from './integrations'

export default {
  start: async () => {
    await requestBrocker.start()
    await integrationBrocker.start()
  }
}
