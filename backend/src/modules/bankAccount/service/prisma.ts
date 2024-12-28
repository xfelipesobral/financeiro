import { BankAccount } from '@prisma/client'
import { prisma } from '../../db'

export class BankAccountModel {
	private prisma = prisma.bankAccount

	findAll(): Promise<BankAccount[]> {
		return this.prisma.findMany({
			include: {
				bank: true,
			}
		})
	}

	findById(id: string): Promise<BankAccount | null> {
		return this.prisma.findUnique({
			where: {
				id,
			},
			include: {
				bank: true,
			}
		})
	}
}
