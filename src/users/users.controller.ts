import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    console.log('=== GET PROFILE ===');
    console.log('req.user:', req.user);
    console.log('userId:', req.user.userId);
    const user = await this.usersService.findOne(req.user.userId);
    console.log('User found:', { id: user.id, email: user.email, isAdmin: user.isAdmin });
    const { password, ...result } = user;
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    const { password, ...result } = user;
    return result;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    const { password, ...result } = user;
    return result;
  }

  @Post('change-password')
  async changePassword(@Request() req, @Body() body: { currentPassword: string; newPassword: string }) {
    await this.usersService.changePassword(req.user.userId, body.currentPassword, body.newPassword);
    return { message: 'Senha alterada com sucesso' };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return { message: 'Usuário removido com sucesso' };
  }
}
