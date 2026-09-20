import { IsIn, IsOptional } from "class-validator";

export class FilterTicketsQuaryDto {

    @IsOptional()
    @IsIn(['high', 'medium', 'low'])
    priority?: 'high' | 'medium' | 'low';
    
    @IsOptional()
    @IsIn(['open', 'closed'])
    status?: 'open' | 'closed';

}
