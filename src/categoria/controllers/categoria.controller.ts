import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards
} from "@nestjs/common";

import { CategoriaService } from "../services/categoria.service";
import { Categoria } from "../entities/categoria.entity";

import { JwtAuthGuard } from "../../Auth/guard/jwt-auth.guard";

import {
  ApiTags,
  ApiBearerAuth
} from "@nestjs/swagger";

@ApiTags('Categoria')
@Controller('categorias')

export class CategoriaController {

  constructor(
    private readonly categoriaService: CategoriaService
  ) {}

  // ─────────────────────────────
  // ROTAS PÚBLICAS
  // ─────────────────────────────

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Categoria[]> {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Categoria> {
    return this.categoriaService.findById(id);
  }

  // ─────────────────────────────
  // ROTAS PROTEGIDAS
  // ─────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() categoria: Categoria
  ): Promise<Categoria> {
    return this.categoriaService.create(categoria);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(HttpStatus.OK)
  update(
    @Body() categoria: Categoria
  ): Promise<Categoria> {
    return this.categoriaService.update(categoria);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.categoriaService.delete(id);
  }
}