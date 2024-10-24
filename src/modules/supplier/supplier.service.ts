import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { SupplierEntity } from "./entities/supplier.entity";
import { Repository } from "typeorm";
import {
  SupplementaryInformationDto,
  SupplierSignupDto,
} from "./dto/supplier.dto";
import { CategoryService } from "../category/category.service";
import { randomInt } from "crypto";
import { SupplierOTPEntity } from "./entities/otp.entity";
import { CheckOtpDto } from "../auth/dto/otp.dto";
import { JwtService } from "@nestjs/jwt";
import { PayloadType } from "../auth/types/payload";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { SupplierStatus } from "./enum/status.enum";

@Injectable({ scope: Scope.REQUEST })
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepository: Repository<SupplierEntity>,

    @InjectRepository(SupplierOTPEntity)
    private supplierOtpRepository: Repository<SupplierOTPEntity>,

    @Inject(REQUEST) private req: Request,

    private categoryService: CategoryService,

    private jwtService: JwtService
  ) {}

  async signup(signupDto: SupplierSignupDto) {
    const {
      categoryId,
      city,
      manager_family,
      manager_name,
      mobile,
      invite_code,
      store_name,
    } = signupDto;

    const supplier = await this.supplierRepository.findOneBy({ mobile });
    if (supplier) throw new ConflictException("supplier account already exist");
    let agent: SupplierEntity = null;
    if (invite_code) {
      agent = await this.supplierRepository.findOneBy({ invite_code });
    }
    const category = await this.categoryService.findOneById(categoryId);
    const mobileNumber = parseInt(mobile);
    const account = this.supplierRepository.create({
      manager_name,
      manager_family,
      mobile,
      city,
      agentId: agent?.id ?? null,
      store_name,
      categoryId: category.id,
      invite_code: mobileNumber.toString(32).toUpperCase(),
    });

    await this.supplierRepository.save(account);
    await this.createOtpForSupplier(account);
    return {
      message: "otp code send successfully",
    };
  }

  async checkOtp(otpDto: CheckOtpDto) {
    const { code, mobile } = otpDto;
    const now = new Date();
    const supplier = await this.supplierRepository.findOne({
      where: { mobile },
      relations: {
        otp: true,
      },
    });
    if (!supplier || !supplier?.otp)
      throw new UnauthorizedException("Not Found Account");
    const otp = supplier?.otp;
    if (otp?.code !== code)
      throw new UnauthorizedException("Otp code is incorrect");
    if (otp.expires_in < now)
      throw new UnauthorizedException("Otp Code is expired");
    if (!supplier.mobile_verify) {
      await this.supplierRepository.update(
        { id: supplier.id },
        {
          mobile_verify: true,
        }
      );
    }
    const { accessToken, refreshToken } = this.makeTokensForSupplier({
      id: supplier.id,
    });
    return {
      accessToken,
      refreshToken,
      message: "You logged-in successfully",
    };
  }

  async createOtpForSupplier(supplier: SupplierEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.supplierOtpRepository.findOneBy({
      supplierId: supplier.id,
    });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("otp code not expired");
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.supplierOtpRepository.create({
        code,
        expires_in: expiresIn,
        supplierId: supplier.id,
      });
    }
    otp = await this.supplierOtpRepository.save(otp);
    supplier.otpId = otp.id;
    await this.supplierRepository.save(supplier);
  }

  makeTokensForSupplier(payload: PayloadType) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "30d",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "1y",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<PayloadType>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === "object" && payload?.id) {
        const user = await this.supplierRepository.findOneBy({
          id: payload.id,
        });
        if (!user) {
          throw new UnauthorizedException("login on your account ");
        }
        return user;
      }
      throw new UnauthorizedException("login on your account ");
    } catch (error) {
      throw new UnauthorizedException("login on your account ");
    }
  }

  async saveSupplementaryInformation(infoDto: SupplementaryInformationDto) {
    const { id } = this.req.user;
    const { email, national_code } = infoDto;

    let supplier = await this.supplierRepository.findOneBy({ national_code });
    if (supplier && supplier.id !== id)
      throw new ConflictException("national code already used");

    supplier = await this.supplierRepository.findOneBy({ email });
    if (supplier && supplier.id !== id)
      throw new ConflictException("email already used");

    await this.supplierRepository.update(
      { id },
      { email, national_code, status: SupplierStatus.SupplimentaryInformation }
    );

    return { message: "updated information successfully" };
  }

  async UploadDocument(files: Express.Multer.File[]) {
    console.log(files);
    return files;
  }
}
