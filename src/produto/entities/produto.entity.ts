import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "../../categoria/entities/categoria.entity";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { ApiProperty } from "@nestjs/swagger";

export enum Objetivo {
  EMAGRECIMENTO = "emagrecimento",
  GANHO_MASSA = "ganho-massa",
  DIABETICO = "diabetico",
  SEM_LACTOSE = "sem-lactose",
  SEM_GLUTEN = "sem-gluten",
}

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
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  @ApiProperty()
  preco!: number;

  @IsNotEmpty()
  @Column({ default: true })
  @ApiProperty()
  ativo!: boolean;

  @IsNotEmpty()
  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true, default: null })
  @ApiProperty({ required: false, nullable: true })
  imcMin!: number | null;

  @IsNotEmpty()
  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true, default: null })
  @ApiProperty({ required: false, nullable: true })
  imcMax!: number | null;

  @IsNotEmpty()
  @Column({
    type: "enum",
    enum: Objetivo,
    nullable: true,
    default: null,
  })

  @ApiProperty({ enum: Objetivo, required: false, nullable: true })
  objetivo!: Objetivo | null;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos)
  @ApiProperty({ type: () => Categoria })
  categoria!: Categoria;

  @ManyToOne(() => Usuario, (usuario) => usuario.produto, {
    onDelete: "CASCADE",
  })
  @ApiProperty({ type: () => Usuario })
  usuario!: Usuario;

  @IsOptional()
  @IsString()
  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  foto!: string;
}