import { Component } from '@angular/core';
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
export class SolicitacaoComponent {

  lista_de_servicos: Servico[] = [];
  lista_de_profissionais: Profissional[] = [];

  servicoSelecionado!: number;

  constructor(
    private servicoService: ServicoService,
    private profissionalService: Profissional_service
  ) { }

  ngOnInit() {
    this.servicoService
      .getServico_service()
      .subscribe(data => this.lista_de_servicos = data);
  }

  onSelecionarServico(id: number) {
    this.servicoSelecionado = id;

    this.profissionalService
      .getProfissionaisPorServico(id)
      .subscribe(data => {
        this.lista_de_profissionais = data;
      });
  }

}
