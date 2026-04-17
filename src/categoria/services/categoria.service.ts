import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Categoria } from "../entities/categoria.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) { }

  async findAll(): Promise<Categoria[]> {
    const categorias = await this.categoriaRepository.find({
      relations: {
        produtos: true
      },
    });
    if (categorias.length === 0) {
      throw new NotFoundException('Não existem categorias cadastradas!');
    }
    return categorias;
  }

  async findById(id: number): Promise<Categoria> {
    if (!id || id <= 0 || isNaN(id)) {
      throw new BadRequestException('O ID fornecido é inválido.');
    }
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: { produtos: true }
    });
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada!');
    }
    return categoria;
  }

  async create(categoria: Categoria): Promise<Categoria> {
    if (!categoria.descricao || categoria.descricao.trim().length === 0) {
      throw new BadRequestException('A descrição da categoria é obrigatória.');
    }

    if (categoria.descricao.length < 3) {
      throw new BadRequestException('A descrição deve ter no mínimo 3 caracteres.');
    }
    const buscaCategoria = await this.categoriaRepository.findOne({
      where: { descricao: categoria.descricao }
    });
    if (buscaCategoria) {
      throw new BadRequestException('Já existe uma categoria com este nome.');
    }
    return this.categoriaRepository.save(categoria);
  }

  async update(categoria: Categoria): Promise<Categoria> {
    if (!categoria.id) {
      throw new BadRequestException('O ID da categoria é necessário para atualização.');
    }
    await this.findById(categoria.id);
    if (categoria.descricao !== undefined) {
      if (categoria.descricao.trim().length === 0) {
        throw new BadRequestException('A descrição não pode ser vazia.');
      }
      const duplicada = await this.categoriaRepository.findOne({
        where: { descricao: categoria.descricao }
      });
      if (duplicada && duplicada.id !== categoria.id) {
        throw new BadRequestException('Outra categoria já utiliza este nome.');
      }
    }
    return this.categoriaRepository.save(categoria);
  }

  async delete(id: number): Promise<any> {
    const categoria = await this.findById(id);
    if (categoria.produtos && categoria.produtos.length > 0) {
      throw new BadRequestException('Não é possível excluir uma categoria que possui produtos vinculados.');
    }
    await this.categoriaRepository.delete(id);
    return { mensagem: 'Categoria apagada com sucesso!' };
  }
}