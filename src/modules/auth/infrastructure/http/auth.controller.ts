import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterDto } from '../../application/dtos/register.dto';
import { LoginDto } from '../../application/dtos/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly register: RegisterUseCase,
    private readonly login: LoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register owner user for a tenant' })
  registerUser(@Body() dto: RegisterDto) {
    return this.register.execute(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive JWT' })
  loginUser(@Body() dto: LoginDto) {
    return this.login.execute(dto);
  }
}
