import { BankAccount } from '@prisma/client'
import { prisma } from '../../db'

export class BankAccountModel {
	private prisma = prisma.bankAccount

	findById(id: string): Promise<BankAccount | null> {
		return this.prisma.findUnique({
			where: {
				id,
			},
		})
	}
}
