import { Component, OnInit } from '@angular/core';
import { Servico } from '../../interfaces/Servico_interface';
import { Profissional } from '../../interfaces/Profissional_interface';
import { ServicoService } from '../../services/Servico_service';
import { Profissional_service } from '../../services/Profissional_service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-solicitacao-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitacao-component.html',
  styleUrl: './solicitacao-component.scss',
  standalone: true,
})
export class SolicitacaoComponent implements OnInit {

  lista_de_servicos: Servico[] = [];
  lista_de_profissionais: Profissional[] = [];

  servicoSelecionado: number | null = null;

  novaSolicitacao = {
    servico: null as number | null,
    profissional: null as number | null,
    status: 'Pendente'
  };

  constructor(
    private servicoService: ServicoService,
    private profissionalService: Profissional_service
  ) { }

  ngOnInit(): void {
    this.servicoService
      .getServico_service()
      .subscribe(data => this.lista_de_servicos = data);
  }

  onSelecionarServico(id: number) {
    this.servicoSelecionado = id;
    this.novaSolicitacao.servico = id;

    this.profissionalService
      .getProfissionaisPorServico(id)
      .subscribe(data => {
        this.lista_de_profissionais = data;
      });
  }

  enviarSolicitacao() {
    console.log("Solicitação enviada:", this.novaSolicitacao);

    if (!this.novaSolicitacao.servico || !this.novaSolicitacao.profissional) {
      alert("Preencha todos os campos!");
      return;
    }

    // Aqui depois você pode chamar o service POST
  }
}
