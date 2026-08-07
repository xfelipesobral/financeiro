import { TransferRepository } from '../repository'

export class TransferService extends TransferRepository {}

export const transfer = new TransferService()
