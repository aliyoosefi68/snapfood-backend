import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeEntity } from "../entities/type.entity";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { MenuTypeDto } from "../dto/menu-type.dto";

@Injectable({ scope: Scope.REQUEST })
export class MenuTypeService {
  constructor(
    @InjectRepository(TypeEntity)
    private typeRepository: Repository<TypeEntity>,
    @Inject(REQUEST) private req: Request
  ) {}

  async create(createDto: MenuTypeDto) {
    const { id } = this.req.user;
    const type = this.typeRepository.create({
      title: createDto.title,
      supplierId: id,
    });
    await this.typeRepository.save(type);

    return {
      message: "type created",
    };
  }
  async findAll() {
    const { id } = this.req.user;
    return await this.typeRepository.findAndCount({
      where: {
        supplierId: id,
      },
      order: { id: "DESC" },
    });
  }

  async findOneById(id: number) {
    const { id: supplierId } = this.req.user;
    const type = await this.typeRepository.findOneBy({ id, supplierId });
    if (!type) throw new NotFoundException("type not found");
    return type;
  }

  async remove(id: number) {
    await this.findOneById(id);
    await this.typeRepository.delete({ id });
    return {
      message: "delet type successfully",
    };
  }

  async update(id: number, typeDto: MenuTypeDto) {
    let type = await this.findOneById(id);
    const { title } = typeDto;
    if (title) type.title = title;
    await this.typeRepository.save(type);
    return {
      message: "updae type successfully",
    };
  }
}
