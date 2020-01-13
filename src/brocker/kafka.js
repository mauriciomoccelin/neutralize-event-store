import requestBrocker from './requests'
import integrationBrocker from './integrations'
import deliveryFailedBrocker from './delivery-failed'
import deliverySuccessBrocker from './delivery-success'

export default {
  start: async () => {
    await requestBrocker.start()
    await integrationBrocker.start()
    await deliveryFailedBrocker.start()
    await deliverySuccessBrocker.start()
  }
}
