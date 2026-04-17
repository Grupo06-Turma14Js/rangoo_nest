import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Categoria } from "../entities/categoria.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  // Listar todas as categorias
  async findAll(): Promise<Categoria[]> {
    return this.categoriaRepository.find({
      relations: {
        produtos: true
      },
    });
  }

  // 🔎 Buscar categoria por ID
  async findById(id: number): Promise<Categoria> {
    
    let categoria = await this.categoriaRepository.findOne({
      where: {id},
            relations: {
               // produto: true
            }
    });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada!');
    }

    return categoria;
  }

  // Criar categoria
  async create(categoria: Categoria): Promise<Categoria> {
    return this.categoriaRepository.save(categoria);
  }

  //  Atualizar categoria
  async update(categoria: Categoria): Promise<Categoria> {
    
    await this.findById(categoria.id);

    return this.categoriaRepository.save(categoria);
  }

  // Deletar categoria
  async delete(id: number): Promise<any> {
    const buscaCategoria = await this.categoriaRepository.findOne({
        where: { id }
    });

    if (!buscaCategoria) {
        throw new NotFoundException('A Categoria que você está buscando não foi encontrada!');
    }

    await this.categoriaRepository.delete(id);

    
    return { mensagem: 'Categoria apagada com sucesso!' };
  }
}