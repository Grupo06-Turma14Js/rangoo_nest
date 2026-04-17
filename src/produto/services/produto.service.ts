import { Produto } from './../entities/produto.entity';
import { CategoriaService } from './../../categoria/services/categoria.service';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, ILike, Repository } from "typeorm";

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
        private categoriaService:CategoriaService
    ) { }

    async findAll(): Promise<Produto[]> {
        return await this.produtoRepository.find({
            relations:{
                categoria: true,
                usuario: true
            }
        });
    }

    async findById(id: number): Promise<Produto> {

        const produto = await this.produtoRepository.findOne({
            where: {
                id
            },
            relations:{
                categoria: true,
                usuario: true
            }
        });

        if (!produto)
            throw new HttpException('Postagem não encontrada!', HttpStatus.NOT_FOUND);

        return produto;
    }

    async findAllByDescricao(descricao: string): Promise<Produto[]> {
        return await this.produtoRepository.find({
            where:{
                descricao: ILike(`%${descricao}%`)
            },
            relations:{
                categoria: true,
                usuario: true
            }
        })
    }

    async create(produto: Produto): Promise<Produto> {
       
      	await this.categoriaService.findById(produto.categoria.id)
            
        return await this.produtoRepository.save(produto);

    }

    async update(produto: Produto): Promise<Produto> {
        
		await this.findById(produto.id);

		await this.categoriaService.findById(produto.categoria.id)
                
		return await this.produtoRepository.save(produto);
    
    }

    async delete(id: number): Promise<DeleteResult> {
        
        await this.findById(id);

        return await this.produtoRepository.delete(id);

    }

    async findSaudaveis(): Promise<Produto[]> {
  const produtos = await this.produtoRepository.find({
    relations: ['categoria'],
  });

  return produtos
    .map((produto) => {
      let score = 0;

      const nome = produto.nome.toLowerCase();
      const descricao = produto.descricao.toLowerCase();

      if (nome.includes('salada') || descricao.includes('natural')) score += 3;
      if (nome.includes('grelhado') || descricao.includes('grelhado')) score += 2;

      if (nome.includes('frito') || descricao.includes('frita')) score -= 2;
      if (nome.includes('refrigerante') || descricao.includes('refrigerante')) score -= 3;
      if (nome.includes('hambúrguer') || descricao.includes('hambúrguer')) score -= 2;

      return { produto, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.produto);
}

    


}