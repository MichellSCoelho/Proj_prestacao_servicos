import { Component, inject } from '@angular/core';
import { ServicoService } from '../../services/Servico_service';
import { Servico } from '../../interfaces/Servico_interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-servico-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servico-component.html',
  styleUrl: './servico-component.scss',
})
export class ServicoComponent {

  private servicoService = inject(ServicoService);
  private router = inject(Router);

  lista_de_servicos$!: Observable<Servico[]>;
  servico: Servico = {} as Servico;

  mensagemSucesso: string = '';

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.lista_de_servicos$ = this.servicoService.getServico_service();
  }

  salvar() {

    if (!this.servico.nome || !this.servico.descricao || !this.servico.valor_base) {
      alert("Preencha todos os campos!");
      return;
    }

    this.servicoService
      .saveServico(this.servico)
      .subscribe(() => {

        this.mensagemSucesso = "Serviço cadastrado com Sucesso!";

        this.listar();

        // Limpa formulário
        this.servico = {} as Servico;

        // 🔥 Volta para Home após 2 segundos
        setTimeout(() => {
          this.router.navigate(['']);
        }, 2000);

      });
  }
}