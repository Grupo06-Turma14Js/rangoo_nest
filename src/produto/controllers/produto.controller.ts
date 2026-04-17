import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ProdutoService } from "../services/produto.service";
import { Produto } from "../entities/produto.entity";

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  // Listar todos os produtos
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.produtoService.findAll();
  }

  // Buscar produto por ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produtoService.findById(id);
  }

  // Buscar Produto por Nome
    @Get('/nome/:nome')
    @HttpCode(HttpStatus.OK)
    findByAllNome(@Param('nome') nome: string): Promise<Produto[]>{
        return this.produtoService.findAllByNome(nome);
    }

  // Criar produto
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() produto: Produto) {
    return this.produtoService.create(produto);
  }

  // Atualizar produto
  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() produto:Produto) {
    return this.produtoService.update(produto);
  }

  // Deletar produto
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id', ParseIntPipe) id: number){
    return this.produtoService.delete(id);
  }
}