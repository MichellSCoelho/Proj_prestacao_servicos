import { inject, Component } from '@angular/core';
import { ServicoService } from '../../services/Servico_service';
import { Servico } from '../../interfaces/Servico_interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-servico-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './servico-component.html',
  styleUrl: './servico-component.scss',
  standalone: true,
})
export class ServicoComponent {

  private servicoService: ServicoService = inject(ServicoService);

  lista_de_servicos: Servico[] = [];
  servico: Servico = {} as Servico;

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.servicoService
      .getServico_service()
      .subscribe((data: Servico[]) => {
        this.lista_de_servicos = data;
      });
  }

  salvar() {
    this.servicoService
      .saveServico(this.servico)
      .subscribe(() => {
        this.listar();
        this.servico = {} as Servico; // limpa formulário
      });
  }
}
