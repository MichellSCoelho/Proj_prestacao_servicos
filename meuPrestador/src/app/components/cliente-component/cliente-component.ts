import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteService } from '../../services/Cliente_service';
import { ClienteInterface } from '../../interfaces/Cliente_interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-component.html',
  styleUrl: './cliente-component.scss',
  standalone: true,
})
export class ClienteComponent {
  private clienteService: ClienteService = inject(ClienteService);

  lista_de_clientes$!: Observable<ClienteInterface[]>;

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.lista_de_clientes$ = this.clienteService.getCliente_service();
  }
  cliente: ClienteInterface = {} as ClienteInterface;

  salvar() {
    this.clienteService.saveClient(this.cliente).subscribe(() => {
      this.listar();
      this.cliente = {} as ClienteInterface;
    });
  }

};
