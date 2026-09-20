import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { CreateTicketDto } from './dto/create-ticket.dto.js';
import { FilterTicketsQuaryDto } from './dto/filter-tickets-quary.dto.js';

@Controller('tickets')
export class TicketsController {

    constructor(private readonly ticketsService: TicketsService) { }

    @Get()
    findAll(
        @Query() filters: FilterTicketsQuaryDto
    ) {
        return this.ticketsService.findAll(filters.status, filters.priority);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ticketsService.findOne(id);
    }

    @Post()
    create(@Body() createTicketDto: CreateTicketDto) {
        return this.ticketsService.create(createTicketDto);
    }
}
