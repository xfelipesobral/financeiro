import { CardRepository } from '../repository'

export class CardService extends CardRepository {}

export const card = new CardService()
