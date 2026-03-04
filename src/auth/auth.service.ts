import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  private validateLoginInput(loginDto: LoginDto) {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      loginDto.email || '',
    );

    if (!isEmailValid) {
      throw new BadRequestException('E-mail inválido.');
    }

    if (!loginDto.password || loginDto.password.length < 8) {
      throw new BadRequestException('Senha inválida.');
    }
  }

  async login(loginDto: LoginDto) {
    this.validateLoginInput(loginDto);
    const user = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return { access_token: token };
  }
}
