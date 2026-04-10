import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/infrastructure/guards/jwt-auth.guard';
import { OpenOrResumeSessionUseCase } from '../../application/use-cases/open-or-resume-session.use-case';
import { CloseSessionUseCase } from '../../application/use-cases/close-session.use-case';
import { JoinSessionDto } from '../../application/dtos/join-session.dto';

@ApiTags('Sessions')
@Controller()
export class SessionController {
  constructor(
    private readonly openOrResume: OpenOrResumeSessionUseCase,
    private readonly closeSession: CloseSessionUseCase,
  ) {}

  @Post('sessions/join/:qrToken')
  @ApiOperation({ summary: 'Join or resume a session by scanning QR code (public, PWA)' })
  join(@Param('qrToken') qrToken: string, @Body() dto: JoinSessionDto) {
    return this.openOrResume.execute(qrToken, dto);
  }

  @Post('tenants/:tenantId/sessions/:sessionId/close')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close a session and free the table (dashboard)' })
  close(@Param('tenantId') tenantId: string, @Param('sessionId') sessionId: string) {
    return this.closeSession.execute(sessionId, tenantId);
  }
}
