import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ProdutoService } from "../services/produto.service";
import { Produto } from "../entities/produto.entity";
import { JwtAuthGuard } from "../../Auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.findById(id);
  }

  @Get('/descricao/:descricao')
  @HttpCode(HttpStatus.OK)
  findByAllDescricao(@Param('descricao') descricao: string): Promise<Produto[]> {
    return this.produtoService.findAllByDescricao(descricao);
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

  @Get('/lista/saudaveis')
  findSaudaveis(): Promise<Produto[]> {
    return this.produtoService.findSaudaveis();
  }

}