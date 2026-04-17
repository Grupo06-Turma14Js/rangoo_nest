import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../Auth/Bcrypt/bcrypt';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ) { }

    async findByUsuario(usuario: string): Promise<Usuario | null> {
        if (!usuario || usuario.trim().length === 0) {
            throw new BadRequestException('O nome de usuário/e-mail deve ser informado.');
        }
        return await this.usuarioRepository.findOne({
            where: { usuario: usuario },
            relations: { produto: true }
        });
    }

    async findAll(): Promise<Usuario[]> {
        const usuarios = await this.usuarioRepository.find({
            relations: { produto: true }
        });
        if (usuarios.length === 0) {
            throw new NotFoundException('Não existem usuários cadastrados!');
        }
        return usuarios;
    }

    async findById(id: number): Promise<Usuario> {
        if (!id || id <= 0 || isNaN(id)) {
            throw new BadRequestException('ID do usuário inválido.');
        }
        const usuario = await this.usuarioRepository.findOne({
            where: { id },
            relations: { produto: true }
        });
        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado!');
        }
        return usuario;
    }

    async create(usuario: Usuario): Promise<Usuario> {
        this.validarCamposUsuario(usuario, true);
        const buscaUsuario = await this.findByUsuario(usuario.usuario);
        if (buscaUsuario) {
            throw new BadRequestException("O usuário já existe!");
        }
        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
        return await this.usuarioRepository.save(usuario);
    }

    async update(usuario: Usuario): Promise<Usuario> {
        if (!usuario.id) {
            throw new BadRequestException('O ID do usuário é obrigatório para atualização.');
        }
        await this.findById(usuario.id);
        this.validarCamposUsuario(usuario, false);
        const buscaUsuario = await this.findByUsuario(usuario.usuario);
        if (buscaUsuario && buscaUsuario.id !== usuario.id) {
            throw new BadRequestException('Este e-mail/usuário já está em uso por outra conta!');
        }
        if (usuario.senha) {
            usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
        }
        return await this.usuarioRepository.save(usuario);
    }

    private validarCamposUsuario(usuario: Usuario, isCreate: boolean): void {
        if (!usuario.nome || usuario.nome.trim().length < 3) {
            throw new BadRequestException('O nome do usuário deve ter pelo menos 3 caracteres.');
        }
        if (!usuario.usuario || !usuario.usuario.includes('@')) {
            throw new BadRequestException('Informe um e-mail válido para o campo usuário.');
        }
        if (isCreate && (!usuario.senha || usuario.senha.length < 8)) {
            throw new BadRequestException('A senha deve conter no mínimo 8 caracteres.');
        }
        if (!usuario.tipo) {
            throw new BadRequestException('O tipo do usuário é obrigatório (admin ou user).');
        }
        const tipoNormalizado = usuario.tipo.toLowerCase().trim();
        if (tipoNormalizado !== 'admin' && tipoNormalizado !== 'user') {
            throw new BadRequestException('O tipo de usuário deve ser "admin" ou "user".');
        }
        usuario.tipo = tipoNormalizado;
    }
}