import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
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

   
    const existingAddresses = await this.addressRepository.find({
      where: { user: { id: user.id } },
    });

    // Regra de negócio número 4: Máximo de 2 endereços por conta
    if (existingAddresses.length >= 2) {
      throw new BadRequestException('Você já possui o máximo de 2 endereços cadastrados');
    }

    // Regra de negócio número 5: Não pode usar o mesmo CEP
    const cepExists = existingAddresses.some(addr => addr.zip === createAddressDto.zip);
    if (cepExists) {
      throw new ConflictException('Já existe um endereço cadastrado com este CEP');
    }

    // Regra de negócio número 6: Primeiro endereço sempre é padrão, ou força como padrão se solicitado
    const isFirstAddress = existingAddresses.length === 0;
    const shouldBeDefault = isFirstAddress || createAddressDto.is_default;

    // Se for definir como padrão, desmarcar outros
    if (shouldBeDefault) {
      await this.addressRepository.update(
        { user: { id: user.id }, isDefault: true },
        { isDefault: false },
      );
    }

    const address = this.addressRepository.create({
      street: createAddressDto.street,
      number: createAddressDto.number,
      city: createAddressDto.city,
      state: createAddressDto.state,
      zip: createAddressDto.zip,
      isDefault: shouldBeDefault,
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

    const userAddresses = await this.addressRepository.find({
      where: { user: { id: address.user.id } },
    });

    // REGRA 5: Não pode usar o mesmo CEP no update
    if (updateAddressDto.zip && updateAddressDto.zip !== address.zip) {
      const cepExists = userAddresses.some(
        addr => addr.id !== id && addr.zip === updateAddressDto.zip
      );
      if (cepExists) {
        throw new ConflictException('Já existe um endereço cadastrado com este CEP');
      }
    }

    // REGRA 6: Deve ter pelo menos um endereço padrão no update
    if (updateAddressDto.is_default === false && address.isDefault) {
      const otherDefaultExists = userAddresses.some(
        addr => addr.id !== id && addr.isDefault
      );
      if (!otherDefaultExists) {
        throw new BadRequestException('Você precisa ter pelo menos um endereço padrão. Marque outro endereço como padrão antes de desmarcar este.');
      }
    }

    if (updateAddressDto.is_default === true) {
      const otherAddresses = await this.addressRepository.find({
        where: { user: { id: address.user.id }, isDefault: true },
      });
      
      for (const otherAddress of otherAddresses) {
        if (otherAddress.id !== id) {
          otherAddress.isDefault = false;
          await this.addressRepository.save(otherAddress);
        }
      }
    }

    if (updateAddressDto.street !== undefined) address.street = updateAddressDto.street;
    if (updateAddressDto.number !== undefined) address.number = updateAddressDto.number;
    if (updateAddressDto.city !== undefined) address.city = updateAddressDto.city;
    if (updateAddressDto.state !== undefined) address.state = updateAddressDto.state;
    if (updateAddressDto.zip !== undefined) address.zip = updateAddressDto.zip;
    if (updateAddressDto.is_default !== undefined) address.isDefault = !!updateAddressDto.is_default;

    return this.addressRepository.save(address);
  }

  async remove(id: number): Promise<void> {
    const address = await this.findOne(id);
    
    // REGRA 6: Deve ter pelo menos um endereço padrão
    if (address.isDefault) {
      const userAddresses = await this.addressRepository.find({
        where: { user: { id: address.user.id } },
      });
      
      if (userAddresses.length === 1) {
        throw new BadRequestException('Você precisa ter pelo menos um endereço cadastrado');
      }
      
      const otherDefaultExists = userAddresses.some(
        addr => addr.id !== id && addr.isDefault
      );
      
      if (!otherDefaultExists) {
        throw new BadRequestException('Marque outro endereço como padrão antes de excluir este');
      }
    }
    
    await this.addressRepository.remove(address);
  }
}
