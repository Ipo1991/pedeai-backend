import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('my')
  findAll(@Request() req) {
    return this.paymentsService.findAllByUser(req.user.sub);
  }

  @Post()
  create(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(req.user.sub, createPaymentDto);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    console.log('💳 PaymentsController.update: id =', id);
    console.log('💳 PaymentsController.update: userId =', req.user.sub);
    console.log('💳 PaymentsController.update: updatePaymentDto =', updatePaymentDto);
    return this.paymentsService.update(+id, req.user.sub, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.paymentsService.remove(+id, req.user.sub);
  }
}
