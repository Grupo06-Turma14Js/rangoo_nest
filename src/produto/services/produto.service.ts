import { Produto, Objetivo } from './../entities/produto.entity';
import { CategoriaService } from './../../categoria/services/categoria.service';
import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, ILike, Repository, IsNull, Or } from "typeorm";

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    private categoriaService: CategoriaService,
  ) { }

  async findAll(): Promise<Produto[]> {
    const produtos = await this.produtoRepository.find({
      relations: { categoria: true, usuario: true },
    });
    if (produtos.length === 0) {
      throw new NotFoundException('Nenhum produto cadastrado!');
    }
    return produtos;
  }

  async findById(id: number): Promise<Produto> {
    if (!id || id <= 0 || isNaN(id)) {
      throw new BadRequestException('O ID do produto é inválido.');
    }
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: { categoria: true, usuario: true },
    });
    if (!produto) throw new NotFoundException('Produto não encontrado!');
    return produto;
  }

  async findAllByDescricao(descricao: string): Promise<Produto[]> {
    if (!descricao || descricao.trim().length === 0) {
      throw new BadRequestException('O termo de busca não pode estar vazio.');
    }
    const produtos = await this.produtoRepository.find({
      where: { descricao: ILike(`%${descricao}%`) },
      relations: { categoria: true, usuario: true },
    });
    if (produtos.length === 0) {
      throw new NotFoundException('Nenhum produto encontrado com essa descrição.');
    }
    return produtos;
  }

  async create(produto: Produto): Promise<Produto> {
    this.validarCamposProduto(produto);
    this.validarIMC(produto);
    if (!produto.categoria || !produto.categoria.id) {
      throw new BadRequestException('A categoria é obrigatória para cadastrar um produto.');
    }
    await this.categoriaService.findById(produto.categoria.id);
    return await this.produtoRepository.save(produto);
  }

  async update(produto: Produto): Promise<Produto> {
    if (!produto.id) throw new BadRequestException('ID do produto é obrigatório.');
    await this.findById(produto.id);
    this.validarCamposProduto(produto);
    this.validarIMC(produto);
    if (!produto.categoria || !produto.categoria.id) {
      throw new BadRequestException('A categoria vinculada é inválida ou obrigatória.');
    }
    await this.categoriaService.findById(produto.categoria.id);
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
    if (produtos.length === 0) {
      throw new NotFoundException('Nenhum produto disponível para análise de saúde.');
    }
    return produtos
      .map((produto) => {
        let score = 0;
        const nome = (produto.nome || '').toLowerCase();
        const descricao = (produto.descricao || '').toLowerCase();
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

  async findRecomendados(imc: number, objetivo: Objetivo): Promise<Produto[]> {
    if (!imc || imc <= 0) {
      throw new BadRequestException('IMC inválido. Deve ser um número maior que zero.');
    }
    if (!Object.values(Objetivo).includes(objetivo)) {
      throw new BadRequestException(
        `Objetivo inválido. Valores aceitos: ${Object.values(Objetivo).join(', ')}`
      );
    }

    const todos = await this.produtoRepository.find({
      where: { ativo: true },
      relations: { categoria: true, usuario: true },
    });

    return todos.filter((p) => {
      if (p.objetivo !== null && p.objetivo !== objetivo) return false;

      if (p.imcMin !== null && imc < Number(p.imcMin)) return false;
      if (p.imcMax !== null && imc > Number(p.imcMax)) return false;

      return true;
    });
  }


  private validarCamposProduto(produto: Produto): void {
    if (!produto.nome || produto.nome.trim().length === 0) {
      throw new BadRequestException('O nome do produto é obrigatório.');
    }
    if (produto.preco <= 0) {
      throw new BadRequestException('O preço do produto deve ser maior que zero.');
    }
    if (!produto.descricao || produto.descricao.trim().length < 5) {
      throw new BadRequestException('A descrição deve ter pelo menos 5 caracteres.');
    }
  }

  private validarIMC(produto: Produto): void {
    if (produto.imcMin !== null && produto.imcMin !== undefined && produto.imcMin <= 0) {
      throw new BadRequestException('imcMin deve ser maior que zero.');
    }
    if (produto.imcMax !== null && produto.imcMax !== undefined && produto.imcMax <= 0) {
      throw new BadRequestException('imcMax deve ser maior que zero.');
    }
    if (
      produto.imcMin !== null && produto.imcMin !== undefined &&
      produto.imcMax !== null && produto.imcMax !== undefined &&
      Number(produto.imcMin) >= Number(produto.imcMax)
    ) {
      throw new BadRequestException('imcMin deve ser menor que imcMax.');
    }
  }
}