import { Injectable } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private prismaService: PrismaService) {

    }

    async login(loginDto: LoginDto) {
        const user = await this.prismaService.user.findUnique({
            where: {email: loginDto.email},
    });

    if(!user) {
        throw new Error('Invalid Credentials');
    }

    const isPasswordValid = bcrypt.compareSync(
        loginDto.password,
        user.password,
    );

    if (!isPasswordValid) {
        throw new Error('Invalid Credentials');
    }

    const token = this.jwtService.sign({
        name: user.name,
        email: user.email,
    });

    return { access_token: token };
}}
