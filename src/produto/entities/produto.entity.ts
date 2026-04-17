import { IsNotEmpty } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "../../categoria/entities/categoria.entity";
import { Usuario } from "../../usuario/entities/usuario.entity";

@Entity({ name: "tb_produtos" })
export class Produto {


    @PrimaryGeneratedColumn()
    id!: number;

    @IsNotEmpty()
    @Column({ length: 100, nullable: false })
    nome!: string;

    @IsNotEmpty()
    @Column({ length: 1000, nullable: false })
    descricao!: string;

    @IsNotEmpty()
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    preco!: number;

    @IsNotEmpty()
    @Column({ default: true })
    ativo!: boolean;


    @ManyToOne(() => Categoria, (categoria) => categoria.produtos)
    categoria!: Categoria;

    @ManyToOne(() => Usuario, (usuario) => usuario.produto, {
        onDelete: "CASCADE"
    })
    usuario!: Usuario




}

