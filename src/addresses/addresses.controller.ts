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
  ParseIntPipe,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto, @Request() req) {
    // Força usar o userId do token JWT
    createAddressDto.user_id = req.user.sub;
    return this.addressesService.create(createAddressDto);
  }

  @Get('my')
  findMy(@Request() req) {
    return this.addressesService.findByUser(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.addressesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    console.log('🔄 PATCH /addresses/:id called');
    console.log('   ID:', id);
    console.log('   Body:', JSON.stringify(updateAddressDto, null, 2));
    return this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.addressesService.remove(id);
  }
}
