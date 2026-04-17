import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Produto } from "../entities/produto.entity";
import { ILike, Repository } from "typeorm";

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    //private categoriaService: CategoriaService
  ) {}

  // Listar todos os produtos
  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find({
        //categoria:  true,  
        //usuario: true
    });
  }

  // Buscar produto por ID
  async findById(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: {categoria: true},
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado!');
    }

    return produto;
  }


  async findAllByNome(nome: string): Promise <Produto[]> {
        return await this.produtoRepository.find({
            where: {
                nome: ILike(`%${nome}%`)
            }
        })
    }

  // Criar produto
  async create(produto: Produto): Promise<Produto> {
    return this.produtoRepository.save(produto);
  }

  // Atualizar produto
  async update(produto: Produto): Promise<Produto> {
    const buscaProduto = await this.produtoRepository.findOne({
        where: { id: produto.id }
    });
   
    if (!buscaProduto) {
        throw new NotFoundException('Produto não encontrado!');
    }

    return this.produtoRepository.save(produto);
  }

  // Deletar produto
  async delete(id: number): Promise<any> {
    const buscaProduto = await this.produtoRepository.findOne({
        where: { id }
    });

    if (!buscaProduto) {
        throw new NotFoundException('O produto que você está buscando não foi encontrado!');
    }

    await this.produtoRepository.delete(id);

    
    return { mensagem: 'Produto apagado com sucesso!' };
  }
}