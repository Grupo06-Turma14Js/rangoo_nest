import { IsEmail, IsNotEmpty, MinLength } from "class-validator"
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Produto } from "../../produto/entities/produto.entity"
import { ApiProperty } from '@nestjs/swagger';



@Entity({ name: "tb_usuarios" })
export class Usuario {

    @PrimaryGeneratedColumn()
    id!: number

    @ApiProperty()
    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    nome!: string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    usuario!: string

    @ApiProperty()
    @MinLength(8)
    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    senha!: string

    @ApiProperty()
    @Column({ length: 5000 })
    foto!: string

    @ApiProperty()
    @IsNotEmpty()
    @Column({ length: 255, nullable: false })
    tipo!: string

    @ApiProperty()
    @OneToMany(() => Produto, (produto) => produto.usuario)
    produto!: Produto[];

}