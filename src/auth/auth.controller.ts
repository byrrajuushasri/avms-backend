import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import type { Request } from "express";

import { AuthService } from "./auth.service";

import { JwtAuthGuard } from "./jwt-auth.guard";

import { Roles } from "./roles.decorator";

import { RolesGuard } from "./roles.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // =========================================================
  // LOGIN
  // POST /auth/login
  // =========================================================

  @Post("login")
  async login(
    @Body()
    body: {
      login: string;
      password: string;
    },
  ) {
    return this.authService.login(
      body.login,
      body.password,
    );
  }

  // =========================================================
  // CURRENT USER
  // GET /auth/me
  // =========================================================

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    const user = req.user as any;

    return this.authService.getProfile(
      user.id,
    );
  }
// =========================================================
// FIRST SUPER ADMIN PASSWORD BOOTSTRAP
// TEMPORARY - REMOVE AFTER FIRST PASSWORD IS CREATED
// PATCH /auth/bootstrap-password/1
// =========================================================

@Patch("bootstrap-password/:id")
async bootstrapPassword(
  @Param("id", ParseIntPipe) id: number,

  @Body()
  body: {
    password: string;
  },
) {
  return this.authService.bootstrapPassword(
    id,
    body.password,
  );
}
  // =========================================================
  // SUPER ADMIN CREATE PASSWORD
  //
  // PATCH /auth/members/25/password
  // =========================================================

  @Patch("members/:id/password")
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles("super_admin")
  async createPassword(
    @Param("id", ParseIntPipe)
    id: number,

    @Body()
    body: {
      password: string;
    },
  ) {
    return this.authService.createPassword(
      id,
      body.password,
    );
  }

  // =========================================================
  // SUPER ADMIN UPDATE ROLE
  //
  // PATCH /auth/members/25/role
  // =========================================================

  @Patch("members/:id/role")
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles("super_admin")
  async updateRole(
    @Param("id", ParseIntPipe)
    id: number,

    @Body()
    body: {
      role: string;
    },
  ) {
    return this.authService.updateRole(
      id,
      body.role,
    );
  }


  // =========================================================
// LOGGED-IN USER CHANGE OWN PASSWORD
//
// PATCH /auth/change-password
// =========================================================

@Patch("change-password")
@UseGuards(JwtAuthGuard)
async changeMyPassword(
  @Req() req: Request,

  @Body()
  body: {
    currentPassword: string;
    newPassword: string;
  },
) {
  const user = req.user as any;

  return this.authService.changeMyPassword(
    user.id,
    body.currentPassword,
    body.newPassword,
  );
}
}