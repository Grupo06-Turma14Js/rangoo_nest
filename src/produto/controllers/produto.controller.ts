import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";

import { ProdutoService } from "../services/produto.service";
import { Produto, Objetivo } from "../entities/produto.entity";

import { JwtAuthGuard } from "../../Auth/guard/jwt-auth.guard";

import {
  ApiBearerAuth,
  ApiQuery,
  ApiTags
} from "@nestjs/swagger";

@ApiTags('Produto')
@Controller('produtos')

export class ProdutoController {

  constructor(
    private readonly produtoService: ProdutoService
  ) {}

  // ─────────────────────────────
  // ROTAS PÚBLICAS
  // ─────────────────────────────

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.produtoService.findAll();
  }

  @Get('/lista/saudaveis')
  @HttpCode(HttpStatus.OK)
  findSaudaveis(): Promise<Produto[]> {
    return this.produtoService.findSaudaveis();
  }

  @Get('/recomendados')
  @HttpCode(HttpStatus.OK)

  @ApiQuery({
    name: 'imc',
    type: Number,
    description: 'IMC do usuário'
  })

  @ApiQuery({
    name: 'objetivo',
    enum: Objetivo,
    description: 'Objetivo nutricional'
  })

  findRecomendados(
    @Query('imc', ParseFloatPipe) imc: number,
    @Query('objetivo', new ParseEnumPipe(Objetivo))
    objetivo: Objetivo,
  ): Promise<Produto[]> {

    return this.produtoService.findRecomendados(
      imc,
      objetivo,
    );
  }

  @Get('/descricao/:descricao')
  @HttpCode(HttpStatus.OK)
  findByAllDescricao(
    @Param('descricao') descricao: string
  ): Promise<Produto[]> {

    return this.produtoService.findAllByDescricao(
      descricao
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.produtoService.findById(id);
  }

  // ─────────────────────────────
  // ROTAS PROTEGIDAS
  // ─────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() produto: Produto
  ) {

    console.log('Produto recebido:', produto);

    return this.produtoService.create(produto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  @HttpCode(HttpStatus.OK)
  update(
    @Body() produto: Produto
  ) {

    return this.produtoService.update(produto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('id', ParseIntPipe) id: number
  ) {

    return this.produtoService.delete(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/lote')
  @HttpCode(HttpStatus.CREATED)
  createLote(
    @Body() produtos: Produto[]
  ): Promise<Produto[]> {

    return Promise.all(
      produtos.map(p => this.produtoService.create(p))
    );
  }
}