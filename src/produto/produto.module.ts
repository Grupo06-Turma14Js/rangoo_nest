import { Module } from "@nestjs/common";
import { Produto } from "./entities/produto.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProdutoService } from "./services/produto.service";
import { ProdutoController } from "./controllers/produto.controller";
import { CategoriaModule } from "../categoria/categoria.module";


@Module({
  imports: [TypeOrmModule.forFeature([Produto]),
    CategoriaModule
  ],
  controllers: [ProdutoController],
  providers: [ProdutoService],
  exports: [],

})
export class ProdutoModule { }