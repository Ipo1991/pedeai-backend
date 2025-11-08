import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const user = await this.userRepository.findOne({
      where: { id: createAddressDto.user_id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Regra 12: Se marcar como padrão, desmarcar outros endereços do usuário
    if (createAddressDto.is_default) {
      await this.addressRepository.update(
        { user: { id: user.id }, isDefault: true },
        { isDefault: false },
      );
    }

    const address = this.addressRepository.create({
      street: createAddressDto.street,
      number: createAddressDto.number,
      complement: createAddressDto.complement,
      neighborhood: createAddressDto.neighborhood,
      city: createAddressDto.city,
      state: createAddressDto.state,
      zip: createAddressDto.zip,
      isDefault: !!createAddressDto.is_default,
      user,
    });

    return this.addressRepository.save(address);
  }

  async findByUser(userId: number): Promise<Address[]> {
    return this.addressRepository.find({
      where: { user: { id: userId } },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(id);

    // Regra 13: Ao definir como padrão, desmarcar outros do mesmo usuário
    if (updateAddressDto.is_default) {
      await this.addressRepository.update(
        { user: { id: address.user.id }, isDefault: true },
        { isDefault: false },
      );
    }

    // Mapear campos explicitamente e converter is_default -> isDefault
    if (updateAddressDto.street !== undefined) address.street = updateAddressDto.street;
    if (updateAddressDto.number !== undefined) address.number = updateAddressDto.number;
    if (updateAddressDto.complement !== undefined) address.complement = updateAddressDto.complement;
    if (updateAddressDto.neighborhood !== undefined) address.neighborhood = updateAddressDto.neighborhood;
    if (updateAddressDto.city !== undefined) address.city = updateAddressDto.city;
    if (updateAddressDto.state !== undefined) address.state = updateAddressDto.state;
    if (updateAddressDto.zip !== undefined) address.zip = updateAddressDto.zip;
    if (updateAddressDto.is_default !== undefined) address.isDefault = !!updateAddressDto.is_default;

    return this.addressRepository.save(address);
  }

  async remove(id: number): Promise<void> {
    const address = await this.findOne(id);
    await this.addressRepository.remove(address);
  }
}
