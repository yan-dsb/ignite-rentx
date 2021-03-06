import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { IUpdateRentalDTO } from '@modules/rentals/dtos/IUpdateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async create({
    user_id,
    car_id,
    expected_return_date
  }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      user_id,
      car_id,
      expected_return_date
    });

    await this.repository.save(rental);

    return rental;
  }

  async findOngoingRentalByCarID(car_id: string): Promise<Rental> {
    const rental = await this.repository.findOne({
      where: { car_id, end_date: null }
    });
    return rental;
  }

  async findOngoingRentalByUserID(user_id: string): Promise<Rental> {
    const rental = await this.repository.findOne({
      where: { user_id, end_date: null }
    });
    return rental;
  }

  async findByID(id: string): Promise<Rental> {
    const rental = await this.repository.findOne(id);
    return rental;
  }

  async update({ id, total, end_date }: IUpdateRentalDTO): Promise<void> {
    const rental = this.repository.create({
      id,
      total,
      end_date
    });

    await this.repository.save(rental);
  }

  async findAllByUserID(user_id: string): Promise<Rental[]> {
    const rentals = await this.repository.find({
      where: { user_id },
      relations: ['car']
    });

    return rentals;
  }
}

export { RentalsRepository };
