import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    description: string;
    
    @IsIn(['low', 'medium', 'high'])
    @IsNotEmpty()
    priority: 'low' | 'medium' | 'high';
}
