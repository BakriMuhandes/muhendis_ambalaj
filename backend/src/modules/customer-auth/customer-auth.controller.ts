import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from '../auth/dto/login.dto';
import { CustomerAuthService } from './customer-auth.service';

@Controller('customer-auth')
export class CustomerAuthController {
  constructor(private readonly customerAuthService: CustomerAuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.customerAuthService.login(dto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token zorunludur');
    }
    return this.customerAuthService.refresh(refreshToken);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() req: any) {
    return this.customerAuthService.me(req.user.sub);
  }
}