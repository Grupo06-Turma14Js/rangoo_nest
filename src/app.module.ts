import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; 
import { ProdutoModule } from './produto/produto.module';
import { CategoriaModule } from './categoria/categoria.module';
import { AuthModule } from './Auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevService } from './data/services/dev.service'; 
import { ProdService } from './data/services/prod.service'; 

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      //DevService - Testar PC / ProdService - Testar no Render
      useClass: DevService, 
      imports: [ConfigModule],
    }),
    ProdutoModule,
    CategoriaModule,
    AuthModule,
    UsuarioModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
