import { IsNotEmpty } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "../../categoria/entities/categoria.entity";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "tb_produtos" })
export class Produto {

    @PrimaryGeneratedColumn()
    @ApiProperty()
    id!: number;

    @IsNotEmpty()
    @Column({ length: 100, nullable: false })
    @ApiProperty()
    nome!: string;

    @IsNotEmpty()
    @Column({ length: 1000, nullable: false })
    @ApiProperty()
    descricao!: string;

    @IsNotEmpty()
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    @ApiProperty()
    preco!: number;

    @IsNotEmpty()
    @Column({ default: true })
    @ApiProperty()
    ativo!: boolean;

    @ManyToOne(() => Categoria, (categoria) => categoria.produtos)
    @ApiProperty({ type: () => Categoria })
    categoria!: Categoria;

    @ManyToOne(() => Usuario, (usuario) => usuario.produto, {
        onDelete: "CASCADE"
    })

    @ApiProperty({ type: () => Usuario })
    usuario!: Usuario
}