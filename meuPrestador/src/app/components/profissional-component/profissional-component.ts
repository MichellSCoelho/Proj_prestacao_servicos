import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Profissional_service } from '../../services/Profissional_service';
import { ServicoService } from '../../services/Servico_service';

import { Profissional } from '../../interfaces/Profissional_interface';
import { Servico } from '../../interfaces/Servico_interface';

@Component({
  selector: 'app-profissional-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profissional-component.html',
  styleUrl: './profissional-component.scss',
})
export class ProfissionalComponent implements OnInit {

  private profissionalService = inject(Profissional_service);
  private servicoService = inject(ServicoService);

  servico_id!: number;

  lista_de_profissional: Profissional[] = [];
  lista_de_servicos: Servico[] = [];

  profissional: Profissional = {} as Profissional;

  ngOnInit(): void {
    this.servicoService
      .getServico_service()
      .subscribe((data: Servico[]) => {
        this.lista_de_servicos = data;
      });
  }

  filtrarPorServico(): void {
    this.profissionalService
      .getProfissionaisPorServico(this.servico_id)
      .subscribe((data: Profissional[]) => {
        this.lista_de_profissional = data;
      });
  }

  salvar(): void {
    this.profissionalService
      .saveProfissional(this.profissional)
      .subscribe(() => {
        this.profissional = {} as Profissional;
        if (this.servico_id) {
          this.filtrarPorServico();
        }
      });
  }
}
