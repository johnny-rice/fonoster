import RabbitQConnector from './rabbitq_connector'
import logger from '@fonos/logger'

export default class EventsSender extends RabbitQConnector {
  constructor (address: string[], q: string) {
    super(address, q)
  }

  async sendToQ (event: string, payload: any) {
    logger.debug(
      `events.EventsSender.sendToQ [sent event to q => ${this.q}, event: ${event}, payload: ${payload}]`
    )
    await this.channelWrapper.sendToQueue(this.q, {
      name: event,
      data: payload
    })
  }
}