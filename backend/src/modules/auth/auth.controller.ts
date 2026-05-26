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
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token zorunludur');
    }
    return this.authService.refresh(refreshToken);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'employee')
  me(@Req() req: any) {
    return this.authService.me(req.user.sub);
  }
}