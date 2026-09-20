import { Injectable, NotFoundException } from '@nestjs/common';
import { Ticket } from './ticket.interface.js';

@Injectable()
export class TicketsService {
    private readonly tickets: Ticket[] = [
        {
            id: 1,
            subject: 'Cannot login to account',
            description: 'User cannot access the dashboard after login',
            priority: 'high',
            status: 'open',
            createdAt: '2026-09-15T10:00:00.000Z'
        },
        {
            id: 2,
            subject: 'Payment failed',
            description: 'Card payment fails at the checkout step.',
            priority: 'medium',
            status: 'open',
            createdAt: '2026-09-15T10:00:00.000Z'
        },
        {
            id: 3,
            subject: 'Invoice download not working',
            description: 'Invoice PDF download returns an empty file.',
            priority: 'low',
            status: 'closed',
            createdAt: '2026-09-15T12:45:00.000Z'
        }

    ];

    findAll() {
        return this.tickets;
    }

    findOne(id: number): Ticket | undefined {
        const ticket = this.tickets.find(ticket => ticket.id === id);

        if (!ticket) {
            throw new NotFoundException(`Ticket with ID ${id} not found`);
        }

        return ticket;
    }
}
