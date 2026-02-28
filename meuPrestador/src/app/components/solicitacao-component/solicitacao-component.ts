import { Component, OnInit } from '@angular/core';
import { Servico } from '../../interfaces/Servico_interface';
import { Profissional } from '../../interfaces/Profissional_interface';
import { ServicoService } from '../../services/Servico_service';
import { Profissional_service } from '../../services/Profissional_service';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-solicitacao-component',
  imports: [CommonModule, FormsModule, AsyncPipe],
  templateUrl: './solicitacao-component.html',
  styleUrl: './solicitacao-component.scss',
  standalone: true,
})
export class SolicitacaoComponent implements OnInit {

  lista_de_servicos$!: Observable<Servico[]>;
  lista_de_profissionais$!: Observable<Profissional[]>;

  servicoSelecionado: number | null = null;

  novaSolicitacao = {
    servico: null as number | null,
    profissional: null as number | null,
    status: 'Pendente'
  };

  mensagemSucesso: string = '';

  constructor(
    private servicoService: ServicoService,
    private profissionalService: Profissional_service,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.lista_de_servicos$ = this.servicoService.getServico_service();
  }

  onSelecionarServico(id: number) {
    this.servicoSelecionado = id;
    this.novaSolicitacao.servico = id;

    this.lista_de_profissionais$ = this.profissionalService.getProfissionaisPorServico(id);
  }

  enviarSolicitacao() {
    if (!this.novaSolicitacao.servico) {
      alert("Selecione um serviço!");
      return;
    }

    // Simulando envio (ou aqui você chama seu POST real)
    this.mensagemSucesso = "Solicitação enviada com Sucesso!";

    // Opcional: limpar formulário
    this.novaSolicitacao = {
      servico: null,
      profissional: null,
      status: 'Pendente'
    };

    // 🔥 Voltar para Home após 1 segundos
    setTimeout(() => {
      this.router.navigate(['']);
    }, 2000);

  }
}
