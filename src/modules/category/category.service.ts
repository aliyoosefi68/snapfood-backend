import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { DeepPartial, Repository } from "typeorm";
import { S3Service } from "../s3/s3.service";
import { isBoolean, toBoolean } from "src/common/utility/functions.utils";
import { PaginationDto } from "src/common/dto/pagination.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utility/pagination.utils";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private s3Service: S3Service
  ) {}

  //create category
  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File
  ) {
    let { title, show, slug, parentId } = createCategoryDto;
    const { Location, Key } = await this.s3Service.uplodFiles(
      image,
      "snapfood-images"
    );
    const category = await this.findOneBySlug(slug);
    if (category) throw new ConflictException("category already exist");
    if (isBoolean(show)) {
      show = toBoolean(show);
    }
    let parent: CategoryEntity = null;
    if (+parentId !== 0 && !isNaN(parentId)) {
      parent = await this.findOneById(+parentId);
    }
    await this.categoryRepository.insert({
      title,
      slug,
      show,
      imageKey: Key,
      image: Location,
      parentId: parent?.id,
    });
    return { message: "Created category successfully" };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationSolver(
      paginationDto.page,
      paginationDto.limit
    );
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      relations: {
        parent: true,
      },
      select: {
        parent: {
          title: true,
          id: true,
        },
      },
      skip,
      take: limit,
      order: { id: "DESC" },
    });
    return { paginatin: paginationGenerator(count, page, limit), categories };
  }

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException("category not found");
    return category;
  }
  async findOneBySlug(slug: string) {
    return await this.categoryRepository.findOneBy({ slug });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File
  ) {
    const { title, show, slug, parentId } = updateCategoryDto;
    const category = await this.findOneById(id);

    if (!category) throw new NotFoundException("not found category");
    const updateObject: DeepPartial<CategoryEntity> = {};
    if (image) {
      const { Location, Key } = await this.s3Service.uplodFiles(
        image,
        "snapfood-images"
      );
      if (Location) {
        updateObject["image"] = Location;
        updateObject["imageKey"] = Key;

        if (category?.imageKey)
          await this.s3Service.deleteFiles(category?.imageKey);
      }
    }
    if (title) updateObject["title"] = title;
    if (show && isBoolean(show)) updateObject["show"] = toBoolean(show);

    if (+parentId !== 0 && !isNaN(parseInt(parentId.toString()))) {
      if (+parentId !== 0 && !isNaN(parentId)) {
        const category = await this.findOneById(+parentId);
        if (!category) throw new NotFoundException("not found category parent");
        updateObject["parentId"] = category.id;
      }
    }

    if (slug) {
      const category = await this.categoryRepository.findOneBy({ slug });
      if (category && category.id !== id)
        throw new ConflictException("category already exist");
      updateObject["slug"] = slug;
    }

    await this.categoryRepository.update({ id }, updateObject);
    return {
      message: "updated successfully",
    };
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        slug,
      },
      relations: {
        children: true,
      },
    });
    if (!category) throw new NotFoundException("notfound category");

    return {
      category,
    };
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException("not found category");
    await this.s3Service.deleteFiles(category.imageKey);
    await this.categoryRepository.delete({ id });
    return {
      message: "category delete seccessfully",
    };
  }
}
