import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Produto } from "../../produto/entities/produto.entity";

@Entity({ name: "tb_categorias" })
export class Categoria {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100, nullable: false })
  nome!: string;

  @Column({ length: 255, nullable: false })
  descricao!: string;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produtos!: Produto[];
}