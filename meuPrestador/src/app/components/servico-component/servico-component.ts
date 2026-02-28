import { inject, Component } from '@angular/core';
import { ServicoService } from '../../services/Servico_service';
import { Servico } from '../../interfaces/Servico_interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-servico-component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servico-component.html',
  styleUrl: './servico-component.scss',
  standalone: true,
})
export class ServicoComponent {

  private servicoService: ServicoService = inject(ServicoService);

  lista_de_servicos$!: Observable<Servico[]>;
  servico: Servico = {} as Servico;

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.lista_de_servicos$ = this.servicoService.getServico_service();
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
