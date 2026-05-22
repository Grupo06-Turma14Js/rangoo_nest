import {
  Body, Controller, Delete, Get, HttpCode, HttpStatus,
  Param, ParseEnumPipe, ParseFloatPipe, ParseIntPipe,
  Post, Put, Query, UseGuards,
} from "@nestjs/common";
import { ProdutoService } from "../services/produto.service";
import { Produto, Objetivo } from "../entities/produto.entity";
import { JwtAuthGuard } from "../../Auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Produto')
@UseGuards(JwtAuthGuard)
@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) { }

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
  @ApiQuery({ name: 'imc', type: Number, description: 'IMC do usuário (ex: 27.3)' })
  @ApiQuery({
    name: 'objetivo',
    enum: Objetivo,
    description: 'Objetivo nutricional selecionado pelo usuário',
  })
  findRecomendados(
    @Query('imc', ParseFloatPipe) imc: number,
    @Query('objetivo', new ParseEnumPipe(Objetivo)) objetivo: Objetivo,
  ): Promise<Produto[]> {
    return this.produtoService.findRecomendados(imc, objetivo);
  }

  @Get('/descricao/:descricao')
  @HttpCode(HttpStatus.OK)
  findByAllDescricao(@Param('descricao') descricao: string): Promise<Produto[]> {
    return this.produtoService.findAllByDescricao(descricao);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() produto: Produto) {
    return this.produtoService.create(produto);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() produto: Produto) {
    return this.produtoService.update(produto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.delete(id);
  }
}